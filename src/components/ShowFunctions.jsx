import cornerstone from 'cornerstone-core';
import cornerstoneMath from "cornerstone-math";
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import hammer from 'hammerjs';
import { getImageByArchive, getImageByPath } from '../services/GetImage.js';
import { getNotesByImage } from '../services/GetNote.js';

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.external.Hammer = hammer;

export const ShowFunctions = (archive_id, setProgress, setProgressMessage, setIsLoading, setDicomData, setCurrentImage, setTotalImages) => {

    let fileList;
    let imageListDownload;
    let imageList;
    let originalPixels;
    let currentImageId = 0;
    const note = 'ArrowAnnotate';
    

    const stack = { currentImageIdIndex: 0, imageIds: [], };
    const annotations = { currentImageId, imageIds: [], states: [] };

    let element = document.getElementById('dicomImage');
    /*document.getElementById('applyMean3x3').addEventListener('click', () => applyMaskToAllImages('mean', 3));
    document.getElementById('applyMean5x5').addEventListener('click', () => applyMaskToAllImages('mean', 5));
    document.getElementById('applyMedian3x3').addEventListener('click', () => applyMaskToAllImages('median', 3));
    document.getElementById('applyMax').addEventListener('click', () => applyMaskToAllImages('max', 3));
    document.getElementById('applyMin').addEventListener('click', () => applyMaskToAllImages('min', 3));
    document.getElementById('applyMode').addEventListener('click', () => applyMaskToAllImages('mode', 3));
    document.getElementById('applyKuwahara').addEventListener('click', () => applyMaskToAllImages('kuwahara', 5));
    document.getElementById('applyTomitaTsuji').addEventListener('click', () => applyMaskToAllImages('tomitaTsuji', 5));
    document.getElementById('applyNegaoMatsuyama').addEventListener('click', () => applyMaskToAllImages('negaoMatsuyama', 5));
    document.getElementById('applySomboonkaew').addEventListener('click', () => applyMaskToAllImages('somboonkaew', 5));
    document.getElementById('applyH1').addEventListener('click', () => applyMaskToAllImages('h1', 3));
    document.getElementById('applyH2').addEventListener('click', () => applyMaskToAllImages('h2', 3));
    document.getElementById('applyM1').addEventListener('click', () => applyMaskToAllImages('m1', 3));
    document.getElementById('applyM2').addEventListener('click', () => applyMaskToAllImages('m2', 3));
    document.getElementById('applyM3').addEventListener('click', () => applyMaskToAllImages('m3', 3));*/
    document.getElementById('pseudo').addEventListener('click', () => applyPseudoColor());
    document.getElementById('sharpness').addEventListener('change', () => applyEffects());
    document.getElementById('gama').addEventListener('change', () => applyEffects());

    document.getElementById('reset').addEventListener('click', resetOriginalPixels);
    document.getElementById('show').addEventListener('click', () => getDicomData());

    const initialize = async () => {

        try {

            setIsLoading(true);
            setProgressMessage('Carregando imagens...');
            setProgress(0);

            fileList = await fetchData();
            const totalFiles = fileList.length;
            setCurrentImage(1);
            setTotalImages(totalFiles);

            const promises = fileList.map(async (file, index) => {
                const imageBlob = await getImageByPath(file.image_path);
                setProgress((prev) => Math.min(prev + (90 / totalFiles), 90));
                return imageBlob;
            });

            const imageBlobs = await Promise.all(promises);

            imageListDownload = new Set();

            imageBlobs.forEach(dcmData => {
                const blob = new Blob([dcmData]);
                imageListDownload.add(blob);
            })


            imageList = Array.from(imageListDownload);
            originalPixels = Array.from(imageListDownload);

            cornerstone.enable(element);
            element.addEventListener('wheel', handleMouseWheel);
            currentImageId = 0;
            stack.imageIds = [];
            annotations.imageIds = [];

            for (let i = 0; i < fileList.length; i++) {
                stack.imageIds.push(i);
                annotations.imageIds.push(i);
                annotations.states.push(await fetchNotesByImage(fileList[i].image_id));
            }

            cornerstoneTools.addStackStateManager(element, ['stack']);
            cornerstoneTools.addToolState(element, 'stack', stack);

            const apiTool = cornerstoneTools[`${note}Tool`];
            cornerstoneTools.addTool(apiTool);

            cornerstoneTools.setToolActive(note, { mouseButtonMask: null })
            updateImage(currentImageId);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }

    };

    const fetchData = async () => {
        try {
            const data = await getImageByArchive(archive_id);
            return data;
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    };

    const fetchNotesByImage = async (image_id) => {
        try {
            const data = await getNotesByImage(image_id);
            return data;
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    };

    const handleMouseWheel = (event) => {
        if (fileList.length === 0) return
        if (currentImageId >= 0 && currentImageId < fileList.length) {
            if (event.wheelDelta < 0 || event.detail > 0) {
                if (currentImageId > 0) {
                    currentImageId--;
                }
            } else {
                if (currentImageId < fileList.length - 1 && currentImageId >= 0) {
                    currentImageId++;
                }
            }
        } else {
            if (currentImageId < 0) {
                currentImageId = 0;
            }

            if (currentImageId == fileList.length) {
                currentImageId = fileList.length - 1;
            }
        }
        updateImage(currentImageId);
    };

    function updateImage(newImageId) {
        cornerstoneTools.clearToolState(element, note);
        currentImageId = newImageId;

        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(imageList[currentImageId]);
        cornerstone.loadImage(imageId).then(function (image) {
            const viewport = cornerstone.getDefaultViewportForImage(element, image);
            cornerstone.displayImage(element, image, viewport);
            loadAnnotations(currentImageId);
            applyPseudoColor();
            setCurrentImage(newImageId + 1);
            setProgress(100);
            setIsLoading(false);
        })
        
    }

    function loadAnnotations(imageId) {

        if (annotations.states[imageId]) {
            for (const annotation of annotations.states[imageId]) {
                
                cornerstoneTools.addToolState(element, note, annotation);
                console.log( annotation.handles.textBox);
            }
        }
    }

    //Filtros MEDIA 3X3 e MEDIA 5X5
    const applyMeanFilter = (pixelData, rows, columns, size) => {
        const filteredData = new Uint16Array(pixelData.length);
        const halfSize = Math.floor(size / 2);

        for (let r = halfSize; r < rows - halfSize; r++) {
            for (let c = halfSize; c < columns - halfSize; c++) {
                let sum = 0;
                let count = 0;
                for (let i = -halfSize; i <= halfSize; i++) {
                    for (let j = -halfSize; j <= halfSize; j++) {
                        sum += pixelData[(r + i) * columns + (c + j)];
                        count++;
                    }
                }
                filteredData[r * columns + c] = sum / count;
            }
        }

        // Copiando as bordas
        for (let r = 0; r < rows; r++) {
            for (let b = 0; b < halfSize; b++) {
                filteredData[r * columns + b] = pixelData[r * columns + b];  // Primeiras colunas
                filteredData[r * columns + (columns - 1 - b)] = pixelData[r * columns + (columns - 1 - b)];  // Últimas colunas
            }
        }

        for (let c = 0; c < columns; c++) {
            for (let b = 0; b < halfSize; b++) {
                filteredData[b * columns + c] = pixelData[b * columns + c];  // Primeiras linhas
                filteredData[(rows - 1 - b) * columns + c] = pixelData[(rows - 1 - b) * columns + c];  // Últimas linhas
            }
        }

        return filteredData;
    };

    //Filtros MEDIANA 3X3 e MEDIANA 5X5
    const applyMedianFilter = (pixelData, rows, columns, size) => {
        const filteredData = new Uint16Array(pixelData.length);
        const halfSize = Math.floor(size / 2);

        for (let r = halfSize; r < rows - halfSize; r++) {
            for (let c = halfSize; c < columns - halfSize; c++) {
                const windowValues = [];
                for (let i = -halfSize; i <= halfSize; i++) {
                    for (let j = -halfSize; j <= halfSize; j++) {
                        windowValues.push(pixelData[(r + i) * columns + (c + j)]);
                    }
                }

                windowValues.sort((a, b) => a - b);
                const medianIndex = Math.floor(windowValues.length / 2);

                filteredData[r * columns + c] = windowValues[medianIndex];
            }
        }

        // Copiando as bordas
        for (let r = 0; r < rows; r++) {
            for (let b = 0; b < halfSize; b++) {
                filteredData[r * columns + b] = pixelData[r * columns + b];  // Primeiras colunas
                filteredData[r * columns + (columns - 1 - b)] = pixelData[r * columns + (columns - 1 - b)];  // Últimas colunas
            }
        }

        for (let c = 0; c < columns; c++) {
            for (let b = 0; b < halfSize; b++) {
                filteredData[b * columns + c] = pixelData[b * columns + c];  // Primeiras linhas
                filteredData[(rows - 1 - b) * columns + c] = pixelData[(rows - 1 - b) * columns + c];  // Últimas linhas
            }
        }

        return filteredData;
    };

    //Filtro MAXIMO
    const applyMaxFilter = (pixelData, rows, columns, size) => {
        const filteredData = new Uint16Array(pixelData.length);
        const halfSize = Math.floor(size / 2);

        for (let r = halfSize; r < rows - halfSize; r++) {
            for (let c = halfSize; c < columns - halfSize; c++) {
                const windowValues = [];
                for (let i = -halfSize; i <= halfSize; i++) {
                    for (let j = -halfSize; j <= halfSize; j++) {
                        windowValues.push(pixelData[(r + i) * columns + (c + j)]);
                    }
                }

                filteredData[r * columns + c] = Math.max(...windowValues);
            }
        }

        // Copiando as bordas
        for (let r = 0; r < rows; r++) {
            for (let b = 0; b < halfSize; b++) {
                filteredData[r * columns + b] = pixelData[r * columns + b];  // Primeiras colunas
                filteredData[r * columns + (columns - 1 - b)] = pixelData[r * columns + (columns - 1 - b)];  // Últimas colunas
            }
        }

        for (let c = 0; c < columns; c++) {
            for (let b = 0; b < halfSize; b++) {
                filteredData[b * columns + c] = pixelData[b * columns + c];  // Primeiras linhas
                filteredData[(rows - 1 - b) * columns + c] = pixelData[(rows - 1 - b) * columns + c];  // Últimas linhas
            }
        }

        return filteredData;
    };

    //Filtro MINIMO
    const applyMinFilter = (pixelData, rows, columns, size) => {
        const filteredData = new Uint16Array(pixelData.length);
        const halfSize = Math.floor(size / 2);

        for (let r = halfSize; r < rows - halfSize; r++) {
            for (let c = halfSize; c < columns - halfSize; c++) {
                const windowValues = [];
                for (let i = -halfSize; i <= halfSize; i++) {
                    for (let j = -halfSize; j <= halfSize; j++) {
                        windowValues.push(pixelData[(r + i) * columns + (c + j)]);
                    }
                }

                filteredData[r * columns + c] = Math.min(...windowValues);
            }
        }

        // Copiando as bordas
        for (let r = 0; r < rows; r++) {
            for (let b = 0; b < halfSize; b++) {
                filteredData[r * columns + b] = pixelData[r * columns + b];  // Primeiras colunas
                filteredData[r * columns + (columns - 1 - b)] = pixelData[r * columns + (columns - 1 - b)];  // Últimas colunas
            }
        }

        for (let c = 0; c < columns; c++) {
            for (let b = 0; b < halfSize; b++) {
                filteredData[b * columns + c] = pixelData[b * columns + c];  // Primeiras linhas
                filteredData[(rows - 1 - b) * columns + c] = pixelData[(rows - 1 - b) * columns + c];  // Últimas linhas
            }
        }

        return filteredData;
    };

    //Filtro MODA
    const applyModeFilter = (pixelData, rows, columns, size) => {
        const filteredData = new Uint16Array(pixelData.length);
        const halfSize = Math.floor(size / 2);

        for (let r = halfSize; r < rows - halfSize; r++) {
            for (let c = halfSize; c < columns - halfSize; c++) {
                const windowValues = [];
                for (let i = -halfSize; i <= halfSize; i++) {
                    for (let j = -halfSize; j <= halfSize; j++) {
                        windowValues.push(pixelData[(r + i) * columns + (c + j)]);
                    }
                }

                const value = calculateMode(windowValues);

                filteredData[r * columns + c] = value;
            }
        }

        // Copiando as bordas
        for (let r = 0; r < rows; r++) {
            for (let b = 0; b < halfSize; b++) {
                filteredData[r * columns + b] = pixelData[r * columns + b];  // Primeiras colunas
                filteredData[r * columns + (columns - 1 - b)] = pixelData[r * columns + (columns - 1 - b)];  // Últimas colunas
            }
        }

        for (let c = 0; c < columns; c++) {
            for (let b = 0; b < halfSize; b++) {
                filteredData[b * columns + c] = pixelData[b * columns + c];  // Primeiras linhas
                filteredData[(rows - 1 - b) * columns + c] = pixelData[(rows - 1 - b) * columns + c];  // Últimas linhas
            }
        }

        return filteredData;
    };

    const calculateMode = (values) => {
        const frequencyMap = new Map();
        let maxFreq = 0;
        let mode = values[0];

        for (const value of values) {
            const frequency = (frequencyMap.get(value) || 0) + 1;
            frequencyMap.set(value, frequency);

            if (frequency > maxFreq) {
                maxFreq = frequency;
                mode = value;
            }
        }

        return mode;
    };

    //Filtro KUWAHARA
    const applyKuwaharaFilter = (pixelData, rows, columns, size) => {
        const filteredData = new Uint16Array(pixelData.length);
        const halfSize = Math.floor(size / 2);

        // Aplica o filtro Kuwahara na região central da imagem (excluindo as bordas)
        for (let r = halfSize; r < rows - halfSize; r++) {
            for (let c = halfSize; c < columns - halfSize; c++) {
                const regions = [[], [], [], []];

                for (let i = -halfSize; i <= 0; i++) {
                    for (let j = -halfSize; j <= 0; j++) {
                        regions[0].push(pixelData[(r + i) * columns + (c + j)]);
                    }
                    for (let j = 0; j <= halfSize; j++) {
                        regions[1].push(pixelData[(r + i) * columns + (c + j)]);
                    }
                }
                for (let i = 0; i <= halfSize; i++) {
                    for (let j = -halfSize; j <= 0; j++) {
                        regions[2].push(pixelData[(r + i) * columns + (c + j)]);
                    }
                    for (let j = 0; j <= halfSize; j++) {
                        regions[3].push(pixelData[(r + i) * columns + (c + j)]);
                    }
                }

                const variances = regions.map(region => {
                    const mean = region.reduce((sum, value) => sum + value, 0) / region.length;
                    return region.reduce((sum, value) => sum + (value - mean) ** 2, 0) / region.length;
                });

                const minVarianceIndex = variances.indexOf(Math.min(...variances));
                const meanValue = regions[minVarianceIndex].reduce((sum, value) => sum + value, 0) / regions[minVarianceIndex].length;

                filteredData[r * columns + c] = meanValue;
            }
        }

        // Copia as bordas sem alterações
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < halfSize; c++) {
                filteredData[r * columns + c] = pixelData[r * columns + c];  // Primeiras colunas
                filteredData[r * columns + (columns - 1 - c)] = pixelData[r * columns + (columns - 1 - c)];  // Últimas colunas
            }
        }

        for (let c = 0; c < columns; c++) {
            for (let r = 0; r < halfSize; r++) {
                filteredData[r * columns + c] = pixelData[r * columns + c];  // Primeiras linhas
                filteredData[(rows - 1 - r) * columns + c] = pixelData[(rows - 1 - r) * columns + c];  // Últimas linhas
            }
        }

        return filteredData;
    };

    //Filtro TOMITA E TSUJI
    const applyTomitaTsujiFilter = (pixelData, rows, columns, size) => {
        const filteredData = new Uint16Array(pixelData.length);
        const halfSize = Math.floor(size / 2);

        // Função para calcular a média e a variância de uma sub-região
        const calculateMeanAndVariance = (region) => {
            const mean = region.reduce((sum, value) => sum + value, 0) / region.length;
            const variance = region.reduce((sum, value) => sum + (value - mean) ** 2, 0) / region.length;
            return { mean, variance };
        };

        // Aplica o filtro Tomita e Tsuji na região central da imagem (excluindo as bordas)
        for (let r = halfSize; r < rows - halfSize; r++) {
            for (let c = halfSize; c < columns - halfSize; c++) {
                const regions = [[], [], [], [], [], [], [], []];

                for (let i = -halfSize; i <= 0; i++) {
                    for (let j = -halfSize; j <= 0; j++) {
                        regions[0].push(pixelData[(r + i) * columns + (c + j)]);
                        regions[4].push(pixelData[(r + i) * columns + (c + halfSize + j)]);
                        regions[6].push(pixelData[(r + halfSize + i) * columns + (c + j)]);
                    }
                    for (let j = 0; j <= halfSize; j++) {
                        regions[1].push(pixelData[(r + i) * columns + (c + j)]);
                        regions[5].push(pixelData[(r + i) * columns + (c - halfSize + j)]);
                    }
                }
                for (let i = 0; i <= halfSize; i++) {
                    for (let j = -halfSize; j <= 0; j++) {
                        regions[2].push(pixelData[(r + i) * columns + (c + j)]);
                        regions[7].push(pixelData[(r - halfSize + i) * columns + (c + j)]);
                    }
                    for (let j = 0; j <= halfSize; j++) {
                        regions[3].push(pixelData[(r + i) * columns + (c + j)]);
                    }
                }

                // Calcula a média e a variância de cada sub-região
                const meansAndVariances = regions.map(calculateMeanAndVariance);

                // Encontra a sub-região com a menor variância
                const minVarianceRegion = meansAndVariances.reduce((minRegion, currentRegion) =>
                    currentRegion.variance < minRegion.variance ? currentRegion : minRegion
                );

                // Define o valor do pixel central como a média da sub-região com menor variância
                filteredData[r * columns + c] = minVarianceRegion.mean;
            }
        }

        // Copia as bordas sem alterações
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < halfSize; c++) {
                filteredData[r * columns + c] = pixelData[r * columns + c];  // Primeiras colunas
                filteredData[r * columns + (columns - 1 - c)] = pixelData[r * columns + (columns - 1 - c)];  // Últimas colunas
            }
        }

        for (let c = 0; c < columns; c++) {
            for (let r = 0; r < halfSize; r++) {
                filteredData[r * columns + c] = pixelData[r * columns + c];  // Primeiras linhas
                filteredData[(rows - 1 - r) * columns + c] = pixelData[(rows - 1 - r) * columns + c];  // Últimas linhas
            }
        }

        return filteredData;
    };

    //Filtro NEGAO E MATSUYAMA
    const applyNagaoMatsuyamaFilter = (pixelData, rows, columns, size) => {
        const filteredData = new Uint16Array(pixelData.length);
        const halfSize = Math.floor(size / 2);

        // Função para calcular média e variância de uma região
        const calculateMeanAndVariance = (region) => {
            const mean = region.reduce((sum, value) => sum + value, 0) / region.length;
            const variance = region.reduce((sum, value) => sum + (value - mean) ** 2, 0) / region.length;
            return { mean, variance };
        };

        // Loop para percorrer cada pixel da imagem
        for (let r = halfSize; r < rows - halfSize; r++) {
            for (let c = halfSize; c < columns - halfSize; c++) {
                // Captura as regiões ao redor do pixel (r, c)
                const matrix = [];
                for (let i = r - halfSize; i <= r + halfSize; i++) {
                    const row = [];
                    for (let j = c - halfSize; j <= c + halfSize; j++) {
                        row.push(pixelData[i * columns + j]);
                    }
                    matrix.push(row);
                }

                // Obtém as regiões de interesse para o filtro Nagao e Matsuyama
                const regions = getRegionsForNagaoMatsuyama(matrix, size);

                // Calcula média e variância para cada região
                const meansAndVariances = regions.map(calculateMeanAndVariance);

                // Encontra a região com menor variância
                const minVarianceRegion = meansAndVariances.reduce((minRegion, currentRegion) =>
                    currentRegion.variance < minRegion.variance ? currentRegion : minRegion
                );

                // Atribui o valor médio da região com menor variância ao pixel atual
                filteredData[r * columns + c] = Math.round(minVarianceRegion.mean); // Arredonda para o valor inteiro mais próximo
            }
        }

        // Copia as bordas sem alterações
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < halfSize; c++) {
                filteredData[r * columns + c] = pixelData[r * columns + c];  // Primeiras colunas
                filteredData[r * columns + (columns - 1 - c)] = pixelData[r * columns + (columns - 1 - c)];  // Últimas colunas
            }
        }

        for (let c = 0; c < columns; c++) {
            for (let r = 0; r < halfSize; r++) {
                filteredData[r * columns + c] = pixelData[r * columns + c];  // Primeiras linhas
                filteredData[(rows - 1 - r) * columns + c] = pixelData[(rows - 1 - r) * columns + c];  // Últimas linhas
            }
        }

        return filteredData;
    };

    // Função para obter as regiões 3x3 ao redor de um pixel na matriz 2D
    const getRegionsForNagaoMatsuyama = (matrix, size) => {
        const regions = [];
        const positions = [
            { dr: 0, dc: 0 },   // Região 5 (Central)
            { dr: -1, dc: 0 },  // Região 2 (Norte)
            { dr: 1, dc: 0 },   // Região 6 (Sul)
            { dr: 0, dc: -1 },  // Região 4 (Oeste)
            { dr: 0, dc: 1 },   // Região 7 (Leste)
            { dr: -1, dc: -1 }, // Região 1 (Noroeste)
            { dr: -1, dc: 1 },  // Região 3 (Nordeste)
            { dr: 1, dc: -1 },  // Região 8 (Sudoeste)
            { dr: 1, dc: 1 }    // Região 9 (Sudeste)
        ];

        const halfSize = Math.floor(size / 2);

        positions.forEach(pos => {
            const region = [];
            const centerValue = matrix[halfSize][halfSize]; // Pixel central na matriz 2D

            const pr = halfSize + pos.dr;
            const pc = halfSize + pos.dc;

            // Verifica se a posição calculada está dentro dos limites da matriz
            if (pr >= 0 && pr < size && pc >= 0 && pc < size) {
                // Adiciona os valores da região à lista
                for (let i = pr - 1; i <= pr + 1; i++) {
                    for (let j = pc - 1; j <= pc + 1; j++) {
                        region.push(matrix[i][j]);
                    }
                }
                regions.push(region);
            }
        });

        return regions;
    };

    //Filtro SOMBOONKAEW
    const applySomboonkaewFilter = (pixelData, rows, columns, size) => {
        const filteredData = new Uint16Array(pixelData.length);
        const halfSize = Math.floor(size / 2);

        // Loop para percorrer cada pixel da imagem
        for (let r = halfSize; r < rows - halfSize; r++) {
            for (let c = halfSize; c < columns - halfSize; c++) {
                let sum = 0;
                let weightSum = 0;

                // Loop para calcular a média ponderada dos pixels vizinhos
                for (let i = -halfSize; i <= halfSize; i++) {
                    for (let j = -halfSize; j <= halfSize; j++) {
                        const pixelValue = pixelData[(r + i) * columns + (c + j)];
                        const weight = 1; // Ponderação igual para todos os vizinhos, pode ser ajustada conforme necessário
                        sum += pixelValue * weight;
                        weightSum += weight;
                    }
                }

                // Calcula o valor médio ponderado
                const averageValue = Math.round(sum / weightSum);

                // Atribui o valor médio ponderado ao pixel atual na imagem filtrada
                filteredData[r * columns + c] = averageValue;
            }
        }

        // Copia as bordas sem alterações
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < halfSize; c++) {
                filteredData[r * columns + c] = pixelData[r * columns + c];  // Primeiras colunas
                filteredData[r * columns + (columns - 1 - c)] = pixelData[r * columns + (columns - 1 - c)];  // Últimas colunas
            }
        }

        for (let c = 0; c < columns; c++) {
            for (let r = 0; r < halfSize; r++) {
                filteredData[r * columns + c] = pixelData[r * columns + c];  // Primeiras linhas
                filteredData[(rows - 1 - r) * columns + c] = pixelData[(rows - 1 - r) * columns + c];  // Últimas linhas
            }
        }

        return filteredData;
    };

    //Filtro H1
    const applyH1Filter = (pixelData, rows, columns, size) => {
        const filteredData = new Uint16Array(pixelData.length);
        const halfSize = Math.floor(size / 2);
        const mask = [0, -1, 0,
            -1, 4, -1,
            0, -1, 0];

        for (let r = halfSize; r < rows - halfSize; r++) {
            for (let c = halfSize; c < columns - halfSize; c++) {
                const windowValues = [];
                for (let i = -halfSize; i <= halfSize; i++) {
                    for (let j = -halfSize; j <= halfSize; j++) {
                        windowValues.push(pixelData[(r + i) * columns + (c + j)]);
                    }
                }
                let filteredValue = applyMask(mask, windowValues);

                // Normalização para o intervalo de 0 a 255
                filteredValue = Math.max(0, Math.min(255, filteredValue));

                filteredData[r * columns + c] = filteredValue;
            }
        }

        // Copiando as bordas
        for (let r = 0; r < rows; r++) {
            for (let b = 0; b < halfSize; b++) {
                filteredData[r * columns + b] = pixelData[r * columns + b];  // Primeiras colunas
                filteredData[r * columns + (columns - 1 - b)] = pixelData[r * columns + (columns - 1 - b)];  // Últimas colunas
            }
        }

        for (let c = 0; c < columns; c++) {
            for (let b = 0; b < halfSize; b++) {
                filteredData[b * columns + c] = pixelData[b * columns + c];  // Primeiras linhas
                filteredData[(rows - 1 - b) * columns + c] = pixelData[(rows - 1 - b) * columns + c];  // Últimas linhas
            }
        }

        return filteredData;
    };

    //Filtro H2
    const applyH2Filter = (pixelData, rows, columns, size) => {
        const filteredData = new Uint16Array(pixelData.length);
        const halfSize = Math.floor(size / 2);
        const mask = [-1, -1, -1,
        -1, 8, -1,
        -1, -1, -1];

        for (let r = halfSize; r < rows - halfSize; r++) {
            for (let c = halfSize; c < columns - halfSize; c++) {
                const windowValues = [];
                for (let i = -halfSize; i <= halfSize; i++) {
                    for (let j = -halfSize; j <= halfSize; j++) {
                        windowValues.push(pixelData[(r + i) * columns + (c + j)]);
                    }
                }
                let filteredValue = applyMask(mask, windowValues);

                // Normalização para o intervalo de 0 a 255
                filteredValue = Math.max(0, Math.min(255, filteredValue));

                filteredData[r * columns + c] = filteredValue;
            }
        }

        // Copiando as bordas
        for (let r = 0; r < rows; r++) {
            for (let b = 0; b < halfSize; b++) {
                filteredData[r * columns + b] = pixelData[r * columns + b];  // Primeiras colunas
                filteredData[r * columns + (columns - 1 - b)] = pixelData[r * columns + (columns - 1 - b)];  // Últimas colunas
            }
        }

        for (let c = 0; c < columns; c++) {
            for (let b = 0; b < halfSize; b++) {
                filteredData[b * columns + c] = pixelData[b * columns + c];  // Primeiras linhas
                filteredData[(rows - 1 - b) * columns + c] = pixelData[(rows - 1 - b) * columns + c];  // Últimas linhas
            }
        }

        return filteredData;
    };

    //Filtro M1
    const applyM1Filter = (pixelData, rows, columns, size) => {
        const filteredData = new Uint16Array(pixelData.length);
        const halfSize = Math.floor(size / 2);
        const mask = [-1, -1, -1,
        -1, 9, -1,
        -1, -1, -1];

        for (let r = halfSize; r < rows - halfSize; r++) {
            for (let c = halfSize; c < columns - halfSize; c++) {
                const windowValues = [];
                for (let i = -halfSize; i <= halfSize; i++) {
                    for (let j = -halfSize; j <= halfSize; j++) {
                        windowValues.push(pixelData[(r + i) * columns + (c + j)]);
                    }
                }
                let filteredValue = applyMask(mask, windowValues);

                // Normalização para o intervalo de 0 a 255
                filteredValue = Math.max(0, Math.min(255, filteredValue));

                filteredData[r * columns + c] = filteredValue;
            }
        }

        // Copiando as bordas
        for (let r = 0; r < rows; r++) {
            for (let b = 0; b < halfSize; b++) {
                filteredData[r * columns + b] = pixelData[r * columns + b];  // Primeiras colunas
                filteredData[r * columns + (columns - 1 - b)] = pixelData[r * columns + (columns - 1 - b)];  // Últimas colunas
            }
        }

        for (let c = 0; c < columns; c++) {
            for (let b = 0; b < halfSize; b++) {
                filteredData[b * columns + c] = pixelData[b * columns + c];  // Primeiras linhas
                filteredData[(rows - 1 - b) * columns + c] = pixelData[(rows - 1 - b) * columns + c];  // Últimas linhas
            }
        }

        return filteredData;
    };

    //Filtro M2
    const applyM2Filter = (pixelData, rows, columns, size) => {
        const filteredData = new Uint16Array(pixelData.length);
        const halfSize = Math.floor(size / 2);
        const mask = [1, -2, 1,
            -2, 5, -2,
            1, -2, 1];

        for (let r = halfSize; r < rows - halfSize; r++) {
            for (let c = halfSize; c < columns - halfSize; c++) {
                const windowValues = [];
                for (let i = -halfSize; i <= halfSize; i++) {
                    for (let j = -halfSize; j <= halfSize; j++) {
                        windowValues.push(pixelData[(r + i) * columns + (c + j)]);
                    }
                }
                let filteredValue = applyMask(mask, windowValues);

                // Normalização para o intervalo de 0 a 255
                filteredValue = Math.max(0, Math.min(255, filteredValue));

                filteredData[r * columns + c] = filteredValue;
            }
        }

        // Copiando as bordas
        for (let r = 0; r < rows; r++) {
            for (let b = 0; b < halfSize; b++) {
                filteredData[r * columns + b] = pixelData[r * columns + b];  // Primeiras colunas
                filteredData[r * columns + (columns - 1 - b)] = pixelData[r * columns + (columns - 1 - b)];  // Últimas colunas
            }
        }

        for (let c = 0; c < columns; c++) {
            for (let b = 0; b < halfSize; b++) {
                filteredData[b * columns + c] = pixelData[b * columns + c];  // Primeiras linhas
                filteredData[(rows - 1 - b) * columns + c] = pixelData[(rows - 1 - b) * columns + c];  // Últimas linhas
            }
        }

        return filteredData;
    };

    //Filtro M3
    const applyM3Filter = (pixelData, rows, columns, size) => {
        const filteredData = new Uint16Array(pixelData.length);
        const halfSize = Math.floor(size / 2);
        const mask = [0, -1, 0,
            -1, 5, -1,
            0, -1, 0];

        for (let r = halfSize; r < rows - halfSize; r++) {
            for (let c = halfSize; c < columns - halfSize; c++) {
                const windowValues = [];
                for (let i = -halfSize; i <= halfSize; i++) {
                    for (let j = -halfSize; j <= halfSize; j++) {
                        windowValues.push(pixelData[(r + i) * columns + (c + j)]);
                    }
                }
                let filteredValue = applyMask(mask, windowValues);

                // Normalização para o intervalo de 0 a 255
                filteredValue = Math.max(0, Math.min(255, filteredValue));

                filteredData[r * columns + c] = filteredValue;
            }
        }

        // Copiando as bordas
        for (let r = 0; r < rows; r++) {
            for (let b = 0; b < halfSize; b++) {
                filteredData[r * columns + b] = pixelData[r * columns + b];  // Primeiras colunas
                filteredData[r * columns + (columns - 1 - b)] = pixelData[r * columns + (columns - 1 - b)];  // Últimas colunas
            }
        }

        for (let c = 0; c < columns; c++) {
            for (let b = 0; b < halfSize; b++) {
                filteredData[b * columns + c] = pixelData[b * columns + c];  // Primeiras linhas
                filteredData[(rows - 1 - b) * columns + c] = pixelData[(rows - 1 - b) * columns + c];  // Últimas linhas
            }
        }

        return filteredData;
    };

    //Filtro PSEUDOCOR
    const applyPseudoColor = async () => {
        const canvas = document.getElementById('canvas');

        if (canvas != null) {
            const dicomFileBuffer = await imageList[currentImageId].arrayBuffer();
            const byteArray = new Uint8Array(dicomFileBuffer);
            const dataSet = dicomParser.parseDicom(byteArray);
            const pixelDataElement = dataSet.elements.x7fe00010;
            const dataOffset = pixelDataElement.dataOffset;
            const length = pixelDataElement.length;

            const pixelData = new Uint16Array(dicomFileBuffer, dataOffset, length / 2);
            const rows = dataSet.uint16('x00280010');
            const columns = dataSet.uint16('x00280011');

            canvas.width = columns;
            canvas.height = rows;
            const ctx = canvas.getContext('2d');
            const imageData = ctx.createImageData(columns, rows);

            for (let i = 0; i < pixelData.length; i++) {
                const pixel = pixelData[i];
                const [r, g, b] = pseudoColor(pixel)
                imageData.data[i * 4] = r;
                imageData.data[i * 4 + 1] = g;
                imageData.data[i * 4 + 2] = b;
                imageData.data[i * 4 + 3] = 255;
            }

            ctx.putImageData(imageData, 0, 0)
        }
        
    }

    const pseudoColor = (value) => {
        let r, g, b;
        switch (value) {
            case 0:   //               0-R, 1-G, 2-B
                r = 0;
                g = 0;
                b = 0;
                break;
            case 1:

                r = 0;
                g = 0;
                b = 5;

                break;
            case 2:

                r = 0;
                g = 0;
                b = 10;

                break;
            case 3:

                r = 0;
                g = 0;
                b = 15;

                break;
            case 4:

                r = 0;
                g = 0;
                b = 20;

                break;
            case 5:

                r = 0;
                g = 0;
                b = 25;

                break;
            case 6:

                r = 0;
                g = 0;
                b = 30;

                break;
            case 7:

                r = 0;
                g = 0;
                b = 35;

                break;
            case 8:

                r = 0;
                g = 0;
                b = 40;

                break;
            case 9:

                r = 0;
                g = 0;
                b = 45;

                break;
            case 10:

                r = 0;
                g = 0;
                b = 50;

                break;
            case 11:

                r = 0;
                g = 0;
                b = 55;

                break;
            case 12:

                r = 0;
                g = 0;
                b = 60;

                break;
            case 13:

                r = 0;
                g = 0;
                b = 65;

                break;
            case 14:

                r = 0;
                g = 0;
                b = 70;

                break;
            case 15:

                r = 0;
                g = 0;
                b = 75;

                break;
            case 16:

                r = 0;
                g = 0;
                b = 80;

                break;
            case 17:

                r = 0;
                g = 0;
                b = 85;

                break;
            case 18:

                r = 0;
                g = 0;
                b = 90;

                break;
            case 19:

                r = 0;
                g = 0;
                b = 95;

                break;
            case 20:

                r = 0;
                g = 0;
                b = 100;

                break;
            case 21:

                r = 0;
                g = 0;
                b = 105;

                break;
            case 22:

                r = 0;
                g = 0;
                b = 110;

                break;
            case 23:

                r = 0;
                g = 0;
                b = 115;

                break;
            case 24:

                r = 0;
                g = 0;
                b = 120;

                break;
            case 25:

                r = 0;
                g = 0;
                b = 125;

                break;
            case 26:

                r = 0;
                g = 0;
                b = 130;

                break;
            case 27:

                r = 0;
                g = 0;
                b = 135;

                break;
            case 28:

                r = 0;
                g = 0;
                b = 140;

                break;
            case 29:

                r = 0;
                g = 0;
                b = 145;

                break;
            case 30:

                r = 0;
                g = 0;
                b = 150;

                break;
            case 31:

                r = 0;
                g = 0;
                b = 155;

                break;
            case 32:

                r = 0;
                g = 0;
                b = 160;

                break;
            case 33:

                r = 0;
                g = 0;
                b = 165;

                break;
            case 34:

                r = 0;
                g = 0;
                b = 170;

                break;
            case 35:

                r = 0;
                g = 0;
                b = 175;

                break;
            case 36:

                r = 0;
                g = 0;
                b = 180;

                break;
            case 37:

                r = 0;
                g = 0;
                b = 185;

                break;
            case 38:

                r = 0;
                g = 0;
                b = 190;

                break;
            case 39:

                r = 0;
                g = 0;
                b = 195;

                break;
            case 40:

                r = 0;
                g = 0;
                b = 200;

                break;
            case 41:

                r = 0;
                g = 0;
                b = 205;

                break;
            case 42:

                r = 0;
                g = 0;
                b = 210;

                break;
            case 43:

                r = 0;
                g = 0;
                b = 215;

                break;
            case 44:

                r = 0;
                g = 0;
                b = 220;

                break;
            case 45:

                r = 0;
                g = 0;
                b = 225;

                break;
            case 46:

                r = 0;
                g = 0;
                b = 230;

                break;
            case 47:

                r = 0;
                g = 0;
                b = 235;

                break;
            case 48:

                r = 0;
                g = 0;
                b = 240;

                break;
            case 49:

                r = 0;
                g = 0;
                b = 245;

                break;
            case 50:

                r = 0;
                g = 0;
                b = 250;

                break;
            case 51:

                r = 0;
                g = 0;
                b = 255;

                break;
            case 52:

                r = 0;
                g = 3;
                b = 250;

                break;
            case 53:

                r = 0;
                g = 6;
                b = 245;

                break;
            case 54:

                r = 0;
                g = 9;
                b = 240;

                break;
            case 55:

                r = 0;
                g = 12;
                b = 235;

                break;
            case 56:

                r = 0;
                g = 15;
                b = 230;

                break;
            case 57:

                r = 0;
                g = 18;
                b = 225;

                break;
            case 58:

                r = 0;
                g = 21;
                b = 220;

                break;
            case 59:

                r = 0;
                g = 24;
                b = 215;

                break;
            case 60:

                r = 0;
                g = 27;
                b = 210;

                break;
            case 61:

                r = 0;
                g = 30;
                b = 205;

                break;
            case 62:

                r = 0;
                g = 33;
                b = 200;

                break;
            case 63:

                r = 0;
                g = 36;
                b = 195;

                break;

            //////////////////////////////////////////////////////////
            case 64:

                r = 0;
                g = 39;
                b = 190;

                break;
            case 65:

                r = 0;
                g = 42;
                b = 185;

                break;
            case 66:

                r = 0;
                g = 45;
                b = 180;

                break;
            case 67:

                r = 0;
                g = 48;
                b = 175;

                break;
            case 68:

                r = 0;
                g = 51;
                b = 170;

                break;
            case 69:

                r = 0;
                g = 54;
                b = 165;

                break;
            case 70:

                r = 0;
                g = 57;
                b = 160;

                break;
            case 71:

                r = 0;
                g = 60;
                b = 155;

                break;
            case 72:

                r = 0;
                g = 63;
                b = 150;

                break;
            case 73:

                r = 0;
                g = 66;
                b = 145;

                break;
            case 74:

                r = 0;
                g = 69;
                b = 140;

                break;
            case 75:

                r = 0;
                g = 72;
                b = 135;

                break;
            case 76:

                r = 0;
                g = 75;
                b = 130;

                break;
            case 77:

                r = 0;
                g = 78;
                b = 125;

                break;
            case 78:

                r = 0;
                g = 81;
                b = 120;

                break;
            case 79:

                r = 0;
                g = 84;
                b = 115;

                break;
            case 80:

                r = 0;
                g = 87;
                b = 110;

                break;
            case 81:

                r = 0;
                g = 90;
                b = 105;

                break;
            case 82:

                r = 0;
                g = 93;
                b = 100;

                break;
            case 83:

                r = 0;
                g = 96;
                b = 95;

                break;
            case 84:

                r = 0;
                g = 99;
                b = 90;

                break;
            case 85:

                r = 0;
                g = 102;
                b = 85;

                break;
            case 86:

                r = 0;
                g = 105;
                b = 80;

                break;
            case 87:

                r = 0;
                g = 108;
                b = 75;

                break;
            case 88:

                r = 0;
                g = 111;
                b = 70;

                break;
            case 89:

                r = 0;
                g = 114;
                b = 65;

                break;
            case 90:

                r = 0;
                g = 117;
                b = 60;

                break;
            case 91:

                r = 0;
                g = 120;
                b = 55;

                break;
            case 92:

                r = 0;
                g = 123;
                b = 50;

                break;
            case 93:

                r = 0;
                g = 126;
                b = 45;

                break;
            case 94:

                r = 0;
                g = 129;
                b = 40;

                break;
            case 95:

                r = 0;
                g = 132;
                b = 35;

                break;
            case 96: ///////////daki///////////////

                r = 0;
                g = 135;
                b = 30;

                break;
            case 97:

                r = 0;
                g = 138;
                b = 25;

                break;
            case 98:

                r = 0;
                g = 141;
                b = 20;

                break;
            case 99:

                r = 0;
                g = 144;
                b = 15;

                break;
            case 100:

                r = 0;
                g = 147;
                b = 10;

                break;
            case 101:

                r = 0;
                g = 150;
                b = 5;

                break;
            case 102:

                r = 0;
                g = 153;
                b = 0;

                break;
            case 103:

                r = 5;
                g = 150;
                b = 0;

                break;
            case 104:

                r = 10;
                g = 147;
                b = 0;

                break;
            case 105:

                r = 15;
                g = 144;
                b = 0;

                break;
            case 106:

                r = 20;
                g = 141;
                b = 0;

                break;
            case 107:

                r = 25;
                g = 138;
                b = 0;

                break;
            case 108:

                r = 30;
                g = 135;
                b = 0;

                break;
            case 109:

                r = 35;
                g = 132;
                b = 0;

                break;
            case 110:

                r = 40;
                g = 129;
                b = 0;

                break;
            case 111:

                r = 45;
                g = 126;
                b = 0;

                break;
            case 112:

                r = 50;
                g = 123;
                b = 0;

                break;
            case 113:

                r = 55;
                g = 120;
                b = 0;

                break;
            case 114:

                r = 60;
                g = 117;
                b = 0;

                break;
            case 115:

                r = 65;
                g = 114;
                b = 0;

                break;
            case 116:

                r = 70;
                g = 111;
                b = 0;

                break;
            case 117:

                r = 75;
                g = 108;
                b = 0;

                break;
            case 118:

                r = 80;
                g = 105;
                b = 0;

                break;
            case 119:

                r = 85;
                g = 102;
                b = 0;

                break;
            case 120:

                r = 90;
                g = 99;
                b = 0;

                break;
            case 121:

                r = 95;
                g = 96;
                b = 0;

                break;
            case 122:

                r = 100;
                g = 93;
                b = 0;

                break;
            case 123:

                r = 105;
                g = 90;
                b = 0;

                break;
            case 124:

                r = 110;
                g = 87;
                b = 0;

                break;
            case 125:

                r = 115;
                g = 84;
                b = 0;

                break;
            case 126:

                r = 120;
                g = 81;
                b = 0;

                break;
            case 127:

                r = 125;
                g = 78;
                b = 0;

                break;
            //////////////////////////////////////////////////////	
            case 128:

                r = 130;
                g = 75;
                b = 0;

                break;
            case 129:

                r = 135;
                g = 72;
                b = 0;

                break;
            case 130:

                r = 140;
                g = 69;
                b = 0;

                break;
            case 131:

                r = 145;
                g = 66;
                b = 0;

                break;
            case 132:

                r = 150;
                g = 63;
                b = 0;

                break;
            case 133:

                r = 155;
                g = 60;
                b = 0;

                break;
            case 134:

                r = 160;
                g = 57;
                b = 0;

                break;
            case 135:

                r = 165;
                g = 54;
                b = 0;

                break;
            case 136:

                r = 170;
                g = 51;
                b = 0;

                break;
            case 137:

                r = 175;
                g = 48;
                b = 0;

                break;
            case 138:

                r = 180;
                g = 45;
                b = 0;

                break;
            case 139:

                r = 185;
                g = 42;
                b = 0;

                break;
            case 140:

                r = 190;
                g = 39;
                b = 0;

                break;
            case 141:

                r = 195;
                g = 36;
                b = 0;

                break;
            case 142:

                r = 200;
                g = 33;
                b = 0;

                break;
            case 143:

                r = 205;
                g = 30;
                b = 0;

                break;
            case 144:

                r = 210;
                g = 27;
                b = 0;

                break;
            case 145:

                r = 215;
                g = 24;
                b = 0;

                break;
            case 146:

                r = 220;
                g = 21;
                b = 0;

                break;
            case 147:

                r = 225;
                g = 18;
                b = 0;

                break;
            case 148:

                r = 230;
                g = 15;
                b = 0;

                break;
            case 149:

                r = 235;
                g = 12;
                b = 0;

                break;
            case 150:

                r = 240;
                g = 9;
                b = 0;

                break;
            case 151:

                r = 245;
                g = 6;
                b = 0;

                break;
            case 152:

                r = 250;
                g = 3;
                b = 0;

                break;
            case 153:

                r = 255;
                g = 0;
                b = 0;

                break;
            case 154:

                r = 255;
                g = 5;
                b = 0;

                break;
            case 155:

                r = 255;
                g = 10;
                b = 0;

                break;
            case 156:

                r = 255;
                g = 15;
                b = 0;

                break;
            case 157:

                r = 255;
                g = 20;
                b = 0;

                break;
            case 158:

                r = 255;
                g = 25;
                b = 0;

                break;
            case 159:

                r = 255;
                g = 30;
                b = 0;

                break;
            case 160:

                r = 255;
                g = 35;
                b = 0;

                break;
            case 161:

                r = 255;
                g = 40;
                b = 0;

                break;
            case 162:

                r = 255;
                g = 45;
                b = 0;

                break;
            case 163:

                r = 255;
                g = 50;
                b = 0;

                break;
            case 164:

                r = 255;
                g = 55;
                b = 0;

                break;
            case 165:

                r = 255;
                g = 60;
                b = 0;

                break;
            case 166:

                r = 255;
                g = 65;
                b = 0;

                break;
            case 167:

                r = 255;
                g = 70;
                b = 0;

                break;
            case 168:

                r = 255;
                g = 75;
                b = 0;

                break;
            case 169:

                r = 255;
                g = 80;
                b = 0;

                break;
            case 170:

                r = 255;
                g = 85;
                b = 0;

                break;
            case 171:

                r = 255;
                g = 90;
                b = 0;

                break;
            case 172:

                r = 255;
                g = 95;
                b = 0;

                break;
            case 173:

                r = 255;
                g = 100;
                b = 0;

                break;
            case 174:

                r = 255;
                g = 105;
                b = 0;

                break;
            case 175:

                r = 255;
                g = 110;
                b = 0;

                break;
            case 176:

                r = 255;
                g = 115;
                b = 0;

                break;
            case 177:

                r = 255;
                g = 120;
                b = 0;

                break;
            case 178:

                r = 255;
                g = 125;
                b = 0;

                break;
            case 179:

                r = 255;
                g = 130;
                b = 0;

                break;
            case 180:

                r = 255;
                g = 135;
                b = 0;

                break;
            case 181:

                r = 225;
                g = 140;
                b = 0;

                break;
            case 182:

                r = 255;
                g = 145;
                b = 0;

                break;
            case 183:

                r = 255;
                g = 150;
                b = 0;

                break;
            case 184:

                r = 255;
                g = 155;
                b = 10;

                break;
            case 185:

                r = 255;
                g = 160;
                b = 0;

                break;
            case 186:

                r = 255;
                g = 165;
                b = 0;

                break;
            case 187:

                r = 255;
                g = 170;
                b = 0;

                break;
            case 188:

                r = 255;
                g = 175;
                b = 0;

                break;
            case 189:

                r = 255;
                g = 180;
                b = 0;

                break;
            case 190:

                r = 255;
                g = 185;
                b = 0;

                break;
            case 191:

                r = 255;
                g = 190;
                b = 0;

                break;
            ////////////////////////////////////////////////
            case 192:

                r = 255;
                g = 195;
                b = 0;

                break;
            case 193:

                r = 255;
                g = 200;
                b = 0;

                break;
            case 194:

                r = 255;
                g = 205;
                b = 0;

                break;
            case 195:

                r = 255;
                g = 210;
                b = 0;

                break;
            case 196:

                r = 255;
                g = 215;
                b = 0;

                break;
            case 197:

                r = 255;
                g = 220;
                b = 0;

                break;
            case 198:

                r = 255;
                g = 225;
                b = 0;

                break;
            case 199:

                r = 255;
                g = 230;
                b = 0;

                break;
            case 200:

                r = 255;
                g = 235;
                b = 0;

                break;
            case 201:

                r = 255;
                g = 240;
                b = 0;

                break;
            case 202:

                r = 255;
                g = 245;
                b = 0;

                break;
            case 203:

                r = 255;
                g = 250;
                b = 0;

                break;
            case 204:

                r = 255;
                g = 255;
                b = 0;

                break;
            case 205:

                r = 255;
                g = 255;
                b = 5;

                break;
            case 206:

                r = 255;
                g = 255;
                b = 10;

                break;
            case 207:

                r = 255;
                g = 255;
                b = 15;

                break;
            case 208:

                r = 255;
                g = 255;
                b = 20;

                break;
            case 209:

                r = 255;
                g = 255;
                b = 25;

                break;
            case 210:

                r = 255;
                g = 255;
                b = 30;

                break;
            case 211:

                r = 255;
                g = 255;
                b = 35;

                break;
            case 212:

                r = 255;
                g = 255;
                b = 40;

                break;
            case 213:

                r = 255;
                g = 255;
                b = 45;

                break;
            case 214:

                r = 255;
                g = 255;
                b = 50;

                break;
            case 215:

                r = 255;
                g = 255;
                b = 55;

                break;
            case 216:

                r = 255;
                g = 255;
                b = 60;

                break;
            case 217:

                r = 255;
                g = 255;
                b = 65;

                break;
            case 218:

                r = 255;
                g = 255;
                b = 70;

                break;
            case 219:

                r = 255;
                g = 255;
                b = 75;

                break;
            case 220:

                r = 255;
                g = 255;
                b = 80;

                break;
            case 221:

                r = 255;
                g = 255;
                b = 85;

                break;
            case 222:

                r = 255;
                g = 255;
                b = 90;

                break;
            case 223:

                r = 255;
                g = 255;
                b = 95;

                break;
            case 224:

                r = 255;
                g = 255;
                b = 100;

                break;
            case 225:

                r = 255;
                g = 255;
                b = 105;

                break;
            case 226:

                r = 255;
                g = 255;
                b = 110;

                break;
            case 227:

                r = 255;
                g = 255;
                b = 115;

                break;
            case 228:

                r = 255;
                g = 255;
                b = 120;

                break;
            case 229:

                r = 255;
                g = 255;
                b = 125;

                break;
            case 230:

                r = 255;
                g = 255;
                b = 130;

                break;
            case 231:

                r = 255;
                g = 255;
                b = 135;

                break;
            case 232:

                r = 255;
                g = 255;
                b = 140;

                break;
            case 233:

                r = 255;
                g = 255;
                b = 145;

                break;
            case 234:

                r = 255;
                g = 255;
                b = 150;

                break;
            case 235:

                r = 255;
                g = 255;
                b = 155;

                break;
            case 236:

                r = 255;
                g = 255;
                b = 160;

                break;
            case 237:

                r = 255;
                g = 255;
                b = 165;

                break;
            case 238:

                r = 255;
                g = 255;
                b = 170;

                break;
            case 239:

                r = 255;
                g = 255;
                b = 175;

                break;
            case 240:

                r = 255;
                g = 255;
                b = 180;

                break;
            case 241:

                r = 255;
                g = 255;
                b = 185;

                break;
            case 242:

                r = 255;
                g = 255;
                b = 190;

                break;
            case 243:

                r = 255;
                g = 255;
                b = 195;

                break;
            case 244:

                r = 255;
                g = 255;
                b = 200;

                break;
            case 245:

                r = 255;
                g = 255;
                b = 205;

                break;
            case 246:

                r = 255;
                g = 255;
                b = 210;

                break;
            case 247:

                r = 255;
                g = 255;
                b = 215;

                break;
            case 248:

                r = 255;
                g = 255;
                b = 220;

                break;
            case 249:

                r = 255;
                g = 255;
                b = 225;

                break;
            case 250:

                r = 255;
                g = 255;
                b = 230;

                break;
            case 251:

                r = 255;
                g = 255;
                b = 235;

                break;
            case 252:

                r = 255;
                g = 255;
                b = 240;

                break;
            case 253:

                r = 255;
                g = 255;
                b = 245;

                break;
            case 254:

                r = 255;
                g = 255;
                b = 250;

                break;
            case 255:

                r = 255;
                g = 255;
                b = 255;

                break;

            default:
                break;

        }
        return [r, g, b];
    }

    async function applyEffects() {

        imageList = originalPixels.map(pixel => pixel.slice());

        const sharpenLevel = document.getElementById('sharpness').value;
        const brightnessLevel = document.getElementById('gama').value;

        await applyGama(brightnessLevel);
        await applySharpness(sharpenLevel);

        updateImage(currentImageId);
    }

    //Filtro GAMA
    const applyGama = async (gamaValue) => {
        gamaValue = 1 - (gamaValue * 0.65);
        if (gamaValue == 0) { return; }

        for (let i = 0; i < imageList.length; i++) {
            const dicomFileBuffer = await imageList[i].arrayBuffer();
            const byteArray = new Uint8Array(dicomFileBuffer);
            const dataSet = dicomParser.parseDicom(byteArray);
            const pixelDataElement = dataSet.elements.x7fe00010;
            const dataOffset = pixelDataElement.dataOffset;
            const length = pixelDataElement.length;

            const pixelData = new Uint16Array(dicomFileBuffer, dataOffset, length / 2);
            const filteredData = new Uint16Array(pixelData.length);

            for (let i = 0; i < length; i ++) {
                filteredData[i] = Math.pow(pixelData[i] / 255, gamaValue) * 255;
            }

            const newDicomBuffer = new ArrayBuffer(dicomFileBuffer.byteLength);
            const newByteArray = new Uint8Array(newDicomBuffer);
            newByteArray.set(byteArray);
            const newPixelDataArray = new Uint16Array(newDicomBuffer, dataOffset, length / 2);
            newPixelDataArray.set(filteredData);

            const newBlob = new Blob([newDicomBuffer], { type: 'application/dicom' });
            imageList[i] = newBlob;
        }
        
    };

    //Filtro NITIDEZ
    const applySharpness = async (value) => {

        if (value == 0) { return; }

        for (let i = 0; i < imageList.length; i++) {
            const dicomFileBuffer = await imageList[i].arrayBuffer();
            const byteArray = new Uint8Array(dicomFileBuffer);
            const dataSet = dicomParser.parseDicom(byteArray);
            const pixelDataElement = dataSet.elements.x7fe00010;
            const dataOffset = pixelDataElement.dataOffset;
            const length = pixelDataElement.length;

            const pixelData = new Uint16Array(dicomFileBuffer, dataOffset, length / 2);
            const rows = dataSet.uint16('x00280010');
            const columns = dataSet.uint16('x00280011');
            const filteredData = new Uint16Array(pixelData.length);
            const size = 3;

            const halfSize = Math.floor(size / 2);
            const maskOriginal = [0, -1, 0,
                -1 , 5, -1 ,
                0, -1, 0];

            const mask = maskOriginal.map(x => {
                if (x === 5) {
                    return 1 + 4 * value;
                } else {
                    return x * value;
                }
            });

            for (let r = halfSize; r < rows - halfSize; r++) {
                for (let c = halfSize; c < columns - halfSize; c++) {
                    const windowValues = [];
                    for (let i = -halfSize; i <= halfSize; i++) {
                        for (let j = -halfSize; j <= halfSize; j++) {
                            windowValues.push(pixelData[(r + i) * columns + (c + j)]);
                        }
                    }
                    let filteredValue = applyMask(mask, windowValues);

                    // Normalização para o intervalo de 0 a 255
                    filteredValue = Math.max(0, Math.min(255, filteredValue));

                    filteredData[r * columns + c] = filteredValue;
                }
            }

            // Copiando as bordas
            for (let r = 0; r < rows; r++) {
                for (let b = 0; b < halfSize; b++) {
                    filteredData[r * columns + b] = pixelData[r * columns + b];  // Primeiras colunas
                    filteredData[r * columns + (columns - 1 - b)] = pixelData[r * columns + (columns - 1 - b)];  // Últimas colunas
                }
            }

            for (let c = 0; c < columns; c++) {
                for (let b = 0; b < halfSize; b++) {
                    filteredData[b * columns + c] = pixelData[b * columns + c];  // Primeiras linhas
                    filteredData[(rows - 1 - b) * columns + c] = pixelData[(rows - 1 - b) * columns + c];  // Últimas linhas
                }
            }

            const newDicomBuffer = new ArrayBuffer(dicomFileBuffer.byteLength);
            const newByteArray = new Uint8Array(newDicomBuffer);
            newByteArray.set(byteArray);
            const newPixelDataArray = new Uint16Array(newDicomBuffer, dataOffset, length / 2);
            newPixelDataArray.set(filteredData);

            const newBlob = new Blob([newDicomBuffer], { type: 'application/dicom' });
            imageList[i] = newBlob;
        }
    };

    //Função geral para as Máscaras
    const applyMaskToAllImages = async (type, size) => {
        for (let i = 0; i < imageList.length; i++) {
            const dicomFileBuffer = await imageList[i].arrayBuffer();
            const byteArray = new Uint8Array(dicomFileBuffer);
            const dataSet = dicomParser.parseDicom(byteArray);
            const pixelDataElement = dataSet.elements.x7fe00010;
            const dataOffset = pixelDataElement.dataOffset;
            const length = pixelDataElement.length;

            // Extraindo os dados dos pixels
            const pixelData = new Uint16Array(dicomFileBuffer, dataOffset, length / 2);

            // Obtendo as dimensões da imagem
            const rows = dataSet.uint16('x00280010');
            const columns = dataSet.uint16('x00280011');

            let filteredData;

            switch (type) {
                case 'mean':
                    filteredData = applyMeanFilter(pixelData, rows, columns, size);
                    break;
                case 'median':
                    filteredData = applyMedianFilter(pixelData, rows, columns, size);
                    break;
                case 'max':
                    filteredData = applyMaxFilter(pixelData, rows, columns, size);
                    break;
                case 'min':
                    filteredData = applyMinFilter(pixelData, rows, columns, size);
                    break;
                case 'mode':
                    filteredData = applyModeFilter(pixelData, rows, columns, size);
                    break;
                case 'kuwahara':
                    filteredData = applyKuwaharaFilter(pixelData, rows, columns, size);
                    break;
                case 'tomitaTsuji':
                    filteredData = applyTomitaTsujiFilter(pixelData, rows, columns, size);
                    break;
                case 'negaoMatsuyama':
                    filteredData = applyNagaoMatsuyamaFilter(pixelData, rows, columns, size);
                    break;
                case 'somboonkaew':
                    filteredData = applySomboonkaewFilter(pixelData, rows, columns, size);
                    break;
                case 'h1':
                    filteredData = applyH1Filter(pixelData, rows, columns, size);
                    break;
                case 'h2':
                    filteredData = applyH2Filter(pixelData, rows, columns, size);
                    break;
                case 'm1':
                    filteredData = applyM1Filter(pixelData, rows, columns, size);
                    break;
                case 'm2':
                    filteredData = applyM2Filter(pixelData, rows, columns, size);
                    break;
                case 'm3':
                    filteredData = applyM3Filter(pixelData, rows, columns, size);
                    break;
                default:
                    throw new Error('Tipo de filtro não suportado');
            }

            const newDicomBuffer = new ArrayBuffer(dicomFileBuffer.byteLength);
            const newByteArray = new Uint8Array(newDicomBuffer);
            newByteArray.set(byteArray);
            const newPixelDataArray = new Uint16Array(newDicomBuffer, dataOffset, length / 2);
            newPixelDataArray.set(filteredData);

            const newBlob = new Blob([newDicomBuffer], { type: 'application/dicom' });
            imageList[i] = newBlob;
        }
        updateImage(currentImageId);
    }

    function applyMask(mask, values) {
        let sum = 0
        for (let i = 0; i < mask.length; i++) {
            sum += mask[i] * values[i];
        }
        return sum;
    }

    function resetOriginalPixels() {
        imageList = originalPixels.map(pixel => pixel.slice());
        const sharpnessSlider = document.getElementById('sharpness');
        if (sharpnessSlider) {
            sharpnessSlider.value = 0; // Reset the value
        }

        const gamaSlider = document.getElementById('gama');
        if (gamaSlider) {
            gamaSlider.value = 0; // Reset the value
        }
        updateImage(currentImageId);
    }

    async function getDicomData() {
        const dicomFileBuffer = await imageList[0].arrayBuffer();
        const byteArray = new Uint8Array(dicomFileBuffer);
        const dataSet = dicomParser.parseDicom(byteArray);

        const formatDate = (dateString) => {
            if (!dateString || dateString.length !== 8) {
                return 'Data Inválida';
            }
            const year = dateString.substring(0, 4);
            const month = dateString.substring(4, 6);
            const day = dateString.substring(6, 8);
            return `${day}/${month}/${year}`;
        };

        const values = [dataSet.string('x00100010'), formatDate(dataSet.string('x00080020')),
        dataSet.string('x00080090'), dataSet.string('x00080080'),
        dataSet.string('x00080070'), dataSet.string('x00081090'),
        dataSet.string('x00080060'), dataSet.string('x00081030')];

        console.log(values)
        setDicomData(values);
    }

    return {
        initialize: initialize
    };
};

export default ShowFunctions;

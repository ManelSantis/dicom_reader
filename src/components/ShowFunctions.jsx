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

export const ShowFunctions = (archive_id) => {

    let queryList;
    let fileList;
    let currentImageId = 0;
    const note = 'ArrowAnnotate';

    const stack = { currentImageIdIndex: 0, imageIds: [], };
    const annotations = { currentImageId, imageIds: [], states: [] };

    let element = document.getElementById('dicomImage');

    const initialize = async () => {
        try {
            // Espera a resolução da Promise retornada por fetchData
            fileList = await fetchData();

            // Resto do seu código aqui
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

            cornerstoneTools.setToolActive(note, { mouseButtonMask: 2 })

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

            if (currentImageId == files.length) {
                currentImageId = files.length - 1;
            }
        }
        updateImage(currentImageId);
    };

    function updateImage(newImageId) {
        cornerstoneTools.clearToolState(element, note);
        currentImageId = newImageId;

        getImageByPath(fileList[currentImageId].image_path)
        .then(dcmData => {
            const blob = new Blob([dcmData]);
            console.log(blob)
            const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(blob);
            console.log(imageId)
            cornerstone.loadImage(imageId).then(function (image) {
                const viewport = cornerstone.getDefaultViewportForImage(element, image);
                cornerstone.displayImage(element, image, viewport);
                loadAnnotations(currentImageId);
                cornerstone.updateImage(element);

            }).catch((error) => {
                console.error('Error loading image:', error);
            });
        })
        .catch(error => {
            console.error('Error fetching DICOM:', error);
        });
    }

    function loadAnnotations(imageId) {
        if (annotations.states[imageId]) {
            for (const annotation of annotations.states[imageId]) {
            console.log(annotation)
                cornerstoneTools.addToolState(element, note, annotation);
            }
        }
    }

    return {
        initialize: initialize
    };
};

export default ShowFunctions;

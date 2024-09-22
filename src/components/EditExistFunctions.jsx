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


const state = {
    fileList: null,
    imageList: null,
    imageListDownload: null,
    originalPixels: null,
    currentImageId: 0
};

let nameSwitchs = [];
let colorsImplanted = [];
let typeAnnotationsImplanted = [];
let idSwitchs = [];

const annotations = { currentImageId: state.currentImageId, imageIds: [], states: [] };
let element = document.getElementById('dicomImage');
const note = 'ArrowAnnotate';

export const EditExistFunctions = (archive_id, setProgress, setProgressMessage, setIsLoading, setDicomData, setCurrentImage, setTotalImages, archiveData) => {

    element = document.getElementById('dicomImage');
    const stack = { currentImageIdIndex: 0, imageIds: [], };

    const initialize = async () => {
        setIsLoading(true);
        setProgressMessage('Carregando imagens...');
        setProgress(0);

        state.fileList = await fetchData();
   
        
        nameSwitchs = archiveData.nameSwitchs;
        console.log(nameSwitchs)
        colorsImplanted = archiveData.colorsImplanted;
        typeAnnotationsImplanted = archiveData.typeAnnotationsImplanted;
        idSwitchs = archiveData.idSwitchs;
        
        const totalFiles = state.fileList.length;
        setCurrentImage(1);
        setTotalImages(totalFiles);

        const promises = state.fileList.map(async (file, index) => {
            const imageBlob = await getImageByPath(file.image_path);
            setProgress((prev) => Math.min(prev + (90 / totalFiles), 90));
            return imageBlob;
        });

        const imageBlobs = await Promise.all(promises);

        state.imageListDownload = new Set();

        imageBlobs.forEach(dcmData => {
            const blob = new Blob([dcmData]);
            state.imageListDownload.add(blob);
        })


        state.imageList = Array.from(state.imageListDownload);
        state.originalPixels = Array.from(state.imageListDownload);

        cornerstone.enable(element);
        element.addEventListener('wheel', handleMouseWheel);
        state.currentImageId = 0;
        stack.imageIds = [];
        annotations.imageIds = [];
        annotations.states = [];

        for (let i = 0; i < state.fileList.length; i++) {
            stack.imageIds.push(i);
            annotations.imageIds.push(i);
            annotations.states.push(await fetchNotesByImage(state.fileList[i].image_id));
        }
        cornerstoneTools.addStackStateManager(element, ['stack']);
        cornerstoneTools.addToolState(element, 'stack', stack);

        const apiTool = cornerstoneTools[`${note}Tool`];
        cornerstoneTools.addTool(apiTool);
        cornerstoneTools.toolColors.setToolColor('rgb(0, 255, 255)');
        cornerstoneTools.setToolActive(note, { mouseButtonMask: 2 })

        updateImage(state.currentImageId);
    }

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
        if (state.fileList.length === 0) return
        saveByColor(state.currentColor, state.currentImageId);
        if (state.currentImageId >= 0 && state.currentImageId < state.fileList.length) {
            if (event.wheelDelta < 0 || event.detail > 0) {
                if (state.currentImageId > 0) {
                    state.currentImageId--;
                }
            } else {
                if (state.currentImageId < state.fileList.length - 1 && state.currentImageId >= 0) {
                    state.currentImageId++;
                }
            }
        } else {
            if (state.currentImageId < 0) {
                state.currentImageId = 0;
            }

            if (state.currentImageId == state.fileList.length) {
                state.currentImageId = state.fileList.length - 1;
            }
        }
        updateImage(state.currentImageId);
    };

    function updateImage(newImageId) {
        cornerstoneTools.clearToolState(element, note);
        state.currentImageId = newImageId;

        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(state.imageList[state.currentImageId]);
        cornerstone.loadImage(imageId).then(function (image) {
            const viewport = cornerstone.getDefaultViewportForImage(element, image);
            cornerstone.displayImage(element, image, viewport);
            loadAnnotations(state.currentImageId);
            setCurrentImage(newImageId + 1);
            setProgress(100);
            setIsLoading(false);
        })
    }
   
    /////////////////////////////

    return {
        initialize
    };
}

export const newTypeAnnotation = ({ annotation }) => {
    if (!annotation) return;

    nameSwitchs = nameSwitchs || [];
    idSwitchs = idSwitchs || [];
    colorsImplanted = colorsImplanted || [];
    typeAnnotationsImplanted = typeAnnotationsImplanted || [];

    nameSwitchs.push(annotation.name);
    idSwitchs.push(annotation.idSwitch);
    colorsImplanted.push(annotation.color);
    typeAnnotationsImplanted.push(annotation.idOption);

};

export const Switchs = ({ idSwitchs, colorsImpanted }) => {
    /////////////////////////////
    if (idSwitchs && colorsImpanted) {
        //Função genérica para eventos de visibilidade das anotações
        function handleVisibilityChange(colorCheckbox, color) {
            saveByColor(state.currentColor, state.currentImageId);
            editVisibility(color, colorCheckbox.checked);

            const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(state.imageList[state.currentImageId]);
            cornerstone.loadImage(imageId).then(function (image) {
                const viewport = cornerstone.getDefaultViewportForImage(element, image);
                cornerstone.displayImage(element, image, viewport);
                loadAnnotations(state.currentImageId);
            });
        }


        function addSwitchEventListeners() {
            idSwitchs.forEach((id, index) => {
                const switchElement = document.getElementById(id);
                const color = colorsImpanted[index];

                switchElement.addEventListener('change', function () {
                    handleVisibilityChange(switchElement, color);
                });
            });
        }

        function getOptionTool(annotationType) {
            return typeSpecie.querySelector(`option[value="${annotationType}"]`);
        }    

        //Função para editar a visibilidade
        function editVisibility(color, visible) {
            for (const element of annotations.states) {
                for (const annotation of element) {
                    if (annotation.color == color) {
                        annotation.visible = visible;
                    }
                }
            }
        }

        addSwitchEventListeners();
    }
    /////////
}

function loadAnnotations(imageId) {
    if (annotations.states[imageId]) {
        for (const annotation of annotations.states[imageId]) {
            cornerstoneTools.addToolState(element, note, annotation);
        }
    }
}

function saveByColor(color, imageId) {
    const currentState = cornerstoneTools.getToolState(element, note);
    if (currentState && currentState.data.length > 0) {
        for (const annotation of currentState.data) {
            if (annotation.color === undefined) {
                annotation.color = color;
            }
        }
        annotations.states[imageId] = currentState.data;
    }
};

export default [EditExistFunctions, Switchs, newTypeAnnotation];
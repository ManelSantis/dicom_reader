import cornerstone from 'cornerstone-core';
import cornerstoneMath from "cornerstone-math";
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import hammer from 'hammerjs';
import { uploadArrayBuffer } from '../firebase/firebase.js';
import { addArchive, addImage, addNote } from '../services/SaveArchive.js';
import { colorNames, rgbColors } from './ColorArrays.jsx';

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.external.Hammer = hammer;

cornerstoneTools.init(
    {
        showSVGCursors: true,
    }
);

let nameSwitchs = ["Osso", "Órgão"];
let colorsImplanted = ["cyan", "lightcoral"];
let typeAnnotationsImplanted = ["osso", "orgao"];
let idSwitchs = ["ossoSwitch", "orgaoSwitch"];

const state = {
    fileList: null,
    currentImageId: 0,
    currentColor: "cyan",
};

const annotations = { currentImageId: state.currentImageId, imageIds: [], states: [] };
const note = 'ArrowAnnotate';
let element = document.getElementById('dicomImage');

export const EditFunctions = ({ setCurrentImage, setTotalImages, setIsDisabled }) => {

    //Select de anotações
    const typeSpecie = document.getElementById('typeSpecie');
    const divSwitchsAnnotations = document.getElementById('switchsAnnotations');
    const cancel = document.getElementById('cancel');
    element = document.getElementById('dicomImage');
    const stack = { currentImageIdIndex: 0, imageIds: [], };

    const initialize = () => {
        const fileInput = document.getElementById("fileInput");
        fileInput.addEventListener('change', handleFileChange);
        typeSpecie.addEventListener('change', handleTypeChange);
        cancel.addEventListener('click', handleCancelClick);
        divSwitchsAnnotations.addEventListener('click', addSwitchEventListeners);
    };

    const handleFileChange = (event) => {
        console.log('adicionou')
        state.fileList = event.target.files;
        setTotalImages(state.fileList.length);
        cornerstone.enable(element);

        element.addEventListener('wheel', handleMouseWheel);
        console.log(state.fileList);
        setIsDisabled(false);

        state.currentImageId = 0;
        stack.imageIds = [];
        annotations.imageIds = [];

        for (let i = 0; i < state.fileList.length; i++) {
            stack.imageIds.push(i);
            annotations.imageIds.push(i);
            annotations.states.push([]);
        }

        cornerstoneTools.addStackStateManager(element, ['stack']);
        cornerstoneTools.addToolState(element, 'stack', stack);

        //Note Tool
        const apiTool = cornerstoneTools[`${note}Tool`];
        cornerstoneTools.addTool(apiTool);
        cornerstoneTools.toolColors.setToolColor('rgb(0, 255, 255)');
        cornerstoneTools.setToolActive(note, { mouseButtonMask: 2 });
        ///////////

        updateImage(state.currentImageId);
    };

    const handleMouseWheel = (event) => {
        if (state.fileList.length === 0) return;
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

    const handleTypeChange = (event) => {
        const selectedType = event.target.value;
        const index = typeAnnotationsImplanted.indexOf(selectedType);
        const newColor = colorsImplanted[index];
        const generalIndex = colorNames.indexOf(newColor);
        const rgbNewColor = rgbColors[generalIndex];

        saveByColor(state.currentColor, state.currentImageId);
        state.currentColor = newColor;
        cornerstoneTools.toolColors.setToolColor(rgbNewColor);

        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(state.fileList[state.currentImageId]);

        cornerstone.loadImage(imageId).then(function (image) {
            const viewport = cornerstone.getDefaultViewportForImage(element, image);
            cornerstone.displayImage(element, image, viewport);
            loadAnnotations(state.currentImageId);
        });
    };

    const handleCancelClick = async (event) => {
        // Implement handleCancelClick function
    };

    /////////////////////////////
    //Função genérica para eventos de visibilidade das anotações
    function handleVisibilityChange(colorCheckbox, color, tool) {
        saveByColor(state.currentColor, state.currentImageId);
        editVisibility(color, colorCheckbox.checked);
        tool.disabled = !colorCheckbox.checked;

        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(state.fileList[state.currentImageId]);
        cornerstone.loadImage(imageId).then(function (image) {
            const viewport = cornerstone.getDefaultViewportForImage(element, image);
            cornerstone.displayImage(element, image, viewport);
            loadAnnotations(state.currentImageId);
        });
    }

    function getOptionTool(annotationType) {
        return typeSpecie.querySelector(`option[value="${annotationType}"]`);
    }

    function addSwitchEventListeners() {
        idSwitchs.forEach((id, index) => {
            const switchElement = document.getElementById(id);
            const color = colorsImplanted[index];
            const annotationType = typeAnnotationsImplanted[index];
            const optionTool = getOptionTool(annotationType);

            switchElement.addEventListener('change', function () {
                handleVisibilityChange(switchElement, color, optionTool);
            });
        });
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
    /////////////////////////////

    /////////////////////////////
    function updateImage(newImageId) {
        cornerstoneTools.clearToolState(element, note);
        state.currentImageId = newImageId;

        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(state.fileList[state.currentImageId]);
        cornerstone.loadImage(imageId).then(function (image) {
            const viewport = cornerstone.getDefaultViewportForImage(element, image);
            cornerstone.displayImage(element, image, viewport);
            loadAnnotations(state.currentImageId);
        }).catch((error) => {
            console.error('Error loading image:', error);
        });
        setCurrentImage(newImageId + 1);
    }

    function loadAnnotations(imageId) {
        if (annotations.states[imageId]) {
            console.log(annotations.states[imageId]);
            for (const annotation of annotations.states[imageId]) {
                cornerstoneTools.addToolState(element, note, annotation);
            }
        }
    }

    /////////////////////////////

    return {
        initialize
    };
};

export const newTypeAnnotation = ({ annotation }) => {
    nameSwitchs.push(annotation.name);
    idSwitchs.push(annotation.idSwitch);
    colorsImplanted.push(annotation.color);
    typeAnnotationsImplanted.push(annotation.idOption);
};

export const handleSave = async ({ setIsSaving, setProgressMessage, setSaveMessage, archive }) => {
    saveByColor(state.currentColor, state.currentImageId);
    setIsSaving(true);
    setProgressMessage('Criando arquivo..')
    let archive_id = null;
    try {
        let archiveData = {
            archive_name: archive.title,
            archive_date: new Date().toDateString(),
            archive_animal: archive.animalType,
            archive_local: archive.location,
            nameSwitchs: nameSwitchs,
            idSwitchs: idSwitchs,
            colorsImplanted: colorsImplanted,
            typeAnnotationsImplanted: typeAnnotationsImplanted
        };
        const response = await addArchive(archiveData);
        archive_id = response.id;        
    } catch (error) {
        console.error(error);
    }

    let progress = 15.0;
    let valuePerImage = 85 / state.fileList.length;
    valuePerImage =  parseFloat(valuePerImage.toFixed(2));

    let id = 0;
    for (const element of state.fileList) {
        const past = archive_id;
        const number = id;
        setProgressMessage('Salvando imagem' + number + ' do arquivo...')
        try {
            const path = await uploadAndReadFile(element, number, past);

            let imageData = {
                image_path: path,
                archive_id: archive_id
            };

            const response = await addImage(imageData, imageData.archive_id);
            let image_id = response.id;
            
            setProgressMessage('Salvando anotações da imagem' + number + ' do arquivo...')

            for (const note of annotations.states[id]) {
                try {
                    let noteData = {
                        image_id: image_id,
                        active: note.active,
                        color: note.color,
                        handles: note.handles,
                        invalidated: note.invalidated,
                        note_text: note.text,
                        uuid_text: note.uuid,
                        visible: note.visible
                    };
                    const resp = await addNote(noteData, image_id);
                    console.log(resp);
                } catch (error) {
                    console.error(error);
                }
            }
        } catch (error) {
            console.error(error);
        }
        progress += valuePerImage;
        progress = parseFloat(progress.toFixed(2));
        id++;
    }
    setIsSaving(false);
    setProgressMessage('Arquivo salvo');
    setSaveMessage('Arquivo salvo');
    setTimeout(() => {
        setSaveMessage('');
        window.location.reload();
    }, 1500);
};

async function uploadAndReadFile(element, number, past) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function (event) {
            const dicomFileBuffer = event.target.result;
            const uploadStatus = await uploadArrayBuffer(dicomFileBuffer, `image${number}.dcm`, past);

            if (uploadStatus) {
                console.log(`Arquivo image${number}.dcm foi enviado com sucesso para a pasta ${past}`);
                resolve(uploadStatus); // Resolvendo a promessa com o status de upload
            } else {
                console.error(`Erro ao enviar arquivo image${number}.dcm para a pasta ${past}`);
                reject(new Error(`Erro ao enviar arquivo image${number}.dcm para a pasta ${past}`)); // Rejeitando a promessa em caso de erro
            }
        };
        reader.readAsArrayBuffer(element);
    });
}

//Função para salvar por cor
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

export default [EditFunctions, newTypeAnnotation, handleSave];


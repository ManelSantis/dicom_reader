import cornerstone from 'cornerstone-core';
import cornerstoneMath from "cornerstone-math";
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import hammer from 'hammerjs';
import { uploadArrayBuffer } from '../firebase/firebase.js';

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.external.Hammer = hammer;

//const WwwcTool = cornerstoneTools.WwwcTool;
//const PanTool = cornerstoneTools.PanTool;
//const RotateTool = cornerstoneTools.RotateTool;
//const ZoomTool = cornerstoneTools.ZoomTool;

cornerstoneTools.init(
    {
        showSVGCursors: true,
    }
);

let isInitialized = false;

export const EditFunctions = ({ setIsSaving, setProgress, setProgressMessage, setSaveMessage, setCurrentImage, setTotalImages, setHandleSave }) => {

    //TOOLBOX TOOLS
    /*let move = document.getElementById('move');
    let contrast = document.getElementById('contrast');
    let zoom = document.getElementById('zoom')
    let rotate = document.getElementById('rotate');*/
    let currentColor = "yellow";
    const note = 'ArrowAnnotate';

    //Checkboxes
    const osso = document.getElementById('osso');
    const orgao = document.getElementById("orgao");
    const pele = document.getElementById("pele");
    const perigo = document.getElementById("perigo");

    //Select de anotações
    const typeSpecie = document.getElementById('typeSpecie');
    let optionOssos = typeSpecie.querySelector('option[value="ossos"]');
    let optionPele = typeSpecie.querySelector('option[value="pele"]');
    let optionOrgao = typeSpecie.querySelector('option[value="orgao"]');
    let optionPerigo = typeSpecie.querySelector('option[value="perigo"]');

    //const tools = [move, contrast, zoom, rotate];

    //Save Tools
    const save = document.getElementById('save');
    const title = document.getElementById('title');
    const type = document.getElementById('type');
    const part = document.getElementById('part');
    const cancel = document.getElementById('cancel');

    let fileList;
    let currentImageId = 0;
    //let currentTool = "move";

    const stack = { currentImageIdIndex: 0, imageIds: [], };
    const annotations = { currentImageId, imageIds: [], states: [] };

    let element = document.getElementById('dicomImage');

    const initialize = () => {

        if (isInitialized) return;
        isInitialized = true;

        const fileInput = document.getElementById("fileInput");
        fileInput.addEventListener('change', handleFileChange);
        typeSpecie.addEventListener('change', handleTypeChange);
        save.addEventListener('click', handleSaveClick);
        cancel.addEventListener('click', handleCancelClick);
        osso.checked = true;
        pele.checked = true;
        orgao.checked = true;
        perigo.checked = true;
    };

    const handleFileChange = (event) => {
        fileList = event.target.files;
        setTotalImages(fileList.length);
        cornerstone.enable(element);

        element.addEventListener('wheel', handleMouseWheel);
        console.log(fileList);
        save.disabled = false;

        currentImageId = 0;
        stack.imageIds = [];
        annotations.imageIds = [];

        for (let i = 0; i < fileList.length; i++) {
            stack.imageIds.push(i);
            annotations.imageIds.push(i);
            annotations.states.push([]);
        }

        cornerstoneTools.addStackStateManager(element, ['stack']);
        cornerstoneTools.addToolState(element, 'stack', stack);

        //Note Tool
        //const apiTool = cornerstoneTools[`${note}Tool`];
        //cornerstoneTools.addTool(apiTool);
        cornerstoneTools.toolColors.setToolColor('rgb(255, 255, 0)');
        cornerstoneTools.setToolActive(note, { mouseButtonMask: 2 })
        ///////////

        //Adicionando as Ferramentas no Elemento
        /*cornerstoneTools.addTool(PanTool)
        cornerstoneTools.addTool(WwwcTool)
        cornerstoneTools.addTool(cornerstoneTools.ZoomTool, {
            configuration: {
                invert: false,
                preventZoomOutsideImage: false,
                minScale: .1,
                maxScale: 30.0,
            }
        });
        cornerstoneTools.addTool(RotateTool)
        cornerstoneTools.setToolActive("Pan", { mouseButtonMask: 1 })*/

        updateImage(currentImageId);
    };

    const handleMouseWheel = (event) => {
        if (fileList.length === 0) return
        saveByColor(currentColor, currentImageId);
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

    const handleTypeChange = (event) => {
        const selectedType = event.target.value;
        switch (selectedType) {
            case "ossos":
                saveByColor(currentColor, currentImageId);
                currentColor = "yellow";
                cornerstoneTools.toolColors.setToolColor('rgb(255, 255, 0)');
                break;
            case "pele":
                saveByColor(currentColor, currentImageId);
                currentColor = "purple";
                cornerstoneTools.toolColors.setToolColor('rgb(128, 0, 128)');
                break;
            case "orgao":
                saveByColor(currentColor, currentImageId);
                currentColor = "green";
                cornerstoneTools.toolColors.setToolColor('rgb(0, 128, 0)');
                break;
            case "perigo":
                saveByColor(currentColor, currentImageId);
                currentColor = "red";
                cornerstoneTools.toolColors.setToolColor('rgb(255,0, 0)');
                break;
        }
        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(fileList[currentImageId]);

        cornerstone.loadImage(imageId).then(function (image) {
            const viewport = cornerstone.getDefaultViewportForImage(element, image);
            cornerstone.displayImage(element, image, viewport);
            loadAnnotations(currentImageId);
        });
    }

    const handleSaveClick = async (event) => {

        if (!title.value || !type.value || !part.value) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            setHandleSave([!title.value, !type.value, !part.value]);
            return;
        }

        setHandleSave([true, true, true]);

        setIsSaving(true);
        setProgressMessage('Criando arquivo..')
        setProgress(0);
        let archive_id = null;
        try {
            let archiveData = {
                archive_name: title.value,
                archive_date: new Date().toDateString(),
                archive_animal: type.value,
                archive_local: part.value
            };
        setProgress(5);
            const response = await addArchive(archiveData);
            archive_id = response.id;        
        } catch (error) {
            console.error(error);
        }
        setProgress(15);

        let progress = 15.0;
        let valuePerImage = 85 / fileList.length;
        valuePerImage =  parseFloat(valuePerImage.toFixed(2));

        let id = 0;
        for (const element of fileList) {
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
            setProgress(progress);
            id++;
        }
        setProgress(100);
        setIsSaving(false);
        setProgressMessage('Arquivo salvo')
        setSaveMessage('Arquivo salvo');
        setTimeout(() => {
            setSaveMessage('');
            window.location.reload();
        }, 3000);
    };

    const handleCancelClick = (event) => {
        window.location.reload();
    }

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

    /////////////////////////////
    //Função generica para selecionar as ferramentas
    /*function setTool(toolName, disableList, activeTool) {
        disableList.forEach((tool, index) => tools[index].disabled = tool);
        currentTool = toolName;
        disableList.forEach(tool => cornerstoneTools.setToolDisabled(tool));
        cornerstoneTools.setToolActive(activeTool, { mouseButtonMask: 1 });
    }

    //Evento para selecionar mover
    move.addEventListener('click', function (event) { setTool("move", [true, false, false, false], 'Pan'); });
    //Evento para selecionar contraste
    contrast.addEventListener('click', function (event) { setTool("contrast", [false, true, false, false], 'Wwwc'); });
    //Evento para selecionar zoom
    zoom.addEventListener('click', function (event) { setTool("zoom", [false, false, true, false], 'Zoom'); });
    //Evento para selecionar rotacionar
    rotate.addEventListener('click', function (event) { setTool("rotate", [false, false, false, true], 'Rotate'); });*/
    /////////////////////////////

    /////////////////////////////
    //Função genérica para eventos de visibilidade das anotações
    function handleVisibilityChange(colorCheckbox, color, tool) {
        saveByColor(currentColor, currentImageId);
        editVisibility(color, colorCheckbox.checked);
        tool.disabled = !colorCheckbox.checked;

        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(fileList[currentImageId]);
        cornerstone.loadImage(imageId).then(function (image) {
            const viewport = cornerstone.getDefaultViewportForImage(element, image);
            cornerstone.displayImage(element, image, viewport);
            loadAnnotations(currentImageId);
        });
    }

    //Evento para a cor amarela
    osso.addEventListener('change', function () { handleVisibilityChange(osso, 'yellow', optionOssos); });
    //Evento para a cor roxa
    pele.addEventListener('change', function () { handleVisibilityChange(pele, 'purple', optionPele); });
    //Evento para a cor verde
    orgao.addEventListener('change', function () { handleVisibilityChange(orgao, 'green', optionOrgao); });
    //Evento para a cor vermelha
    perigo.addEventListener('change', function () { handleVisibilityChange(perigo, 'red', optionPerigo); });

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
        currentImageId = newImageId;

        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(fileList[currentImageId]);
        cornerstone.loadImage(imageId).then(function (image) {
            const viewport = cornerstone.getDefaultViewportForImage(element, image);
            cornerstone.displayImage(element, image, viewport);
            loadAnnotations(currentImageId);
        }).catch((error) => {
            console.error('Error loading image:', error);
        });
        setCurrentImage(newImageId+1);
    }

    function loadAnnotations(imageId) {
        if (annotations.states[imageId]) {
            console.log(annotations.states[imageId])
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
    }

    const cleanup = () => {
         // Limpa as configurações ou estados quando o componente é desmontado
         setIsSaving(false);
         setProgress(0);
         setProgressMessage('');
         setSaveMessage('');
         setCurrentImage(0);
         setTotalImages(0);
         setHandleSave([false, false, false]);
         isInitialized = false; // Reinicializa para próximo uso
    };

    /////////////////////////////

    return {
        initialize: initialize,
        cleanup
    };
};

export default EditFunctions;

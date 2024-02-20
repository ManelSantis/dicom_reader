import cornerstone from 'cornerstone-core';
import cornerstoneMath from 'cornerstone-math';
import cornerstoneTools from 'cornerstone-tools';
import dicomParser from 'dicom-parser';
import hammer from 'hammerjs';
import { uploadArrayBuffer } from './firebase.js';

//Checkboxes
let cBone = document.getElementById('cBone');
let cOrgan = document.getElementById("cOrgan");
let cSkin = document.getElementById("cSkin");
let cDanger = document.getElementById("cDanger");

//Radios
let bone = document.getElementById('bone');
let organ = document.getElementById("organ");
let skin = document.getElementById("skin");
let danger = document.getElementById("danger");

//Botões das ferramentas
let move = document.getElementById('move');
let contrast = document.getElementById('contrast');
let zoom = document.getElementById('zoom')
let rotate = document.getElementById('rotate');
let save = document.getElementById('save');

const tools = [move, contrast, zoom, rotate];

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.external.Hammer = hammer;

let currentColor = "yellow";
let currentTool = "move";
let radios = document.getElementsByName("cor");

//Ferramentas+
const WwwcTool = cornerstoneTools.WwwcTool;
const PanTool = cornerstoneTools.PanTool;
const RotateTool = cornerstoneTools.RotateTool;
const ZoomTool = cornerstoneTools.ZoomTool;

cornerstoneTools.init(
  {
    showSVGCursors: true,
  }
);

const note = 'ArrowAnnotate';

const fileInput = document.getElementById('fileInput');
const element = document.getElementById('dicomImage');
let currentImageId = 0;
const stack = { currentImageIdIndex: 0, imageIds: [], };
const annotations = { currentImageId, imageIds: [], states: [], bones: [], organs: [], skins: [], danger: [] };

let files = [];
cornerstone.enable(element);

/////////////////////////////
//Função genérica para eventos de visibilidade das anotações
function handleVisibilityChange(colorCheckbox, color, tool) {
  saveByColor(currentColor, currentImageId);
  editVisibility(color, colorCheckbox.checked);
  tool.disabled = !colorCheckbox.checked;

  const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(files[currentImageId]);
  cornerstone.loadImage(imageId).then(function (image) {
    const viewport = cornerstone.getDefaultViewportForImage(element, image);
    cornerstone.displayImage(element, image, viewport);
    loadAnnotations(currentImageId);
  });
}

//Evento para a cor amarela
cBone.addEventListener('change', function () { handleVisibilityChange(cBone, 'yellow', bone); });
//Evento para a cor roxa
cOrgan.addEventListener('change', function () { handleVisibilityChange(cOrgan, 'purple', organ); });
//Evento para a cor verde
cSkin.addEventListener('change', function () { handleVisibilityChange(cSkin, 'green', skin); });
//Evento para a cor vermelha
cDanger.addEventListener('change', function () { handleVisibilityChange(cDanger, 'red', danger); });
/////////////////////////////

/////////////////////////////
//Função genérica para selecionar uma ferramenta
function setTool(toolName, disableList, activeTool) {

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
rotate.addEventListener('click', function (event) { setTool("rotate", [false, false, false, true], 'Rotate'); });
/////////////////////////////

/////////////////////////////

save.addEventListener('click', async function () {


  try {
    const file = files[0];
    const reader = new FileReader();
    const pasta = '40';
    const numero = 1;

    reader.onload = async function (event) {
      const dicomFileBuffer = event.target.result;
      const uploadStatus = await uploadArrayBuffer(dicomFileBuffer, `image${numero}.dcm`, pasta);

        if (uploadStatus) {
            console.log(`Arquivo image${numero}.dcm foi enviado com sucesso para a pasta ${pasta}`);
        } else {
            console.error(`Erro ao enviar arquivo image${numero}.dcm para a pasta ${pasta}`);
        }
    };
    reader.readAsArrayBuffer(file);

  } catch (error) {
    console.error(error);
  }


  /*let archive_id = null;
  try {
    let archiveData = {
      archive_name: 'Teste23',
      archive_date: '2024-01-29'
    };
    const response = await addArchive(archiveData);
    archive_id = response.id;
  } catch (error) {
    console.error(error);
  }

  let id = 0;
  for (const element of files) {
    try {

      let imageData = {
        image_path: element,
        archive_id: archive_id
      };

      console.log(imageData.image_path)

      const response = await addImage(imageData.image_path, archive_id);
      let image_id = response.id;
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
    id++;
  }*/

});

/////////////////////////////

fileInput.addEventListener('change', function (event) {
  save.disabled = false; //Ativar opção de salvar
  files = event.target.files; //Lista de Arquivos
  console.log(files);
  currentImageId = 0;
  stack.imageIds = [];
  annotations.imageIds = [];
  annotations.states = [];
  annotations.bones = [];
  annotations.organs = [];
  annotations.skins = [];
  annotations.danger = [];

  for (let i = 0; i < files.length; i++) {
    stack.imageIds.push(i);
  }
  cornerstoneTools.addStackStateManager(element, ['stack']);
  cornerstoneTools.addToolState(element, 'stack', stack);

  const apiTool = cornerstoneTools[`${note}Tool`];
  cornerstoneTools.addTool(apiTool);
  cornerstoneTools.toolColors.setToolColor('rgb(255, 255, 0)');
  cornerstoneTools.setToolActive(note, { mouseButtonMask: 2 })

  for (let i = 0; i < files.length; i++) {
    annotations.imageIds.push(i);
    annotations.states.push([]);
    annotations.bones.push([]);
    annotations.skins.push([]);
    annotations.organs.push([]);
    annotations.danger.push([]);

  }
  cornerstoneTools.addTool(PanTool)
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

  cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 })
  updateImage(currentImageId);
});

radios.forEach(function (radio) {
  radio.addEventListener("change", function () {
    if (radio.checked) {

      switch (radio.value) {
        case "1":
          saveByColor(currentColor, currentImageId);
          currentColor = "yellow";
          cornerstoneTools.toolColors.setToolColor('rgb(255, 255, 0)');
          break;
        case "2":
          saveByColor(currentColor, currentImageId);
          currentColor = "purple";
          cornerstoneTools.toolColors.setToolColor('rgb(255, 0, 255)');
          break;
        case "3":
          saveByColor(currentColor, currentImageId);
          currentColor = "green";
          cornerstoneTools.toolColors.setToolColor('rgb(0, 255, 0)');
          break;
        case "4":
          saveByColor(currentColor, currentImageId);
          currentColor = "red";
          cornerstoneTools.toolColors.setToolColor('rgb(255,0, 0)');
          break;
      }
      const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(files[currentImageId]);

      cornerstone.loadImage(imageId).then(function (image) {
        const viewport = cornerstone.getDefaultViewportForImage(element, image);
        cornerstone.displayImage(element, image, viewport);
        loadAnnotations(currentImageId);
      });
    }
  });
});

element.addEventListener('wheel', (e) => {
  if (files.length === 0) return
  if (currentImageId >= 0 && currentImageId < files.length) {
    if (e.wheelDelta < 0 || e.detail > 0) {
      if (currentImageId > 0) {
        saveByColor(currentColor, currentImageId);
        currentImageId--;
      }
    } else {
      if (currentImageId < files.length - 1 && currentImageId >= 0) {
        saveByColor(currentColor, currentImageId);
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
    saveByColor(currentColor, currentImageId);
  }
  updateImage(currentImageId);
});

function updateImage(newImageId) {
  cornerstoneTools.clearToolState(element, note);
  currentImageId = newImageId;
  stack.currentImageIdIndex = newImageId;
  annotations.currentImageId = newImageId;

  const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(files[currentImageId]);
  cornerstone.loadImage(imageId).then(function (image) {
    const viewport = cornerstone.getDefaultViewportForImage(element, image);
    cornerstone.displayImage(element, image, viewport);
    loadAnnotations(currentImageId);
  });
}

function loadAnnotations(imageId) {
  if (annotations.states[imageId]) {
    for (const el of annotations.states[imageId]) {
      cornerstoneTools.addToolState(element, note, el);
    }
  }
}

function saveByColor(color, imageId) {

  const currentState = cornerstoneTools.getToolState(element, note);
  if (currentState && currentState.data.length > 0) {

    for (const el of currentState.data) {
      if (el.color === undefined) {
        el.color = color;
      }
    }

    annotations.states[imageId] = currentState.data;
  }
}

function editVisibility(color, visible) {

  for (const element of annotations.states) {
    for (const el of element) {
      if (el.color == color) {
        el.visible = visible;
      }
    }
  }

  console.log(annotations.states)
}
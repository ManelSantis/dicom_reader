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
//let isInitialized = false;

export const ShowFunctions = (archive_id) => {

    let fileList;
    let imageListDownload;
    let imageList;
    let currentImageId = 0;
    const note = 'ArrowAnnotate';

    const stack = { currentImageIdIndex: 0, imageIds: [], };
    const annotations = { currentImageId, imageIds: [], states: [] };

    let element = document.getElementById('dicomImage');

    const initialize = async () => {
        //if (isInitialized) return;
        //isInitialized = true;

        try {

            fileList = await fetchData();

            const promises = fileList.map(file => getImageByPath(file.image_path));

            const imageBlobs = await Promise.all(promises);

            imageListDownload = new Set();

            imageBlobs.forEach(dcmData => {
                const blob = new Blob([dcmData]);
                imageListDownload.add(blob);
            });
            console.log(imageListDownload)
            imageList = Array.from(imageListDownload);

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
        })
    }

    function loadAnnotations(imageId) {
        if (annotations.states[imageId]) {
            for (const annotation of annotations.states[imageId]) {
                cornerstoneTools.addToolState(element, note, annotation);
            }
        }
    }

    return {
        initialize: initialize
    };
};

export default ShowFunctions;

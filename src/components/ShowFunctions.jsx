import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import { getImageByArchive } from '../services/GetImage.js';

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

export const ShowFunctions = (archive_id) => {

    let fileList;
    let currentImageId = 0;

    const stack = { currentImageIdIndex: 0, imageIds: [], };
    const annotations = { currentImageId, imageIds: [], states: [] };

    let element = document.getElementById('dicomImage');

    const initialize = () => {

        const fetchData = async () => {
            try {
                const data = await getImageByArchive(archive_id);
                console.log(data);
                return data;
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };
        fileList = fetchData();
        cornerstone.enable(element);

        element.addEventListener('wheel', handleMouseWheel);

        currentImageId = 0;
        stack.imageIds = [];
        annotations.imageIds = [];

        for (let i = 0; i < fileList.length; i++) {
            stack.imageIds.push(i);
            annotations.imageIds.push(i);
            annotations.states.push([]);
        }

        updateImage(currentImageId);
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
        //cornerstoneTools.clearToolState(element, note);
        currentImageId = newImageId;

        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(fileList[currentImageId]);
        cornerstone.loadImage(imageId).then(function (image) {
            const viewport = cornerstone.getDefaultViewportForImage(element, image);
            cornerstone.displayImage(element, image, viewport);
            //loadAnnotations(currentImageId);
        }).catch((error) => {
            console.error('Error loading image:', error);
        });
    }

    return {
        initialize: initialize
    };
};

export default ShowFunctions;

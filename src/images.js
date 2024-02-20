import cornerstone from 'cornerstone-core';
import dicomParser from 'dicom-parser';

import { getArchiveById, getImageByArchive } from './services/GetArchive.js';

const getArchive = document.getElementById('getArchive');
const element = document.getElementById('dicomImage');

const archiveData = { archive_id: 0, archive_name: '', archive_date: '' };
const imagesData = { archive_id: [], image_id: [], image_path: '' };

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstone.enable(element);

getArchive.addEventListener('click', async function () {

    try {
        const response = await getArchiveById(42);
        archiveData.archive_id = response[0].archive_id;
        archiveData.archive_name = response[0].archive_name;
        archiveData.archive_date = response[0].archive_date;
    } catch (error) {
        console.error(error);
    }
    console.log(archiveData)

    try {
        const response = await getImageByArchive(42);
        console.log(response);

        fetch('http://localhost:5173/99226b8f-c9fe-4d04-90f3-2391952b49d2')
  .then(response => response.blob())
  .then(blob => {
    const novoBlob = new Blob([blob], { type: 'application/DICM' });
    console.log(blob);
    const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(novoBlob);
    console.log(imageId)
        cornerstone.loadImage(imageId).then(function (image) {
            const viewport = cornerstone.getDefaultViewportForImage(element, image);
            cornerstone.displayImage(element, image, viewport);
        });
  })
  .catch(error => {
    console.error('Erro ao recuperar o Blob:', error);
  });

        
    } catch (error) {
        console.error(error);
    }


});
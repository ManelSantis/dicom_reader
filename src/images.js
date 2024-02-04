import { getArchiveById, getImageByArchive } from './services/GetArchive.js';

const getArchive = document.getElementById('getArchive');

const archiveData = {archive_id: 0, archive_name: '', archive_date: '' };
const imagesData = {archive_id: [], image_id: [], image_path: '' };


getArchive.addEventListener('click', async function () {
    
    try {
        const response = await getArchiveById(34);
        archiveData.archive_id = response[0].archive_id;
        archiveData.archive_name = response[0].archive_name;
        archiveData.archive_date = response[0].archive_date;
    } catch (error) {
        console.error(error);
    }

    try {
        const response = await getImageByArchive(archiveData.archive_id);
        console.log(response);
    } catch (error) {
        console.error(error);
    }
});
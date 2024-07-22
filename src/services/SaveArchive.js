import queries from './queries.js';

function getToken() {
    return localStorage.getItem('token');
}

export async function addArchive(archiveData) {
    try {
        const token = getToken();
        const response = await fetch(queries.dataBaseURL + 'api/v1/archive/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(archiveData)
        });

        if (!response.ok) {
            throw new Error('Erro ao adicionar arquivo.');
        }

        const responseData = await response.text();
        const jsonData = JSON.parse(responseData);
        console.log(jsonData)
        return jsonData;
    } catch (error) {
        console.error('Erro:', error.message);
        throw error;
    }
}

export async function addImage(imageData, archive_id) {
    try {
        const token = getToken();
        const response = await fetch(queries.dataBaseURL + 'api/v1/archive/image/' + archive_id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(imageData)
        });

        if (!response.ok) {
            throw new Error('Erro ao adicionar imagem.');
        }

        const responseData = await response.text();
        const jsonData = JSON.parse(responseData);
        console.log(jsonData)

        return jsonData;
    } catch (error) {
        console.error('Erro:', error.message);
        throw error;
    }
}

export async function addNote(noteData, image_id) {
    try {
        const token = getToken();
        const response = await fetch(queries.dataBaseURL + 'api/v1/archive/image/note/' + image_id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(noteData)
        });

        if (!response.ok) {
            throw new Error('Erro ao adicionar nota.');
        }

        const responseData = await response.text();
        const jsonData = JSON.parse(responseData);
        console.log(jsonData)

        return jsonData;
    } catch (error) {
        console.error('Erro:', error.message);
        throw error;
    }
}

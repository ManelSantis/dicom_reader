import queries from './queries.js';

export async function deleteArchiveById(archive_id) {
    try {
        const response = await fetch(queries.dataBaseURL + 'api/v1/archive/' + archive_id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao deletar arquivo.');
        }

        const responseData = await response.json(); 
        return responseData;
    } catch (error) {
        console.error('Erro:', error.message);
        throw error;
    }
};

export async function deleteImageById(archive_id) {
    try {
        const response = await fetch(queries.dataBaseURL + 'api/v1/image/' + archive_id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao deletar arquivo.');
        }

        const responseData = await response.json(); 
        return responseData;
    } catch (error) {
        console.error('Erro:', error.message);
        throw error;
    }
};

export async function deleteNoteById(image_id) {
    try {
        const response = await fetch(queries.dataBaseURL + 'api/v1/note/' + image_id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao deletar arquivo.');
        }

        const responseData = await response.json(); 
        return responseData;
    } catch (error) {
        console.error('Erro:', error.message);
        throw error;
    }
};
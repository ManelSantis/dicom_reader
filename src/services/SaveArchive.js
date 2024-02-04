import queries from './queries.js';

export async function addArchive(archiveData) {
    try {
        const response = await fetch(queries.dataBaseURL + 'api/v1/archive/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(archiveData)
        });

        if (!response.ok) {
            throw new Error('Erro ao adicionar arquivo.');
        }

        // Verifique o conteúdo da resposta
        const responseData = await response.text();

        // Parse JSON apenas se for um JSON válido
        const jsonData = JSON.parse(responseData);
        return jsonData;
    } catch (error) {
        console.error('Erro:', error.message);
        throw error;
    }
};

export async function addImage(imageData, archive_id) {
    try {
        const response = await fetch(queries.dataBaseURL + 'api/v1/archive/image/' + archive_id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(imageData)
        });

        if (!response.ok) {
            throw new Error('Erro ao adicionar imagem.');
        }

        // Verifique o conteúdo da resposta
        const responseData = await response.text();

        // Parse JSON apenas se for um JSON válido
        const jsonData = JSON.parse(responseData);
        return jsonData;
    } catch (error) {
        console.error('Erro:', error.message);
        throw error;
    }
};

export async function addNote(noteData, image_id) {
    try {
        const response = await fetch(queries.dataBaseURL + 'api/v1/archive/image/note/' + image_id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
        });

        if (!response.ok) {
            throw new Error('Erro ao adicionar nota.');
        }

        // Verifique o conteúdo da resposta
        const responseData = await response.text();

        // Parse JSON apenas se for um JSON válido
        const jsonData = JSON.parse(responseData);
        return jsonData;
    } catch (error) {
        console.error('Erro:', error.message);
        throw error;
    }
};
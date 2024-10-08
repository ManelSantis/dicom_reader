import queries from './queries.js';

export async function getArchiveById(archive_id) {
    try {
        const response = await fetch(queries.dataBaseURL + 'api/v1/archive/' + archive_id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao encontrar arquivo.');
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

export async function getArchiveByAnimalLocal(archive_animal, archive_local) {
    try {
        const response = await fetch(queries.dataBaseURL + 'api/v1/archive/animal/' + archive_animal + "/local/" + archive_local, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao encontrar arquivo.');
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

export async function getArchiveByAnimal(archive_animal) {
    try {
        const response = await fetch(queries.dataBaseURL + 'api/v1/archive/animal/' + archive_animal, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao encontrar arquivo.');
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

export async function getArchiveByName(archive_name) {
    try {
        const response = await fetch(queries.dataBaseURL + 'api/v1/archive/archiveNames/' + archive_name, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    
        const responseData = await response.text();

        const jsonData = JSON.parse(responseData);
        return jsonData;
    } catch (error) {
        console.error('Erro:', error.message);
        throw error;
    }
};
import queries from './queries.js';

export async function getImageByArchive(archive_id) {
    try {
        const response = await fetch(queries.dataBaseURL + 'api/v1/archive/image/' + archive_id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao encontrar imagem.');
        }

        // Verifique o conteúdo da resposta
        const responseData = await response.text();

        // Parse JSON apenas se for um JSON válido
        const jsonData = JSON.parse(responseData);
        console.log(jsonData)
        return jsonData;
    } catch (error) {
        console.error('Erro:', error.message);
        throw error;
    }
};
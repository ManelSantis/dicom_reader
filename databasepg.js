const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');

const app = express();
const port = 5173;

const client = new Client({
  user: 'admin',
  host: 'localhost',
  database: 'dicom_reader',
  password: '123456',
  port: 5432,
});

//Middleware para JSON no corpo da solicitação
app.use(bodyParser.json());

//Rota para salvar um novo arquivo com todas as imagens e anotações nela
app.post('/saveArchive', async (req, res) => {
    const { archive_name, archive_date, imagesWithAnnotations } = req.body;

    try {
        // Inserir na tabela archive
        const archiveResult = await pool.query(
            'INSERT INTO archive (archive_name, archive_date) ' + 
            'VALUES ($1, $2) RETURNING archive_id', 
            [archive_name, archive_date]);

        // Obter o archive_id gerado automaticamente
        const archiveId = archiveResult.rows[0].archive_id;

        // Adicionar imagens para esse arquivo
        for (const imageData of imagesWithAnnotations) {

            const { image_path, notes } = imageData;

            // Inserir na tabela images associada ao archive_id
            const imageResult = await pool.query(
                'INSERT INTO images (image_path, archive_id) ' + 
                'VALUES ($1, $2) RETURNING image_id', 
                [image_path, archiveId]);

            // Obter o image_id gerado automaticamente
            const imageId = imageResult.rows[0].image_id;

            // Iterar sobre as anotações e inserir na tabela note associada ao image_id
            for (const noteData of notes) {
                const { note_positionx, note_positiony, note_color, note_text } = noteData;
                await pool.query('INSERT INTO note ' +
                '(note_positionx, note_positiony, note_color, note_text, image_id) ' + 
                'VALUES ($1, $2, $3, $4, $5)', 
                [note_positionx, note_positiony, note_color, note_text, imageId]);
            }
        }
        res.send('Dados, imagens e anotações salvas com sucesso!');
    } catch (erro) {
        console.error('Erro ao salvar dados:', erro);
        res.status(500).send('Erro interno do servidor');
    }
});



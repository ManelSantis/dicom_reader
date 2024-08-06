import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, TextField } from '@mui/material';
import Switch from '@mui/material/Switch';
import React, { useState } from 'react';
import { colorNames } from '../ColorArrays';
import ColorSelect from './ColorSelect';

export const ToolsShowDicom = ({ onSave }) => {
    const [open, setOpen] = useState(false);
    const [annotationName, setAnnotationName] = useState('');
    const [annotationColor, setAnnotationColor] = useState('');
    const [annotations, setAnnotations] = useState([
        { name: 'Osso', color: 'cyan', idSwitch: 'ossoSwitch', idOption: 'osso' },
        { name: 'Órgão', color: 'lime', idSwitch: 'orgaoSwitch', idOption: 'orgao' }
    ]);
    const [error, setError] = useState('');

    const handleOpen = () => {
        setOpen(true);
        setAnnotationColor(getRandomAvailableColor());
    };

    const handleClose = () => {
        setOpen(false);
        setError('');
    };

    const formatAnnotationId = (name) => {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]/g, '')
            .replace(/\s+/g, '');
    };

    const handleSave = () => {
        const idSwitch = formatAnnotationId(annotationName) + 'Switch';
        const idOption = formatAnnotationId(annotationName);

        const isDuplicateId = annotations.some(annotation => annotation.idSwitch === idSwitch || annotation.idOption === idOption);

        if (isDuplicateId) {
            setError('O nome da anotação gera um ID duplicado. Por favor, escolha um nome diferente.');
            return;
        }

        const newAnnotation = { name: annotationName, color: annotationColor, idSwitch, idOption };
        setAnnotations(prevAnnotations => [...prevAnnotations, newAnnotation]);
        if (onSave) {
            onSave(newAnnotation);
        }
        setAnnotationName('');
        setAnnotationColor(getRandomAvailableColor());
        setError('');
        setOpen(false);
    };

    const getRandomAvailableColor = () => {
        const usedColors = annotations.map(annotation => annotation.color);
        const availableColors = colorNames.filter(color => !usedColors.includes(color));
        if (availableColors.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableColors.length);
            return availableColors[randomIndex];
        }
        return ''; // Retorna vazio se não houver cores disponíveis
    };

    const usedColors = annotations.map(annotation => annotation.color);
    const availableColors = colorNames.filter(color => !usedColors.includes(color));

    return (
        <aside className="h-full w-full sm:w-[40%] lg:w-[30%] xl:w-[20%] flex flex-col bg-white border-l-2 border-gray-400">
            <Box role="presentation">
                <label htmlFor="" className="flex b-2 text-lg items-center justify-center font-bold p-4 text-gray-900"> Anotações </label>
                <label htmlFor="typeSpecie" className="block b-2 text-sm font-medium p-4 text-gray-900">Selecione uma Anotação</label>
                <select
                    id="typeSpecie"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm block w-full p-4"
                    name="specie"
                >
                    {annotations.map(annotation => (
                        <option key={annotation.idOption} value={annotation.idOption}>
                            {annotation.name}
                        </option>
                    ))}
                </select>

                <Divider className='pt-4 mb-8 w-full' />
                <label className="block b-2 text-sm font-medium p-4 text-gray-900">Exibir Anotações</label>
                <div id="switchsAnnotations" className='h-[240px] flex flex-col p-4 space-y-4 overflow-y-auto max-h-[240px]'>
                    {annotations.map(annotation => (
                        <div key={annotation.idSwitch} className='flex items-center space-x-4'>
                            <label htmlFor={annotation.idSwitch} className="block text-sm font-medium text-gray-900 w-1/2">{annotation.name}</label>
                            <Switch id={annotation.idSwitch} defaultChecked />
                        </div>
                    ))}
                </div>

                <Divider className='pt-4 mb-8 w-full' />
                <div className='flex items-center justify-center p-4'>
                    <Button id='newTypeAnnotation' variant="contained" className='w-full' onClick={handleOpen}>Novo Tipo</Button>
                </div>
            </Box>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
            >
                <DialogTitle id="dialog-title">
                    Novo Tipo de Anotação
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">
                        Informe o nome e a cor para o novo tipo de anotação.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="annotation-name"
                        label="Nome da Anotação"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={annotationName}
                        onChange={(e) => setAnnotationName(e.target.value)}
                        inputProps={{ maxLength: 17 }}
                        error={Boolean(error)}
                        helperText={error}
                    />
                    <div className="mt-2 mb-2">
                        <label htmlFor="annotation-color" className="block text-sm font-medium text-gray-900">Cor da Anotação</label>
                        <ColorSelect
                            colors={availableColors}
                            value={annotationColor}
                            onChange={setAnnotationColor}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button id="saveA" onClick={handleSave} variant="contained" color="primary">
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </aside>
    );
};

import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, Input, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Switch from '@mui/material/Switch';
import React, { useEffect, useState } from 'react';
import { deleteCover, renameCover, uploadCover } from '../../firebase/firebase';
import { getArchiveByName } from '../../services/GetArchive';
import { getImageByPath } from '../../services/GetImage';
import { colorNames } from '../ColorArrays';
import ColorSelect from './ColorSelect';

export const Annotations = ({ onSave, idSwitchs, colorsImplanted, typeAnnotationsImplanted, nameSwitchs, archiveData, archiveEdit }) => {
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [annotationName, setAnnotationName] = useState('');
    const [annotationColor, setAnnotationColor] = useState('');
    const [annotations, setAnnotations] = useState([]);
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [animalType, setAnimalType] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [patientName, setPatientName] = useState('');
    const [cover, setCover] = useState(null);
    const [errors, setErrors] = useState({});
    const [coverEdit, setCoverEdit] = useState(false);

    useEffect(() => {
        if (idSwitchs && colorsImplanted) {
            const initialAnnotations = idSwitchs.map((idSwitch, index) => ({
                name: nameSwitchs[index],
                color: colorsImplanted[index],
                idSwitch,
                idOption: typeAnnotationsImplanted[index]
            }));
            setAnnotations(initialAnnotations);
        }
    }, [idSwitchs, colorsImplanted]);

    const handleOpen = () => {
        setOpen(true);
        setAnnotationColor(getRandomAvailableColor());
    };

    useEffect(() => {
        setTitle(archiveData.archive_name);
        setAnimalType(archiveData.archive_animal);
        setLocation(archiveData.archive_local);
        setDescription(archiveData.archive_description);
        setPatientName(archiveData.archive_patientName);
    }, [archiveData]);

    const handleClose = () => {
        setOpen(false);
        setError('');
    };

    const handleOpenEdit = () => {
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
        setError('');
    };

    const handleCoverChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setCover(event.target.files[0]);
            setCoverEdit(true);
        }
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
        setError('');
        setOpen(false);
    };

    const handleSaveEdit = async () => {
        const newErrors = {};
        let titleEdit = false;
        let coverUrl = archiveData.archive_cover;

        if (!title) newErrors.title = 'Campo Obrigatório';

        if (title !== archiveData.archive_name) {
            const nameExist = await getArchiveByName(title);
            if (nameExist.exists) newErrors.title = nameExist.message;
            titleEdit = true;
        } 
        if (!animalType) newErrors.animalType = 'Campo Obrigatório';
        if (!location) newErrors.location = 'Campo Obrigatório';
        if (!patientName) newErrors.patientName = 'Campo Obrigatório';
        if (!description) newErrors.description = 'Campo Obrigatório';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (coverEdit) {
            deleteCover(archiveData.archive_name);
            coverUrl = await uploadCover(cover, archiveData.archive_name);
            console.log("cover: " + coverUrl)
        }

        if (titleEdit && coverEdit) {
            coverUrl = await renameCover(archiveData.archive_name, cover, title);
            console.log("title e cover: " + coverUrl)
        } else if (titleEdit) {
            async function arrayBufferToFile(arrayBuffer, fileName, mimeType) {
                const blob = new Blob([arrayBuffer], { type: mimeType });
                return new File([blob], fileName, { type: mimeType });
            }   
            const coverFileArrayBuffer = await getImageByPath(archiveData.archive_cover);
            const coverFile = await arrayBufferToFile(coverFileArrayBuffer, 'capa.jpg', 'image/jpeg');
            coverUrl = await renameCover(archiveData.archive_name, coverFile, title);
            console.log("title: " + coverUrl)
        }

        archiveEdit({ title, animalType, location, patientName, coverUrl, description });
        setOpenEdit(false);
        setErrors({});
    }

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
        <>
            <aside className="h-full w-full sm:w-[40%] lg:w-[30%] xl:w-[20%] flex flex-col bg-white border-l-2 border-gray-400">
                <Box role="presentation">
                    <label htmlFor="" className="flex block b-2 text-lg items-center justify-center font-bold p-4 text-gray-900"> Anotações </label>
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
                    <div className='flex items-center justify-center p-4 pt-0 pb-0'>
                        <Button id='saveEdit' variant="contained" className='w-full' onClick={handleOpenEdit}>Salvar Alterações</Button>
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
                            helperText={error} />
                        <div className="mt-2 mb-2">
                            <label htmlFor="annotation-color" className="block text-sm font-medium text-gray-900">Cor da Anotação</label>
                            <ColorSelect
                                colors={availableColors}
                                value={annotationColor}
                                onChange={setAnnotationColor} />
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
            <Dialog
                open={openEdit}
                onClose={handleCloseEdit}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
                sx={{ '& .MuiDialog-paper': { width: '600px', maxWidth: '600px' } }}
            >
                <DialogTitle id="dialog-title">
                    Editar Arquivo
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">
                        Edite as informações do arquivo
                    </DialogContentText>

                    {/* Campo de Título */}
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        label="Título"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={title || archiveData.archive_name}
                        onChange={(e) => setTitle(e.target.value)}
                        error={Boolean(errors.title)}
                        helperText={errors.title} />

                    {/* Campo de Nome do Paciente */}
                    <TextField
                        margin="dense"
                        id="patient-name"
                        label="Nome do Paciente"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={patientName || archiveData.archive_patientName} // Preenchendo com dados existentes
                        error={Boolean(errors.patientName)}
                        helperText={errors.patientName}
                        onChange={(e) => setPatientName(e.target.value)} />

                    {/* Campo de Descrição */}
                    <TextField
                        margin="dense"
                        id="description"
                        label="Descrição"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={description || archiveData.archive_description}
                        error={Boolean(errors.description)}
                        helperText={errors.description}
                        onChange={(e) => setDescription(e.target.value)} />

                    {/* Campo de Tipo do Animal */}
                    <FormControl fullWidth margin="dense" error={Boolean(errors.animalType)}>
                        <InputLabel id="animal-type-label">Tipo do Animal</InputLabel>
                        <Select
                            labelId="animal-type-label"
                            id="animal-type"
                            value={animalType || archiveData.archive_animal}
                            label="Tipo do Animal"
                            onChange={(e) => setAnimalType(e.target.value)}
                        >
                            <MenuItem value={'canino'}>Canino</MenuItem>
                            <MenuItem value={'felino'}>Felino</MenuItem>
                            <MenuItem value={'cateto'}>Cateto</MenuItem>
                            <MenuItem value={'cutia'}>Cutia</MenuItem>
                            <MenuItem value={'moco'}>Mocó</MenuItem>
                        </Select>
                        {Boolean(errors.animalType) &&
                            <Typography variant="caption" color="error" sx={{ fontSize: '0.75rem', marginTop: '4px', marginLeft: '16px' }}>
                                {errors.animalType}
                            </Typography>}
                    </FormControl>

                    {/* Campo de Local */}
                    <FormControl fullWidth margin="dense" error={Boolean(errors.location)}>
                        <InputLabel id="location-label">Local</InputLabel>
                        <Select
                            labelId="location-label"
                            id="location"
                            value={location || archiveData.archive_local} // Preenchendo com dados existentes
                            label="Local"
                            onChange={(e) => setLocation(e.target.value)}
                        >
                            <MenuItem value={'cranio'}>Crânio</MenuItem>
                            <MenuItem value={'coluna_vertebral'}>Coluna Vertebral</MenuItem>
                            <MenuItem value={'membro_toracico'}>Membro Torácico</MenuItem>
                            <MenuItem value={'laringe_faringe'}>Laringe/Faringe</MenuItem>
                            <MenuItem value={'torax'}>Tórax</MenuItem>
                            <MenuItem value={'abdome'}>Abdome</MenuItem>
                            <MenuItem value={'pelve'}>Pelve</MenuItem>
                        </Select>
                        {Boolean(errors.location) &&
                            <Typography variant="caption" color="error" sx={{ fontSize: '0.75rem', marginTop: '4px', marginLeft: '16px' }}>
                                {errors.location}
                            </Typography>}
                    </FormControl>

                    {/* Campo de Capa (Upload de Imagem) */}
                    <FormControl fullWidth margin="dense" sx={{ marginTop: '16px' }}>
                        <InputLabel shrink htmlFor="cover" sx={{ cursor: 'pointer' }}>
                            Capa (JPEG, PNG)
                        </InputLabel>
                        <Input
                            id="cover"
                            type="file"
                            inputProps={{ accept: 'image/jpeg,image/png' }}
                            onChange={handleCoverChange}
                            error={Boolean(errors.cover)} />
                        {cover && <Typography variant="body2" color="textSecondary">{cover.name}</Typography>}
                        {Boolean(errors.cover) &&
                            <Typography variant="caption" color="error" sx={{ fontSize: '0.75rem', marginTop: '4px', marginLeft: '16px' }}>
                                {errors.cover}
                            </Typography>}
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseEdit}>Cancelar</Button>
                    <Button id="save" onClick={handleSaveEdit} variant="contained" color="primary">
                        Atualizar
                    </Button>
                </DialogActions>
            </Dialog>
        </>

    );
};

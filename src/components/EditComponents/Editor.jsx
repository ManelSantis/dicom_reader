import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Fab from '@mui/material/Fab';
import React, { useRef, useState } from 'react';
import { getArchiveByName } from '../../services/GetArchive';

export const Editor = ({ archiveSave, isDisabled }) => {
    const fileInputRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [animalType, setAnimalType] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [patientName, setPatientName] = useState('');
    const [cover, setCover] = useState(null);
    const [errors, setErrors] = useState({});

    const fileInputClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleSave = async () => {
        const newErrors = {};

        if (!title) newErrors.title = 'Campo Obrigatório';

        console.log(title)
        const nameExist = await getArchiveByName(title);

        console.log(nameExist);

        if (nameExist.exists) newErrors.title = nameExist.message;

        if (!animalType) newErrors.animalType = 'Campo Obrigatório';
        if (!location) newErrors.location = 'Campo Obrigatório';
        if (!patientName) newErrors.patientName = 'Campo Obrigatório';
        if (!cover) newErrors.cover = 'Campo Obrigatório';
        if (!description) newErrors.description = 'Campo Obrigatório';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        archiveSave({ title, animalType, location, patientName, cover, description });
        setOpen(false);
        setTitle('');
        setAnimalType('');
        setLocation('');
        setPatientName('');
        setCover(null);
        setDescription('');
        setErrors({});
    };

    const handleClose = () => {
        setOpen(false);
        setErrors({});
    };

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCoverChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setCover(event.target.files[0]); // Salva o arquivo selecionado no estado
        }
    };

    return (
        <>
            <div className="w-full h-[85%] flex items-center justify-center bg-white" onContextMenu={() => false}>
                <div id="dicomImage" className="w-[99%] h-[97%] bg-blue-400 relative">
                    <div className='flex flex-col absolute top-[2%] left-[1%] z-50 space-y-2'>
                        <Fab color="primary" onClick={fileInputClick}>
                            <AddIcon />
                        </Fab>
                        <input type="file" id="fileInput" accept=".dcm" multiple className="hidden" ref={fileInputRef} />
                        <Fab disabled={isDisabled} color="primary" id="save" onClick={handleOpenDialog}>
                            <SaveIcon />
                        </Fab>
                        <Fab color="secondary" id="cancel">
                            <CancelIcon />
                        </Fab>
                    </div>
                </div>
            </div>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
                sx={{ '& .MuiDialog-paper': { width: '600px', maxWidth: '600px' } }}
            >
                <DialogTitle id="dialog-title">
                    Salvar Novo Arquivo
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">
                        Preencha as informações para salvar o arquivo
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
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        error={Boolean(errors.title)}
                        helperText={errors.title}
                    />

                    {/* Campo de Nome do Paciente */}
                    <TextField
                        margin="dense"
                        id="patient-name"
                        label="Nome do Paciente"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={patientName}
                        error={Boolean(errors.patientName)}
                        helperText={errors.patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                    />

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
                        value={description}
                        error={Boolean(errors.description)}
                        helperText={errors.description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    {/* Campo de Tipo do Animal */}
                    <FormControl fullWidth margin="dense" error={Boolean(errors.animalType)}>
                        <InputLabel id="animal-type-label">Tipo do Animal</InputLabel>
                        <Select
                            labelId="animal-type-label"
                            id="animal-type"
                            value={animalType}
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
                            </Typography>
                        }
                    </FormControl>

                    {/* Campo de Local */}
                    <FormControl fullWidth margin="dense" error={Boolean(errors.location)}>
                        <InputLabel id="location-label">Local</InputLabel>
                        <Select
                            labelId="location-label"
                            id="location"
                            value={location}
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
                            </Typography>
                        }
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
                            error={Boolean(errors.cover)}
                        />
                        {cover && <Typography variant="body2" color="textSecondary">{cover.name}</Typography>}
                        {Boolean(errors.cover) &&
                            <Typography variant="caption" color="error" sx={{ fontSize: '0.75rem', marginTop: '4px', marginLeft: '16px' }}>
                                {errors.cover}
                            </Typography>
                        }
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button id="save" onClick={handleSave} variant="contained" color="primary">
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

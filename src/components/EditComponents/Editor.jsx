import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Fab from '@mui/material/Fab';
import React, { useRef, useState } from 'react';

export const Editor = ({ archiveSave, isDisabled }) => {
    const fileInputRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [animalType, setAnimalType] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState('');

    const fileInputClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleSave = () => {
        if (!title || !animalType || !location) {
            setError('Todos os campos são obrigatórios.');
            return;
        }

        archiveSave({ title, animalType, location });
        setOpen(false);
        setTitle('');
        setAnimalType('');
        setLocation('');
        setError('');
    };

    const handleClose = () => {
        setOpen(false);
        setError('');
    };

    const handleOpenDialog = () => {
        setOpen(true);
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
                sx={{ '& .MuiDialog-paper': { width: '400px', maxWidth: '400px' } }}
            >
                <DialogTitle id="dialog-title">
                    Salvar Novo Artigo
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">
                        Preencha as informações para salvar o artigo
                    </DialogContentText>
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
                        error={Boolean(error)}
                        helperText={error}
                    />
                    <FormControl fullWidth margin="dense">
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
                    </FormControl>
                    <FormControl fullWidth margin="dense">
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

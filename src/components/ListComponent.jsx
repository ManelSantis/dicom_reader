import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Alert, Box, Button, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Snackbar, TableCell, TableRow, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteCover, deleteFolder } from '../firebase/firebase';
import { deleteArchiveById, deleteImageById, deleteNoteById } from '../services/DeleteService';
import { getImageByArchive } from '../services/GetImage';
import { useLogin } from './LoginProvider';

export const ListComponent = ({ id, name, date, countImages, local, animal, isEven, cover, description, patientName }) => {
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false); // Estado para controlar o Dialog
    const [deleteMessage, setDeleteMessage] = useState('');
    const { isLogin } = useLogin();

    const formatDate = (dateString) => {
        if (!dateString) return '00/00/0000';

        const dateObj = new Date(dateString);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const rowColor = isEven ? '#EDF8E9' : '#C7D0D6';

    // Função para abrir o diálogo de confirmação
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    // Função para fechar o diálogo de confirmação
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // Função para confirmar a deleção
    const handleConfirmDelete = async () => {
        deleteFolder(id);
        deleteCover(name);
        const data = await getImageByArchive(id);

        for (let i = 0; i < data.length; i++) {
            deleteNoteById(data[i].image_id);
        }

        deleteImageById(id);
        deleteArchiveById(id);
        
        setDeleteMessage('Arquivo deletado com sucesso!')
        setOpenDialog(false);
    };

    return (
        <>
            <TableRow>
                <TableCell align="center" sx={{ bgcolor: rowColor, fontWeight: 'bold' }}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="center" sx={{ bgcolor: rowColor, fontWeight: 'bold' }}>{id}</TableCell>
                <TableCell align="center" sx={{ bgcolor: rowColor, fontWeight: 'bold' }}>
                    <Link to={`/${animal}/${id}`}>{name}</Link>
                </TableCell>
                <TableCell align="center" sx={{ bgcolor: rowColor, fontWeight: 'bold' }}>{local}</TableCell>
                <TableCell align="center" sx={{ bgcolor: rowColor, fontWeight: 'bold' }}>{formatDate(date)}</TableCell>
                <TableCell align="center" sx={{ bgcolor: rowColor, fontWeight: 'bold' }}>{countImages}</TableCell>
                {isLogin && <TableCell align="center" sx={{ bgcolor: rowColor, fontWeight: 'bold', cursor: 'pointer' }}>
                    <Link to={`/edit/${id}`}>
                        <IconButton
                            aria-label="edit row"
                            size="small"
                        >
                            <CreateIcon />
                        </IconButton>
                    </Link>
                </TableCell>
                }

                {isLogin && <TableCell align="center" sx={{ bgcolor: rowColor, fontWeight: 'bold', cursor: 'pointer' }}>
                    <IconButton
                        aria-label="delete row"
                        size="small"
                        onClick={handleOpenDialog} // Abrir o diálogo ao clicar no botão delete
                    >
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
                }
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: rowColor }} colSpan={isLogin ? 8 : 6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                {patientName}
                            </Typography>
                            <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                                <img
                                    src={cover}
                                    alt="Cover"
                                    style={{
                                        width: '100%',
                                        maxWidth: '400px',
                                        height: '260px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Box sx={{ marginRight: 12 }}>
                                    <Typography variant="body1" gutterBottom>
                                        {description}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>

            {/* Diálogo de confirmação de deleção */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Tem certeza que deseja deletar este item?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Esta ação não pode ser desfeita. Tem certeza que deseja continuar?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDelete} variant="contained" color="secondary" autoFocus>
                        Deletar
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={!!deleteMessage}
                autoHideDuration={1000}
                onClose={() => {
                    setDeleteMessage('');
                    window.location.reload(); // Recarregar a página ao fechar o Snackbar
                }}
            >
                <Alert onClose={() => {
                    setDeleteMessage('');
                    window.location.reload(); // Recarregar a página ao fechar o Alert manualmente
                }}
                    severity="error" sx={{ width: '100%' }}>
                    {deleteMessage}
                </Alert>
            </Snackbar>

        </>
    );
};

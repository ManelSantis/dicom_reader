import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Collapse, IconButton, TableCell, TableRow, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from './LoginProvider';

export const ListComponent = ({ id, name, date, countImages, local, animal, isEven, cover, description, patientName }) => {
    const [open, setOpen] = useState(false);
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
                            aria-label="expand row"
                            size="small"
                        >
                            <CreateIcon />
                        </IconButton>
                    </Link>
                </TableCell>
                }

                {isLogin && <TableCell align="center" sx={{ bgcolor: rowColor, fontWeight: 'bold', cursor: 'pointer' }}>
                    <Link to={``}>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Link>
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
        </>
    );
};


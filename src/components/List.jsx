import {
    Box,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArchiveByAnimal } from '../services/GetArchive';
import { ListComponent } from './ListComponent';

export const List = () => {
    const { archive_animal } = useParams();
    const [archiveData, setArchiveData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id'); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await getArchiveByAnimal(archive_animal);
                setArchiveData(data);
                setFilteredData(data);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
        setCurrentPage(0);
    }, [archive_animal]);

    useEffect(() => {
        const results = archiveData.filter(item =>
            item.archive_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(results);
        setCurrentPage(0);
    }, [searchTerm, archiveData]);

    useEffect(() => {
        const sortedData = [...filteredData].sort((a, b) => {
            if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
            if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredData(sortedData);
    }, [order, orderBy]);

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(0);
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const indexOfLastItem = currentPage * rowsPerPage + rowsPerPage;
    const indexOfFirstItem = currentPage * rowsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            {isLoading ? (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div className='w-[300px] h-[300px] rounded-lg flex flex-col bg-white items-center justify-center space-y-8'>
                        <Typography variant="h6" gutterBottom>Carregando...</Typography>
                        <CircularProgress />
                    </div>
                </div>
            ) : (
                <>
                    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                        <TextField
                            label="Pesquisar por nome"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ mb: 2, width: '90%', maxWidth: '80%' }}
                        />
                        <TableContainer component={Paper} sx={{ width: '90%', maxWidth: '80%' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            align="center"
                                            sx={{ bgcolor: '#172452', fontWeight: 'bold', color: '#F1FAEE', cursor: 'pointer' }}
                                            onClick={() => handleRequestSort('id')}
                                        >
                                            ID {orderBy === 'id' ? (order === 'asc' ? '▲' : '▼') : ''}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{ bgcolor: '#172452', fontWeight: 'bold', color: '#F1FAEE', cursor: 'pointer' }}
                                            onClick={() => handleRequestSort('archive_name')}
                                        >
                                            Nome {orderBy === 'archive_name' ? (order === 'asc' ? '▲' : '▼') : ''}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{ bgcolor: '#172452', fontWeight: 'bold', color: '#F1FAEE', cursor: 'pointer' }}
                                            onClick={() => handleRequestSort('archive_local')}
                                        >
                                            Local {orderBy === 'archive_local' ? (order === 'asc' ? '▲' : '▼') : ''}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{ bgcolor: '#172452', fontWeight: 'bold', color: '#F1FAEE', cursor: 'pointer' }}
                                            onClick={() => handleRequestSort('archive_date')}
                                        >
                                            Data de Armazenamento {orderBy === 'archive_date' ? (order === 'asc' ? '▲' : '▼') : ''}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{ bgcolor: '#172452', fontWeight: 'bold', color: '#F1FAEE', cursor: 'pointer' }}
                                            onClick={() => handleRequestSort('quantimage')}
                                        >
                                            Quantidade de Imagens {orderBy === 'quantimage' ? (order === 'asc' ? '▲' : '▼') : ''}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentItems.map((item, index) => (
                                        <ListComponent
                                            key={index}
                                            id={item.archive_id}
                                            name={item.archive_name}
                                            date={item.archive_date}
                                            countImages={item.quantimage}
                                            animal={archive_animal}
                                            local={item.archive_local}
                                            isEven={index % 2 === 0}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 15, 20]}
                                component="div"
                                count={filteredData.length}
                                rowsPerPage={rowsPerPage}
                                page={currentPage}
                                labelRowsPerPage="Linhas por página:"
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>
                    </Box>
                </>
            )}
        </>
    );
};

import { TableCell, TableRow } from '@mui/material';
import { Link } from 'react-router-dom';

export const ListComponent = ({ id, name, date, countImages, local, animal, isEven }) => {
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
        <TableRow >
            <TableCell align="center" sx={{ bgcolor: rowColor, fontWeight: 'bold' }} >{id}</TableCell>
            <TableCell align="center" sx={{ bgcolor: rowColor, fontWeight: 'bold' }}>
                <Link to={`/${animal}/${id}`}>{name}</Link>
            </TableCell>
            <TableCell align="center" sx={{ bgcolor: rowColor, fontWeight: 'bold' }}>{local}</TableCell>
            <TableCell align="center" sx={{ bgcolor: rowColor, fontWeight: 'bold' }}>{formatDate(date)}</TableCell>
            <TableCell align="center" sx={{ bgcolor: rowColor, fontWeight: 'bold' }}>{countImages}</TableCell>
        </TableRow>
    );
};

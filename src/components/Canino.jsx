import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArchiveByAnimalLocal } from '../services/GetArchive';

export const Canino = () => {
    const [archiveData, setArchiveData] = useState([]);
    const archiveAnimal = 'canino'; 
    const archiveLocal = 'cranio'; 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getArchiveByAnimalLocal(archiveAnimal, archiveLocal);
                console.log(data);
                setArchiveData(data);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };
        fetchData();
    }, [archiveAnimal, archiveLocal]); 

    
    return (
        <div>
            <h2>CANINO</h2>
            <ul>
                {/* Mapeia `archiveData` para criar uma lista */}
                {archiveData.map((item, index) => (
                    <li key={index}> <Link to={`/canino/${item.archive_id}`}>{item.archive_name}</Link></li>
                ))}
            </ul>
        </div>
    )
}
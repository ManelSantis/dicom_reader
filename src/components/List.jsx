import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArchiveByAnimal } from '../services/GetArchive';
import { ListComponent } from './ListComponent';


export const List = () => {
    const { archive_animal } = useParams();
    const [archiveData, setArchiveData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getArchiveByAnimal(archive_animal);
                setArchiveData(data);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };
        fetchData();
        setCurrentPage(1);
    }, [archive_animal]);

    // Calcular os índices de início e fim dos itens da página atual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = archiveData.slice(indexOfFirstItem, indexOfLastItem);

    // Calcular o número total de páginas
    const totalPages = Math.ceil(archiveData.length / itemsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <>
            <div className="flex justify-center items-center w-full">
                <table className="w-[80%] mt-10 text-center text-sm rounded-lg ">
                    <thead className="text-xs uppercase border-b border-t border-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 bg-[#2C536B] text-[#F1FAEE]">
                                ID
                            </th>
                            <th scope="col" className="px-6 py-3 bg-[#EDF8E9] w-[40%]">
                                Nome
                            </th>
                            <th scope="col" className="px-6 py-3 bg-[#2C536B] text-[#F1FAEE]">
                                Local
                            </th>
                            <th scope="col" className="px-6 py-3 bg-[#EDF8E9]">
                                Data de Armazenamento
                            </th>
                            <th scope="col" className="px-6 py-3 bg-[#2C536B] text-[#F1FAEE] w-[5%]">
                                Quantidade de Imagens
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Mapeia `currentItems` para criar uma lista */}
                        {currentItems.map((item, index) => (
                            <ListComponent
                                key={index}
                                id={item.archive_id}
                                name={item.archive_name}
                                date={item.archive_date}
                                countImages={0} 
                                animal={archive_animal}
                                local={item.archive_local }/>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="flex justify-center items-center w-full mt-6">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:hover:bg-gray-300"
                >
                    <i className="fa-solid fa-angles-left"></i>
                </button>
                <span className="px-4 py-2">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:hover:bg-gray-300"
                >
                    <i className="fa-solid fa-angles-right"></i>

                </button>
            </div>
        </>
    );
};

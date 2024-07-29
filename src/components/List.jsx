import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArchiveByAnimal } from '../services/GetArchive';
import { ListComponent } from './ListComponent';

export const List = () => {
    const { archive_animal } = useParams();
    const [archiveData, setArchiveData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await getArchiveByAnimal(archive_animal);
                setArchiveData(data);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            } finally {
                setIsLoading(false);
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
            {isLoading ? (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div className='w-[90%] md:w-[25%] h-[300px] rounded-lg flex flex-col bg-white items-center justify-center p-4'>
                        <div className='mb-4 text-lg pb-4'>Carregando...</div>
                        <div role="status">
                            <svg aria-hidden="true" className="w-24 h-24 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex justify-center items-center w-full">
                        <table className="w-[90%] md:w-[80%] mt-10 text-center text-sm rounded-lg">
                            <thead className="text-xs uppercase border-b border-t border-gray-700">
                                <tr>
                                    <th scope="col" className="px-2 md:px-6 py-3 bg-[#2C536B] text-[#F1FAEE]">
                                        ID
                                    </th>
                                    <th scope="col" className="px-2 md:px-6 py-3 bg-[#EDF8E9] w-[40%]">
                                        Nome
                                    </th>
                                    <th scope="col" className="px-2 md:px-6 py-3 bg-[#2C536B] text-[#F1FAEE]">
                                        Local
                                    </th>
                                    <th scope="col" className="px-2 md:px-6 py-3 bg-[#EDF8E9]">
                                        Data de Armazenamento
                                    </th>
                                    <th scope="col" className="px-2 md:px-6 py-3 bg-[#2C536B] text-[#F1FAEE] w-[5%]">
                                        Quantidade de Imagens
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item, index) => (
                                    <ListComponent
                                        key={index}
                                        id={item.archive_id}
                                        name={item.archive_name}
                                        date={item.archive_date}
                                        countImages={item.quantimage}
                                        animal={archive_animal}
                                        local={item.archive_local} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-center items-center w-full mt-6">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="px-2 md:px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:hover:bg-gray-300"
                        >
                            <i className="fa-solid fa-angles-left"></i>
                        </button>
                        <span className="px-2 md:px-4 py-2">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="px-2 md:px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:hover:bg-gray-300"
                        >
                            <i className="fa-solid fa-angles-right"></i>
                        </button>
                    </div>
                </>
            )}
        </>
    );
};

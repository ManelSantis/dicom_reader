import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ImagesCarousel } from "./EditComponents/EditorComponents/ImagesCarousel";
import { ResizableDraggableDiv } from './ShowDicomComponents/ResizableDraggableDiv';
import { Sliders } from './ShowDicomComponents/Sliders';
import ShowFunctions from './ShowFunctions';

export const ShowDicom = () => {
    const { archive_id } = useParams();
    const [newHeight, setNewHeight] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [pseudoColor, setPseudoColor] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState('');
    const [showInformations, setShowInformations] = useState(false);
    const [dicomData, setDicomData] = useState([]);
    const [currentImage, setCurrentImage] = useState(0);
    const [totalImages, setTotalImages] = useState(0);

    const showInformationsFunction = () => {
        setShowInformations(!showInformations);
    };

    useEffect(() => {
        function updateHeight() {
            const navbarHeight = document.querySelector('nav').offsetHeight;
            const windowHeight = window.innerHeight;
            const calculatedHeight = windowHeight - navbarHeight;
            setNewHeight(calculatedHeight);
        }

        window.addEventListener('resize', updateHeight);

        updateHeight();

        return () => window.removeEventListener('resize', updateHeight);

    }, []);

    useEffect(() => {
        const input = ShowFunctions(archive_id, setProgress, setProgressMessage, setIsLoading, setDicomData, setCurrentImage, setTotalImages, setPseudoColor);
        input.initialize();
        console.log(dicomData)
    }, [archive_id]);

    return (
        <>
            {pseudoColor && <ResizableDraggableDiv />}
            <div style={{ height: newHeight + 'px' }} className="flex w-full items-center bg-black" onContextMenu={() => false}>
                <div className='w-[80%] h-full'>
                    <div id="dicomImage" className="w-full h-[90%] bg-black"> </div>
                    <ImagesCarousel totalImages={totalImages} currentImage={currentImage} />
                </div>
                <div className="w-[20%] p-2 pt-8 h-full bg-[#457B9D] text-[#F1FAEE] font-[600] overflow-y-auto">
                    <div className="w-full  items-center mb-8 text-2xl">
                        <span className="w-full flex flex-col items-center">
                            Ferramentas
                        </span>
                    </div>
                    <Sliders />
                    <div className="w-full flex flex-col bg-[#457B9D] text-[#F1FAEE] font-semibold p-4 space-y-2">
                        <button className="w-full flex items-center justify-center hover:bg-[#7db0cf] mb-4 p-2 rounded" id="pseudo">
                            <i className="fa fa-paint-brush fa-lg mr-2"></i>
                            <span>Pseudocor</span>
                        </button>
                        <button className="w-full flex items-center justify-center hover:bg-[#7db0cf] mb-4 p-2 rounded" id="reset">
                            <i className="fa fa-sync fa-lg mr-2"></i>
                            <span>Restaurar</span>
                        </button>
                        <button className="w-full flex items-center justify-center hover:bg-[#7db0cf] mb-4 p-2 rounded" id="show" onClick={showInformationsFunction}>
                            <i className="fa fa-info fa-lg mr-2"></i>
                            <span>Visualizar Informações</span>
                        </button>
                    </div>

                </div>
                {false && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                        <div className='w-[50%] h-[300px] rounded-lg flex flex-col bg-white items-center justify-center'>
                            <div className=''>{progressMessage}</div>
                            <div className="w-[70%] mt-6 bg-gray-200 rounded-full dark:bg-gray-700">
                                <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-1.5 leading-none rounded-full" style={{ width: `${progress}%` }}> </div>
                            </div>
                        </div>
                    </div>
                )}
                {showInformations && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div className="w-[50%] h-[300px] rounded-lg flex flex-col bg-white p-4 space-y-4">
                        <div className="flex justify-between items-center text-xl font-semibold">
                            <span className="flex items-center justify-center w-full">Informações</span>
                            <button onClick={showInformationsFunction} className="text-gray-500 hover:text-gray-800">
                                <i className="fa-solid fa-times"></i> {/* Ícone de fechar */}
                            </button>
                        </div>
                        <div className="w-full text-gray-900">
                            <p>Nome do paciente: {dicomData[0] || 'Não Encontrado'}</p>
                            <p>Data da imagem: {dicomData[1] || 'Não Encontrado'}</p>
                            <p>Doutor responsável: {dicomData[2] || 'Não Encontrado'}</p>
                            <p>Local: {dicomData[3] || 'Não Encontrado'}</p>
                            <p>Máquina: {dicomData[4] || 'Não Encontrado'}</p>
                            <p>Modelo do equipamento: {dicomData[5] || 'Não Encontrado'}</p>
                            <p>Modalidade: {dicomData[6] || 'Não Encontrado'}</p>
                            <p>Descrição do estudo: {dicomData[7] || 'Não Encontrado'}</p>
                        </div>
                    </div>
                </div>
                
                
                )}
            </div>
        </>
    )
}

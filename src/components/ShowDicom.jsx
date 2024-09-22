import BrushIcon from '@mui/icons-material/Brush';
import ImageSearch from '@mui/icons-material/ImageSearch';
import InfoIcon from '@mui/icons-material/Info';
import RestoreIcon from '@mui/icons-material/Restore';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Switch, Typography } from '@mui/material';
import Fab from '@mui/material/Fab';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArchiveById } from '../services/GetArchive';
import { ResizableDraggableDiv } from './ShowDicomComponents/ResizableDraggableDiv';
import { Sliders } from './ShowDicomComponents/Sliders';
import { ShowFunctions, Switchs } from './ShowFunctions';

export const ShowDicom = () => {
    const { archive_id } = useParams();
    const [archiveData, setArchiveData] = useState({});
    const [newHeight, setNewHeight] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [pseudoColor, setPseudoColor] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState('');
    const [showInformations, setShowInformations] = useState(false);
    const [dicomData, setDicomData] = useState([]);
    const [currentImage, setCurrentImage] = useState(0);
    const [totalImages, setTotalImages] = useState(0);
    const didMountRef = useRef(false);
    const didSwitchRef = useRef(false);
    const [resetSliders, setResetSliders] = useState(false);
    const [annotations, setAnnotations] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);
    const [switchAdd, setSwitchAdd] = useState(false);

    const showInformationsFunction = () => {
        setShowInformations(!showInformations);
    };

    const togglePseudoColor = () => {
        setPseudoColor(!pseudoColor);
    };

    const fetchData = async () => {
        try {
            const data = await getArchiveById(archive_id);
            if (data && data.length > 0) {
                setArchiveData(data[0]);
            } else {
                console.error('Dados recebidos estão vazios ou não no formato esperado.');
            }
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setDataFetched(true);
        }
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
        fetchData();
    }, [archive_id]);

    useEffect(() => {
        if (didMountRef.current || !dataFetched) return;
        didMountRef.current = true;

        ShowFunctions(
            archive_id,
            setProgress,
            setProgressMessage,
            setIsLoading,
            setDicomData,
            setCurrentImage,
            setTotalImages,
            setPseudoColor
        ).initialize();

    }, [archive_id, dataFetched]);

    useEffect(() => {

        if (didSwitchRef.current && !switchAdd) return;
        didSwitchRef.current = true;

        const idSwitchs = archiveData.idSwitchs;
        const colorsImpanted = archiveData.colorsImpanted;
        Switchs({ idSwitchs, colorsImpanted });
    }, [annotations, switchAdd]);

    useEffect(() => {

        if (archiveData && archiveData.nameSwitchs && archiveData.idSwitchs && archiveData.colorsImpanted && archiveData.typeAnnotationsImplanted) {
        console.log(archive_id)
           
            const newAnnotations = archiveData.nameSwitchs.map((name, index) => ({
                name,
                color: archiveData.colorsImpanted[index],
                idSwitch: archiveData.idSwitchs[index],
                idOption: archiveData.typeAnnotationsImplanted[index]
            }));
            setAnnotations(newAnnotations);
            setSwitchAdd(true);
        }

    }, [archiveData, archive_id]);


    const handleReset = () => {
        setResetSliders(prev => !prev);
    };

    return (
        <>
            {pseudoColor && (
                <ResizableDraggableDiv cover={archiveData.archive_cover}/>
            )}
            <div style={{ height: newHeight + 'px' }} className="flex w-full items-center bg-black" onContextMenu={() => false}>
                <div className='w-[80%] h-full'>
                    <div className="w-full h-[85%] flex items-center justify-center bg-white" onContextMenu={() => false}>
                        <div id="dicomImage" className="w-[99%] h-[97%] bg-blue-400 relative">
                            <div className='flex flex-col absolute top-[2%] left-[1%] z-20 space-y-2'>
                                <Fab color="success" id='pseudo' onClick={togglePseudoColor}>
                                    <BrushIcon />
                                </Fab>
                                <input type="file" id="fileInput" accept=".dcm" multiple className="hidden" ref={null} />
                                <Fab color="error" id="reset" onClick={handleReset}>
                                    <RestoreIcon />
                                </Fab>
                            </div>
                            <div className='flex flex-col absolute top-[2%] right-[1%] z-20 space-y-2'>
                                <Fab color="info" id="show" onClick={showInformationsFunction}>
                                    <InfoIcon />
                                </Fab>
                                <Fab color="info" id="cover">
                                    <ImageSearch />
                                </Fab>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center font-bold text-[#1D3557] w-full h-[15%] bg-white border-t-2 border-gray-400">
                        {currentImage} / {totalImages}
                        <Stack spacing={2} shape="rounded" className='pt-4'>
                            <Pagination count={totalImages} page={currentImage} variant="outlined" shape="rounded" />
                        </Stack>
                    </div>
                </div>
                <aside className="h-full w-full sm:w-[40%] lg:w-[30%] xl:w-[20%] flex flex-col bg-white border-l-2 border-gray-400">
                    <Box role="presentation">
                        <label htmlFor="" className="flex b-2 text-lg items-center justify-center font-bold p-2 text-gray-900"> Ferramentas </label>
                        <Sliders reset={resetSliders} />
                        <div className="w-full flex flex-col p-4 space-y-4">
                            <label className="block b-2 text-sm font-medium p-4 text-gray-900">Exibir Anotações</label>
                            <div id="switchsAnnotations" className='h-[240px] flex flex-col p-4 space-y-4 overflow-y-auto max-h-[240px]'>
                                {annotations.map(annotation => (
                                    <div key={annotation.idSwitch} className='flex items-center space-x-4'>
                                        <label htmlFor={annotation.idSwitch} className="block text-sm font-medium text-gray-900 w-1/2">{annotation.name}</label>
                                        <Switch id={annotation.idSwitch} defaultChecked />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Divider className=' w-full' />
                    </Box>
                </aside>
                {isLoading && (
                    <div className="fixed inset-0 flex items-center justify-center flex-col bg-black bg-opacity-80 z-50 space-y-8">
                        <Typography variant="h6" color="white" gutterBottom>Carregando...</Typography>
                        <CircularProgress />
                    </div>
                )}

            </div>
            <Dialog open={showInformations} onClose={showInformationsFunction} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <div className="flex justify-center items-center text-xl font-semibold">
                        <span>Informações</span>
                    </div>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body1" color="textPrimary" paragraph>
                        <strong>Nome do Paciente:</strong> {archiveData.archive_patientName}
                    </Typography>
                    <Typography variant="body1" color="textPrimary" paragraph>
                        <strong>Data do Exame:</strong> {dicomData[1] || 'Não Encontrado'}
                    </Typography>
                    <Typography variant="body1" color="textPrimary" paragraph>
                        <strong>Descrição:</strong> {archiveData.archive_description}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={showInformationsFunction} color="primary">
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

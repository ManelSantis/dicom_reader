import { CircularProgress, Typography } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArchiveById } from '../services/GetArchive';
import { Annotations } from './EditExistComponents/Annotations';
import { Editor } from './EditExistComponents/Editor';
import { EditExistFunctions, Switchs, newTypeAnnotation } from './EditExistFunctions';

export const EditExist = () => {
    const { archive_id } = useParams();
    const [archiveData, setArchiveData] = useState({});
    const [newHeight, setNewHeight] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
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
        if (didMountRef.current || !dataFetched) return;
        didMountRef.current = true;

        EditExistFunctions(
            archive_id,
            setProgress,
            setProgressMessage,
            setIsLoading,
            setDicomData,
            setCurrentImage,
            setTotalImages,
            archiveData
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
        fetchData();
    }, [archive_id]);

    useEffect(() => {

        if (archiveData && archiveData.nameSwitchs && archiveData.idSwitchs && archiveData.colorsImpanted && archiveData.typeAnnotationsImplanted) {

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

    useEffect(() => {
        function updateHeight() {
            const navbarHeight = document.querySelector('nav').offsetHeight;
            const windowHeight = window.innerHeight;
            const calculatedHeight = windowHeight - navbarHeight;
            setNewHeight(calculatedHeight);
        }

        window.addEventListener('resize', updateHeight);
        updateHeight();

        return () => {
            window.removeEventListener('resize', updateHeight);
        };
    }, []);

    const handleAnnotationSave = (annotation) => {
        setAnnotations(prev => [...prev, annotation]);
        newTypeAnnotation({ annotation });
    };

    return (
        <div style={{ height: newHeight + 'px' }} className="flex w-full bg-slate-700">
            <div className="w-[80%] h-full">
                <Editor />
                <div className="flex flex-col items-center justify-center font-bold text-[#1D3557] w-full h-[15%] bg-white border-t-2 border-gray-400">
                    <Stack spacing={2} shape="rounded" className='pt-4'>
                        <Pagination count={totalImages} page={currentImage} variant="outlined" shape="rounded" />
                    </Stack>
                </div>
            </div>
            <Annotations onSave={handleAnnotationSave} idSwitchs={archiveData.idSwitchs} colorsImplanted={archiveData.colorsImpanted} typeAnnotationsImplanted={archiveData.typeAnnotationsImplanted} nameSwitchs={archiveData.nameSwitchs} />
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center flex-col bg-black bg-opacity-80 z-50 space-y-8">
                    <Typography variant="h6" color="white" gutterBottom>Carregando...</Typography>
                    <CircularProgress />
                </div>
            )}
        </div>
    )
}
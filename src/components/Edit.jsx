import { Alert, CircularProgress, Snackbar, Typography } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import React, { useEffect, useRef, useState } from 'react';
import { Annotations } from './EditComponents/Annotations';
import { Editor } from "./EditComponents/Editor";
import { EditFunctions, handleSave, newTypeAnnotation } from "./EditFunctions";
import { useLogin } from './LoginProvider';

export const Edit = () => {
    const { isAdmin, isLogin } = useLogin(); 
    const [newHeight, setNewHeight] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState('');
    const [saveMessage, setSaveMessage] = useState('');
    const [currentImage, setCurrentImage] = useState(0);
    const [totalImages, setTotalImages] = useState(0);
    const [isDisabled, setIsDisabled] = useState(true);
    const [annotations, setAnnotations] = useState([]);
    const [archives, setArchives] = useState([]);
    const didMountRef = useRef(false);


    useEffect(() => {
        if (didMountRef.current) return;
        didMountRef.current = true;

        EditFunctions({
            setCurrentImage,
            setTotalImages,
            setIsDisabled,
        }).initialize();

    }, []);

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

    const handleArchiveSave = (archive) => {
        setArchives(prev => [...prev, archive]);
        handleSave({
            setIsSaving,
            setProgressMessage,
            setSaveMessage,
            archive
        });
    };

    return (
        <div style={{ height: newHeight + 'px' }} className="flex w-full bg-slate-700">
            <div className="w-[80%] h-full">
                <Editor archiveSave={handleArchiveSave} isDisabled={isDisabled} />
                <div className="flex flex-col items-center justify-center font-bold text-[#1D3557] w-full h-[15%] bg-white border-t-2 border-gray-400">
                    {currentImage} / {totalImages}
                    <Stack spacing={2} shape="rounded" className='pt-4'>
                        <Pagination count={totalImages} page={currentImage} variant="outlined" shape="rounded" />
                    </Stack>
                </div>
            </div>
            <Annotations onSave={handleAnnotationSave} />
            {isSaving && (
                <div className="fixed inset-0 flex items-center justify-center flex-col bg-black bg-opacity-80 z-50 space-y-8">
                    <Typography variant="h6" color="white" gutterBottom>{progressMessage}</Typography>
                    <CircularProgress />
                </div>
            )}
            <Snackbar
                open={!!saveMessage}
                autoHideDuration={1500}
                onClose={() => setSaveMessage('')}
            >
                <Alert onClose={() => setSaveMessage('')} severity="success" sx={{ width: '100%' }}>
                    {saveMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

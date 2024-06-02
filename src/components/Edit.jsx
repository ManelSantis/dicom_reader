import { useEffect, useState } from 'react';
import { Annotations } from './EditComponents/Annotations';
import { Editor } from "./EditComponents/Editor";
import { Toolbox } from "./EditComponents/Toolbox";
import EditFunctions from "./EditFunctions";

export const Edit = () => {
    const [newHeight, setNewHeight] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState('');
    const [saveMessage, setSaveMessage] = useState('');

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
        const input = EditFunctions({ setIsSaving, setProgress, setProgressMessage, setSaveMessage });
        input.initialize();
    }, []);

    return (
        <div style={{ height: newHeight + 'px' }} className="flex w-screen bg-slate-700">
            <Toolbox />
            <Editor />
            <Annotations />
            {isSaving && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div className='w-[50%] h-[300px] rounded-lg flex flex-col bg-white items-center justify-center'>
                        <div className=''>{progressMessage}</div>
                        <div className="w-[70%] mt-6 bg-gray-200 rounded-full dark:bg-gray-700">
                            <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-1.5 leading-none rounded-full" style={{ width: `${progress}%` }}> </div>
                        </div>
                    </div>
                </div>
            )}
            {saveMessage && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div className='w-[20%] h-[250px] rounded-lg flex flex-col bg-white items-center justify-center'>
                        <div className=''>{saveMessage}</div>
                        <div className='mt-6'><i className="fa fa-circle-check text-green-500" style={{ fontSize: '90px' }}></i></div>
                    </div>
                </div>
            )}
        </div>
    );
};

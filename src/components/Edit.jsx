import { useEffect, useState } from 'react';
import { Annotations } from './EditComponents/Annotations';
import { Editor } from "./EditComponents/Editor";
import { Toolbox } from "./EditComponents/Toolbox";
import EditFunctions from "./EditFuncions";

export const Edit = () => {

    const [newHeight, setNewHeight] = useState(0);

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
        const input = EditFunctions();
        input.initialize();
    }, []);

    return (
        <div style={{ height: newHeight + 'px' }} className="flex w-screen bg-slate-700">
            <Toolbox />
            <Editor />
            <Annotations />
        </div>
    )
}
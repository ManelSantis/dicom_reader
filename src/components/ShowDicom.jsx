import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ShowFunctions from './ShowFunctions';

export const ShowDicom = () => {
    const { archive_id } = useParams();
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
        const input = ShowFunctions(archive_id);
        input.initialize();
    }, [archive_id]); 

    return (
        <div style={{ height: newHeight + 'px' }} className="w-full items-center bg-black" onContextMenu={() => false}>
                <div id="dicomImage" className="w-full h-full bg-black"> </div>
        </div>
    )
}
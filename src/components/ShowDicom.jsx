import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ShowFunctions from './ShowFunctions';

export const ShowDicom = () => {
    const { archive_id } = useParams();

    useEffect(() => {
        const input = ShowFunctions(archive_id);
        input.initialize();
    }, []);

    return (
        <div className="w-full h-full items-center bg-black" onContextMenu={() => false}>
                <div id="dicomImage" className="w-full h-full bg-black"> </div>
        </div>
    )
}
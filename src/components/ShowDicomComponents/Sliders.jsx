import { Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';

export const Sliders = ({ reset }) => {
    const [sliderSharpness, setSliderSharpness] = useState(0);
    const [sliderGama, setSliderGama] = useState(0);

    const handleSliderSharpnessChange = (event) => {
        setSliderSharpness(event.target.value);
    };

    const handleSliderGamaChange = (event) => {
        setSliderGama(event.target.value);
    };

    useEffect(() => {
        if (reset) {
            setSliderSharpness(0);
            setSliderGama(0);
        }
    }, [reset]);

    return (
        <>
            <Divider className=' w-full' />
            <div className="w-full flex flex-col items-center">
                <label htmlFor="gama" className="block b-2 text-sm font-medium p-4 text-gray-900">
                    <i className="fa fa-sun mr-2"></i> 
                    Brilho
                </label>
                <input
                    id="gama"
                    type="range"
                    value={sliderGama}
                    step="0.01"
                    min="0"
                    max="0.65"
                    onChange={handleSliderGamaChange}
                    className="w-[90%] h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer mb-4"
                />
            </div>
            <div className="w-full flex flex-col items-center">
                <label htmlFor="sharpness" className="block b-2 text-sm font-medium p-4 text-gray-900">
                    <i className="fa fa-adjust mr-2"></i> 
                    Nitidez
                </label>
                <input
                    id="sharpness"
                    type="range"
                    value={sliderSharpness}
                    step="0.01"
                    min="0"
                    max="2.5"
                    onChange={handleSliderSharpnessChange}
                    className="w-[90%] h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer mb-4"
                />
            </div>
            <Divider className=' w-full' />
        </>
    );
};

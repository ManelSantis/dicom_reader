import React, { useState } from 'react';

export const Sliders = () => {
    const [sliderSharpness, setSliderSharpness] = useState(0);
    const [sliderGama, setSliderGama] = useState(0);

    const handleSliderSharpnessChange = (event) => {
        setSliderSharpness(event.target.value);
    };

    const handleSliderGamaChange = (event) => {
        setSliderGama(event.target.value);
    };

    return (
        <>
            <div className="w-full flex flex-col items-center mb-4">
                <label htmlFor="gama" className="flex items-center text-sm mb-2 font-medium text-white">
                    <i className="fa fa-sun mr-2"></i> {/* Ícone de sol */}
                    Brilho
                </label>
                <input
                    id="gama"
                    type="range"
                    value={sliderGama}
                    step="0.01"
                    min="0"
                    max="1"
                    onChange={handleSliderGamaChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-4"
                />
            </div>

            <div className="w-full flex flex-col items-center mb-4">
                <label htmlFor="sharpness" className="flex items-center text-sm mb-2 font-medium text-white">
                    <i className="fa fa-adjust mr-2"></i> {/* Ícone de ajuste */}
                    Nitidez
                </label>
                <input
                    id="sharpness"
                    type="range"
                    value={sliderSharpness}
                    step="0.1"
                    min="0.4"
                    max="5"
                    onChange={handleSliderSharpnessChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-4"
                />
            </div>


        </>
    );
};



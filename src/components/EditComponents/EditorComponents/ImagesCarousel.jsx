import React from 'react';

export const ImagesCarousel = ({totalImages, currentImage}) => {

    return (
        <div className="flex items-center justify-center font-[600] font-bold text-[#1D3557] w-full h-[10%] bg-[#F1FAEE]">
            {currentImage} / {totalImages}
        </div>
    )
}
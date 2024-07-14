import React, { useState } from 'react';

export const MeanMedianButtons = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    return (
        <>
            <button type="button" className="flex items-center w-full p-2 text-base transition duration-75 hover:bg-[#7db0cf] group" onClick={toggleDropdown}>
                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Média e Mediana</span>
                <i className={`w-3 h-3 mr-2 fa-solid ${dropdownVisible ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
            </button>
            <ul className={`${dropdownVisible ? '' : 'hidden'} py-2 space-y-2`}>
                <li className="flex items-center w-full p-1 pl-11 hover:bg-[#7db0cf]">
                    <button id="applyMean3x3">Média 3x3</button>
                </li>
                <li className="flex items-center w-full p-1 pl-11 hover:bg-[#7db0cf]">
                    <button id="applyMean5x5">Média 5x5</button>
                </li>
                <li className="flex items-center w-full p-1 pl-11 hover:bg-[#7db0cf]">
                    <button id="applyMedian3x3">Mediana 3x3 </button>
                </li>
                <li className="flex items-center w-full p-1 pl-11 hover:bg-[#7db0cf]">
                    <button id="applyMedian5x5">Mediana 5x5</button>
                </li>
            </ul>
        </>
    )
}
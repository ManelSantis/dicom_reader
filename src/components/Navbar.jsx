import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const timeoutRef = useRef(null);

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setDropdownVisible(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setDropdownVisible(false);
        }, 200);  // Ajuste o tempo de acordo com a necessidade
    };

    const handleLinkClick = () => {
        setDropdownVisible(false);
    };

    return (
        <nav className='bg-[#1D3557]'>
            <div className="max-w-screen-xl px-4 py-3 mx-auto">
                <div className="flex items-center">
                    <div className="flex flex-row font-[600] mt-0 space-x-8 rtl:space-x-reverse text-lg">
                        <p className='text-[#F1FAEE] pr-10'>Atlas Radiográfico AniSC</p>
                        <Link className='text-[#F1FAEE] hover:underline' to='/'>Home</Link>
                        <Link className='text-[#F1FAEE] hover:underline' to='/edit'>Editor</Link>
                        <Link className='text-[#F1FAEE] hover:underline' to='list/canino'>Canino</Link>
                        <Link className='text-[#F1FAEE] hover:underline' to='list/felino'>Felino</Link>
                        <div
                            className='relative'
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link className='text-[#F1FAEE] hover:underline'>Silvestre</Link>
                            {isDropdownVisible && (
                                <div className='absolute bg-[#1D3557] mt-2 py-2 w-48 border border-black'>
                                    <Link className='block px-4 py-2 text-[#F1FAEE] hover:bg-[#457B9D]' to='list/cateto' onClick={handleLinkClick}>Cateto</Link>
                                    <Link className='block px-4 py-2 text-[#F1FAEE] hover:bg-[#457B9D]' to='list/cutia' onClick={handleLinkClick}>Cutia</Link>
                                    <Link className='block px-4 py-2 text-[#F1FAEE] hover:bg-[#457B9D]' to='list/moco' onClick={handleLinkClick}>Mocó</Link>
                                </div>
                            )}
                        </div>
                        <Link className='text-[#F1FAEE] hover:underline' to='/about'>About</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};
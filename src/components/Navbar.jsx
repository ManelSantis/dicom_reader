import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from './LoginProvider';

export const Navbar = () => {
    const { isAdmin, isLogin, setLogin, setAdmin } = useLogin();
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const timeoutRef = useRef(null);
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setDropdownVisible(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setDropdownVisible(false);
        }, 200);
    };

    const handleLinkClick = () => {
        setDropdownVisible(false);
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        setAdmin(false);
        setLogin(false);
    };

    return (
        <nav className='bg-[#1D3557] w-full border-b border-white flex items-center'>
            <div className="max-w-screen-xl px-4 py-2 mx-auto flex items-center justify-between w-full relative">
                {/* Logo */}
                <div className="text-[#F1FAEE] text-lg font-bold hidden lg:block">
                    Atlas Radiográfico AniSC
                </div>

                {/* Navigation Links */}
                <div className="flex items-center space-x-4 lg:space-x-8 text-lg font-semibold">
                    <Link className='text-[#F1FAEE] hover:underline' to='/'>Home</Link>
                    {isAdmin && <Link className='text-[#F1FAEE] hover:underline' to='/edit'>Editor</Link>}
                    <Link className='text-[#F1FAEE] hover:underline' to='list/canino'>Canino</Link>
                    <Link className='text-[#F1FAEE] hover:underline' to='list/felino'>Felino</Link>

                    {/* Dropdown Menu */}
                    <div className='relative' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <Link className='text-[#F1FAEE] hover:underline' to='#'>Silvestre</Link>
                        {isDropdownVisible && (
                            <div className='absolute bg-[#1D3557] mt-2 py-2 w-48 border border-black'>
                                <Link className='block px-4 py-2 text-[#F1FAEE] hover:bg-[#457B9D]' to='list/cateto' onClick={handleLinkClick}>Cateto</Link>
                                <Link className='block px-4 py-2 text-[#F1FAEE] hover:bg-[#457B9D]' to='list/cutia' onClick={handleLinkClick}>Cutia</Link>
                                <Link className='block px-4 py-2 text-[#F1FAEE] hover:bg-[#457B9D]' to='list/moco' onClick={handleLinkClick}>Mocó</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Authentication Button */}
                <div className="flex items-center">
                    {isLogin ? (
                        <button 
                            onClick={handleLogout} 
                            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg text-sm px-8 py-2'>
                            Logout
                        </button>
                    ) : (
                        <button 
                            onClick={handleLoginClick} 
                            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg text-sm px-8 py-2'>
                            Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

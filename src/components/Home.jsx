import React, { useEffect, useState } from 'react';
import menuImage from '../assets/menu_image.svg';

export const Home = () => {
    const [newHeight, setNewHeight] = useState(0);

    useEffect(() => {
        function updateHeight() {
            const navbarHeight = document.querySelector('nav')?.offsetHeight || 0;
            const windowHeight = window.innerHeight;
            const calculatedHeight = windowHeight - navbarHeight;
            setNewHeight(calculatedHeight);
        }

        window.addEventListener('resize', updateHeight);

        updateHeight();

        return () => window.removeEventListener('resize', updateHeight);

    }, []);

    return (
        <div style={{ height: newHeight + 'px' }} className="w-screen bg-white flex flex-col">
            <div className='flex flex-col lg:flex-row w-full h-full lg:h-[90%]'>
                <div className='flex-1 flex justify-center items-center p-4'>
                    <h1 className="text-[#1D3557] max-w-3xl text-center lg:text-left">
                        <span className="text-2xl lg:text-3xl font-bold">
                            <span className='text-[#7395c4]'>AniSC - </span> Um guia de imagens radiográficas de animais
                        </span>
                        <p className="font-semibold mt-4 text-sm lg:text-lg">
                            Aqui são registradas imagens de <span className='text-[#7395c4]'>diversos animais</span> juntamente com informações veterinárias essenciais. 
                            Essas informações são utilizadas para <span className='text-[#7395c4]'>observações técnicas e educativas</span>, permitindo uma compreensão 
                            detalhada de como os animais se comportam durante o processo de <span className='text-[#7395c4]'>aquisição das imagens.</span>
                        </p>
                    </h1>
                </div>
                <div className='flex-1 flex justify-center items-center p-4'>
                    <img src={menuImage} alt="Menu" className="w-full max-w-lg lg:max-w-xl" />
                </div>
            </div>
            <footer className="flex flex-col justify-center items-center w-full h-[10%] text-[#0a131f] pb-8 text-center bg-gray-100">
                <div className="text-sm">
                    © 2024 AniSC. Todos os direitos reservados.
                </div>
                <div className="text-xs mt-2">
                    <a href="#" className="hover:underline mx-1">Sobre</a> | 
                    <a href="#" className="hover:underline mx-1">Contato</a> | 
                    <a href="#" className="hover:underline mx-1">Privacidade</a>
                </div>
                <div className="text-xs mt-1">
                    Siga-nos: 
                    <a href="#" className="ml-2 hover:underline">Facebook</a> |
                    <a href="#" className="ml-2 hover:underline">Twitter</a> |
                    <a href="#" className="ml-2 hover:underline">Instagram</a>
                </div>
            </footer>
        </div>
    );
};

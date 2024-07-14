import React, { useEffect, useState } from 'react';
import menuImage from '../assets/menu_image.svg';

export const Home = () => {
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

    return (
        <div style={{ height: newHeight + 'px' }} className="w-screen bg-white">
            <div className='flex w-full h-[90%]'>
                <div className='flex justify items-center w-[50%] h-full '>
                    <h1 className="text-[#1D3557] m-8 flex flex-col max-w-5xl">
                        <span className="lg:text-3xl font-bold md:text-5xl ">
                            <span className='text-[#7395c4]'>AniSC - </span> Um guia de imagens radiográficas de animais
                        </span>
                        <span className="font-semibold lg:text-2xl mt-3 md:text-lg">
                        Aqui são registradas imagens de <span className='text-[#7395c4]'> diversos animais </span> juntamente com informações veterinárias essenciais. 
                        Essas informações são utilizadas para <span className='text-[#7395c4]'> observações técnicas e educativas, </span> permitindo uma compreensão 
                        detalhada de como os animais se comportam durante o processo de <span className='text-[#7395c4]'> aquisição das imagens.</span>
                        </span>
                    </h1>
                </div>
                <div className='flex justify items-center w-[50%] h-full'>
                    <img src={menuImage} className="max-w-xl ml-8" />
                </div>
            </div>
            <div className="flex flex-col justify-center items-center w-full h-[10%] text-[#0a131f] pb-8 text-center">
                <div className="text-sm">
                    © 2024 AniSC. Todos os direitos reservados.
                </div>
                <div className="text-xs">
                    <a href="" className="hover:underline">Sobre</a> | 
                    <a href="" className="hover:underline"> Contato</a> | 
                    <a href="" className="hover:underline"> Privacidade</a>
                </div>
                <div className="text-xs mt-1">
                    Siga-nos: 
                    <a href="" className="ml-2 hover:underline">Facebook</a> |
                    <a href="" className="ml-2 hover:underline">Twitter</a> |
                    <a href="" className="ml-2 hover:underline">Instagram</a>
                </div>
            </div>
        </div>
    )
}
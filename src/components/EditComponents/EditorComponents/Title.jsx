import React, { useEffect, useState } from 'react';

export const Title = ({ handleSave }) => {
    const [errors, setErrors] = useState([false, false, false]);

    useEffect(() => {
        setErrors(handleSave);
    }, [handleSave]);

    return (
        <div className="w-full h-auto lg:h-[15%] bg-[#F1FAEE] font-semibold text-[#1D3557]">
            <div className="w-full h-auto lg:h-[50%] pt-2 flex justify-center">
                <div className="w-full px-4 lg:px-0">
                    <input
                        className={`h-[80%] bg-[#F1FAEE] w-full text-center rounded-md border-2 ${errors[0] ? 'border-red-500' : 'border-none'}`}
                        type="text"
                        name="title"
                        id="title"
                        placeholder="Título do arquivo"
                    />
                </div>
            </div>
            <div className="w-full h-auto lg:h-[50%] pt-2 flex flex-wrap justify-center">
                <div className="w-full lg:w-[50%] h-full flex flex-col items-center px-4 lg:px-0">
                    <select
                        className={`bg-[#F1FAEE] h-[80%] text-center w-full lg:w-[80%] rounded-md border-2 ${errors[1] ? 'border-red-500' : 'border-none'}`}
                        name="specie"
                        id="type"
                    >
                        <option value="">Escolha a Espécie</option>
                        <option value="canino">Canino</option>
                        <option value="felino">Felino</option>
                        <option value="cutia">Cutia</option>
                        <option value="cateto">Cateto</option>
                        <option value="moco">Mocó</option>
                    </select>
                </div>
                <div className="w-full lg:w-[50%] h-full flex flex-col items-center px-4 lg:px-0">
                    <select
                        className={`bg-[#F1FAEE] h-[80%] text-center w-full lg:w-[80%] rounded-md border-2 ${errors[2] ? 'border-red-500' : 'border-none'}`}
                        name="local"
                        id="part"
                    >
                        <option value="">Escolha o Local</option>
                        <option value="cranio">Crânio</option>
                        <option value="coluna">Coluna Vertebral</option>
                        <option value="membro">Membro Torácico</option>
                        <option value="larifari">Laringe/Faringe</option>
                        <option value="torax">Tórax</option>
                        <option value="abdome">Abdome</option>
                        <option value="pelve">Pelve</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

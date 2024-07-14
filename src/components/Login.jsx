import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from './LoginProvider';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setAdmin, setLogin } = useLogin();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setAdmin(true);
        setLogin(true);
        navigate('/'); // Redireciona para a página inicial após login
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <div className='w-[40%] h-[350px] rounded-lg flex flex-col bg-white items-center justify-center p-4 space-y-4'>
                <div className='flex font-semibold text-[20px]'>
                    Bem Vindo(a)
                </div>
                <form className='flex flex-col items-center w-full space-y-4' onSubmit={handleSubmit}>
                    <div className='flex w-[80%]'>
                        <span className="inline-flex items-center px-4 py-2 text-sm text-gray-500 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md focus:border-2">
                            <i className="fa-regular fa-user"></i>
                        </span>
                        <input
                            type="text"
                            className='w-full border border-gray-500 rounded-none rounded-e-lg p-2 bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                            placeholder='Usuário'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className='flex w-[80%]'>
                        <span className="inline-flex items-center px-4 py-2 text-sm text-gray-500 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md focus:border-2">
                            <i className="fa-solid fa-lock"></i>
                        </span>
                        <input
                            type="password"
                            className='w-full border border-gray-500 rounded-none rounded-e-lg p-2 bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                            placeholder='Senha'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className='flex p-4 space-x-24'>
                        <button type="submit" className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg text-sm px-12 py-2 mb-2 mt-2 focus:outline-none'>Logar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

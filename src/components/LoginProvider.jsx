import React, { createContext, useContext, useEffect, useState } from 'react';

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
    const [isLogin, setLogin] = useState(false);
    const [isAdmin, setAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setLogin(true);
            setAdmin(true); 
        }
    }, []);

    return (
        <LoginContext.Provider value={{ isLogin, setLogin, isAdmin, setAdmin }}>
            {children}
        </LoginContext.Provider>
    );
};

export const useLogin = () => {
    return useContext(LoginContext);
};

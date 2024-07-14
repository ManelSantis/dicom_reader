import React, { createContext, useContext, useState } from 'react';

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
    const [isLogin, setLogin] = useState(false);
    const [isAdmin, setAdmin] = useState(false);

    return (
        <LoginContext.Provider value={{ isLogin, setLogin, isAdmin, setAdmin }}>
            {children}
        </LoginContext.Provider>
    );
};

export const useLogin = () => {
    return useContext(LoginContext);
};

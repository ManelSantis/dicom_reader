import { AccountCircle, Lock } from '@mui/icons-material';
import { Box, Button, CircularProgress, InputAdornment, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/Authentication';
import { useLogin } from './LoginProvider';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newHeight, setNewHeight] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const { setAdmin, setLogin, isLogin } = useLogin();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLogin) {
            navigate('/');
        }
    }, [isLogin, navigate]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await login(username, password);
            setAdmin(true);
            setLogin(true);
            navigate('/');
        } catch (error) {
            setIsLoading(false);
            setErrorMessage('Erro ao fazer login: Usuário ou senha incorretos.');
            setAdmin(false);
            setLogin(false);
        }
    };

    return (
        <Box
            component="div"
            height={`${newHeight}px`}
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor="#b5b5b5"
            p={2}
        >
            <Box
                width="100%"
                maxWidth="400px"
                bgcolor="white"
                borderRadius={4}
                p={4}
                display="flex"
                flexDirection="column"
                alignItems="center"
                boxShadow={12}
            >
                <Typography variant="h5" component="div" fontWeight="bold">
                    Bem Vindo(a)
                </Typography>
                <form
                    style={{ width: '100%', marginTop: '24px' }}
                    onSubmit={handleSubmit}
                >
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Usuário"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            ),
                        }}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Senha"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                        }}
                        margin="normal"
                    />
                    {errorMessage && (
                        <Typography color="error" variant="body2" align="center">
                            {errorMessage}
                        </Typography>
                    )}
                    <Box
                        mt={2}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isLoading}
                            fullWidth
                        >
                            {isLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Logar'
                            )}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

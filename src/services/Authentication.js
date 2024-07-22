// services/auth.js
import queries from './queries.js';

export async function login(username, password) {
    try {
        const response = await fetch(queries.dataBaseURL + 'api/v1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error('Erro ao fazer login.');
        }

        const responseData = await response.json();
        const { token } = responseData;
        localStorage.setItem('token', token); // Armazene o token no localStorage
        return token;
    } catch (error) {
        console.error('Erro:', error.message);
        throw error;
    }
};

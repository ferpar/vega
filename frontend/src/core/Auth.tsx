import { auth$ } from "./AuthStore";
import { router$ } from "./RouterStore";

const API_URL = import.meta.env.VITE_API_URL as string;

export const AuthPresenter = {
    login: async (username: string, password: string) => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        auth$.setToken(data.accessToken);
        router$.navigate('home');
    },
    logout: async () => {
        await fetch(`${API_URL}/logout`, {
            method: 'POST',
        });
        auth$.setToken('');
        router$.navigate('login');
    }

}
import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";

const API_URL = import.meta.env.VITE_API_URL as string;

export const auth$ = observable({
    token: '',
    setToken: (token: string) => {
        auth$.token.set(token);
    },
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
    },
    logout: async () => {
        await fetch(`${API_URL}/logout`, {
            method: 'POST',
        });
        auth$.setToken('');
    }
})

persistObservable(auth$.token, {
    local: 'auth',
    pluginLocal: ObservablePersistLocalStorage
})
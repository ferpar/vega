import { auth$ } from "./AuthStore";
import { router$ } from "./RouterStore";

export const AuthService = {
    login: async (username: string, password: string) => {
        await auth$.login(username, password);
        if (auth$.token.get()) router$.navigate('home');
    },
    logout: async () => {
        await auth$.logout();
        if (!auth$.token.get()) router$.navigate('login');
    }
}
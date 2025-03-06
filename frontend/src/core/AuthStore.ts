import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { HttpGateway } from "./APIGateway";

const API_URL = import.meta.env.VITE_API_URL as string;
const httpGateway = new HttpGateway(API_URL);

export const auth$ = observable({
    token: "",
    setToken: (token: string) => {
        auth$.token.set(token);
    },
    login: async (username: string, password: string) => {
        const data = await httpGateway.post<{ accessToken: string }>("/login", {
            username,
            password,
        });
        auth$.setToken(data.accessToken);
    },
    logout: async () => {
        await httpGateway.post("/logout", {});
        auth$.setToken("");
    },
    refresh: async () => {
        const data = await httpGateway.post<{ accessToken: string }>("/refresh", {});
        console.log("refreshed token", data.accessToken);
        auth$.setToken(data.accessToken);
    }
});

persistObservable(auth$.token, {
    local: "auth",
    pluginLocal: ObservablePersistLocalStorage,
});

export type AuthStore = typeof auth$;
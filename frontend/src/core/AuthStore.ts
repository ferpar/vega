import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { HttpGateway } from "./APIGateway";

const API_URL = import.meta.env.VITE_API_URL as string;
const httpGateway = new HttpGateway(API_URL);

class AuthStore {
    state = observable({
        token: "",
    });
    gateway: HttpGateway;

    constructor( gateway: HttpGateway) {
        persistObservable(this.state.token, {
            local: "auth",
            pluginLocal: ObservablePersistLocalStorage,
        });
        this.gateway = gateway;
    }

    async login(username: string, password: string) {
        const data = await this.gateway.post<{ accessToken: string }>("/login", {
            username,
            password,
        });
        this.state.token.set(data.accessToken);
    }

    async logout() {
        await this.gateway.post("/logout", {});
        this.state.token.set("");
    }

    async refresh() {
        const data = await this.gateway.post<{ accessToken: string }>(
            "/refresh",
            {}
        );
        console.log("refreshed token", data.accessToken);
        this.state.token.set(data.accessToken);
    }
}

export const auth$ = new AuthStore(httpGateway);
export type AuthStoreType = typeof auth$;

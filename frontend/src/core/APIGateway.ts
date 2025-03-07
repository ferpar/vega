import wretch, { Wretch } from "wretch";
import { WretchError } from "wretch/resolver";
import { type AuthStoreType } from "./AuthStore";

export class HttpGateway {
    private wretch: Wretch;
    private withRefresh: boolean;
    private auth$: AuthStoreType | undefined;

    constructor(baseURL: string, auth$?: AuthStoreType, withRefresh: boolean = false) {
        this.withRefresh = withRefresh;
        this.auth$ = auth$;
        this.wretch = wretch(
            baseURL
        )
        .catcher(401, async (error) => {
            console.error("unauthorized error", error);
            this.auth$ && await this.auth$?.logout()
            // throw new Error("Unauthorized");
        })
        .catcher(403, async (error) => {
            console.error("forbidden error", error);
            this.auth$ && await this.auth$?.logout()
            // throw new Error("Forbidden");
        })
        .catcherFallback(async (error) => {
            console.error("unexpected error fetching", error);
            throw new Error((error as WretchError).text);
        });
    }

    async get<T>(path: string): Promise<T> {
        return await this.wretch.url(path).options({
            headers: this.auth$ ? { Authorization: `Bearer ${this.auth$.state.token.get()}` } : {},
        }).get().json();
    }

    async post<T>(path: string, body: any): Promise<T> {
        return await this.wretch.url(path).options({
            headers: this.auth$ ? { Authorization: `Bearer ${this.auth$.state.token.get()}` } : {},
        }).post(body).json();
    }
}

import wretch, { Wretch } from "wretch";
import { WretchError } from "wretch/resolver";

export class HttpGateway {
    private wretch: Wretch;
    private withRefresh: boolean;
    private refreshCount: number = 0;
    private maxRefreshCount: number = 3;

    constructor(baseURL: string, token?: string, withRefresh: boolean = false) {
        this.withRefresh = withRefresh;
        this.wretch = wretch(
            baseURL,
            token ? { headers: { Authorization: `Bearer ${token}` } } : {}
        )
        .catcher(401, async (error) => {
            console.error("unauthorized error", error);
            throw new Error("Unauthorized");
        })
        .catcher(403, async (error) => {
                console.error("forbidden error", error);
                throw new Error("Forbidden");
        })
        .catcherFallback(async (error) => {
            console.error("unexpected error fetching", error);
            throw new Error((error as WretchError).text);
        });
    }

    async get<T>(path: string, token: string): Promise<T> {
        return await this.wretch.url(path).options({
            headers: { Authorization: `Bearer ${token}` },
        }).get().json();
    }

    async post<T>(path: string, body: any): Promise<T> {
        return await this.wretch.url(path).post(body).json();
    }
}

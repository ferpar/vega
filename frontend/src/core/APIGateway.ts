import wretch, { Wretch, WretchOptions } from "wretch";
import { WretchError } from "wretch/resolver";
import { type AuthStoreType } from "./AuthStore";

export class HttpGateway {
    private wretch: Wretch;
    private withRefresh: boolean;
    auth$: AuthStoreType | undefined;

    constructor(
        baseURL: string,
        auth$?: AuthStoreType,
        withRefresh: boolean = false
    ) {
        this.withRefresh = withRefresh;
        this.auth$ = auth$;
        this.wretch = wretch(baseURL)
            .catcher(401, async (error, initialRequest) => {
                console.error("unauthorized error", error);
                // attempt refresh
                if (this.withRefresh && this.auth$) {
                    try {
                        console.log("attempting refresh");
                        await this.auth$?.refresh();
                        // retry initial request
                        return await initialRequest
                            .auth(`Bearer ${this.auth$.state.token.get()}`)
                            .fetch()
                            .json();
                    } catch (error) {
                        console.error("error after refresh", error);
                        this.auth$ && (await this.auth$?.logout());
                        throw new Error("Unauthorized");
                    }
                }
                this.auth$ && (await this.auth$?.logout());
                throw new Error("Unauthorized");
            })
            .catcher(403, async (error, initialRequest) => {
                console.error("forbidden error", error);
                // attempt refresh
                if (this.withRefresh && this.auth$) {
                    try {
                        console.log("attempting refresh");
                        await this.auth$?.refresh();
                        // retry initial request
                        return await initialRequest
                            .auth(`Bearer ${this.auth$.state.token.get()}`)
                            .fetch()
                            .json();
                    } catch (error) {
                        console.error("error after refresh", error);
                        this.auth$ && (await this.auth$?.logout());
                        throw new Error("Forbidden");
                    }
                }
                this.auth$ && (await this.auth$?.logout());
                throw new Error("Forbidden");
            })
            .catcherFallback(async (error) => {
                console.error("unexpected error fetching", error);
                throw new Error((error as WretchError).text);
            });
    }

    async get<T>(path: string, options?: WretchOptions): Promise<T> {
        return await this.wretch
            .url(path)
            .options({
                headers: this.auth$
                    ? {
                          Authorization: `Bearer ${this.auth$.state.token.get()}`,
                      }
                    : {},
                ...options,
            })
            .get()
            .json();
    }

    async post<T>(
        path: string,
        body: any,
        options?: WretchOptions
    ): Promise<T> {
        return await this.wretch
            .url(path)
            .options({
                headers: this.auth$
                    ? {
                          Authorization: `Bearer ${this.auth$.state.token.get()}`,
                      }
                    : {},
                ...options,
            })
            .post(body)
            .json();
    }
}

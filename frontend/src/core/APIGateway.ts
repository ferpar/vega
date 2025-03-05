import wretch, { Wretch } from 'wretch';
import { WretchError } from 'wretch/resolver'

export class HttpGateway {
    private wretch: Wretch;
    private withRefresh: boolean;

    constructor(baseURL: string, token?: string, withRefresh: boolean = false) {
        this.withRefresh = withRefresh;
        this.wretch = wretch(baseURL, token ? { headers: { Authorization: `Bearer ${token}` } } : {})
            .catcher(401, async (_, originalReq) => {
                if (this.withRefresh) {
                    // refresh the token
                    const response = await fetch(`${baseURL}/refresh`, {
                        method: 'POST',
                    });
                    const data = await response.json();
                    this.wretch = wretch(baseURL, { headers: { Authorization: `Bearer ${data.accessToken}` } });
                    //retry the original request
                    return originalReq
                        .auth(`Bearer ${data.accessToken}`)
                        .fetch()
                        .unauthorized(err => {throw err})
                        .json()
                } else {
                    throw new Error("Unauthorized");
                }
            })
            .catcher(403, async (_, originalReq) => {
                if (this.withRefresh) {
                    // refresh the token
                    const response = await fetch(`${baseURL}/refresh`, {
                        method: 'POST',
                    });
                    const data = await response.json();
                    this.wretch = wretch(baseURL, { headers: { Authorization: `Bearer ${data.accessToken}` } });
                    // retry the original request
                    return originalReq
                        .auth(`Bearer ${data.accessToken}`)
                        .fetch()
                        .unauthorized(err => {throw err})
                        .json()
                } else {
                    throw new Error("Forbidden");
                }
            })
            .catcherFallback(async (error) => {
                console.error("unexpected error fetching", error);
                throw new Error((error as WretchError).text);
            })
        ;
    }

    async get<T>(path: string): Promise<T> {
        try {
            return await this.wretch.url(path).get().json();
        } catch (error) {
            throw new Error((error as WretchError).text);
        }
    }

    async post<T>(path: string, body: any): Promise<T> {
        try {
            return await this.wretch.url(path).post(body).json();
        } catch (error) {
            throw new Error((error as WretchError).text);
        }
    }

    async put<T>(path: string, body: any): Promise<T> {
        try {
            return await this.wretch.url(path).put(body).json();
        } catch (error) {
            throw new Error((error as WretchError).text);
        }
    }

    async delete<T>(path: string): Promise<T> {
        try {
            return await this.wretch.url(path).delete().json();
        } catch (error) {
            throw new Error((error as WretchError).text);
        }
    } 
}
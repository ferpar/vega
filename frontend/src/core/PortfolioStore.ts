import { observable } from "@legendapp/state";
import { auth$ } from "./AuthStore";
import type { Asset, Portfolio, Price } from "./types";

type PortfolioStore = {
    assets: Asset[];
    prices: Price[];
    portfolio: Portfolio | null;
    loadAssets: () => Promise<void>;
    loadPrices: () => Promise<void>;
    loadPortfolio: () => Promise<void>;
    init: () => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL as string;
export const portfolio$ = observable<PortfolioStore>({
    assets: [],
    prices: [],
    portfolio: null,
    loadAssets: async () => {
        const response = await fetch(`${API_URL}/assets`, {
            headers: {
                method: 'GET',
                Authorization: `Bearer ${auth$.token.get()}`,
            }
        });
        const data = await response.json();
        portfolio$.assets.set(data || []);
    },
    loadPrices: async () => {
        const response = await fetch(`${API_URL}/prices`,
            {
                headers: {
                    Authorization: `Bearer ${auth$.token.get()}`
                },
            }
        );
        const data = await response.json();
        portfolio$.prices.set(data);
    },
    loadPortfolio: async () => {
        const response = await fetch(`${API_URL}/portfolios`, {
            headers: {
                Authorization: `Bearer ${auth$.token.get()}`,
            }
        });
        const data = await response.json();
        portfolio$.portfolio.set(data);
    },
    init: async () => {
        console.log("initializing portfolio store");
        await portfolio$.loadAssets();
        await portfolio$.loadPrices();
        await portfolio$.loadPortfolio();
    }
})
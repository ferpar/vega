import { observable } from "@legendapp/state";
import { auth$ } from "../../core/AuthStore";
import { HttpGateway } from "../../core/APIGateway";
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
const httpGateway = new HttpGateway(API_URL, auth$.token.get(), true); 

export const portfolio$ = observable<PortfolioStore>({
    assets: [],
    prices: [],
    portfolio: null,
    loadAssets: async () => {
        const data = await httpGateway.get<Asset[]>('/assets');
        portfolio$.assets.set(data || []);
    },
    loadPrices: async () => {
        const data = await httpGateway.get<Price[]>('/prices');
        portfolio$.prices.set(data);
    },
    loadPortfolio: async () => {
        const data = await httpGateway.get<Portfolio>('/portfolios');
        portfolio$.portfolio.set(data);
    },
    init: async () => {
        console.log("initializing portfolio store");
        await portfolio$.loadAssets();
        await portfolio$.loadPrices();
        await portfolio$.loadPortfolio();
    }
})
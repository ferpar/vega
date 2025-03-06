import { observable } from "@legendapp/state";
import { auth$ } from "../../core/AuthStore";
import { AuthService } from "../../core/Auth";
import { HttpGateway } from "../../core/APIGateway";
import type { Asset, Portfolio, Price } from "./types";

const availableDates = [
    "2021-01-01",
    "2021-02-01",
    "2021-03-01",
    "2021-04-01",
    "2021-05-01",
    "2021-06-01",
    "2021-07-01",
    "2021-08-01",
];

type PortfolioStore = {
    asOf: string;
    assets: Asset[];
    prices: Price[];
    portfolio: Portfolio | null;
    portfolios: Portfolio[];
    loadAssets: () => Promise<void>;
    loadPrices: () => Promise<void>;
    loadPortfolio: () => Promise<void>;
    loadPorfolios: () => Promise<void>;
    init: () => Promise<void>;
};

const API_URL = import.meta.env.VITE_API_URL as string;
const httpGateway = new HttpGateway(API_URL, '', true);

export const portfolio$ = observable<PortfolioStore>({
    asOf: "2021-08-01",
    assets: [],
    prices: [],
    portfolio: null,
    portfolios: [],
    loadAssets: async () => {
        console.log('loading assets')
        let data;
        try {
            console.log('trying to get assets')
            data = await httpGateway.get<Asset[]>("/assets", auth$.token.get());
        } catch (error) {
            console.error('error getting assets', error)
            if (error instanceof Error && (error.message === "Forbidden" || error.message === "Unauthorized")) {
                console.log('forbidden / unauthorized error, logging out')
                await AuthService.logout();
            }
        }
        portfolio$.assets.set(data || []);
    },
    loadPrices: async () => {
        const data = await httpGateway.get<Price[]>("/prices", auth$.token.get());
        portfolio$.prices.set(data);
    },
    loadPortfolio: async () => {
        const data = await httpGateway.get<Portfolio[]>(
            `/portfolios?asOf=${portfolio$.asOf.get()}`,
            auth$.token.get()
        );
        portfolio$.portfolio.set(data[0]);
    },
    loadPorfolios: async () => {
        const data = await httpGateway.get<Portfolio[]>(
            `/portfolios?asOf=${availableDates.join(",")}`,
            auth$.token.get()
        );
        portfolio$.portfolios.set(data);
    },
    init: async () => {
        console.log("initializing portfolio store");
        await portfolio$.loadAssets();
        await portfolio$.loadPrices();
        await portfolio$.loadPortfolio();
        await portfolio$.loadPorfolios();
    },
});

import { observable } from "@legendapp/state";
import { router$ } from "../../core/RouterStore";
import { auth$ } from "../../core/AuthStore";
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

const API_URL = import.meta.env.VITE_API_URL as string;
const httpGateway = new HttpGateway(API_URL, auth$, true);

class PortfolioStore {
    state = observable({
        asOf: "2021-08-01",
        availableDates: availableDates,
        assets: [] as Asset[],
        prices: [] as Price[],
        portfolio: null as Portfolio | null,
        portfolios: [] as Portfolio[],
    });
    private initialized = false;
    gateway: HttpGateway;

    constructor(gateway: HttpGateway) {
        this.listenForNavigation();
        this.gateway = gateway;
    }

    async loadAssets() {
        const data = await this.gateway.get<Asset[]>("/assets");
        this.state.assets.set(data || []);
    }

    async loadPrices() {
        const data = await this.gateway.get<Price[]>("/prices");
        this.state.prices.set(data);
    }

    async loadPortfolio() {
        const data = await this.gateway.get<Portfolio[]>(
            `/portfolios?asOf=${this.state.asOf.get()}`
        );

        if (!data || data.length === 0) {
            this.state.portfolio.set(null);
            return;
        }

        this.state.portfolio.set(data[0]);
    }

    async loadPorfolios() {
        const data = await this.gateway.get<Portfolio[]>(
            `/portfolios?asOf=${this.state.availableDates.get().join(",")}`
        );
        
        if (!data || data.length === 0) { 
            this.state.portfolios.set([]);
            return;
        }

        this.state.portfolios.set(data);
    }

    init = async () => {
        if (this.initialized) {
            console.log("portfolio store already initialized");
            return;
        }
        this.initialized = true;
        console.log("initializing portfolio store");
        await this.refresh();
        
    };

    async refresh() {
        console.log("refreshing portfolio store");
        await this.loadAssets();
        await this.loadPrices();
        await this.loadPortfolio();
        await this.loadPorfolios();
    }

    listenForNavigation() {
        router$.currentRoute.onChange(() => {
            console.log(`router change, ${router$.currentRoute.get()}`);
            if (router$.currentRoute.get() === "home") {
                console.log("home route, initializing portfolio store");
                this.init();
            }
        });
    }

}

export const portfolio$ = new PortfolioStore(httpGateway);
export type PortfolioStoreType = typeof portfolio$;
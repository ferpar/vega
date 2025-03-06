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
        assets: [] as Asset[],
        prices: [] as Price[],
        portfolio: null as Portfolio | null,
        portfolios: [] as Portfolio[],
    });
    private initialized = false;

    constructor() {
        this.listenForNavigation();
    }

    async loadAssets() {
        const data = await httpGateway.get<Asset[]>("/assets");
        this.state.assets.set(data || []);
    }

    async loadPrices() {
        const data = await httpGateway.get<Price[]>("/prices");
        this.state.prices.set(data);
    }

    async loadPortfolio() {
        const data = await httpGateway.get<Portfolio[]>(
            `/portfolios?asOf=${this.state.asOf.get()}`
        );
        this.state.portfolio.set(data[0]);
    }

    async loadPorfolios() {
        const data = await httpGateway.get<Portfolio[]>(
            `/portfolios?asOf=${availableDates.join(",")}`
        );
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

export const portfolio$ = new PortfolioStore();
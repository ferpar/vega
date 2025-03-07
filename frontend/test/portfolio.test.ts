import { it, describe, expect, vi, beforeAll } from "vitest";
import { portfolioPresenter$ } from "../src/modules/Portfolio/PortfolioPresenter";
import { fixtureFactory } from "./fixtures/portfolio";
import { AuthStoreType } from "../src/core/AuthStore";

// mock the portfolio gateway;
const gateway = portfolioPresenter$.portfolio.gateway;
gateway.get = vi
    .fn()
    .mockImplementation(async (url: string) => {
        if (url === "/assets") {
            return await Promise.resolve(fixtureFactory().assets); 
        }
        if (url === "/prices") {
            return await Promise.resolve(fixtureFactory().prices);
        }
        if (url === "/portfolios?asOf=2021-01-01") {
            return await Promise.resolve(fixtureFactory().portfolios.slice(0, 1));
        }
        if (url === "/portfolios?asOf=2021-01-01,2021-02-01") {
            return await Promise.resolve(fixtureFactory().portfolios);
        }
    });

const auth$ = portfolioPresenter$.portfolio.gateway.auth$ as AuthStoreType;

describe("portfolio presenter", () => {
    it("portfolio store uninitialized if not logged in", () => {
        expect(portfolioPresenter$.portfolio.state.portfolios.get()).toEqual([]);
    })
    beforeAll(async () => {
        // arrange
        auth$.state.token.set("token");
        // set the asOf date and available dates
        portfolioPresenter$.portfolio.state.asOf.set("2021-01-01");
        portfolioPresenter$.portfolio.state.availableDates.set(["2021-01-01", "2021-02-01"]);
        // we simulate init store if logged in on load (first load or reload)
        // the store is also initialized when the current route changes to /main 
        await portfolioPresenter$.portfolio.init(); 
    });
    it("should load assets", () => {
        expect(portfolioPresenter$.portfolio.state.assets.get()).toEqual(fixtureFactory().assets);
    })
    it("should load prices", () => {
        expect(portfolioPresenter$.portfolio.state.prices.get()).toEqual(fixtureFactory().prices);
    })
    it("should load portfolio", () => {
        expect(gateway.get).toHaveBeenCalledWith("/portfolios?asOf=2021-01-01");
        expect(portfolioPresenter$.portfolio.state.portfolio.get()).toEqual(fixtureFactory().portfolios[0]);
    })
    it("should load portfolios", async () => {
        await portfolioPresenter$.portfolio.loadPorfolios();
        expect(gateway.get).toHaveBeenCalledWith("/portfolios?asOf=2021-01-01,2021-02-01");
        expect(portfolioPresenter$.portfolio.state.portfolios.get()).toEqual(fixtureFactory().portfolios);
    })
    it("should toggle group by asset type", () => {
        expect(portfolioPresenter$.state.groupByAssetType.get()).toBe(false);
        portfolioPresenter$.toggleGroupByAssetType();
        expect(portfolioPresenter$.state.groupByAssetType.get()).toBe(true);
    })

})
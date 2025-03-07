import { observable } from "@legendapp/state";
import { portfolio$, type PortfolioStoreType } from "./PortfolioStore";

class PortfolioPresenter {
    state = observable({
        groupByAssetType: false,
    })
    portfolio: PortfolioStoreType;  

    constructor(portfolio$: PortfolioStoreType) {
        this.portfolio = portfolio$;
        // reach to the gateway to get the logged in status
        const token = this.portfolio.gateway.auth$ 
            ? this.portfolio.gateway?.auth$.state.token.get() 
            : "";
        if (token) this.portfolio.init(); // init store if logged in on load
    }

    toggleGroupByAssetType = () => {
        const prevValue = this.state.groupByAssetType.get();
        this.state.groupByAssetType.set(!prevValue);
    }
    
    portfolioHistory = () => {
        const portfolios = this.portfolio.state.portfolios.get();
        return portfolios?.map((portfolio) => ({
            date: portfolio.asOf,
            value: portfolio.positions.reduce(
                (acc, position) => acc + position.quantity * position.price,
                0
            ),
        }));
    }

    positions = () => {
        const portfolio = this.portfolio.state.portfolio.get();
        // If no portfolio, return empty array
        if (!portfolio) return [];
        if (!portfolio.positions) return [];

        // If not grouping by asset type, return positions as is
        if (!this.state.groupByAssetType.get() && portfolio) {
            return portfolio?.positions.map((position) => ({
                // id: position.id,
                label: position.asset,
                value: position.quantity * position.price,
                price: position.price,
                quantity: position.quantity,
            }));
        } else {
            // Group by asset type
            const assets = this.portfolio.state.assets.get();
            const breakdownObj = portfolio?.positions.reduce(
                (acc, position) => {
                    const asset = assets.find(
                        (asset) => asset.asset === position.asset
                    );
                    const type = asset?.type;
                    if (!type) return acc;
                    acc[type] += position.quantity * position.price;
                    return acc;
                },
                { stock: 0, crypto: 0, fiat: 0 }
            );
            const breakdown = Object.entries(breakdownObj)
                .map(([label, value]) => ({ label, value }))
                .filter((entry) => entry.value > 0);
            return breakdown;
        }
    }
}

export const portfolioPresenter$ = new PortfolioPresenter(portfolio$);
export type PortfolioPresenterType = typeof portfolioPresenter$;
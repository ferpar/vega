import { observable } from "@legendapp/state";
import { portfolio$ } from "./PortfolioStore";
import { auth$ } from "../../core/AuthStore";

if (auth$.token.get()) portfolio$.init();
export const portfolioPresenter$ = observable({
    groupByAssetType: false,
    toggleGroupByAssetType: () => {
        portfolioPresenter$.groupByAssetType.set(
            !portfolioPresenter$.groupByAssetType.get()
        );
    },
    assets: () => portfolio$.state.assets.get(),
    prices: () => portfolio$.state.prices.get(),
    portfolio: () => portfolio$.state.portfolio.get(),
    portfolioHistory: () => {
        const portfolios = portfolio$.state.portfolios.get();
        return portfolios?.map((portfolio) => ({
            date: portfolio.asOf,
            value: portfolio.positions.reduce(
                (acc, position) => acc + position.quantity * position.price,
                0
            ),
        }));
    },
    positions: () => {
        const portfolio = portfolio$.state.portfolio.get();
        // If no portfolio, return empty array
        if (!portfolio) return [];
        if (!portfolio.positions) return [];

        // If not grouping by asset type, return positions as is
        if (!portfolioPresenter$.groupByAssetType.get() && portfolio) {
            return portfolio?.positions.map((position) => ({
                // id: position.id,
                label: position.asset,
                value: position.quantity * position.price,
                price: position.price,
                quantity: position.quantity,
            }));
        } else {
            // Group by asset type
            const assets = portfolio$.state.assets.get();
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
    },
});

import { observable } from "@legendapp/state"
import { portfolio$ } from "./PortfolioStore"

export const portfolioPresenter$ = observable({
    groupByAssetType: false,
    toggleGroupByAssetType: () => {
        portfolioPresenter$.groupByAssetType.set(!portfolioPresenter$.groupByAssetType.get())
    },
    assets: () => portfolio$.assets.get(),
    prices: () => portfolio$.prices.get(),
    portfolio: () => portfolio$.portfolio.get(),
    positions: () => {
        const portfolio = portfolio$.portfolio.get()
        // If no portfolio, return empty array
        if (!portfolio) return []

        // If not grouping by asset type, return positions as is
        if (!portfolioPresenter$.groupByAssetType.get() && portfolio) {
            return portfolio?.positions.map((position) => ({
                // id: position.id,
                label: position.asset,
                value: position.quantity * position.price
            }))
        } else { // Group by asset type
            const assets = portfolio$.assets.get()
            const breakdownObj = portfolio?.positions.reduce((acc, position) => {
                const asset = assets.find((asset) => asset.asset === position.asset)
                const type = asset?.type
                if (!type) return acc
                acc[type] += position.quantity * position.price
                return acc
            }, { "stock": 0, "crypto": 0, "fiat": 0 })
            const breakdown = Object.entries(breakdownObj)
                .map(([label, value]) => ({ label, value }))
                .filter((entry) => entry.value > 0)
            return breakdown
        }
    }
})
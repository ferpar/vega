import { portfolio$ } from "../core/PortfolioStore"
import { observer } from "@legendapp/state/react"
import { DonutChart } from "./DonutChart/DonutChart"

export const Main = observer(() => {
    const assets = portfolio$.assets.get()  
    const prices = portfolio$.prices.get()
    const portfolio = portfolio$.portfolio.get()

    const donutData = portfolio?.positions.map(position => {
        const label = position.asset
        const value = position.price * position.quantity
        return  { label, value }
    })

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold text-center">Vite + React + TailwindCSS</h1>
            <p className="text-center">This is a simple starter template for Vite + React + TailwindCSS</p>
            <h2 className="text-2xl font-bold mt-8">Assets</h2>
            <ul>
                {assets && assets.map(asset => (
                    <li key={asset.id}>{asset.asset}</li>
                ))}
            </ul>
            <h2 className="text-2xl font-bold mt-8">Prices</h2>
            <ul>
                {prices && prices.map(price => (
                    <li key={price.id}>{price.price}</li>
                ))}
            </ul>
            <h2 className="text-2xl font-bold mt-8">Portfolio</h2>
            <ul>
                {portfolio && portfolio.positions.map(position => (
                    <li key={position.id}>{position.asset}: {position.quantity}</li>
                ))}
            </ul>
            <DonutChart data={donutData}/>

        </div>
    )
})
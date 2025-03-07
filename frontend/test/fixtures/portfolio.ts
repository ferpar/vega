export const fixtureFactory = (overrides = {}) => ({
    assets: [
        { id: 1, asset: "asset1", type: "stock" },
        { id: 2, asset: "asset2", type: "crypto" },
    ],
    prices: [
        { id: 1, asset: "asset1", price: 100 },
        { id: 2, asset: "asset2", price: 200 },
    ],
    portfolios: [
        {
            id: "1",
            asOf: "2021-01-01",
            positions: [
                { asset: "asset1", quantity: 1, price: 100 },
                { asset: "asset2", quantity: 2, price: 200 },
            ],
        },
        {
            id: "2",
            asOf: "2021-02-01",
            positions: [
                { asset: "asset1", quantity: 2, price: 100 },
                { asset: "asset2", quantity: 1, price: 200 },
            ],
        },
    ],
    ...overrides,  
})
const assetsFn = () => {
    return [
        { id: 1, asset: "AAPL", type: "stock" },
        { id: 2, asset: "GOOGL", type: "stock" },
        { id: 3, asset: "TSLA", type: "stock" },
        { id: 4, asset: "BTC", type: "crypto" },
        { id: 5, asset: "GBP", type: "fiat" },
    ]
}

const pricesFn = () => {
    return [
        { id: 1, asset: "AAPL", price: 145.12 },
        { id: 2, asset: "GOOGL", price: 2732.23 },
        { id: 3, asset: "TSLA", price: 678.90 },
        { id: 4, asset: "BTC", price: 45000.00 },
        { id: 5, asset: "GBP", price: 1.53 }
    ]
}

const portfoliosFn = (asOf = ['2021-08-01']) => {
    // asOf is an array of date strings
    const portfolios = {
        "2021-01-01": {
            id: 1,
            asOf: '2021-01-01',
            positions: [
                { id: 1, asset: "AAPL", quantity: 100, asOf: '2021-01-01', price: 100.12 },
                { id: 2, asset: "GOOGL", quantity: 50, asOf: '2021-01-01', price: 2232.23 },
                { id: 3, asset: "TSLA", quantity: 25, asOf: '2021-01-01', price: 408.90 },
                { id: 4, asset: "BTC", quantity: 1, asOf: '2021-01-01', price: 39000.00 },
                { id: 5, asset: "GBP", quantity: 10000, asOf: '2021-01-01', price: 1.59 }
            ]
        },
        "2021-02-01": {
            id: 1,
            asOf: '2021-02-01',
            positions: [
                { id: 1, asset: "AAPL", quantity: 100, asOf: '2021-02-01', price: 110.12 },
                { id: 2, asset: "GOOGL", quantity: 50, asOf: '2021-02-01', price: 2332.23 },
                { id: 3, asset: "TSLA", quantity: 25, asOf: '2021-02-01', price: 508.90 },
                { id: 4, asset: "BTC", quantity: 1, asOf: '2021-02-01', price: 40000.00 },
                { id: 5, asset: "GBP", quantity: 10000, asOf: '2021-02-01', price: 1.58 }
            ]
        },
        "2021-03-01": {
            id: 1,
            asOf: '2021-03-01',
            positions: [
                { id: 1, asset: "AAPL", quantity: 100, asOf: '2021-03-01', price: 120.12 },
                { id: 2, asset: "GOOGL", quantity: 50, asOf: '2021-03-01', price: 2432.23 },
                { id: 3, asset: "TSLA", quantity: 25, asOf: '2021-03-01', price: 608.90 },
                { id: 4, asset: "BTC", quantity: 1, asOf: '2021-03-01', price: 41000.00 },
                { id: 5, asset: "GBP", quantity: 10000, asOf: '2021-03-01', price: 1.57 }
            ]
        },
        "2021-04-01": {
            id: 1,
            asOf: '2021-04-01',
            positions: [
                { id: 1, asset: "AAPL", quantity: 100, asOf: '2021-04-01', price: 130.12 },
                { id: 2, asset: "GOOGL", quantity: 50, asOf: '2021-04-01', price: 2532.23 },
                { id: 3, asset: "TSLA", quantity: 25, asOf: '2021-04-01', price: 628.90 },
                { id: 4, asset: "BTC", quantity: 1, asOf: '2021-04-01', price: 42000.00 },
                { id: 5, asset: "GBP", quantity: 10000, asOf: '2021-04-01', price: 1.56 }
            ]
        },
        "2021-05-01": {
            id: 1,
            asOf: '2021-05-01',
            positions: [
                { id: 1, asset: "AAPL", quantity: 100, asOf: '2021-05-01', price: 135.12 },
                { id: 2, asset: "GOOGL", quantity: 50, asOf: '2021-05-01', price: 2632.23 },
                { id: 3, asset: "TSLA", quantity: 25, asOf: '2021-05-01', price: 658.90 },
                { id: 4, asset: "BTC", quantity: 1, asOf: '2021-05-01', price: 43000.00 },
                { id: 5, asset: "GBP", quantity: 10000, asOf: '2021-05-01', price: 1.55 }
            ]
        },
        "2021-06-01": {
            id: 1,
            asOf: '2021-06-01',
            positions: [
                { id: 1, asset: "AAPL", quantity: 100, asOf: '2021-06-01', price: 140.12 },
                { id: 2, asset: "GOOGL", quantity: 50, asOf: '2021-06-01', price: 2682.23 },
                { id: 3, asset: "TSLA", quantity: 25, asOf: '2021-06-01', price: 658.90 },
                { id: 4, asset: "BTC", quantity: 1, asOf: '2021-06-01', price: 43000.00 },
                { id: 5, asset: "GBP", quantity: 10000, asOf: '2021-06-01', price: 1.55 }
            ]
        },
        "2021-07-01": {
            id: 1,
            asOf: '2021-07-01',
            positions: [
                { id: 1, asset: "AAPL", quantity: 100, asOf: '2021-07-01', price: 140.12 },
                { id: 2, asset: "GOOGL", quantity: 50, asOf: '2021-07-01', price: 2702.23 },
                { id: 3, asset: "TSLA", quantity: 25, asOf: '2021-07-01', price: 668.90 },
                { id: 4, asset: "BTC", quantity: 1, asOf: '2021-07-01', price: 44000.00 },
                { id: 5, asset: "GBP", quantity: 10000, asOf: '2021-07-01', price: 1.54 }
            ]
        },
        "2021-08-01": {
            id: 1,
            asOf: '2021-08-01',
            positions: [
                { id: 1, asset: "AAPL", quantity: 100, asOf: '2021-08-01', price: 145.12 },
                { id: 2, asset: "GOOGL", quantity: 50, asOf: '2021-08-01', price: 2732.23 },
                { id: 3, asset: "TSLA", quantity: 25, asOf: '2021-08-01', price: 678.90 },
                { id: 4, asset: "BTC", quantity: 1, asOf: '2021-08-01', price: 45000.00 },
                { id: 5, asset: "GBP", quantity: 10000, asOf: '2021-08-01', price: 1.53 }
            ]
        },
    }
    const filteredPortfolios = asOf.map(a => portfolios[a])
    return filteredPortfolios
}

module.exports = {
    assetsFn,
    pricesFn,
    portfoliosFn
}
export type Asset = {
    id: string; //uuid
    asset: string;
    type: "stock" | "crypto" | "fiat";
}

export type Price = {
    id: string; //uuid
    asset: string;
    price: number;
}

export type Position = {
    id: number;
    asset: string; //uuid
    quantity: number;
    asOf: string;
    price: number;    
}

export type Portfolio = {
    id: string; //uuid
    asOf: string;
    positions: Position[];
}
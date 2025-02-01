export interface OrderNameItem {
    // Connected With the OrderNameSerializer in the Django API
    id: number;
    name: string;
}

export interface OrderNameItems extends Array<OrderNameItem> {}
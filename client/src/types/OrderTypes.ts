export interface OrderListItem {
    id: number;
    order_name__name: string;
    is_complete: boolean;
    is_in_progress: boolean;
}

export interface OrderListItems extends Array<OrderListItem> {}

export interface OrderDetailItem {
    id: number;
    order_name__name: string;
    is_complete: boolean;
    is_in_progress: boolean;
    order_items: OrderItemDetailItem[];
}

export interface OrderItemListItem {
    id: number;
    order_item_name: string;
    cup__size__display: string;
    low_sugar: boolean;
    price: number;
    note: string;
    soda_name: string;
    order_item_flavors: {
        [key: string]: string;
    };
    is_prepared: boolean
}

export interface OrderItemListItems extends Array<OrderItemListItem> {}

export interface OrderItemDetailItem {
    id: number;
    order_item_name: string;
    cup__size__display: string;
    low_sugar: boolean;
    price: number;
    note: string;
    soda_name: string;
    order_item_flavors: {
        [key: string]: string;
    };
    is_prepared: boolean;
}

export interface OrderNameItem {
    id: number;
    name: string;
}

export interface OrderNameItems extends Array<OrderNameItem> {}
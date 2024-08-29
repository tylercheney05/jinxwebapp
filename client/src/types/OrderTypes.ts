export interface OrderListItem {
    id: number;
    order_name__name: string;
}

export interface OrderListItems extends Array<OrderListItem> {}

export interface OrderItemListItem {
    id: number;
    menu_item__name: string;
    cup__size__display: string;
    zero_sugar: boolean;
    price: number;
    custom_order_name: string;
    note: string;
}

export interface OrderItemListItems extends Array<OrderItemListItem> {}

export interface OrderNameItem {
    id: number;
    name: string;
}

export interface OrderNameItems extends Array<OrderNameItem> {}
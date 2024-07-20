export interface OrderListItem {
    id: number;
}

export interface OrderListItems extends Array<OrderListItem> {}

export interface OrderItemListItem {
    id: number;
    menu_item__name: string;
    cup__size__display: string;
    zero_sugar: boolean;
    price: number;
}

export interface OrderItemListItems extends Array<OrderItemListItem> {}
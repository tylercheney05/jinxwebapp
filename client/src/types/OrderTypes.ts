import { OrderNameItem } from "./orderName";
import { OrderItem } from "./orderItem/orderItem";

export interface OrderListItem {
    id: number;
    order_name__name: string;
    is_complete: boolean;
    is_in_progress: boolean;
}

export interface OrderListItems extends Array<OrderListItem> {}

export interface OrderDetailItem {
    id: number;
    order_name: OrderNameItem;
    order_items: OrderItem[];
    pending_price: number;
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
    order__id: number;
}

export interface OrderItemListItems extends Array<OrderItemListItem> {}
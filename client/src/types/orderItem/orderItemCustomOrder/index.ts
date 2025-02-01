import { CustomOrder } from "/types/customOrder/customOrder";

export interface OrderItemCustomOrder {
    id: number;
    custom_order: CustomOrder;
    price: number;
}
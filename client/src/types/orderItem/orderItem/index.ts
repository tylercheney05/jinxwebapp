import { Cup } from "../../cup";
import { OrderItemCustomOrder } from "../orderItemCustomOrder";
import { OrderItemMenuItem } from "../orderItemMenuItem";
import { OrderItemMenuItemCustomOrder } from "../orderItemMenuItemCustomOrder";

export interface OrderItem {
    // Connects with the OrderItemDetailSerializer in the Django API
    id: number;
    menu_item: OrderItemMenuItem | null;
    menu_item_custom_order: OrderItemMenuItemCustomOrder | null;
    custom_order: OrderItemCustomOrder | null;
    cup: Cup;
    low_sugar: boolean;
    note: string;
}
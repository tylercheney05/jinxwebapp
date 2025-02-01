import { MenuItem } from "/types/menuItem"

export interface OrderItemMenuItem {
    // Connects with the OrderItemMenuItemSerializer in the Django API
    id: number
    menu_item: MenuItem;
    price: number;
}
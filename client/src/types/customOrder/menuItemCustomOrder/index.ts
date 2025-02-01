import { CustomOrderFlavorMenuItemCustomOrder } from "/types/customOrderFlavor/customOrderFlavorMenuItemCustomOrder";
import { Soda } from "/types/soda";

export interface MenuItemCustomOrder {
    id: number;
    name: string;
    soda: Soda;
    menu_item_custom_order_custom_order_flavors: CustomOrderFlavorMenuItemCustomOrder[];
}
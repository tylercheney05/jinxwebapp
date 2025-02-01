import { CustomOrderFlavor } from "../customOrderFlavor";

export interface CustomOrderFlavorMenuItemCustomOrder {
    // Connects with the CustomOrderFlavorMenuItemCustomOrderSerializer in the Django API
    id: number;
    custom_order_flavor: CustomOrderFlavor;
}
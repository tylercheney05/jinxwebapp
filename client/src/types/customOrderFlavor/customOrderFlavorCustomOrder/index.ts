import { CustomOrderFlavor } from "../customOrderFlavor";

export interface CustomOrderFlavorCustomOrder {
    // Connects with the CustomOrderFlavorCustomOrderSerializer in the Django API
    id: number;
    custom_order_flavor: CustomOrderFlavor
}
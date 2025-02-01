import { CustomOrderFlavorCustomOrder } from "/types/customOrderFlavor/customOrderFlavorCustomOrder";
import { Soda } from "/types/soda";

export interface CustomOrder {
    // Connects with the CustomOrderSerializer in the Django API
    id: number;
    name: string;
    soda: Soda;
    custom_order_custom_order_flavors: CustomOrderFlavorCustomOrder[];
}
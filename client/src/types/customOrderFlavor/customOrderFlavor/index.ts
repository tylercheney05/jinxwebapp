import { Flavor } from "/types/flavor";

export interface CustomOrderFlavor {
    // Connects with the CustomOrderFlavorSerializer in the Django API
    id: number;
    quantity: number;
    flavor: Flavor;
}
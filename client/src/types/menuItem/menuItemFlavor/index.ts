import { Flavor, FlavorSummary } from "/types/flavor";

  export interface MenuItemFlavor {
    // Connects with the MenuItemFlavorDetailSerializer in the Django API
    id: number;
    flavor: Flavor
    quantity: number;
  }

export interface MenuItemFlavorSummary {
    // Connects with the MenuItemFlavorSummarySerializer in the Django API
    id: number;
    flavor: FlavorSummary;
    quantity: number;
}
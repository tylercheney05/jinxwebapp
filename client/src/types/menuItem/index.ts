import { Flavor } from "../flavor";
import { Soda } from "../soda";

export interface MenuItemListItem {
    id: number;
    name: string;
    soda: number;
    soda__name: string;
    flavors: Array<{
      flavor__name: string,
      quantity: number,
      flavor__flavor_group__uom__display: string,
    }>;
    cup_prices: Array<{
      id: number,
      size: string,
      size__display: string,
      price: number,
    }>;
  }

  export interface MenuItemFlavor {
    // Connects with the MenuItemFlavorDetailSerializer in the Django API
    id: number;
    flavor: Flavor
    quantity: number;
  }
    
  export interface MenuItem {
    // Connects with the MenuItemDetailSerializer in the Django API
    id: number;
    name: string;
    soda: Soda
    flavors: MenuItemFlavor[];
  }
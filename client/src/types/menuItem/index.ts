import { Soda } from "../soda"
import { MenuItemFlavor, MenuItemFlavorSummary } from "./menuItemFlavor"

interface Size {
  value: string
  display: string
}

interface CupPrices {
  id: number
  size: Size
  price: number
}

export interface MenuItemSummary {
  // Connects with the MenuItemSummarySerializer in the Django API
  id: number
  name: string
  flavors: MenuItemFlavorSummary[]
  cup_prices: CupPrices[]
}

export interface MenuItem {
  // Connects with the MenuItemDetailSerializer in the Django API
  id: number
  name: string
  soda: Soda
  flavors: MenuItemFlavor[]
}

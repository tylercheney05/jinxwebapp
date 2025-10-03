import { MenuItemFlavor } from "./menuitemflavor"
import { Soda } from "./soda"

interface Size {
  value: string
  display: string
}

interface CupPrice {
  id: number
  size: Size
  price: number
}

export interface MenuItem {
  id: number
  name: string
  soda: Soda
  is_archived: boolean
  flavors: MenuItemFlavor[]
  cup_prices: CupPrice[]
}

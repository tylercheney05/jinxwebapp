export interface DiscountListItem {
  id: number
  name: string
  code: string
  discount: number
}

export interface DiscountListItems extends Array<DiscountListItem> {}
export interface CupListItem {
  id: number
  size: string
  size__display: string
  price: number
  conversion_factor: number
}

export interface CupListItems extends Array<CupListItem> {}

export interface LocationListItem {
  id: number
  name: string
  address: string
  city: string
  state: string
  zip_code: string
  is_event: boolean
}

export interface LocationListItems {
  locations: LocationListItem[]
}
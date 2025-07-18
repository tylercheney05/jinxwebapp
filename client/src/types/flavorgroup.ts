interface UoM {
  value: string
  display: string
}

export interface FlavorGroup {
  id: number
  name: string
  uom: UoM
  price: number
}

interface Size {
  value: string
  display: string
}

export interface Cup {
  id: number
  size: Size
  price: number
  conversion_factor: number
}

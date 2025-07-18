import { FlavorGroup } from "./flavorgroup"

export interface Flavor {
  id: number
  name: string
  flavor_group: FlavorGroup
  sugar_free_available: boolean
}

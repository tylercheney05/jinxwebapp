import { FlavorGroup } from "./flavorGroup";

  
  export interface FlavorListItem {
    id: number;
    name: string;
    flavor_group__name: string;
  }
  
export interface Flavor {
	// Connects with the FlavorDetailSerializer in the Django API
	id: number;
	name: string;
  flavor_group: FlavorGroup;
  sugar_free_available: boolean;
}
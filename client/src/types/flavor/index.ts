import { FlavorGroup, FlavorGroupSummary } from "./flavorGroup";

export interface Flavor {
  // Connects with the FlavorDetailSerializer in the Django API
	id: number;
	name: string;
  flavor_group: FlavorGroup;
  sugar_free_available: boolean;
}
export interface FlavorSummary {
  // Connects with the FlavorSummarySerializer in the Django
  id: number;
  name: string;
  flavor_group: FlavorGroupSummary;
}
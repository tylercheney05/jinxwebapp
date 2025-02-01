interface UoM {
	value: string;
	display: string;
}

export interface FlavorGroupListItem {
    id: number;
    name: string;
    uom__display: string;
    price: number;
  }
  
export interface FlavorGroup {
		// Connects with the FlavorGroupDetailSerializer in the Django API
		id: number;
		uom: UoM
}
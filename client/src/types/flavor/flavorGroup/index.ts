interface UoM {
	value: string;
	display: string;
}

export interface FlavorGroupSummary {
  // Connects with the FlavorGroupSummarySerializer in the Django API
    id: number;
    name: string;
    uom: UoM;
    price: number;
  }
  
export interface FlavorGroup {
		// Connects with the FlavorGroupDetailSerializer in the Django API
		id: number;
		uom: UoM
}
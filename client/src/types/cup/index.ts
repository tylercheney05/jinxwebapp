interface Size {
    value: string;
    display: string
}

export interface Cup {
    // Connects with the CupDetailSerializer in the Django API
    id: number;
    size: Size;
    price: number;
}

export interface CupSummary {
    // Connects with the CupSerializer in the Django API
    id: number;
    size: Size;
    price: number;
}
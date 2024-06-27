interface CupListItem {
    id: number;
    size: string;
    size__display: string;
    price: number;
}

export interface CupListItems extends Array<CupListItem> {}
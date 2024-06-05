interface SodaListItem {
  id: number;
  name: string;
  zero_sugar: boolean;
}

export interface SodaListItems extends Array<SodaListItem> {}
interface FlavorGroupListItem {
  id: number;
  name: string;
  uom__display: string;
  price: number;
}

export interface FlavorGroupListItems extends Array<FlavorGroupListItem> {}

export interface FlavorListItem {
  id: number;
  name: string;
  flavor_group__name: string;
}

export interface FlavorListItems extends Array<FlavorListItem> {}
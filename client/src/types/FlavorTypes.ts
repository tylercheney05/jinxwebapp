interface FlavorGroupListItem {
  id: number;
  name: string;
}

export interface FlavorGroupListItems extends Array<FlavorGroupListItem> {}

interface FlavorListItem {
  id: number;
  name: string;
  flavor_group__name: string;
}

export interface FlavorListItems extends Array<FlavorListItem> {}
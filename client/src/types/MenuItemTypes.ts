interface MenuItemListItem {
  id: number;
  name: string;
  soda: number;
  soda__name: string;
  flavors: Array<{
    flavor__name: string,
    quantity: number,
    flavor__flavor_group__uom__display: string,
  }>;
}

export interface MenuItemListItems extends Array<MenuItemListItem> {}
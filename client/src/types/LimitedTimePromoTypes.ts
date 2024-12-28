export interface LimitedTimePromoListItem {
  id: number;
  name: string;
  is_archived: boolean;
}

export interface LimitedTimePromoListItems extends Array<LimitedTimePromoListItem> {}
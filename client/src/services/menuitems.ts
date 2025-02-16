import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { convertBooleanToString } from "utils/SharedUtils";
import { MenuItem, MenuItemSummary } from "/types/menuItem";

export const menuItemsApi = createApi({
  reducerPath: "menuItemsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createMenuItem: builder.mutation({
      query: ({ name, soda, menu_item_flavors, limited_time_promo }) => ({
        url: "/api/menu-items",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, soda, menu_item_flavors, limited_time_promo }),
      }),
    }),
    getMenuItemsList: builder.query<MenuItemSummary[], object>({
      query: (params: { 
        soda?: string, 
        limited_time_promotions__limited_time_promo?: string, 
        limited_time_promotions__isnull?: boolean, 
        limited_time_promotions__limited_time_promo__is_archived?: boolean 
      } = {}) => {
        const queryParams = convertBooleanToString(params);
        return `/api/menu-items?${queryParams}`;
      },
    }),
    getMenuItemDetail: builder.query<MenuItem, { id: string}>({
      query: ({ id }) => `/api/menu-items/${id}`
    })
  }),
})

export const { useCreateMenuItemMutation, useGetMenuItemDetailQuery } = menuItemsApi
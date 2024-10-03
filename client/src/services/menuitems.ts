import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

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
    getMenuItemsList: builder.query({
      query: (params: { soda?: string, limited_time_promotions?: string, limited_time_promotions__isnull?: boolean } = {}) => {
        // Convert boolean to string
        const queryParams = new URLSearchParams(
          Object.entries(params).reduce((acc, [key, value]) => {
            if (value !== undefined) {
              acc[key] = String(value);
            }
            return acc;
          }, {} as Record<string, string>)
        ).toString();
        return `/api/menu-items?${queryParams}`;
      },
    }),
    getMenuItemDetail: builder.query({
      query: ({ id }) => `/api/menu-items/${id}`
    })
  }),
})

export const { useCreateMenuItemMutation, useGetMenuItemDetailQuery } = menuItemsApi
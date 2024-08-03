import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const menuItemsApi = createApi({
  reducerPath: "menuItemsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createMenuItem: builder.mutation({
      query: ({ name, soda, menu_item_flavors }) => ({
        url: "/api/menu-items",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, soda, menu_item_flavors }),
      }),
    }),
    getMenuItemsList: builder.query({
      query: (params: { soda?: string } = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        return `/api/menu-items?${queryParams}`;
      },
    }),
    getMenuItemDetail: builder.query({
      query: ({ id }) => `/api/menu-items/${id}`
    })
  }),
})

export const { useCreateMenuItemMutation, useGetMenuItemDetailQuery } = menuItemsApi
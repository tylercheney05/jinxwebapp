import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth } from "./baseQuery"
import { convertBooleanToString } from "utils/SharedUtils"

export const menuItemsApi = createApi({
  reducerPath: "menuItemsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createMenuItem: builder.mutation({
      query: ({ name, soda, flavors, limited_time_menu_item, price }) => ({
        url: "/api/menu-items",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, soda, flavors, limited_time_menu_item, price }),
      }),
    }),
    getMenuItemsList: builder.query({
      query: (
        params: {
          soda?: string
          limited_time_promotions__limited_time_promo?: string
          limited_time_promotions__isnull?: boolean
          limited_time_promotions__limited_time_promo__is_archived?: boolean
        } = {}
      ) => {
        const queryParams = convertBooleanToString(params)
        return `/api/menu-items?${queryParams}`
      },
    }),
    getMenuItemDetail: builder.query({
      query: ({ id }) => `/api/menu-items/${id}`,
    }),
  }),
})

export const { useCreateMenuItemMutation, useGetMenuItemDetailQuery } = menuItemsApi

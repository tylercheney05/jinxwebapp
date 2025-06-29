import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth } from "./baseQuery"
import { Menu } from "/types"

interface CreateMenuArgs {
  version: string
  date: Date
}

export const menusApi = createApi({
  reducerPath: "menusApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createMenu: builder.mutation({
      query: ({ version, date }: CreateMenuArgs) => {
        const cleanedDate = date.toISOString().split("T")[0] // Format date as "YYYY-mm-dd"
        return {
          url: "/api/menus",
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ version, date: cleanedDate }),
        }
      },
    }),
    getMenusList: builder.query<Menu[], object>({
      query: () => {
        return "/api/menus"
      },
    }),
  }),
})

export const { useCreateMenuMutation, useGetMenusListQuery } = menusApi

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { SodaListItems } from "/types/SodaTypes";

export const sodasApi = createApi({
  reducerPath: "sodasApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createSoda: builder.mutation({
      query: ({ name }) => ({
        url: "/api/sodas",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      }),
    }),
    getSodasList: builder.query<SodaListItems, object>({
      query: () => "/api/sodas",
    }),
    getSodasDropdown: builder.query({
      query: () => "/api/sodas/autocomplete",
    }),
  }),
})

export const { useCreateSodaMutation, useGetSodasListQuery, useGetSodasDropdownQuery } = sodasApi
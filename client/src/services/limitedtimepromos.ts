import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const limitedTimePromosApi = createApi({
  reducerPath: "limitedTimePromosApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createLimitedTimePromo: builder.mutation({
      query: ({ name }) => ({
        url: "/api/menu-items/limited-time-promotions/",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })
    }),
    getLimitedTimePromosList: builder.query({
      query: () => "/api/menu-items/limited-time-promotions/"
    }),
    getLimitedTimePromosDropdown: builder.query({
      query: () => "/api/menu-items/limited-time-promotions/autocomplete",
    }),
  }),
})

export const { useCreateLimitedTimePromoMutation, useGetLimitedTimePromosListQuery } = limitedTimePromosApi
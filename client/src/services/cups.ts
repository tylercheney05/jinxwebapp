import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { CupListItems } from "types/CupTypes";

export const cupsApi = createApi({
  reducerPath: "cupsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createCup: builder.mutation({
      query: ({ size, price, conversion_factor }) => ({
        url: "/api/cups",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ size, price, conversion_factor }),
      })
    }),
    getCupsList: builder.query<CupListItems, object>({
      query: (params: Record<string, string>) => {
        const queryParams = new URLSearchParams(params).toString();
        return `/api/cups?${queryParams}`
      }
    }),
    getCupDetail: builder.query({
      query: ({ id }) => `/api/cups/${id}`
    })
  })
})

export const { useCreateCupMutation, useGetCupsListQuery, useGetCupDetailQuery } = cupsApi
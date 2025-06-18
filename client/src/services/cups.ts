import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth } from "./baseQuery"
import { Cup } from "types"

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
      }),
    }),
    updateCup: builder.mutation({
      query: ({ id, size, price, conversion_factor }) => ({
        url: `/api/cups/${id}`,
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ size, price, conversion_factor }),
      }),
    }),
    getCupsList: builder.query<Cup[], object>({
      query: (params: Record<string, string>) => {
        const queryParams = new URLSearchParams(params).toString()
        return `/api/cups?${queryParams}`
      },
    }),
    getCupDetail: builder.query<Cup, { id: number }>({
      query: ({ id }) => `/api/cups/${id}`,
    }),
    getCupDropdown: builder.query({
      query: () => "/api/cups/autocomplete",
    }),
  }),
})

export const { useCreateCupMutation, useGetCupsListQuery, useGetCupDetailQuery, useUpdateCupMutation } = cupsApi

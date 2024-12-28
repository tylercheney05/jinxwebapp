import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { convertBooleanToString } from "utils/SharedUtils";

export const limitedTimePromosApi = createApi({
  reducerPath: "limitedTimePromosApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createLimitedTimePromo: builder.mutation({
      query: ({ name }) => ({
        url: "/api/limited-time-promotions/",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })
    }),
    getLimitedTimePromosList: builder.query({
      query: (params: {
        is_archived?: boolean
      } = {}) => {
        const queryParams = convertBooleanToString(params);
        return `/api/limited-time-promotions?${queryParams}`
      }
    }),
    getLimitedTimePromosDropdown: builder.query({
      query: () => "/api/limited-time-promotions/autocomplete",
    }),
    updateLimitedTimePromo: builder.mutation({
      query: ({ id, name, is_archived }) => ({
        url: `/api/limited-time-promotions/${id}`,
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, is_archived }),
      })
    }),
  }),
})

export const { 
  useCreateLimitedTimePromoMutation, 
  useGetLimitedTimePromosListQuery, 
  useUpdateLimitedTimePromoMutation
} = limitedTimePromosApi
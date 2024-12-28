import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { DiscountListItems } from "/types/DiscountTypes";

export const discountsApi = createApi({
  reducerPath: "discountsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createDiscount: builder.mutation({
      query: ({ name, code, percent_or_price, percent, price, is_cup_specific, cup }) => ({
        url: "/api/discounts",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, code, percent_or_price, percent, price, is_cup_specific, cup}),
      }),
    }),
    getDiscountsList: builder.query<DiscountListItems, object>({
      query: () => "/api/discounts",
    }),
    getDiscountsDropdown: builder.query({
      query: () => "/api/discounts/autocomplete",
    }),
  }),
})

export const { useCreateDiscountMutation, useGetDiscountsListQuery, useGetDiscountsDropdownQuery } = discountsApi
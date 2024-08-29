// Or from '@reduxjs/toolkit/query/react'
import { createApi } from '@reduxjs/toolkit/query/react'
import { OrderItemListItems, OrderNameItems } from 'types/OrderTypes'
import { baseQueryWithReauth } from './baseQuery';

export const orderItemsApi = createApi({
  // Set the baseUrl for every endpoint below
  reducerPath: 'orderItemsApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getOrderItemList: builder.query<OrderItemListItems, object>({
      query: (params: Record<string, string>) => {
        const queryParams = new URLSearchParams(params).toString();
        return `/api/orders/items?${queryParams}`
      },
    }),
    createOrderName: builder.mutation({
      query: ({ name }) => ({
        url: '/api/orders/order-names',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    })
  }),
  getOrderNameList: builder.query<OrderNameItems, object>({
    query: () => '/api/orders/order-names',
  }),
  getOrderNameDropdown: builder.query({
    query: () => '/api/orders/order-names/autocomplete',
  })
})
})

export const { useGetOrderItemListQuery, useCreateOrderNameMutation, useGetOrderNameListQuery } = orderItemsApi
// Or from '@reduxjs/toolkit/query/react'
import { createApi } from '@reduxjs/toolkit/query/react'
import { OrderItemListItems } from '/types/OrderTypes'
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
  }),
})

export const { useGetOrderItemListQuery } = orderItemsApi
import { createApi } from '@reduxjs/toolkit/query/react'
import { OrderDetailItem, OrderItemListItems } from 'types/OrderTypes'
import { OrderNameItems } from 'types/orderName'
import { baseQueryWithReauth } from './baseQuery';

export const orderItemsApi = createApi({
    // Set the baseUrl for every endpoint below
    reducerPath: 'orderItemsApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
      getOrderItemList: builder.query<OrderItemListItems, object>({
        query: (params: Record<string, string>) => {
          const queryParams = new URLSearchParams(params).toString();
          return `/api/order-items?${queryParams}`
        },
      }),
      deleteOrderItem: builder.mutation({
        query: ({ id }) => ({
          url: `/api/order-items/${id}`,
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        })
      }),
      getPrice: builder.query({
        query: (params: Record<string, string>) => {
          const queryParams = new URLSearchParams(params).toString();
          return `/api/order-items/price?${queryParams}`
        }
      })
  })
  })

  export const { useGetOrderItemListQuery, useDeleteOrderItemMutation, useGetPriceQuery } = orderItemsApi
import { createApi } from '@reduxjs/toolkit/query/react'
import { OrderDetailItem, OrderItemListItems } from 'types/OrderTypes'
import { OrderNameItems } from 'types/orderName'
import { baseQueryWithReauth } from './baseQuery';

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getOrderDetail: builder.query<OrderDetailItem, object>({
      query: ({ id }: {id: number}) => `/api/orders/${id}`
    }),
    updateOrderProgress: builder.mutation({
      query: ({ id, is_in_progress, is_complete = false }) => ({
        url: `/api/orders/${id}/update-in-progress`,
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_in_progress, is_complete })
      }), 
    }),
    deleteOrder: builder.mutation({
      query: ({ id }) => ({
        url: `/api/orders/${id}`,
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
    }),
    getPrice: builder.query({
      query: (params: Record<string, string>) => {
        const { id, ...queryParams } = params;
        const queryString = new URLSearchParams(params).toString();
        return `/api/orders/${id}/price?${queryString}`
      }
    })
  }),
})

export const orderNamesApi = createApi({
  reducerPath: 'orderNamesApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createOrderName: builder.mutation({
      query: ({ name }) => ({
        url: '/api/order-names',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      }),
    }),
    getOrderNameList: builder.query<OrderNameItems, object>({
      query: () => '/api/order-names',
    }),
    getOrderNameDropdown: builder.query({
      query: (params: Record<string, string>) => {
        const queryParams = new URLSearchParams(params).toString();
        return `/api/order-names/autocomplete?${queryParams}`
      },
    }),
  }),
})

export const { useGetOrderDetailQuery, useUpdateOrderProgressMutation, useDeleteOrderMutation, useGetPriceQuery } = ordersApi
export const { useCreateOrderNameMutation, useGetOrderNameListQuery } = orderNamesApi

import { baseQueryWithReauth } from "./baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import { FlavorGroupListItem } from "/types/flavor/flavorGroup";

export const flavorGroupsApi = createApi({
  reducerPath: "flavorGroupsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createFlavorGroup: builder.mutation({
      query: ({ name, uom, price }) => ({
        url: "/api/flavor-groups",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, uom, price }),
      })
    }),
    getFlavorGroupsList: builder.query<FlavorGroupListItem[], object>({
      query: () => "/api/flavor-groups"
    }),
    getFlavorGroupsDropdown: builder.query({
      query: () => "/api/flavor-groups/autocomplete"
    })
  })
})

export const flavorsApi = createApi({
  reducerPath: "flavorsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createFlavor: builder.mutation({
      query: ({ name, flavor_group, sugar_free_available }) => ({
        url: "/api/flavors",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, flavor_group, sugar_free_available }),
      })
    }),
    getFlavorsList: builder.query({
      query: (params: Record<string, string>) => {
        const queryParams = new URLSearchParams(params).toString();
         return `/api/flavors?${queryParams}`
      }
    }),
    getFlavorsDropdown: builder.query({
      query: () => "/api/flavors/autocomplete"
    }),
    getFlavorDetail: builder.query({
      query: ({ id }) => `/api/flavors/${id}`
    })
  })
})

export const { useCreateFlavorGroupMutation, useGetFlavorGroupsListQuery } = flavorGroupsApi
export const { useCreateFlavorMutation, useGetFlavorsListQuery } = flavorsApi
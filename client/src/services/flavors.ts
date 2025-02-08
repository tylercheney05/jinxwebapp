import { baseQueryWithReauth } from "./baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import { FlavorGroupSummary } from "/types/flavor/flavorGroup";
import { Flavor, FlavorSummary } from "/types/flavor";

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
    getFlavorGroupsList: builder.query<FlavorGroupSummary[], object>({
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
    getFlavorsList: builder.query<FlavorSummary[], object>({
      query: (params: Record<string, string>) => {
        const queryParams = new URLSearchParams(params).toString();
         return `/api/flavors?${queryParams}`
      }
    }),
    getFlavorsDropdown: builder.query({
      query: () => "/api/flavors/autocomplete"
    }),
    getFlavorDetail: builder.query<Flavor, { id: string }>({
      query: ({ id }) => `/api/flavors/${id}`
    })
  })
})

export const { useCreateFlavorGroupMutation, useGetFlavorGroupsListQuery } = flavorGroupsApi
export const { useCreateFlavorMutation, useGetFlavorsListQuery } = flavorsApi
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const locationsApi = createApi({
  reducerPath: "locationsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createLocation: builder.mutation({
      query: ({ name }) => ({
        url: "/api/locations",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      }),
    }),
    getLocationsList: builder.query({
      query: () => "/api/locations",
    }),
    getLocationsDropdown: builder.query({
      query: () => "/api/locations/autocomplete",
    }),
    getLocationDetail: builder.query({
      query: ({ id }) => `/api/locations/${id}`,
    })
  }),
})

export const { useCreateLocationMutation, useGetLocationsListQuery, useGetLocationDetailQuery } = locationsApi
import { configureStore } from "@reduxjs/toolkit"
import userReducer from "features/user"
import ordersReducer from "features/orders"
import locationReducer from "features/location"
import { orderItemsApi } from "./services/orders"
import { setupListeners } from "@reduxjs/toolkit/query"
import { cupsApi } from "./services/cups"
import { flavorGroupsApi, flavorsApi } from "./services/flavors"
import { menuItemsApi } from "./services/menuitems"
import { sodasApi } from "./services/sodas"
import { locationsApi } from "./services/locations"

export const store = configureStore({
  reducer: {
    user: userReducer,
    orders: ordersReducer,
    location: locationReducer,
    [orderItemsApi.reducerPath]: orderItemsApi.reducer,
    [cupsApi.reducerPath]: cupsApi.reducer,
    [flavorGroupsApi.reducerPath]: flavorGroupsApi.reducer,
    [flavorsApi.reducerPath]: flavorsApi.reducer,
    [menuItemsApi.reducerPath]: menuItemsApi.reducer,
    [sodasApi.reducerPath]: sodasApi.reducer,
    [locationsApi.reducerPath]: locationsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      orderItemsApi.middleware, 
      cupsApi.middleware,
      flavorGroupsApi.middleware,
      flavorsApi.middleware,
      menuItemsApi.middleware,
      sodasApi.middleware,
      locationsApi.middleware,
    ),
  devTools: process.env.NODE_ENV !== "production",
})

setupListeners(store.dispatch)

// Get the type of our store variable
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch']
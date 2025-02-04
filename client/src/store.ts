import { configureStore } from "@reduxjs/toolkit"
import userReducer from "features/user"
import ordersReducer from "features/orders"
import locationReducer from "features/location"
import { ordersApi, orderNamesApi } from "./services/orders"
import { orderItemsApi } from "./services/orderitems"
import { setupListeners } from "@reduxjs/toolkit/query"
import { cupsApi } from "./services/cups"
import { flavorGroupsApi, flavorsApi } from "./services/flavors"
import { menuItemsApi } from "./services/menuitems"
import { sodasApi } from "./services/sodas"
import { locationsApi } from "./services/locations"
import { limitedTimePromosApi } from "./services/limitedtimepromos"
import { discountsApi } from "./services/discounts"

export const store = configureStore({
  reducer: {
    user: userReducer,
    orders: ordersReducer,
    location: locationReducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [orderItemsApi.reducerPath]: orderItemsApi.reducer,
    [orderNamesApi.reducerPath]: orderNamesApi.reducer,
    [cupsApi.reducerPath]: cupsApi.reducer,
    [flavorGroupsApi.reducerPath]: flavorGroupsApi.reducer,
    [flavorsApi.reducerPath]: flavorsApi.reducer,
    [menuItemsApi.reducerPath]: menuItemsApi.reducer,
    [sodasApi.reducerPath]: sodasApi.reducer,
    [locationsApi.reducerPath]: locationsApi.reducer,
    [limitedTimePromosApi.reducerPath]: limitedTimePromosApi.reducer,
    [discountsApi.reducerPath]: discountsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      ordersApi.middleware,
      orderItemsApi.middleware, 
      orderNamesApi.middleware,
      cupsApi.middleware,
      flavorGroupsApi.middleware,
      flavorsApi.middleware,
      menuItemsApi.middleware,
      sodasApi.middleware,
      locationsApi.middleware,
      limitedTimePromosApi.middleware,
      discountsApi.middleware,
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
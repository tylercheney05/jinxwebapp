import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { OrderListItems } from "/types/OrderTypes";
import { refreshAuth } from "./user";

interface OrderItemProps {
    menu_item: number;
    cup: number;
    low_sugar: boolean;
    order__location: number;
    note: string;
    custom_order__soda: number;
    custom_order_flavors: any[];
}

interface CompleteOrderProps {
    id: number;
    is_paid: boolean;
    order_name: number;
    paid_amount: number;
    discount: number;
}

interface CounterState {
  orders: OrderListItems;
	loading: boolean;
  ordersQueued: OrderListItems;
}

export const listUserOrders = createAsyncThunk(
	'user-orders/list', 
	async (params: { collected_by?: string, is_paid?: string } = {}, thunkAPI) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/api/user-orders?${queryParams}`;
    function callApi() {
      return fetch(url, {
        method: "GET",
        headers: {
          Accept: 'application/json',
        }
      })
    }
    try {

        const res = await callApi();
        const data = await res.json();

				if (res.status === 401) {
					const { dispatch } = thunkAPI;
					await dispatch(refreshAuth());
          const res = await callApi();
          const data = await res.json();
          return data;
				} else if (res.status === 200) {
					return data;
				} else {
					return thunkAPI.rejectWithValue(data);
				}
    } catch(err: any) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
})

export const listOrdersQueue = createAsyncThunk(
	'orders-queue/list', 
	async (params: { location?: string, is_complete?: string, is_paid?: string } = {}, thunkAPI) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/api/orders-queue?${queryParams}`;
    function callApi() {
      return fetch(url, {
        method: "GET",
        headers: {
          Accept: 'application/json',
        }
      })
    }
    try {

        const res = await callApi();
        const data = await res.json();

				if (res.status === 401) {
					const { dispatch } = thunkAPI;
					await dispatch(refreshAuth());
          const res = await callApi();
          const data = await res.json();
          return data;
				} else if (res.status === 200) {
					return data;
				} else {
					return thunkAPI.rejectWithValue(data);
				}
    } catch(err: any) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
})

export const createOrderItem = createAsyncThunk(
	'order-items/create', 
	async ({ menu_item, cup, low_sugar, order__location, note, custom_order__soda, custom_order_flavors }: OrderItemProps, thunkAPI) => {
		const body = JSON.stringify({ menu_item, cup, low_sugar, order__location, note, custom_order__soda, custom_order_flavors });
    function callApi() {
      return fetch("/api/order-items", {
          method: "POST",
          headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
              },
          body
      })}
    try {
        const res = await callApi();
        const data = await res.json();
				
				if (res.status === 401) {
					const { dispatch } = thunkAPI;
					await dispatch(refreshAuth());
          const res = await callApi();
          const data = await res.json();
          return data;
				} else if (res.status === 201) {
					const { dispatch } = thunkAPI;
					dispatch(listUserOrders({ collected_by: String(data.order__collected_by), is_paid: "false" }));
					return data;
				} else {
					return thunkAPI.rejectWithValue(data);
				}
    } catch(err: any) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
})

export const completeOrderPayment = createAsyncThunk(
	'order/complete', 
	async ({ id, is_paid, order_name, paid_amount, discount }: CompleteOrderProps, thunkAPI) => {
		const body = JSON.stringify({ is_paid, order_name, paid_amount, discount });
    function callApi() {
      return fetch(`/api/orders/${id}/complete-order-payment`, {
        method: "PATCH",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body
      })
    }
    try {
        const res = await callApi();
        const data = await res.json();

				if (res.status === 401) {
					const { dispatch } = thunkAPI;
					await dispatch(refreshAuth());
					const res = await callApi();
          const data = await res.json();
          return data;
				} else if (res.status === 200) {
					const { dispatch } = thunkAPI;
					dispatch(listUserOrders({ collected_by: String(data.collected_by), is_paid: "false" }));
					dispatch(listOrdersQueue({ location: String(data.location), is_complete: "false", is_paid: "true" }));
          return data;
				} else {
					return thunkAPI.rejectWithValue(data);
				}
    } catch(err: any) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
})

const initialState = { orders: [], loading: false, ordersQueued: [] } satisfies CounterState as CounterState;

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: builder => {
      builder
				.addCase(listUserOrders.pending, state => {
					state.loading = true;
				})
				.addCase(listUserOrders.fulfilled, (state, action) => {
					state.loading = false;
					state.orders = action.payload;
				})
				.addCase(listUserOrders.rejected, state => {
					state.loading = false;
				})
        .addCase(listOrdersQueue.fulfilled, (state, action) => {
          state.ordersQueued = action.payload;
        })
    }
})

export default ordersSlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { OrderListItems } from "/types/OrderTypes";

interface OrderItemProps {
    menu_item: number;
    cup: number;
    zero_sugar: boolean;
}

interface CompleteOrderProps {
    id: number;
    is_paid: boolean;
}

interface CounterState {
    orders: OrderListItems;
		loading: boolean;
}

export const listOrders = createAsyncThunk(
	'orders/list', 
	async (params: { completed_by?: string, is_paid?: string } = {}, thunkAPI) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/api/orders?${queryParams}`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: 'application/json',
            },
        })

        const data = await res.json();

        if (res.status === 200) {
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
	async ({ menu_item, cup, zero_sugar }: OrderItemProps, thunkAPI) => {
		const body = JSON.stringify({ menu_item, cup, zero_sugar });
    try {
        const res = await fetch("/api/orders/items", {
            method: "POST",
            headers: {
                Accept: 'application/json',
								'Content-Type': 'application/json'
            },
						body
        })

        const data = await res.json();

        if (res.status === 201) {
					const { dispatch } = thunkAPI;

					dispatch(listOrders({ completed_by: String(data.order__completed_by), is_paid: "false" }));

					return data;
        } else {
            return thunkAPI.rejectWithValue(data);
        }
    } catch(err: any) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
})

export const listOrderItems = createAsyncThunk(
	'order-items/list', 
	async (params: { order__completed_by?: string, order__is_paid?: string } = {}, thunkAPI) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/api/orders/items?${queryParams}`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: 'application/json',
            },
        })

        const data = await res.json();

        if (res.status === 200) {
					return data;
        } else {
            return thunkAPI.rejectWithValue(data);
        }
    } catch(err: any) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
})

export const completeOrder = createAsyncThunk(
	'order/complete', 
	async ({ id, is_paid }: CompleteOrderProps, thunkAPI) => {
		const body = JSON.stringify({ is_paid });

    try {
        const res = await fetch(`/api/orders/${id}/complete-order`, {
            method: "PATCH",
            headers: {
                Accept: 'application/json',
								'Content-Type': 'application/json'
            },
						body
        })

        const data = await res.json();

        if (res.status === 200) {
					const { dispatch } = thunkAPI;

					dispatch(listOrders({ completed_by: String(data.completed_by), is_paid: "false" }));

					return data;
        } else {
            return thunkAPI.rejectWithValue(data);
        }
    } catch(err: any) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
})

const initialState = { orders: [], loading: false } satisfies CounterState as CounterState;

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: builder => {
      builder
				.addCase(listOrders.pending, state => {
					state.loading = true;
				})
				.addCase(listOrders.fulfilled, (state, action) => {
					state.loading = false;
					state.orders = action.payload;
				})
				.addCase(listOrders.rejected, state => {
					state.loading = false;
				})
    }
})

export default ordersSlice.reducer;
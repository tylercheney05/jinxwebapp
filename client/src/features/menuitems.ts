import { createAsyncThunk } from "@reduxjs/toolkit";

interface MenuItemProps {
	name: string;
    soda: {
        value: number;
        label: string;
    };
    menu_item_flavors: Array<{
        flavor: {
            value: number;
            label: string;
        };
    }>;
}

export const createMenuItem = createAsyncThunk(
	'menu-items/create', 
	async ({ name, soda, menu_item_flavors }: MenuItemProps, thunkAPI) => {
		const body = JSON.stringify({ name, soda, menu_item_flavors });
    try {
        const res = await fetch("/api/menu-items", {
            method: "POST",
            headers: {
                Accept: 'application/json',
								'Content-Type': 'application/json'
            },
						body
        })

        const data = await res.json();

        if (res.status === 201) {
					return data;
        } else {
            return thunkAPI.rejectWithValue(data);
        }
    } catch(err: any) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
})

export const listMenuItems = createAsyncThunk(
	'menu-items/list', 
	async (params: { soda?: string } = {}, thunkAPI) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/api/menu-items?${queryParams}`;

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
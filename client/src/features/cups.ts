import { createAsyncThunk } from "@reduxjs/toolkit";

interface CupProps {
		size: string;
        price: number;
        conversion_factor: number;
}

export const createCup = createAsyncThunk(
	'cups/create', 
	async ({ size, price, conversion_factor }: CupProps, thunkAPI) => {
		const body = JSON.stringify({ size, price, conversion_factor });
    try {
        const res = await fetch("/api/cups", {
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

export const listCups = createAsyncThunk(
	'cups/list', 
	async (_, thunkAPI) => {
    try {
        const res = await fetch("/api/cups", {
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

export const dropdownCups = createAsyncThunk(
	'cups/dropdown', 
	async (_, thunkAPI) => {
    try {
        const res = await fetch("/api/cups/autocomplete", {
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


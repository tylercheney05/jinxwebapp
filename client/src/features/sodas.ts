import { createAsyncThunk } from "@reduxjs/toolkit";

interface SodaProps {
		name: string;
}

export const createSoda = createAsyncThunk(
	'sodas/create', 
	async ({ name }: SodaProps, thunkAPI) => {
		const body = JSON.stringify({ name });
    try {
        const res = await fetch("/api/sodas", {
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

export const listSodas = createAsyncThunk(
	'sodas/list', 
	async (_, thunkAPI) => {
    try {
        const res = await fetch("/api/sodas", {
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

export const dropdownSodas = createAsyncThunk(
	'sodas/dropdown', 
	async (_, thunkAPI) => {
    try {
        const res = await fetch("/api/sodas/autocomplete", {
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


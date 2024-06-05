import { createAsyncThunk } from "@reduxjs/toolkit";

interface SodaProps {
		name: string;
		zero_sugar: boolean;
}

export const createSoda = createAsyncThunk(
	'sodas/create', 
	async ({ name, zero_sugar }: SodaProps, thunkAPI) => {
		const body = JSON.stringify({ name, zero_sugar });
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


import { createAsyncThunk } from "@reduxjs/toolkit";

interface SodaProps {
		name: string;
}

export const createFlavor = createAsyncThunk(
	'flavors/create', 
	async ({ name }: SodaProps, thunkAPI) => {
		const body = JSON.stringify({ name });
    try {
        const res = await fetch("/api/flavors", {
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

export const listFlavors = createAsyncThunk(
	'flavors/list', 
	async (_, thunkAPI) => {
    try {
        const res = await fetch("/api/flavors", {
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


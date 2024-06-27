import { createAsyncThunk } from "@reduxjs/toolkit";

interface FlavorGroupProps {
        name: string;

        uom: {
                value: string;
                label: string;
        }
}

interface FlavorProps {
		name: string;
		flavor_group: {
				value: string;
				label: string;
		};
}

interface DetailFlavorProps {
    id: string;
}

export const createFlavorGroup = createAsyncThunk(
	'flavor-groups/create', 
	async ({ name, uom }: FlavorGroupProps, thunkAPI) => {
		const body = JSON.stringify({ name, uom });
    try {
        const res = await fetch("/api/flavors/groups", {
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

export const listFlavorGroups = createAsyncThunk(
	'flavor-groups/list', 
	async (_, thunkAPI) => {
    try {
        const res = await fetch("/api/flavors/groups", {
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

export const dropdownFlavorGroups = createAsyncThunk(
	'flavor-groups/dropdown', 
	async (_, thunkAPI) => {
    try {
        const res = await fetch("/api/flavors/groups/autocomplete", {
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

export const createFlavor = createAsyncThunk(
	'flavors/create', 
	async ({ name, flavor_group }: FlavorProps, thunkAPI) => {
		const body = JSON.stringify({ name, flavor_group });
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

export const dropdownFlavors = createAsyncThunk(
	'flavors/dropdown', 
	async (_, thunkAPI) => {
    try {
        const res = await fetch("/api/flavors/autocomplete", {
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

export const detailFlavor = createAsyncThunk(
	'flavors/detail', 
	async ({ id }: DetailFlavorProps, thunkAPI) => {
    try {
        const res = await fetch(`/api/flavors/${id}`, {
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


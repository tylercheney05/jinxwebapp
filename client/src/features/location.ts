import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface CounterState {
  locationId: string;
}

export const setLocationCookie = createAsyncThunk(
  'locations/setCookie',
  async ({ locationId }: { locationId: number }, thunkAPI) => {
    try {
      const res = await fetch('/api/locations/set-cookie', {
        method: "PATCH",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ locationId }),
      });
      const data = await res.json();
      if (res.status === 200) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
)

export const getLocationCookie = createAsyncThunk(
  'locations/getCookie',
  async (_, thunkAPI) => {
    try {
      const res = await fetch('/api/locations/get-cookie', {
        method: "GET",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (res.status === 200) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
)

const initialState = { locationId: "" } satisfies CounterState as CounterState

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getLocationCookie.fulfilled, (state, action) => {
        state.locationId = action.payload.locationId;
      })
      .addCase(getLocationCookie.rejected, (state) => {
        state.locationId = "";
      })
      .addCase(setLocationCookie.fulfilled, (state, action) => {
        state.locationId = action.payload.locationId;
      })
      .addCase(setLocationCookie.rejected, (state) => {
        state.locationId = "";
      })
  }
})

export default locationSlice.reducer
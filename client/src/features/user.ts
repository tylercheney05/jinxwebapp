import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getLocationCookie } from './location';

interface UserProps {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface LoginProps {
  email: string;
  password: string;
}

interface CounterState {
  isAuthenticated: boolean | null;
  user: null | MeProps,
  loading: boolean;
  registered: boolean;
}

interface MeProps {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_admin: boolean;
  is_staff: boolean;
}

export const register = createAsyncThunk(
  'users/register', 
  async ({ first_name, last_name, email, password}: UserProps, thunkAPI) => {
  const body = JSON.stringify({ first_name, last_name, email, password });
  
  try {
    const res = await fetch('/api/users/register', {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body
    })
  
    const data = await res.json();
  
    if (res.status === 201) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(data);
    }
  }
   catch(err: any) {
    return thunkAPI.rejectWithValue(err.response.data);
   }
})

const getUser = createAsyncThunk('users/me', async (_, thunkAPI) => {
  try{
    const res = await fetch('/api/users/me', {
      method: "GET",
      headers: {
        Accept: 'application/json',
      }
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

export const login = createAsyncThunk(
  'users/login', 
  async ({ email, password}: LoginProps, thunkAPI) => {
  const body = JSON.stringify({ email, password });

  try {
    const res = await fetch('/api/users/login', {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body
    })
  
    const data = await res.json();
  
    if (res.status === 200) {
      const { dispatch } = thunkAPI;

      dispatch(getUser());
      
      return data;
    } else {
      return thunkAPI.rejectWithValue(data);
    }
  }
   catch(err: any) {
    return thunkAPI.rejectWithValue(err.response.data);
   }
})

export const checkAuth = createAsyncThunk(
  "users/verify", async (_, thunkAPI) => {
    try {
      const res = await fetch('/api/users/verify', {
        method: "GET",
        headers: {
          Accept: 'application/json',
        },
      })
    
      const data = await res.json();
    
      if (res.status === 200) {
        const { dispatch } = thunkAPI;
  
        dispatch(getUser());
        dispatch(getLocationCookie());
        
        return data;
      } else if (res.status === 401) {
        const { dispatch } = thunkAPI;

        dispatch(refreshAuth()).then(response => {
          if (response.meta.requestStatus === 'fulfilled') {
            dispatch(checkAuth());
          } else {
            return thunkAPI.rejectWithValue(data);
          }
        })
      } 
      else {
        return thunkAPI.rejectWithValue(data);
      }
    }
     catch(err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
     }
  }
)

export const logout = createAsyncThunk(
  'users/logout', 
  async (_, thunkAPI) => {
  
  try {
    const res = await fetch('/api/users/logout', {
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
  }
   catch(err: any) {
    return thunkAPI.rejectWithValue(err.response.data);
   }
})

export const refreshAuth = createAsyncThunk(
  "users/refresh", async (_, thunkAPI) => {
    try {
      const res = await fetch('/api/users/refresh', {
        method: "POST",
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
    }
     catch(err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
     }
  }
)

const initialState = { isAuthenticated: null, user: null, loading: false, registered: false } satisfies CounterState as CounterState

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetRegistered: (state) => {
      state.registered = false;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(register.pending, state => {
      state.loading = true;
    })
      .addCase(register.fulfilled, state => {
        state.loading = false;
        state.registered = true;
      })
      .addCase(register.rejected, state => {
        state.loading = false;
      })
      .addCase(login.pending, state => {
        state.loading = true;
      })
      .addCase(login.fulfilled, state => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, state => {
        state.loading = false;
      })
      .addCase(getUser.pending, state => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, state => {
        state.loading = false;
      })
      .addCase(checkAuth.pending, state => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, state => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, state => {
        state.loading = false;
        state.isAuthenticated = false;
      })
      .addCase(logout.pending, state => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, state => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logout.rejected, state => {
        state.loading = false;
      })
  }
})

export const { resetRegistered } = userSlice.actions
export default userSlice.reducer
import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'
import { logout, refreshAuth } from 'features/user';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({ baseUrl: '' })
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    // try to get a new token
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await api.dispatch(refreshAuth());
        if (refreshResult.meta.requestStatus === 'fulfilled') {
          result = await baseQuery(args, api, extraOptions)
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result
}

export { baseQueryWithReauth }
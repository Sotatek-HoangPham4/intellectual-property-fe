import {
  fetchBaseQuery,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { RootState } from "../index";
import {
  setAccessToken,
  setTokenExpired,
  clearCredentials,
} from "../slices/authSlice";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9000/api/v1";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem("accessToken");

    console.log(token);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  // ✅ 401 detected
  if (result.error?.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      api.dispatch(setTokenExpired(true));
      api.dispatch(clearCredentials());
      return result;
    }

    // 🔁 Refresh token
    const refreshResult = await rawBaseQuery(
      {
        url: "/auth/token/refresh",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const { accessToken, refreshToken: newRefreshToken } = (
        refreshResult.data as any
      ).data;

      // 🔐 Update redux
      api.dispatch(setAccessToken(accessToken));

      // 💾 Persist
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      // 🔁 Retry original request
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(setTokenExpired(true));
      api.dispatch(clearCredentials());
    }
  }

  return result;
};

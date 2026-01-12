import { ApiResponse } from "@/core/domain/types/api-response";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9000/api/v1";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/auth`,
    credentials: "include",
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    registerOTP: builder.mutation<SendOTPResponse, SendOTPRequest>({
      query: (data) => ({
        url: "register/otp",
        method: "POST",
        body: data,
      }),
    }),

    verifyRegisterOTP: builder.mutation<VerifyOTPResponse, VerifyOTPRequest>({
      query: (data) => ({
        url: "register/otp/verify",
        method: "POST",
        body: data,
      }),
    }),

    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: "register",
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>({
      query: (body) => ({
        url: "login",
        method: "POST",
        body,
      }),
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
    }),

    // getMe: builder.query<ApiResponse<any>, void>({
    //   query: () => ({
    //     url: "me",
    //     method: "GET",
    //   }),
    // }),

    forgotPassword: builder.mutation<ForgotPasswordResponse, any>({
      query: (data) => ({
        url: "password/forgot",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<ResetPasswordResponse, any>({
      query: (data) => ({
        url: "password/reset",
        method: "POST",
        body: data,
      }),
    }),
    refreshToken: builder.mutation<RefreshTokenResponse, any>({
      query: (data) => ({
        url: "token/refresh",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterOTPMutation,
  useVerifyRegisterOTPMutation,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
} = authApi;

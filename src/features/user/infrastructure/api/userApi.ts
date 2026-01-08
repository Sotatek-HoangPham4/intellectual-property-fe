import { baseQueryWithReauth } from "@/store/middlewares/baseQueryWithReauth";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9000/api/v1";

export type UserSearchItem = {
  id: string;
  email: string;
  username?: string | null;
  fullname?: string | null;
  avatar_url?: string | null;
};

type UserSearchResponse = {
  status: "success" | "error";
  message?: string;
  data?: UserSearchItem[] | { users?: UserSearchItem[] };
};

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsers: builder.query<any[], void>({
      query: () => ``,
      providesTags: ["User"],
    }),
    getUserById: builder.query<any, string>({
      query: (id) => `${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    createUser: builder.mutation<any, any>({
      query: (body) => ({
        url: ``,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    getMe: builder.query<any, void>({
      query: () => `me`,
      providesTags: ["User"],
    }),
    updateMe: builder.mutation<any, any>({
      query: (body) => ({
        url: `me`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // Verify Identity
    verifyIdentity: builder.mutation<any, any>({
      query: (body) => ({
        url: `/auth/verify-identity`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // 2FA
    setup2FA: builder.mutation<any, any>({
      query: () => ({
        url: `/auth/2fa/setup`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    verify2FA: builder.mutation<any, any>({
      query: (body) => ({
        url: `/auth/2fa/verify`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    disable2FA: builder.mutation<any, any>({
      query: (body) => ({
        url: `/auth/2fa/disable`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // Password
    changePassword: builder.mutation<any, any>({
      query: (body) => ({
        url: `/auth/password/change`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    setPassword: builder.mutation<any, any>({
      query: (body) => ({
        url: `/auth/password/set`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // Change Email
    changeEmail: builder.mutation<any, any>({
      query: (body) => ({
        url: `/email/change`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    verifyCurrentEmail: builder.mutation<any, any>({
      query: (body) => ({
        url: `/email/verify-current-email`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    verifyNewEmail: builder.mutation<any, any>({
      query: (body) => ({
        url: `/email/verify-new-email`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    confirmNewEmail: builder.mutation<any, any>({
      query: (body) => ({
        url: `/email/confirm-new-email`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    searchUsersByEmail: builder.query<UserSearchItem[], string>({
      query: (q) => ({
        url: `/users/search?email=${encodeURIComponent(q)}`,
        method: "GET",
      }),
      transformResponse: (res: UserSearchResponse) => {
        // tùy BE trả data là array hay {users:[]}
        const d: any = res?.data;
        if (Array.isArray(d)) return d;
        if (d?.users && Array.isArray(d.users)) return d.users;
        return [];
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  // Verify Identity
  useVerifyIdentityMutation,
  // 2FA
  useSetup2FAMutation,
  useVerify2FAMutation,
  useDisable2FAMutation,
  // Password
  useChangePasswordMutation,
  useSetPasswordMutation,
  // Email
  useChangeEmailMutation,
  useVerifyCurrentEmailMutation,
  useVerifyNewEmailMutation,
  useConfirmNewEmailMutation,
  useSearchUsersByEmailQuery,
} = userApi;

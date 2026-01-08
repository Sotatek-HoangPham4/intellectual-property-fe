// src/features/role/infrastructure/api/roleApi.ts
import { apiSlice } from "@/store/api/apiSlice";

/**
 * Response shape from BE:
 * {
 *   status: "success",
 *   message: "...",
 *   data: { roles: Role[] },
 *   timestamp: "..."
 * }
 */

export type PublicRole = {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: string; // BE đang trả {} nên để unknown cho an toàn
  updatedAt?: string | null;
};

type GetPublicRolesResponse = {
  status: "success" | "error";
  message?: string;
  data?: {
    roles?: PublicRole[];
  };
  timestamp?: string;
};

export const roleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublicRoles: builder.query<PublicRole[], void>({
      query: () => ({
        url: "/roles/public",
        method: "GET",
      }),
      transformResponse: (res: GetPublicRolesResponse) => {
        return res?.data?.roles ?? [];
      },
      providesTags: (result) =>
        result
          ? [
              { type: "Role" as const, id: "LIST" },
              ...result.map((r) => ({ type: "Role" as const, id: r.id })),
            ]
          : [{ type: "Role" as const, id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetPublicRolesQuery } = roleApi;

import { apiSlice } from "@/store/api/apiSlice";
import type { Organization } from "../../domain/models/organization";
import { ApiResponse } from "@/core/domain/types/api-response";

export type OrgMembership = {
  id: string; // membership id
  organizationId: string;
  userId: string;
  roleId: string;
  joinedAt: string;
};

export type CreateOrganizationDto = {
  name: string;
  description?: string;
};

export type UpdateOrganizationDto = {
  name?: string;
  description?: string;
};

// ===== Types
export type OrgMember = {
  id: string;
  organizationId: string;
  userId: string;
  roleId: string;
  joinedAt: string;

  user: {
    id: string;
    email: string;
    username: string;
    avatar_url: string | null;
  };

  role: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string | null;
  };
};

export type AddMemberDto = { userId: string; roleId: string };

export const organizationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ BE: GET /organizations/me => trả membership list
    getMyOrganizations: builder.query<OrgMembership[], void>({
      query: () => ({
        url: "/organizations/me",
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<OrgMembership[]>) => res.data ?? [],
      providesTags: (result) => [
        { type: "Organization" as const, id: "LIST" },
        ...(result ?? []).map((m) => ({
          type: "Organization" as const,
          id: m.organizationId,
        })),
      ],
    }),

    // ✅ BE: GET /organizations/:id (wrapper)
    getOrganizationById: builder.query<Organization, string>({
      query: (id) => ({
        url: `/organizations/${id}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<Organization>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Organization" as const, id }],
    }),

    // ✅ create/update/delete cũng nên unwrap (nếu BE trả wrapper)
    createOrganization: builder.mutation<Organization, CreateOrganizationDto>({
      query: (body) => ({
        url: "/organizations",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<Organization>) => res.data,
      invalidatesTags: [{ type: "Organization" as const, id: "LIST" }],
    }),

    updateOrganization: builder.mutation<
      Organization,
      { id: string; body: UpdateOrganizationDto }
    >({
      query: ({ id, body }) => ({
        url: `/organizations/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (res: ApiResponse<Organization>) => res.data,
      invalidatesTags: (_res, _err, arg) => [
        { type: "Organization" as const, id: "LIST" },
        { type: "Organization" as const, id: arg.id },
      ],
    }),

    deleteOrganization: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({
        url: `/organizations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Organization" as const, id: "LIST" },
        { type: "Organization" as const, id },
      ],
    }),

    getOrganizationMembers: builder.query<OrgMember[], string>({
      query: (orgId) => ({
        url: `/organizations/${orgId}/members`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<OrgMember[]>) => res.data ?? [],
      providesTags: (_res, _err, orgId) => [
        { type: "Organization" as const, id: orgId },
        { type: "Organization" as const, id: `${orgId}:MEMBERS` },
      ],
    }),

    addOrganizationMember: builder.mutation<
      { message?: string; data?: OrgMember[] } | OrgMember[] | unknown,
      { orgId: string; body: AddMemberDto }
    >({
      query: ({ orgId, body }) => ({
        url: `/organizations/${orgId}/members`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Organization" as const, id: `${arg.orgId}:MEMBERS` },
      ],
    }),

    removeOrganizationMember: builder.mutation<
      unknown,
      { orgId: string; userId: string }
    >({
      query: ({ orgId, userId }) => ({
        url: `/organizations/${orgId}/members/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Organization" as const, id: `${arg.orgId}:MEMBERS` },
      ],
    }),

    changeMemberRole: builder.mutation<
      unknown,
      { orgId: string; userId: string; roleId: string }
    >({
      query: ({ orgId, userId, roleId }) => ({
        url: `/organizations/${orgId}/members/${userId}/role`,
        method: "PUT",
        body: { role: roleId }, // BE đang đọc @Body('role')
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Organization" as const, id: `${arg.orgId}:MEMBERS` },
      ],
    }),
  }),
});

export const {
  useGetMyOrganizationsQuery, // trả OrgMembership[]
  useGetOrganizationByIdQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  useGetOrganizationMembersQuery,
  useAddOrganizationMemberMutation,
  useRemoveOrganizationMemberMutation,
  useChangeMemberRoleMutation,
} = organizationApi;

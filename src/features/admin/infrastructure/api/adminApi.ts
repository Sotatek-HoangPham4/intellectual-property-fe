import { apiSlice } from "@/store/api/apiSlice";
import { ApiResponse } from "@/core/domain/types/api-response";

// ===== Models
export type AdminUser = {
  id: string;
  email: string;
  name?: string;
  role?: string; // e.g. "user" | "admin"
  isActive?: boolean;
  createdAt?: string;
};

export type AdminPortfolio = {
  id: string;
  name: string;
  baseCurrency: string;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminCopilotSession = {
  id: string;
  userId?: string;
  portfolioId?: string;
  title?: string;
  createdAt?: string;
  archivedAt?: string | null;
  messageCount?: number;
};

export type AdminRiskReport = {
  id: string;
  portfolioId: string;
  createdAt?: string;
  riskLevel?: string; // low/medium/high
};

export type AdminOverviewMetrics = {
  totalUsers?: number;
  totalPortfolios?: number;
  totalSessions?: number;
  totalRiskReports?: number;
  activeUsers7d?: number;
};

// ===== Query helpers
export type PageQuery = {
  q?: string;
  page?: number;
  limit?: number;
};

function toQueryString(q: Record<string, any>) {
  const params = new URLSearchParams();
  Object.entries(q).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    params.set(k, String(v));
  });
  const s = params.toString();
  return s ? `?${s}` : "";
}

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ========= Overview
    // GET /api/v1/admin/overview
    getAdminOverview: builder.query<AdminOverviewMetrics, void>({
      query: () => ({ url: `/api/v1/admin/overview`, method: "GET" }),
      transformResponse: (res: ApiResponse<AdminOverviewMetrics> | any) =>
        res?.data ?? res,
      providesTags: [{ type: "AdminMetrics" as const, id: "OVERVIEW" }],
    }),

    // ========= Users
    // GET /api/v1/admin/users?q=&page=&limit=
    listAdminUsers: builder.query<
      { items: AdminUser[]; total?: number },
      PageQuery | void
    >({
      query: (arg) => ({
        url: `/api/v1/admin/users${toQueryString(arg ?? {})}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<any> | any) =>
        res?.data ?? res ?? { items: [] },
      providesTags: (result) =>
        result?.items
          ? [
              { type: "AdminUser" as const, id: "LIST" },
              ...result.items.map((u: AdminUser) => ({
                type: "AdminUser" as const,
                id: u.id,
              })),
            ]
          : [{ type: "AdminUser" as const, id: "LIST" }],
    }),

    // PATCH /api/v1/admin/users/:id (e.g activate/deactivate, role)
    updateAdminUser: builder.mutation<
      AdminUser,
      { id: string; body: Partial<AdminUser> }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/admin/users/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: ApiResponse<AdminUser> | any) =>
        res?.data ?? res,
      invalidatesTags: (_r, _e, arg) => [
        { type: "AdminUser" as const, id: "LIST" },
        { type: "AdminUser" as const, id: arg.id },
      ],
    }),

    // ========= Portfolios
    // GET /api/v1/admin/portfolios?q=&page=&limit=
    listAdminPortfolios: builder.query<
      { items: AdminPortfolio[]; total?: number },
      PageQuery | void
    >({
      query: (arg) => ({
        url: `/api/v1/admin/portfolios${toQueryString(arg ?? {})}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<any> | any) =>
        res?.data ?? res ?? { items: [] },
      providesTags: (result) =>
        result?.items
          ? [
              { type: "AdminPortfolio" as const, id: "LIST" },
              ...result.items.map((p: AdminPortfolio) => ({
                type: "AdminPortfolio" as const,
                id: p.id,
              })),
            ]
          : [{ type: "AdminPortfolio" as const, id: "LIST" }],
    }),

    // DELETE /api/v1/admin/portfolios/:id
    deleteAdminPortfolio: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/api/v1/admin/portfolios/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "AdminPortfolio" as const, id: "LIST" },
        { type: "AdminPortfolio" as const, id: arg.id },
      ],
    }),

    // ========= Copilot
    // GET /api/v1/admin/copilot/sessions?q=&page=&limit=
    listAdminCopilotSessions: builder.query<
      { items: AdminCopilotSession[]; total?: number },
      PageQuery | void
    >({
      query: (arg) => ({
        url: `/api/v1/admin/copilot/sessions${toQueryString(arg ?? {})}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<any> | any) =>
        res?.data ?? res ?? { items: [] },
      providesTags: (result) =>
        result?.items
          ? [
              { type: "AdminCopilot" as const, id: "LIST" },
              ...result.items.map((s: AdminCopilotSession) => ({
                type: "AdminCopilot" as const,
                id: s.id,
              })),
            ]
          : [{ type: "AdminCopilot" as const, id: "LIST" }],
    }),

    // POST /api/v1/admin/copilot/sessions/:id/archive
    archiveAdminCopilotSession: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/api/v1/admin/copilot/sessions/${id}/archive`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "AdminCopilot" as const, id: "LIST" },
        { type: "AdminCopilot" as const, id: arg.id },
      ],
    }),

    // ========= Risk
    // GET /api/v1/admin/risk/reports?q=&page=&limit=
    listAdminRiskReports: builder.query<
      { items: AdminRiskReport[]; total?: number },
      PageQuery | void
    >({
      query: (arg) => ({
        url: `/api/v1/admin/risk/reports${toQueryString(arg ?? {})}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<any> | any) =>
        res?.data ?? res ?? { items: [] },
      providesTags: (result) =>
        result?.items
          ? [
              { type: "AdminRisk" as const, id: "LIST" },
              ...result.items.map((r: AdminRiskReport) => ({
                type: "AdminRisk" as const,
                id: r.id,
              })),
            ]
          : [{ type: "AdminRisk" as const, id: "LIST" }],
    }),

    // POST /api/v1/admin/risk/recompute?portfolioId=...
    recomputeAdminRisk: builder.mutation<any, { portfolioId: string }>({
      query: ({ portfolioId }) => ({
        url: `/api/v1/admin/risk/recompute${toQueryString({ portfolioId })}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "AdminRisk" as const, id: "LIST" }],
    }),

    // ========= Settings
    // GET /api/v1/admin/settings
    getAdminSettings: builder.query<Record<string, any>, void>({
      query: () => ({ url: `/api/v1/admin/settings`, method: "GET" }),
      transformResponse: (res: ApiResponse<any> | any) =>
        res?.data ?? res ?? {},
      providesTags: [{ type: "AdminSettings" as const, id: "ROOT" }],
    }),

    // PATCH /api/v1/admin/settings
    updateAdminSettings: builder.mutation<
      Record<string, any>,
      { body: Record<string, any> }
    >({
      query: ({ body }) => ({
        url: `/api/v1/admin/settings`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: ApiResponse<any> | any) =>
        res?.data ?? res ?? {},
      invalidatesTags: [{ type: "AdminSettings" as const, id: "ROOT" }],
    }),
  }),
});

export const {
  useGetAdminOverviewQuery,

  useListAdminUsersQuery,
  useUpdateAdminUserMutation,

  useListAdminPortfoliosQuery,
  useDeleteAdminPortfolioMutation,

  useListAdminCopilotSessionsQuery,
  useArchiveAdminCopilotSessionMutation,

  useListAdminRiskReportsQuery,
  useRecomputeAdminRiskMutation,

  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
} = adminApi;

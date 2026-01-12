import { ApiResponse } from "@/core/domain/types/api-response";
import { baseQueryWithReauth } from "@/store/middlewares/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";

// ===== Models (minimal)
export type Portfolio = {
  id: string;
  name: string;
  baseCurrency: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type PortfolioResponse = {
  items: Portfolio[];
};

export type Holding = {
  id?: string;
  symbol: string;
  quantity: number;
  avgPrice?: number;
};

export type CreatePortfolioDto = {
  name: string;
  baseCurrency: string;
};

export type UpdatePortfolioDto = Partial<CreatePortfolioDto>;

export type UpsertHoldingsDto = { holdings: Holding[] } | Holding[];

// Helper để unwrap ApiResponse hoặc raw
const unwrap = <T>(res: ApiResponse<T> | T): T =>
  (res as any)?.data ?? (res as T);

export const portfolioApi = createApi({
  reducerPath: "portfolioApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Portfolio", "Holding", "Dashboard", "RiskReport"],
  endpoints: (builder) => ({
    // GET /portfolios
    getPortfolios: builder.query<Portfolio[], void>({
      query: () => ({
        url: "/portfolios",
        method: "GET",
      }),
      transformResponse: (
        res: ApiResponse<PortfolioResponse> | PortfolioResponse | Portfolio[]
      ) => {
        // Support 3 formats:
        // 1) ApiResponse<{ items: [] }>
        // 2) { items: [] }
        // 3) raw []  (legacy)
        if (Array.isArray(res)) return res;
        const data = unwrap(res as any) as any; // data = {items:[]}
        return data?.items ?? [];
      },
      providesTags: (result) =>
        result && result.length
          ? [
              { type: "Portfolio" as const, id: "LIST" },
              ...result.map((p) => ({ type: "Portfolio" as const, id: p.id })),
            ]
          : [{ type: "Portfolio" as const, id: "LIST" }],
    }),

    // POST /portfolios
    createPortfolio: builder.mutation<Portfolio, CreatePortfolioDto>({
      query: (body) => ({
        url: "/portfolios",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<Portfolio> | Portfolio) =>
        unwrap(res),
      invalidatesTags: [{ type: "Portfolio" as const, id: "LIST" }],
    }),

    // GET /portfolios/:id
    getPortfolio: builder.query<Portfolio, string>({
      query: (id) => ({
        url: `/portfolios/${id}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<Portfolio> | Portfolio) =>
        unwrap(res),
      providesTags: (_result, _err, id) => [{ type: "Portfolio" as const, id }],
    }),

    // PATCH /portfolios/:id
    updatePortfolio: builder.mutation<
      Portfolio,
      { id: string; body: UpdatePortfolioDto }
    >({
      query: ({ id, body }) => ({
        url: `/portfolios/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: ApiResponse<Portfolio> | Portfolio) =>
        unwrap(res),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Portfolio" as const, id: arg.id },
        { type: "Portfolio" as const, id: "LIST" },
      ],
    }),

    // DELETE /portfolios/:id
    deletePortfolio: builder.mutation<ApiResponse<unknown> | unknown, string>({
      query: (id) => ({
        url: `/portfolios/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Portfolio" as const, id },
        { type: "Portfolio" as const, id: "LIST" },
      ],
    }),

    // GET /portfolios/:id/holdings
    getHoldings: builder.query<Holding[], string>({
      query: (portfolioId) => ({
        url: `/portfolios/${portfolioId}/holdings`,
        method: "GET",
      }),
      transformResponse: (
        res: ApiResponse<{ items?: Holding[]; holdings?: Holding[] }> | any
      ) => {
        // Support:
        // - ApiResponse<{items:[]}> / ApiResponse<{holdings:[]}>
        // - {items:[]} / {holdings:[]}
        // - raw []
        if (Array.isArray(res)) return res;

        const data = unwrap(res as any) as any;
        return (
          data?.items ?? data?.holdings ?? res?.items ?? res?.holdings ?? []
        );
      },
      providesTags: (result, _err, portfolioId) =>
        result && result.length
          ? [
              { type: "Holding" as const, id: `LIST:${portfolioId}` },
              ...result.map((h, idx) => ({
                type: "Holding" as const,
                id: h.id ?? `${portfolioId}:${h.symbol}:${idx}`,
              })),
            ]
          : [{ type: "Holding" as const, id: `LIST:${portfolioId}` }],
    }),

    // PUT /portfolios/:id/holdings
    upsertHoldings: builder.mutation<
      any,
      { portfolioId: string; body: UpsertHoldingsDto }
    >({
      query: ({ portfolioId, body }) => ({
        url: `/portfolios/${portfolioId}/holdings`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Holding" as const, id: `LIST:${arg.portfolioId}` },
        { type: "Dashboard" as const, id: arg.portfolioId },
        { type: "RiskReport" as const, id: arg.portfolioId },
      ],
    }),

    // DELETE /portfolios/:id/holdings/:holdingId
    deleteHolding: builder.mutation<
      any,
      { portfolioId: string; holdingId: string }
    >({
      query: ({ portfolioId, holdingId }) => ({
        url: `/portfolios/${portfolioId}/holdings/${holdingId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Holding" as const, id: `LIST:${arg.portfolioId}` },
        { type: "Dashboard" as const, id: arg.portfolioId },
        { type: "RiskReport" as const, id: arg.portfolioId },
      ],
    }),

    // GET /portfolios/:id/dashboard
    getDashboard: builder.query<any, string>({
      query: (portfolioId) => ({
        url: `/portfolios/${portfolioId}/dashboard`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<any> | any) => unwrap(res),
      providesTags: (_result, _err, portfolioId) => [
        { type: "Dashboard" as const, id: portfolioId },
      ],
    }),
  }),
});

export const {
  useGetPortfoliosQuery,
  useCreatePortfolioMutation,
  useGetPortfolioQuery,
  useUpdatePortfolioMutation,
  useDeletePortfolioMutation,
  useGetHoldingsQuery,
  useUpsertHoldingsMutation,
  useDeleteHoldingMutation,
  useGetDashboardQuery,
} = portfolioApi;

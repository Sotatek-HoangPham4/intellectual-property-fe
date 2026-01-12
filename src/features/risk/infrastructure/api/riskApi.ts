import { apiSlice } from "@/store/api/apiSlice";
import { ApiResponse } from "@/core/domain/types/api-response";

export const riskApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET latest
    getLatestRiskReport: builder.query<any, string>({
      query: (portfolioId) => ({
        url: `/portfolios/${portfolioId}/risk-reports/latest`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<any> | any) =>
        (res as any).data ?? res,
      providesTags: (_r, _e, portfolioId) => [
        { type: "RiskReport" as const, id: portfolioId },
      ],
    }),

    // POST generate
    generateRiskReport: builder.mutation<any, string>({
      query: (portfolioId) => ({
        url: `/portfolios/${portfolioId}/risk-reports:generate`,
        method: "POST",
      }),
      transformResponse: (res: ApiResponse<any> | any) =>
        (res as any).data ?? res,
      invalidatesTags: (_r, _e, portfolioId) => [
        { type: "RiskReport" as const, id: portfolioId },
      ],
    }),
  }),
});

export const {
  useGetLatestRiskReportQuery,
  useLazyGetLatestRiskReportQuery,
  useGenerateRiskReportMutation,
} = riskApi;

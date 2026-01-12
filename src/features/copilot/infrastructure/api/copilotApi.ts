import { apiSlice } from "@/store/api/apiSlice";
import { ApiResponse } from "@/core/domain/types/api-response";

export type CopilotSession = {
  id: string;
  title?: string;
  createdAt?: string;
  archivedAt?: string | null;
};

export type CopilotMessage = {
  id: string;
  role: string; // "user" | "assistant"
  content: string;
  createdAt?: string;
};

export type CreateSessionDto = {
  portfolioId?: string;
  title?: string;
};

export type SendMessageDto = {
  content: string;
  portfolioId?: string;
};

export type CopilotRun = {
  id: string;
  status: "queued" | "running" | "succeeded" | "failed" | string;
  error?: any;
};

export const copilotApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Sessions
    listSessions: builder.query<CopilotSession[], void>({
      query: () => ({ url: `/api/v1/copilot/sessions`, method: "GET" }),
      transformResponse: (res: ApiResponse<CopilotSession[]> | any) => {
        if (Array.isArray(res)) return res;
        return res?.data ?? [];
      },
      providesTags: (result) =>
        result
          ? [
              { type: "CopilotSession" as const, id: "LIST" },
              ...result.map((s) => ({
                type: "CopilotSession" as const,
                id: s.id,
              })),
            ]
          : [{ type: "CopilotSession" as const, id: "LIST" }],
    }),

    createSession: builder.mutation<CopilotSession, CreateSessionDto>({
      query: (body) => ({
        url: `/api/v1/copilot/sessions`,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<CopilotSession> | any) =>
        res?.data ?? res,
      invalidatesTags: [{ type: "CopilotSession" as const, id: "LIST" }],
    }),

    getSession: builder.query<CopilotSession, string>({
      query: (sessionId) => ({
        url: `/api/v1/copilot/sessions/${sessionId}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<CopilotSession> | any) =>
        res?.data ?? res,
      providesTags: (_r, _e, id) => [{ type: "CopilotSession" as const, id }],
    }),

    archiveSession: builder.mutation<any, string>({
      query: (sessionId) => ({
        url: `/api/v1/copilot/sessions/${sessionId}/archive`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "CopilotSession" as const, id: "LIST" },
        { type: "CopilotSession" as const, id },
      ],
    }),

    // Messages
    listMessages: builder.query<CopilotMessage[], string>({
      query: (sessionId) => ({
        url: `/api/v1/copilot/sessions/${sessionId}/messages`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<CopilotMessage[]> | any) => {
        if (Array.isArray(res)) return res;
        return res?.data ?? [];
      },
      providesTags: (_r, _e, sessionId) => [
        { type: "CopilotMessage" as const, id: `LIST:${sessionId}` },
      ],
    }),

    sendMessage: builder.mutation<
      { runId?: string; message?: CopilotMessage } | any,
      { sessionId: string; body: SendMessageDto }
    >({
      query: ({ sessionId, body }) => ({
        url: `/api/v1/copilot/sessions/${sessionId}/messages`,
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<any> | any) =>
        (res as any).data ?? res,
      invalidatesTags: (_r, _e, arg) => [
        { type: "CopilotMessage" as const, id: `LIST:${arg.sessionId}` },
      ],
    }),

    // Runs
    getRun: builder.query<CopilotRun, string>({
      query: (runId) => ({
        url: `/api/v1/copilot/runs/${runId}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<CopilotRun> | any) =>
        (res as any).data ?? res,
      providesTags: (_r, _e, runId) => [
        { type: "CopilotRun" as const, id: runId },
      ],
    }),
  }),
});

export const {
  useListSessionsQuery,
  useCreateSessionMutation,
  useGetSessionQuery,
  useArchiveSessionMutation,

  useListMessagesQuery,
  useSendMessageMutation,

  useGetRunQuery,
  useLazyGetRunQuery,
} = copilotApi;

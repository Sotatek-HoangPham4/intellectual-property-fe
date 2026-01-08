import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/store/middlewares/baseQueryWithReauth";
import { Descendant } from "slate";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001/api/v1";

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface UpdateDocumentPayload {
  id: string;
  title?: string;
  content?: Descendant[];
}

export interface DocumentResponse {
  id: string;
  title: string;
  status: string;
}

export const documentApi = createApi({
  reducerPath: "documentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Document"],
  endpoints: (builder) => ({
    // CREATE
    createDocument: builder.mutation<ApiResponse<DocumentResponse>, void>({
      query: () => ({
        url: "/documents",
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Document"],
    }),

    getMyDocuments: builder.query<DocumentResponse[], void>({
      query: () => "/documents",
      transformResponse: (res: ApiResponse<DocumentResponse[]>) => res.data,
      providesTags: ["Document"],
    }),

    getDocumentById: builder.query<DocumentResponse, string>({
      query: (id) => `/documents/${id}`,
      transformResponse: (res: ApiResponse<DocumentResponse>) => res.data,
      providesTags: (_r, _e, id) => [{ type: "Document", id }],
    }),

    updateDocument: builder.mutation<
      ApiResponse<DocumentResponse>,
      UpdateDocumentPayload
    >({
      query: ({ id, ...body }) => ({
        url: `/documents/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Document", id }],
    }),
  }),
});

export const {
  useCreateDocumentMutation,
  useGetMyDocumentsQuery,
  useGetDocumentByIdQuery,
  useUpdateDocumentMutation,
} = documentApi;

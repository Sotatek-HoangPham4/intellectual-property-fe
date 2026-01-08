import { apiSlice } from "@/store/api/apiSlice";
import { ApiResponse } from "@/core/domain/types/api-response";

// ===== DTOs
export type CreateUserSignatureDto = {
  signatureImageBase64: string; // "data:image/png;base64,..."
  type: string;
  // nếu bạn có thêm typing signature fields thì add vào đây
};

// ===== Models (tuỳ BE trả về)
export type UserSignature = {
  id: string;
  userId: string;
  type: string;

  // tuỳ bạn lưu kiểu gì:
  signatureImageBase64?: string; // nếu lưu thẳng base64/dataUrl
  imageUrl?: string; // nếu lưu file và trả url

  createdAt?: string;
  updatedAt?: string | null;
};

export const signatureApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET /signature/profile  (khuyến nghị BE đọc CurrentUser, không cần query)
    getMySignature: builder.query<UserSignature | null, void>({
      query: () => ({
        url: "/signature/profile",
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<UserSignature | null>) =>
        res.data ?? null,
      providesTags: (result) =>
        result
          ? [
              { type: "Signature" as const, id: "ME" },
              { type: "Signature" as const, id: result.id },
            ]
          : [{ type: "Signature" as const, id: "ME" }],
    }),

    // ✅ POST /signature/profile
    createSignature: builder.mutation<UserSignature, CreateUserSignatureDto>({
      query: (body) => ({
        url: "/signature/profile",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<UserSignature>) => res.data,
      invalidatesTags: [{ type: "Signature" as const, id: "ME" }],
    }),

    // ✅ POST /signature/profile/recreate
    recreateSignature: builder.mutation<UserSignature, CreateUserSignatureDto>({
      query: (body) => ({
        url: "/signature/profile/recreate",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<UserSignature>) => res.data,
      invalidatesTags: [{ type: "Signature" as const, id: "ME" }],
    }),

    // ✅ DELETE /signature/profile
    deleteSignature: builder.mutation<ApiResponse<unknown>, void>({
      query: () => ({
        url: "/signature/profile",
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Signature" as const, id: "ME" }],
    }),
  }),
});

export const {
  useGetMySignatureQuery,
  useLazyGetMySignatureQuery,
  useCreateSignatureMutation,
  useRecreateSignatureMutation,
  useDeleteSignatureMutation,
} = signatureApi;

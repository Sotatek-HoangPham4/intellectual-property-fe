"use client";

import { useRouter } from "next/navigation";
import { useCreateDocumentMutation } from "@/features/document/infrastructure/api/documentApi";
import toast from "react-hot-toast";

export const useCreateDocument = () => {
  const router = useRouter();
  const [createDocument, { isLoading }] = useCreateDocumentMutation();

  const create = async () => {
    try {
      const res = await createDocument().unwrap();

      const documentId = res.data.id;

      toast.success("Document created");

      router.push(`/document/${documentId}`);
    } catch (error: any) {
      toast.error(error?.message || "Create document failed");
    }
  };

  return {
    createDocument: create,
    isLoading,
  };
};

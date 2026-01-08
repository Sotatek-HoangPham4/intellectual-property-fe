import { useGetMyDocumentsQuery } from "../../infrastructure/api/documentApi";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export const useMyDocuments = () => {
  const { data = [], isLoading, error } = useGetMyDocumentsQuery();
  const userId = useSelector((s: RootState) => s.auth.user?.id);
  console.log(
    "auth user:",
    useSelector((s: RootState) => s.auth.user)
  );

  console.log("userId :", userId);

  const owned = data.filter((d) => d.ownerId === userId);
  const shared = data.filter((d) => d.ownerId !== userId);

  const recent = [...data].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return {
    documents: data,
    owned,
    shared,
    recent,
    isLoading,
    error,
  };
};

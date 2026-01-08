import { DocumentResponse } from "../../infrastructure/types/document.response";
import { Document } from "../../domain/models/document";

export const mapDocumentResponseToDomain = (
  res: DocumentResponse,
  currentUserId: string
): Document => ({
  id: res.id,
  title: res.metadata?.title ?? "Untitled document",
  ownerId: res.ownerId,
  status: res.status,
  createdAt: new Date(res.createdAt),
  updatedAt: new Date(res.updatedAt),
  isOwnedByMe: res.ownerId === currentUserId,
});

// features/document/infrastructure/types/document.response.ts
export interface DocumentResponse {
  id: string;
  ownerId: string;
  content: any[];
  metadata: {
    title?: string;
    tags?: string[];
    department?: string;
    project_code?: string;
    document_type?: string;
    sensitive_level?: string;
  };
  status: "draft" | "published" | "archived";
  versions: any[];
  collaborators: {
    user_id: string;
    role: string;
    added_at: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

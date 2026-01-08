export type Organization = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  ownerId: string;
  is_active: boolean;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  owner?: {
    id: string;
    email: string;
    fullname: string;
    avatar_url: string | null;
  };
};

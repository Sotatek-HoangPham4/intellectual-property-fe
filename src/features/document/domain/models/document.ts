export interface Document {
  id: string;
  title: string;
  ownerId: string;
  status: string;
  updatedAt: Date;
  createdAt: Date;
  isOwnedByMe: boolean;
}

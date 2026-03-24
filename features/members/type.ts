import { Models } from "node-appwrite";

// @\features\members\type.ts
export enum MemberRole{
  ADMIN = "ADMIN",
  MEMBER = "MEMBER"
};

export type Member = Models.Document & {
  name: string;
  email: string;
  workspaceId: string;
  userId: string;
  role: MemberRole
}
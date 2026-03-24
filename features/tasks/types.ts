import { Models } from "node-appwrite";

// @\features\tasks\types.ts
export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export type Task = Models.Document & {
  name: string;
  status: TaskStatus,
  assigneeId: string;
  projectId: string;
  description?: string;
  position: number;
  workspaceId: string;
  dueDate: string;
  project?: { name: string, imageUrl: string }
  assignee?: { name: string }
}
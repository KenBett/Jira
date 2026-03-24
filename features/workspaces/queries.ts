// @\features\auth\actions.ts
"use server";

import { Query } from "node-appwrite";
import { DATABASE_ID } from "@/app/config";
import { getMember } from "../members/utils";
import { Workspace } from "./types";
import { CreateSessionClient } from "@/lib/appwrite";

export const getWorkspaces = async () => {
  const { databases, account } = await CreateSessionClient();
  const user = await account.get();

  const members = await databases.listDocuments(DATABASE_ID, "members", [
    Query.equal("userId", user.$id),
  ]);

  if (members.total === 0) {
    return { documents: [], total: 0 };
  }

  const workspaceIds = members.documents.map((member) => member.workspaceId);

  const workspaces = await databases.listDocuments(DATABASE_ID, "workspaces", [
    Query.orderDesc("$createdAt"),
    Query.contains("$id", workspaceIds),
  ]);
  return workspaces;
};

interface GetWorkspaceProps {
  workspaceId: string;
}

export const getWorkspace = async ({ workspaceId }: GetWorkspaceProps) => {
  const { account, databases } = await CreateSessionClient();
  const user = await account.get();
  const member = await getMember({
    databases,
    userId: user.$id,
    workspaceId,
  });

  if (!member) {
    throw new Error('Unauthorized')
  }
  
  const workspace = await databases.getDocument<Workspace>(
    DATABASE_ID,
    "workspaces",
    workspaceId,
  );
  return JSON.parse(JSON.stringify(workspace));
};

interface GetWorkspaceInfoProps {
  workspaceId: string;
}
export const getWorkspaceInfo = async ({
  workspaceId,
}: GetWorkspaceInfoProps) => {
  const { databases } = await CreateSessionClient();
  const workspace = await databases.getDocument<Workspace>(
    DATABASE_ID,
    "workspaces",
    workspaceId,
  );
  return JSON.parse(JSON.stringify(workspace.name));
};

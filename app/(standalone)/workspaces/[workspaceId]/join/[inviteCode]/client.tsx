"use client";

import PageError from "@/components/pageError";
import PageLoader from "@/components/pageLoader";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/useGetWorkspaceInfo";
import JoinWorkspaceForm from "@/features/workspaces/components/joinWorkspaceForm";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";

export const WorkspaceIdJoinClient = () => {
  const workspaceId = useWorkspaceId();
  const { data: initialValues, isLoading } = useGetWorkspaceInfo({ workspaceId });

  if (isLoading) {
    return <PageLoader />
  }

  if (!initialValues) {
    return <PageError message="Workspace info not found" />
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm name={initialValues.name} />
    </div>
  )
}
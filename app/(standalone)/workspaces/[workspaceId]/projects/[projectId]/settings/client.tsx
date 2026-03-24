// @\app\(standalone)\workspaces\[workspaceId]\projects\[projectId]\settings\client.tsx
"use client";

import PageError from "@/components/pageError";
import PageLoader from "@/components/pageLoader";
import { useGetProject } from "@/features/projects/api/useGetProject";
import EditProjectForm from "@/features/projects/components/editProjectForm";
import { useProjectId } from "@/features/projects/hooks/useProjectId";

const ProjectIdSettingsClient = () => {
  const projectId = useProjectId();
  const { data: initialValues, isLoading } = useGetProject({ projectId })

  if (isLoading) {
    return <PageLoader />
  }

  if (!initialValues) {
    return <PageError message="Project not found" />
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValues={initialValues} />
    </div>
  );
}
export default ProjectIdSettingsClient
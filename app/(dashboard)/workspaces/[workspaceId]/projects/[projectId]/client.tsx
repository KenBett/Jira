// @\app\(dashboard)\workspaces\[workspaceId]\projects\[projectId]\client.tsx
"use client";
import Analytics from "@/components/analytics";
import PageError from "@/components/pageError";
import PageLoader from "@/components/pageLoader";
import { Button } from "@/components/ui/button";
import { useGetProject } from "@/features/projects/api/useGetProject";
import { useGetProjectAnalytics } from "@/features/projects/api/useGetProjectAnalytics";
import ProjectAvatar from "@/features/projects/components/projectAvatar";
import { useProjectId } from "@/features/projects/hooks/useProjectId";
import TaskViewSwitcher from "@/features/tasks/components/taskViewSwitcher";
import { PencilIcon } from "lucide-react";
import Link from "next/link";

const ProjectIdClient = () => {
  const projectId = useProjectId();
  const { data: project, isLoading: isLoadingProject } = useGetProject({
    projectId,
  });
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetProjectAnalytics({ projectId });

  const isLoading = isLoadingProject || isLoadingAnalytics;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!project) {
    return <PageError message="Project not found" />;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            classname="size-8"
          />
          <p className="text-lg font-semibold tracking-widest">
            {project.name}
          </p>
        </div>
        <div className="">
          <Button variant={"secondary"} size={"sm"} asChild>
            <Link
              href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}
            >
              <PencilIcon className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      {analytics ? <Analytics data={analytics} /> : null}
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};
export default ProjectIdClient;

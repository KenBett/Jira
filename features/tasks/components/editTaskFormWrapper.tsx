// @\features\tasks\components\editTaskFormWrapper.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/useGetMembers";
import { useGetProjects } from "@/features/projects/api/useGetProjects";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { LoaderPinwheel } from "lucide-react";
import { useGetTask } from "../api/useGetTask";
import EditTaskForm from "./editTaskForm";

interface EditTaskFormWrapperProps {
  onCancel: () => void;
  id: string;
}
const EditTaskFormWrapper: React.FC<EditTaskFormWrapperProps> = ({
  onCancel,
  id,
}) => {
  const workspaceId = useWorkspaceId();

  const { data: initialValues, isLoading: isLoadingTask } = useGetTask({
    taskId: id,
  })

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const projectOptions = projects?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));

  const memberOptions = members?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
  }));

  const isLoading = isLoadingProjects || isLoadingMembers || isLoadingTask;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <LoaderPinwheel className="size-8 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    );
  }

  if (!initialValues) {
    return null
  }
  return (
    <div>
      <EditTaskForm
        onCancel={onCancel}
        projectOptions={projectOptions ?? []}
        memberOptions={memberOptions ?? []}
        initialValues={initialValues}
      />
    </div>
  );
};
export default EditTaskFormWrapper;

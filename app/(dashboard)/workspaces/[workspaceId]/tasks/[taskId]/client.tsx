// @\app\(dashboard)\workspaces\[workspaceId]\tasks\[taskId]\client.tsx
"use client";

import DottedSeparator from "@/components/dottedSeparator";
import PageError from "@/components/pageError";
import PageLoader from "@/components/pageLoader";
import { useGetTask } from "@/features/tasks/api/useGetTask";
import TaskBreadCrumbs from "@/features/tasks/components/taskBreadCrumbs";
import TaskDescription from "@/features/tasks/components/taskDescription";
import TaskOverview from "@/features/tasks/components/taskOverview";
import { useTaskId } from "@/features/tasks/hooks/useTaskId";

const TaskIdClient = () => {
  const taskId = useTaskId();
  const { data, isLoading } = useGetTask({ taskId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return <PageError message="Task not found" />;
  }

  return (
    <div className="flex flex-col">
      <TaskBreadCrumbs project={data.project} task={data} />
      <DottedSeparator className="my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={data} />
        <TaskDescription task={data} />
      </div>
    </div>
  );
};
export default TaskIdClient;
// @\features\tasks\components\eventCard.tsx
"use client";

import MembersAvatar from "@/features/members/components/membersAvatar";
import { Task, TaskStatus } from "../types";
import { cn } from "@/lib/utils";
import ProjectAvatar from "@/features/projects/components/projectAvatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { useRouter } from "next/navigation";
import DottedSeparator from "@/components/dottedSeparator";

interface EventCardProps {
  title: string;
  assignee: any;
  project: Task["project"];
  status: TaskStatus;
  id: string;
}

const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: "border-l-pink-500 border-r-pink-500",
  [TaskStatus.TODO]: "border-l-red-500 border-r-red-500",
  [TaskStatus.IN_PROGRESS]: "border-l-yellow-500 border-r-yellow-500",
  [TaskStatus.IN_REVIEW]: "border-l-blue-500 border-r-blue-500",
  [TaskStatus.DONE]: "border-l-emerald-500 border-r-emerald-500",
};
const EventCard: React.FC<EventCardProps> = ({
  title,
  assignee,
  project,
  status,
  id,
}) => {
  const assigneeName = assignee?.name ?? "Member";
  const projectName = project?.name ?? "Project";

  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  return (
    <div className="px-1 sm:px-2">
      <div
        onClick={onClick}
        className={cn(
          "p-1.5 text-xs bg-white text-primary border border-l-6 border-r-2 rounded-md flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition min-w-0",
          statusColorMap[status],
        )}
      >
        <p className="line-clamp-1 whitespace-normal">{title}</p>
        <DottedSeparator />
        <div className="flex flex-wrap items-center gap-x-1 gap-y-1 justify-start sm:justify-between px-2 md:px-6 py-2">
          <MembersAvatar name={assigneeName} />
          <div className="size-1 rounded-full bg-neutral-300" />
          <ProjectAvatar name={projectName} image={project?.imageUrl} />
        </div>
      </div>
    </div>
  );
};
export default EventCard;

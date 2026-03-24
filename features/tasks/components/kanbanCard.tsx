// @\features\tasks\components\kanbanCard.tsx
"use client";

import { MoreHorizontal } from "lucide-react";
import { Task } from "../types";
import TaskActions from "./taskActions";
import DottedSeparator from "@/components/dottedSeparator";
import MembersAvatar from "@/features/members/components/membersAvatar";
import TaskDate from "./taskDate";
import ProjectAvatar from "@/features/projects/components/projectAvatar";

interface KanbanCardProps {
  task: Task;
}
const KanbanCard: React.FC<KanbanCardProps> = ({ task }) => {
  return (
    <div className="bg-white p-2.5 mb-1.5 rounded shadow-md space-y-3">
      <div className="flex items-center justify-between gap-x-2">
        <p className="text-sm line-clamp-2">{task.name}</p>
        <TaskActions id={task.$id} projectId={task.projectId}>
          <MoreHorizontal className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
        </TaskActions>
      </div>
      <DottedSeparator />
      <div className="flex items-center gap-x-1.5">
        <MembersAvatar
          name={task.assignee?.name ?? "Unknown"}
          fallbackClassname="text-[10px]"
        />
        <div className="sjize-1 rounded-full bg-neutral-300" />
        <TaskDate value={task.dueDate} className="text-xs" />
      </div>
      <DottedSeparator />
      <div className="flex items-center gap-x-1.5">
        <ProjectAvatar
          name={task.project?.name ?? "Unknown"}
          image={task.project?.imageUrl}
          fallBackClassname="text-[10px]"
        />
        <span className="text-xs text-neutral-600 font-medium">
          {task.project?.name}
        </span>
      </div>
    </div>
  );
};
export default KanbanCard;

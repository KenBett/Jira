// @\features\tasks\components\taskOverview.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Task } from "../types";
import { PencilIcon } from "lucide-react";
import DottedSeparator from "@/components/dottedSeparator";
import OverviewProperty from "./overviewProperty";
import MembersAvatar from "@/features/members/components/membersAvatar";
import TaskDate from "./taskDate";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { useEditTaskModal } from "../hooks/useEditTaskModal";

interface TaskOverviewProps {
  task: Task;
};
const TaskOverview: React.FC<TaskOverviewProps> = ({  task }) => {
  const { open } = useEditTaskModal();
  const assigneeName = task.assignee?.name ?? "Unassigned";
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Overview</p>
        <Button onClick={() => open(task.$id)} size={'sm'} variant={'secondary'}>
          <PencilIcon className="size-4 mr-2" />
          Edit
        </Button>
        </div>
        <DottedSeparator className="my-4" />
        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Assignee">
            <MembersAvatar
              name={assigneeName}
              classname="size-6"
             />
            <p className="text-sm font-medium">{assigneeName}</p>
          </OverviewProperty>
          <DottedSeparator />
          <OverviewProperty label="Due Date">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>
          <DottedSeparator />
          <OverviewProperty label="Status">
            <Badge variant={task.status}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
}
export default TaskOverview
// @\features\tasks\components\taskActions.tsx
"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLink, PencilIcon, Trash } from "lucide-react";
import { useDeleteTask } from "../api/useDeleteTask";
import UseConfirm from "@/hook/useConfirm";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { useEditTaskModal } from "../hooks/useEditTaskModal";
interface TaskActionsProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
}
const TaskActions: React.FC<TaskActionsProps> = ({
  id,
  projectId,
  children,
}) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { open } = useEditTaskModal()

  const [ConfirmDialog, confirm] = UseConfirm(
    "Delete task",
    "This action cannot be undone",
    "destructive"
  )
  const { mutate, isPending } = useDeleteTask();

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) {
      return;
    }
    mutate({ param: { taskId: id } })
  }
  
  const onOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`)
  }

  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`)
  }

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="end">
          <DropdownMenuItem
            onClick={onOpenTask}
            className="font-medium p-[10px]"
          >
            <ExternalLink className="size-4 mr-2 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => open(id)}
            className="font-medium p-[10px]"
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onOpenProject}
            className="font-medium p-[10px]"
          >
            <ExternalLink className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isPending}
            className="text-red-500 focus:text-red-700 font-medium p-[10px]"
          >
            <Trash className="text-red-500 size-4 mr-2 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default TaskActions;

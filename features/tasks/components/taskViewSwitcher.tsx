// @\features\tasks\components\taskViewSwitcher.tsx
"use client";

import DottedSeparator from "@/components/dottedSeparator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoaderPinwheel, PlusIcon } from "lucide-react";
import { useCreateTaskModal } from "../hooks/useCreateTaskModal";
import { useGetTasks } from "../api/useGetTasks";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { useQueryState } from "nuqs";
import DataFilter from "./dataFilter";
import { useTaskFilter } from "../hooks/useTaskFilter";
import { DataTable } from "./dataTable";
import { columns } from "./columns";
import DataKanban from "./dataKanban";
import { useCallback } from "react";
import { TaskStatus } from "../types";
import { useBulkUpdateTasks } from "../api/useBulkUpdateTask";
import DataCalendar from "./dataCalendar";
import { useProjectId } from "@/features/projects/hooks/useProjectId";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}


const TaskViewSwitcher = ({ hideProjectFilter }: TaskViewSwitcherProps) => {
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });
  const [{ status, assigneeId, projectId, dueDate }] = useTaskFilter();
  const workspaceId = useWorkspaceId();
  const paramProjectId = useProjectId();
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    projectId: paramProjectId || projectId,
    assigneeId,
    status,
    dueDate,
  });
  const { open } = useCreateTaskModal();

  const { mutate: bulkUpdate } = useBulkUpdateTasks()

  const onKanbanChange = useCallback((
    tasks: { $id: string; status: TaskStatus; position: number }[]
  ) => {
    bulkUpdate({
      json: { tasks },
    })
  }, [bulkUpdate])
  return (
    <Tabs
      className="flex-1 w-full border rounded-lg"
      defaultValue={view}
      onValueChange={setView}
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button className="w-full lg:w-auto" size={"sm"} onClick={open}>
            <PlusIcon className="size-4 mr-2" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
         <DataFilter hideProjectFilter={hideProjectFilter}/>
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <LoaderPinwheel className="text-blue-500 size-7 animate-spin" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban onChange={onKanbanChange} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="calendar" className="mt-0 h-full pb-4">
              <DataCalendar data={tasks?.documents ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
export default TaskViewSwitcher;

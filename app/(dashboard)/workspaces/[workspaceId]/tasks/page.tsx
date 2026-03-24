// @\app\(dashboard)\workspaces\[workspaceId]\tasks\page.tsx
import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import TaskViewSwitcher from "@/features/tasks/components/taskViewSwitcher";
export default async function TasksPage(){
  const user = await getCurrent();
  if (!user) redirect('/sign-in');
  return(
    <div className="h-full flex flex-col">
      <TaskViewSwitcher />
    </div>
  )
}
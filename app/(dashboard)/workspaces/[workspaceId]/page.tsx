// @\app\(dashboard)\workspaces\[workspaceId]\page.tsx
import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { WorkspaceIdClient } from "./client";

export default async function WorkspacePage() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return (
    <WorkspaceIdClient />
  )
}

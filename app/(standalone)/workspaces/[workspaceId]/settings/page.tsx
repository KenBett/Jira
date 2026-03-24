// @\app\(standalone)\workspaces\[workspaceId]\settings\page.tsx
import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { WorkspaceIdSettingsClient } from "./client";


export default async function WorkspaceIdSettingsPage() {

  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return (
    <WorkspaceIdSettingsClient />
  );
}

// @\app\(dashboard)\workspaces\[workspaceId]\projects\[projectId]\page.tsx
import { getCurrent } from "@/features/auth/queries"
import { redirect } from "next/navigation";
import ProjectIdClient from "./client";


export default async function ProjectIdPage(){
  const user = await getCurrent();
  if (!user) redirect('/sign-in');



  return(
    <ProjectIdClient />
  )
}
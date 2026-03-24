// @\app\(standalone)\workspaces\[workspaceId]\member\page.tsx
import { getCurrent } from "@/features/auth/queries";
import { MembersList } from "@/features/workspaces/components/membersList";
import { redirect } from "next/navigation";

export default async function WorkspaceIdMembersPage() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return (
    <div className="w-full lg:max-w-xl">
      <MembersList />
    </div>
  );
}

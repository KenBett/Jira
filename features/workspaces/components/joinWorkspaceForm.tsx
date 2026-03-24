// @\features\workspaces\components\joinWorkspaceForm.tsx
"use client";
import DottedSeparator from "@/components/dottedSeparator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useJoinWorkspace } from "../api/useJoinWorkspace";
import { useInviteCode } from "../hooks/useInviteCode";
import { useWorkspaceId } from "../hooks/useWorkspaceId";
import { useRouter } from "next/navigation";

interface JoinWorkspaceFormProps {
  name: string;
}

const JoinWorkspaceForm = ({ name }: JoinWorkspaceFormProps) => {
  const { mutate, isPending } = useJoinWorkspace();
  const inviteCode = useInviteCode();
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const onSubmit = () => {
    mutate(
      {
        param: { workspaceId },
        json: { code: inviteCode },
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`);
        },
      },
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none p-7">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
        <CardDescription>
          You've been invited to join <strong>{name}</strong> workspace
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col lg:flex-row items-center gap-2 justify-between">
          <Button
            variant={"secondary"}
            className="w-full lg:w-fit"
            type="button"
            size={"lg"}
            asChild
          >
            <Link href={"/"}>Cancel</Link>
          </Button>
          <Button
            className="w-full lg:w-fit"
            size={"lg"}
            type="button"
            onClick={onSubmit}
            disabled={isPending}
          >
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default JoinWorkspaceForm;

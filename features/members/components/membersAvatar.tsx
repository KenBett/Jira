// @\features\workspaces\components\workspaceAvatar.tsx
"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MembersAvatarProps {
  name: string;
  classname?: string;
  fallbackClassname?: string;
}

const MembersAvatar: React.FC<MembersAvatarProps> = ({
  name,
  classname,
  fallbackClassname,
}) => {
  return (
    <Avatar
      className={cn(
        "size-5 transition border border-neutral-300 rounded-full",
        classname,
      )}
    >
      <AvatarFallback className={cn(
        "bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center",
        fallbackClassname
      )}>
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
export default MembersAvatar;

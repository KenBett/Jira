// @\features\workspaces\components\workspaceAvatar.tsx
"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
interface WorkspaceAvatarProps {
  image?: string;
  name: string;
  classname?: string;
}
const WorkspaceAvatar: React.FC<WorkspaceAvatarProps> = ({
  image,
  name,
  classname,
}) => {
  if (image) {
    return (
      <div
        className={cn("size-10 relative rounded-md overflow-hidden", classname)}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  }
  return (
    <Avatar className={cn("size-10 rounded-md", classname)}>
      <AvatarFallback className="text-white bg-blue-600 font-semibold text-lg uppercase rounded-md">
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
};
export default WorkspaceAvatar;

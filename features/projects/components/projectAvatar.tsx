// @\features\workspaces\components\workspaceAvatar.tsx
"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
interface ProjectAvatarProps {
  image?: string;
  name: string;
  classname?: string;
  fallBackClassname?: string;
}
const ProjectAvatar: React.FC<ProjectAvatarProps> = ({
  image,
  name,
  classname,
  fallBackClassname,
}) => {
  if (image) {
    return (
      <div
        className={cn("size-5 relative rounded-md overflow-hidden", classname)}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  }
  return (
    <Avatar className={cn("size-5 rounded-md", classname)}>
      <AvatarFallback
        className={cn(
          "text-white bg-blue-600 font-semibold text-sm uppercase rounded-md",
           fallBackClassname 
        )}
      >
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
};
export default ProjectAvatar;

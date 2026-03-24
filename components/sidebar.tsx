// @\components\sidebar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import DottedSeparator from "./dottedSeparator";
import Navigation from "./navigation";
import WorkspaceSwitcher from "./workspaceSwitcher";
import Projects from "./projects";

const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link href={"/"}>
        <Image className="mx-auto" src={"/logo.svg"} alt="logo" width={48} height={48} />
      </Link>
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
      <Projects />
    </aside>
  );
};
export default Sidebar;

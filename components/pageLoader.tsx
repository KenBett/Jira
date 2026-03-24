// @\components\pageLoader.tsx
"use client";
import { LoaderPinwheel } from "lucide-react";
const PageLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoaderPinwheel className="size-6 animate-spin text-blue-500" />
    </div>
  );
}
export default PageLoader
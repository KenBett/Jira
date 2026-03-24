// @\components\pageError.tsx
"use client";
import { AlertTriangle } from "lucide-react";

interface PageErrorProps {
  message: string;
}
const PageError: React.FC<PageErrorProps> = ({
  message = "Something went wrong",
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <AlertTriangle className="size-10 text-red-500 mb-2" />
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
};
export default PageError;

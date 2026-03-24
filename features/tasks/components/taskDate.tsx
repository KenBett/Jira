// @\features\tasks\components\taskDate.tsx
"use client";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
interface TaskDateProps {
  value: string;
  className?: string;
}
const TaskDate: React.FC<TaskDateProps> = ({ value, className }) => {
  const today = new Date();
  const endDate = new Date(value);
  const diffDays = differenceInDays(endDate, today);

  let textColor = "text-green-500";

  if (diffDays <= 3) {
    textColor = "text-red-500";
  } else if (diffDays <= 7) {
    textColor = "text-orange-500";
  } else if (diffDays <= 14) {
    textColor = "text-green-500";
  }
  return (
    <div className={textColor}>
      <span className={cn("truncate", className)}>{format(value, "PPP")}</span>
    </div>
  );
};
export default TaskDate;

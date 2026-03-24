// @\features\tasks\hooks\useTaskFilter.ts
import { parseAsString, parseAsStringEnum, parseAsTimestamp, useQueryStates } from "nuqs";
import { TaskStatus } from "../types";

export const useTaskFilter = () => {
  return useQueryStates({
    projectId: parseAsString,
    status: parseAsStringEnum(Object.values(TaskStatus)),
    assigneeId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString,
  })
}

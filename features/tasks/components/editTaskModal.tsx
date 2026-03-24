// @\features\tasks\components\editTaskModal.tsx
"use client";
import ResponsiveModal from "@/components/responsiveModal";
import { useEditTaskModal } from "../hooks/useEditTaskModal";
import EditTaskFormWrapper from "./editTaskFormWrapper";
const EditTaskModal = () => {
  const { taskId, close } = useEditTaskModal();
  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      {taskId && <EditTaskFormWrapper onCancel={close} id={taskId}/>}
    </ResponsiveModal>
  );
};
export default EditTaskModal;

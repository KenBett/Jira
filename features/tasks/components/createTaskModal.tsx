// @\features\tasks\components\createTaskModal.tsx
"use client";
import ResponsiveModal from "@/components/responsiveModal";
import { useCreateTaskModal } from "../hooks/useCreateTaskModal";
import CreateTaskFormWrapper from "./createTaskFormWrapper";
const CreateTaskModal = () => {
  const { isOpen, setIsOpen, close } = useCreateTaskModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateTaskFormWrapper onCancel={close} />
    </ResponsiveModal>
  );
}
export default CreateTaskModal
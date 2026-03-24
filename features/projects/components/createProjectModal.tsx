// @\features\workspaces\components\createWorkspaceModal.tsx
"use client";
import ResponsiveModal from "@/components/responsiveModal";
import CreateProjectForm from "./createProjectForm";
import { useCreateProjectModal } from "../hooks/useCreateProjectModal";

const CreateProjectModal = () => {
  const { isOpen, setIsOpen, close } = useCreateProjectModal();
  return (
      <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
        <CreateProjectForm onCancel={close} />
      </ResponsiveModal>
  );
};
export default CreateProjectModal;

// @\features\workspaces\components\createWorkspaceModal.tsx
"use client";
import ResponsiveModal from "@/components/responsiveModal";
import CreateWorkspaceForm from "./createWorkspaceForm";
import { useCreateWorkspaceModal } from "../hooks/useCreateWorkspaceModal";

const CreateWorkspaceModal = () => {
  const { isOpen, setIsOpen, close } = useCreateWorkspaceModal();
  return (
      <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
        <CreateWorkspaceForm onCancel={close} />
      </ResponsiveModal>
  );
};
export default CreateWorkspaceModal;

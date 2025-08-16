// frontend-new/src/features/auth/components/forms/LogoutForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/buttons/Button";
import Modal from "@/components/modals/Modal";
import { useAuth } from "@/features/auth/contexts/AuthContext";

interface LogoutFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutForm({ isOpen, onClose }: LogoutFormProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    router.push("/");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Sign out">
      <div className="flex justify-end gap-2">
        <Button variant="primary" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>
    </Modal>
  );
}

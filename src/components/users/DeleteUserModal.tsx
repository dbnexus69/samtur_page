import { AlertTriangle } from "lucide-react";
import { User } from "../../types";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
}

export function DeleteUserModal({
  isOpen,
  onClose,
  onConfirm,
  user,
}: DeleteUserModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar Usuario"
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Confirmar Eliminación
          </Button>
        </>
      }
    >
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">¿Estás seguro?</h3>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          Esta acción eliminará permanentemente al usuario <b>{user?.name}</b>. 
          Esta acción no se puede deshacer.
        </p>
      </div>
    </Modal>
  );
}
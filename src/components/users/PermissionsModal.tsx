import { ShieldCheck } from "lucide-react";
import { User, RolePermissions } from "../../types";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { PermissionsGrid } from "./PermissionsGrid";

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  user: User | null;
  permissions: RolePermissions;
  onPermissionsChange: (p: RolePermissions) => void;
  isGlobal?: boolean;
}

export function PermissionsModal({
  isOpen,
  onClose,
  onSave,
  user,
  permissions,
  onPermissionsChange,
  isGlobal = false,
}: PermissionsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isGlobal ? "Permisos por Defecto: Vendedores" : `Permisos: ${user?.name}`}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSave}>
            {isGlobal ? "Guardar Cambios Globales" : "Actualizar Permisos"}
          </Button>
        </>
      }
    >
      {isGlobal ? (
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl mb-6 flex gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          <p className="text-xs text-amber-700 leading-relaxed">
            Aquí defines lo que un <b>Vendedor</b> puede hacer de forma
            predeterminada al ser registrado. Los cambios aplicarán a todos los
            vendedores existentes que no tengan permisos personalizados.
          </p>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
          <ShieldCheck className="text-blue-500 shrink-0" size={24} />
          <div>
            <p className="text-sm font-bold text-blue-900">
              Configuración Personalizada
            </p>
            <p className="text-xs text-blue-700">
              Estos permisos sobrescriben la configuración global para este
              usuario específico.
            </p>
          </div>
        </div>
      )}
      <PermissionsGrid
        permissions={permissions}
        onChange={onPermissionsChange}
      />
    </Modal>
  );
}
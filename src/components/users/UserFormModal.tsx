import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { User } from "../../types";
import { AVATARS } from "../../config/avatars";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Input, Select, FormField } from "../ui/Form";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingUser: User | null;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "admin" | "vendor";
    docType: string;
    docNumber: string;
    phone: string;
    birthDate: string;
    status: "active" | "inactive";
    avatar: string;
  };
  onFormChange: React.Dispatch<
    React.SetStateAction<{
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      role: "admin" | "vendor";
      docType: string;
      docNumber: string;
      phone: string;
      birthDate: string;
      status: "active" | "inactive";
      avatar: string;
    }>
  >;
  errors: Record<string, string>;
  onErrorsChange: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  showPassword: boolean;
  onTogglePassword: () => void;
}

export function UserFormModal({
  isOpen,
  onClose,
  onSave,
  editingUser,
  formData,
  onFormChange,
  errors,
  onErrorsChange,
  showPassword,
  onTogglePassword,
}: UserFormModalProps) {
  const getRandomAvatar = () =>
    AVATARS[Math.floor(Math.random() * AVATARS.length)];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingUser ? "Editar Usuario" : "Nuevo Usuario"}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSave}>Guardar</Button>
        </>
      }
    >
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-border mb-6">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
          Selecciona Avatar
        </h3>
        <div className="flex flex-wrap gap-2">
          {AVATARS.map((avatar, i) => (
            <img
              key={i}
              src={avatar}
              onClick={() => onFormChange({ ...formData, avatar })}
              className={`w-10 h-10 rounded-full cursor-pointer border-2 transition-all hover:scale-110 ${
                formData.avatar === avatar
                  ? "border-primary ring-2 ring-primary/20 scale-110"
                  : "border-transparent opacity-50 hover:opacity-100"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Nombres" error={errors.firstName}>
          <Input
            maxLength={40}
            value={formData.firstName}
            onChange={(e) => {
              onFormChange({ ...formData, firstName: e.target.value });
              if (errors.firstName)
                onErrorsChange((p) => ({ ...p, firstName: "" }));
            }}
          />
        </FormField>
        <FormField label="Apellidos" error={errors.lastName}>
          <Input
            maxLength={40}
            value={formData.lastName}
            onChange={(e) => {
              onFormChange({ ...formData, lastName: e.target.value });
              if (errors.lastName)
                onErrorsChange((p) => ({ ...p, lastName: "" }));
            }}
          />
        </FormField>
        <FormField label="Correo" error={errors.email}>
          <Input
            maxLength={40}
            type="email"
            value={formData.email}
            onChange={(e) => {
              onFormChange({ ...formData, email: e.target.value });
              if (errors.email) onErrorsChange((p) => ({ ...p, email: "" }));
            }}
          />
        </FormField>
        <FormField label="Contraseña" error={errors.password}>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => {
                onFormChange({ ...formData, password: e.target.value });
                if (errors.password)
                  onErrorsChange((p) => ({ ...p, password: "" }));
              }}
            />
            <button
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </FormField>
        <FormField label="Rol">
          <Select
            value={formData.role}
            onChange={(e) =>
              onFormChange({
                ...formData,
                role: e.target.value as "admin" | "vendor",
              })
            }
            options={[
              { value: "admin", label: "Administrador" },
              { value: "vendor", label: "Vendedor" },
            ]}
          />
        </FormField>
        <FormField label="Tipo Doc">
          <Select
            value={formData.docType}
            onChange={(e) =>
              onFormChange({ ...formData, docType: e.target.value })
            }
            options={[
              { value: "CC", label: "Cédula de Ciudadanía" },
              { value: "CE", label: "Cédula de Extranjería" },
              { value: "PP", label: "Pasaporte" },
            ]}
          />
        </FormField>
        <FormField label="Documento" error={errors.docNumber}>
          <Input
            maxLength={15}
            value={formData.docNumber}
            onChange={(e) => {
              onFormChange({ ...formData, docNumber: e.target.value });
              if (errors.docNumber)
                onErrorsChange((p) => ({ ...p, docNumber: "" }));
            }}
          />
        </FormField>
        <FormField label="Teléfono" error={errors.phone}>
          <Input
            maxLength={15}
            value={formData.phone}
            onChange={(e) => {
              onFormChange({ ...formData, phone: e.target.value });
              if (errors.phone) onErrorsChange((p) => ({ ...p, phone: "" }));
            }}
          />
        </FormField>
        <FormField label="Fecha Nacimiento" error={errors.birthDate}>
          <Input
            type="date"
            value={formData.birthDate}
            onChange={(e) => {
              onFormChange({ ...formData, birthDate: e.target.value });
              if (errors.birthDate)
                onErrorsChange((p) => ({ ...p, birthDate: "" }));
            }}
          />
        </FormField>
        <FormField label="Estado">
          <Select
            value={formData.status}
            onChange={(e) =>
              onFormChange({
                ...formData,
                status: e.target.value as "active" | "inactive",
              })
            }
            options={[
              { value: "active", label: "Activo" },
              { value: "inactive", label: "Inactivo" },
            ]}
          />
        </FormField>
      </div>
    </Modal>
  );
}
import { useState, useEffect } from "react";
import { PartyPopper, UserCheck } from "lucide-react";
import { Button } from "../ui/Button";
import { Input, Select, FormField } from "../ui/Form";
import { CLIENT_AVATARS } from "../../config/avatars";
import { Client } from "../../types";
import { DocumentTypeConfig } from "../../config";

interface ClientFormModalProps {
  client: Client | null;
  documentTypes: DocumentTypeConfig[];
  onSubmit: (data: Partial<Client>) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  docType: string;
  docNumber: string;
  phone: string;
  email: string;
  birthDate: string;
  status: "active" | "inactive";
  avatar: string;
}

export function ClientFormModal({
  client,
  documentTypes,
  onSubmit,
  isOpen,
  onClose,
}: ClientFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    docType: "",
    docNumber: "",
    phone: "",
    email: "",
    birthDate: "",
    status: "active",
    avatar: CLIENT_AVATARS[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (client) {
      setFormData({
        firstName: client.firstName || "",
        lastName: client.lastName || "",
        docType: client.docType,
        docNumber: client.docNumber,
        phone: client.phone,
        email: client.email,
        birthDate: client.birthDate || "",
        status: client.status,
        avatar: client.avatar || CLIENT_AVATARS[0],
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        docType: "",
        docNumber: "",
        phone: "",
        email: "",
        birthDate: "",
        status: "active",
        avatar: CLIENT_AVATARS[Math.floor(Math.random() * CLIENT_AVATARS.length)],
      });
    }
    setErrors({});
  }, [client, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "El nombre es obligatorio";
    else if (formData.firstName.length > 40) newErrors.firstName = "El nombre no puede exceder 40 caracteres";
    
    if (!formData.lastName.trim()) newErrors.lastName = "El apellido es obligatorio";
    else if (formData.lastName.length > 40) newErrors.lastName = "El apellido no puede exceder 40 caracteres";
    
    if (!formData.docType) newErrors.docType = "Seleccione un tipo de documento";
    if (!formData.docNumber.trim()) newErrors.docNumber = "El numero de documento es obligatorio";
    else if (formData.docNumber.length > 15) newErrors.docNumber = "El documento no puede exceder 15 caracteres";
    
    if (!formData.phone.trim()) newErrors.phone = "El telefono es obligatorio";
    else if (!/^\d+$/.test(formData.phone)) newErrors.phone = "El telefono solo debe contener numeros";
    else if (formData.phone.length > 15) newErrors.phone = "El telefono no puede exceder 15 caracteres";
    
    if (!formData.email.trim()) newErrors.email = "El correo es obligatorio";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "El correo no es valido";
    else if (formData.email.length > 40) newErrors.email = "El correo no puede exceder 40 caracteres";
    
    if (!formData.birthDate) newErrors.birthDate = "La fecha de nacimiento es obligatoria";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-border mb-6">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
          <PartyPopper size={14} className="text-accent" /> Selecciona el Avatar
        </h3>
        <div className="max-h-24 overflow-y-auto pr-2 custom-scrollbar">
          <div className="flex flex-wrap gap-3 justify-center md:justify-start py-1">
            {CLIENT_AVATARS.map((avatar, index) => (
              <div
                key={index}
                onClick={() => setFormData({ ...formData, avatar })}
                className={`w-10 h-10 rounded-full cursor-pointer transition-all border-2 overflow-hidden shadow-sm hover:scale-110 ${
                  formData.avatar === avatar
                    ? "border-accent ring-2 ring-accent/20 scale-110"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={avatar} alt={`Avatar ${index}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3 pb-2 border-b border-gray-border flex items-center gap-2">
            <UserCheck size={16} className="text-accent" /> Información Personal
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Nombres" error={errors.firstName}>
              <Input
                value={formData.firstName}
                onChange={(e) => {
                  setFormData({ ...formData, firstName: e.target.value });
                  if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: "" }));
                }}
                placeholder="Ej: Juan"
                error={errors.firstName}
                maxLength={40}
              />
            </FormField>
            <FormField label="Apellidos" error={errors.lastName}>
              <Input
                value={formData.lastName}
                onChange={(e) => {
                  setFormData({ ...formData, lastName: e.target.value });
                  if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: "" }));
                }}
                placeholder="Ej: Perez"
                error={errors.lastName}
                maxLength={40}
              />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Tipo de Documento" error={errors.docType}>
              <Select
                value={formData.docType}
                onChange={(e) => {
                  setFormData({ ...formData, docType: e.target.value });
                  if (errors.docType) setErrors((prev) => ({ ...prev, docType: "" }));
                }}
                options={[{ value: "", label: "Seleccionar..." }, ...documentTypes.map((d) => ({ value: d.name, label: d.name }))]}
                error={errors.docType}
              />
            </FormField>
            <FormField label="Número de Documento" error={errors.docNumber}>
              <Input
                value={formData.docNumber}
                onChange={(e) => {
                  setFormData({ ...formData, docNumber: e.target.value });
                  if (errors.docNumber) setErrors((prev) => ({ ...prev, docNumber: "" }));
                }}
                placeholder="Número de documento"
                error={errors.docNumber}
                maxLength={15}
              />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Teléfono" error={errors.phone}>
              <Input
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                }}
                placeholder="3001234567"
                error={errors.phone}
                maxLength={15}
              />
            </FormField>
            <FormField label="Fecha de Nacimiento" error={errors.birthDate}>
              <Input
                type="date"
                value={formData.birthDate}
                onChange={(e) => {
                  setFormData({ ...formData, birthDate: e.target.value });
                  if (errors.birthDate) setErrors((prev) => ({ ...prev, birthDate: "" }));
                }}
                error={errors.birthDate}
              />
            </FormField>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3 pb-2 border-b border-gray-border flex items-center gap-2">
            <UserCheck size={16} className="text-accent" /> Información de Contacto y Estado
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Correo Electrónico" error={errors.email}>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                }}
                placeholder="correo@ejemplo.com"
                error={errors.email}
                maxLength={40}
              />
            </FormField>
            <FormField label="Estado">
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
                options={[
                  { value: "active", label: "Activo" },
                  { value: "inactive", label: "Inactivo" },
                ]}
              />
            </FormField>
          </div>
        </section>
      </div>
    </div>
  );
}
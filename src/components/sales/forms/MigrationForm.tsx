import { LuFileText } from "react-icons/lu";
import { FormField, Input, Combobox } from "../../ui/Form";
import { MigrationData } from "../../../types";

interface MigrationFormProps {
  migration: MigrationData;
  onChange: (updates: Partial<MigrationData>) => void;
}

export function MigrationForm({ migration, onChange }: MigrationFormProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
          <LuFileText size={14} /> Documentación Migratoria
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nombre Completo">
            <Input value={migration.passengerName} onChange={(e) => onChange({ passengerName: e.target.value })} placeholder="Nombre del titular" />
          </FormField>
          <FormField label="Fecha de Nacimiento">
            <Input type="date" value={migration.birthDate} onChange={(e) => onChange({ birthDate: e.target.value })} />
          </FormField>
          <FormField label="Nacionalidad">
            <Input value={migration.nationality} onChange={(e) => onChange({ nationality: e.target.value })} placeholder="Ej: Colombiana" />
          </FormField>
          <FormField label="Número de Pasaporte">
            <Input value={migration.passportNumber} onChange={(e) => onChange({ passportNumber: e.target.value })} placeholder="Ej: AU123456" />
          </FormField>
          <FormField label="Vencimiento Pasaporte">
            <Input type="date" value={migration.passportExpiry} onChange={(e) => onChange({ passportExpiry: e.target.value })} />
          </FormField>
          <FormField label="País de Destino">
            <Input value={migration.destinationCountry} onChange={(e) => onChange({ destinationCountry: e.target.value })} placeholder="Ej: Estados Unidos" />
          </FormField>
          <FormField label="Tipo de Documento Solicitado">
            <Combobox
              value={migration.requestedDocType}
              onChange={(val) => onChange({ requestedDocType: val })}
              options={[
                { value: "Visa Turismo", label: "Visa Turismo" },
                { value: "Visa Trabajo", label: "Visa Trabajo" },
                { value: "Visa Estudiante", label: "Visa Estudiante" },
                { value: "Residencia", label: "Residencia" },
                { value: "Permiso Especial", label: "Permiso Especial" },
                { value: "Prórroga de Estancia", label: "Prórroga de Estancia" },
                { value: "Asesoría Migratoria", label: "Asesoría Migratoria" },
              ]}
              placeholder="Seleccione el trámite..."
            />
          </FormField>
          <FormField label="Correo Electrónico">
            <Input type="email" value={migration.email} onChange={(e) => onChange({ email: e.target.value })} placeholder="ejemplo@correo.com" />
          </FormField>
        </div>
      </div>
    </div>
  );
}
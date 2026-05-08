import { LuBookOpen } from "react-icons/lu";
import { FormField, Input, Combobox } from "../../ui/Form";
import { PassportData } from "../../../types";

interface PassportFormProps {
  passport: PassportData;
  onChange: (updates: Partial<PassportData>) => void;
}

export function PassportForm({ passport, onChange }: PassportFormProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
          <LuBookOpen size={14} /> Trámite de Pasaporte
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nombre Completo *">
            <Input value={passport.fullName} onChange={(e) => onChange({ fullName: e.target.value })} placeholder="Nombre completo" />
          </FormField>
          <FormField label="Cédula de Ciudadanía *">
            <Input value={passport.idNumber} onChange={(e) => onChange({ idNumber: e.target.value })} placeholder="Número de documento" />
          </FormField>
          <FormField label="Fecha de Nacimiento *">
            <Input type="date" value={passport.birthDate} onChange={(e) => onChange({ birthDate: e.target.value })} />
          </FormField>
          <FormField label="Ciudad de Residencia *">
            <Combobox
              value={passport.residenceCity}
              onChange={(val) => onChange({ residenceCity: val })}
              options={[
                { value: "bogota", label: "Bogotá" },
                { value: "medellin", label: "Medellín" },
                { value: "cali", label: "Cali" },
                { value: "barranquilla", label: "Barranquilla" },
                { value: "bucaramanga", label: "Bucaramanga" },
                { value: "otra", label: "Otra" },
              ]}
              placeholder="Seleccione ciudad..."
            />
          </FormField>
          <FormField label="Tipo de Trámite *">
            <Combobox
              value={passport.processType}
              onChange={(val) => onChange({ processType: val })}
              options={[
                { value: "primera vez", label: "Primera Vez" },
                { value: "renovacion", label: "Renovación" },
                { value: "urgente", label: "Urgente" },
              ]}
              placeholder="Seleccione trámite..."
            />
          </FormField>
          <FormField label="Fecha Estimada de Viaje">
            <Input type="date" value={passport.estimatedTravelDate} onChange={(e) => onChange({ estimatedTravelDate: e.target.value })} />
          </FormField>
          <FormField label="Celular *">
            <Input type="tel" value={passport.phone} onChange={(e) => onChange({ phone: e.target.value })} placeholder="+57 300 123 4567" />
          </FormField>
        </div>
      </div>
    </div>
  );
}
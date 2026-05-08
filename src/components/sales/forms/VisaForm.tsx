import { LuStamp } from "react-icons/lu";
import { FormField, Input, Combobox } from "../../ui/Form";
import { VisaData } from "../../../types";

interface VisaFormProps {
  visa: VisaData;
  onChange: (updates: Partial<VisaData>) => void;
}

export function VisaForm({ visa, onChange }: VisaFormProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
          <LuStamp size={14} /> Trámite de Visa
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nombre Completo (como en pasaporte) *">
            <Input value={visa.fullName} onChange={(e) => onChange({ fullName: e.target.value })} placeholder="Nombre completo" />
          </FormField>
          <FormField label="Fecha de Nacimiento *">
            <Input type="date" value={visa.birthDate} onChange={(e) => onChange({ birthDate: e.target.value })} />
          </FormField>
          <FormField label="Nacionalidad *">
            <Combobox
              value={visa.nationality}
              onChange={(val) => onChange({ nationality: val })}
              options={[
                { value: "colombiana", label: "Colombiana" },
                { value: "estadounidense", label: "Estadounidense" },
                { value: "española", label: "Española" },
                { value: "mexicana", label: "Mexicana" },
                { value: "venezolana", label: "Venezolana" },
                { value: "otra", label: "Otra" },
              ]}
              placeholder="Seleccione nacionalidad..."
            />
          </FormField>
          <div className="grid grid-cols-2 gap-2">
            <FormField label="Nº de Pasaporte *">
              <Input value={visa.passportNumber} onChange={(e) => onChange({ passportNumber: e.target.value })} placeholder="Número" />
            </FormField>
            <FormField label="Vencimiento Pasaporte *">
              <Input type="date" value={visa.passportExpiration} onChange={(e) => onChange({ passportExpiration: e.target.value })} />
            </FormField>
          </div>
          <FormField label="País al que aplica *">
            <Combobox
              value={visa.countryApplying}
              onChange={(val) => onChange({ countryApplying: val })}
              options={[
                { value: "usa", label: "Estados Unidos" },
                { value: "canada", label: "Canadá" },
                { value: "uk", label: "Reino Unido" },
                { value: "china", label: "China" },
                { value: "japon", label: "Japón" },
                { value: "australia", label: "Australia" },
              ]}
              placeholder="Seleccione país..."
            />
          </FormField>
          <FormField label="Tipo de Visa *">
            <Combobox
              value={visa.visaType}
              onChange={(val) => onChange({ visaType: val })}
              options={[
                { value: "turista", label: "Turista" },
                { value: "negocios", label: "Negocios" },
                { value: "estudios", label: "Estudios" },
                { value: "transito", label: "Tránsito" },
              ]}
              placeholder="Seleccione tipo..."
            />
          </FormField>
          <FormField label="Fecha Estimada de Viaje *">
            <Input type="date" value={visa.estimatedTravelDate} onChange={(e) => onChange({ estimatedTravelDate: e.target.value })} />
          </FormField>
          <FormField label="Correo Electrónico *">
            <Input type="email" value={visa.email} onChange={(e) => onChange({ email: e.target.value })} placeholder="ejemplo@correo.com" />
          </FormField>
        </div>
      </div>
    </div>
  );
}
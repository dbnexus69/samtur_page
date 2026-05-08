import { Home, Users, Calendar } from "lucide-react";
import { FormField, Input, Combobox } from "../../ui/Form";
import { FincaData } from "../../../types";

interface FincaFormProps {
  finca: FincaData;
  onChange: (updates: Partial<FincaData>) => void;
}

export function FincaForm({ finca, onChange }: FincaFormProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
          <Home size={14} /> Renta de Finca
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Responsable">
            <Input value={finca.responsibleName} onChange={(e) => onChange({ responsibleName: e.target.value })} placeholder="Nombre completo" />
          </FormField>
          <FormField label="Número de Documento">
            <Input value={finca.docNumber} onChange={(e) => onChange({ docNumber: e.target.value })} placeholder="C.C." />
          </FormField>
          <FormField label="Fecha de Check-in">
            <Input type="date" value={finca.checkInDate} onChange={(e) => onChange({ checkInDate: e.target.value })} />
          </FormField>
          <FormField label="Fecha de Check-out">
            <Input type="date" value={finca.checkOutDate} onChange={(e) => onChange({ checkOutDate: e.target.value })} />
          </FormField>
          <FormField label="Número de Adultos">
            <Input type="number" value={finca.adultsCount} onChange={(e) => onChange({ adultsCount: parseInt(e.target.value) || 2 })} />
          </FormField>
          <FormField label="Número de Niños">
            <Input type="number" value={finca.childrenCount} onChange={(e) => onChange({ childrenCount: parseInt(e.target.value) || 0 })} />
          </FormField>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="has-pets"
              checked={finca.hasPets}
              onChange={(e) => onChange({ hasPets: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="has-pets" className="text-sm font-medium text-gray-700">
              Tiene mascotas
            </label>
          </div>
          <FormField label="Teléfono">
            <Input value={finca.phone} onChange={(e) => onChange({ phone: e.target.value })} placeholder="+57 300 123 4567" />
          </FormField>
        </div>
      </div>
    </div>
  );
}
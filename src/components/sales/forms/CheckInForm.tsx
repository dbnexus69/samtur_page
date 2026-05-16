import { LuBookCheck } from "react-icons/lu";
import { FormField, Input, Select, Textarea } from "../../ui/Form";
import { CheckInData } from "../../../types";

interface CheckInFormProps {
  checkin: CheckInData;
  onChange: (updates: Partial<CheckInData>) => void;
}

export function CheckInForm({ checkin, onChange }: CheckInFormProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
          <LuBookCheck size={14} /> Información de Check-in
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nombre Completo">
            <Input
              value={checkin.passengerName}
              onChange={(e) => onChange({ passengerName: e.target.value })}
              placeholder="Nombre del pasajero"
            />
          </FormField>
          <div className="grid grid-cols-3 gap-2">
            <FormField label="Tipo Doc.">
              <Select
                value={checkin.docType}
                onChange={(e) => onChange({ docType: e.target.value })}
                options={[
                  { value: "CC", label: "CC" },
                  { value: "TI", label: "TI" },
                  { value: "CE", label: "CE" },
                  { value: "Pasaporte", label: "Pasaporte" },
                ]}
              />
            </FormField>
            <FormField label="Número Documento" className="col-span-2">
              <Input
                value={checkin.docNumber}
                onChange={(e) => onChange({ docNumber: e.target.value })}
                placeholder="12345678"
              />
            </FormField>
          </div>
          <FormField label="Número de Vuelo / Reserva">
            <Input
              value={checkin.flightOrReservation}
              onChange={(e) => onChange({ flightOrReservation: e.target.value })}
              placeholder="Ej: AV9301 o Código"
            />
          </FormField>
          <FormField label="Fecha y Hora de Viaje">
            <Input type="datetime-local" value={checkin.travelDate} onChange={(e) => onChange({ travelDate: e.target.value })} />
          </FormField>
          <FormField label="Asiento">
            <Input value={checkin.seat} onChange={(e) => onChange({ seat: e.target.value })} placeholder="Ej: 12A" />
          </FormField>
          <FormField label="Equipaje">
            <Input value={checkin.baggage} onChange={(e) => onChange({ baggage: e.target.value })} placeholder="Ej: 23kg + Morral" />
          </FormField>
          <FormField label="Teléfono">
            <Input value={checkin.phone} onChange={(e) => onChange({ phone: e.target.value })} placeholder="Ej: 3001234567" />
          </FormField>
          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="needs-wheelchair"
              checked={checkin.needsWheelchair}
              onChange={(e) => onChange({ needsWheelchair: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="needs-wheelchair" className="text-sm font-medium text-gray-700">
              Requiere silla de ruedas
            </label>
          </div>
          <FormField label="Necesidades Especiales / Observaciones" className="md:col-span-2">
            <Textarea
              value={checkin.specialNeeds}
              onChange={(e) => onChange({ specialNeeds: e.target.value })}
              placeholder="Describa cualquier necesidad adicional..."
              rows={2}
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}
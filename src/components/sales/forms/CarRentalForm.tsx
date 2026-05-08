import { Car, Users, Shield, Calendar } from "lucide-react";
import { FormField, Input, Combobox } from "../../ui/Form";
import { CarRentalData } from "../../../types";

interface CarRentalFormProps {
  car: CarRentalData;
  onChange: (updates: Partial<CarRentalData>) => void;
}

export function CarRentalForm({ car, onChange }: CarRentalFormProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
          <Car size={14} /> Renta de Vehículo
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Conductor Principal">
            <Input value={car.mainDriver} onChange={(e) => onChange({ mainDriver: e.target.value })} placeholder="Nombre completo" />
          </FormField>
          <FormField label="Número de Licencia">
            <Input value={car.licenseNumber} onChange={(e) => onChange({ licenseNumber: e.target.value })} placeholder="Número de licencia" />
          </FormField>
          <FormField label="Fecha de Recogida">
            <Input type="date" value={car.pickupDate} onChange={(e) => onChange({ pickupDate: e.target.value })} />
          </FormField>
          <FormField label="Fecha de Devolución">
            <Input type="date" value={car.returnDate} onChange={(e) => onChange({ returnDate: e.target.value })} />
          </FormField>
          <FormField label="Lugar de Recogida">
            <Combobox
              value={car.pickupLocation}
              onChange={(val) => onChange({ pickupLocation: val })}
              options={[
                { value: "Aeropuerto", label: "Aeropuerto" },
                { value: "Hotel", label: "Hotel" },
                { value: "Oficina", label: "Oficina" },
                { value: "Domicilio", label: "Domicilio" },
              ]}
            />
          </FormField>
          <FormField label="Categoría de Vehículo">
            <Combobox
              value={car.vehicleCategory}
              onChange={(val) => onChange({ vehicleCategory: val })}
              options={[
                { value: "compacto", label: "Compacto" },
                { value: "sedán", label: "Sedán" },
                { value: "suv", label: "SUV" },
                { value: "van", label: "Van" },
                { value: "lujo", label: "Lujo" },
              ]}
            />
          </FormField>
          <FormField label="Conductores Adicionales">
            <Input type="number" value={car.additionalDrivers} onChange={(e) => onChange({ additionalDrivers: parseInt(e.target.value) || 0 })} />
          </FormField>
          <FormField label="Tipo de Seguro">
            <Combobox
              value={car.insuranceType}
              onChange={(val) => onChange({ insuranceType: val as "basic" | "all_risk" })}
              options={[
                { value: "basic", label: "Básico" },
                { value: "all_risk", label: "Todo Riesgo" },
              ]}
            />
          </FormField>
          <FormField label="Tarjeta de Garantía">
            <Input value={car.guaranteeCreditCard} onChange={(e) => onChange({ guaranteeCreditCard: e.target.value })} placeholder="Últimos 4 dígitos" />
          </FormField>
        </div>
      </div>
    </div>
  );
}
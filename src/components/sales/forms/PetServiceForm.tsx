import { LuDog } from "react-icons/lu";
import { FormField, Input, Combobox, Textarea } from "../../ui/Form";
import { PetServiceData } from "../../../types";

interface PetServiceFormProps {
  petService: PetServiceData;
  onChange: (updates: Partial<PetServiceData>) => void;
}

export function PetServiceForm({ petService, onChange }: PetServiceFormProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
          <LuDog size={14} /> Servicio para Mascotas
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nombre del Dueño *">
            <Input value={petService.ownerName} onChange={(e) => onChange({ ownerName: e.target.value })} placeholder="Responsable" />
          </FormField>
          <FormField label="Nombre de la Mascota *">
            <Input value={petService.petName} onChange={(e) => onChange({ petName: e.target.value })} placeholder="Nombre" />
          </FormField>
          <FormField label="Especie *">
            <Combobox
              value={petService.species}
              onChange={(val) => onChange({ species: val })}
              options={[
                { value: "perro", label: "Perro" },
                { value: "gato", label: "Gato" },
                { value: "ave", label: "Ave" },
                { value: "otro", label: "Otro" },
              ]}
            />
          </FormField>
          <FormField label="Raza *">
            <Input value={petService.breed} onChange={(e) => onChange({ breed: e.target.value })} placeholder="Raza" />
          </FormField>
          <FormField label="Peso (kg) *">
            <Input type="number" min={0.1} step={0.1} value={petService.weight} onChange={(e) => onChange({ weight: parseFloat(e.target.value) || 0 })} />
          </FormField>
          <FormField label="Tamaño *">
            <Combobox
              value={petService.size}
              onChange={(val) => onChange({ size: val })}
              options={[
                { value: "pequeño", label: "Pequeño" },
                { value: "mediano", label: "Mediano" },
                { value: "grande", label: "Grande" },
              ]}
            />
          </FormField>
          <FormField label="Tipo de Viaje *">
            <Combobox
              value={petService.travelType}
              onChange={(val) => onChange({ travelType: val })}
              options={[
                { value: "cabina", label: "Cabina" },
                { value: "bodega", label: "Bodega" },
                { value: "traslado terrestre", label: "Traslado Terrestre" },
              ]}
            />
          </FormField>
          <FormField label="Fecha de Viaje *">
            <Input type="date" value={petService.travelDate} onChange={(e) => onChange({ travelDate: e.target.value })} />
          </FormField>
          <FormField label="País de Destino *">
            <Input value={petService.destinationCountry} onChange={(e) => onChange({ destinationCountry: e.target.value })} placeholder="País de destino" />
          </FormField>
          <FormField label="Teléfono *">
            <Input type="tel" value={petService.phone} onChange={(e) => onChange({ phone: e.target.value })} placeholder="+57 300 123 4567" />
          </FormField>
          <FormField label="Condiciones Médicas" className="md:col-span-2">
            <Textarea
              value={petService.medicalConditions}
              onChange={(e) => onChange({ medicalConditions: e.target.value })}
              placeholder="Alergias, medicamentos, etc."
              rows={2}
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}
import { Plane, MapPin, User, Briefcase, Trash2, PlusCircle } from "lucide-react";
import { FormField, Input, Combobox, Select } from "../../ui/Form";
import { Button } from "../../ui/Button";
import { TicketData, FlightLeg } from "../../../types";

interface TicketFormProps {
  ticket: TicketData;
  onChange: (updates: Partial<TicketData>) => void;
  airlines: { name: string }[];
  suppliers: { name: string }[];
  airports: any[];
  paymentMethods: { name: string; lastFourDigits?: string }[];
  baggage: {
    id: number;
    airlineName: string;
    fareType: string;
    personalItem: string;
    carryOn: string;
    checkedBag: string;
    notes: string;
  }[];
}

export function TicketForm({
  ticket,
  onChange,
  airlines,
  suppliers,
  airports,
  paymentMethods,
  baggage,
}: TicketFormProps) {
  const airportOptions = airports.map((a) => ({
    value: a.abbreviation,
    label: `${a.abbreviation} - ${a.name} (${a.location})`,
  }));

  const updateLeg = (legIdx: number, legUpdates: Partial<FlightLeg>) => {
    const nextLegs = [...ticket.legs];
    nextLegs[legIdx] = { ...nextLegs[legIdx], ...legUpdates };
    onChange({ legs: nextLegs });
  };

  const addLeg = () => {
    onChange({ legs: [...ticket.legs, { origin: "", destination: "", flightNumber: "", seat: "", date: "" }] });
  };

  const removeLeg = (legIdx: number) => {
    onChange({ legs: ticket.legs.filter((_, i) => i !== legIdx) });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <datalist id="cities-list-ticket">
        {airports?.map((a) => (
          <option key={a.abbreviation} value={a.abbreviation} />
        ))}
      </datalist>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
          <Plane size={14} /> Información del Vuelo
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Aerolínea">
            <Combobox
              value={ticket.airline}
              onChange={(val) => onChange({ airline: val })}
              options={airlines.map((a) => ({ value: a.name, label: a.name }))}
              placeholder="Ej: Avianca"
            />
          </FormField>
          <FormField label="Proveedor">
            <Combobox
              value={ticket.supplier}
              onChange={(val) => onChange({ supplier: val })}
              options={suppliers.map((s) => ({ value: s.name, label: s.name }))}
              placeholder="Ej: Viajes Éxito"
            />
          </FormField>
          <FormField label="Número de Reserva">
            <Input
              value={ticket.reservationNumber}
              onChange={(e) => onChange({ reservationNumber: e.target.value })}
              placeholder="6 caracteres"
            />
          </FormField>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
            <MapPin size={14} /> Trayectos y Itinerario
          </h4>
          <Button variant="outline" size="sm" onClick={addLeg} className="h-7 text-[10px]">
            <PlusCircle size={12} className="mr-1" /> Añadir Trayecto
          </Button>
        </div>

        <div className="space-y-3">
          {ticket.legs.map((leg, lIdx) => (
            <div key={lIdx} className="bg-white border border-gray-200 rounded-xl p-4 relative group shadow-sm">
              {ticket.legs.length > 1 && (
                <button
                  onClick={() => removeLeg(lIdx)}
                  className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                <FormField label="Origen">
                  <Combobox
                    value={leg.origin}
                    onChange={(val) => updateLeg(lIdx, { origin: val })}
                    options={airportOptions}
                    placeholder="Ej: BOG"
                    className="text-xs"
                  />
                </FormField>
                <FormField label="Destino">
                  <Combobox
                    value={leg.destination}
                    onChange={(val) => updateLeg(lIdx, { destination: val })}
                    options={airportOptions}
                    placeholder="Ej: MDE"
                    className="text-xs"
                  />
                </FormField>
                <FormField label="Vuelo">
                  <Input value={leg.flightNumber} onChange={(e) => updateLeg(lIdx, { flightNumber: e.target.value })} placeholder="AV93" className="text-xs" />
                </FormField>
                <FormField label="Asiento">
                  <Input value={leg.seat} onChange={(e) => updateLeg(lIdx, { seat: e.target.value })} placeholder="12A" className="text-xs" />
                </FormField>
                <FormField label="Fecha">
                  <Input type="date" value={leg.date} onChange={(e) => updateLeg(lIdx, { date: e.target.value })} className="text-xs" />
                </FormField>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 py-2">
          <input
            type="checkbox"
            id="is-roundtrip-ticket"
            checked={ticket.isRoundTrip}
            onChange={(e) => onChange({ isRoundTrip: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-primary"
          />
          <label htmlFor="is-roundtrip-ticket" className="text-sm font-medium text-gray-700">
            Cuenta con trayecto de vuelta
          </label>
        </div>

        {ticket.isRoundTrip && (
          <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-4 animate-fade-in shadow-sm space-y-4">
            <h5 className="text-[10px] font-bold text-blue-700 uppercase tracking-widest flex items-center gap-2">
              <Plane size={12} className="rotate-180" /> Detalles del Regreso
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <FormField label="Origen Vuelta">
                <Combobox
                  value={ticket.returnLeg?.origin || ""}
                  onChange={(val) => onChange({ returnLeg: { ...ticket.returnLeg!, origin: val } })}
                  options={airportOptions}
                  placeholder="Ej: MDE"
                  className="text-xs"
                />
              </FormField>
              <FormField label="Destino Vuelta">
                <Combobox
                  value={ticket.returnLeg?.destination || ""}
                  onChange={(val) => onChange({ returnLeg: { ...ticket.returnLeg!, destination: val } })}
                  options={airportOptions}
                  placeholder="Ej: BOG"
                  className="text-xs"
                />
              </FormField>
              <FormField label="Vuelo Vuelta">
                <Input
                  value={ticket.returnLeg?.flightNumber || ""}
                  onChange={(e) => onChange({ returnLeg: { ...ticket.returnLeg!, flightNumber: e.target.value } })}
                  placeholder="Ej: AV93"
                  className="text-xs"
                />
              </FormField>
              <FormField label="Asiento Vuelta">
                <Input
                  value={ticket.returnLeg?.seat || ""}
                  onChange={(e) => onChange({ returnLeg: { ...ticket.returnLeg!, seat: e.target.value } })}
                  placeholder="Ej: 14C"
                  className="text-xs"
                />
              </FormField>
              <FormField label="Fecha Vuelta">
                <Input
                  type="date"
                  value={ticket.returnLeg?.date || ""}
                  onChange={(e) => onChange({ returnLeg: { ...ticket.returnLeg!, date: e.target.value } })}
                  className="text-xs"
                />
              </FormField>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-4 flex items-center gap-2">
          <User size={14} /> Información del Pasajero
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nombre Completo">
            <Input value={ticket.passengerInfo.name} disabled className="bg-gray-100" />
          </FormField>
          <FormField label="Documento">
            <div className="flex gap-2">
              <Input value={ticket.passengerInfo.docType} disabled className="w-20 bg-gray-100" />
              <Input value={ticket.passengerInfo.docNumber} disabled className="flex-1 bg-gray-100" />
            </div>
          </FormField>
          <FormField label="Fecha de Nacimiento">
            <Input type="date" value={ticket.passengerInfo.birthDate} disabled className="bg-gray-100" />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Número de Tiquete">
              <Input value={ticket.ticketNumber} onChange={(e) => onChange({ ticketNumber: e.target.value })} />
            </FormField>
            <FormField label="Número de Asiento">
              <Input value={ticket.seatNumber} onChange={(e) => onChange({ seatNumber: e.target.value })} />
            </FormField>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50/20 p-4 rounded-xl border border-emerald-100">
        <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Briefcase size={14} /> Detalles Financieros y Equipaje
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Valor Pagado al Proveedor">
            <Input
              type="number"
              value={ticket.supplierCost === 0 ? "" : ticket.supplierCost}
              onChange={(e) =>
                onChange({
                  supplierCost:
                    e.target.value === "" ? 0 : Number(e.target.value),
                })
              }
            />
          </FormField>
          <FormField label="Valor TA">
            <Input
              type="number"
              value={ticket.ta === 0 ? "" : ticket.ta}
              onChange={(e) =>
                onChange({
                  ta: e.target.value === "" ? 0 : Number(e.target.value),
                })
              }
            />
          </FormField>
          <FormField label="Método de Pago Proveedor">
            <Select
              value={ticket.supplierPaymentMethod}
              onChange={(e) => onChange({ supplierPaymentMethod: e.target.value })}
              options={paymentMethods.map((m) => ({
                value: m.name,
                label: m.lastFourDigits ? `${m.name} (**${m.lastFourDigits})` : m.name,
              }))}
            />
          </FormField>
          <FormField label="Plan de Equipaje">
            <Select
              value={ticket.baggagePlan}
              onChange={(e) => onChange({ baggagePlan: e.target.value })}
              options={[
                { value: "", label: "Seleccionar plan..." },
                ...baggage.map((b) => ({
                  value: `${b.airlineName} - ${b.fareType}`,
                  label: `${b.airlineName} - ${b.fareType}`,
                })),
              ]}
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}
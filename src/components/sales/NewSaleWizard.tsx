import { useState } from "react";
import {
  User,
  Users,
  Package,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Check,
  ShoppingBag,
  Plane,
  MapPin,
  Calendar,
  Clock,
  Trash2,
  PlusCircle,
  Briefcase,
  AlertCircle,
  Building2,
} from "lucide-react";
import * as LuIcons from "react-icons/lu";
import { FormField, Input, Select, Textarea, Combobox } from "../ui/Form";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import {
  Sale,
  SaleProductId,
  SALE_PRODUCTS,
  TicketData,
  FlightLeg,
  HotelData,
  InsuranceData,
  PlanData,
  GuestInfo,
} from "../../types";

// Import illustrations
import imgTiqueteria from "../../assets/tiqueteria.png";
import imgHoteleria from "../../assets/hoteleria.png";
import imgSeguros from "../../assets/seguros.png";
import imgPlanes from "../../assets/planes.png";

const PRODUCT_IMAGES: Record<string, string> = {
  tiqueteria: imgTiqueteria,
  hoteleria: imgHoteleria,
  seguros_viaje: imgSeguros,
  planes: imgPlanes,
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface WizardFormData {
  // Step 1
  clientId: string;
  commissionAgent: string;
  commissionAmount: string;
  commissionPaymentMethod: string;
  // Step 2
  selectedProducts: SaleProductId[];
  // Step 3
  observations: string;
  paymentMethod: string;
  total: string;
  ta: string;
  supplierCost: string;
  status: string;
  isCredit: boolean;
  creditDueDate: string;
  // Sub-forms
  tickets: TicketData[];
  hotels: HotelData[];
  insurances: InsuranceData[];
  plans: PlanData[];
}

const INITIAL_TICKET = (client?: any): TicketData => ({
  airline: "",
  supplier: "",
  reservationNumber: "",
  flightNumber: "",
  departureDate: "",
  arrivalDate: "",
  supplierCost: 0,
  ta: 0,
  supplierPaymentMethod: "Efectivo",
  baggagePlan: "",
  ticketNumber: "",
  seatNumber: "",
  isRoundTrip: false,
  returnLeg: { origin: "", destination: "", flightNumber: "", seat: "", date: "" },
  legs: [{ origin: "", destination: "", flightNumber: "", seat: "", date: "" }],
  passengerInfo: {
    name: client?.name || "",
    docType: client?.docType || "",
    docNumber: client?.docNumber || "",
    birthDate: client?.birthDate || "",
  },
});

const INITIAL_HOTEL = (client?: any): HotelData => ({
  hotelName: "",
  destination: "",
  supplier: "",
  reservationNumber: "",
  startDate: "",
  endDate: "",
  supplierCost: 0,
  ta: 0,
  supplierPaymentMethod: "Efectivo",
  guests: [
    {
      name: client?.name || "",
      docType: client?.docType || "",
      docNumber: client?.docNumber || "",
    },
  ],
});

const INITIAL_INSURANCE = (client?: any): InsuranceData => ({
  contactName: "",
  contactNumber: "",
  address: "",
  supplier: "",
  supplierCost: 0,
  ta: 0,
  supplierPaymentMethod: "Efectivo",
  members: [
    {
      name: client?.name || "",
      docType: client?.docType || "",
      docNumber: client?.docNumber || "",
    },
  ],
});

const INITIAL_PLAN = (client?: any): PlanData => ({
  planName: "",
  hotelName: "",
  supplier: "",
  supplierCost: 0,
  ta: 0,
  supplierPaymentMethod: "Efectivo",
  reservationNumber: "",
  flightNumber: "",
  ticketNumber: "",
  startDate: "",
  endDate: "",
  airline: "",
  guests: [
    {
      name: client?.name || "",
      docType: client?.docType || "",
      docNumber: client?.docNumber || "",
    },
  ],
});

const INITIAL_FORM: WizardFormData = {
  clientId: "",
  commissionAgent: "",
  commissionAmount: "",
  commissionPaymentMethod: "",
  selectedProducts: [],
  observations: "",
  paymentMethod: "",
  total: "",
  ta: "",
  supplierCost: "",
  status: "pendiente",
  isCredit: false,
  creditDueDate: "",
  tickets: [],
  hotels: [],
  insurances: [],
  plans: [],
};

interface Props {
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const STEPS = [
  { id: 1, label: "Cliente", icon: User },
  { id: 2, label: "Productos", icon: Package },
  { id: 3, label: "Pago", icon: CreditCard },
] as const;

const mainProducts = SALE_PRODUCTS.filter((p) => p.group === "main");
const otherProducts = SALE_PRODUCTS.filter((p) => p.group === "other");

function ProductIcon({ name, size = 20, className = "" }: { name: string; size?: number; className?: string }) {
  const IconComponent = (LuIcons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} />;
}

/* ================================================================== */
/*  Component                                                          */
/* ================================================================== */
export default function NewSaleWizard({ onClose, onSuccess }: Props) {
  const { data, addSale } = useData();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<WizardFormData>(INITIAL_FORM);
  const [showOtherProducts, setShowOtherProducts] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [currentTicketIdx, setCurrentTicketIdx] = useState<number | null>(null);
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [currentHotelIdx, setCurrentHotelIdx] = useState<number | null>(null);
  const [showInsuranceForm, setShowInsuranceForm] = useState(false);
  const [currentInsuranceIdx, setCurrentInsuranceIdx] = useState<number | null>(null);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [currentPlanIdx, setCurrentPlanIdx] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ---- helpers --------------------------------------------------- */
  const set = <K extends keyof WizardFormData>(
    key: K,
    value: WizardFormData[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleProduct = (id: SaleProductId) => {
    setForm((prev) => {
      const isSelecting = !prev.selectedProducts.includes(id);
      const nextProducts = isSelecting
        ? [...prev.selectedProducts, id]
        : prev.selectedProducts.filter((p) => p !== id);

      // If selecting tiqueteria for the first time
      if (id === "tiqueteria" && isSelecting && prev.tickets.length === 0) {
        const client = data.clients.find((c: any) => c.name === prev.clientId);
        return {
          ...prev,
          selectedProducts: nextProducts,
          tickets: [INITIAL_TICKET(client)],
        };
      }

      // If selecting hoteleria for the first time
      if (id === "hoteleria" && isSelecting && prev.hotels.length === 0) {
        const client = data.clients.find((c: any) => c.name === prev.clientId);
        return {
          ...prev,
          selectedProducts: nextProducts,
          hotels: [INITIAL_HOTEL(client)],
        };
      }

      // If selecting seguros_viaje for the first time
      if (id === "seguros_viaje" && isSelecting && prev.insurances.length === 0) {
        const client = data.clients.find((c: any) => c.name === prev.clientId);
        return {
          ...prev,
          selectedProducts: nextProducts,
          insurances: [INITIAL_INSURANCE(client)],
        };
      }

      // If selecting planes for the first time
      if (id === "planes" && isSelecting && prev.plans.length === 0) {
        const client = data.clients.find((c: any) => c.name === prev.clientId);
        return {
          ...prev,
          selectedProducts: nextProducts,
          plans: [INITIAL_PLAN(client)],
        };
      }

      return {
        ...prev,
        selectedProducts: nextProducts,
      };
    });

    if (id === "tiqueteria" && !form.selectedProducts.includes(id)) {
      setShowTicketForm(true);
      setCurrentTicketIdx(0);
    }
    if (id === "hoteleria" && !form.selectedProducts.includes(id)) {
      setShowHotelForm(true);
      setCurrentHotelIdx(0);
    }
    if (id === "seguros_viaje" && !form.selectedProducts.includes(id)) {
      setShowInsuranceForm(true);
      setCurrentInsuranceIdx(0);
    }
    if (id === "planes" && !form.selectedProducts.includes(id)) {
      setShowPlanForm(true);
      setCurrentPlanIdx(0);
    }
  };

  /* ---- validation ------------------------------------------------ */
  const validateStep = (s: number): boolean => {
    const errs: Record<string, string> = {};
    if (s === 1) {
      if (!form.clientId) errs.clientId = "Selecciona un cliente";
    }
    if (s === 2) {
      if (form.selectedProducts.length === 0)
        errs.products = "Selecciona al menos un producto";
    }
    if (s === 3) {
      if (!form.total || Number(form.total) <= 0)
        errs.total = "Ingresa el valor total";
      if (!form.paymentMethod) errs.paymentMethod = "Selecciona forma de pago";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    if (step === 2) {
      if (form.tickets.length > 0 || form.hotels.length > 0 || form.insurances.length > 0 || form.plans.length > 0) {
        const totalSupplier = 
          form.tickets.reduce((acc, t) => acc + Number(t.supplierCost || 0), 0) +
          form.hotels.reduce((acc, h) => acc + Number(h.supplierCost || 0), 0) +
          form.insurances.reduce((acc, i) => acc + Number(i.supplierCost || 0), 0) +
          form.plans.reduce((acc, p) => acc + Number(p.supplierCost || 0), 0);
        
        const totalTa = 
          form.tickets.reduce((acc, t) => acc + Number(t.ta || 0), 0) +
          form.hotels.reduce((acc, h) => acc + Number(h.ta || 0), 0) +
          form.insurances.reduce((acc, i) => acc + Number(i.ta || 0), 0) +
          form.plans.reduce((acc, p) => acc + Number(p.ta || 0), 0);

        const finalTotal = totalSupplier + totalTa;

        setForm((prev) => ({
          ...prev,
          supplierCost: totalSupplier.toString(),
          ta: totalTa.toString(),
          total: finalTotal.toString(),
        }));
      }
    }
    setStep((s) => Math.min(s + 1, 3));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  /* ---- submit ---------------------------------------------------- */
  const handleSubmit = () => {
    if (!validateStep(3)) return;
    const client = data.clients.find((c: any) => c.name === form.clientId);
    if (!client) {
      setErrors({ ...errors, clientId: "El cliente no es válido" });
      setStep(1);
      return;
    }

    const productLabels = form.selectedProducts
      .map((id) => {
        const p = SALE_PRODUCTS.find((sp) => sp.id === id);
        return p ? `${p.icon} ${p.label}` : id;
      })
      .join("\n");

    const fullObservations = [productLabels, form.observations]
      .filter(Boolean)
      .join("\n---\n");

    const saleData: Omit<Sale, "id"> = {
      clientId: Number(form.clientId),
      clientName: client.name,
      vendorId: user!.id,
      vendorName: user!.name,
      date: new Date().toISOString().split("T")[0],
      total: Number(form.total),
      paymentMethod: form.paymentMethod,
      status: form.status as Sale["status"],
      observations: fullObservations,
      products: form.selectedProducts,
      ticketData: form.tickets.length > 0 ? form.tickets : undefined,
      hotelData: form.hotels.length > 0 ? form.hotels : undefined,
      insuranceData: form.insurances.length > 0 ? form.insurances : undefined,
      planData: form.plans.length > 0 ? form.plans : undefined,
      isCredit: form.isCredit,
      creditDueDate: form.isCredit ? form.creditDueDate : undefined,
      commissionAgent: form.commissionAgent,
      commissionAmount: Number(form.commissionAmount) || 0,
      commissionPaymentMethod: form.commissionPaymentMethod,
      ta: Number(form.ta) || 0,
      supplierCost: Number(form.supplierCost) || 0,
    };

    addSale(saleData as any);
    onSuccess("Venta registrada exitosamente");
    onClose();
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Main Content Container with transition */}
      {showTicketForm ? (
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {renderTicketForm()}
        </div>
      ) : showHotelForm ? (
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {renderHotelForm()}
        </div>
      ) : showInsuranceForm ? (
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {renderInsuranceForm()}
        </div>
      ) : showPlanForm ? (
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {renderPlanForm()}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        {showTicketForm ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowTicketForm(false);
                setCurrentTicketIdx(null);
              }}
            >
              Regresar
            </Button>
            <Button
              onClick={() => {
                setShowTicketForm(false);
                setCurrentTicketIdx(null);
              }}
            >
              Confirmar y Continuar
            </Button>
          </>
        ) : showHotelForm ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowHotelForm(false);
                setCurrentHotelIdx(null);
              }}
            >
              Regresar
            </Button>
            <Button
              onClick={() => {
                setShowHotelForm(false);
                setCurrentHotelIdx(null);
              }}
            >
              Confirmar y Continuar
            </Button>
          </>
        ) : showInsuranceForm ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowInsuranceForm(false);
                setCurrentInsuranceIdx(null);
              }}
            >
              Regresar
            </Button>
            <Button
              onClick={() => {
                setShowInsuranceForm(false);
                setCurrentInsuranceIdx(null);
              }}
            >
              Confirmar y Continuar
            </Button>
          </>
        ) : showPlanForm ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowPlanForm(false);
                setCurrentPlanIdx(null);
              }}
            >
              Regresar
            </Button>
            <Button
              onClick={() => {
                setShowPlanForm(false);
                setCurrentPlanIdx(null);
              }}
            >
              Confirmar y Continuar
            </Button>
          </>
        ) : (
          <>
            <div>
              {step > 1 && (
                <Button variant="outline" onClick={goBack}>
                  <ChevronLeft size={16} />
                  Anterior
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              {step < 3 ? (
                <Button onClick={goNext}>
                  Siguiente
                  <ChevronRight size={16} />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  <Check size={16} />
                  Guardar Venta
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  /* ================================================================ */
  /*  Sub-Renders                                                     */
  /* ================================================================ */
  function renderStep1() {
    return (
      <div className="animate-fade-in space-y-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-primary text-base">
              Cliente y Comisionista
            </h3>
            <p className="text-xs text-gray-500">
              Selecciona el cliente y los datos del comisionista si aplica.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Cliente *" error={errors.clientId}>
            <Combobox
              value={form.clientId}
              onChange={(val) => set("clientId", val)}
              options={data.clients
                .filter((c: any) => c.status === "active")
                .map((c: any) => ({
                  value: c.name,
                  label: c.name,
                }))}
              placeholder="Seleccionar o escribir nombre..."
              error={errors.clientId}
            />
          </FormField>

          <FormField label="Comisionista">
            <Combobox
              value={form.commissionAgent || ""}
              onChange={(val) => set("commissionAgent", val)}
              options={[
                { value: "Agencia Viajes Plus", label: "Agencia Viajes Plus" },
                { value: "Asesor Independiente", label: "Asesor Independiente" },
                { value: "Ventas Directas Web", label: "Ventas Directas Web" },
                { value: "Referido por Cliente", label: "Referido por Cliente" },
                { value: "Alianza Corporativa", label: "Alianza Corporativa" },
                { value: "Referido Familiar", label: "Referido Familiar" },
                { value: "Aliado Comercial", label: "Aliado Comercial" },
              ]}
              placeholder="Escribe o selecciona..."
            />
          </FormField>

          <FormField label="Valor Comisión">
            <Input
              type="number"
              value={form.commissionAmount}
              onChange={(e) => set("commissionAmount", e.target.value)}
              placeholder="0"
            />
          </FormField>

          <FormField label="Forma de Pago Comisión">
            <Select
              value={form.commissionPaymentMethod}
              onChange={(e) =>
                set("commissionPaymentMethod", e.target.value)
              }
              options={[
                { value: "", label: "No aplica / Pendiente" },
                ...data.config.paymentMethods.map((p) => ({
                  value: p.name,
                  label: p.name,
                })),
              ]}
            />
          </FormField>
        </div>

        {/* Client preview card */}
        {form.clientId && (() => {
          const client = data.clients.find(
            (c: any) => c.name === form.clientId,
          );
          if (!client) return null;
          return (
            <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <img
                src={client.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${client.firstName}`}
                alt={client.name}
                className="w-12 h-12 rounded-full bg-gray-100"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-sm truncate">
                  {client.name}
                </p>
                <p className="text-xs text-gray-500">
                  {client.docType} {client.docNumber} · {client.email}
                </p>
              </div>
            </div>
          );
        })()}
      </div>
    );
  }

  function renderStep2() {
    return (
      <div className="animate-fade-in space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ShoppingBag size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-primary text-base">
              Productos y Servicios
            </h3>
            <p className="text-xs text-gray-500">
              Selecciona los productos que el cliente desea adquirir.
            </p>
          </div>
        </div>

        {errors.products && (
          <p className="text-sm text-red-500 font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-100">
            {errors.products}
          </p>
        )}

        {/* Main products */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Servicios Principales
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {mainProducts.map((product) => {
              const selected = form.selectedProducts.includes(product.id);
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => toggleProduct(product.id)}
                  className={`
                    relative flex flex-col items-center gap-0 p-0 rounded-2xl border-2 overflow-hidden
                    transition-all duration-300 group h-full
                    ${selected
                      ? "border-primary bg-primary/5 shadow-xl shadow-primary/10 ring-4 ring-primary/10"
                      : "border-gray-100 bg-white hover:border-primary/40 hover:shadow-lg"
                    }
                  `}
                >
                  <div className="w-full aspect-[4/3] bg-gray-50 overflow-hidden relative">
                    {PRODUCT_IMAGES[product.id] ? (
                      <img
                        src={PRODUCT_IMAGES[product.id]}
                        alt={product.label}
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${selected ? "scale-105" : ""}`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-primary/40">
                        <ProductIcon name={product.icon} size={48} />
                      </div>
                    )}
                    {selected && (
                      <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                        <div className="bg-primary text-white rounded-full p-2 shadow-lg scale-125 animate-bounce-subtle">
                          <Check size={20} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4 text-center w-full">
                    <span
                      className={`font-bold text-sm block mb-1 ${
                        selected ? "text-primary" : "text-gray-800"
                      }`}
                    >
                      {product.label}
                    </span>
                    <p className="text-[10px] text-gray-500 leading-tight">
                      {product.id === "tiqueteria" && "Vuelos nacionales e internacionales"}
                      {product.id === "hoteleria" && "Planes de hoteles y estadías"}
                      {product.id === "seguros_viaje" && "Momentos felices y seguros"}
                      {product.id === "planes" && "Vacaciones inolvidables"}
                    </p>
                  </div>

                  {selected && (
                    <div className="px-4 pb-4 w-full">
                      {product.id === "tiqueteria" && (
                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {form.tickets.map((_, tIdx) => (
                              <Button
                                key={tIdx}
                                variant={
                                  currentTicketIdx === tIdx
                                    ? "primary"
                                    : "outline"
                                }
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentTicketIdx(tIdx);
                                  setShowTicketForm(true);
                                }}
                                className="h-7 text-[10px]"
                              >
                                Tiquete {tIdx + 1}
                              </Button>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                const client = data.clients.find(
                                  (c: any) => c.name === form.clientId,
                                );
                                const nextTickets = [
                                  ...form.tickets,
                                  INITIAL_TICKET(client),
                                ];
                                set("tickets", nextTickets);
                                setCurrentTicketIdx(nextTickets.length - 1);
                                setShowTicketForm(true);
                              }}
                              className="h-7 text-[10px] border-dashed"
                            >
                              + Añadir
                            </Button>
                          </div>
                        </div>
                      )}

                      {product.id === "hoteleria" && (
                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {form.hotels.map((_, hIdx) => (
                              <Button
                                key={hIdx}
                                variant={
                                  currentHotelIdx === hIdx
                                    ? "primary"
                                    : "outline"
                                }
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentHotelIdx(hIdx);
                                  setShowHotelForm(true);
                                }}
                                className="h-7 text-[10px]"
                              >
                                Estancia {hIdx + 1}
                              </Button>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                const client = data.clients.find(
                                  (c: any) => c.name === form.clientId,
                                );
                                const nextHotels = [
                                  ...form.hotels,
                                  INITIAL_HOTEL(client),
                                ];
                                set("hotels", nextHotels);
                                setCurrentHotelIdx(nextHotels.length - 1);
                                setShowHotelForm(true);
                              }}
                              className="h-7 text-[10px] border-dashed"
                            >
                              + Añadir
                            </Button>
                          </div>
                        </div>
                      )}

                      {product.id === "seguros_viaje" && (
                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {form.insurances.map((_, sIdx) => (
                              <Button
                                key={sIdx}
                                variant={
                                  currentInsuranceIdx === sIdx
                                    ? "primary"
                                    : "outline"
                                }
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentInsuranceIdx(sIdx);
                                  setShowInsuranceForm(true);
                                }}
                                className="h-7 text-[10px]"
                              >
                                Seguro {sIdx + 1}
                              </Button>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                const client = data.clients.find(
                                  (c: any) => c.name === form.clientId,
                                );
                                const nextInsurances = [
                                  ...form.insurances,
                                  INITIAL_INSURANCE(client),
                                ];
                                set("insurances", nextInsurances);
                                setCurrentInsuranceIdx(nextInsurances.length - 1);
                                setShowInsuranceForm(true);
                              }}
                              className="h-7 text-[10px] border-dashed"
                            >
                              + Añadir
                            </Button>
                          </div>
                        </div>
                      )}

                      {product.id === "planes" && (
                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {form.plans.map((_, pIdx) => (
                              <Button
                                key={pIdx}
                                variant={
                                  currentPlanIdx === pIdx
                                    ? "primary"
                                    : "outline"
                                }
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentPlanIdx(pIdx);
                                  setShowPlanForm(true);
                                }}
                                className="h-7 text-[10px]"
                              >
                                Plan {pIdx + 1}
                              </Button>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                const client = data.clients.find(
                                  (c: any) => c.name === form.clientId,
                                );
                                const nextPlans = [
                                  ...form.plans,
                                  INITIAL_PLAN(client),
                                ];
                                set("plans", nextPlans);
                                setCurrentPlanIdx(nextPlans.length - 1);
                                setShowPlanForm(true);
                              }}
                              className="h-7 text-[10px] border-dashed"
                            >
                              + Añadir
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Other services - collapsible */}
        <div>
          <button
            type="button"
            onClick={() => setShowOtherProducts(!showOtherProducts)}
            className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-primary transition-colors w-full"
          >
            <span className="flex-1 text-left uppercase tracking-wider text-xs">
              Otros Servicios
            </span>
            {showOtherProducts ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>

          {showOtherProducts && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-3 animate-fade-in">
              {otherProducts.map((product) => {
                const selected = form.selectedProducts.includes(product.id);
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => toggleProduct(product.id)}
                    className={`
                      flex items-center gap-2.5 px-3 py-2.5 rounded-lg border
                      transition-all duration-200 text-left
                      ${selected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-gray-200 bg-white hover:border-primary/30"
                      }
                    `}
                  >
                    <span className="text-lg flex-shrink-0">
                      <ProductIcon name={product.icon} size={18} className={selected ? "text-primary" : "text-gray-400"} />
                    </span>
                    <span
                      className={`text-xs font-medium leading-tight ${
                        selected ? "text-primary" : "text-gray-600"
                      }`}
                    >
                      {product.label}
                    </span>
                    {selected && (
                      <Check
                        size={14}
                        className="text-primary ml-auto flex-shrink-0"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderStep3() {
    return (
      <div className="animate-fade-in space-y-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CreditCard size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-primary text-base">
              Observaciones y Pago
            </h3>
            <p className="text-xs text-gray-500">
              Agrega comentarios y configura la forma de pago.
            </p>
          </div>
        </div>

        <FormField label="Observaciones / Comentarios">
          <Textarea
            value={form.observations}
            onChange={(e) => set("observations", e.target.value)}
            placeholder="Detalles adicionales sobre los productos seleccionados..."
            rows={3}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Valor Total *" error={errors.total}>
            <Input
              type="number"
              value={form.total}
              onChange={(e) => set("total", e.target.value)}
              placeholder="0"
              error={errors.total}
            />
          </FormField>

          <FormField
            label="Forma de Pago *"
            error={errors.paymentMethod}
          >
            <Combobox
              value={form.paymentMethod}
              onChange={(val) => set("paymentMethod", val)}
              options={data.config.paymentMethods.map((p: any) => ({
                value: p.name,
                label: p.name,
              }))}
              placeholder="Selecciona o escribe..."
              error={errors.paymentMethod}
            />
          </FormField>

          <FormField label="T.A. (Tarifa Administrativa)">
            <Input
              type="number"
              value={form.ta}
              onChange={(e) => set("ta", e.target.value)}
              placeholder="0"
            />
          </FormField>

          <FormField label="Costo Proveedores">
            <Input
              type="number"
              value={form.supplierCost}
              onChange={(e) => set("supplierCost", e.target.value)}
              placeholder="0"
            />
          </FormField>

          <FormField label="Estado">
            <Combobox
              value={form.status}
              onChange={(val) => set("status", val)}
              options={[
                { value: "pendiente", label: "Pendiente Crédito" },
                { value: "abonado", label: "Completado" },
                { value: "pagado", label: "Finalizado" },
              ]}
            />
          </FormField>
        </div>

        <div className="flex items-center gap-3 py-2 border-t border-gray-border mt-4">
          <input
            type="checkbox"
            id="wizard-isCredit"
            checked={form.isCredit}
            onChange={(e) => set("isCredit", e.target.checked)}
            className="w-4 h-4 rounded border-gray-border text-primary focus:ring-primary"
          />
          <label
            htmlFor="wizard-isCredit"
            className="text-sm font-medium text-gray-700"
          >
            Venta a crédito
          </label>
        </div>

        {form.isCredit && (
          <FormField label="Fecha de Vencimiento">
            <Input
              type="date"
              value={form.creditDueDate}
              onChange={(e) => set("creditDueDate", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </FormField>
        )}

        {/* Summary card */}
        {Number(form.total) > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mt-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Resumen Financiero
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Total
                </p>
                <p className="font-black text-gray-800">
                  ${Number(form.total).toLocaleString("es-CO")}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Proveedores
                </p>
                <p className="font-black text-rose-600">
                  ${(Number(form.supplierCost) || 0).toLocaleString("es-CO")}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Comisión
                </p>
                <p className="font-black text-amber-600">
                  ${(Number(form.commissionAmount) || 0).toLocaleString("es-CO")}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Ganancia
                </p>
                <p className="font-black text-emerald-600">
                  $
                  {(
                    Number(form.total) -
                    (Number(form.supplierCost) || 0) -
                    (Number(form.commissionAmount) || 0)
                  ).toLocaleString("es-CO")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderHotelForm() {
    const idx = currentHotelIdx ?? 0;
    const hotel = form.hotels[idx] || INITIAL_HOTEL();

    const updateHotel = (updates: Partial<HotelData>) => {
      const nextHotels = [...form.hotels];
      nextHotels[idx] = { ...hotel, ...updates };
      set("hotels", nextHotels);
    };

    const addGuest = () => {
      updateHotel({
        guests: [...hotel.guests, { name: "", docType: "CC", docNumber: "" }],
      });
    };

    const removeGuest = (gIdx: number) => {
      updateHotel({
        guests: hotel.guests.filter((_, i) => i !== gIdx),
      });
    };

    const updateGuest = (gIdx: number, gUpdates: Partial<GuestInfo>) => {
      const nextGuests = [...hotel.guests];
      nextGuests[gIdx] = { ...nextGuests[gIdx], ...gUpdates };
      updateHotel({ guests: nextGuests });
    };

    const uniqueCities = Array.from(
      new Set([
        ...data.config.routes.map((r: any) => r.origin),
        ...data.config.routes.map((r: any) => r.destination),
      ]),
    );

    return (
      <div className="space-y-6 animate-fade-in">
        <datalist id="cities-list">
          {uniqueCities.map((city: any) => (
            <option key={city} value={city} />
          ))}
        </datalist>

        {/* 1. Información del Hotel */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <Building2 size={14} /> Detalles de la Estancia
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nombre del Hotel">
              <Input
                value={hotel.hotelName}
                onChange={(e) => updateHotel({ hotelName: e.target.value })}
                placeholder="Ej: Hotel Dann Carlton"
              />
            </FormField>
            <FormField label="Destino">
              <Combobox
                value={hotel.destination}
                onChange={(val) => updateHotel({ destination: val })}
                options={uniqueCities.map((city: any) => ({ value: city, label: city }))}
                placeholder="Ej: Cartagena"
              />
            </FormField>
            <FormField label="Proveedor">
              <Combobox
                value={hotel.supplier}
                onChange={(val) => updateHotel({ supplier: val })}
                options={data.config.suppliers.map((s: any) => ({
                  value: s.name,
                  label: s.name,
                }))}
                placeholder="Ej: Decameron"
              />
            </FormField>
            <FormField label="Número de Reserva">
              <Input
                value={hotel.reservationNumber}
                onChange={(e) =>
                  updateHotel({ reservationNumber: e.target.value })
                }
                placeholder="Código de confirmación"
              />
            </FormField>
            <FormField label="Fecha Inicio (Check-in)">
              <Input
                type="date"
                value={hotel.startDate}
                onChange={(e) => updateHotel({ startDate: e.target.value })}
              />
            </FormField>
            <FormField label="Fecha Fin (Check-out)">
              <Input
                type="date"
                value={hotel.endDate}
                onChange={(e) => updateHotel({ endDate: e.target.value })}
              />
            </FormField>
          </div>
        </div>

        {/* 2. Integrantes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
              <Users size={14} /> Integrantes del Plan
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={addGuest}
              className="h-7 text-[10px]"
            >
              <PlusCircle size={12} className="mr-1" /> Añadir Integrante
            </Button>
          </div>

          <div className="space-y-3">
            {hotel.guests.map((guest, gIdx) => (
              <div
                key={gIdx}
                className="bg-white border border-gray-200 rounded-xl p-4 relative group shadow-sm"
              >
                {hotel.guests.length > 1 && (
                  <button
                    onClick={() => removeGuest(gIdx)}
                    className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <FormField label="Nombre Completo">
                    <Input
                      value={guest.name}
                      onChange={(e) => updateGuest(gIdx, { name: e.target.value })}
                      placeholder="Nombre del pasajero"
                      className="text-xs"
                    />
                  </FormField>
                  <FormField label="Tipo Doc.">
                    <Select
                      value={guest.docType}
                      onChange={(e) => updateGuest(gIdx, { docType: e.target.value })}
                      className="text-xs"
                      options={[
                        { value: "CC", label: "CC" },
                        { value: "TI", label: "TI" },
                        { value: "CE", label: "CE" },
                        { value: "Pasaporte", label: "Pasaporte" },
                      ]}
                    />
                  </FormField>
                  <FormField label="Número Documento">
                    <Input
                      value={guest.docNumber}
                      onChange={(e) => updateGuest(gIdx, { docNumber: e.target.value })}
                      placeholder="12345678"
                      className="text-xs"
                    />
                  </FormField>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Finanzas */}
        <div className="bg-emerald-50/20 p-4 rounded-xl border border-emerald-100">
          <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Briefcase size={14} /> Detalles Financieros
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Valor Pagado al Proveedor">
              <Input
                type="number"
                value={hotel.supplierCost}
                onChange={(e) =>
                  updateHotel({ supplierCost: Number(e.target.value) })
                }
              />
            </FormField>
            <FormField label="Valor TA">
              <Input
                type="number"
                value={hotel.ta}
                onChange={(e) => updateHotel({ ta: Number(e.target.value) })}
              />
            </FormField>
            <FormField label="Método de Pago Proveedor">
              <Combobox
                value={hotel.supplierPaymentMethod}
                onChange={(val) => updateHotel({ supplierPaymentMethod: val })}
                options={data.config.paymentMethods.map((m: any) => ({
                  value: m.name,
                  label: m.name,
                }))}
              />
            </FormField>
          </div>
        </div>
      </div>
    );
  }
  function renderInsuranceForm() {
    const idx = currentInsuranceIdx ?? 0;
    const insurance = form.insurances[idx] || INITIAL_INSURANCE();

    const updateInsurance = (updates: Partial<InsuranceData>) => {
      const nextInsurances = [...form.insurances];
      nextInsurances[idx] = { ...insurance, ...updates };
      set("insurances", nextInsurances);
    };

    const addMember = () => {
      updateInsurance({
        members: [...insurance.members, { name: "", docType: "CC", docNumber: "" }],
      });
    };

    const removeMember = (mIdx: number) => {
      updateInsurance({
        members: insurance.members.filter((_, i) => i !== mIdx),
      });
    };

    const updateMember = (mIdx: number, mUpdates: Partial<GuestInfo>) => {
      const nextMembers = [...insurance.members];
      nextMembers[mIdx] = { ...nextMembers[mIdx], ...mUpdates };
      updateInsurance({ members: nextMembers });
    };

    return (
      <div className="space-y-6 animate-fade-in">
        {/* 1. Información del Contacto */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <Users size={14} /> Información de Contacto
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Nombre del Contacto">
              <Input
                value={insurance.contactName}
                onChange={(e) => updateInsurance({ contactName: e.target.value })}
                placeholder="Ej: Juan Pérez"
              />
            </FormField>
            <FormField label="Número del Contacto">
              <Input
                value={insurance.contactNumber}
                onChange={(e) => updateInsurance({ contactNumber: e.target.value })}
                placeholder="Ej: 3001234567"
              />
            </FormField>
            <FormField label="Dirección">
              <Input
                value={insurance.address}
                onChange={(e) => updateInsurance({ address: e.target.value })}
                placeholder="Ej: Calle 123 # 45-67"
              />
            </FormField>
          </div>
        </div>

        {/* 2. Proveedor y Finanzas */}
        <div className="bg-emerald-50/20 p-4 rounded-xl border border-emerald-100">
          <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Briefcase size={14} /> Proveedor y Finanzas
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Proveedor">
              <Combobox
                value={insurance.supplier}
                onChange={(val) => updateInsurance({ supplier: val })}
                options={data.config.suppliers
                  .filter((s: any) => s.type === "Seguros" || s.type === "General")
                  .map((s: any) => ({
                    value: s.name,
                    label: s.name,
                  }))}
                placeholder="Selecciona el proveedor..."
              />
            </FormField>
            <FormField label="Método de Pago Proveedor">
              <Combobox
                value={insurance.supplierPaymentMethod}
                onChange={(val) => updateInsurance({ supplierPaymentMethod: val })}
                options={data.config.paymentMethods.map((m: any) => ({
                  value: m.name,
                  label: m.name,
                }))}
              />
            </FormField>
            <FormField label="Valor Pagado al Proveedor">
              <Input
                type="number"
                value={insurance.supplierCost}
                onChange={(e) =>
                  updateInsurance({ supplierCost: Number(e.target.value) })
                }
              />
            </FormField>
            <FormField label="Valor TA">
              <Input
                type="number"
                value={insurance.ta}
                onChange={(e) => updateInsurance({ ta: Number(e.target.value) })}
              />
            </FormField>
          </div>
        </div>

        {/* 3. Integrantes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
              <ShoppingBag size={14} /> Integrantes del Seguro
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={addMember}
              className="h-7 text-[10px]"
            >
              <PlusCircle size={12} className="mr-1" /> Añadir Integrante
            </Button>
          </div>

          <div className="space-y-3">
            {insurance.members.map((member, mIdx) => (
              <div
                key={mIdx}
                className="bg-white border border-gray-200 rounded-xl p-4 relative group shadow-sm"
              >
                {insurance.members.length > 1 && (
                  <button
                    onClick={() => removeMember(mIdx)}
                    className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <FormField label="Nombre Completo">
                    <Input
                      value={member.name}
                      onChange={(e) => updateMember(mIdx, { name: e.target.value })}
                      placeholder="Nombre del integrante"
                      className="text-xs"
                    />
                  </FormField>
                  <FormField label="Tipo Doc.">
                    <Select
                      value={member.docType}
                      onChange={(e) => updateMember(mIdx, { docType: e.target.value })}
                      className="text-xs"
                      options={[
                        { value: "CC", label: "CC" },
                        { value: "TI", label: "TI" },
                        { value: "CE", label: "CE" },
                        { value: "Pasaporte", label: "Pasaporte" },
                      ]}
                    />
                  </FormField>
                  <FormField label="Número Documento">
                    <Input
                      value={member.docNumber}
                      onChange={(e) => updateMember(mIdx, { docNumber: e.target.value })}
                      placeholder="12345678"
                      className="text-xs"
                    />
                  </FormField>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderPlanForm() {
    const idx = currentPlanIdx ?? 0;
    const plan = form.plans[idx] || INITIAL_PLAN();

    const updatePlan = (updates: Partial<PlanData>) => {
      const nextPlans = [...form.plans];
      nextPlans[idx] = { ...plan, ...updates };
      set("plans", nextPlans);
    };

    const addGuest = () => {
      updatePlan({
        guests: [...plan.guests, { name: "", docType: "CC", docNumber: "" }],
      });
    };

    const removeGuest = (gIdx: number) => {
      updatePlan({
        guests: plan.guests.filter((_, i) => i !== gIdx),
      });
    };

    const updateGuest = (gIdx: number, gUpdates: Partial<GuestInfo>) => {
      const nextGuests = [...plan.guests];
      nextGuests[gIdx] = { ...nextGuests[gIdx], ...gUpdates };
      updatePlan({ guests: nextGuests });
    };

    return (
      <div className="space-y-6 animate-fade-in">
        {/* 1. Información General del Plan */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <Package size={14} /> Detalles del Plan Vacacional
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nombre del Plan">
              <Input
                value={plan.planName}
                onChange={(e) => updatePlan({ planName: e.target.value })}
                placeholder="Ej: Plan Cancún Todo Incluido"
              />
            </FormField>
            <FormField label="Nombre del Hotel">
              <Input
                value={plan.hotelName}
                onChange={(e) => updatePlan({ hotelName: e.target.value })}
                placeholder="Ej: Riu Palace"
              />
            </FormField>
            <FormField label="Proveedor">
              <Combobox
                value={plan.supplier}
                onChange={(val) => updatePlan({ supplier: val })}
                options={data.config.suppliers.map((s: any) => ({
                  value: s.name,
                  label: s.name,
                }))}
                placeholder="Selecciona el proveedor..."
              />
            </FormField>
            <FormField label="Aerolínea">
              <Combobox
                value={plan.airline}
                onChange={(val) => updatePlan({ airline: val })}
                options={data.config.airlines.map((a: any) => ({
                  value: a.name,
                  label: a.name,
                }))}
                placeholder="Selecciona la aerolínea..."
              />
            </FormField>
          </div>
        </div>

        {/* 2. Detalles de Reserva y Vuelo */}
        <div className="bg-blue-50/20 p-4 rounded-xl border border-blue-100">
          <h4 className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Plane size={14} /> Reservación y Transporte
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Número de Reservación">
              <Input
                value={plan.reservationNumber}
                onChange={(e) => updatePlan({ reservationNumber: e.target.value })}
                placeholder="Código de hotel"
              />
            </FormField>
            <FormField label="Número de Vuelo">
              <Input
                value={plan.flightNumber}
                onChange={(e) => updatePlan({ flightNumber: e.target.value })}
                placeholder="Ej: AV9301"
              />
            </FormField>
            <FormField label="Número de Tiquete">
              <Input
                value={plan.ticketNumber}
                onChange={(e) => updatePlan({ ticketNumber: e.target.value })}
                placeholder="Número de 13 dígitos"
              />
            </FormField>
            <FormField label="Fecha Inicio">
              <Input
                type="date"
                value={plan.startDate}
                onChange={(e) => updatePlan({ startDate: e.target.value })}
              />
            </FormField>
            <FormField label="Fecha Fin">
              <Input
                type="date"
                value={plan.endDate}
                onChange={(e) => updatePlan({ endDate: e.target.value })}
              />
            </FormField>
          </div>
        </div>

        {/* 3. Finanzas */}
        <div className="bg-emerald-50/20 p-4 rounded-xl border border-emerald-100">
          <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Briefcase size={14} /> Detalles Financieros
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Valor Pagado al Proveedor">
              <Input
                type="number"
                value={plan.supplierCost}
                onChange={(e) =>
                  updatePlan({ supplierCost: Number(e.target.value) })
                }
              />
            </FormField>
            <FormField label="Valor TA">
              <Input
                type="number"
                value={plan.ta}
                onChange={(e) => updatePlan({ ta: Number(e.target.value) })}
              />
            </FormField>
            <FormField label="Método de Pago Proveedor">
              <Combobox
                value={plan.supplierPaymentMethod}
                onChange={(val) => updatePlan({ supplierPaymentMethod: val })}
                options={data.config.paymentMethods.map((m: any) => ({
                  value: m.name,
                  label: m.name,
                }))}
              />
            </FormField>
          </div>
        </div>

        {/* 4. Integrantes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
              <Users size={14} /> Integrantes del Plan
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={addGuest}
              className="h-7 text-[10px]"
            >
              <PlusCircle size={12} className="mr-1" /> Añadir Integrante
            </Button>
          </div>

          <div className="space-y-3">
            {plan.guests.map((guest, gIdx) => (
              <div
                key={gIdx}
                className="bg-white border border-gray-200 rounded-xl p-4 relative group shadow-sm"
              >
                {plan.guests.length > 1 && (
                  <button
                    onClick={() => removeGuest(gIdx)}
                    className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <FormField label="Nombre Completo">
                    <Input
                      value={guest.name}
                      onChange={(e) => updateGuest(gIdx, { name: e.target.value })}
                      placeholder="Nombre del pasajero"
                      className="text-xs"
                    />
                  </FormField>
                  <FormField label="Tipo Doc.">
                    <Select
                      value={guest.docType}
                      onChange={(e) => updateGuest(gIdx, { docType: e.target.value })}
                      className="text-xs"
                      options={[
                        { value: "CC", label: "CC" },
                        { value: "TI", label: "TI" },
                        { value: "CE", label: "CE" },
                        { value: "Pasaporte", label: "Pasaporte" },
                      ]}
                    />
                  </FormField>
                  <FormField label="Número Documento">
                    <Input
                      value={guest.docNumber}
                      onChange={(e) => updateGuest(gIdx, { docNumber: e.target.value })}
                      placeholder="12345678"
                      className="text-xs"
                    />
                  </FormField>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }



  function renderTicketForm() {
    const idx = currentTicketIdx ?? 0;
    const ticket = form.tickets[idx] || INITIAL_TICKET();

    const updateTicket = (updates: Partial<TicketData>) => {
      const nextTickets = [...form.tickets];
      nextTickets[idx] = { ...ticket, ...updates };
      set("tickets", nextTickets);
    };

    const updateLeg = (legIdx: number, legUpdates: Partial<FlightLeg>) => {
      const nextLegs = [...ticket.legs];
      nextLegs[legIdx] = { ...nextLegs[legIdx], ...legUpdates };
      updateTicket({ legs: nextLegs });
    };

    const addLeg = () => {
      updateTicket({
        legs: [...ticket.legs, { origin: "", destination: "", flightNumber: "", seat: "", date: "" }],
      });
    };

    const removeLeg = (legIdx: number) => {
      updateTicket({
        legs: ticket.legs.filter((_, i) => i !== legIdx),
      });
    };

    const uniqueCities = Array.from(new Set([
      ...data.config.routes.map((r: any) => r.origin),
      ...data.config.routes.map((r: any) => r.destination)
    ]));

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Datalists for Cities */}
        <datalist id="cities-list">
          {uniqueCities.map((city: any) => (
            <option key={city} value={city} />
          ))}
        </datalist>
        {/* 1. Información General */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <Plane size={14} /> Información del Vuelo
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Aerolínea">
              <Combobox
                value={ticket.airline}
                onChange={(val) => updateTicket({ airline: val })}
                options={data.config.airlines.map((a: any) => ({
                  value: a.name,
                  label: a.name,
                }))}
                placeholder="Ej: Avianca"
              />
            </FormField>
            <FormField label="Proveedor">
              <Combobox
                value={ticket.supplier}
                onChange={(val) => updateTicket({ supplier: val })}
                options={data.config.suppliers.map((s: any) => ({
                  value: s.name,
                  label: s.name,
                }))}
                placeholder="Ej: Viajes Éxito"
              />
            </FormField>
            <FormField label="Número de Reserva">
              <Input
                value={ticket.reservationNumber}
                onChange={(e) => updateTicket({ reservationNumber: e.target.value })}
                placeholder="6 caracteres"
              />
            </FormField>
            <FormField label="Número de Vuelo">
              <Input
                value={ticket.flightNumber}
                onChange={(e) => updateTicket({ flightNumber: e.target.value })}
                placeholder="Ej: AV9301"
              />
            </FormField>
            <FormField label="Fecha de Vuelo">
              <Input
                type="date"
                value={ticket.departureDate}
                onChange={(e) => updateTicket({ departureDate: e.target.value })}
              />
            </FormField>
            <FormField label="Fecha de Aterrizaje">
              <Input
                type="date"
                value={ticket.arrivalDate}
                onChange={(e) => updateTicket({ arrivalDate: e.target.value })}
              />
            </FormField>
          </div>
        </div>

        {/* 2. Trayectos (Multi-leg) */}
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
                      options={uniqueCities.map((city: any) => ({ value: city, label: city }))}
                      placeholder="Ej: BOG"
                      className="text-xs"
                    />
                  </FormField>
                  <FormField label="Destino">
                    <Combobox
                      value={leg.destination}
                      onChange={(val) => updateLeg(lIdx, { destination: val })}
                      options={uniqueCities.map((city: any) => ({ value: city, label: city }))}
                      placeholder="Ej: MDE"
                      className="text-xs"
                    />
                  </FormField>
                  <FormField label="Vuelo">
                    <Input
                      value={leg.flightNumber}
                      onChange={(e) => updateLeg(lIdx, { flightNumber: e.target.value })}
                      placeholder="AV93"
                      className="text-xs"
                    />
                  </FormField>
                  <FormField label="Asiento">
                    <Input
                      value={leg.seat}
                      onChange={(e) => updateLeg(lIdx, { seat: e.target.value })}
                      placeholder="12A"
                      className="text-xs"
                    />
                  </FormField>
                  <FormField label="Fecha">
                    <Input
                      type="date"
                      value={leg.date}
                      onChange={(e) => updateLeg(lIdx, { date: e.target.value })}
                      className="text-xs"
                    />
                  </FormField>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="is-roundtrip"
              checked={ticket.isRoundTrip}
              onChange={(e) => updateTicket({ isRoundTrip: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-primary"
            />
            <label htmlFor="is-roundtrip" className="text-sm font-medium text-gray-700">
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
                    onChange={(val) => updateTicket({ returnLeg: { ...ticket.returnLeg!, origin: val } })}
                    options={uniqueCities.map((city: any) => ({ value: city, label: city }))}
                    placeholder="Ej: MDE"
                    className="text-xs"
                  />
                </FormField>
                <FormField label="Destino Vuelta">
                  <Combobox
                    value={ticket.returnLeg?.destination || ""}
                    onChange={(val) => updateTicket({ returnLeg: { ...ticket.returnLeg!, destination: val } })}
                    options={uniqueCities.map((city: any) => ({ value: city, label: city }))}
                    placeholder="Ej: BOG"
                    className="text-xs"
                  />
                </FormField>
                <FormField label="Vuelo Vuelta">
                  <Input
                    value={ticket.returnLeg?.flightNumber || ""}
                    onChange={(e) => updateTicket({ returnLeg: { ...ticket.returnLeg!, flightNumber: e.target.value } })}
                    placeholder="Ej: AV93"
                    className="text-xs"
                  />
                </FormField>
                <FormField label="Asiento Vuelta">
                  <Input
                    value={ticket.returnLeg?.seat || ""}
                    onChange={(e) => updateTicket({ returnLeg: { ...ticket.returnLeg!, seat: e.target.value } })}
                    placeholder="Ej: 14C"
                    className="text-xs"
                  />
                </FormField>
                <FormField label="Fecha Vuelta">
                  <Input
                    type="date"
                    value={ticket.returnLeg?.date || ""}
                    onChange={(e) => updateTicket({ returnLeg: { ...ticket.returnLeg!, date: e.target.value } })}
                    className="text-xs"
                  />
                </FormField>
              </div>
            </div>
          )}
        </div>

        {/* 3. Detalles de Pasajero */}
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
                <Input
                  value={ticket.ticketNumber}
                  onChange={(e) => updateTicket({ ticketNumber: e.target.value })}
                />
              </FormField>
              <FormField label="Número de Asiento">
                <Input
                  value={ticket.seatNumber}
                  onChange={(e) => updateTicket({ seatNumber: e.target.value })}
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* 4. Finanzas y Otros */}
        <div className="bg-emerald-50/20 p-4 rounded-xl border border-emerald-100">
          <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Briefcase size={14} /> Detalles Financieros y Equipaje
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Valor Pagado al Proveedor">
              <Input
                type="number"
                value={ticket.supplierCost}
                onChange={(e) => updateTicket({ supplierCost: Number(e.target.value) })}
              />
            </FormField>
            <FormField label="Valor TA">
              <Input
                type="number"
                value={ticket.ta}
                onChange={(e) => updateTicket({ ta: Number(e.target.value) })}
              />
            </FormField>
            <FormField label="Método de Pago Proveedor">
              <Select
                value={ticket.supplierPaymentMethod}
                onChange={(e) => updateTicket({ supplierPaymentMethod: e.target.value })}
                options={data.config.paymentMethods.map((m) => ({ value: m.name, label: m.name }))}
              />
            </FormField>
            <FormField label="Plan de Equipaje">
              <Select
                value={ticket.baggagePlan}
                onChange={(e) => updateTicket({ baggagePlan: e.target.value })}
                options={[
                  { value: "", label: "Seleccionar plan..." },
                  ...data.config.baggage.map((b) => ({ value: b.name, label: `${b.name} (${b.maxWeight})` })),
                ]}
              />
            </FormField>
          </div>
        </div>
      </div>
    );
  }
}

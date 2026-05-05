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
  ShieldCheck,
} from "lucide-react";
import { FormField, Input, Select, Textarea } from "../ui/Form";
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
  Guest,
  InsuranceData,
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
  guests: client ? [{
    name: client.name,
    docType: client.docType,
    docNumber: client.docNumber
  }] : [],
});

const INITIAL_INSURANCE = (client?: any): InsuranceData => ({
  contactName: "",
  contactNumber: "",
  address: "",
  supplier: "",
  supplierCost: 0,
  ta: 0,
  supplierPaymentMethod: "Efectivo",
  members: client ? [{
    name: client.name,
    docType: client.docType,
    docNumber: client.docNumber
  }] : [],
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

/* ================================================================== */
/*  Component                                                          */
/* ================================================================== */
export default function NewSaleWizard({ onClose, onSuccess }: Props) {
  const { data, addSale } = useData();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<WizardFormData>(INITIAL_FORM);
  const [showOtherProducts, setShowOtherProducts] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ---- helpers --------------------------------------------------- */
  const set = <K extends keyof WizardFormData>(
    key: K,
    value: WizardFormData[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleProduct = (id: SaleProductId) => {
    const isSelecting = !form.selectedProducts.includes(id);

    setForm((prev) => {
      const nextProducts = isSelecting
        ? [...prev.selectedProducts, id]
        : prev.selectedProducts.filter((p) => p !== id);

      // Initializers
      let nextTickets = [...prev.tickets];
      let nextHotels = [...prev.hotels];
      let nextInsurances = [...prev.insurances];

      if (isSelecting) {
        const client = data.clients.find((c) => c.id === Number(prev.clientId));
        if (id === "tiqueteria" && prev.tickets.length === 0) {
          nextTickets = [INITIAL_TICKET(client)];
        }
        if (id === "hoteleria" && prev.hotels.length === 0) {
          nextHotels = [INITIAL_HOTEL(client)];
        }
        if (id === "seguros_viaje" && prev.insurances.length === 0) {
          nextInsurances = [INITIAL_INSURANCE(client)];
        }
      }

      return {
        ...prev,
        selectedProducts: nextProducts,
        tickets: nextTickets,
        hotels: nextHotels,
        insurances: nextInsurances,
      };
    });

    if (isSelecting) {
      if (id === "tiqueteria") {
        setShowTicketForm(true);
        setCurrentTicketIdx(0);
      }
      if (id === "hoteleria") {
        setShowHotelForm(true);
        setCurrentHotelIdx(0);
      }
      if (id === "seguros_viaje") {
        setShowInsuranceForm(true);
        setCurrentInsuranceIdx(0);
      }
    }
  };

  const [showTicketForm, setShowTicketForm] = useState(false);
  const [currentTicketIdx, setCurrentTicketIdx] = useState<number | null>(null);

  const [showHotelForm, setShowHotelForm] = useState(false);
  const [currentHotelIdx, setCurrentHotelIdx] = useState<number | null>(null);

  const [showInsuranceForm, setShowInsuranceForm] = useState(false);
  const [currentInsuranceIdx, setCurrentInsuranceIdx] = useState<number | null>(null);

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
      // Auto-calculate totals from tickets for Step 3
      if (form.tickets.length > 0) {
        const totalSupplier = form.tickets.reduce(
          (acc, t) => acc + Number(t.supplierCost || 0),
          0,
        );
        const totalTa = form.tickets.reduce(
          (acc, t) => acc + Number(t.ta || 0),
          0,
        );
        setForm((prev) => ({
          ...prev,
          supplierCost: String(totalSupplier),
          ta: String(totalTa),
          total: String(totalSupplier + totalTa),
        }));
      }
    }
    setStep((s) => Math.min(s + 1, 3));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  /* ---- submit ---------------------------------------------------- */
  const handleSubmit = () => {
    if (!validateStep(3)) return;
    const client = data.clients.find((c) => c.id === Number(form.clientId));
    if (!client) return;

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
      {/* 
          Main Content Container with transition
      */}
      {!showTicketForm && !showHotelForm && !showInsuranceForm ? (
        <div className="flex flex-col h-full animate-fade-in">
          {/* ---- TIMELINE ------------------------------------------------ */}
          <div className="flex items-center justify-center gap-0 px-4 pt-2 pb-6">
            {STEPS.map((s, idx) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isCompleted = step > s.id;
              return (
                <div key={s.id} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (isCompleted) setStep(s.id);
                    }}
                    className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-full
                      font-semibold text-sm transition-all duration-300 cursor-default
                      ${isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                        : isCompleted
                          ? "bg-green-100 text-green-700 cursor-pointer hover:bg-green-200"
                          : "bg-gray-100 text-gray-400"
                      }
                    `}
                  >
                    <span
                      className={`
                        flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold
                        transition-all duration-300
                        ${isActive
                          ? "bg-white/20"
                          : isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-400"
                        }
                      `}
                    >
                      {isCompleted ? <Check size={14} /> : <Icon size={14} />}
                    </span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>

                  {idx < STEPS.length - 1 && (
                    <div className="w-12 h-0.5 mx-1">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          step > s.id ? "bg-green-400" : "bg-gray-200"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ---- STEP CONTENT -------------------------------------------- */}
          <div className="flex-1 min-h-0 overflow-y-auto px-1 custom-scrollbar">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </div>

          {/* ---- FOOTER -------------------------------------------------- */}
          <div className="flex items-center justify-between border-t border-gray-border pt-4 mt-4 px-1">
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
          </div>
        </div>
      ) : showTicketForm ? (
        <div className="flex flex-col h-full animate-fade-in">
          {/* TICKET FORM HEADER */}
          <div className="flex items-center gap-3 mb-6 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
            <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200">
              <Plane size={24} />
            </div>
            <div>
              <h3 className="font-black text-blue-900 text-xl tracking-tight">
                Configuración de Tiquetería
              </h3>
              <p className="text-xs text-blue-600 font-medium">
                Completa los detalles técnicos del vuelo y trayectos.
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowTicketForm(false)}
              className="ml-auto bg-white"
            >
              Regresar
            </Button>
          </div>

          {/* TICKET FORM CONTENT */}
          <div className="flex-1 min-h-0 overflow-y-auto px-1 custom-scrollbar pb-6">
            {renderTicketForm()}
          </div>

          {/* TICKET FORM FOOTER */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
            <p className="text-xs text-gray-500 italic">
              * Todos los datos se guardarán automáticamente al confirmar.
            </p>
            <Button 
              onClick={() => {
                const totalTicketsSupplier = form.tickets.reduce((acc, t) => acc + Number(t.supplierCost || 0), 0);
                const totalHotelsSupplier = form.hotels.reduce((acc, h) => acc + Number(h.supplierCost || 0), 0);
                const totalInsurancesSupplier = form.insurances.reduce((acc, i) => acc + Number(i.supplierCost || 0), 0);
                const totalTicketsTa = form.tickets.reduce((acc, t) => acc + Number(t.ta || 0), 0);
                const totalHotelsTa = form.hotels.reduce((acc, h) => acc + Number(h.ta || 0), 0);
                const totalInsurancesTa = form.insurances.reduce((acc, i) => acc + Number(i.ta || 0), 0);

                const totalS = totalTicketsSupplier + totalHotelsSupplier + totalInsurancesSupplier;
                const totalT = totalTicketsTa + totalHotelsTa + totalInsurancesTa;

                setForm(prev => ({
                  ...prev,
                  supplierCost: String(totalS),
                  ta: String(totalT),
                  total: String(totalS + totalT)
                }));
                setShowTicketForm(false);
              }}
              className="shadow-lg shadow-primary/20"
            >
              Confirmar y Continuar
            </Button>
          </div>
        </div>
      ) : showHotelForm ? (
        <div className="flex flex-col h-full animate-fade-in">
          {/* HOTEL FORM HEADER */}
          <div className="flex items-center gap-3 mb-6 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
            <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-200">
              <Building2 size={24} />
            </div>
            <div>
              <h3 className="font-black text-emerald-900 text-xl tracking-tight">
                Configuración de Hotelería
              </h3>
              <p className="text-xs text-emerald-600 font-medium">
                Detalla la estadía, hotel y lista de huéspedes.
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowHotelForm(false)}
              className="ml-auto bg-white"
            >
              Regresar
            </Button>
          </div>

          {/* HOTEL FORM CONTENT */}
          <div className="flex-1 min-h-0 overflow-y-auto px-1 custom-scrollbar pb-6">
            {renderHotelForm()}
          </div>

          {/* HOTEL FORM FOOTER */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
            <p className="text-xs text-gray-500 italic">
              * Los huéspedes predeterminados son los datos del cliente principal.
            </p>
            <Button 
              onClick={() => {
                const totalTicketsSupplier = form.tickets.reduce((acc, t) => acc + Number(t.supplierCost || 0), 0);
                const totalHotelsSupplier = form.hotels.reduce((acc, h) => acc + Number(h.supplierCost || 0), 0);
                const totalInsurancesSupplier = form.insurances.reduce((acc, i) => acc + Number(i.supplierCost || 0), 0);
                const totalTicketsTa = form.tickets.reduce((acc, t) => acc + Number(t.ta || 0), 0);
                const totalHotelsTa = form.hotels.reduce((acc, h) => acc + Number(h.ta || 0), 0);
                const totalInsurancesTa = form.insurances.reduce((acc, i) => acc + Number(i.ta || 0), 0);

                const totalS = totalTicketsSupplier + totalHotelsSupplier + totalInsurancesSupplier;
                const totalT = totalTicketsTa + totalHotelsTa + totalInsurancesTa;

                setForm(prev => ({
                  ...prev,
                  supplierCost: String(totalS),
                  ta: String(totalT),
                  total: String(totalS + totalT)
                }));
                setShowHotelForm(false);
              }}
              className="shadow-lg shadow-primary/20"
            >
              Confirmar y Continuar
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full animate-fade-in">
          {/* INSURANCE FORM HEADER */}
          <div className="flex items-center gap-3 mb-6 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
            <div className="p-3 bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-200">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-black text-blue-900 text-xl tracking-tight">
                Configuración de Seguros de Viaje
              </h3>
              <p className="text-xs text-blue-600 font-medium">
                Registra beneficiarios, proveedor y contacto de emergencia.
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowInsuranceForm(false)}
              className="ml-auto bg-white"
            >
              Regresar
            </Button>
          </div>

          {/* INSURANCE FORM CONTENT */}
          <div className="flex-1 min-h-0 overflow-y-auto px-1 custom-scrollbar pb-6">
            {renderInsuranceForm()}
          </div>

          {/* INSURANCE FORM FOOTER */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
            <p className="text-xs text-gray-500 italic">
              * Los asegurados predeterminados son los datos del cliente principal.
            </p>
            <Button 
              onClick={() => {
                const totalTicketsSupplier = form.tickets.reduce((acc, t) => acc + Number(t.supplierCost || 0), 0);
                const totalHotelsSupplier = form.hotels.reduce((acc, h) => acc + Number(h.supplierCost || 0), 0);
                const totalInsurancesSupplier = form.insurances.reduce((acc, i) => acc + Number(i.supplierCost || 0), 0);
                const totalTicketsTa = form.tickets.reduce((acc, t) => acc + Number(t.ta || 0), 0);
                const totalHotelsTa = form.hotels.reduce((acc, h) => acc + Number(h.ta || 0), 0);
                const totalInsurancesTa = form.insurances.reduce((acc, i) => acc + Number(i.ta || 0), 0);

                const totalS = totalTicketsSupplier + totalHotelsSupplier + totalInsurancesSupplier;
                const totalT = totalTicketsTa + totalHotelsTa + totalInsurancesTa;

                setForm(prev => ({
                  ...prev,
                  supplierCost: String(totalS),
                  ta: String(totalT),
                  total: String(totalS + totalT)
                }));
                setShowInsuranceForm(false);
              }}
              className="shadow-lg shadow-primary/20"
            >
              Confirmar y Continuar
            </Button>
          </div>
        </div>
      )}
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
            <Select
              value={form.clientId}
              onChange={(e) => set("clientId", e.target.value)}
              error={errors.clientId}
              options={[
                { value: "", label: "Seleccionar cliente..." },
                ...data.clients
                  .filter((c) => c.status === "active")
                  .map((c) => ({
                    value: String(c.id),
                    label: c.name,
                  })),
              ]}
            />
          </FormField>

          <FormField label="Comisionista">
            <Input
              type="text"
              list="commission-agents"
              value={form.commissionAgent}
              onChange={(e) => set("commissionAgent", e.target.value)}
              placeholder="Escribe o selecciona..."
            />
            <datalist id="commission-agents">
              <option value="Agencia Viajes Plus" />
              <option value="Asesor Independiente" />
              <option value="Ventas Directas Web" />
              <option value="Referido Familiar" />
              <option value="Aliado Comercial" />
            </datalist>
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
            (c) => c.id === Number(form.clientId),
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
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        {product.icon}
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

                  {product.id === "tiqueteria" && selected && (
                    <div className="px-4 pb-4 w-full">
                      <Button
                        size="sm"
                        variant="primary"
                        className="w-full text-[10px] py-1 h-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowTicketForm(true);
                          setCurrentTicketIdx(0);
                        }}
                      >
                        Configurar Tiquete
                      </Button>
                    </div>
                  )}

                  {product.id === "hoteleria" && selected && (
                    <div className="px-4 pb-4 w-full">
                      <Button
                        size="sm"
                        variant="primary"
                        className="w-full text-[10px] py-1 h-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowHotelForm(true);
                          setCurrentHotelIdx(0);
                        }}
                      >
                        Configurar Hotel
                      </Button>
                    </div>
                  )}

                  {product.id === "seguros_viaje" && selected && (
                    <div className="px-4 pb-4 w-full">
                      <Button
                        size="sm"
                        variant="primary"
                        className="w-full text-[10px] py-1 h-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowInsuranceForm(true);
                          setCurrentInsuranceIdx(0);
                        }}
                      >
                        Configurar Seguro
                      </Button>
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
                      {product.icon}
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

        {/* Configured tickets list */}
        {form.tickets.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Tiquetes Configurados ({form.tickets.length})
            </p>
            {form.tickets.map((t, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between group animate-fade-in"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Plane size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">
                      {t.airline || "Aerolínea no definida"} - {t.flightNumber}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t.legs[0]?.origin} → {t.legs[t.legs.length - 1]?.destination} · {t.departureDate}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCurrentTicketIdx(idx);
                      setShowTicketForm(true);
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 border-red-100 hover:bg-red-50"
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        tickets: prev.tickets.filter((_, i) => i !== idx),
                      }));
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full border-dashed"
              onClick={() => {
                const client = data.clients.find((c) => c.id === Number(form.clientId));
                setForm((prev) => ({
                  ...prev,
                  tickets: [...prev.tickets, INITIAL_TICKET(client)],
                }));
                setCurrentTicketIdx(form.tickets.length);
                setShowTicketForm(true);
              }}
            >
              <PlusCircle size={14} className="mr-2" />
              Agregar otro tiquete
            </Button>
          </div>
        )}

        {/* Configured hotels list */}
        {form.hotels.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Hoteles Configurados ({form.hotels.length})
            </p>
            {form.hotels.map((h, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between group animate-fade-in"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">
                      {h.hotelName || "Hotel no definido"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {h.destination} · {h.startDate} al {h.endDate}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCurrentHotelIdx(idx);
                      setShowHotelForm(true);
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 border-red-100 hover:bg-red-50"
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        hotels: prev.hotels.filter((_, i) => i !== idx),
                      }));
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full border-dashed border-emerald-200 text-emerald-600 hover:bg-emerald-50"
              onClick={() => {
                const client = data.clients.find((c) => c.id === Number(form.clientId));
                setForm((prev) => ({
                  ...prev,
                  hotels: [...prev.hotels, INITIAL_HOTEL(client)],
                }));
                setCurrentHotelIdx(form.hotels.length);
                setShowHotelForm(true);
              }}
            >
              <PlusCircle size={14} className="mr-2" />
              Agregar otro hotel
            </Button>
          </div>
        )}

        {/* Configured insurances list */}
        {form.insurances.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Seguros Configurados ({form.insurances.length})
            </p>
            {form.insurances.map((ins, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between group animate-fade-in"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">
                      {ins.supplier || "Seguro no definido"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {ins.contactName} · {ins.members.length} Asegurados
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCurrentInsuranceIdx(idx);
                      setShowInsuranceForm(true);
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 border-red-100 hover:bg-red-50"
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        insurances: prev.insurances.filter((_, i) => i !== idx),
                      }));
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full border-dashed border-blue-200 text-blue-600 hover:bg-blue-50"
              onClick={() => {
                const client = data.clients.find((c) => c.id === Number(form.clientId));
                setForm((prev) => ({
                  ...prev,
                  insurances: [...prev.insurances, INITIAL_INSURANCE(client)],
                }));
                setCurrentInsuranceIdx(form.insurances.length);
                setShowInsuranceForm(true);
              }}
            >
              <PlusCircle size={14} className="mr-2" />
              Agregar otro seguro
            </Button>
          </div>
        )}
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
            <Select
              value={form.paymentMethod}
              onChange={(e) => set("paymentMethod", e.target.value)}
              error={errors.paymentMethod}
              options={[
                { value: "", label: "Seleccionar..." },
                ...data.config.paymentMethods.map((p) => ({
                  value: p.name,
                  label: p.name,
                })),
              ]}
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
            <Select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
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

  function renderInsuranceForm() {
    const idx = currentInsuranceIdx ?? 0;
    const insurance = form.insurances[idx] || INITIAL_INSURANCE();

    const updateInsurance = (updates: Partial<InsuranceData>) => {
      const nextInsurances = [...form.insurances];
      nextInsurances[idx] = { ...insurance, ...updates };
      set("insurances", nextInsurances);
    };

    const updateMember = (mIdx: number, mUpdates: Partial<Guest>) => {
      const nextMembers = [...insurance.members];
      nextMembers[mIdx] = { ...nextMembers[mIdx], ...mUpdates };
      updateInsurance({ members: nextMembers });
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

    return (
      <div className="space-y-6 animate-fade-in">
        {/* 1. Datos de Contacto de Emergencia */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <User size={14} /> Información de Contacto (Emergencia)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nombre del Contacto">
              <Input
                value={insurance.contactName}
                onChange={(e) => updateInsurance({ contactName: e.target.value })}
                placeholder="Ej: María Pérez"
              />
            </FormField>
            <FormField label="Número del Contacto">
              <Input
                value={insurance.contactNumber}
                onChange={(e) => updateInsurance({ contactNumber: e.target.value })}
                placeholder="Ej: 300 123 4567"
              />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Dirección">
                <Input
                  value={insurance.address}
                  onChange={(e) => updateInsurance({ address: e.target.value })}
                  placeholder="Ej: Calle 123 # 45-67, Bogotá"
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* 2. Integrantes del Seguro */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
              <Users size={14} /> Integrantes Asegurados
            </h4>
            <Button variant="outline" size="sm" onClick={addMember} className="h-7 text-[10px]">
              <PlusCircle size={12} className="mr-1" /> Añadir Integrante
            </Button>
          </div>

          <div className="space-y-3">
            {insurance.members.map((member, mIdx) => (
              <div key={mIdx} className="bg-white border border-gray-200 rounded-xl p-4 relative group shadow-sm">
                {insurance.members.length > 1 && (
                  <button
                    onClick={() => removeMember(mIdx)}
                    className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <FormField label="Nombre Completo">
                    <Input
                      value={member.name}
                      onChange={(e) => updateMember(mIdx, { name: e.target.value })}
                      placeholder="Nombre del asegurado"
                      className="text-xs"
                    />
                  </FormField>
                  <FormField label="Tipo Doc.">
                    <Select
                      value={member.docType}
                      onChange={(e) => updateMember(mIdx, { docType: e.target.value })}
                      options={[
                        { value: "CC", label: "Cédula de Ciudadanía" },
                        { value: "CE", label: "Cédula de Extranjería" },
                        { value: "PA", label: "Pasaporte" },
                        { value: "TI", label: "Tarjeta de Identidad" },
                      ]}
                      className="text-xs"
                    />
                  </FormField>
                  <FormField label="Número Documento">
                    <Input
                      value={member.docNumber}
                      onChange={(e) => updateMember(mIdx, { docNumber: e.target.value })}
                      placeholder="123456789"
                      className="text-xs"
                    />
                  </FormField>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Proveedor y Finanzas */}
        <div className="bg-emerald-50/20 p-4 rounded-xl border border-emerald-100">
          <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Briefcase size={14} /> Detalles Financieros
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Proveedor de Seguro">
              <Input
                list="suppliers-list"
                value={insurance.supplier}
                onChange={(e) => updateInsurance({ supplier: e.target.value })}
                placeholder="Ej: Assist Card"
              />
            </FormField>
            <FormField label="Método de Pago Proveedor">
              <Select
                value={insurance.supplierPaymentMethod}
                onChange={(e) => updateInsurance({ supplierPaymentMethod: e.target.value })}
                options={data.config.paymentMethods.map((m) => ({ value: m.name, label: m.name }))}
              />
            </FormField>
            <FormField label="Valor Pagado al Proveedor">
              <Input
                type="number"
                value={insurance.supplierCost}
                onChange={(e) => updateInsurance({ supplierCost: Number(e.target.value) })}
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

    const updateGuest = (gIdx: number, gUpdates: Partial<Guest>) => {
      const nextGuests = [...hotel.guests];
      nextGuests[gIdx] = { ...nextGuests[gIdx], ...gUpdates };
      updateHotel({ guests: nextGuests });
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

    const uniqueCities = Array.from(new Set([
      ...data.config.routes.map((r: any) => r.origin),
      ...data.config.routes.map((r: any) => r.destination)
    ]));

    return (
      <div className="space-y-6 animate-fade-in">
        <datalist id="hotel-cities">
          {uniqueCities.map((city: any) => <option key={city} value={city} />)}
        </datalist>

        {/* 1. Detalles del Hotel */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <Building2 size={14} /> Información del Alojamiento
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
              <Input
                list="hotel-cities"
                value={hotel.destination}
                onChange={(e) => updateHotel({ destination: e.target.value })}
                placeholder="Ej: Medellín"
              />
            </FormField>
            <FormField label="Proveedor">
              <Input
                list="suppliers-list"
                value={hotel.supplier}
                onChange={(e) => updateHotel({ supplier: e.target.value })}
                placeholder="Ej: Decameron"
              />
            </FormField>
            <FormField label="Número de Reserva">
              <Input
                value={hotel.reservationNumber}
                onChange={(e) => updateHotel({ reservationNumber: e.target.value })}
                placeholder="Código de confirmación"
              />
            </FormField>
            <FormField label="Fecha de Inicio">
              <Input
                type="date"
                value={hotel.startDate}
                onChange={(e) => updateHotel({ startDate: e.target.value })}
              />
            </FormField>
            <FormField label="Fecha de Fin">
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
              <Users size={14} /> Integrantes / Huéspedes
            </h4>
            <Button variant="outline" size="sm" onClick={addGuest} className="h-7 text-[10px]">
              <PlusCircle size={12} className="mr-1" /> Añadir Huésped
            </Button>
          </div>

          <div className="space-y-3">
            {hotel.guests.map((guest, gIdx) => (
              <div key={gIdx} className="bg-white border border-gray-200 rounded-xl p-4 relative group shadow-sm">
                {hotel.guests.length > 1 && (
                  <button
                    onClick={() => removeGuest(gIdx)}
                    className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                      options={[
                        { value: "CC", label: "Cédula de Ciudadanía" },
                        { value: "CE", label: "Cédula de Extranjería" },
                        { value: "PA", label: "Pasaporte" },
                        { value: "TI", label: "Tarjeta de Identidad" },
                      ]}
                      className="text-xs"
                    />
                  </FormField>
                  <FormField label="Número Documento">
                    <Input
                      value={guest.docNumber}
                      onChange={(e) => updateGuest(gIdx, { docNumber: e.target.value })}
                      placeholder="123456789"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Valor Pagado al Proveedor">
              <Input
                type="number"
                value={hotel.supplierCost}
                onChange={(e) => updateHotel({ supplierCost: Number(e.target.value) })}
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
              <Select
                value={hotel.supplierPaymentMethod}
                onChange={(e) => updateHotel({ supplierPaymentMethod: e.target.value })}
                options={data.config.paymentMethods.map((m) => ({ value: m.name, label: m.name }))}
              />
            </FormField>
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
              <Input
                list="airlines-list"
                value={ticket.airline}
                onChange={(e) => updateTicket({ airline: e.target.value })}
                placeholder="Ej: Avianca"
              />
              <datalist id="airlines-list">
                {data.config.airlines.map((a) => (
                  <option key={a.id} value={a.name} />
                ))}
              </datalist>
            </FormField>
            <FormField label="Proveedor">
              <Input
                list="suppliers-list"
                value={ticket.supplier}
                onChange={(e) => updateTicket({ supplier: e.target.value })}
                placeholder="Ej: Viajes Éxito"
              />
              <datalist id="suppliers-list">
                {data.config.suppliers.map((s) => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>
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
                    <Input
                      list="cities-list"
                      value={leg.origin}
                      onChange={(e) => updateLeg(lIdx, { origin: e.target.value })}
                      placeholder="Ej: BOG"
                      className="text-xs"
                    />
                  </FormField>
                  <FormField label="Destino">
                    <Input
                      list="cities-list"
                      value={leg.destination}
                      onChange={(e) => updateLeg(lIdx, { destination: e.target.value })}
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
                  <Input
                    list="cities-list"
                    value={ticket.returnLeg?.origin || ""}
                    onChange={(e) => updateTicket({ returnLeg: { ...ticket.returnLeg!, origin: e.target.value } })}
                    placeholder="Ej: MDE"
                    className="text-xs"
                  />
                </FormField>
                <FormField label="Destino Vuelta">
                  <Input
                    list="cities-list"
                    value={ticket.returnLeg?.destination || ""}
                    onChange={(e) => updateTicket({ returnLeg: { ...ticket.returnLeg!, destination: e.target.value } })}
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

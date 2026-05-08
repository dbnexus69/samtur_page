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
  CheckInData,
  MigrationData,
  SimCardData,
  CarRentalData,
  FincaData,
  TourData,
  ConventionData,
  RestaurantData,
  VisaData,
  PassportData,
  PetServiceData,
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
  checkIns: CheckInData[];
  migrations: MigrationData[];
  simCards: SimCardData[];
  carRentals: CarRentalData[];
  fincas: FincaData[];
  tours: TourData[];
  conventions: ConventionData[];
  restaurants: RestaurantData[];
  visas: VisaData[];
  passports: PassportData[];
  petServices: PetServiceData[];
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

const INITIAL_CHECKIN = (client?: any): CheckInData => ({
  passengerName: client?.name || "",
  docType: client?.docType || "CC",
  docNumber: client?.docNumber || "",
  flightOrReservation: "",
  travelDate: "",
  seat: "",
  baggage: "",
  phone: client?.phone || "",
  specialNeeds: "",
  needsWheelchair: false,
});

const INITIAL_MIGRATION = (client?: any): MigrationData => ({
  passengerName: client?.name || "",
  birthDate: client?.birthDate || "",
  nationality: "",
  passportNumber: "",
  passportExpiry: "",
  destinationCountry: "",
  requestedDocType: "Visa Turismo",
  email: client?.email || "",
});

const INITIAL_SIMCARD = (client?: any): SimCardData => ({
  passengerName: client?.name || "",
  docNumber: client?.docNumber || "",
  destinationCountry: "",
  arrivalDate: "",
  tripDuration: "",
  dataPlan: "",
  simType: "eSIM",
  deliveryMethod: "Correo Electrónico",
  email: client?.email || "",
});

const INITIAL_CAR_RENTAL = (client?: any): CarRentalData => ({
  mainDriver: client?.name || "",
  licenseNumber: "",
  pickupDate: "",
  returnDate: "",
  pickupLocation: "Aeropuerto",
  vehicleCategory: "compacto",
  additionalDrivers: 0,
  insuranceType: "basic",
  guaranteeCreditCard: "",
});

const INITIAL_FINCA = (client?: any): FincaData => ({
  responsibleName: client?.name || "",
  docNumber: client?.docNumber || "",
  checkInDate: "",
  checkOutDate: "",
  adultsCount: 2,
  childrenCount: 0,
  hasPets: false,
  petType: "",
  additionalServices: [],
  phone: client?.phone || "",
});

const INITIAL_TOUR = (client?: any): TourData => ({
  passengerName: client?.name || "",
  selectedTour: "",
  preferredDate: "",
  adultsCount: 2,
  childrenCount: 0,
  childrenAges: "",
  guideLanguage: "español",
  needsTransport: false,
  pickupPoint: "",
  medicalConditions: "",
  phone: client?.phone || "",
});

const INITIAL_CONVENTION = (client?: any): ConventionData => ({
  organization: "",
  contactName: client?.name || "",
  startDate: "",
  endDate: "",
  estimatedAttendance: 0,
  requiredSpace: "sala A",
  eventType: "congreso",
  avEquipment: [],
  hasCatering: false,
  cateringNotes: "",
  email: client?.email || "",
});

const INITIAL_RESTAURANT = (client?: any): RestaurantData => ({
  reservationName: client?.name || "",
  dateTime: "",
  peopleCount: 2,
  tablePreference: "interior",
  menuType: "à la carte",
  dietaryRestrictions: [],
  specialOccasion: "cumpleaños",
  phone: client?.phone || "",
});

const INITIAL_VISA = (client?: any): VisaData => ({
  fullName: client?.name || "",
  birthDate: client?.birthDate || "",
  nationality: "",
  passportNumber: "",
  passportExpiration: "",
  countryApplying: "",
  visaType: "turista",
  estimatedTravelDate: "",
  email: client?.email || "",
});

const INITIAL_PASSPORT = (client?: any): PassportData => ({
  fullName: client?.name || "",
  idNumber: client?.docNumber || "",
  birthDate: client?.birthDate || "",
  residenceCity: "",
  processType: "primera vez",
  estimatedTravelDate: "",
  phone: client?.phone || "",
});

const INITIAL_PET_SERVICE = (client?: any): PetServiceData => ({
  ownerName: client?.name || "",
  petName: "",
  species: "perro",
  breed: "",
  weight: 0,
  size: "mediano",
  travelType: "cabina",
  travelDate: "",
  destinationCountry: "",
  medicalConditions: "",
  phone: client?.phone || "",
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
  checkIns: [],
  migrations: [],
  simCards: [],
  carRentals: [],
  fincas: [],
  tours: [],
  conventions: [],
  restaurants: [],
  visas: [],
  passports: [],
  petServices: [],
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
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [currentCheckInIdx, setCurrentCheckInIdx] = useState<number | null>(null);
  const [showMigrationForm, setShowMigrationForm] = useState(false);
  const [currentMigrationIdx, setCurrentMigrationIdx] = useState<number | null>(null);
  const [showSimCardForm, setShowSimCardForm] = useState(false);
  const [currentSimCardIdx, setCurrentSimCardIdx] = useState<number | null>(null);
  const [showCarRentalForm, setShowCarRentalForm] = useState(false);
  const [currentCarRentalIdx, setCurrentCarRentalIdx] = useState<number | null>(null);
  const [showFincaForm, setShowFincaForm] = useState(false);
  const [currentFincaIdx, setCurrentFincaIdx] = useState<number | null>(null);
  const [showTourForm, setShowTourForm] = useState(false);
  const [currentTourIdx, setCurrentTourIdx] = useState<number | null>(null);
  const [showConventionForm, setShowConventionForm] = useState(false);
  const [currentConventionIdx, setCurrentConventionIdx] = useState<number | null>(null);
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [currentRestaurantIdx, setCurrentRestaurantIdx] = useState<number | null>(null);
  const [showVisaForm, setShowVisaForm] = useState(false);
  const [currentVisaIdx, setCurrentVisaIdx] = useState<number | null>(null);
  const [showPassportForm, setShowPassportForm] = useState(false);
  const [currentPassportIdx, setCurrentPassportIdx] = useState<number | null>(null);
  const [showPetServiceForm, setShowPetServiceForm] = useState(false);
  const [currentPetServiceIdx, setCurrentPetServiceIdx] = useState<number | null>(null);
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

      // If selecting checkin for the first time
      if (id === "checkin" && isSelecting && prev.checkIns.length === 0) {
        const client = data.clients.find((c: any) => c.name === prev.clientId);
        return {
          ...prev,
          selectedProducts: nextProducts,
          checkIns: [INITIAL_CHECKIN(client)],
        };
      }

      // If selecting documentacion_migratoria for the first time
      if (id === "documentacion_migratoria" && isSelecting && prev.migrations.length === 0) {
        const client = data.clients.find((c: any) => c.name === prev.clientId);
        return {
          ...prev,
          selectedProducts: nextProducts,
          migrations: [INITIAL_MIGRATION(client)],
        };
      }

      // If selecting simcard for the first time
      if (id === "simcard" && isSelecting && prev.simCards.length === 0) {
        const client = data.clients.find((c: any) => c.name === prev.clientId);
        return {
          ...prev,
          selectedProducts: nextProducts,
          simCards: [INITIAL_SIMCARD(client)],
        };
      }

      // If selecting renta_vehiculos for the first time
      if (id === "renta_vehiculos" && isSelecting && prev.carRentals.length === 0) {
        const client = data.clients.find((c: any) => c.name === prev.clientId);
        return {
          ...prev,
          selectedProducts: nextProducts,
          carRentals: [INITIAL_CAR_RENTAL(client)],
        };
      }

      // If selecting renta_fincas for the first time
      if (id === "renta_fincas" && isSelecting && prev.fincas.length === 0) {
        const client = data.clients.find((c: any) => c.name === prev.clientId);
        return {
          ...prev,
          selectedProducts: nextProducts,
          fincas: [INITIAL_FINCA(client)],
        };
      }

      // If selecting tours for the first time
      if (id === "tours" && isSelecting && prev.tours.length === 0) {
        const client = data.clients.find((c: any) => c.name === prev.clientId);
        return {
          ...prev,
          selectedProducts: nextProducts,
          tours: [INITIAL_TOUR(client)],
        };
      }

      // If selecting centros_convencion for the first time
      if (id === "centros_convencion" && isSelecting && prev.conventions.length === 0) {
        const client = data.clients.find((c: any) => c.name === prev.clientId);
        return {
          ...prev,
          selectedProducts: nextProducts,
          conventions: [INITIAL_CONVENTION(client)],
        };
      }

      // If selecting restaurantes for the first time
      if (id === "restaurantes" && isSelecting && prev.restaurants.length === 0) {
        const client = data.clients.find((c: any) => c.name === prev.clientId);
        return {
          ...prev,
          selectedProducts: nextProducts,
          restaurants: [INITIAL_RESTAURANT(client)],
        };
      }

      // If selecting visa for the first time
      if (id === "visa" && isSelecting && prev.visas.length === 0) {
        const client = data.clients.find((c: any) => c.name === prev.clientId);
        return {
          ...prev,
          selectedProducts: nextProducts,
          visas: [INITIAL_VISA(client)],
        };
      }

      // If selecting pasaporte for the first time
      if (id === "pasaporte" && isSelecting && prev.passports.length === 0) {
        const client = data.clients.find((c: any) => c.name === prev.clientId);
        return {
          ...prev,
          selectedProducts: nextProducts,
          passports: [INITIAL_PASSPORT(client)],
        };
      }

      // If selecting servicio_mascotas for the first time
      if (id === "servicio_mascotas" && isSelecting && prev.petServices.length === 0) {
        const client = data.clients.find((c: any) => c.name === prev.clientId);
        return {
          ...prev,
          selectedProducts: nextProducts,
          petServices: [INITIAL_PET_SERVICE(client)],
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
      checkInData: form.checkIns.length > 0 ? form.checkIns : undefined,
      migrationData: form.migrations.length > 0 ? form.migrations : undefined,
      simCardData: form.simCards.length > 0 ? form.simCards : undefined,
      carRentalData: form.carRentals.length > 0 ? form.carRentals : undefined,
      fincaData: form.fincas.length > 0 ? form.fincas : undefined,
      tourData: form.tours.length > 0 ? form.tours : undefined,
      conventionData: form.conventions.length > 0 ? form.conventions : undefined,
      restaurantData: form.restaurants.length > 0 ? form.restaurants : undefined,
      visaData: form.visas.length > 0 ? form.visas : undefined,
      passportData: form.passports.length > 0 ? form.passports : undefined,
      petServiceData: form.petServices.length > 0 ? form.petServices : undefined,
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
      ) : showCheckInForm ? (
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {renderCheckInForm()}
        </div>
      ) : showMigrationForm ? (
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {renderMigrationForm()}
        </div>
      ) : showSimCardForm ? (
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {renderSimCardForm()}
        </div>
      ) : showCarRentalForm ? (
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {renderCarRentalForm()}
        </div>
      ) : showFincaForm ? (
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {renderFincaForm()}
        </div>
      ) : showTourForm ? (
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {renderTourForm()}
        </div>
      ) : showConventionForm ? (
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {renderConventionForm()}
        </div>
      ) : showRestaurantForm ? (
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {renderRestaurantForm()}
        </div>
      ) : showVisaForm ? (
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {renderVisaForm()}
        </div>
      ) : showPassportForm ? (
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {renderPassportForm()}
        </div>
      ) : showPetServiceForm ? (
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {renderPetServiceForm()}
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
        ) : showCheckInForm ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowCheckInForm(false);
                setCurrentCheckInIdx(null);
              }}
            >
              Regresar
            </Button>
            <Button
              onClick={() => {
                setShowCheckInForm(false);
                setCurrentCheckInIdx(null);
              }}
            >
              Confirmar y Continuar
            </Button>
          </>
        ) : showMigrationForm ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowMigrationForm(false);
                setCurrentMigrationIdx(null);
              }}
            >
              Regresar
            </Button>
            <Button
              onClick={() => {
                setShowMigrationForm(false);
                setCurrentMigrationIdx(null);
              }}
            >
              Confirmar y Continuar
            </Button>
          </>
        ) : showSimCardForm ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowSimCardForm(false);
                setCurrentSimCardIdx(null);
              }}
            >
              Regresar
            </Button>
            <Button
              onClick={() => {
                setShowSimCardForm(false);
                setCurrentSimCardIdx(null);
              }}
            >
              Confirmar y Continuar
            </Button>
          </>
        ) : showCarRentalForm ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowCarRentalForm(false);
                setCurrentCarRentalIdx(null);
              }}
            >
              Regresar
            </Button>
            <Button
              onClick={() => {
                setShowCarRentalForm(false);
                setCurrentCarRentalIdx(null);
              }}
            >
              Confirmar y Continuar
            </Button>
          </>
        ) : showFincaForm ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowFincaForm(false);
                setCurrentFincaIdx(null);
              }}
            >
              Regresar
            </Button>
            <Button
              onClick={() => {
                setShowFincaForm(false);
                setCurrentFincaIdx(null);
              }}
            >
              Confirmar y Continuar
            </Button>
          </>
        ) : showTourForm ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowTourForm(false);
                setCurrentTourIdx(null);
              }}
            >
              Regresar
            </Button>
            <Button
              onClick={() => {
                setShowTourForm(false);
                setCurrentTourIdx(null);
              }}
            >
              Confirmar y Continuar
            </Button>
          </>
        ) : showConventionForm ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowConventionForm(false);
                setCurrentConventionIdx(null);
              }}
            >
              Regresar
            </Button>
            <Button
              onClick={() => {
                setShowConventionForm(false);
                setCurrentConventionIdx(null);
              }}
            >
              Confirmar y Continuar
            </Button>
          </>
        ) : showRestaurantForm ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowRestaurantForm(false);
                setCurrentRestaurantIdx(null);
              }}
            >
              Regresar
            </Button>
            <Button
              onClick={() => {
                setShowRestaurantForm(false);
                setCurrentRestaurantIdx(null);
              }}
            >
              Confirmar y Continuar
            </Button>
          </>
        ) : showVisaForm ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowVisaForm(false);
                setCurrentVisaIdx(null);
              }}
            >
              Regresar
            </Button>
            <Button
              onClick={() => {
                setShowVisaForm(false);
                setCurrentVisaIdx(null);
              }}
            >
              Confirmar y Continuar
            </Button>
          </>
        ) : showPassportForm ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowPassportForm(false);
                setCurrentPassportIdx(null);
              }}
            >
              Regresar
            </Button>
            <Button
              onClick={() => {
                setShowPassportForm(false);
                setCurrentPassportIdx(null);
              }}
            >
              Confirmar y Continuar
            </Button>
          </>
        ) : showPetServiceForm ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowPetServiceForm(false);
                setCurrentPetServiceIdx(null);
              }}
            >
              Regresar
            </Button>
            <Button
              onClick={() => {
                setShowPetServiceForm(false);
                setCurrentPetServiceIdx(null);
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
                  onClick={() => {
                    const isSelecting = !form.selectedProducts.includes(product.id);
                    toggleProduct(product.id);
                    if (isSelecting) {
                      if (product.id === "tiqueteria") {
                        setCurrentTicketIdx(0);
                        setShowTicketForm(true);
                      } else if (product.id === "hoteleria") {
                        setCurrentHotelIdx(0);
                        setShowHotelForm(true);
                      } else if (product.id === "seguros_viaje") {
                        setCurrentInsuranceIdx(0);
                        setShowInsuranceForm(true);
                      } else if (product.id === "planes") {
                        setCurrentPlanIdx(0);
                        setShowPlanForm(true);
                      }
                    }
                  }}
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
                  <div key={product.id} className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const isSelecting = !form.selectedProducts.includes(product.id);
                        toggleProduct(product.id);
                        if (isSelecting && product.id === "checkin") {
                          setCurrentCheckInIdx(0);
                          setShowCheckInForm(true);
                        } else if (isSelecting && product.id === "documentacion_migratoria") {
                          setCurrentMigrationIdx(0);
                          setShowMigrationForm(true);
                        } else if (isSelecting && product.id === "simcard") {
                          setCurrentSimCardIdx(0);
                          setShowSimCardForm(true);
                        } else if (isSelecting && product.id === "renta_vehiculos") {
                          setCurrentCarRentalIdx(0);
                          setShowCarRentalForm(true);
                        } else if (isSelecting && product.id === "renta_fincas") {
                          setCurrentFincaIdx(0);
                          setShowFincaForm(true);
                        } else if (isSelecting && product.id === "tours") {
                          setCurrentTourIdx(0);
                          setShowTourForm(true);
                        } else if (isSelecting && product.id === "centros_convencion") {
                          setCurrentConventionIdx(0);
                          setShowConventionForm(true);
                        } else if (isSelecting && product.id === "restaurantes") {
                          setCurrentRestaurantIdx(0);
                          setShowRestaurantForm(true);
                        } else if (isSelecting && product.id === "visa") {
                          setCurrentVisaIdx(0);
                          setShowVisaForm(true);
                        } else if (isSelecting && product.id === "pasaporte") {
                          setCurrentPassportIdx(0);
                          setShowPassportForm(true);
                        } else if (isSelecting && product.id === "servicio_mascotas") {
                          setCurrentPetServiceIdx(0);
                          setShowPetServiceForm(true);
                        }
                      }}
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
                    {selected && product.id === "checkin" && (
                      <div className="flex flex-wrap gap-1 px-1">
                        {form.checkIns.map((_, cIdx) => (
                          <button
                            key={cIdx}
                            type="button"
                            onClick={() => {
                              setCurrentCheckInIdx(cIdx);
                              setShowCheckInForm(true);
                            }}
                            className={`px-2 py-0.5 rounded text-[9px] border transition-colors ${
                              currentCheckInIdx === cIdx 
                                ? 'bg-primary text-white border-primary' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'
                            }`}
                          >
                            C-In {cIdx + 1}
                          </button>
                        ))}
                        <button
                           type="button"
                           onClick={() => {
                             const client = data.clients.find((c: any) => c.name === form.clientId);
                             const nextCheckIns = [...form.checkIns, INITIAL_CHECKIN(client)];
                             set("checkIns", nextCheckIns);
                             setCurrentCheckInIdx(nextCheckIns.length - 1);
                             setShowCheckInForm(true);
                           }}
                           className="px-2 py-0.5 rounded text-[9px] border border-dashed border-gray-300 text-gray-500 hover:border-primary/50 hover:text-primary transition-colors"
                        >
                          + Añadir
                        </button>
                      </div>
                    )}

                    {selected && product.id === "documentacion_migratoria" && (
                      <div className="flex flex-wrap gap-1 px-1">
                        {form.migrations.map((_, mIdx) => (
                          <button
                            key={mIdx}
                            type="button"
                            onClick={() => {
                              setCurrentMigrationIdx(mIdx);
                              setShowMigrationForm(true);
                            }}
                            className={`px-2 py-0.5 rounded text-[9px] border transition-colors ${
                              currentMigrationIdx === mIdx 
                                ? 'bg-primary text-white border-primary' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'
                            }`}
                          >
                            Migra {mIdx + 1}
                          </button>
                        ))}
                        <button
                           type="button"
                           onClick={() => {
                             const client = data.clients.find((c: any) => c.name === form.clientId);
                             const nextMigrations = [...form.migrations, INITIAL_MIGRATION(client)];
                             set("migrations", nextMigrations);
                             setCurrentMigrationIdx(nextMigrations.length - 1);
                             setShowMigrationForm(true);
                           }}
                           className="px-2 py-0.5 rounded text-[9px] border border-dashed border-gray-300 text-gray-500 hover:border-primary/50 hover:text-primary transition-colors"
                        >
                          + Añadir
                        </button>
                      </div>
                    )}

                    {selected && product.id === "simcard" && (
                      <div className="flex flex-wrap gap-1 px-1">
                        {form.simCards.map((_, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => {
                              setCurrentSimCardIdx(sIdx);
                              setShowSimCardForm(true);
                            }}
                            className={`px-2 py-0.5 rounded text-[9px] border transition-colors ${
                              currentSimCardIdx === sIdx 
                                ? 'bg-primary text-white border-primary' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'
                            }`}
                          >
                            SIM {sIdx + 1}
                          </button>
                        ))}
                        <button
                           type="button"
                           onClick={() => {
                             const client = data.clients.find((c: any) => c.name === form.clientId);
                             const nextSims = [...form.simCards, INITIAL_SIMCARD(client)];
                             set("simCards", nextSims);
                             setCurrentSimCardIdx(nextSims.length - 1);
                             setShowSimCardForm(true);
                           }}
                           className="px-2 py-0.5 rounded text-[9px] border border-dashed border-gray-300 text-gray-500 hover:border-primary/50 hover:text-primary transition-colors"
                        >
                          + Añadir
                        </button>
                      </div>
                    )}

                    {selected && product.id === "renta_vehiculos" && (
                      <div className="flex flex-wrap gap-1 px-1">
                        {form.carRentals.map((_, rIdx) => (
                          <button
                            key={rIdx}
                            type="button"
                            onClick={() => {
                              setCurrentCarRentalIdx(rIdx);
                              setShowCarRentalForm(true);
                            }}
                            className={`px-2 py-0.5 rounded text-[9px] border transition-colors ${
                              currentCarRentalIdx === rIdx 
                                ? 'bg-primary text-white border-primary' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'
                            }`}
                          >
                            Auto {rIdx + 1}
                          </button>
                        ))}
                        <button
                           type="button"
                           onClick={() => {
                             const client = data.clients.find((c: any) => c.name === form.clientId);
                             const nextCars = [...form.carRentals, INITIAL_CAR_RENTAL(client)];
                             set("carRentals", nextCars);
                             setCurrentCarRentalIdx(nextCars.length - 1);
                             setShowCarRentalForm(true);
                           }}
                           className="px-2 py-0.5 rounded text-[9px] border border-dashed border-gray-300 text-gray-500 hover:border-primary/50 hover:text-primary transition-colors"
                        >
                          + Añadir
                        </button>
                      </div>
                    )}

                    {selected && product.id === "renta_fincas" && (
                      <div className="flex flex-wrap gap-1 px-1">
                        {form.fincas.map((_, fIdx) => (
                          <button
                            key={fIdx}
                            type="button"
                            onClick={() => {
                              setCurrentFincaIdx(fIdx);
                              setShowFincaForm(true);
                            }}
                            className={`px-2 py-0.5 rounded text-[9px] border transition-colors ${
                              currentFincaIdx === fIdx 
                                ? 'bg-primary text-white border-primary' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'
                            }`}
                          >
                            Finca {fIdx + 1}
                          </button>
                        ))}
                        <button
                           type="button"
                           onClick={() => {
                             const client = data.clients.find((c: any) => c.name === form.clientId);
                             const nextFincas = [...form.fincas, INITIAL_FINCA(client)];
                             set("fincas", nextFincas);
                             setCurrentFincaIdx(nextFincas.length - 1);
                             setShowFincaForm(true);
                           }}
                           className="px-2 py-0.5 rounded text-[9px] border border-dashed border-gray-300 text-gray-500 hover:border-primary/50 hover:text-primary transition-colors"
                        >
                          + Añadir
                        </button>
                      </div>
                    )}

                    {selected && product.id === "tours" && (
                      <div className="flex flex-wrap gap-1 px-1">
                        {form.tours.map((_, tIdx) => (
                          <button
                            key={tIdx}
                            type="button"
                            onClick={() => {
                              setCurrentTourIdx(tIdx);
                              setShowTourForm(true);
                            }}
                            className={`px-2 py-0.5 rounded text-[9px] border transition-colors ${
                              currentTourIdx === tIdx 
                                ? 'bg-primary text-white border-primary' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'
                            }`}
                          >
                            Tour {tIdx + 1}
                          </button>
                        ))}
                        <button
                           type="button"
                           onClick={() => {
                             const client = data.clients.find((c: any) => c.name === form.clientId);
                             const nextTours = [...form.tours, INITIAL_TOUR(client)];
                             set("tours", nextTours);
                             setCurrentTourIdx(nextTours.length - 1);
                             setShowTourForm(true);
                           }}
                           className="px-2 py-0.5 rounded text-[9px] border border-dashed border-gray-300 text-gray-500 hover:border-primary/50 hover:text-primary transition-colors"
                        >
                          + Añadir
                        </button>
                      </div>
                    )}

                    {selected && product.id === "centros_convencion" && (
                      <div className="flex flex-wrap gap-1 px-1">
                        {form.conventions.map((_, cIdx) => (
                          <button
                            key={cIdx}
                            type="button"
                            onClick={() => {
                              setCurrentConventionIdx(cIdx);
                              setShowConventionForm(true);
                            }}
                            className={`px-2 py-0.5 rounded text-[9px] border transition-colors ${
                              currentConventionIdx === cIdx 
                                ? 'bg-primary text-white border-primary' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'
                            }`}
                          >
                            Evento {cIdx + 1}
                          </button>
                        ))}
                        <button
                           type="button"
                           onClick={() => {
                             const client = data.clients.find((c: any) => c.name === form.clientId);
                             const nextConvs = [...form.conventions, INITIAL_CONVENTION(client)];
                             set("conventions", nextConvs);
                             setCurrentConventionIdx(nextConvs.length - 1);
                             setShowConventionForm(true);
                           }}
                           className="px-2 py-0.5 rounded text-[9px] border border-dashed border-gray-300 text-gray-500 hover:border-primary/50 hover:text-primary transition-colors"
                        >
                          + Añadir
                        </button>
                      </div>
                    )}

                    {selected && product.id === "restaurantes" && (
                      <div className="flex flex-wrap gap-1 px-1">
                        {form.restaurants.map((_, rIdx) => (
                          <button
                            key={rIdx}
                            type="button"
                            onClick={() => {
                              setCurrentRestaurantIdx(rIdx);
                              setShowRestaurantForm(true);
                            }}
                            className={`px-2 py-0.5 rounded text-[9px] border transition-colors ${
                              currentRestaurantIdx === rIdx 
                                ? 'bg-primary text-white border-primary' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'
                            }`}
                          >
                            Reserva {rIdx + 1}
                          </button>
                        ))}
                        <button
                           type="button"
                           onClick={() => {
                             const client = data.clients.find((c: any) => c.name === form.clientId);
                             const nextRests = [...form.restaurants, INITIAL_RESTAURANT(client)];
                             set("restaurants", nextRests);
                             setCurrentRestaurantIdx(nextRests.length - 1);
                             setShowRestaurantForm(true);
                           }}
                           className="px-2 py-0.5 rounded text-[9px] border border-dashed border-gray-300 text-gray-500 hover:border-primary/50 hover:text-primary transition-colors"
                        >
                          + Añadir
                        </button>
                      </div>
                    )}

                    {selected && product.id === "visa" && (
                      <div className="flex flex-wrap gap-1 px-1">
                        {form.visas.map((_, vIdx) => (
                          <button
                            key={vIdx}
                            type="button"
                            onClick={() => {
                              setCurrentVisaIdx(vIdx);
                              setShowVisaForm(true);
                            }}
                            className={`px-2 py-0.5 rounded text-[9px] border transition-colors ${
                              currentVisaIdx === vIdx 
                                ? 'bg-primary text-white border-primary' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'
                            }`}
                          >
                            Visa {vIdx + 1}
                          </button>
                        ))}
                        <button
                           type="button"
                           onClick={() => {
                             const client = data.clients.find((c: any) => c.name === form.clientId);
                             const nextVisas = [...form.visas, INITIAL_VISA(client)];
                             set("visas", nextVisas);
                             setCurrentVisaIdx(nextVisas.length - 1);
                             setShowVisaForm(true);
                           }}
                           className="px-2 py-0.5 rounded text-[9px] border border-dashed border-gray-300 text-gray-500 hover:border-primary/50 hover:text-primary transition-colors"
                        >
                          + Añadir
                        </button>
                      </div>
                    )}

                    {selected && product.id === "pasaporte" && (
                      <div className="flex flex-wrap gap-1 px-1">
                        {form.passports.map((_, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => {
                              setCurrentPassportIdx(pIdx);
                              setShowPassportForm(true);
                            }}
                            className={`px-2 py-0.5 rounded text-[9px] border transition-colors ${
                              currentPassportIdx === pIdx 
                                ? 'bg-primary text-white border-primary' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'
                            }`}
                          >
                            Pasp. {pIdx + 1}
                          </button>
                        ))}
                        <button
                           type="button"
                           onClick={() => {
                             const client = data.clients.find((c: any) => c.name === form.clientId);
                             const nextPassports = [...form.passports, INITIAL_PASSPORT(client)];
                             set("passports", nextPassports);
                             setCurrentPassportIdx(nextPassports.length - 1);
                             setShowPassportForm(true);
                           }}
                           className="px-2 py-0.5 rounded text-[9px] border border-dashed border-gray-300 text-gray-500 hover:border-primary/50 hover:text-primary transition-colors"
                        >
                          + Añadir
                        </button>
                      </div>
                    )}

                    {selected && product.id === "servicio_mascotas" && (
                      <div className="flex flex-wrap gap-1 px-1">
                        {form.petServices.map((_, psIdx) => (
                          <button
                            key={psIdx}
                            type="button"
                            onClick={() => {
                              setCurrentPetServiceIdx(psIdx);
                              setShowPetServiceForm(true);
                            }}
                            className={`px-2 py-0.5 rounded text-[9px] border transition-colors ${
                              currentPetServiceIdx === psIdx 
                                ? 'bg-primary text-white border-primary' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'
                            }`}
                          >
                            Masc. {psIdx + 1}
                          </button>
                        ))}
                        <button
                           type="button"
                           onClick={() => {
                             const client = data.clients.find((c: any) => c.name === form.clientId);
                             const nextPets = [...form.petServices, INITIAL_PET_SERVICE(client)];
                             set("petServices", nextPets);
                             setCurrentPetServiceIdx(nextPets.length - 1);
                             setShowPetServiceForm(true);
                           }}
                           className="px-2 py-0.5 rounded text-[9px] border border-dashed border-gray-300 text-gray-500 hover:border-primary/50 hover:text-primary transition-colors"
                        >
                          + Añadir
                        </button>
                      </div>
                    )}
                  </div>
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
      new Set(data.config.airports.map((a: any) => a.location)),
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

  function renderCheckInForm() {
    const idx = currentCheckInIdx ?? 0;
    const checkin = form.checkIns[idx] || INITIAL_CHECKIN();

    const updateCheckIn = (updates: Partial<CheckInData>) => {
      const nextCheckIns = [...form.checkIns];
      nextCheckIns[idx] = { ...checkin, ...updates };
      set("checkIns", nextCheckIns);
    };

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <LuIcons.LuBookCheck size={14} /> Información de Check-in
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nombre Completo">
              <Input
                value={checkin.passengerName}
                onChange={(e) => updateCheckIn({ passengerName: e.target.value })}
                placeholder="Nombre del pasajero"
              />
            </FormField>
            <div className="grid grid-cols-3 gap-2">
              <FormField label="Tipo Doc.">
                <Select
                  value={checkin.docType}
                  onChange={(e) => updateCheckIn({ docType: e.target.value })}
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
                  onChange={(e) => updateCheckIn({ docNumber: e.target.value })}
                  placeholder="12345678"
                />
              </FormField>
            </div>
            <FormField label="Número de Vuelo / Reserva">
              <Input
                value={checkin.flightOrReservation}
                onChange={(e) => updateCheckIn({ flightOrReservation: e.target.value })}
                placeholder="Ej: AV9301 o Código"
              />
            </FormField>
            <FormField label="Fecha de Viaje">
              <Input
                type="date"
                value={checkin.travelDate}
                onChange={(e) => updateCheckIn({ travelDate: e.target.value })}
              />
            </FormField>
            <FormField label="Asiento">
              <Input
                value={checkin.seat}
                onChange={(e) => updateCheckIn({ seat: e.target.value })}
                placeholder="Ej: 12A"
              />
            </FormField>
            <FormField label="Equipaje">
              <Input
                value={checkin.baggage}
                onChange={(e) => updateCheckIn({ baggage: e.target.value })}
                placeholder="Ej: 23kg + Morral"
              />
            </FormField>
            <FormField label="Teléfono">
              <Input
                value={checkin.phone}
                onChange={(e) => updateCheckIn({ phone: e.target.value })}
                placeholder="Ej: 3001234567"
              />
            </FormField>
            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="needs-wheelchair"
                checked={checkin.needsWheelchair}
                onChange={(e) => updateCheckIn({ needsWheelchair: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="needs-wheelchair" className="text-sm font-medium text-gray-700">
                Requiere silla de ruedas
              </label>
            </div>
            <FormField label="Necesidades Especiales / Observaciones" className="md:col-span-2">
              <Textarea
                value={checkin.specialNeeds}
                onChange={(e) => updateCheckIn({ specialNeeds: e.target.value })}
                placeholder="Describa cualquier necesidad adicional..."
                rows={2}
              />
            </FormField>
          </div>
        </div>
      </div>
    );
  }


  function renderMigrationForm() {
    const idx = currentMigrationIdx ?? 0;
    const migration = form.migrations[idx] || INITIAL_MIGRATION();

    const updateMigration = (updates: Partial<MigrationData>) => {
      const nextMigrations = [...form.migrations];
      nextMigrations[idx] = { ...migration, ...updates };
      set("migrations", nextMigrations);
    };

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <LuIcons.LuFileText size={14} /> Documentación Migratoria
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nombre Completo">
              <Input
                value={migration.passengerName}
                onChange={(e) => updateMigration({ passengerName: e.target.value })}
                placeholder="Nombre del titular"
              />
            </FormField>
            <FormField label="Fecha de Nacimiento">
              <Input
                type="date"
                value={migration.birthDate}
                onChange={(e) => updateMigration({ birthDate: e.target.value })}
              />
            </FormField>
            <FormField label="Nacionalidad">
              <Input
                value={migration.nationality}
                onChange={(e) => updateMigration({ nationality: e.target.value })}
                placeholder="Ej: Colombiana"
              />
            </FormField>
            <FormField label="Número de Pasaporte">
              <Input
                value={migration.passportNumber}
                onChange={(e) => updateMigration({ passportNumber: e.target.value })}
                placeholder="Ej: AU123456"
              />
            </FormField>
            <FormField label="Vencimiento Pasaporte">
              <Input
                type="date"
                value={migration.passportExpiry}
                onChange={(e) => updateMigration({ passportExpiry: e.target.value })}
              />
            </FormField>
            <FormField label="País de Destino">
              <Input
                value={migration.destinationCountry}
                onChange={(e) => updateMigration({ destinationCountry: e.target.value })}
                placeholder="Ej: Estados Unidos"
              />
            </FormField>
            <FormField label="Tipo de Documento Solicitado">
              <Combobox
                value={migration.requestedDocType}
                onChange={(val) => updateMigration({ requestedDocType: val })}
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
              <Input
                type="email"
                value={migration.email}
                onChange={(e) => updateMigration({ email: e.target.value })}
                placeholder="ejemplo@correo.com"
              />
            </FormField>
          </div>
        </div>
      </div>
    );
  }
  function renderSimCardForm() {
    const idx = currentSimCardIdx ?? 0;
    const sim = form.simCards[idx] || INITIAL_SIMCARD();

    const updateSim = (updates: Partial<SimCardData>) => {
      const nextSims = [...form.simCards];
      nextSims[idx] = { ...sim, ...updates };
      set("simCards", nextSims);
    };

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <LuIcons.LuSmartphone size={14} /> Configuración de SIM Card
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nombre del Titular">
              <Input
                value={sim.passengerName}
                onChange={(e) => updateSim({ passengerName: e.target.value })}
                placeholder="Nombre completo"
              />
            </FormField>
            <FormField label="Número de Documento">
              <Input
                value={sim.docNumber}
                onChange={(e) => updateSim({ docNumber: e.target.value })}
                placeholder="C.C. o Pasaporte"
              />
            </FormField>
            <FormField label="País de Destino">
              <Input
                value={sim.destinationCountry}
                onChange={(e) => updateSim({ destinationCountry: e.target.value })}
                placeholder="Ej: España, USA"
              />
            </FormField>
            <FormField label="Fecha de Llegada">
              <Input
                type="date"
                value={sim.arrivalDate}
                onChange={(e) => updateSim({ arrivalDate: e.target.value })}
              />
            </FormField>
            <FormField label="Duración del Viaje (Días)">
              <Input
                type="number"
                value={sim.tripDuration}
                onChange={(e) => updateSim({ tripDuration: e.target.value })}
                placeholder="Ej: 15"
              />
            </FormField>
            <FormField label="Plan de Datos">
              <Input
                value={sim.dataPlan}
                onChange={(e) => updateSim({ dataPlan: e.target.value })}
                placeholder="Ej: 10GB, Ilimitado"
              />
            </FormField>
            <FormField label="Tipo de SIM">
              <Combobox
                value={sim.simType}
                onChange={(val) => updateSim({ simType: val })}
                options={[
                  { value: "Física", label: "SIM Física (Chip)" },
                  { value: "eSIM", label: "eSIM (Digital)" },
                  { value: "MicroSIM", label: "Micro SIM" },
                  { value: "NanoSIM", label: "Nano SIM" },
                ]}
              />
            </FormField>
            <FormField label="Método de Entrega">
              <Combobox
                value={sim.deliveryMethod}
                onChange={(val) => updateSim({ deliveryMethod: val })}
                options={[
                  { value: "Correo Electrónico", label: "Correo Electrónico (Solo eSIM)" },
                  { value: "Domicilio", label: "Envío a Domicilio" },
                  { value: "Recogida en Oficina", label: "Recogida en Oficina" },
                  { value: "Aeropuerto", label: "Entrega en Aeropuerto" },
                ]}
              />
            </FormField>
            <FormField label="Correo Electrónico" className="md:col-span-2">
              <Input
                type="email"
                value={sim.email}
                onChange={(e) => updateSim({ email: e.target.value })}
                placeholder="ejemplo@correo.com"
              />
            </FormField>
          </div>
        </div>
      </div>
    );
  }

  function renderCarRentalForm() {
    const idx = currentCarRentalIdx ?? 0;
    const car = form.carRentals[idx] || INITIAL_CAR_RENTAL();

    const updateCar = (updates: Partial<CarRentalData>) => {
      const nextCars = [...form.carRentals];
      nextCars[idx] = { ...car, ...updates };
      set("carRentals", nextCars);
    };

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <LuIcons.LuCar size={14} /> Renta de Vehículo
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Conductor Principal *">
              <Input
                value={car.mainDriver}
                onChange={(e) => updateCar({ mainDriver: e.target.value })}
                placeholder="Nombre completo"
              />
            </FormField>
            <FormField label="Nº de Licencia de Conducción *">
              <Input
                value={car.licenseNumber}
                onChange={(e) => updateCar({ licenseNumber: e.target.value })}
                placeholder="Número de licencia"
              />
            </FormField>
            <FormField label="Fecha y Hora de Recogida *">
              <Input
                type="datetime-local"
                value={car.pickupDate}
                onChange={(e) => updateCar({ pickupDate: e.target.value })}
              />
            </FormField>
            <FormField label="Fecha y Hora de Devolución *">
              <Input
                type="datetime-local"
                value={car.returnDate}
                onChange={(e) => updateCar({ returnDate: e.target.value })}
              />
            </FormField>
            <FormField label="Lugar de Recogida *">
              <Combobox
                value={car.pickupLocation}
                onChange={(val) => updateCar({ pickupLocation: val })}
                options={[
                  { value: "aeropuerto", label: "Aeropuerto" },
                  { value: "oficina", label: "Oficina" },
                  { value: "domicilio", label: "Domicilio" },
                ]}
                placeholder="Seleccione lugar..."
              />
            </FormField>
            <FormField label="Categoría de Vehículo *">
              <Combobox
                value={car.vehicleCategory}
                onChange={(val) => updateCar({ vehicleCategory: val })}
                options={[
                  { value: "compacto", label: "Compacto" },
                  { value: "SUV", label: "SUV" },
                  { value: "minivan", label: "Minivan" },
                  { value: "lujo", label: "Lujo" },
                ]}
                placeholder="Seleccione categoría..."
              />
            </FormField>
            <FormField label="Conductores Adicionales">
              <Input
                type="number"
                min={0}
                max={3}
                value={car.additionalDrivers}
                onChange={(e) => updateCar({ additionalDrivers: parseInt(e.target.value) || 0 })}
              />
            </FormField>
            <FormField label="Seguro / Cobertura">
              <Select
                value={car.insuranceType}
                onChange={(e) => updateCar({ insuranceType: e.target.value as any })}
                options={[
                  { value: "basic", label: "Básico" },
                  { value: "all_risk", label: "Todo Riesgo" },
                ]}
              />
            </FormField>
            <FormField label="Tarjeta de Crédito para Garantía *" className="md:col-span-2">
              <Input
                value={car.guaranteeCreditCard}
                onChange={(e) => updateCar({ guaranteeCreditCard: e.target.value })}
                placeholder="Ej: VISA **** 1234"
              />
            </FormField>
          </div>
        </div>
      </div>
    );
  }

  function renderFincaForm() {
    const idx = currentFincaIdx ?? 0;
    const finca = form.fincas[idx] || INITIAL_FINCA();

    const updateFinca = (updates: Partial<FincaData>) => {
      const nextFincas = [...form.fincas];
      nextFincas[idx] = { ...finca, ...updates };
      set("fincas", nextFincas);
    };

    const toggleService = (service: string) => {
      const services = finca.additionalServices.includes(service)
        ? finca.additionalServices.filter(s => s !== service)
        : [...finca.additionalServices, service];
      updateFinca({ additionalServices: services });
    };

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <LuIcons.LuWarehouse size={14} /> Renta de Finca
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nombre del Responsable *">
              <Input
                value={finca.responsibleName}
                onChange={(e) => updateFinca({ responsibleName: e.target.value })}
                placeholder="Nombre completo"
              />
            </FormField>
            <FormField label="Cédula / Pasaporte *">
              <Input
                value={finca.docNumber}
                onChange={(e) => updateFinca({ docNumber: e.target.value })}
                placeholder="Número de identificación"
              />
            </FormField>
            <FormField label="Fecha de Entrada *">
              <Input
                type="date"
                value={finca.checkInDate}
                onChange={(e) => updateFinca({ checkInDate: e.target.value })}
              />
            </FormField>
            <FormField label="Fecha de Salida *">
              <Input
                type="date"
                value={finca.checkOutDate}
                onChange={(e) => updateFinca({ checkOutDate: e.target.value })}
              />
            </FormField>
            <FormField label="Nº de Adultos *">
              <Input
                type="number"
                min={1}
                value={finca.adultsCount}
                onChange={(e) => updateFinca({ adultsCount: parseInt(e.target.value) || 1 })}
              />
            </FormField>
            <FormField label="Nº de Niños">
              <Input
                type="number"
                min={0}
                value={finca.childrenCount}
                onChange={(e) => updateFinca({ childrenCount: parseInt(e.target.value) || 0 })}
              />
            </FormField>
            
            <div className="flex flex-col gap-2 p-3 bg-white rounded-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">¿Viajan mascotas?</span>
                <button
                  type="button"
                  onClick={() => updateFinca({ hasPets: !finca.hasPets })}
                  className={`w-10 h-5 rounded-full transition-colors relative ${finca.hasPets ? 'bg-primary' : 'bg-gray-300 shadow-inner'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${finca.hasPets ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
              {finca.hasPets && (
                <Input
                  value={finca.petType}
                  onChange={(e) => updateFinca({ petType: e.target.value })}
                  placeholder="Tipo de animal (ej: Perro pequeño)"
                  className="mt-1"
                />
              )}
            </div>

            <FormField label="Teléfono *">
              <Input
                type="tel"
                value={finca.phone}
                onChange={(e) => updateFinca({ phone: e.target.value })}
                placeholder="+57 300 123 4567"
              />
            </FormField>

            <div className="md:col-span-2 space-y-3">
              <label className="text-sm font-medium text-gray-700">Servicios Adicionales</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Aseo', 'Chef', 'Piscina Privada', 'Transporte', 'Alimentación', 'Guía Local'].map(service => (
                  <label key={service} className="flex items-center gap-2 p-2 bg-white rounded border border-gray-100 cursor-pointer hover:border-primary/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={finca.additionalServices.includes(service)}
                      onChange={() => toggleService(service)}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-xs text-gray-600">{service}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderTourForm() {
    const idx = currentTourIdx ?? 0;
    const tour = form.tours[idx] || INITIAL_TOUR();

    const updateTour = (updates: Partial<TourData>) => {
      const nextTours = [...form.tours];
      nextTours[idx] = { ...tour, ...updates };
      set("tours", nextTours);
    };

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <LuIcons.LuCompass size={14} /> Configuración de Tour
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nombre Completo *">
              <Input
                value={tour.passengerName}
                onChange={(e) => updateTour({ passengerName: e.target.value })}
                placeholder="Nombre del titular"
              />
            </FormField>
            <FormField label="Tour Seleccionado *">
              <Combobox
                value={tour.selectedTour}
                onChange={(val) => updateTour({ selectedTour: val })}
                options={[
                  { value: "City Tour Bogotá", label: "City Tour Bogotá" },
                  { value: "Salitre Mágico", label: "Salitre Mágico" },
                  { value: "Catedral de Sal Zipaquirá", label: "Catedral de Sal Zipaquirá" },
                  { value: "Guatavita", label: "Guatavita" },
                  { value: "Monserrate", label: "Monserrate" },
                  { value: "Museo del Oro", label: "Museo del Oro" },
                  { value: "Graffiti Tour", label: "Graffiti Tour" },
                ]}
                placeholder="Busque un tour..."
              />
            </FormField>
            <FormField label="Fecha Preferida *">
              <Input
                type="date"
                value={tour.preferredDate}
                onChange={(e) => updateTour({ preferredDate: e.target.value })}
              />
            </FormField>
            <FormField label="Nº de Adultos *">
              <Input
                type="number"
                min={1}
                value={tour.adultsCount}
                onChange={(e) => updateTour({ adultsCount: parseInt(e.target.value) || 1 })}
              />
            </FormField>
            <FormField label="Nº de Niños">
              <Input
                type="number"
                min={0}
                value={tour.childrenCount}
                onChange={(e) => updateTour({ childrenCount: parseInt(e.target.value) || 0 })}
              />
            </FormField>
            <FormField label="Rango de Edades (Niños)">
              <Input
                value={tour.childrenAges}
                onChange={(e) => updateTour({ childrenAges: e.target.value })}
                placeholder="Ej: 5 y 8 años"
                disabled={tour.childrenCount === 0}
              />
            </FormField>
            <FormField label="Idioma del Guía">
              <Combobox
                value={tour.guideLanguage}
                onChange={(val) => updateTour({ guideLanguage: val })}
                options={[
                  { value: "español", label: "Español" },
                  { value: "inglés", label: "Inglés" },
                  { value: "francés", label: "Francés" },
                  { value: "alemán", label: "Alemán" },
                  { value: "otro", label: "Otro" },
                ]}
              />
            </FormField>
            <FormField label="Celular *">
              <Input
                type="tel"
                value={tour.phone}
                onChange={(e) => updateTour({ phone: e.target.value })}
                placeholder="+57 300 123 4567"
              />
            </FormField>

            <div className="flex flex-col gap-2 p-3 bg-white rounded-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">¿Requiere transporte?</span>
                <button
                  type="button"
                  onClick={() => updateTour({ needsTransport: !tour.needsTransport })}
                  className={`w-10 h-5 rounded-full transition-colors relative ${tour.needsTransport ? 'bg-primary' : 'bg-gray-300 shadow-inner'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${tour.needsTransport ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
              {tour.needsTransport && (
                <Input
                  value={tour.pickupPoint}
                  onChange={(e) => updateTour({ pickupPoint: e.target.value })}
                  placeholder="Punto de recogida (Hotel/Dirección)"
                  className="mt-1"
                />
              )}
            </div>

            <FormField label="Condiciones Médicas / Observaciones" className="md:col-span-2">
              <Textarea
                value={tour.medicalConditions}
                onChange={(e) => updateTour({ medicalConditions: e.target.value })}
                placeholder="Alergias, movilidad reducida, etc."
                rows={2}
              />
            </FormField>
          </div>
        </div>
      </div>
    );
  }

  function renderConventionForm() {
    const idx = currentConventionIdx ?? 0;
    const conv = form.conventions[idx] || INITIAL_CONVENTION();

    const updateConv = (updates: Partial<ConventionData>) => {
      const nextConvs = [...form.conventions];
      nextConvs[idx] = { ...conv, ...updates };
      set("conventions", nextConvs);
    };

    const toggleAV = (item: string) => {
      const current = conv.avEquipment;
      const next = current.includes(item) ? current.filter(i => i !== item) : [...current, item];
      updateConv({ avEquipment: next });
    };

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <LuIcons.LuUsers size={14} /> Centro de Convenciones
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Empresa / Organización *">
              <Input
                value={conv.organization}
                onChange={(e) => updateConv({ organization: e.target.value })}
                placeholder="Nombre de la empresa"
              />
            </FormField>
            <FormField label="Nombre del Contacto *">
              <Input
                value={conv.contactName}
                onChange={(e) => updateConv({ contactName: e.target.value })}
                placeholder="Persona responsable"
              />
            </FormField>
            <FormField label="Fecha y Hora Inicio *">
              <Input
                type="datetime-local"
                value={conv.startDate}
                onChange={(e) => updateConv({ startDate: e.target.value })}
              />
            </FormField>
            <FormField label="Fecha y Hora Fin *">
              <Input
                type="datetime-local"
                value={conv.endDate}
                onChange={(e) => updateConv({ endDate: e.target.value })}
              />
            </FormField>
            <FormField label="Aforo Estimado *">
              <Input
                type="number"
                min={1}
                value={conv.estimatedAttendance}
                onChange={(e) => updateConv({ estimatedAttendance: parseInt(e.target.value) || 0 })}
              />
            </FormField>
            <FormField label="Sala / Espacio Requerido *">
              <Combobox
                value={conv.requiredSpace}
                onChange={(val) => updateConv({ requiredSpace: val })}
                options={[
                  { value: "sala A", label: "Sala A" },
                  { value: "sala B", label: "Sala B" },
                  { value: "auditorio", label: "Auditorio" },
                  { value: "terraza", label: "Terraza" },
                ]}
                placeholder="Seleccione espacio..."
              />
            </FormField>
            <FormField label="Tipo de Evento *">
              <Combobox
                value={conv.eventType}
                onChange={(val) => updateConv({ eventType: val })}
                options={[
                  { value: "congreso", label: "Congreso" },
                  { value: "boda", label: "Boda" },
                  { value: "lanzamiento", label: "Lanzamiento" },
                  { value: "taller", label: "Taller / Workshop" },
                  { value: "otro", label: "Otro" },
                ]}
                placeholder="Seleccione tipo..."
              />
            </FormField>
            <FormField label="Correo de Contacto *">
              <Input
                type="email"
                value={conv.email}
                onChange={(e) => updateConv({ email: e.target.value })}
                placeholder="ejemplo@correo.com"
              />
            </FormField>

            <div className="md:col-span-2 space-y-3">
              <label className="text-sm font-medium text-gray-700">Equipos A/V Requeridos</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['Proyector', 'Micrófono', 'Streaming', 'Sonido', 'Iluminación', 'Pantalla LED'].map(item => (
                  <label key={item} className="flex items-center gap-2 p-2 bg-white rounded border border-gray-100 cursor-pointer hover:border-primary/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={conv.avEquipment.includes(item)}
                      onChange={() => toggleAV(item)}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-xs text-gray-600">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col gap-2 p-3 bg-white rounded-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Servicio de Catering</span>
                <button
                  type="button"
                  onClick={() => updateConv({ hasCatering: !conv.hasCatering })}
                  className={`w-10 h-5 rounded-full transition-colors relative ${conv.hasCatering ? 'bg-primary' : 'bg-gray-300 shadow-inner'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${conv.hasCatering ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
              {conv.hasCatering && (
                <Textarea
                  value={conv.cateringNotes}
                  onChange={(e) => updateConv({ cateringNotes: e.target.value })}
                  placeholder="Observaciones de catering (dietas, horarios, etc.)"
                  rows={2}
                  className="mt-1"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderRestaurantForm() {
    const idx = currentRestaurantIdx ?? 0;
    const rest = form.restaurants[idx] || INITIAL_RESTAURANT();

    const updateRest = (updates: Partial<RestaurantData>) => {
      const nextRests = [...form.restaurants];
      nextRests[idx] = { ...rest, ...updates };
      set("restaurants", nextRests);
    };

    const toggleRestriction = (res: string) => {
      const current = rest.dietaryRestrictions;
      const next = current.includes(res) ? current.filter(i => i !== res) : [...current, res];
      updateRest({ dietaryRestrictions: next });
    };

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <LuIcons.LuUtensils size={14} /> Reserva de Restaurante
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nombre de la Reserva *">
              <Input
                value={rest.reservationName}
                onChange={(e) => updateRest({ reservationName: e.target.value })}
                placeholder="A nombre de..."
              />
            </FormField>
            <FormField label="Fecha y Hora *">
              <Input
                type="datetime-local"
                value={rest.dateTime}
                onChange={(e) => updateRest({ dateTime: e.target.value })}
              />
            </FormField>
            <FormField label="Nº de Personas *">
              <Input
                type="number"
                min={1}
                value={rest.peopleCount}
                onChange={(e) => updateRest({ peopleCount: parseInt(e.target.value) || 1 })}
              />
            </FormField>
            <FormField label="Preferencia de Mesa">
              <Combobox
                value={rest.tablePreference}
                onChange={(val) => updateRest({ tablePreference: val })}
                options={[
                  { value: "interior", label: "Interior" },
                  { value: "terraza", label: "Terraza" },
                  { value: "privado", label: "Privado" },
                  { value: "barra", label: "Barra" },
                ]}
                placeholder="Seleccione mesa..."
              />
            </FormField>
            <FormField label="Tipo de Menú">
              <Combobox
                value={rest.menuType}
                onChange={(val) => updateRest({ menuType: val })}
                options={[
                  { value: "à la carte", label: "À la carte" },
                  { value: "menú fijo", label: "Menú Fijo" },
                  { value: "maridaje", label: "Maridaje" },
                ]}
                placeholder="Seleccione menú..."
              />
            </FormField>
            <FormField label="Ocasión Especial">
              <Combobox
                value={rest.specialOccasion}
                onChange={(val) => updateRest({ specialOccasion: val })}
                options={[
                  { value: "cumpleaños", label: "Cumpleaños" },
                  { value: "aniversario", label: "Aniversario" },
                  { value: "cena negocio", label: "Cena de Negocios" },
                  { value: "otro", label: "Otro" },
                ]}
                placeholder="Seleccione ocasión..."
              />
            </FormField>
            <FormField label="Celular *">
              <Input
                type="tel"
                value={rest.phone}
                onChange={(e) => updateRest({ phone: e.target.value })}
                placeholder="+57 300 123 4567"
              />
            </FormField>

            <div className="md:col-span-2 space-y-3">
              <label className="text-sm font-medium text-gray-700">Restricciones Alimentarias</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Vegano', 'Sin Gluten', 'Halal', 'Lactosa', 'Nueces', 'Mariscos'].map(res => (
                  <label key={res} className="flex items-center gap-2 p-2 bg-white rounded border border-gray-100 cursor-pointer hover:border-primary/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={rest.dietaryRestrictions.includes(res)}
                      onChange={() => toggleRestriction(res)}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-xs text-gray-600">{res}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderVisaForm() {
    const idx = currentVisaIdx ?? 0;
    const visa = form.visas[idx] || INITIAL_VISA();

    const updateVisa = (updates: Partial<VisaData>) => {
      const nextVisas = [...form.visas];
      nextVisas[idx] = { ...visa, ...updates };
      set("visas", nextVisas);
    };

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <LuIcons.LuStamp size={14} /> Trámite de Visa
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nombre Completo (como en pasaporte) *">
              <Input
                value={visa.fullName}
                onChange={(e) => updateVisa({ fullName: e.target.value })}
                placeholder="Nombre completo"
              />
            </FormField>
            <FormField label="Fecha de Nacimiento *">
              <Input
                type="date"
                value={visa.birthDate}
                onChange={(e) => updateVisa({ birthDate: e.target.value })}
              />
            </FormField>
            <FormField label="Nacionalidad *">
              <Combobox
                value={visa.nationality}
                onChange={(val) => updateVisa({ nationality: val })}
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
                <Input
                  value={visa.passportNumber}
                  onChange={(e) => updateVisa({ passportNumber: e.target.value })}
                  placeholder="Número"
                />
              </FormField>
              <FormField label="Vencimiento Pasaporte *">
                <Input
                  type="date"
                  value={visa.passportExpiration}
                  onChange={(e) => updateVisa({ passportExpiration: e.target.value })}
                />
              </FormField>
            </div>
            <FormField label="País al que aplica *">
              <Combobox
                value={visa.countryApplying}
                onChange={(val) => updateVisa({ countryApplying: val })}
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
                onChange={(val) => updateVisa({ visaType: val })}
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
              <Input
                type="date"
                value={visa.estimatedTravelDate}
                onChange={(e) => updateVisa({ estimatedTravelDate: e.target.value })}
              />
            </FormField>
            <FormField label="Correo Electrónico *">
              <Input
                type="email"
                value={visa.email}
                onChange={(e) => updateVisa({ email: e.target.value })}
                placeholder="ejemplo@correo.com"
              />
            </FormField>
          </div>
        </div>
      </div>
    );
  }

  function renderPassportForm() {
    const idx = currentPassportIdx ?? 0;
    const pass = form.passports[idx] || INITIAL_PASSPORT();

    const updatePass = (updates: Partial<PassportData>) => {
      const nextPassports = [...form.passports];
      nextPassports[idx] = { ...pass, ...updates };
      set("passports", nextPassports);
    };

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <LuIcons.LuBookOpen size={14} /> Trámite de Pasaporte
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nombre Completo *">
              <Input
                value={pass.fullName}
                onChange={(e) => updatePass({ fullName: e.target.value })}
                placeholder="Nombre completo"
              />
            </FormField>
            <FormField label="Cédula de Ciudadanía *">
              <Input
                value={pass.idNumber}
                onChange={(e) => updatePass({ idNumber: e.target.value })}
                placeholder="Número de documento"
              />
            </FormField>
            <FormField label="Fecha de Nacimiento *">
              <Input
                type="date"
                value={pass.birthDate}
                onChange={(e) => updatePass({ birthDate: e.target.value })}
              />
            </FormField>
            <FormField label="Ciudad de Residencia *">
              <Combobox
                value={pass.residenceCity}
                onChange={(val) => updatePass({ residenceCity: val })}
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
                value={pass.processType}
                onChange={(val) => updatePass({ processType: val })}
                options={[
                  { value: "primera vez", label: "Primera Vez" },
                  { value: "renovacion", label: "Renovación" },
                  { value: "urgente", label: "Urgente" },
                ]}
                placeholder="Seleccione trámite..."
              />
            </FormField>
            <FormField label="Fecha Estimada de Viaje">
              <Input
                type="date"
                value={pass.estimatedTravelDate}
                onChange={(e) => updatePass({ estimatedTravelDate: e.target.value })}
              />
            </FormField>
            <FormField label="Celular *">
              <Input
                type="tel"
                value={pass.phone}
                onChange={(e) => updatePass({ phone: e.target.value })}
                placeholder="+57 300 123 4567"
              />
            </FormField>
          </div>
        </div>
      </div>
    );
  }

  function renderPetServiceForm() {
    const idx = currentPetServiceIdx ?? 0;
    const pet = form.petServices[idx] || INITIAL_PET_SERVICE();

    const updatePet = (updates: Partial<PetServiceData>) => {
      const nextPets = [...form.petServices];
      nextPets[idx] = { ...pet, ...updates };
      set("petServices", nextPets);
    };

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <LuIcons.LuDog size={14} /> Servicio para Mascotas
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nombre del Dueño *">
              <Input
                value={pet.ownerName}
                onChange={(e) => updatePet({ ownerName: e.target.value })}
                placeholder="Responsable"
              />
            </FormField>
            <FormField label="Nombre de la Mascota *">
              <Input
                value={pet.petName}
                onChange={(e) => updatePet({ petName: e.target.value })}
                placeholder="Nombre"
              />
            </FormField>
            <div className="grid grid-cols-2 gap-2">
              <FormField label="Especie *">
                <Combobox
                  value={pet.species}
                  onChange={(val) => updatePet({ species: val })}
                  options={[
                    { value: "perro", label: "Perro" },
                    { value: "gato", label: "Gato" },
                    { value: "ave", label: "Ave" },
                    { value: "otro", label: "Otro" },
                  ]}
                />
              </FormField>
              <FormField label="Raza *">
                <Input
                  value={pet.breed}
                  onChange={(e) => updatePet({ breed: e.target.value })}
                  placeholder="Raza"
                />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <FormField label="Peso (kg) *">
                <Input
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={pet.weight}
                  onChange={(e) => updatePet({ weight: parseFloat(e.target.value) || 0 })}
                />
              </FormField>
              <FormField label="Tamaño *">
                <select
                  value={pet.size}
                  onChange={(e) => updatePet({ size: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm bg-white"
                >
                  <option value="pequeño">Pequeño</option>
                  <option value="mediano">Mediano</option>
                  <option value="grande">Grande</option>
                </select>
              </FormField>
            </div>
            <FormField label="Tipo de Viaje *">
              <Combobox
                value={pet.travelType}
                onChange={(val) => updatePet({ travelType: val })}
                options={[
                  { value: "cabina", label: "Cabina" },
                  { value: "bodega", label: "Bodega" },
                  { value: "traslado terrestre", label: "Traslado Terrestre" },
                ]}
              />
            </FormField>
            <FormField label="Fecha de Viaje *">
              <Input
                type="date"
                value={pet.travelDate}
                onChange={(e) => updatePet({ travelDate: e.target.value })}
              />
            </FormField>
            <FormField label="País de Destino *">
              <Combobox
                value={pet.destinationCountry}
                onChange={(val) => updatePet({ destinationCountry: val })}
                options={[
                  { value: "usa", label: "Estados Unidos" },
                  { value: "españa", label: "España" },
                  { value: "mexico", label: "México" },
                  { value: "canada", label: "Canadá" },
                  { value: "uk", label: "Reino Unido" },
                  { value: "otro", label: "Otro" },
                ]}
                placeholder="Seleccione país..."
              />
            </FormField>
            <FormField label="Celular *">
              <Input
                type="tel"
                value={pet.phone}
                onChange={(e) => updatePet({ phone: e.target.value })}
                placeholder="+57 300 123 4567"
              />
            </FormField>
            <FormField label="Condiciones Médicas / Medicamentos" className="md:col-span-2">
              <Textarea
                value={pet.medicalConditions}
                onChange={(e) => updatePet({ medicalConditions: e.target.value })}
                placeholder="Alergias, tratamientos especiales, etc."
                rows={2}
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

    const uniqueCities = Array.from(new Set(
      data.config.airports.map((a: any) => a.location)
    ));

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
                  ...data.config.baggage.map((b) => ({
                    value: `${b.airlineName} - ${b.fareType}`,
                    label: `${b.airlineName} — ${b.fareType} (Bodega: ${b.checkedBag})`
                  })),
                ]}
              />
            </FormField>
          </div>
        </div>
      </div>
    );
  }
}

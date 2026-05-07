import { LuBookCheck } from "react-icons/lu";

export interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  name: string;
  docType: string;
  docNumber: string;
  phone: string;
  birthDate?: string;
  email: string;
  password: string;
  role: "admin" | "vendor";
  status: "active" | "inactive";
  createdAt?: string;
  lastLogin?: string;
  avatar?: string;
  customPermissions?: RolePermissions;
}

export interface RolePermissions {
  dashboard: { view: "all" | "own" };
  sales: { create: boolean; edit: "all" | "own" | "none"; delete: boolean };
  clients: { create: boolean; edit: "all" | "own" | "none" };
  itineraries: { view: boolean; edit: boolean; delete: boolean };
  users: { view: boolean; create: boolean; edit: boolean; delete: boolean };
  config: { view: boolean; edit: boolean };
}

export const DEFAULT_VENDOR_PERMISSIONS: RolePermissions = {
  dashboard: { view: "own" },
  sales: { create: true, edit: "own", delete: false },
  clients: { create: true, edit: "none" },
  itineraries: { view: true, edit: false, delete: false },
  users: { view: false, create: false, edit: false, delete: false },
  config: { view: false, edit: false },
};

export const ADMIN_PERMISSIONS: RolePermissions = {
  dashboard: { view: "all" },
  sales: { create: true, edit: "all", delete: true },
  clients: { create: true, edit: "all" },
  itineraries: { view: true, edit: true, delete: true },
  users: { view: true, create: true, edit: true, delete: true },
  config: { view: true, edit: true },
};

export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  docType: string;
  docNumber: string;
  phone: string;
  email: string;
  birthDate?: string;
  status: "active" | "inactive";
  avatar?: string;
  registrationDate: string;
}

export type SaleProductId =
  | "tiqueteria"
  | "hoteleria"
  | "seguros_viaje"
  | "planes"
  | "checkin"
  | "documentacion_migratoria"
  | "simcard"
  | "renta_vehiculos"
  | "renta_fincas"
  | "tours"
  | "centros_convencion"
  | "restaurantes"
  | "visa"
  | "pasaporte"
  | "servicio_mascotas";

export interface SaleProductDef {
  id: SaleProductId;
  label: string;
  icon: string;
  group: "main" | "other";
}

export const SALE_PRODUCTS: SaleProductDef[] = [
  // --- Principales ---
  { id: "tiqueteria", label: "Tiquetería", icon: "LuTicket", group: "main" },
  { id: "hoteleria", label: "Hotelería", icon: "LuBed", group: "main" },
  { id: "seguros_viaje", label: "Seguros de Viaje", icon: "LuShieldCheck", group: "main" },
  { id: "planes", label: "Planes", icon: "LuPackage", group: "main" },
  // --- Otros ---
  {
    id: "checkin",
    label: "Check-in",
    icon: "LuBookCheck",
    group: "other",
  },
  {
    id: "documentacion_migratoria",
    label: "Documentación Migratoria",
    icon: "LuFileText",
    group: "other",
  },
  { id: "simcard", label: "SIM Card", icon: "LuSmartphone", group: "other" },
  {
    id: "renta_vehiculos",
    label: "Renta de Vehículos",
    icon: "LuCar",
    group: "other",
  },
  { id: "renta_fincas", label: "Renta de Fincas", icon: "LuWarehouse", group: "other" },
  { id: "tours", label: "Tours", icon: "LuCompass", group: "other" },
  {
    id: "centros_convencion",
    label: "Centros de Convención",
    icon: "LuUsers",
    group: "other",
  },
  { id: "restaurantes", label: "Restaurantes", icon: "LuUtensils", group: "other" },
  { id: "visa", label: "Visa", icon: "LuStamp", group: "other" },
  { id: "pasaporte", label: "Pasaporte", icon: "LuBookOpen", group: "other" },
  {
    id: "servicio_mascotas",
    label: "Servicio de Mascotas",
    icon: "LuDog",
    group: "other",
  },
];

export interface FlightLeg {
  origin: string;
  destination: string;
  flightNumber: string;
  seat: string;
  date: string;
  time?: string;
}

export interface GuestInfo {
  name: string;
  docType: string;
  docNumber: string;
}

export interface HotelData {
  hotelName: string;
  destination: string;
  supplier: string;
  reservationNumber: string;
  startDate: string;
  endDate: string;
  supplierCost: number;
  ta: number;
  supplierPaymentMethod: string;
  guests: GuestInfo[];
}

export interface PlanData {
  planName: string;
  hotelName: string;
  supplierCost: number;
  ta: number;
  reservationNumber: string;
  flightNumber: string;
  ticketNumber: string;
  startDate: string;
  endDate: string;
  supplierPaymentMethod: string;
  supplier: string;
  airline: string;
  guests: GuestInfo[];
}

export interface InsuranceData {
  contactName: string;
  contactNumber: string;
  address: string;
  supplier: string;
  supplierCost: number;
  ta: number;
  supplierPaymentMethod: string;
  members: GuestInfo[];
}

export interface TicketData {
  airline: string;
  supplier: string;
  reservationNumber: string;
  flightNumber: string;
  departureDate: string;
  arrivalDate: string;
  supplierCost: number;
  ta: number;
  supplierPaymentMethod: string;
  baggagePlan: string;
  ticketNumber: string;
  seatNumber: string;
  legs: FlightLeg[];
  isRoundTrip: boolean;
  returnLeg?: FlightLeg;
  passengerInfo: {
    name: string;
    docType: string;
    docNumber: string;
    birthDate: string;
  };
}

export interface CheckInData {
  passengerName: string;
  docType: string;
  docNumber: string;
  flightOrReservation: string;
  travelDate: string;
  seat: string;
  baggage: string;
  phone: string;
  specialNeeds: string;
  needsWheelchair: boolean;
}

export interface MigrationData {
  passengerName: string;
  birthDate: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  destinationCountry: string;
  requestedDocType: string;
  email: string;
}

export interface SimCardData {
  passengerName: string;
  docNumber: string;
  destinationCountry: string;
  arrivalDate: string;
  tripDuration: string;
  dataPlan: string;
  simType: string;
  deliveryMethod: string;
  email: string;
}

export interface CarRentalData {
  mainDriver: string;
  licenseNumber: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  vehicleCategory: string;
  additionalDrivers: number;
  insuranceType: "basic" | "all_risk";
  guaranteeCreditCard: string;
}

export interface FincaData {
  responsibleName: string;
  docNumber: string;
  checkInDate: string;
  checkOutDate: string;
  adultsCount: number;
  childrenCount: number;
  hasPets: boolean;
  petType: string;
  additionalServices: string[];
  phone: string;
}

export interface TourData {
  passengerName: string;
  selectedTour: string;
  preferredDate: string;
  adultsCount: number;
  childrenCount: number;
  childrenAges: string;
  guideLanguage: string;
  needsTransport: boolean;
  pickupPoint: string;
  medicalConditions: string;
  phone: string;
}

export interface ConventionData {
  organization: string;
  contactName: string;
  startDate: string;
  endDate: string;
  estimatedAttendance: number;
  requiredSpace: string;
  eventType: string;
  avEquipment: string[];
  hasCatering: boolean;
  cateringNotes: string;
  email: string;
}

export interface RestaurantData {
  reservationName: string;
  dateTime: string;
  peopleCount: number;
  tablePreference: string;
  menuType: string;
  dietaryRestrictions: string[];
  specialOccasion: string;
  phone: string;
}

export interface VisaData {
  fullName: string;
  birthDate: string;
  nationality: string;
  passportNumber: string;
  passportExpiration: string;
  countryApplying: string;
  visaType: string;
  estimatedTravelDate: string;
  email: string;
}

export interface PassportData {
  fullName: string;
  idNumber: string;
  birthDate: string;
  residenceCity: string;
  processType: string;
  estimatedTravelDate: string;
  phone: string;
}

export interface PetServiceData {
  ownerName: string;
  petName: string;
  species: string;
  breed: string;
  weight: number;
  size: string;
  travelType: string;
  travelDate: string;
  destinationCountry: string;
  medicalConditions: string;
  phone: string;
}

export interface PaymentRecord {
  id: number;
  date: string;
  amount: number;
  method: string;
}

export interface Sale {
  id: number;
  clientId: number;
  clientName: string;
  vendorId: number;
  vendorName: string;
  date: string;
  total: number;
  status: "pendiente" | "abonado" | "pagado";
  category?: string;
  paymentMethod: string;
  observations?: string;
  products?: SaleProductId[];
  ticketData?: TicketData[];
  hotelData?: HotelData[];
  insuranceData?: InsuranceData[];
  planData?: PlanData[];
  checkInData?: CheckInData[];
  migrationData?: MigrationData[];
  simCardData?: SimCardData[];
  carRentalData?: CarRentalData[];
  fincaData?: FincaData[];
  tourData?: TourData[];
  conventionData?: ConventionData[];
  restaurantData?: RestaurantData[];
  visaData?: VisaData[];
  passportData?: PassportData[];
  petServiceData?: PetServiceData[];
  isCredit?: boolean;
  creditDueDate?: string;
  creditPaidAmount?: number;
  commissionAgent?: string;
  commissionAmount?: number;
  commissionPaymentMethod?: string;
  ta?: number;
  supplierCost?: number;
  payments?: PaymentRecord[];
}

export interface Flight {
  id: number;
  passenger: string;
  route: string;
  airline: string;
  date: string;
  time: string;
  type: "ida" | "regreso";
  checkin: "pendiente" | "realizado";
}

export interface ConfigData {
  cards: { id: number; bank: string; type: string }[];
  paymentMethods: { id: number; name: string }[];
  documentTypes: { id: number; name: string }[];
  airlines: { id: number; name: string; code: string }[];
  suppliers: { id: number; name: string; type: string; contact: string }[];
  routes: {
    id: number;
    origin: string;
    destination: string;
    duration: string;
  }[];
  baggage: { id: number; name: string; maxWeight: string }[];
  rolePermissions: {
    vendor: RolePermissions; // Permisos por defecto del vendedor (editables)
  };
}

export interface AppData {
  users: User[];
  clients: Client[];
  sales: Sale[];
  flights: Flight[];
  config: ConfigData;
  salesHistory: MonthlySale[];
}

export interface MonthlySale {
  id: number;
  year: number;
  month: number;
  total: number;
  count: number;
  category: {
    hotels: number;
    flights: number;
    packages: number;
    insurance: number;
    transfers: number;
  };
}

export interface DashboardStats {
  totalRevenue: number;
  previousYearRevenue: number;
  revenueGrowth: number;
  totalOperations: number;
  operationsGrowth: number;
  pendingBalance: number;
  pendingCount: number;
  suppliersTotal: number;
  monthlyRevenue: number;
  categoryDistribution: CategoryData[];
  carteraStatus: CarteraData[];
  monthlyTrend: TrendData[];
}

export interface CategoryData {
  name: string;
  value: number;
  percentage: number;
}

export interface CarteraData {
  name: string;
  value: number;
  color: string;
}

export interface TrendData {
  month: number;
  currentYear: number;
  previousYear: number;
}

export type SortField =
  | "date"
  | "clientName"
  | "vendorName"
  | "total"
  | "status";
export type SortDirection = "asc" | "desc";

export interface PaginationState {
  page: number;
  perPage: number;
  total: number;
}

export interface DesgloseCategorias {
  documentos: number;
  hoteles: number;
  planes: number;
  seguros: number;
  tiquetes: number;
  otros: number;
}

export interface KPIData {
  vuelosVendidos: number;
  ordenes: {
    total: number;
    desglose: DesgloseCategorias;
  };
  taIngresada: {
    total: number;
    desglose: DesgloseCategorias;
  };
  taPendiente: {
    total: number;
    desglose: DesgloseCategorias;
  };
  proveedores: {
    total: number;
    desglose: DesgloseCategorias;
  };
}

export const EMPTY_DESGLOSE: DesgloseCategorias = {
  documentos: 0,
  hoteles: 0,
  planes: 0,
  seguros: 0,
  tiquetes: 0,
  otros: 0,
};

export const CATEGORIA_LABELS: Record<keyof DesgloseCategorias, string> = {
  documentos: "Documentos",
  hoteles: "Hoteles",
  planes: "Planes",
  seguros: "Seguros",
  tiquetes: "Tiquetes",
  otros: "Otros",
};

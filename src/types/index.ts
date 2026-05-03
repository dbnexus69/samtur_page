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
  customPermissions?: RolePermissions; // Permisos personalizados por usuario
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

export interface Sale {
  id: number;
  clientId: number;
  clientName: string;
  vendorId: number;
  vendorName: string;
  date: string;
  total: number;
  status: "pagado" | "abonado" | "pendiente";
  category?: "hoteles" | "vuelos" | "seguros" | "planes" | "otros";
  paymentMethod: string;
  observations?: string;
  isCredit?: boolean;
  creditDueDate?: string;
  creditPaidAmount?: number;
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

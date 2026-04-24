export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'vendor';
  status: 'active' | 'inactive';
}

export interface Client {
  id: number;
  name: string;
  docType: string;
  docNumber: string;
  phone: string;
  email: string;
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
  status: 'pagado' | 'abonado' | 'pendiente';
  paymentMethod: string;
  observations?: string;
}

export interface Flight {
  id: number;
  passenger: string;
  route: string;
  airline: string;
  date: string;
  time: string;
  type: 'ida' | 'regreso';
  checkin: 'pendiente' | 'realizado';
}

export interface ConfigData {
  cards: { id: number; bank: string; type: string }[];
  paymentMethods: { id: number; name: string }[];
  documentTypes: { id: number; name: string }[];
  airlines: { id: number; name: string; code: string }[];
  suppliers: { id: number; name: string; type: string; contact: string }[];
  routes: { id: number; origin: string; destination: string; duration: string }[];
  baggage: { id: number; name: string; maxWeight: string }[];
}

export interface AppData {
  users: User[];
  clients: Client[];
  sales: Sale[];
  flights: Flight[];
  config: ConfigData;
}
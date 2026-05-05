export interface RouteConfig {
  id: number;
  origin: string;
  destination: string;
  duration: string;
}

export const ROUTES: RouteConfig[] = [
  { id: 1, origin: "Bogota", destination: "Medellin", duration: "1h 15m" },
  { id: 2, origin: "Bogota", destination: "Cartagena", duration: "1h 30m" },
  { id: 3, origin: "Bogota", destination: "Cali", duration: "1h 05m" },
  { id: 4, origin: "Bogota", destination: "Miami", duration: "5h 30m" },
  { id: 5, origin: "Bogota", destination: "Madrid", duration: "10h 00m" },
];
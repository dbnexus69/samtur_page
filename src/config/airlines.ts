export interface AirlineConfig {
  id: number;
  name: string;
  code: string;
}

export const AIRLINES: AirlineConfig[] = [
  { id: 1, name: "Avianca", code: "AV" },
  { id: 2, name: "LATAM", code: "LA" },
  { id: 3, name: "Copa Airlines", code: "CM" },
  { id: 4, name: "American Airlines", code: "AA" },
  { id: 5, name: "Iberia", code: "IB" },
  { id: 6, name: "United Airlines", code: "UA" },
];
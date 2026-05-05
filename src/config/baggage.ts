export interface BaggageConfig {
  id: number;
  name: string;
  maxWeight: string;
}

export const BAGGAGE: BaggageConfig[] = [
  { id: 1, name: "Equipaje de Mano", maxWeight: "8 kg" },
  { id: 2, name: "Equipaje Documentado", maxWeight: "23 kg" },
  { id: 3, name: "Equipaje Extra", maxWeight: "32 kg" },
];
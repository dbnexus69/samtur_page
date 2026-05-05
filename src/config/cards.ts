export interface CardConfig {
  id: number;
  bank: string;
  type: "Credito" | "Debito";
}

export const CARDS: CardConfig[] = [
  { id: 1, bank: "Banco de Colombia", type: "Credito" },
  { id: 2, bank: "Banco de Bogota", type: "Debito" },
  { id: 3, bank: "Bancolombia", type: "Credito" },
  { id: 4, bank: "Davivienda", type: "Debito" },
];
export interface PaymentMethodConfig {
  id: number;
  name: string;
}

export const PAYMENT_METHODS: PaymentMethodConfig[] = [
  { id: 1, name: "Efectivo" },
  { id: 2, name: "Transferencia" },
  { id: 3, name: "Tarjeta Debito" },
  { id: 4, name: "Tarjeta Credito" },
  { id: 5, name: "PSE" },
];
export interface SupplierConfig {
  id: number;
  name: string;
  type: "Hotel" | "Operador";
  contact: string;
}

export const SUPPLIERS: SupplierConfig[] = [
  {
    id: 1,
    name: "Hotel Dann Carlton",
    type: "Hotel",
    contact: "reservas@danncarlton.com",
  },
  {
    id: 2,
    name: "Decameron",
    type: "Hotel",
    contact: "info@decameron.com",
  },
  {
    id: 3,
    name: "Viajes Exito",
    type: "Operador",
    contact: "operaciones@viajesexito.com",
  },
  {
    id: 4,
    name: "Alsa Viajes",
    type: "Operador",
    contact: "ventas@alsaviajes.com",
  },
];
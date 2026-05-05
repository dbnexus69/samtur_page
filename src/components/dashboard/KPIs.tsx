import { ReactNode } from "react";
import { Card, CardBody } from "../ui/Card";
import { DashboardStats } from "../../hooks/useDashboard";
import { formatCurrency } from "../../utils/formatters";
import {
  Building,
  ShieldCheck,
  Briefcase,
  Plane,
  Users,
  DollarSign,
  CreditCard,
  Map,
} from "lucide-react";

interface DashboardKPIsProps {
  stats: DashboardStats;
}

export function DashboardKPIs({ stats }: DashboardKPIsProps) {
  const kpis = [
    {
      label: "OPERACIONES",
      value: stats.totalFlights,
      subtitle: "Tiquetes Emitidos",
      detail: `${stats.nationalFlights} Nacs | ${stats.internationalFlights} Ints`,
      icon: <Plane size={22} />,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "CLIENTES",
      value: stats.totalClients,
      subtitle: "Total Registrados",
      detail: `${stats.activeClients} Activos`,
      icon: <Users size={22} />,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      label: "INGRESOS BRUTOS",
      value: formatCurrency(stats.totalIngresos),
      subtitle: "Ventas Totales",
      detail: `+${formatCurrency(stats.monthIngresos)} en el periodo`,
      icon: <DollarSign size={22} />,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      label: "PENDIENTES",
      value: formatCurrency(stats.totalPendiente),
      subtitle: "Cuentas por Cobrar",
      detail: `${stats.PendienteCount} transacciones`,
      icon: <CreditCard size={22} />,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      label: "PROVEEDORES",
      value: formatCurrency(stats.totalProveedores),
      subtitle: "Costos Operativos",
      detail: `${stats.supplierCount} activos`,
      icon: <Briefcase size={22} />,
      color: "text-rose-600",
      bg: "bg-rose-100",
    },
    {
      label: "HOTELES",
      value: stats.hotelesVendidos,
      subtitle: "Reservas Generadas",
      detail: `Ingresos: ${formatCurrency(stats.hotelesIngresos)}`,
      icon: <Building size={22} />,
      color: "text-cyan-600",
      bg: "bg-cyan-100",
    },
    {
      label: "SEGUROS",
      value: stats.segurosVendidos,
      subtitle: "Pólizas Emitidas",
      detail: `Ingresos: ${formatCurrency(stats.segurosIngresos)}`,
      icon: <ShieldCheck size={22} />,
      color: "text-violet-600",
      bg: "bg-violet-100",
    },
    {
      label: "PLANES",
      value: stats.planesVendidos,
      subtitle: "Paquetes Turísticos",
      detail: `Ingresos: ${formatCurrency(stats.planesIngresos)}`,
      icon: <Map size={22} />,
      color: "text-fuchsia-600",
      bg: "bg-fuchsia-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => (
        <Card
          key={i}
          className="hover:shadow-lg transition-all duration-300 border border-gray-200 shadow-md bg-white rounded-xl"
        >
          <CardBody className="p-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {kpi.label}
                </p>
                <div className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  {kpi.icon}
                </div>
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-1">
                {kpi.value}
              </h3>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
              <span className="text-xs text-gray-500 font-medium truncate">
                {kpi.subtitle}
              </span>
              {kpi.detail && (
                <span className="text-[10px] font-bold text-gray-500 bg-gray-50/80 px-2 py-1 rounded-md whitespace-nowrap">
                  {kpi.detail}
                </span>
              )}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
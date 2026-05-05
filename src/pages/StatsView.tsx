import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ComposedChart,
  Line,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
} from "recharts";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { useData } from "../context/DataContext";
import { formatCurrency } from "../utils/formatters";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-xl shadow-xl p-4 min-w-[160px]">
      {label && (
        <p className="text-sm font-black text-gray-800 mb-3 border-b border-gray-100 pb-2">
          {label}
        </p>
      )}
      <div className="space-y-2">
        {payload.map((entry: any, index: number) => {
          const nameStr = (entry.name || "").toLowerCase();
          const isCount =
            nameStr.includes("cantidad") || nameStr.includes("vendidos");

          let displayValue = entry.value;
          if (!isCount) {
            displayValue = formatCurrency(entry.value);
          }

          return (
            <div
              key={index}
              className="flex items-center justify-between gap-6 text-xs font-medium"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shadow-sm"
                  style={{ backgroundColor: entry.color || entry.fill }}
                />
                <span className="text-gray-600">{entry.name || "Valor"}:</span>
              </div>
              <span className="font-bold text-gray-900">{displayValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopClients() {
  const { data } = useData();

  const topClients = useMemo(() => {
    const clientMap = new Map<number, { name: string; total: number }>();

    data.sales.forEach((sale) => {
      const existing = clientMap.get(sale.clientId);
      if (existing) {
        existing.total += sale.total;
      } else {
        clientMap.set(sale.clientId, {
          name: sale.clientName,
          total: sale.total,
        });
      }
    });

    return Array.from(clientMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [data.sales]);

  if (topClients.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-gray-400 text-sm">
        No hay datos de clientes
      </div>
    );
  }

  return (
    <div className="h-72 w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={topClients}
          layout="vertical"
          margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradientClient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: "#475569", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            width={120}
          />
          <Tooltip cursor={{ fill: "#f8fafc" }} content={<CustomTooltip />} />
          <Bar
            dataKey="total"
            name="Total Invertido"
            radius={[0, 6, 6, 0] as any}
            barSize={22}
            background={{ fill: "#f1f5f9", radius: [0, 6, 6, 0] as any } as any}
          >
            {topClients.map((_, index) => (
              <Cell key={`cell-${index}`} fill="url(#gradientClient)" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function TopVendors() {
  const { data } = useData();

  const topVendors = useMemo(() => {
    const vendorMap = new Map<
      number,
      { name: string; total: number; count: number }
    >();

    data.sales.forEach((sale) => {
      const existing = vendorMap.get(sale.vendorId);
      if (existing) {
        existing.total += sale.total;
        existing.count += 1;
      } else {
        vendorMap.set(sale.vendorId, {
          name: sale.vendorName,
          total: sale.total,
          count: 1,
        });
      }
    });

    return Array.from(vendorMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);
  }, [data.sales]);

  if (topVendors.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-gray-400 text-sm">
        No hay datos de asesores
      </div>
    );
  }

  return (
    <div className="h-80 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={topVendors}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradientVendor" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f1f5f9"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#475569", fontWeight: 600 }}
            dy={10}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            tickFormatter={(val: number) => `$${(val / 1000000).toFixed(0)}M`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
          <Legend
            wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
            iconType="circle"
          />
          <Bar
            yAxisId="left"
            dataKey="total"
            name="Ingresos Generados"
            fill="url(#gradientVendor)"
            radius={[6, 6, 0, 0] as any}
            maxBarSize={45}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="count"
            name="Ventas (Cantidad)"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function CategoryDistribution() {
  const { data } = useData();

  const catData = useMemo(() => {
    const categories = {
      vuelos: 0,
      hoteles: 0,
      seguros: 0,
      planes: 0,
      otros: 0,
    };

    data.sales.forEach((s) => {
      const c = (s.category || "otros") as keyof typeof categories;
      if (categories[c] !== undefined) {
        categories[c] += s.total;
      } else {
        categories.otros += s.total;
      }
    });

    return [
      { name: "Tiquetes / Vuelos", value: categories.vuelos },
      { name: "Hoteles", value: categories.hoteles },
      { name: "Seguros", value: categories.seguros },
      { name: "Paquetes", value: categories.planes },
      { name: "Otros", value: categories.otros },
    ].filter((d) => d.value > 0);
  }, [data.sales]);

  const COLORS = ["#3b82f6", "#0ea5e9", "#10b981", "#8b5cf6", "#f43f5e"];

  if (catData.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-gray-400 text-sm">
        No hay ventas registradas
      </div>
    );
  }

  return (
    <div className="h-72 w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={catData}
            cx="50%"
            cy="50%"
            innerRadius={75}
            outerRadius={95}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
            cornerRadius={6}
          >
            {catData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function StatsView() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="w-full shadow-lg border-gray-100">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Rendimiento de Asesores (Ingresos vs Volumen)
          </div>
        </CardHeader>
        <CardBody>
          <TopVendors />
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md border-gray-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Top Clientes (Inversión)
            </div>
          </CardHeader>
          <CardBody>
            <TopClients />
          </CardBody>
        </Card>

        <Card className="shadow-md border-gray-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-emerald-500" />
              Distribución de Ventas por Categoría
            </div>
          </CardHeader>
          <CardBody>
            <CategoryDistribution />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

import { Award, Users, PieChart as PieChartIcon } from "lucide-react";
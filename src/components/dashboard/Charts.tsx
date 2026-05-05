import { Card, CardBody, CardHeader } from "../ui/Card";
import { DashboardStats, YearlyTrendData, CarteraData } from "../../hooks/useDashboard";
import { formatCurrency } from "../../utils/formatters";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DashboardChartsProps {
  yearlyTrendData: YearlyTrendData[];
  carteraData: CarteraData[];
  stats: DashboardStats;
  currentYear: number;
}

export function DashboardCharts({
  yearlyTrendData,
  carteraData,
  stats,
  currentYear,
}: DashboardChartsProps) {
  const COLORS = ["#10b981", "#3b82f6", "#f59e0b"];

  return (
    <div className="grid grid-cols-3 gap-6">
      <Card className="col-span-2">
        <CardHeader>
          Comparativa de Ingresos ({currentYear - 1} vs {currentYear})
        </CardHeader>
        <CardBody>
          <div className="h-64 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yearlyTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#102846" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#102846" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                  width={80}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }} />
                <Area
                  type="monotone"
                  dataKey={currentYear}
                  name={`Ingresos ${currentYear}`}
                  stroke="#102846"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCurrent)"
                  activeDot={{ r: 6, fill: "#102846", stroke: "#fff", strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey={currentYear - 1}
                  name={`Ingresos ${currentYear - 1}`}
                  stroke="#94a3b8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPrev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Estado de Cartera</CardHeader>
        <CarteraPieChart data={carteraData} total={stats.totalIngresos} />
      </Card>
    </div>
  );
}

interface CarteraPieChartProps {
  data: CarteraData[];
  total: number;
}

function CarteraPieChart({ data, total }: CarteraPieChartProps) {
  const COLORS = ["#10b981", "#3b82f6", "#f59e0b"];

  return (
    <CardBody>
      <div className="relative h-48 flex items-center justify-center mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              cornerRadius={6}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                padding: "8px 12px",
              }}
              itemStyle={{ color: "#102846", fontWeight: "900", fontSize: "14px" }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
            Total
          </span>
          <span className="text-lg font-black text-primary">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2">
        {data.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className="w-2.5 h-2.5 rounded-full shadow-sm shrink-0"
                style={{ backgroundColor: COLORS[i] }}
              />
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider truncate">
                {item.name}
              </span>
            </div>
            <span
              className="text-[11px] font-black text-gray-800 truncate w-full text-center"
              title={formatCurrency(item.value)}
            >
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}
      </div>
    </CardBody>
  );
}
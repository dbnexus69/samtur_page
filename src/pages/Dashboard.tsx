import { useState } from "react";
import { useData } from "../context/DataContext";
import { useDashboard } from "../hooks/useDashboard";
import { formatCurrency, getCurrentMonth } from "../utils/formatters";
import Datepicker from "react-tailwindcss-datepicker";
import {
  Card,
  CardHeader,
} from "../components/ui/Card";
import {
  DashboardHeader,
  DashboardKPIs,
  DashboardCharts,
  RecentSalesTable,
} from "../components/dashboard";

export default function Dashboard() {
  const { data } = useData();
  const { start, end } = getCurrentMonth();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(start),
    endDate: new Date(end),
  });

  const { stats, yearlyTrendData, carteraData, currentYear } = useDashboard(dateRange);

  const handleDateChange = (newValue: any) => {
    if (newValue) {
      setDateRange(newValue);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Panel de Control"
        subtitle="Resumen general de operaciones, ingresos y estado de cartera."
      />

      <div className="flex items-center bg-white p-1 rounded-xl shadow-sm border border-gray-200 relative z-20">
        <div className="w-72">
          <Datepicker
            value={dateRange}
            onChange={handleDateChange}
            showShortcuts={true}
            primaryColor={"blue"}
            displayFormat={"DD/MMM/YYYY"}
            placeholder={"Selecciona un periodo"}
            separator={" - "}
            inputClassName="w-full text-xs font-bold text-gray-600 bg-gray-50 border-none rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-blue-100 cursor-pointer transition-all"
          />
        </div>
      </div>

      <DashboardKPIs stats={stats} />

      <DashboardCharts
        yearlyTrendData={yearlyTrendData}
        carteraData={carteraData}
        stats={stats}
        currentYear={currentYear}
      />

      <RecentSalesTable sales={data.sales} />
    </div>
  );
}
import { useMemo } from "react";
import { useData } from "../context/DataContext";
import { getCurrentMonth } from "../utils/formatters";

export interface DashboardStats {
  totalFlights: number;
  nationalFlights: number;
  internationalFlights: number;
  activeClients: number;
  totalClients: number;
  totalIngresos: number;
  monthIngresos: number;
  totalPendiente: number;
  PendienteCount: number;
  supplierCount: number;
  totalProveedores: number;
  abonado: number;
  pagado: number;
  hotelesVendidos: number;
  hotelesIngresos: number;
  segurosVendidos: number;
  segurosIngresos: number;
  planesVendidos: number;
  planesIngresos: number;
  vuelosIngresos: number;
  otrosIngresos: number;
}

export interface YearlyTrendData {
  name: string;
  [key: number]: number;
}

export interface CarteraData {
  name: string;
  value: number;
}

export function useDashboard(dateRange?: { startDate: Date | null; endDate: Date | null }) {
  const { data } = useData();
  const { start, end } = getCurrentMonth();

  const range = useMemo(() => {
    return dateRange || {
      startDate: new Date(start),
      endDate: new Date(end),
    };
  }, [dateRange, start, end]);

  const stats = useMemo((): DashboardStats => {
    const totalVentas = data.sales.reduce((sum, s) => sum + s.total, 0);

    const monthVentas = data.sales.filter((s) => {
      if (!range.startDate || !range.endDate) return true;
      const fecha = new Date(s.date);
      const startD = new Date(range.startDate);
      const endD = new Date(range.endDate);
      return fecha >= startD && fecha <= endD;
    });
    const monthIngresos = monthVentas.reduce((sum, s) => sum + s.total, 0);

    const flightsIda = data.flights.filter((f) => f.type === "ida");
    const nationalFlights = flightsIda.filter(
      (f) =>
        f.route.includes("BOG") ||
        f.route.includes("MDE") ||
        f.route.includes("CTG"),
    ).length;
    const internationalFlights = flightsIda.length - nationalFlights;

    const activeClients = data.clients.filter((c) => c.status === "active").length;

    const pendiente = data.sales.filter((s) => s.status === "pendiente");
    const pendienteTotal = pendiente.reduce((sum, s) => sum + s.total, 0);
    const abonado = data.sales.filter((s) => s.status === "abonado");
    const abonadoTotal = abonado.reduce((sum, s) => sum + s.total, 0);
    const pagado = data.sales.filter((s) => s.status === "pagado");
    const pagadoTotal = pagado.reduce((sum, s) => sum + s.total, 0);

    const hotelesVendidos = data.sales.filter((s) => s.category === "hoteles").length;
    const hotelesIngresos = data.sales
      .filter((s) => s.category === "hoteles")
      .reduce((acc, s) => acc + s.total, 0);
    const segurosVendidos = data.sales.filter((s) => s.category === "seguros").length;
    const segurosIngresos = data.sales
      .filter((s) => s.category === "seguros")
      .reduce((acc, s) => acc + s.total, 0);
    const planesVendidos = data.sales.filter((s) => s.category === "planes").length;
    const planesIngresos = data.sales
      .filter((s) => s.category === "planes")
      .reduce((acc, s) => acc + s.total, 0);
    const vuelosIngresos = data.sales
      .filter((s) => s.category === "vuelos")
      .reduce((acc, s) => acc + s.total, 0);
    const otrosIngresos = data.sales
      .filter((s) => s.category === "otros" || !s.category)
      .reduce((acc, s) => acc + s.total, 0);

    return {
      totalFlights: flightsIda.length,
      nationalFlights,
      internationalFlights,
      activeClients,
      totalClients: data.clients.length,
      totalIngresos: totalVentas,
      monthIngresos,
      totalPendiente: pendienteTotal,
      PendienteCount: pendiente.length,
      supplierCount: data.config.suppliers.length,
      totalProveedores: Math.round(totalVentas * 0.75),
      abonado: abonadoTotal,
      pagado: pagadoTotal,
      hotelesVendidos,
      hotelesIngresos,
      segurosVendidos,
      segurosIngresos,
      planesVendidos,
      planesIngresos,
      vuelosIngresos,
      otrosIngresos,
    };
  }, [data, range]);

  const currentYear = new Date().getFullYear();

  const yearlyTrendData = useMemo((): YearlyTrendData[] => {
    const MONTH_NAMES = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
    ];
    return MONTH_NAMES.map((monthName, index) => {
      const monthNum = index + 1;
      const current = data.salesHistory?.find(
        (s) => s.year === currentYear && s.month === monthNum,
      );
      const prev = data.salesHistory?.find(
        (s) => s.year === currentYear - 1 && s.month === monthNum,
      );
      return {
        name: monthName,
        [currentYear]: current ? current.total : 0,
        [currentYear - 1]: prev ? prev.total : 0,
      };
    });
  }, [data.salesHistory, currentYear]);

  const carteraData = useMemo((): CarteraData[] => [
    { name: "Pagado", value: stats.pagado },
    { name: "Abonado", value: stats.abonado },
    { name: "Pendiente", value: stats.totalPendiente },
  ], [stats]);

  return {
    stats,
    yearlyTrendData,
    carteraData,
    currentYear,
  };
}
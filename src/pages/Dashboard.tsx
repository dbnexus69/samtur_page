import { useMemo, useState, useCallback } from 'react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { useData } from '../context/DataContext';
import { formatCurrency } from '../utils/formatters';
import { 
  KPICard, 
  DistributionChart, 
  CarteraChart,
  RecentBookings 
} from '../components/dashboard';
import { TrendData, CategoryData, KPIData, EMPTY_DESGLOSE } from '../types';
import { calculateKPIData } from '../utils/kpCalculator';
import { 
  TrendingUp, 
  Plane, 
  CreditCard, 
  Building2,
  FileSpreadsheet,
  RefreshCw,
  ShoppingCart,
  Clock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const MONTHS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

const CATEGORY_COLORS = ['#102846', '#f2892f', '#06b6d4', '#8b5cf6', '#22c55e'];

type DateRange = 'day' | 'week' | 'month' | 'year';

function getDateRangeParams(range: DateRange, referenceDate: Date = new Date()) {
  const end = new Date(referenceDate);
  const start = new Date(referenceDate);
  
  switch (range) {
    case 'day':
      start.setDate(start.getDate() - 1);
      break;
    case 'week':
      start.setDate(start.getDate() - 7);
      break;
    case 'month':
      start.setMonth(start.getMonth() - 1);
      break;
    case 'year':
      start.setFullYear(start.getFullYear() - 1);
      break;
  }
  
  return { start, end };
}

export default function Dashboard() {
  const { data } = useData();
  const [dateRange, setDateRange] = useState<DateRange>('year');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { start: filterStart, end: filterEnd } = getDateRangeParams(dateRange);
  
  const dateFilter = useMemo(() => {
    if (customStart && customEnd) {
      return { start: new Date(customStart), end: new Date(customEnd) };
    }
    return filterStart && filterEnd ? { start: filterStart, end: filterEnd } : undefined;
  }, [customStart, customEnd, filterStart, filterEnd]);

  const kpiData = useMemo((): KPIData => {
    return calculateKPIData(data.sales, data.flights, dateFilter);
  }, [data.sales, data.flights, dateFilter]);

  const stats = useMemo(() => {
    const totalRevenue = data.sales.reduce((sum, s) => sum + s.total, 0);
    const previousYearRevenue = Math.round(totalRevenue * 0.85);
    const revenueGrowth = previousYearRevenue > 0 
      ? ((totalRevenue - previousYearRevenue) / previousYearRevenue) * 100 
      : 0;

    const totalOperations = data.flights.filter(f => f.type === 'ida').length;
    const previousYearOperations = Math.round(totalOperations * 0.9);
    const operationsGrowth = previousYearOperations > 0
      ? ((totalOperations - previousYearOperations) / previousYearOperations) * 100
      : 0;

    const pendingSales = data.sales.filter(s => s.status === 'pendiente');
    const pendingBalance = pendingSales.reduce((sum, s) => sum + s.total, 0);

    return {
      totalRevenue,
      previousYearRevenue,
      revenueGrowth,
      totalOperations,
      operationsGrowth,
      pendingBalance,
      pendingCount: pendingSales.length,
      supplierCount: data.config.suppliers.length,
    };
  }, [data.sales, data.flights, data.config.suppliers]);

  const monthlyTrend = useMemo((): TrendData[] => {
    const currentYear = 2026;
    const previousYear = 2025;
    const salesHistory = data.salesHistory || [];
    
    return MONTHS.map((_, index) => {
      const month = index + 1;
      const currentData = salesHistory.find(s => s.year === currentYear && s.month === month);
      const previousData = salesHistory.find(s => s.year === previousYear && s.month === month);
      
      return {
        month: index,
        currentYear: currentData?.total || 0,
        previousYear: previousData?.total || 0,
      };
    });
  }, [data.salesHistory]);

  const carteraStatus = useMemo(() => {
    const pendiente = data.sales.filter(s => s.status === 'pendiente');
    const abonado = data.sales.filter(s => s.status === 'abonado');
    const pagado = data.sales.filter(s => s.status === 'pagado');

    return [
      { name: 'Pagado', value: pagado.reduce((sum, s) => sum + s.total, 0), color: '#16a34a' },
      { name: 'Abonado', value: abonado.reduce((sum, s) => sum + s.total, 0), color: '#f2892f' },
      { name: 'Pendiente', value: pendiente.reduce((sum, s) => sum + s.total, 0), color: '#f59e0b' },
    ];
  }, [data.sales]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  }, []);

  const handleRangeChange = useCallback((range: DateRange) => {
    setDateRange(range);
    setCustomStart('');
    setCustomEnd('');
  }, []);

  const getPeriodLabel = () => {
    if (customStart && customEnd) return 'Personalizado';
    switch (dateRange) {
      case 'day': return 'Hoy';
      case 'week': return 'Última semana';
      case 'month': return 'Último mes';
      case 'year': return 'Último año';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Date Range */}
      <Card>
        <CardBody className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-heading font-bold text-primary">Panel de Control</h1>
            
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {(['day', 'week', 'month', 'year'] as DateRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => handleRangeChange(range)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    dateRange === range && !customStart
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {range === 'day' ? 'Hoy' : range === 'week' ? 'Semana' : range === 'month' ? 'Mes' : 'Año'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <input 
                type="date" 
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="border border-gray-border rounded-lg px-2 py-1.5 text-xs bg-white"
              />
              <span>-</span>
              <input 
                type="date" 
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="border border-gray-border rounded-lg px-2 py-1.5 text-xs bg-white"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <FileSpreadsheet className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </CardBody>
      </Card>

{/* KPIs - Row 1: 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          label="Vuelos Vendidos"
          value={kpiData.vuelosVendidos}
          subtitle={getPeriodLabel()}
          icon={Plane}
          color="primary"
        />
        <KPICard
          label="Órdenes de Compra"
          value={kpiData.ordenes.total}
          subtitle={getPeriodLabel()}
          icon={ShoppingCart}
          color="accent"
          desglose={kpiData.ordenes.desglose}
          expanded={true}
        />
        <KPICard
          label="T.A. Ingresada"
          value={kpiData.taIngresada.total}
          subtitle={getPeriodLabel()}
          icon={TrendingUp}
          color="success"
          formatAsCurrency={true}
          desglose={kpiData.taIngresada.desglose}
          expanded={true}
        />
      </div>

      {/* KPIs - Row 2: 2 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KPICard
          label="T.A. Pendiente"
          value={kpiData.taPendiente.total}
          subtitle={getPeriodLabel()}
          icon={Clock}
          color="warning"
          formatAsCurrency={true}
          desglose={kpiData.taPendiente.desglose}
          expanded={true}
        />
        <KPICard
          label="Proveedores"
          value={kpiData.proveedores.total}
          subtitle="Acumulado total"
          icon={Building2}
          color="neutral"
          formatAsCurrency={true}
          desglose={kpiData.proveedores.desglose}
          expanded={true}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>Ingresos Mensuales 2026</CardHeader>
          <CardBody>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyTrend.map((d, i) => ({ name: MONTHS[i], ingresos: d.currentYear, anterior: d.previousYear }))}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="gradientIngresos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#102846" stopOpacity={0.5}/>
                      <stop offset="60%" stopColor="#102846" stopOpacity={0.2}/>
                      <stop offset="100%" stopColor="#102846" stopOpacity={0.02}/>
                    </linearGradient>
                    <linearGradient id="gradientAnterior" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.4}/>
                      <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e5e5' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e5e5', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    labelStyle={{ color: '#102846', fontWeight: 600 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="anterior" 
                    stroke="#cbd5e1" 
                    strokeWidth={2}
                    fill="url(#gradientAnterior)"
                    dot={false}
                    activeDot={{ r: 5, fill: '#94a3b8', stroke: '#fff', strokeWidth: 2 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="ingresos" 
                    stroke="#102846" 
                    strokeWidth={2.5}
                    fill="url(#gradientIngresos)"
                    dot={{ r: 4, fill: '#102846', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#102846', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Estado de Cartera</CardHeader>
          <CardBody>
            <CarteraChart data={carteraStatus} />
          </CardBody>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>Distribución por Categoría</CardHeader>
          <CardBody>
            <DistributionChart 
              data={[
                { name: 'Hoteles', value: kpiData.taIngresada.desglose.hoteles, percentage: 0 },
                { name: 'Tiquetes', value: kpiData.taIngresada.desglose.tiquetes, percentage: 0 },
                { name: 'Planes', value: kpiData.taIngresada.desglose.planes, percentage: 0 },
                { name: 'Seguros', value: kpiData.taIngresada.desglose.seguros, percentage: 0 },
                { name: 'Otros', value: kpiData.taIngresada.desglose.otros + kpiData.taIngresada.desglose.documentos, percentage: 0 },
              ]} 
              colors={CATEGORY_COLORS}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Reservas Recientes</CardHeader>
          <RecentBookings sales={data.sales} />
        </Card>
      </div>
    </div>
  );
}
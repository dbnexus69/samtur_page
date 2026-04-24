import { useMemo } from 'react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { useData } from '../context/DataContext';
import { formatCurrency, getCurrentMonth } from '../utils/formatters';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

export default function Dashboard() {
  const { data } = useData();
  const { start, end } = getCurrentMonth();

  const stats = useMemo(() => {
    const totalVentas = data.sales.reduce((sum, s) => sum + s.total, 0);
    const monthVentas = data.sales.filter(s => {
      const fecha = new Date(s.date);
      const now = new Date();
      return fecha.getMonth() === now.getMonth() && fecha.getFullYear() === now.getFullYear();
    });
    const monthIngresos = monthVentas.reduce((sum, s) => sum + s.total, 0);

    const flightsIda = data.flights.filter(f => f.type === 'ida');
    const nationalFlights = flightsIda.filter(f =>
      f.route.includes('BOG') || f.route.includes('MDE') || f.route.includes('CTG')
    ).length;
    const internationalFlights = flightsIda.length - nationalFlights;

    const pendiente = data.sales.filter(s => s.status === 'pendiente');
    const PendienteTotal = pendiente.reduce((sum, s) => sum + s.total, 0);
    const abonado = data.sales.filter(s => s.status === 'abonado');
    const abonadoTotal = abonado.reduce((sum, s) => sum + s.total, 0);
    const pagado = data.sales.filter(s => s.status === 'pagado');
    const pagadoTotal = pagado.reduce((sum, s) => sum + s.total, 0);

    return {
      totalFlights: flightsIda.length,
      nationalFlights,
      internationalFlights,
      totalOrders: data.sales.length + data.flights.length,
      totalIngresos: totalVentas,
      monthIngresos,
      totalPendiente: PendienteTotal,
      PendienteCount: pendiente.length,
      supplierCount: data.config.suppliers.length,
      totalProveedores: Math.round(totalVentas * 0.75),
      Pendiente: PendienteTotal,
      abonado: abonadoTotal,
      pagado: pagadoTotal
    };
  }, [data]);

  const categoryData = [
    { name: 'Hoteles', value: Math.round(stats.totalIngresos * 0.35) },
    { name: 'Planes', value: Math.round(stats.totalIngresos * 0.25) },
    { name: 'Seguros', value: Math.round(stats.totalIngresos * 0.10) },
    { name: 'Tiquetes', value: Math.round(stats.totalIngresos * 0.25) },
    { name: 'Traslados', value: Math.round(stats.totalIngresos * 0.05) }
  ];

  const carteraData = [
    { name: 'Pagado', value: stats.pagado },
    { name: 'Abonado', value: stats.abonado },
    { name: 'Pendiente', value: stats.Pendiente }
  ];

  const COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f97316', '#22c55e'];
  const CARTERA_COLORS = ['#16a34a', '#2563eb', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* Date Range */}
      <Card>
        <CardBody className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-semibold">Panel de Control</span>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <input type="date" defaultValue={start} className="border rounded px-2 py-1" />
              <span>-</span>
              <input type="date" defaultValue={end} className="border rounded px-2 py-1" />
            </div>
          </div>
          <button className="text-gray-500 hover:text-gray-700 text-sm">
            Actualizar
          </button>
        </CardBody>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'OPERACIONES', value: stats.totalFlights, subtitle: 'Vuelos Vendidos', detail: `Nacionales: ${stats.nationalFlights}`, color: 'text-cyan-500', bg: 'bg-cyan-50' },
          { label: 'GESTION DOCUMENTAL', value: stats.totalOrders, subtitle: 'Ordenes Generadas', detail: '', color: 'text-violet-500', bg: 'bg-violet-50' },
          { label: 'INGRESOS BRUTOS', value: formatCurrency(stats.totalIngresos), subtitle: 'T.A. Ingresada', detail: `+${formatCurrency(stats.monthIngresos)} este mes`, color: 'text-pink-500', bg: 'bg-pink-50' },
          { label: 'PENDIENTES', value: formatCurrency(stats.totalPendiente), subtitle: 'T.A. Pendiente', detail: `${stats.PendienteCount} transacciones`, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'PROVEEDORES', value: formatCurrency(stats.totalProveedores), subtitle: 'Total Proveedores', detail: `${stats.supplierCount} activos`, color: 'text-green-500', bg: 'bg-green-50' }
        ].map((kpi, i) => (
          <Card key={i} className="relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${kpi.bg}`} />
            <CardBody className="pl-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{kpi.label}</p>
              <p className={`text-2xl font-bold mt-2 ${kpi.color}`}>{kpi.value}</p>
              <p className="text-xs text-gray-400 mt-1">{kpi.subtitle}</p>
              {kpi.detail && <p className="text-xs text-gray-400 mt-2 pt-2 border-t">{kpi.detail}</p>}
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>Distribucion por Categoria</CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                {categoryData.map((cat, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{cat.name}</span>
                      <span className="font-semibold">{formatCurrency(cat.value)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(cat.value / stats.totalIngresos) * 100}%`,
                          backgroundColor: COLORS[i]
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Estado de Cartera</CardHeader>
          <CardBody>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={carteraData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {carteraData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CARTERA_COLORS[index % CARTERA_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {carteraData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded" style={{ backgroundColor: CARTERA_COLORS[i] }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Sales */}
      <Card>
        <CardHeader>Ultimas Ventas</CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Vendedor</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.sales.slice(0, 5).map(sale => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{sale.clientName}</td>
                  <td className="px-4 py-3">{sale.vendorName}</td>
                  <td className="px-4 py-3">{sale.date}</td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(sale.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sale.status === 'pagado' ? 'bg-green-100 text-green-800' :
                      sale.status === 'abonado' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { useData } from '../context/DataContext';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp, Users, User, Award } from 'lucide-react';

interface RankItem {
  name: string;
  value: number;
  count: number;
  percentage: number;
}

const PRIMARY_COLOR = '#102846';
const ACCENT_COLORS = ['#102846', '#1e3a5f', '#2d4a6f', '#3d5a7f', '#4d6a8f'];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  
  return (
    <div className="bg-white border border-gray-border rounded-lg shadow-lg p-3">
      <p className="text-sm font-semibold text-primary mb-1">{label}</p>
      <p className="text-xs text-gray-600">
        Ventas: <span className="font-semibold">{formatCurrency(payload[0].value)}</span>
      </p>
    </div>
  );
}

function TopClients() {
  const { data } = useData();
  
  const topClients = useMemo(() => {
    const clientMap = new Map<number, { name: string; total: number; count: number }>();
    
    data.sales.forEach(sale => {
      const existing = clientMap.get(sale.clientId);
      if (existing) {
        existing.total += sale.total;
        existing.count += 1;
      } else {
        clientMap.set(sale.clientId, {
          name: sale.clientName,
          total: sale.total,
          count: 1
        });
      }
    });
    
    const sorted = Array.from(clientMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
    
    const maxValue = sorted[0]?.total || 1;
    
    return sorted.map((item, idx) => ({
      name: item.name,
      value: item.total,
      count: item.count,
      percentage: Math.round((item.total / maxValue) * 100)
    }));
  }, [data.sales]);

  if (topClients.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        No hay datos de clientes
      </div>
    );
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={topClients}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
        >
          <defs>
            <linearGradient id="gradientClient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#102846" stopOpacity={0.8}/>
              <stop offset="100%" stopColor="#102846" stopOpacity={0.3}/>
            </linearGradient>
          </defs>
          <XAxis 
            type="number"
            tick={{ fontSize: 10, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `$${(val / 1000000).toFixed(0)}M`}
          />
          <YAxis 
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: '#102846' }}
            axisLine={false}
            tickLine={false}
            width={100}
          />
          <Tooltip 
            content={<CustomTooltip />}
            formatter={(val: number) => formatCurrency(val)}
          />
          <Bar 
            dataKey="value" 
            radius={[0, 4, 4, 0]}
            maxBarSize={20}
          >
            {topClients.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === 0 ? PRIMARY_COLOR : `url(#gradientClient)`}
                fillOpacity={index === 0 ? 1 : 0.6 - (index * 0.05)}
              />
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
    const vendorMap = new Map<number, { name: string; total: number; count: number }>();
    
    data.sales.forEach(sale => {
      const existing = vendorMap.get(sale.vendorId);
      if (existing) {
        existing.total += sale.total;
        existing.count += 1;
      } else {
        vendorMap.set(sale.vendorId, {
          name: sale.vendorName,
          total: sale.total,
          count: 1
        });
      }
    });
    
    const sorted = Array.from(vendorMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);
    
    const maxValue = sorted[0]?.total || 1;
    
    return sorted.map((item, idx) => ({
      name: item.name,
      value: item.total,
      count: item.count,
      percentage: Math.round((item.total / maxValue) * 100)
    }));
  }, [data.sales]);

  if (topVendors.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        No hay datos de asesores
      </div>
    );
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={topVendors}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
        >
          <defs>
            <linearGradient id="gradientVendor" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f2892f" stopOpacity={0.9}/>
              <stop offset="100%" stopColor="#f2892f" stopOpacity={0.3}/>
            </linearGradient>
          </defs>
          <XAxis 
            type="number"
            tick={{ fontSize: 10, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `$${(val / 1000000).toFixed(0)}M`}
          />
          <YAxis 
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: '#102846' }}
            axisLine={false}
            tickLine={false}
            width={100}
          />
          <Tooltip 
            content={<CustomTooltip />}
            formatter={(val: number) => formatCurrency(val)}
          />
          <Bar 
            dataKey="value" 
            radius={[0, 4, 4, 0]}
            maxBarSize={20}
          >
            {topVendors.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === 0 ? '#f2892f' : `url(#gradientVendor)`}
                fillOpacity={index === 0 ? 1 : 0.6 - (index * 0.05)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function StatsView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Top Clientes
            </div>
          </CardHeader>
          <CardBody>
            <TopClients />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Top Asesores
            </div>
          </CardHeader>
          <CardBody>
            <TopVendors />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
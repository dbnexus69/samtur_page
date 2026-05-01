import { useState, useMemo } from 'react';
import { Plus, ShoppingBag, Receipt, TrendingUp, Wallet } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { FormField, Input, Select, Textarea } from '../components/ui/Form';
import { Table, TableRow, TableCell } from '../components/ui/Table';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../context/PermissionsContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Sale } from '../types';

export default function Sales() {
  const { data, addSale, updateSale } = useData();
  const { user, isAdmin } = useAuth();
  const { canCreate, canEdit } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  const [formData, setFormData] = useState({
    clientId: '',
    total: '',
    paymentMethod: '',
    status: 'pendiente',
    observations: '',
    isCredit: false,
    creditDueDate: ''
  });

  const filteredSales = useMemo(() => {
    if (isAdmin) return data.sales;
    return data.sales.filter(s => s.vendorId === user?.id);
  }, [data.sales, isAdmin, user?.id]);

  const totals = useMemo(() => {
    return filteredSales.reduce(
      (acc, s) => ({
        total: acc.total + s.total,
        pagado: acc.pagado + (s.status === 'pagado' ? s.total : 0),
        pendiente: acc.pendiente + (s.status === 'pendiente' ? s.total : 0)
      }),
      { total: 0, pagado: 0, pendiente: 0 }
    );
  }, [filteredSales]);

  const canEditThis = (sale: Sale): boolean => {
    if (!canEdit('sales')) return false;
    if (isAdmin) return true;
    return sale.vendorId === user?.id;
  };

  const handleOpenModal = (sale?: Sale) => {
    if (sale && !canEditThis(sale)) return;
    if (sale) {
      setEditingSale(sale);
      setFormData({
        clientId: String(sale.clientId),
        total: String(sale.total),
        paymentMethod: sale.paymentMethod,
        status: sale.status,
        observations: sale.observations || '',
        isCredit: sale.isCredit || false,
        creditDueDate: sale.creditDueDate || ''
      });
    } else {
      setEditingSale(null);
      setFormData({ clientId: '', total: '', paymentMethod: '', status: 'pendiente', observations: '', isCredit: false, creditDueDate: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    const client = data.clients.find(c => c.id === Number(formData.clientId));
    if (!client) return;

    const saleData = {
      clientId: Number(formData.clientId),
      clientName: client.name,
      total: Number(formData.total),
      paymentMethod: formData.paymentMethod,
      status: formData.status as Sale['status'],
      observations: formData.observations,
      isCredit: formData.isCredit,
      creditDueDate: formData.isCredit ? formData.creditDueDate : undefined,
      creditPaidAmount: formData.isCredit ? 0 : undefined
    };

    if (editingSale) {
      updateSale(editingSale.id, saleData);
    } else {
      addSale({
        ...saleData,
        vendorId: user!.id,
        vendorName: user!.name,
        date: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header de Sección */}
      <div className="mb-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <ShoppingBag className="text-accent w-8 h-8" /> Gestión de Ventas
        </h1>
        <p className="text-gray-500 text-sm mt-1">Control de ingresos, facturación y estados de pago de tus clientes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
        <StatCard 
          icon={<Receipt size={24} />} 
          label="Total Ventas" 
          value={formatCurrency(totals.total)} 
          color="bg-primary" 
        />
        <StatCard 
          icon={<TrendingUp size={24} />} 
          label="Recaudado (Pagado)" 
          value={formatCurrency(totals.pagado)} 
          color="bg-green-500" 
        />
        <StatCard 
          icon={<Wallet size={24} />} 
          label="Por Cobrar (Pendiente)" 
          value={formatCurrency(totals.pendiente)} 
          color="bg-amber-500" 
        />
      </div>

      <Card className="animate-fade-in">
        <CardHeader actions={
          canCreate('sales') ? (
            <Button onClick={() => handleOpenModal()}>
              <Plus size={18} />
              Nueva Venta
            </Button>
          ) : undefined
        }>
          Lista de Ventas {isAdmin ? '(Todas)' : '(Mis Ventas)'}
        </CardHeader>
        <Table headers={['#', 'Cliente', 'Vendedor', 'Fecha', 'Valor', 'Estado', 'Acciones']}>
          {filteredSales.map(sale => (
            <TableRow key={sale.id}>
              <TableCell>{sale.id}</TableCell>
              <TableCell>{sale.clientName}</TableCell>
              <TableCell>{sale.vendorName}</TableCell>
              <TableCell>{formatDate(sale.date)}</TableCell>
              <TableCell className="font-semibold">{formatCurrency(sale.total)}</TableCell>
              <TableCell><Badge variant={sale.status}>{sale.status}</Badge></TableCell>
              <TableCell>
                {canEditThis(sale) ? (
                  <Button variant="outline" size="sm" onClick={() => handleOpenModal(sale)}>
                    Editar
                  </Button>
                ) : (
                  <span className="text-xs text-gray-400">Sin acceso</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSale ? 'Editar Venta' : 'Nueva Venta'}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit}>Guardar</Button>
          </>
        }
      >
        <FormField label="Cliente">
          <Select
            value={formData.clientId}
            onChange={e => setFormData({ ...formData, clientId: e.target.value })}
            options={[{ value: '', label: 'Seleccionar...' }, ...data.clients.map(c => ({ value: String(c.id), label: c.name }))]}
          />
        </FormField>
        <FormField label="Valor Total">
          <Input
            type="number"
            value={formData.total}
            onChange={e => setFormData({ ...formData, total: e.target.value })}
            placeholder="0"
          />
        </FormField>
        <FormField label="Forma de Pago">
          <Select
            value={formData.paymentMethod}
            onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
            options={[{ value: '', label: 'Seleccionar...' }, ...data.config.paymentMethods.map(p => ({ value: p.name, label: p.name }))]}
          />
        </FormField>
        <FormField label="Estado">
          <Select
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'pendiente', label: 'Pendiente' },
              { value: 'abonado', label: 'Abonado' },
              { value: 'pagado', label: 'Pagado' }
            ]}
          />
        </FormField>
        
        <div className="flex items-center gap-3 py-2 border-t border-gray-border mt-4">
          <input
            type="checkbox"
            id="isCredit"
            checked={formData.isCredit}
            onChange={e => setFormData({ ...formData, isCredit: e.target.checked, creditDueDate: e.target.checked ? formData.creditDueDate : '' })}
            className="w-4 h-4 rounded border-gray-border text-primary focus:ring-primary"
          />
          <label htmlFor="isCredit" className="text-sm font-medium text-gray-700">
            Venta a crédito
          </label>
        </div>
        
        {formData.isCredit && (
          <FormField label="Fecha de Vencimiento">
            <Input
              type="date"
              value={formData.creditDueDate}
              onChange={e => setFormData({ ...formData, creditDueDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </FormField>
        )}
        
        <FormField label="Observaciones">
          <Textarea
            value={formData.observations}
            onChange={e => setFormData({ ...formData, observations: e.target.value })}
            placeholder="Detalles de la venta..."
            rows={3}
          />
        </FormField>
      </Modal>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  return (
    <Card className={`text-white ${color} border-none shadow-lg shadow-gray-200`}>
      <CardBody className="flex items-center gap-4 py-4">
        <div className="p-3 bg-white/20 rounded-xl flex items-center justify-center">{icon}</div>
        <div>
          <p className="text-xs font-medium text-white/80 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardBody>
    </Card>
  );
}
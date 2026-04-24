import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { FormField, Input, Select, Textarea } from '../components/ui/Form';
import { Table, TableRow, TableCell } from '../components/ui/Table';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Sale } from '../types';

export default function Sales() {
  const { data, addSale, updateSale } = useData();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  const [formData, setFormData] = useState({
    clientId: '',
    total: '',
    paymentMethod: '',
    status: 'pendiente',
    observations: ''
  });

  const handleOpenModal = (sale?: Sale) => {
    if (sale) {
      setEditingSale(sale);
      setFormData({
        clientId: String(sale.clientId),
        total: String(sale.total),
        paymentMethod: sale.paymentMethod,
        status: sale.status,
        observations: sale.observations || ''
      });
    } else {
      setEditingSale(null);
      setFormData({ clientId: '', total: '', paymentMethod: '', status: 'pendiente', observations: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    const client = data.clients.find(c => c.id === Number(formData.clientId));
    if (!client) return;

    if (editingSale) {
      updateSale(editingSale.id, {
        clientId: Number(formData.clientId),
        clientName: client.name,
        total: Number(formData.total),
        paymentMethod: formData.paymentMethod,
        status: formData.status as Sale['status'],
        observations: formData.observations
      });
    } else {
      addSale({
        clientId: Number(formData.clientId),
        clientName: client.name,
        vendorId: user!.id,
        vendorName: user!.name,
        date: new Date().toISOString().split('T')[0],
        total: Number(formData.total),
        paymentMethod: formData.paymentMethod,
        status: formData.status as Sale['status'],
        observations: formData.observations
      });
    }
    setIsModalOpen(false);
  };

  const totals = data.sales.reduce(
    (acc, s) => ({
      total: acc.total + s.total,
      pagado: acc.pagado + (s.status === 'pagado' ? s.total : 0),
      pendiente: acc.pendiente + (s.status === 'pendiente' ? s.total : 0)
    }),
    { total: 0, pagado: 0, pendiente: 0 }
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardBody className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Ventas</p>
            <p className="text-xl font-bold">{formatCurrency(totals.total)}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-500">Pagado</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(totals.pagado)}</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-500">Pendiente</p>
            <p className="text-xl font-bold text-yellow-600">{formatCurrency(totals.pendiente)}</p>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader actions={
          <Button onClick={() => handleOpenModal()}>
            <Plus size={18} />
            Nueva Venta
          </Button>
        }>
          Lista de Ventas
        </CardHeader>
        <Table headers={['#', 'Cliente', 'Vendedor', 'Fecha', 'Valor', 'Estado', 'Acciones']}>
          {data.sales.map(sale => (
            <TableRow key={sale.id}>
              <TableCell>{sale.id}</TableCell>
              <TableCell>{sale.clientName}</TableCell>
              <TableCell>{sale.vendorName}</TableCell>
              <TableCell>{formatDate(sale.date)}</TableCell>
              <TableCell className="font-semibold">{formatCurrency(sale.total)}</TableCell>
              <TableCell><Badge variant={sale.status}>{sale.status}</Badge></TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleOpenModal(sale)}>
                  Editar
                </Button>
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
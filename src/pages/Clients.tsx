import { useState } from 'react';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { FormField, Input, Select, Textarea } from '../components/ui/Form';
import { Table, TableRow, TableCell } from '../components/ui/Table';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Client } from '../types';

export default function Clients() {
  const { data, addClient, updateClient, deleteClient } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    docType: '',
    docNumber: '',
    phone: '',
    email: ''
  });

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        docType: client.docType,
        docNumber: client.docNumber,
        phone: client.phone,
        email: client.email
      });
    } else {
      setEditingClient(null);
      setFormData({ name: '', docType: '', docNumber: '', phone: '', email: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (editingClient) {
      updateClient(editingClient.id, formData);
    } else {
      addClient({
        ...formData,
        registrationDate: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Esta seguro de eliminar este cliente?')) {
      deleteClient(id);
    }
  };

  const handleViewDetail = (client: Client) => {
    setSelectedClient(client);
    setIsDetailOpen(true);
  };

  const clientSales = selectedClient
    ? data.sales.filter(s => s.clientId === selectedClient.id)
    : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader actions={
          <Button onClick={() => handleOpenModal()}>
            <Plus size={18} />
            Nuevo Cliente
          </Button>
        }>
          Lista de Clientes
        </CardHeader>
        <Table headers={['#', 'Nombre', 'Tipo Doc', 'Numero Doc', 'Telefono', 'Correo', 'Registro', 'Acciones']}>
          {data.clients.map(client => (
            <TableRow key={client.id}>
              <TableCell>{client.id}</TableCell>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.docType}</TableCell>
              <TableCell>{client.docNumber}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{formatDate(client.registrationDate)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetail(client)}>
                    <Eye size={14} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleOpenModal(client)}>
                    <Pencil size={14} />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(client.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit}>Guardar</Button>
          </>
        }
      >
        <FormField label="Nombre Completo">
          <Input
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nombre completo"
          />
        </FormField>
        <FormField label="Tipo de Documento">
          <Select
            value={formData.docType}
            onChange={e => setFormData({ ...formData, docType: e.target.value })}
            options={[{ value: '', label: 'Seleccionar...' }, ...data.config.documentTypes.map(d => ({ value: d.name, label: d.name }))]}
          />
        </FormField>
        <FormField label="Numero de Documento">
          <Input
            value={formData.docNumber}
            onChange={e => setFormData({ ...formData, docNumber: e.target.value })}
            placeholder="Numero de documento"
          />
        </FormField>
        <FormField label="Telefono">
          <Input
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            placeholder="3001234567"
          />
        </FormField>
        <FormField label="Correo Electronico">
          <Input
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            placeholder="correo@ejemplo.com"
          />
        </FormField>
      </Modal>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={`Detalle: ${selectedClient?.name}`}
        footer={<Button variant="outline" onClick={() => setIsDetailOpen(false)}>Cerrar</Button>}
      >
        {selectedClient && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><span className="font-medium">Tipo Doc:</span> {selectedClient.docType}</div>
              <div><span className="font-medium">Numero:</span> {selectedClient.docNumber}</div>
              <div><span className="font-medium">Telefono:</span> {selectedClient.phone}</div>
              <div><span className="font-medium">Correo:</span> {selectedClient.email}</div>
              <div><span className="font-medium">Registro:</span> {formatDate(selectedClient.registrationDate)}</div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Historial de Compras ({clientSales.length})</h4>
              {clientSales.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left bg-gray-50">
                      <th className="p-2">Fecha</th>
                      <th className="p-2">Valor</th>
                      <th className="p-2">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {clientSales.map(s => (
                      <tr key={s.id}>
                        <td className="p-2">{formatDate(s.date)}</td>
                        <td className="p-2">{formatCurrency(s.total)}</td>
                        <td className="p-2"><Badge variant={s.status}>{s.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-sm">No hay compras registradas</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { FormField, Input, Select } from '../components/ui/Form';
import { Table, TableRow, TableCell } from '../components/ui/Table';
import { useData } from '../context/DataContext';
import { ConfigData } from '../types';

type ConfigSection = 'cards' | 'paymentMethods' | 'documentTypes' | 'airlines' | 'suppliers' | 'routes' | 'baggage';

const SECTIONS = [
  { id: 'cards', label: 'Tarjetas' },
  { id: 'paymentMethods', label: 'Formas de Pago' },
  { id: 'documentTypes', label: 'Tipos de Documento' },
  { id: 'airlines', label: 'Aerolineas' },
  { id: 'suppliers', label: 'Proveedores' },
  { id: 'routes', label: 'Rutas' },
  { id: 'baggage', label: 'Equipaje' }
] as const;

type SectionId = typeof SECTIONS[number]['id'];

export default function Config() {
  const { data, addConfigItem, updateConfigItem, deleteConfigItem } = useData();
  const [currentSection, setCurrentSection] = useState<SectionId>('cards');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [formData, setFormData] = useState<any>({});

  const currentData = (data.config[currentSection as keyof ConfigData] || []) as any[];

  const getHeaders = (section: SectionId): string[] => {
    switch (section) {
      case 'cards': return ['#', 'Banco', 'Tipo'];
      case 'paymentMethods': return ['#', 'Nombre'];
      case 'documentTypes': return ['#', 'Nombre'];
      case 'airlines': return ['#', 'Nombre', 'Codigo'];
      case 'suppliers': return ['#', 'Nombre', 'Tipo', 'Contacto'];
      case 'routes': return ['#', 'Origen', 'Destino', 'Duracion'];
      case 'baggage': return ['#', 'Nombre', 'Peso Maximo'];
      default: return ['#', 'Nombre'];
    }
  };

  const getRow = (item: any, section: SectionId): string[] => {
    switch (section) {
      case 'cards': return [item.bank, item.type];
      case 'paymentMethods': return [item.name];
      case 'documentTypes': return [item.name];
      case 'airlines': return [item.name, item.code];
      case 'suppliers': return [item.name, item.type, item.contact];
      case 'routes': return [item.origin, item.destination, item.duration];
      case 'baggage': return [item.name, item.maxWeight];
      default: return [item.name];
    }
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      setFormData({});
    }
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (editingItem) {
      updateConfigItem(currentSection as ConfigSection, editingItem.id, formData);
    } else {
      addConfigItem(currentSection as ConfigSection, formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Esta seguro de eliminar este registro?')) {
      deleteConfigItem(currentSection as ConfigSection, id);
    }
  };

  const getFormFields = (section: SectionId) => {
    switch (section) {
      case 'cards':
        return (
          <>
            <FormField label="Banco">
              <Input value={formData.bank || ''} onChange={e => setFormData({ ...formData, bank: e.target.value })} />
            </FormField>
            <FormField label="Tipo">
              <Select
                value={formData.type || ''}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                options={[{ value: 'Credito', label: 'Credito' }, { value: 'Debito', label: 'Debito' }]}
              />
            </FormField>
          </>
        );
      case 'paymentMethods':
        return (
          <FormField label="Nombre">
            <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </FormField>
        );
      case 'documentTypes':
        return (
          <FormField label="Nombre">
            <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </FormField>
        );
      case 'airlines':
        return (
          <>
            <FormField label="Nombre">
              <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </FormField>
            <FormField label="Codigo IATA">
              <Input value={formData.code || ''} onChange={e => setFormData({ ...formData, code: e.target.value })} />
            </FormField>
          </>
        );
      case 'suppliers':
        return (
          <>
            <FormField label="Nombre">
              <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </FormField>
            <FormField label="Tipo">
              <Select
                value={formData.type || ''}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                options={[{ value: 'Hotel', label: 'Hotel' }, { value: 'Operador', label: 'Operador' }, { value: 'Aerolinea', label: 'Aerolinea' }]}
              />
            </FormField>
            <FormField label="Contacto">
              <Input value={formData.contact || ''} onChange={e => setFormData({ ...formData, contact: e.target.value })} />
            </FormField>
          </>
        );
      case 'routes':
        return (
          <>
            <FormField label="Origen">
              <Input value={formData.origin || ''} onChange={e => setFormData({ ...formData, origin: e.target.value })} />
            </FormField>
            <FormField label="Destino">
              <Input value={formData.destination || ''} onChange={e => setFormData({ ...formData, destination: e.target.value })} />
            </FormField>
            <FormField label="Duracion">
              <Input value={formData.duration || ''} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
            </FormField>
          </>
        );
      case 'baggage':
        return (
          <>
            <FormField label="Nombre">
              <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </FormField>
            <FormField label="Peso Maximo (kg)">
              <Input value={formData.maxWeight || ''} onChange={e => setFormData({ ...formData, maxWeight: e.target.value })} />
            </FormField>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 border-b">
          {SECTIONS.map(section => (
            <button
              key={section.id}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentSection === section.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setCurrentSection(section.id)}
            >
              {section.label}
            </button>
          ))}
        </div>

        <CardHeader actions={
          <Button onClick={() => handleOpenModal()}>
            <Plus size={18} />
            Nuevo
          </Button>
        }>
          {SECTIONS.find(s => s.id === currentSection)?.label}
        </CardHeader>
        <Table headers={getHeaders(currentSection)}>
          {currentData.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              {getRow(item, currentSection).map((val, i) => (
                <TableCell key={i}>{val}</TableCell>
              ))}
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenModal(item)}>
                    <Pencil size={14} />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
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
        title={editingItem ? 'Editar' : 'Nuevo Registro'}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit}>Guardar</Button>
          </>
        }
      >
        {getFormFields(currentSection)}
      </Modal>
    </div>
  );
}
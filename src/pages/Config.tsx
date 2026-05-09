import { useState } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Settings, 
  ListTree, 
  Database, 
  Boxes, 
  CreditCard, 
  Coins, 
  IdCard, 
  PlaneTakeoff, 
  Building2, 
  MapPin, 
  Luggage, 
  Search, 
  Grid, 
  List,
  Compass
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { FormField, Input, Select } from '../components/ui/Form';
import { Table, TableRow, TableCell } from '../components/ui/Table';
import { useData } from '../context/DataContext';
import { ConfigData } from '../types';

type ConfigSection = 'cards' | 'paymentMethods' | 'documentTypes' | 'airlines' | 'suppliers' | 'airports' | 'baggage';

const SECTIONS = [
  { id: 'cards', label: 'Tarjetas', desc: 'Bancos y tarjetas de crédito/débito', icon: <CreditCard size={18} /> },
  { id: 'paymentMethods', label: 'Formas de Pago', desc: 'Métodos de cobro del sistema', icon: <Coins size={18} /> },
  { id: 'documentTypes', label: 'Tipos de Documento', desc: 'Documentos de identidad base', icon: <IdCard size={18} /> },
  { id: 'airlines', label: 'Aerolíneas', desc: 'Líneas aéreas autorizadas', icon: <PlaneTakeoff size={18} /> },
  { id: 'suppliers', label: 'Proveedores', desc: 'Hoteles, operadores y aerolíneas', icon: <Building2 size={18} /> },
  { id: 'airports', label: 'Aeropuertos', desc: 'Aeropuertos y ubicaciones base', icon: <Compass size={18} /> },
  { id: 'baggage', label: 'Equipaje', desc: 'Políticas y pesos de equipaje', icon: <Luggage size={18} /> }
] as const;

type SectionId = typeof SECTIONS[number]['id'];

export default function Config() {
  const { data, addConfigItem, updateConfigItem, deleteConfigItem } = useData();
  const [currentSection, setCurrentSection] = useState<SectionId>('cards');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const currentData = (data.config[currentSection as keyof ConfigData] || []) as any[];

  // Dynamic filter based on search input
  const filteredData = currentData.filter(item => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    switch (currentSection) {
      case 'cards':
        return (item.name || '').toLowerCase().includes(term) || 
               (item.paymentMethod || '').toLowerCase().includes(term) || 
               (item.lastFourDigits || '').includes(term) ||
               (item.description || '').toLowerCase().includes(term);
      case 'paymentMethods':
      case 'documentTypes':
        return (item.name || '').toLowerCase().includes(term);
      case 'airlines':
        return (item.name || '').toLowerCase().includes(term) || (item.code || '').toLowerCase().includes(term);
      case 'suppliers':
        return (item.name || '').toLowerCase().includes(term) || (item.type || '').toLowerCase().includes(term) || (item.contact || '').toLowerCase().includes(term);
      case 'airports':
        return (item.name || '').toLowerCase().includes(term) || (item.abbreviation || '').toLowerCase().includes(term) || (item.location || '').toLowerCase().includes(term);
      case 'baggage':
        return (item.airlineName || '').toLowerCase().includes(term);
      default:
        return true;
    }
  });

  const getHeaders = (section: SectionId): string[] => {
    switch (section) {
      case 'cards': return ['#', 'Nombre', 'Método de Pago', 'Últimos 4 Dígitos', 'Estado', 'Descripción'];
      case 'paymentMethods': return ['#', 'Nombre'];
      case 'documentTypes': return ['#', 'Nombre'];
      case 'airlines': return ['#', 'Nombre', 'Código IATA', 'Cobertura', 'Sitio Web'];
      case 'suppliers': return ['#', 'Nombre', 'Tipo', 'Contacto', 'Sitio Web'];
      case 'airports': return ['#', 'Nombre', 'Abreviación', 'Ubicación', 'Cobertura', 'Estado'];
      case 'baggage': return ['#', 'Aerolínea', 'Tarifa', 'Art. Personal', 'Equip. Mano', 'Equip. Bodega'];
      default: return ['#', 'Nombre'];
    }
  };

  const getRow = (item: any, section: SectionId): string[] => {
    switch (section) {
      case 'cards': return [
        item.name || item.bank || 'Tarjeta Sin Nombre', 
        item.paymentMethod || item.type || 'No especificado', 
        `•••• ${item.lastFourDigits || item.id?.toString().padStart(4, '0')}`, 
        item.status || 'Activo', 
        item.description || 'Sin descripción'
      ];
      case 'paymentMethods': return [item.name];
      case 'documentTypes': return [item.name];
      case 'airlines': return [item.name, item.code, item.type || 'Internacional', item.website || 'No especificado'];
      case 'suppliers': return [item.name, item.type, item.contact, item.website || 'No especificado'];
      case 'airports': return [item.name, item.abbreviation, item.location, item.type || 'Ambos', item.status || 'Activo'];
      case 'baggage': return [item.airlineName, item.fareType, item.personalItem || 'No incluido', item.carryOn || 'No incluido', item.checkedBag || 'No incluido'];
      default: return [item.name];
    }
  };

  const handleOpenModal = (item?: any) => {
    setErrors({});
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      setFormData(currentSection === 'cards' ? { status: 'Activo', paymentMethod: '' } : {});
    }
    setIsModalOpen(true);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (currentSection === 'cards') {
      if (!formData.name || formData.name.trim().length < 3) {
        newErrors.name = 'El nombre debe tener al menos 3 caracteres.';
      }
      if (!formData.paymentMethod) {
        newErrors.paymentMethod = 'Debe seleccionar un método de pago.';
      }
      if (!formData.lastFourDigits || formData.lastFourDigits.length !== 4 || !/^\d{4}$/.test(formData.lastFourDigits)) {
        newErrors.lastFourDigits = 'Debe ingresar exactamente los últimos 4 dígitos numéricos.';
      }
      if (!formData.status) {
        newErrors.status = 'Debe seleccionar un estado.';
      }
      if (!formData.description || formData.description.trim().length < 5) {
        newErrors.description = 'Debe ingresar una descripción de al menos 5 caracteres.';
      }
    } else {
      switch (currentSection) {
        case 'paymentMethods':
        case 'documentTypes':
          if (!formData.name || formData.name.trim().length === 0) newErrors.name = 'El nombre es obligatorio.';
          break;
        case 'airlines':
          if (!formData.name || formData.name.trim().length === 0) newErrors.name = 'El nombre es obligatorio.';
          if (!formData.code || formData.code.trim().length === 0) newErrors.code = 'El código IATA es obligatorio.';
          if (!formData.type) newErrors.type = 'Debe seleccionar un tipo de cobertura.';
          if (!formData.website || !formData.website.startsWith('http')) newErrors.website = 'Debe ingresar un enlace válido (que inicie con http:// o https://).';
          break;
        case 'suppliers':
          if (!formData.name || formData.name.trim().length === 0) newErrors.name = 'El nombre es obligatorio.';
          if (!formData.type) newErrors.type = 'Debe seleccionar un tipo de proveedor.';
          if (!formData.contact || !formData.contact.includes('@')) newErrors.contact = 'Debe ingresar un correo electrónico válido.';
          if (!formData.website || !formData.website.startsWith('http')) newErrors.website = 'Debe ingresar un enlace de sitio web válido (que inicie con http:// o https://).';
          break;
        case 'airports':
          if (!formData.name || formData.name.trim().length === 0) newErrors.name = 'El nombre del aeropuerto es obligatorio.';
          if (!formData.abbreviation || formData.abbreviation.trim().length === 0) newErrors.abbreviation = 'La abreviación IATA es obligatoria.';
          if (!formData.location || formData.location.trim().length === 0) newErrors.location = 'La ubicación es obligatoria.';
          if (!formData.type) newErrors.type = 'Debe seleccionar un tipo de cobertura.';
          if (!formData.status) newErrors.status = 'Debe seleccionar un estado.';
          break;
        case 'baggage':
          if (!formData.airlineName) newErrors.airlineName = 'Debe seleccionar una aerolínea.';
          if (!formData.fareType || formData.fareType.trim().length === 0) newErrors.fareType = 'La tarifa o cabina es obligatoria.';
          if (!formData.personalItem || formData.personalItem.trim().length === 0) newErrors.personalItem = 'La especificación de artículo personal es obligatoria.';
          if (!formData.carryOn || formData.carryOn.trim().length === 0) newErrors.carryOn = 'La especificación de equipaje de mano es obligatoria.';
          if (!formData.checkedBag || formData.checkedBag.trim().length === 0) newErrors.checkedBag = 'La especificación de equipaje de bodega es obligatoria.';
          break;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    
    if (editingItem) {
      updateConfigItem(currentSection as ConfigSection, editingItem.id, formData);
    } else {
      addConfigItem(currentSection as ConfigSection, formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setDeleteItemId(id);
  };

  const confirmDelete = () => {
    if (deleteItemId !== null) {
      deleteConfigItem(currentSection as ConfigSection, deleteItemId);
      setDeleteItemId(null);
    }
  };

  const getFormFields = (section: SectionId) => {
    switch (section) {
      case 'cards':
        return (
          <>
            <FormField label="Nombre" error={errors.name}>
              <Input 
                value={formData.name || ''} 
                onChange={e => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }} 
                placeholder="Ej. Bancolombia Principal"
                error={errors.name}
              />
            </FormField>
            <FormField label="Método de Pago" error={errors.paymentMethod}>
              <Select
                value={formData.paymentMethod || ''}
                onChange={e => {
                  setFormData({ ...formData, paymentMethod: e.target.value });
                  if (errors.paymentMethod) setErrors({ ...errors, paymentMethod: '' });
                }}
                options={[
                  { value: '', label: 'Seleccione un método de pago' },
                  { value: 'Llaves', label: 'Llaves' },
                  { value: 'Tarjeta de Bancolombia', label: 'Tarjeta de Bancolombia' },
                  { value: 'Tarjeta Davivienda', label: 'Tarjeta Davivienda' },
                  { value: 'Tarjeta de Crédito', label: 'Tarjeta de Crédito' },
                  { value: 'Tarjeta de Débito', label: 'Tarjeta de Débito' },
                  { value: 'Transferencia', label: 'Transferencia' }
                ]}
                error={errors.paymentMethod}
              />
            </FormField>
            <FormField label="Últimos 4 Dígitos" error={errors.lastFourDigits}>
              <Input 
                value={formData.lastFourDigits || ''} 
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setFormData({ ...formData, lastFourDigits: val });
                  if (errors.lastFourDigits) setErrors({ ...errors, lastFourDigits: '' });
                }} 
                placeholder="Ej. 4321"
                maxLength={4}
                error={errors.lastFourDigits}
              />
            </FormField>
            <FormField label="Estado" error={errors.status}>
              <Select
                value={formData.status || ''}
                onChange={e => {
                  setFormData({ ...formData, status: e.target.value });
                  if (errors.status) setErrors({ ...errors, status: '' });
                }}
                options={[
                  { value: '', label: 'Seleccione un estado' },
                  { value: 'Activo', label: 'Activo' },
                  { value: 'Inactivo', label: 'Inactivo' }
                ]}
                error={errors.status}
              />
            </FormField>
            <FormField label="Descripción" error={errors.description}>
              <Input 
                value={formData.description || ''} 
                onChange={e => {
                  setFormData({ ...formData, description: e.target.value });
                  if (errors.description) setErrors({ ...errors, description: '' });
                }} 
                placeholder="Ej. Tarjeta corporativa para compras principales..."
                error={errors.description}
              />
            </FormField>
          </>
        );
      case 'paymentMethods':
        return (
          <FormField label="Nombre" error={errors.name}>
            <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} error={errors.name} />
          </FormField>
        );
      case 'documentTypes':
        return (
          <FormField label="Nombre" error={errors.name}>
            <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} error={errors.name} />
          </FormField>
        );
      case 'airlines':
        return (
          <>
            <FormField label="Nombre" error={errors.name}>
              <Input 
                value={formData.name || ''} 
                onChange={e => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }} 
                placeholder="Ej. Avianca"
                error={errors.name}
              />
            </FormField>
            <FormField label="Código IATA" error={errors.code}>
              <Input 
                value={formData.code || ''} 
                onChange={e => {
                  setFormData({ ...formData, code: e.target.value.toUpperCase().slice(0, 3) });
                  if (errors.code) setErrors({ ...errors, code: '' });
                }} 
                placeholder="Ej. AV"
                maxLength={3}
                error={errors.code}
              />
            </FormField>
            <FormField label="Cobertura" error={errors.type}>
              <Select
                value={formData.type || ''}
                onChange={e => {
                  setFormData({ ...formData, type: e.target.value });
                  if (errors.type) setErrors({ ...errors, type: '' });
                }}
                options={[
                  { value: '', label: 'Seleccione una cobertura' },
                  { value: 'Nacional', label: 'Nacional' },
                  { value: 'Internacional', label: 'Internacional' }
                ]}
                error={errors.type}
              />
            </FormField>
            <FormField label="Enlace del Sitio Web (Link)" error={errors.website}>
              <Input 
                value={formData.website || ''} 
                onChange={e => {
                  setFormData({ ...formData, website: e.target.value });
                  if (errors.website) setErrors({ ...errors, website: '' });
                }} 
                placeholder="Ej. https://www.avianca.com"
                error={errors.website}
              />
            </FormField>
          </>
        );
      case 'suppliers':
        return (
          <>
            <FormField label="Nombre" error={errors.name}>
              <Input 
                value={formData.name || ''} 
                onChange={e => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }} 
                placeholder="Ej. Hotel Dann Carlton"
                error={errors.name} 
              />
            </FormField>
            <FormField label="Tipo" error={errors.type}>
              <Select
                value={formData.type || ''}
                onChange={e => {
                  setFormData({ ...formData, type: e.target.value });
                  if (errors.type) setErrors({ ...errors, type: '' });
                }}
                options={[
                  { value: '', label: 'Seleccione un tipo' },
                  { value: 'Hotel', label: 'Hotel' }, 
                  { value: 'Operador', label: 'Operador' }, 
                  { value: 'Aerolinea', label: 'Aerolínea' }
                ]}
                error={errors.type}
              />
            </FormField>
            <FormField label="Contacto (Email)" error={errors.contact}>
              <Input 
                value={formData.contact || ''} 
                onChange={e => {
                  setFormData({ ...formData, contact: e.target.value });
                  if (errors.contact) setErrors({ ...errors, contact: '' });
                }} 
                placeholder="Ej. reservas@danncarlton.com"
                error={errors.contact} 
              />
            </FormField>
            <FormField label="Enlace del Sitio Web (Link)" error={errors.website}>
              <Input 
                value={formData.website || ''} 
                onChange={e => {
                  setFormData({ ...formData, website: e.target.value });
                  if (errors.website) setErrors({ ...errors, website: '' });
                }} 
                placeholder="Ej. https://www.danncarlton.com"
                error={errors.website} 
              />
            </FormField>
          </>
        );
      case 'airports':
        return (
          <>
            <FormField label="Nombre del Aeropuerto" error={errors.name}>
              <Input 
                value={formData.name || ''} 
                onChange={e => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }} 
                placeholder="Ej. Aeropuerto Internacional El Dorado"
                error={errors.name}
              />
            </FormField>
            <FormField label="Ubicación (Ciudad, País)" error={errors.location}>
              <Input 
                value={formData.location || ''} 
                onChange={e => {
                  setFormData({ ...formData, location: e.target.value });
                  if (errors.location) setErrors({ ...errors, location: '' });
                }} 
                placeholder="Ej. Bogotá, Colombia"
                error={errors.location}
              />
            </FormField>
            <FormField label="Abreviación IATA" error={errors.abbreviation}>
              <Input 
                value={formData.abbreviation || ''} 
                onChange={e => {
                  setFormData({ ...formData, abbreviation: e.target.value.toUpperCase().slice(0, 3) });
                  if (errors.abbreviation) setErrors({ ...errors, abbreviation: '' });
                }} 
                placeholder="Ej. BOG"
                maxLength={3}
                error={errors.abbreviation}
              />
            </FormField>
            <FormField label="Cobertura / Tipo" error={errors.type}>
              <Select
                value={formData.type || ''}
                onChange={e => {
                  setFormData({ ...formData, type: e.target.value });
                  if (errors.type) setErrors({ ...errors, type: '' });
                }}
                options={[
                  { value: '', label: 'Seleccione tipo de cobertura' },
                  { value: 'Nacional', label: 'Nacional' },
                  { value: 'Internacional', label: 'Internacional' },
                  { value: 'Ambos', label: 'Ambos (Nacional e Internacional)' }
                ]}
                error={errors.type}
              />
            </FormField>
            <FormField label="Estado" error={errors.status}>
              <Select
                value={formData.status || ''}
                onChange={e => {
                  setFormData({ ...formData, status: e.target.value });
                  if (errors.status) setErrors({ ...errors, status: '' });
                }}
                options={[
                  { value: '', label: 'Seleccione estado' },
                  { value: 'Activo', label: 'Activo' },
                  { value: 'Inactivo', label: 'Inactivo' }
                ]}
                error={errors.status}
              />
            </FormField>
          </>
        );
      case 'baggage':
        return (
          <>
            <FormField label="Aerolínea" error={errors.airlineName}>
              <Select
                value={formData.airlineName || ''}
                onChange={e => {
                  setFormData({ ...formData, airlineName: e.target.value });
                  if (errors.airlineName) setErrors({ ...errors, airlineName: '' });
                }}
                options={[
                  { value: '', label: 'Seleccione aerolínea' },
                  ...data.config.airlines.map((a: any) => ({ value: a.name, label: a.name }))
                ]}
                error={errors.airlineName}
              />
            </FormField>
            <FormField label="Tipo de Tarifa / Cabina" error={errors.fareType}>
              <Input 
                value={formData.fareType || ''} 
                onChange={e => {
                  setFormData({ ...formData, fareType: e.target.value });
                  if (errors.fareType) setErrors({ ...errors, fareType: '' });
                }} 
                placeholder="Ej. Classic (M) o Light (S)"
                error={errors.fareType} 
              />
            </FormField>
            <FormField label="Artículo Personal (Morral/Bolso)" error={errors.personalItem}>
              <Input 
                value={formData.personalItem || ''} 
                onChange={e => {
                  setFormData({ ...formData, personalItem: e.target.value });
                  if (errors.personalItem) setErrors({ ...errors, personalItem: '' });
                }} 
                placeholder="Ej. Incluido (45 x 35 x 20 cm)"
                error={errors.personalItem} 
              />
            </FormField>
            <FormField label="Equipaje de Mano (Cabina)" error={errors.carryOn}>
              <Input 
                value={formData.carryOn || ''} 
                onChange={e => {
                  setFormData({ ...formData, carryOn: e.target.value });
                  if (errors.carryOn) setErrors({ ...errors, carryOn: '' });
                }} 
                placeholder="Ej. 10 kg (55 x 35 x 25 cm) Incluido o No incluido"
                error={errors.carryOn} 
              />
            </FormField>
            <FormField label="Equipaje Documentado (Bodega)" error={errors.checkedBag}>
              <Input 
                value={formData.checkedBag || ''} 
                onChange={e => {
                  setFormData({ ...formData, checkedBag: e.target.value });
                  if (errors.checkedBag) setErrors({ ...errors, checkedBag: '' });
                }} 
                placeholder="Ej. 23 kg (158 cm lineales) Incluido o No incluido"
                error={errors.checkedBag} 
              />
            </FormField>
            <FormField label="Descripción / Notas Adicionales" error={errors.notes}>
              <Input 
                value={formData.notes || ''} 
                onChange={e => setFormData({ ...formData, notes: e.target.value })} 
                placeholder="Ej. Sujeto a cambios de la aerolínea"
                error={errors.notes} 
              />
            </FormField>
          </>
        );
      default:
        return null;
    }
  };

  // PREMIUM VISUAL CARD RENDERERS
  const renderCardsGrid = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredData.map((card) => {
          const gradients = [
            'from-[#0f2027] via-[#203a43] to-[#2c5364] shadow-slate-500/10',
            'from-[#141e30] to-[#243b55] shadow-blue-500/10',
            'from-[#2c3e50] to-[#3498db] shadow-indigo-500/10',
            'from-[#11998e] to-[#38ef7d] shadow-emerald-500/10'
          ];
          const grad = gradients[card.id % gradients.length];
          
          return (
            <div key={card.id} className={`relative bg-gradient-to-br ${grad} text-white p-6 rounded-2xl shadow-lg hover:scale-[1.01] hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[220px]`}>
              <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4 pointer-events-none select-none">
                <CreditCard size={180} />
              </div>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-70">Nombre Tarjeta</p>
                    <h3 className="font-heading font-bold text-base">{card.name || card.bank || 'Tarjeta Sin Nombre'}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    (card.status || 'Activo') === 'Activo' ? 'bg-green-500/20 text-green-200 border border-green-500/30' : 'bg-red-500/20 text-red-200 border border-red-500/30'
                  }`}>
                    {card.status || 'Activo'}
                  </span>
                </div>
                <div className="mb-2">
                  <p className="text-[9px] uppercase tracking-widest opacity-60">Método de Pago</p>
                  <p className="text-xs font-semibold">{card.paymentMethod || card.type || 'No especificado'}</p>
                </div>
              </div>
              <div>
                <div className="flex gap-2.5 items-center mb-4">
                  <div className="w-9 h-6 bg-amber-400/80 rounded-md border border-amber-500/30 flex flex-col justify-between p-0.5">
                    <div className="h-full border-r border-b border-amber-700/20"></div>
                  </div>
                  <div className="text-sm opacity-80 font-mono tracking-widest">•••• •••• •••• {card.lastFourDigits || card.id?.toString().padStart(4, '0')}</div>
                </div>
                <p className="text-[11px] opacity-75 italic mb-4 line-clamp-2 min-h-[2rem]">
                  {card.description || 'Sin descripción corporativa.'}
                </p>
                <div className="flex justify-between items-center border-t border-white/10 pt-3">
                  <span className="text-[9px] font-mono opacity-60">SISTEMA DE FACTURACIÓN ITEA</span>
                  <div className="flex gap-1.5 relative z-10">
                    <button 
                      onClick={() => handleOpenModal(card)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/25 transition-colors cursor-pointer"
                      title="Editar"
                    >
                      <Pencil size={12} />
                    </button>
                    <button 
                      onClick={() => handleDelete(card.id)}
                      className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-100 transition-colors cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPaymentMethodsGrid = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredData.map((method) => {
          const isCard = method.name.toLowerCase().includes('tarjeta') || method.name.toLowerCase().includes('crédito');
          const isTransfer = method.name.toLowerCase().includes('transfe') || method.name.toLowerCase().includes('banco') || method.name.toLowerCase().includes('llaves');
          const theme = isCard ? {
            border: 'border-purple-200 hover:border-purple-400',
            bg: 'from-purple-50/40 via-white to-purple-50/10 shadow-purple-500/5',
            iconBg: 'bg-purple-100 text-purple-600',
            tagBg: 'bg-purple-50 text-purple-700 border-purple-100',
            label: 'Tarjeta / Crédito'
          } : isTransfer ? {
            border: 'border-emerald-200 hover:border-emerald-400',
            bg: 'from-emerald-50/40 via-white to-emerald-50/10 shadow-emerald-500/5',
            iconBg: 'bg-emerald-100 text-emerald-600',
            tagBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
            label: 'Transferencia / Banco'
          } : {
            border: 'border-amber-200 hover:border-amber-400',
            bg: 'from-amber-50/40 via-white to-amber-50/10 shadow-amber-500/5',
            iconBg: 'bg-amber-100 text-amber-600',
            tagBg: 'bg-amber-50 text-amber-700 border-amber-100',
            label: 'Efectivo / Llave'
          };

          return (
            <div key={method.id} className={`bg-gradient-to-br ${theme.bg} border ${theme.border} rounded-2xl p-5 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden min-h-[130px]`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${theme.iconBg} flex items-center justify-center transition-transform group-hover:rotate-6 duration-300 shadow-sm`}>
                    <Coins size={18} />
                  </div>
                  <div>
                    <span className="font-heading font-bold text-gray-800 text-xs block group-hover:text-primary transition-colors">{method.name}</span>
                    <span className="text-[9px] text-gray-400 font-mono tracking-wider">REF ID: #{method.id.toString().padStart(3, '0')}</span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4">
                  <button onClick={() => handleOpenModal(method)} className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-white border border-transparent hover:border-gray-100 shadow-sm transition-all" title="Editar">
                    <Pencil size={11} />
                  </button>
                  <button onClick={() => handleDelete(method.id)} className="p-1.5 text-red-400 hover:text-red-700 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100 shadow-sm transition-all" title="Eliminar">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-gray-100/60 pt-3 mt-auto">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{theme.label}</span>
                <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-widest flex items-center gap-1 ${theme.tagBg}`}>
                  <span className="w-1 h-1 rounded-full bg-current animate-ping" /> Activo
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDocumentTypesGrid = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredData.map((doc) => {
          const isNational = doc.name.toLowerCase().includes('cédula') || doc.name.toLowerCase().includes('cc') || doc.name.toLowerCase().includes('nit');
          const theme = isNational ? {
            border: 'border-blue-200 hover:border-blue-400',
            bg: 'from-blue-50/40 via-white to-blue-50/10 shadow-blue-500/5',
            iconBg: 'bg-blue-100 text-blue-600',
            tagBg: 'bg-blue-50 text-blue-700 border-blue-100',
            label: 'Nacional / Colombia'
          } : {
            border: 'border-teal-200 hover:border-teal-400',
            bg: 'from-teal-50/40 via-white to-teal-50/10 shadow-teal-500/5',
            iconBg: 'bg-teal-100 text-teal-600',
            tagBg: 'bg-teal-50 text-teal-700 border-teal-100',
            label: 'Internacional / Global'
          };

          return (
            <div key={doc.id} className={`bg-gradient-to-br ${theme.bg} border ${theme.border} rounded-2xl p-5 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden min-h-[130px]`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${theme.iconBg} flex items-center justify-center transition-transform group-hover:rotate-6 duration-300 shadow-sm`}>
                    <IdCard size={18} />
                  </div>
                  <div>
                    <span className="font-heading font-bold text-gray-800 text-xs block group-hover:text-primary transition-colors">{doc.name}</span>
                    <span className="text-[9px] text-gray-400 font-mono tracking-wider">REF ID: #{doc.id.toString().padStart(3, '0')}</span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4">
                  <button onClick={() => handleOpenModal(doc)} className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-white border border-transparent hover:border-gray-100 shadow-sm transition-all" title="Editar">
                    <Pencil size={11} />
                  </button>
                  <button onClick={() => handleDelete(doc.id)} className="p-1.5 text-red-400 hover:text-red-700 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100 shadow-sm transition-all" title="Eliminar">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-gray-100/60 pt-3 mt-auto">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{theme.label}</span>
                <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-widest flex items-center gap-1 ${theme.tagBg}`}>
                  <span className="w-1 h-1 rounded-full bg-current animate-ping" /> Habilitado
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderAirlinesGrid = () => {
    const nationals = filteredData.filter(a => (a.type || 'Internacional') === 'Nacional');
    const internationals = filteredData.filter(a => (a.type || 'Internacional') === 'Internacional');

    const renderCard = (airline: any) => (
      <div key={airline.id} className="bg-white border border-gray-border hover:border-accent/40 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            (airline.type || 'Internacional') === 'Nacional' 
              ? 'bg-accent/5 text-accent group-hover:bg-accent/10' 
              : 'bg-primary/5 text-primary group-hover:bg-primary/10'
          }`}>
            <PlaneTakeoff size={18} />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-gray-800 text-xs block truncate">{airline.name}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono bg-primary/5 text-primary px-1.5 py-0.2 rounded text-[9px] font-bold">{airline.code}</span>
              {airline.website && (
                <a 
                  href={airline.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[10px] text-accent hover:underline truncate max-w-[120px] font-semibold"
                  title={`Visitar sitio oficial de ${airline.name}`}
                >
                  Sitio Web ↗
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => handleOpenModal(airline)} className="p-1.5 text-gray-500 hover:text-primary rounded-md hover:bg-gray-100" title="Editar">
            <Pencil size={13} />
          </button>
          <button onClick={() => handleDelete(airline.id)} className="p-1.5 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50" title="Eliminar">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    );

    return (
      <div className="space-y-6">
        {/* National Airlines Section */}
        {nationals.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="w-1.5 h-4 bg-accent rounded-full" />
              <h3 className="font-heading font-bold text-xs text-accent uppercase tracking-wider">Aerolíneas Nacionales</h3>
              <span className="text-[10px] bg-accent/5 text-accent px-2 py-0.5 rounded-full font-bold">{nationals.length}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {nationals.map(renderCard)}
            </div>
          </div>
        )}

        {/* International Airlines Section */}
        {internationals.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="w-1.5 h-4 bg-primary rounded-full" />
              <h3 className="font-heading font-bold text-xs text-primary uppercase tracking-wider">Aerolíneas Internacionales</h3>
              <span className="text-[10px] bg-primary/5 text-primary px-2 py-0.5 rounded-full font-bold">{internationals.length}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {internationals.map(renderCard)}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSuppliersGrid = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredData.map((supplier) => (
          <div key={supplier.id} className="bg-white border border-gray-border hover:border-accent/40 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
              supplier.type === 'Hotel' ? 'from-green-500 to-emerald-600' :
              supplier.type === 'Operador' ? 'from-amber-500 to-orange-600' : 'from-primary to-blue-800'
            }`} />
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 group-hover:text-accent transition-colors">
                  <Building2 size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-xs">{supplier.name}</h3>
                  <span className="text-[10px] text-gray-400 font-mono">Proveedor #{supplier.id}</span>
                </div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                supplier.type === 'Hotel' ? 'bg-green-50 text-green-700 border border-green-200' :
                supplier.type === 'Operador' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {supplier.type}
              </span>
            </div>
            <div className="border-t border-gray-100 pt-3 mt-1 flex justify-between items-center">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
                <a href={`mailto:${supplier.contact}`} className="text-xs text-primary hover:text-accent hover:underline flex items-center gap-1 min-w-0" title="Enviar Correo">
                  <span className="truncate max-w-[150px] text-[11px] font-mono">{supplier.contact}</span>
                </a>
                {supplier.website && (
                  <a 
                    href={supplier.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[11px] text-accent hover:underline font-semibold"
                    title={`Visitar sitio de ${supplier.name}`}
                  >
                    • Sitio Web ↗
                  </a>
                )}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(supplier)} className="p-1.5 text-gray-500 hover:text-primary rounded-md hover:bg-gray-100" title="Editar">
                  <Pencil size={13} />
                </button>
                <button onClick={() => handleDelete(supplier.id)} className="p-1.5 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50" title="Eliminar">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAirportsGrid = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredData.map((airport) => (
          <div key={airport.id} className="bg-white border border-gray-border hover:border-accent/40 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
              (airport.type || 'Ambos') === 'Nacional' ? 'from-amber-400 to-orange-500' :
              (airport.type || 'Ambos') === 'Internacional' ? 'from-primary to-blue-700' :
              'from-accent to-primary'
            }`} />
            
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-primary group-hover:text-accent transition-colors flex-shrink-0">
                  <Compass size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-800 text-xs truncate" title={airport.name}>
                    {airport.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 truncate">{airport.location}</p>
                </div>
              </div>
              <span className="font-mono bg-primary/5 text-primary text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0">
                {airport.abbreviation}
              </span>
            </div>

            <div className="border-t border-gray-100 pt-3 mt-1 flex justify-between items-center">
              <div className="flex gap-1.5 items-center">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  (airport.type || 'Ambos') === 'Nacional' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  (airport.type || 'Ambos') === 'Internacional' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                  'bg-indigo-50 text-indigo-700 border border-indigo-200'
                }`}>
                  {airport.type || 'Ambos'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                  (airport.status || 'Activo') === 'Activo' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  <span className={`w-1 h-1 rounded-full ${
                    (airport.status || 'Activo') === 'Activo' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  {airport.status || 'Activo'}
                </span>
              </div>
              
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(airport)} className="p-1.5 text-gray-500 hover:text-primary rounded-md hover:bg-gray-100" title="Editar">
                  <Pencil size={13} />
                </button>
                <button onClick={() => handleDelete(airport.id)} className="p-1.5 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50" title="Eliminar">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderBaggageGrid = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredData.map((bag) => (
          <div key={bag.id} className="bg-white border border-gray-border hover:border-accent/40 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
              bag.airlineName === 'Avianca' ? 'from-red-500 to-rose-600' :
              bag.airlineName === 'LATAM' ? 'from-indigo-600 to-blue-800' :
              'from-accent to-emerald-500'
            }`} />
            
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-primary group-hover:text-accent transition-colors">
                    <Luggage size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-xs">{bag.airlineName}</h3>
                    <span className="text-[10px] bg-primary/5 text-primary font-bold px-2 py-0.5 rounded-full">
                      {bag.fareType}
                    </span>
                  </div>
                </div>
                <span className="text-[9px] text-gray-400 font-mono">ID: #{bag.id}</span>
              </div>

              {/* Baggage allowances grid */}
              <div className="grid grid-cols-3 gap-2 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100 my-3 text-[10px]">
                <div className="text-center">
                  <span className="block font-bold text-gray-400 uppercase tracking-wider text-[8px] mb-1">Bolso</span>
                  <p className="font-semibold text-gray-700 truncate" title={bag.personalItem}>{bag.personalItem}</p>
                </div>
                <div className="text-center border-x border-gray-200">
                  <span className="block font-bold text-gray-400 uppercase tracking-wider text-[8px] mb-1">Mano</span>
                  <p className="font-semibold text-gray-700 truncate" title={bag.carryOn}>{bag.carryOn}</p>
                </div>
                <div className="text-center">
                  <span className="block font-bold text-gray-400 uppercase tracking-wider text-[8px] mb-1">Bodega</span>
                  <p className="font-semibold text-gray-700 truncate" title={bag.checkedBag}>{bag.checkedBag}</p>
                </div>
              </div>

              {bag.notes && (
                <p className="text-[11px] text-gray-500 italic mt-1 line-clamp-2" title={bag.notes}>
                  💡 {bag.notes}
                </p>
              )}
            </div>

            <div className="border-t border-gray-100 pt-3 mt-3 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleOpenModal(bag)} className="p-1.5 text-gray-500 hover:text-primary rounded-md hover:bg-gray-100" title="Editar">
                <Pencil size={13} />
              </button>
              <button onClick={() => handleDelete(bag.id)} className="p-1.5 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50" title="Eliminar">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Static statistics based on actual active config lengths
  const stats = [
    { label: 'Proveedores Activos', count: data.config.suppliers?.length || 0, icon: <Building2 className="text-primary" size={18} /> },
    { label: 'Aeropuertos Base', count: data.config.airports?.length || 0, icon: <Compass className="text-accent" size={18} /> },
    { label: 'Aerolíneas de Viaje', count: data.config.airlines?.length || 0, icon: <PlaneTakeoff className="text-success" size={18} /> },
    { label: 'Formas de Pago', count: data.config.paymentMethods?.length || 0, icon: <Coins className="text-warning" size={18} /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Dynamic Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <Database className="text-accent w-8 h-8" /> Catálogos del Sistema
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Administración central de tablas maestras, catálogos base y parámetros para la facturación.
          </p>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-gray-border p-4 rounded-xl shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-lg font-bold text-gray-800">{stat.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left internal Sidebar: catalog selection */}
        <div className="lg:col-span-1 space-y-2">
          <div className="bg-white border border-gray-border rounded-xl p-3 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">Módulos Catálogos</p>
            <div className="space-y-1">
              {SECTIONS.map(section => {
                const isActive = currentSection === section.id;
                const count = (data.config[section.id as keyof ConfigData] as any[])?.length || 0;
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setCurrentSection(section.id);
                      setSearchTerm('');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-md shadow-primary/10'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={isActive ? 'text-accent' : 'text-gray-400'}>
                        {section.icon}
                      </div>
                      <div className="text-left min-w-0">
                        <span className="block truncate">{section.label}</span>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel: Active Catalog view */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader actions={
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Bar */}
                <div className="relative w-full sm:w-44">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Filtrar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 w-full rounded-lg border border-gray-border text-xs focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                  />
                </div>

                {/* Grid/List View switcher */}
                <div className="flex items-center border border-gray-border rounded-lg p-0.5 bg-gray-50">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    title="Vista de Cuadrículas"
                  >
                    <Grid size={13} />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1 rounded ${viewMode === 'table' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    title="Vista de Tabla"
                  >
                    <List size={13} />
                  </button>
                </div>
                {/* Add new button */}
                <Button onClick={() => handleOpenModal()} size="sm">
                  <Plus size={14} />
                  Agregar Nuevo
                </Button>
              </div>
            }>
              <div className="flex items-center gap-2">
                <span className="text-primary font-heading font-bold text-base">
                  {SECTIONS.find(s => s.id === currentSection)?.label}
                </span>
                <span className="text-[11px] font-normal text-gray-400 hidden sm:inline">
                  — {SECTIONS.find(s => s.id === currentSection)?.desc}
                </span>
              </div>
            </CardHeader>
            
            <CardBody>
              {filteredData.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-xs">No se encontraron registros en este catálogo.</p>
                </div>
              ) : (
                viewMode === 'grid' ? (
                  currentSection === 'cards' ? renderCardsGrid() :
                  currentSection === 'paymentMethods' ? renderPaymentMethodsGrid() :
                  currentSection === 'documentTypes' ? renderDocumentTypesGrid() :
                  currentSection === 'airlines' ? renderAirlinesGrid() :
                  currentSection === 'suppliers' ? renderSuppliersGrid() :
                  currentSection === 'airports' ? renderAirportsGrid() :
                  renderBaggageGrid()
                ) : (
                  <Table headers={getHeaders(currentSection)}>
                    {filteredData.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        {getRow(item, currentSection).map((val, i) => (
                          <TableCell key={i}>{val}</TableCell>
                        ))}
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleOpenModal(item)}>
                              <Pencil size={13} />
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                              <Trash2 size={13} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </Table>
                )
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Editar Registro' : 'Registrar Elemento'}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit}>Guardar Cambios</Button>
          </>
        }
      >
        <div className="space-y-4">
          {getFormFields(currentSection)}
        </div>
      </Modal>

      {/* Premium Custom Delete Confirmation Modal */}
      <Modal
        isOpen={deleteItemId !== null}
        onClose={() => setDeleteItemId(null)}
        title="Confirmar Eliminación"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button variant="outline" onClick={() => setDeleteItemId(null)}>
              No, cancelar
            </Button>
            <Button variant="danger" onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white font-semibold">
              Sí, eliminar registro
            </Button>
          </div>
        }
      >
        <div className="text-center p-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Trash2 size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            ¿Estás absolutamente seguro?
          </h3>
          <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
            Esta acción es irreversible. Se eliminará de forma permanente el elemento con ID <strong className="text-gray-700 font-mono">#{deleteItemId}</strong> del catálogo de <strong className="text-primary">{SECTIONS.find(s => s.id === currentSection)?.label}</strong>.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left flex items-start gap-3">
            <span className="text-amber-600 text-lg">⚠️</span>
            <p className="text-xs text-amber-700 leading-relaxed font-semibold">
              Nota: Asegúrate de que este elemento no esté siendo referenciado por tiquetes o ventas activas del sistema.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
import { useState, useMemo, useEffect } from 'react';
import { Plus, Eye, Pencil, UserCheck, UserX, Search, PartyPopper, CheckCircle, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, TrendingUp, Users as UsersIcon, X, Plane, CreditCard, AlertCircle, Clock, DollarSign, Wallet } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { FormField, Input, Select } from '../components/ui/Form';
import { Table, TableRow, TableCell } from '../components/ui/Table';
import { useData } from '../context/DataContext';
import { usePermissions } from '../context/PermissionsContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Client } from '../types';
import { getClientsWithCredit, getClientCreditSales, getCreditSummaryTotals, getClientStatusColor, getStatusColor, CreditSaleInfo, ClientCreditSummary } from '../utils/creditUtils';

const AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Casper',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Willow',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Toby',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Finn',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Ruby',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Arlo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Nala',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bear',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Daisy'
];



export default function Clients() {
  const { data, addClient, updateClient, toggleClientStatus } = useData();
  const { canCreate, canEdit } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Client; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [activeTab, setActiveTab] = useState<'list' | 'credit'>('list');
  const [creditFilter, setCreditFilter] = useState<'all' | 'overdue' | 'urgent' | 'pending'>('all');
  const [selectedCreditClient, setSelectedCreditClient] = useState<ClientCreditSummary | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    docType: '',
    docNumber: '',
    phone: '',
    email: '',
    birthDate: '',
    status: 'active' as 'active' | 'inactive',
    avatar: AVATARS[0]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const clientsWithCredit = useMemo(() => 
    getClientsWithCredit(data.clients, data.sales), 
  [data.clients, data.sales]);

  const creditTotals = useMemo(() => 
    getCreditSummaryTotals(data.clients, data.sales),
  [data.clients, data.sales]);

  const filteredCreditClients = useMemo(() => {
    if (creditFilter === 'all') return clientsWithCredit;
    return clientsWithCredit.filter(c => c.status === creditFilter);
  }, [clientsWithCredit, creditFilter]);

  const selectedClientCreditSales = useMemo(() => {
    if (!selectedCreditClient) return [];
    return getClientCreditSales(selectedCreditClient.client.id, data.sales);
  }, [selectedCreditClient, data.sales]);

  const handleOpenModal = (client?: Client) => {
    if (client && !canEdit('clients')) return;
    if (client) {
      setEditingClient(client);
      setFormData({
        firstName: client.firstName || '',
        lastName: client.lastName || '',
        docType: client.docType,
        docNumber: client.docNumber,
        phone: client.phone,
        email: client.email,
        birthDate: client.birthDate || '',
        status: client.status,
        avatar: client.avatar || AVATARS[0]
      });
    } else {
      setEditingClient(null);
      setFormData({
        firstName: '',
        lastName: '',
        docType: '',
        docNumber: '',
        phone: '',
        email: '',
        birthDate: '',
        status: 'active',
        avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)]
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio';
    else if (formData.firstName.length > 40) newErrors.firstName = 'El nombre no puede exceder 40 caracteres';
    
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';
    else if (formData.lastName.length > 40) newErrors.lastName = 'El apellido no puede exceder 40 caracteres';
    
    if (!formData.docType) newErrors.docType = 'Seleccione un tipo de documento';
    if (!formData.docNumber.trim()) newErrors.docNumber = 'El numero de documento es obligatorio';
    else if (formData.docNumber.length > 15) newErrors.docNumber = 'El documento no puede exceder 15 caracteres';
    
    if (!formData.phone.trim()) newErrors.phone = 'El telefono es obligatorio';
    else if (!/^\d+$/.test(formData.phone)) newErrors.phone = 'El telefono solo debe contener numeros';
    else if (formData.phone.length > 15) newErrors.phone = 'El telefono no puede exceder 15 caracteres';
    
    if (!formData.email.trim()) newErrors.email = 'El correo es obligatorio';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'El correo no es valido';
    else if (formData.email.length > 40) newErrors.email = 'El correo no puede exceder 40 caracteres';
    
    if (!formData.birthDate) newErrors.birthDate = 'La fecha de nacimiento es obligatoria';

    const isDuplicateEmail = data.clients.some(c => 
      c.email.toLowerCase() === formData.email.toLowerCase() && (!editingClient || c.id !== editingClient.id)
    );
    if (isDuplicateEmail) newErrors.email = 'Este correo ya esta registrado';

    const isDuplicateDoc = data.clients.some(c => 
      c.docNumber === formData.docNumber && (!editingClient || c.id !== editingClient.id)
    );
    if (isDuplicateDoc) newErrors.docNumber = 'Este documento ya esta registrado';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const clientData = {
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
    };

    if (editingClient) {
      updateClient(editingClient.id, clientData);
      setSuccessMessage('Cliente actualizado exitosamente');
    } else {
      addClient({
        ...clientData as any,
        registrationDate: new Date().toISOString().split('T')[0]
      });
      setSuccessMessage('Nuevo cliente registrado correctamente');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    setShowSuccess(true);
    setIsModalOpen(false);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleToggleStatus = (id: number) => {
    if (!canEdit('clients')) return;
    toggleClientStatus(id);
  };

  const handleViewDetail = (client: Client) => {
    setSelectedClient(client);
    setIsDetailOpen(true);
  };

  const stats = useMemo(() => {
    const total = data.clients.length;
    const active = data.clients.filter(c => c.status === 'active').length;
    const inactive = total - active;
    const recent = data.clients.filter(c => {
      const regDate = new Date(c.registrationDate);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return regDate >= monthAgo;
    }).length;

    return { total, active, inactive, recent };
  }, [data.clients]);

  const requestSort = (key: keyof Client) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredClients = useMemo(() => {
    const filtered = data.clients.filter(client => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.docNumber.includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data.clients, searchTerm, statusFilter, sortConfig]);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const clientSales = useMemo(() => {
    return selectedClient
      ? data.sales.filter(s => s.clientId === selectedClient.id)
      : [];
  }, [selectedClient, data.sales]);

  const clientFlights = useMemo(() => {
    return selectedClient
      ? data.flights.filter(f => f.passenger === selectedClient.name)
      : [];
  }, [selectedClient, data.flights]);

  return (
    <div className="space-y-6 relative">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100] flex justify-center">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="animate-confetti absolute top-0 text-2xl"
              style={{ 
                left: `${Math.random() * 100}%`, 
                animationDelay: `${Math.random() * 2}s`,
                color: ['#FFD700', '#FF4500', '#00BFFF', '#32CD32', '#FF69B4'][Math.floor(Math.random() * 5)]
              }}
            >
              ★
            </div>
          ))}
        </div>
      )}

      {showSuccess && (
        <div className="fixed top-20 right-6 z-[100] bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 animate-slide-in-right">
          <div className="bg-green-500 text-white rounded-full p-1">
            <CheckCircle size={18} />
          </div>
          <div>
            <p className="font-bold text-sm">Operación Exitosa</p>
            <p className="text-xs opacity-90">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Header de Sección */}
      <div className="mb-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
              <UsersIcon className="text-accent w-8 h-8" /> Gestión de Clientes
            </h1>
            <p className="text-gray-500 text-sm mt-1">Administra la base de datos de tus viajeros y su historial de compras.</p>
          </div>
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-border w-fit h-fit">
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'list' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <UsersIcon size={16} /> Lista
            </button>
            <button
              onClick={() => setActiveTab('credit')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${activeTab === 'credit' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <CreditCard size={16} /> Crédito
              {clientsWithCredit.filter(c => c.status === 'overdue' || c.status === 'urgent').length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {clientsWithCredit.filter(c => c.status === 'overdue' || c.status === 'urgent').length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'list' && (
      <>
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in mb-6">
        <StatCard 
          icon={<UsersIcon size={24} />} 
          label="Total Clientes" 
          value={stats.total} 
          color="bg-primary" 
        />
        <StatCard 
          icon={<UserCheck size={24} />} 
          label="Activos" 
          value={stats.active} 
          color="bg-green-500" 
        />
        <StatCard 
          icon={<TrendingUp size={24} />} 
          label="Nuevos (Mes)" 
          value={stats.recent} 
          color="bg-accent" 
        />
        <StatCard 
          icon={<UserX size={24} />} 
          label="Inactivos" 
          value={stats.inactive} 
          color="bg-amber-500" 
        />
      </div>

      <Card className="animate-fade-in">
        <CardHeader actions={
          <div className="flex gap-3 items-center flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Buscar por nombre, doc o correo..." 
                className="pl-10 pr-9 w-72"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded">
                  <X size={14} />
                </button>
              )}
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="text-sm border border-gray-border rounded-lg px-3 py-2 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Solo Activos</option>
              <option value="inactive">Solo Inactivos</option>
            </select>
            {canCreate('clients') && (
              <Button onClick={() => handleOpenModal()}>
                <Plus size={18} />
                Nuevo Cliente
              </Button>
            )}
          </div>
        }>
          Lista de Clientes
        </CardHeader>
        <Table 
          headers={[
            { key: 'id', label: '#' },
            { key: 'name', label: 'Cliente' },
            { key: 'docType', label: 'Tipo Doc' },
            { key: 'docNumber', label: 'Número Doc' },
            { key: 'phone', label: 'Teléfono' },
            { key: 'status', label: 'Estado' },
            { key: 'registrationDate', label: 'Registro' },
            { key: null, label: 'Acciones' }
          ].map(header => (
            <div 
              key={header.label}
              className={`flex items-center gap-2 ${header.key ? 'cursor-pointer hover:text-primary transition-colors' : ''}`}
              onClick={() => header.key && requestSort(header.key as any)}
            >
              {header.label}
              {header.key && <SortIcon active={sortConfig.key === header.key} direction={sortConfig.direction} />}
            </div>
          ))}
        >
          {paginatedClients.map(client => (
            <TableRow key={client.id}>
              <TableCell>{client.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold overflow-hidden">
                    {client.avatar ? (
                      <img src={client.avatar} alt={client.name} className="w-full h-full object-cover" />
                    ) : (
                      client.name.charAt(0)
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{client.name}</span>
                    <span className="text-xs text-gray-500">{client.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>{client.docType}</TableCell>
              <TableCell>{client.docNumber}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>
                <Badge variant={client.status}>{client.status === 'active' ? 'Activo' : 'Inactivo'}</Badge>
              </TableCell>
              <TableCell>{formatDate(client.registrationDate)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetail(client)} title="Ver detalle">
                    <Eye size={14} />
                  </Button>
                  {canEdit('clients') && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleOpenModal(client)} title="Editar">
                        <Pencil size={14} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleToggleStatus(client.id)}
                        title={client.status === 'active' ? 'Desactivar' : 'Activar'}
                      >
                        {client.status === 'active' ? <UserX size={14} className="text-red-500" /> : <UserCheck size={14} className="text-green-500" />}
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>

        <div className="p-4 bg-gray-50/30 border-t border-gray-border flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Mostrando {Math.min(paginatedClients.length + (currentPage - 1) * itemsPerPage, filteredClients.length)} de {filteredClients.length} clientes
            {statusFilter !== 'all' && <span className="ml-1 text-primary font-medium">· Filtro: {statusFilter === 'active' ? 'Activos' : 'Inactivos'}</span>}
          </span>
          {totalPages > 1 && (
            <div className="flex gap-2">
              <Button 
                variant="outline" size="sm" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} /> Anterior
              </Button>
              <div className="flex items-center px-3 text-xs font-bold text-primary bg-white border border-gray-border rounded-lg">
                {currentPage} / {totalPages}
              </div>
              <Button 
                variant="outline" size="sm" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </div>

        {filteredClients.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-gray-500 bg-white">
            <UserX size={48} className="text-gray-200 mb-4" />
            <p className="text-lg font-medium">No se encontraron clientes</p>
            <p className="text-sm">Prueba ajustando los términos de búsqueda.</p>
          </div>
        )}
      </Card>
      </>
      )}

      {activeTab === 'credit' && (
        <div className="animate-fade-in space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <Card className="border-none shadow-lg">
                <CardHeader actions={
                  <div className="flex gap-2">
                    <button onClick={() => setCreditFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${creditFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      Todos ({clientsWithCredit.length})
                    </button>
                    <button onClick={() => setCreditFilter('overdue')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${creditFilter === 'overdue' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>
                      Vencidos ({clientsWithCredit.filter(c => c.status === 'overdue').length})
                    </button>
                    <button onClick={() => setCreditFilter('urgent')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${creditFilter === 'urgent' ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`}>
                      Pronto ({clientsWithCredit.filter(c => c.status === 'urgent').length})
                    </button>
                    <button onClick={() => setCreditFilter('pending')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${creditFilter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'}`}>
                      Pendiente ({clientsWithCredit.filter(c => c.status === 'pending').length})
                    </button>
                  </div>
                }>
                  Clientes con Crédito Pendiente
                </CardHeader>
                <CardBody className="p-0">
                  {filteredCreditClients.length > 0 ? (
                    <div className="divide-y divide-gray-border">
                      {filteredCreditClients.map(creditClient => {
                        const statusColors = getClientStatusColor(creditClient.status);
                        return (
                          <div key={creditClient.client.id} className={`p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors cursor-pointer ${selectedCreditClient?.client.id === creditClient.client.id ? 'bg-primary/5 border-l-4 border-primary' : ''}`} onClick={() => setSelectedCreditClient(creditClient)}>
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${statusColors.bg} ${statusColors.text}`}>
                                <CreditCard size={24} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-primary">{creditClient.client.name}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors.bg} ${statusColors.text}`}>{statusColors.label}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                  <span className="flex items-center gap-1"><DollarSign size={12} /> {creditClient.activeCredits} crédito(s)</span>
                                  <span className="flex items-center gap-1"><Clock size={12} /> {creditClient.nextDueDate ? formatDate(creditClient.nextDueDate) : 'Sin fecha'}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary">{formatCurrency(creditClient.pendingAmount)}</p>
                              <p className="text-xs text-gray-500">pendiente</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                      <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4"><CheckCircle size={32} /></div>
                      <p className="font-bold text-gray-600">¡Todo al día!</p>
                      <p className="text-sm">No hay clientes con crédito pendiente.</p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-primary text-white border-none shadow-xl shadow-primary/20">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl"><Wallet size={24} /></div>
                    <Badge variant="accent" className="bg-white/20 text-white border-none">CARTERA</Badge>
                  </div>
                  <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider">Total Pendiente</h3>
                  <p className="text-3xl font-bold mt-1">{formatCurrency(creditTotals.totalPending)}</p>
                  <div className="mt-4 pt-4 border-t border-white/20 space-y-2">
                    <div className="flex justify-between text-xs text-white/70">
                      <span>Vencido</span>
                      <span className="font-bold text-red-300">{formatCurrency(creditTotals.totalOverdue)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-white/70">
                      <span>Próximo (3 días)</span>
                      <span className="font-bold text-orange-300">{formatCurrency(creditTotals.totalUrgent)}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {selectedCreditClient ? (
                <Card className="border-none shadow-lg">
                  <CardHeader>{selectedCreditClient.client.name}</CardHeader>
                  <CardBody className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Total Crédito</p>
                        <p className="text-sm font-bold text-primary">{formatCurrency(selectedCreditClient.totalCredit)}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Pendiente</p>
                        <p className="text-sm font-bold text-orange-600">{formatCurrency(selectedCreditClient.pendingAmount)}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Pagado</p>
                        <p className="text-sm font-bold text-green-600">{formatCurrency(selectedCreditClient.paidAmount)}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Vencido</p>
                        <p className="text-sm font-bold text-red-600">{formatCurrency(selectedCreditClient.overdueAmount)}</p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-3">Ventas a Crédito</p>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {selectedClientCreditSales.map(saleInfo => {
                          const saleStatusColors = getStatusColor(saleInfo.status);
                          return (
                            <div key={saleInfo.sale.id} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="text-sm font-bold text-primary">Venta #{saleInfo.sale.id}</p>
                                  <p className="text-xs text-gray-500">{formatDate(saleInfo.sale.date)} · Vence: {saleInfo.sale.creditDueDate ? formatDate(saleInfo.sale.creditDueDate) : 'N/A'}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${saleStatusColors}`}>
                                  {saleInfo.status === 'paid' ? 'Liquidado' : saleInfo.status === 'partial' ? 'Parcial' : saleInfo.status === 'overdue' ? 'Vencido' : 'Pendiente'}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Total: <span className="font-semibold">{formatCurrency(saleInfo.sale.total)}</span></span>
                                <span className="text-gray-500">Pagado: <span className="font-semibold text-green-600">{formatCurrency(saleInfo.sale.creditPaidAmount || 0)}</span></span>
                                <span className="text-gray-500">Pendiente: <span className="font-semibold text-orange-600">{formatCurrency(saleInfo.pendingAmount)}</span></span>
                              </div>
                              {saleInfo.daysUntilDue <= 3 && saleInfo.daysUntilDue >= 0 && (
                                <div className="mt-2 flex items-center gap-1 text-[10px] text-orange-600 font-medium"><Clock size={10} /> Vence en {saleInfo.daysUntilDue} día(s)</div>
                              )}
                              {saleInfo.daysUntilDue < 0 && (
                                <div className="mt-2 flex items-center gap-1 text-[10px] text-red-600 font-medium"><AlertCircle size={10} /> Vencido hace {Math.abs(saleInfo.daysUntilDue)} día(s)</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ) : (
                <Card className="border-none shadow-lg">
                  <CardBody className="flex flex-col items-center justify-center p-8 text-gray-400">
                    <CreditCard size={48} className="mb-4 opacity-20" />
                    <p className="font-medium">Selecciona un cliente</p>
                    <p className="text-sm">para ver sus créditos</p>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit}>Guardar</Button>
          </>
        }
      >
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-border mb-6">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <PartyPopper size={14} className="text-accent" /> Selecciona el Avatar
          </h3>
          <div className="max-h-24 overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex flex-wrap gap-3 justify-center md:justify-start py-1">
              {AVATARS.map((avatar, index) => (
                <div 
                  key={index}
                  onClick={() => setFormData({ ...formData, avatar })}
                  className={`w-10 h-10 rounded-full cursor-pointer transition-all border-2 overflow-hidden shadow-sm hover:scale-110 ${formData.avatar === avatar ? 'border-accent ring-2 ring-accent/20 scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={avatar} alt={`Avatar ${index}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3 pb-2 border-b border-gray-border flex items-center gap-2">
              <UserCheck size={16} className="text-accent" /> Información Personal
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Nombres" error={errors.firstName}>
                <Input
                  value={formData.firstName}
                  onChange={e => {
                    setFormData({ ...formData, firstName: e.target.value });
                    if (errors.firstName) setErrors(prev => ({ ...prev, firstName: '' }));
                  }}
                  placeholder="Ej: Juan"
                  error={errors.firstName}
                  maxLength={40}
                />
              </FormField>
              <FormField label="Apellidos" error={errors.lastName}>
                <Input
                  value={formData.lastName}
                  onChange={e => {
                    setFormData({ ...formData, lastName: e.target.value });
                    if (errors.lastName) setErrors(prev => ({ ...prev, lastName: '' }));
                  }}
                  placeholder="Ej: Perez"
                  error={errors.lastName}
                  maxLength={40}
                />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Tipo de Documento" error={errors.docType}>
                <Select
                  value={formData.docType}
                  onChange={e => {
                    setFormData({ ...formData, docType: e.target.value });
                    if (errors.docType) setErrors(prev => ({ ...prev, docType: '' }));
                  }}
                  options={[{ value: '', label: 'Seleccionar...' }, ...data.config.documentTypes.map(d => ({ value: d.name, label: d.name }))]}
                  error={errors.docType}
                />
              </FormField>
              <FormField label="Número de Documento" error={errors.docNumber}>
                <Input
                  value={formData.docNumber}
                  onChange={e => {
                    setFormData({ ...formData, docNumber: e.target.value });
                    if (errors.docNumber) setErrors(prev => ({ ...prev, docNumber: '' }));
                  }}
                  placeholder="Número de documento"
                  error={errors.docNumber}
                  maxLength={15}
                />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Teléfono" error={errors.phone}>
                <Input
                  value={formData.phone}
                  onChange={e => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                  }}
                  placeholder="3001234567"
                  error={errors.phone}
                  maxLength={15}
                />
              </FormField>
              <FormField label="Fecha de Nacimiento" error={errors.birthDate}>
                <Input
                  type="date"
                  value={formData.birthDate}
                  onChange={e => {
                    setFormData({ ...formData, birthDate: e.target.value });
                    if (errors.birthDate) setErrors(prev => ({ ...prev, birthDate: '' }));
                  }}
                  error={errors.birthDate}
                />
              </FormField>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3 pb-2 border-b border-gray-border flex items-center gap-2">
              <Search size={16} className="text-accent" /> Información de Contacto y Estado
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Correo Electrónico" error={errors.email}>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={e => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  placeholder="correo@ejemplo.com"
                  error={errors.email}
                  maxLength={40}
                />
              </FormField>
              <FormField label="Estado">
                <Select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  options={[
                    { value: 'active', label: 'Activo' },
                    { value: 'inactive', label: 'Inactivo' }
                  ]}
                />
              </FormField>
            </div>
          </section>
        </div>
      </Modal>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={`Detalle: ${selectedClient?.name}`}
        size="md"
        footer={<Button variant="outline" onClick={() => setIsDetailOpen(false)}>Cerrar</Button>}
      >
        {selectedClient && (
          <div className="space-y-4">
            <div className="flex flex-col items-center text-center p-4 bg-gradient-to-b from-accent/5 to-transparent rounded-2xl border border-accent/5 mb-2">
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg mb-3 overflow-hidden bg-accent/10">
                {selectedClient.avatar ? (
                  <img src={selectedClient.avatar} alt={selectedClient.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl font-bold text-accent">
                    {selectedClient.name.charAt(0)}
                  </div>
                )}
              </div>
              <h2 className="text-lg font-bold text-primary">{selectedClient.name}</h2>
              <Badge variant={selectedClient.status} className="mt-1">
                {selectedClient.status === 'active' ? 'CLIENTE ACTIVO' : 'CLIENTE INACTIVO'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div><span className="text-gray-500 text-sm block">Tipo Doc:</span> <span className="font-medium">{selectedClient.docType}</span></div>
              <div><span className="text-gray-500 text-sm block">Numero:</span> <span className="font-medium">{selectedClient.docNumber}</span></div>
              <div><span className="text-gray-500 text-sm block">Telefono:</span> <span className="font-medium">{selectedClient.phone}</span></div>
              <div><span className="text-gray-500 text-sm block">Correo:</span> <span className="font-medium">{selectedClient.email}</span></div>
              <div><span className="text-gray-500 text-sm block">F. Nacimiento:</span> <span className="font-medium">{selectedClient.birthDate ? formatDate(selectedClient.birthDate) : 'N/A'}</span></div>
              <div><span className="text-gray-500 text-sm block">Registro:</span> <span className="font-medium">{formatDate(selectedClient.registrationDate)}</span></div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Historial de Compras ({clientSales.length})</h4>
                {clientSales.length > 0 && (
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">
                    Total: {formatCurrency(clientSales.reduce((acc, s) => acc + s.total, 0))}
                  </span>
                )}
              </div>
              {clientSales.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left bg-gray-50 text-xs text-gray-500 uppercase">
                      <th className="p-2 font-semibold">Fecha</th>
                      <th className="p-2 font-semibold">Valor</th>
                      <th className="p-2 font-semibold">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {clientSales.map(s => (
                      <tr key={s.id} className="hover:bg-gray-50/50">
                        <td className="p-2 text-gray-600">{formatDate(s.date)}</td>
                        <td className="p-2 font-semibold text-primary">{formatCurrency(s.total)}</td>
                        <td className="p-2"><Badge variant={s.status}>{s.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-sm italic">No hay compras registradas</p>
              )}
            </div>

            {clientFlights.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Plane size={14} className="text-accent" /> Vuelos ({clientFlights.length})
                </h4>
                <div className="space-y-2">
                  {clientFlights.map(flight => (
                    <div key={flight.id} className={`flex items-center justify-between p-2 rounded-lg border text-xs ${
                      flight.type === 'ida' ? 'bg-blue-50 border-blue-100' : 'bg-indigo-50 border-indigo-100'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Plane size={12} className={flight.type === 'ida' ? 'text-blue-500' : 'text-indigo-500 rotate-180'} />
                        <span className="font-semibold">{flight.route}</span>
                        <span className="text-gray-500">{formatDate(flight.date)} · {flight.time}</span>
                        <span className="text-gray-500">{flight.airline}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full font-bold ${
                        flight.checkin === 'realizado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {flight.checkin === 'realizado' ? 'Check-in ✓' : 'Pendiente'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) {
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

function SortIcon({ active, direction }: { active: boolean, direction: 'asc' | 'desc' }) {
  if (!active) return <ArrowUpDown size={12} className="text-gray-300" />;
  return direction === 'asc' ? <ArrowUp size={12} className="text-white bg-primary rounded-full p-0.5" /> : <ArrowDown size={12} className="text-white bg-primary rounded-full p-0.5" />;
}
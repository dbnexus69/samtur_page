import { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Pencil, Search, Users as UsersIcon, UserCheck, UserX, 
  AlertCircle, CheckCircle, PartyPopper, Shield, Settings, Eye, EyeOff,
  Mail, Phone, Calendar, Hash, ShieldCheck, Briefcase, Lock,
  Globe, LayoutDashboard, ShoppingBag, Users as UsersGroup, Map, Key,
  ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Table, TableRow, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Input, Select, FormField } from '../components/ui/Form';
import { User, RolePermissions, DEFAULT_VENDOR_PERMISSIONS } from '../types';

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

export default function Users() {
  const { data, addUser, updateUser, updateRolePermissions, updateUserPermissions } = useData();
  const { user: currentUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'users' | 'permissions'>('users');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<User | null>(null);
  const [selectedUserForPermissions, setSelectedUserForPermissions] = useState<User | null>(null);
  const [editingUserPermissions, setEditingUserPermissions] = useState<RolePermissions>(data.config.rolePermissions?.vendor || DEFAULT_VENDOR_PERMISSIONS);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'vendor' as 'admin' | 'vendor',
    docType: 'CC',
    docNumber: '',
    phone: '',
    birthDate: '',
    status: 'active' as 'active' | 'inactive',
    avatar: AVATARS[0]
  });

  const stats = useMemo(() => {
    return {
      total: data.users.length,
      active: data.users.filter(u => u.status === 'active').length,
      inactive: data.users.filter(u => u.status === 'inactive').length,
      admins: data.users.filter(u => u.role === 'admin').length,
      vendors: data.users.filter(u => u.role === 'vendor').length
    };
  }, [data.users]);

  // Filtrado y Ordenado de usuarios
  const filteredUsers = useMemo(() => {
    const filtered = data.users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data.users, searchTerm, filterRole, filterStatus, sortConfig]);

  // Paginacion
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole, filterStatus]);

  // Handlers
  const requestSort = (key: keyof User) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleOpenModal = (user: User | null = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        docType: user.docType || 'CC',
        docNumber: user.docNumber || '',
        phone: user.phone || '',
        birthDate: user.birthDate || '',
        status: user.status,
        avatar: user.avatar || AVATARS[0]
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'vendor',
        docType: 'CC',
        docNumber: '',
        phone: '',
        birthDate: '',
        status: 'active',
        avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)]
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.email.trim()) newErrors.email = 'El correo es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'El correo no es valido';
    
    if (!editingUser && !formData.password.trim()) {
      newErrors.password = 'La contrasena es obligatoria para nuevos usuarios';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contrasena debe tener al menos 6 caracteres';
    }
    
    if (!formData.docNumber.trim()) newErrors.docNumber = 'El documento es obligatorio';
    if (!formData.phone.trim()) newErrors.phone = 'El telefono es obligatorio';

    // Verificar duplicados (Email y Documento)
    const isDuplicateEmail = data.users.some(u => 
      u.email.toLowerCase() === formData.email.toLowerCase() && (!editingUser || u.id !== editingUser.id)
    );
    if (isDuplicateEmail) newErrors.email = 'Este correo ya esta registrado';

    const isDuplicateDoc = data.users.some(u => 
      u.docNumber === formData.docNumber && (!editingUser || u.id !== editingUser.id)
    );
    if (isDuplicateDoc) newErrors.docNumber = 'Este numero de documento ya esta registrado';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (editingUser) {
      updateUser(editingUser.id, formData);
      setSuccessMessage('Usuario actualizado exitosamente');
    } else {
      addUser(formData);
      setSuccessMessage('Nuevo usuario registrado correctamente');
    }
    setShowSuccess(true);
    setIsModalOpen(false);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleToggleStatus = (user: User) => {
    const action = user.status === 'active' ? 'desactivar' : 'activar';
    if (confirm(`¿Estás seguro de que deseas ${action} al usuario ${user.name}?`)) {
      updateUser(user.id, {
        status: user.status === 'active' ? 'inactive' : 'active'
      });
      setSuccessMessage(`Usuario ${user.name} ${action === 'activar' ? 'activado' : 'desactivado'} correctamente`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUserForDetail(user);
    setIsDetailModalOpen(true);
  };

  const handleOpenPermissions = (user: User) => {
    setSelectedUserForPermissions(user);
    setEditingUserPermissions(user.customPermissions || data.config.rolePermissions.vendor);
    setIsPermissionsModalOpen(true);
  };

  const handleSaveUserPermissions = () => {
    if (selectedUserForPermissions) {
      updateUserPermissions(selectedUserForPermissions.id, editingUserPermissions);
      setSuccessMessage(`Permisos de ${selectedUserForPermissions.name} actualizados`);
      setShowSuccess(true);
      setIsPermissionsModalOpen(false);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleSaveRolePermissions = () => {
    updateRolePermissions(editingUserPermissions);
    setSuccessMessage('Permisos globales del rol Vendedor actualizados');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <ShieldCheck className="text-accent" /> Gestion de Usuarios
          </h1>
          <p className="text-gray-500 text-sm">Administra los accesos, roles y permisos de tu equipo.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="shadow-lg shadow-primary/20">
          <Plus size={18} /> Nuevo Usuario
        </Button>
      </div>

      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-scale-in">
          <CheckCircle size={20} />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={<UsersIcon />} label="Total" value={stats.total} color="bg-primary" />
        <StatCard icon={<UserCheck />} label="Activos" value={stats.active} color="bg-green-500" />
        <StatCard icon={<UserX />} label="Inactivos" value={stats.inactive} color="bg-red-500" />
        <StatCard icon={<Shield />} label="Admins" value={stats.admins} color="bg-purple-600" />
        <StatCard icon={<Briefcase />} label="Vendedores" value={stats.vendors} color="bg-orange-500" />
      </div>

      <div className="flex gap-2 border-b border-gray-border">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-primary'}`}
        >
          Gestion de Usuarios
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'permissions' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-primary'}`}
        >
          Permisos por Rol
        </button>
      </div>

      {activeTab === 'users' ? (
        <Card className="overflow-hidden animate-fade-in">
          <div className="bg-gray-50/50 border-b border-gray-border p-4 flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Buscar por nombre o correo..." 
                className="pl-10" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select 
                value={filterRole}
                onChange={e => setFilterRole(e.target.value)}
                options={[
                  { value: 'all', label: 'Todos los roles' },
                  { value: 'admin', label: 'Administradores' },
                  { value: 'vendor', label: 'Vendedores' }
                ]} 
              />
              <Select 
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                options={[
                  { value: 'all', label: 'Todos los estados' },
                  { value: 'active', label: 'Activos' },
                  { value: 'inactive', label: 'Inactivos' }
                ]} 
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-border">
                  <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-primary transition-colors" onClick={() => requestSort('name')}>
                    <div className="flex items-center gap-1">
                      Usuario <SortIcon active={sortConfig.key === 'name'} direction={sortConfig.direction} />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-primary transition-colors" onClick={() => requestSort('role')}>
                    <div className="flex items-center gap-1">
                      Rol <SortIcon active={sortConfig.key === 'role'} direction={sortConfig.direction} />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-primary transition-colors" onClick={() => requestSort('status')}>
                    <div className="flex items-center gap-1">
                      Estado <SortIcon active={sortConfig.key === 'status'} direction={sortConfig.direction} />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Permisos</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map(user => (
                  <tr key={user.id} className="border-b border-gray-border/50 hover:bg-gray-50/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail size={12} /> {user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {user.role === 'admin' ? <Shield size={12} /> : <Briefcase size={12} />}
                    {user.role === 'admin' ? 'Admin' : 'Vendedor'}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === 'active' ? 'active' : 'inactive'}>
                    {user.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.role === 'vendor' ? (
                    <button 
                      onClick={() => handleOpenPermissions(user)}
                      className={`text-xs font-semibold flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors ${user.customPermissions ? 'text-accent' : 'text-gray-400'}`}
                    >
                      <Lock size={12} />
                      {user.customPermissions ? 'Personalizados' : 'Por Defecto'}
                    </button>
                  ) : (
                    <span className="text-xs text-gray-300">Acceso Total</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(user)} title="Ver detalles">
                      <Eye size={14} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleOpenModal(user)} title="Editar">
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant={user.status === 'active' ? 'danger' : 'success'}
                      size="sm"
                      onClick={() => handleToggleStatus(user)}
                    >
                      {user.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
                    </Button>
                  </div>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
          
          {totalPages > 1 && (
            <div className="p-4 bg-gray-50/30 border-t border-gray-border flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Mostrando {paginatedUsers.length} de {filteredUsers.length} usuarios
              </span>
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
            </div>
          )}

          {filteredUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-gray-500 bg-white">
              <UserX size={48} className="text-gray-200 mb-4" />
              <p className="text-lg font-medium">No se encontraron usuarios</p>
              <p className="text-sm">Prueba ajustando los filtros o terminos de busqueda.</p>
            </div>
          )}
        </Card>
      ) : (
        <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Key className="text-accent" /> Permisos del Rol Vendedor
                </h2>
                <p className="text-sm text-gray-500">Configura los permisos predeterminados que tendran todos los vendedores.</p>
              </div>
              <Button onClick={handleSaveRolePermissions}>
                <CheckCircle size={18} /> Guardar Cambios
              </Button>
            </div>
          </CardHeader>
          <CardBody className="bg-gray-50/30">
            <PermissionsGrid permissions={editingUserPermissions} onChange={setEditingUserPermissions} />
          </CardBody>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit}>
              {editingUser ? 'Guardar Cambios' : 'Registrar Usuario'}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="col-span-1 md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-border mb-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <PartyPopper size={14} className="text-accent" /> Selecciona tu Avatar
            </h3>
            <div className="max-h-32 overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex flex-wrap gap-3 justify-center md:justify-start py-1">
                {AVATARS.map((avatar, index) => (
                  <div 
                    key={index}
                    onClick={() => setFormData({ ...formData, avatar })}
                    className={`w-12 h-12 rounded-full cursor-pointer transition-all border-2 overflow-hidden shadow-sm hover:scale-110 ${formData.avatar === avatar ? 'border-accent ring-2 ring-accent/20 scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={avatar} alt={`Avatar ${index}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3 pb-2 border-b border-gray-border">Datos Personales</h3>
          </div>
          
          <FormField label="Nombre Completo" error={errors.name}>
            <Input 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej. Juan Perez"
              error={errors.name}
            />
          </FormField>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <FormField label="Tipo">
                <Select 
                  value={formData.docType} 
                  onChange={e => setFormData({ ...formData, docType: e.target.value })}
                  options={[{ value: 'CC', label: 'CC' }, { value: 'CE', label: 'CE' }, { value: 'PP', label: 'Pasaporte' }]}
                />
              </FormField>
            </div>
            <div className="col-span-2">
              <FormField label="Documento" error={errors.docNumber}>
                <Input 
                  value={formData.docNumber} 
                  onChange={e => setFormData({ ...formData, docNumber: e.target.value })}
                  placeholder="Numero de identificacion"
                  error={errors.docNumber}
                  disabled={!!editingUser}
                />
              </FormField>
            </div>
          </div>

          <FormField label="Telefono / Celular" error={errors.phone}>
            <Input 
              value={formData.phone} 
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="300 000 0000"
              error={errors.phone}
            />
          </FormField>

          <FormField label="Fecha de Nacimiento">
            <Input type="date" value={formData.birthDate} onChange={e => setFormData({ ...formData, birthDate: e.target.value })} />
          </FormField>

          <div className="col-span-1 md:col-span-2 mt-2">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3 pb-2 border-b border-gray-border">Configuracion de Acceso</h3>
          </div>

          <FormField label="Correo Electronico" error={errors.email}>
            <Input 
              type="email" 
              value={formData.email} 
              onChange={e => setFormData({ ...formData, email: e.target.value })} 
              placeholder="correo@ejemplo.com" 
              disabled={!!editingUser}
              error={errors.email}
            />
          </FormField>

          <FormField label="Contrasena" error={errors.password}>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                value={formData.password} 
                onChange={e => setFormData({ ...formData, password: e.target.value })} 
                placeholder={editingUser ? "Dejar en blanco para no cambiar" : "Minimo 6 caracteres"}
                error={errors.password}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </FormField>

          <FormField label="Rol de Usuario">
            <Select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value as 'admin' | 'vendor' })} options={[{ value: 'vendor', label: 'Vendedor' }, { value: 'admin', label: 'Administrador' }]} />
          </FormField>

          <FormField label="Estado Inicial">
            <Select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })} options={[{ value: 'active', label: 'Activo' }, { value: 'inactive', label: 'Inactivo' }]} />
          </FormField>
        </div>
      </Modal>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detalles del Usuario"
        size="md"
        footer={<Button onClick={() => setIsDetailModalOpen(false)}>Cerrar</Button>}
      >
        {selectedUserForDetail && (
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-b from-primary/5 to-transparent rounded-2xl border border-primary/5">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl mb-4 overflow-hidden bg-primary/10">
                {selectedUserForDetail.avatar ? (
                  <img src={selectedUserForDetail.avatar} alt={selectedUserForDetail.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary">
                    {selectedUserForDetail.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold text-primary">{selectedUserForDetail.name}</h2>
              <Badge variant={selectedUserForDetail.status === 'active' ? 'active' : 'inactive'} className="mt-1">
                {selectedUserForDetail.status === 'active' ? 'USUARIO ACTIVO' : 'USUARIO INACTIVO'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DetailItem icon={<Shield size={16} />} label="Rol" value={selectedUserForDetail.role === 'admin' ? 'Administrador' : 'Vendedor'} />
              <DetailItem icon={<Mail size={16} />} label="Correo" value={selectedUserForDetail.email} />
              <DetailItem icon={<Hash size={16} />} label="Documento" value={`${selectedUserForDetail.docType || 'CC'} ${selectedUserForDetail.docNumber || '---'}`} />
              <DetailItem icon={<Phone size={16} />} label="Telefono" value={selectedUserForDetail.phone || '---'} />
              <DetailItem icon={<Calendar size={16} />} label="Nacimiento" value={selectedUserForDetail.birthDate || '---'} />
              <DetailItem icon={<Settings size={16} />} label="ID Sistema" value={`#${selectedUserForDetail.id}`} />
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-gray-border">
                  <Lock size={18} className="text-accent" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-700">Configuracion de Permisos</div>
                  <div className="text-xs text-gray-500">{selectedUserForDetail.customPermissions ? 'Tiene reglas personalizadas' : 'Usa reglas globales del rol'}</div>
                </div>
              </div>
              {selectedUserForDetail.role === 'vendor' && (
                <Button size="sm" variant="outline" onClick={() => { setIsDetailModalOpen(false); handleOpenPermissions(selectedUserForDetail); }}>
                  Ajustar
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        title={`Permisos: ${selectedUserForPermissions?.name}`}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsPermissionsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveUserPermissions}>Guardar Permisos</Button>
          </>
        }
      >
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg flex gap-3 text-sm mb-6">
          <AlertCircle className="shrink-0" size={18} />
          <p>Al guardar, estos permisos <strong>sobrescribiran</strong> los permisos globales del rol vendedor solo para este usuario.</p>
        </div>
        <PermissionsGrid permissions={editingUserPermissions} onChange={setEditingUserPermissions} />
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

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="p-3 bg-white border border-gray-border/50 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-tighter mb-1">{icon} {label}</div>
      <div className="text-sm font-semibold text-gray-800 truncate">{value}</div>
    </div>
  );
}

function PermissionsGrid({ permissions, onChange }: { permissions: RolePermissions, onChange: (p: RolePermissions) => void }) {
  const updatePermission = (module: keyof RolePermissions, field: string, value: any) => {
    onChange({ ...permissions, [module]: { ...(permissions[module] as any), [field]: value } });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PermissionModule title="Dashboard" icon={<LayoutDashboard size={18} />} description="Acceso a metricas de rendimiento.">
        <RadioGroup label="Visibilidad de datos" value={permissions.dashboard.view} options={[{ value: 'own', label: 'Solo lo propio' }, { value: 'all', label: 'Todo el sistema' }]} onChange={(v) => updatePermission('dashboard', 'view', v)} />
      </PermissionModule>
      <PermissionModule title="Ventas" icon={<ShoppingBag size={18} />} description="Gestion de registros de ventas.">
        <Toggle label="Crear nuevas ventas" checked={permissions.sales.create} onChange={(v) => updatePermission('sales', 'create', v)} />
        <RadioGroup label="Editar registros" value={permissions.sales.edit} options={[{ value: 'none', label: 'Bloqueado' }, { value: 'own', label: 'Solo propios' }, { value: 'all', label: 'Todos' }]} onChange={(v) => updatePermission('sales', 'edit', v)} />
        <Toggle label="Eliminar ventas" checked={permissions.sales.delete} onChange={(v) => updatePermission('sales', 'delete', v)} />
      </PermissionModule>
      <PermissionModule title="Clientes" icon={<UsersGroup size={18} />} description="Base de datos de clientes.">
        <Toggle label="Crear clientes" checked={permissions.clients.create} onChange={(v) => updatePermission('clients', 'create', v)} />
        <RadioGroup label="Editar clientes" value={permissions.clients.edit} options={[{ value: 'none', label: 'Bloqueado' }, { value: 'own', label: 'Solo propios' }, { value: 'all', label: 'Todos' }]} onChange={(v) => updatePermission('clients', 'edit', v)} />
      </PermissionModule>
      <PermissionModule title="Itinerarios" icon={<Map size={18} />} description="Gestion de vuelos y rutas.">
        <Toggle label="Ver itinerarios" checked={permissions.itineraries.view} onChange={(v) => updatePermission('itineraries', 'view', v)} />
        <Toggle label="Editar (Check-in)" checked={permissions.itineraries.edit} onChange={(v) => updatePermission('itineraries', 'edit', v)} />
      </PermissionModule>
      <PermissionModule title="Configuracion" icon={<Settings size={18} />} description="Tablas maestras y sistema.">
        <Toggle label="Acceso a tablas maestras" checked={permissions.config.view} onChange={(v) => updatePermission('config', 'view', v)} />
        <Toggle label="Modificar catalogos" checked={permissions.config.edit} onChange={(v) => updatePermission('config', 'edit', v)} />
      </PermissionModule>
    </div>
  );
}

function PermissionModule({ title, icon, description, children }: { title: string, icon: React.ReactNode, description: string, children: React.ReactNode }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-border shadow-sm flex flex-col gap-3">
      <div className="flex items-center gap-3 mb-1">
        <div className="p-2 bg-primary/5 rounded-lg text-primary">{icon}</div>
        <div><h3 className="text-sm font-bold text-primary">{title}</h3><p className="text-[11px] text-gray-500">{description}</p></div>
      </div>
      <div className="space-y-3 pt-2 border-t border-gray-50">{children}</div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-xs font-medium text-gray-600 group-hover:text-primary transition-colors">{label}</span>
      <div onClick={() => onChange(!checked)} className={`w-10 h-5 rounded-full relative transition-all duration-300 ${checked ? 'bg-accent' : 'bg-gray-200'}`}>
        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${checked ? 'left-6' : 'left-1'}`} />
      </div>
    </label>
  );
}

function RadioGroup({ label, value, options, onChange }: { label: string, value: string, options: { value: string, label: string }[], onChange: (v: any) => void }) {
  return (
    <div className="space-y-1.5">
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button key={opt.value} onClick={() => onChange(opt.value)} className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${value === opt.value ? 'bg-primary border-primary text-white' : 'bg-gray-50 border-gray-border text-gray-500 hover:border-primary/30'}`}>{opt.label.toUpperCase()}</button>
        ))}
      </div>
    </div>
  );
}

function SortIcon({ active, direction }: { active: boolean, direction: 'asc' | 'desc' }) {
  if (!active) return <ArrowUpDown size={12} className="text-gray-300" />;
  return direction === 'asc' ? <ArrowUp size={12} className="text-primary" /> : <ArrowDown size={12} className="text-primary" />;
}

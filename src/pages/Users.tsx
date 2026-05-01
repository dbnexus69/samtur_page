import { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Pencil, Search, Users as UsersIcon, UserCheck, UserX, 
  AlertCircle, CheckCircle, PartyPopper, Shield, Settings, Eye, EyeOff,
  Mail, Phone, Calendar, Hash, ShieldCheck, Briefcase, Lock,
  Globe, LayoutDashboard, ShoppingBag, Users as UsersGroup, Map, Key,
  ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight,
  Trash2, AlertTriangle, Edit, X
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
  const { data, addUser, updateUser, deleteUser, updateRolePermissions, updateUserPermissions } = useData();
  const { user: currentUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'users' | 'permissions'>('users');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<User | null>(null);
  const [selectedUserForPermissions, setSelectedUserForPermissions] = useState<User | null>(null);
  const [editingUserPermissions, setEditingUserPermissions] = useState<RolePermissions>(data.config.rolePermissions?.vendor || DEFAULT_VENDOR_PERMISSIONS);
  
  // Eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.docNumber.includes(searchTerm);
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

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      const nameParts = user.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      setFormData({
        firstName,
        lastName,
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
        firstName: '',
        lastName: '',
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
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSaveUser = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';
    if (!formData.email.trim()) newErrors.email = 'El correo es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'El correo no es valido';
    
    if (!editingUser && !formData.password.trim()) newErrors.password = 'La contraseña es obligatoria';
    
    if (!formData.docNumber.trim()) newErrors.docNumber = 'El numero de documento es obligatorio';
    else if (formData.docNumber.length > 20) newErrors.docNumber = 'El documento no puede exceder 20 caracteres';
    
    if (!formData.phone.trim()) newErrors.phone = 'El telefono es obligatorio';
    else if (!/^\d+$/.test(formData.phone)) newErrors.phone = 'El telefono solo debe contener numeros';
    else if (formData.phone.length > 20) newErrors.phone = 'El telefono no puede exceder 20 caracteres';
    
    if (!formData.birthDate) newErrors.birthDate = 'La fecha de nacimiento es obligatoria';

    if (formData.firstName.length > 50) newErrors.firstName = 'El nombre no puede exceder 50 caracteres';
    if (formData.lastName.length > 50) newErrors.lastName = 'El apellido no puede exceder 50 caracteres';
    if (formData.email.length > 100) newErrors.email = 'El correo no puede exceder 100 caracteres';

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
      updateUser(editingUser.id, {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim()
      });
      setSuccessMessage('Usuario actualizado exitosamente');
    } else {
      addUser({
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim()
      } as any);
      setSuccessMessage('Nuevo usuario registrado correctamente');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    setShowSuccess(true);
    setIsModalOpen(false);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleToggleStatus = (user: User) => {
    const action = user.status === 'active' ? 'desactivado' : 'activado';
    updateUser(user.id, {
      status: user.status === 'active' ? 'inactive' : 'active'
    });
    setSuccessMessage(`Usuario ${user.name} ${action} correctamente`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDeleteRequest = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      setSuccessMessage('Usuario eliminado correctamente');
      setShowSuccess(true);
      setIsDeleteModalOpen(false);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleOpenPermissions = (user: User) => {
    setSelectedUserForPermissions(user);
    setEditingUserPermissions(user.customPermissions || data.config.rolePermissions[user.role]);
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
    <div className="p-6 max-w-7xl mx-auto space-y-6 relative animate-fade-in">
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <ShieldCheck className="text-accent w-8 h-8" /> Gestión de Usuarios
          </h1>
          <p className="text-gray-500 text-sm mt-1">Administra los accesos, roles y permisos de tu equipo corporativo.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="shadow-lg shadow-primary/20">
          <Plus size={18} /> Nuevo Usuario
        </Button>
      </div>

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
          Lista de Usuarios
        </button>
        <button
          onClick={() => {
            setActiveTab('permissions');
            setEditingUserPermissions(data.config.rolePermissions.vendor);
          }}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'permissions' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-primary'}`}
        >
          Permisos por Rol
        </button>
      </div>

      {activeTab === 'users' ? (
        <Card>
          <CardHeader actions={
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={filterRole}
                onChange={e => setFilterRole(e.target.value)}
                options={[
                  { value: 'all', label: 'Todos los Roles' },
                  { value: 'admin', label: 'Admins' },
                  { value: 'vendor', label: 'Vendedores' }
                ]}
                className="w-32 py-1.5"
              />
            </div>
          }>
            Personal de la Agencia
          </CardHeader>
          <Table headers={['#', 'Usuario', 'Rol', 'Documento', 'Teléfono', 'Estado', 'Acciones']}>
            {filteredUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} className="w-8 h-8 rounded-full border border-gray-200" alt={user.name} />
                    <div className="flex flex-col">
                      <span className="font-medium text-primary leading-tight">{user.name}</span>
                      <span className="text-[10px] text-gray-500">{user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'active' : 'inactive'} className="uppercase text-[9px]">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs">{user.docType} {user.docNumber}</TableCell>
                <TableCell className="text-xs">{user.phone}</TableCell>
                <TableCell>
                  <Badge variant={user.status}>{user.status === 'active' ? 'Activo' : 'Inactivo'}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenModal(user)} title="Editar">
                      <Edit size={14} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleOpenPermissions(user)} title="Permisos">
                      <Key size={14} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleToggleStatus(user)} title={user.status === 'active' ? 'Desactivar' : 'Activar'}>
                      {user.status === 'active' ? <UserX size={14} className="text-red-500" /> : <UserCheck size={14} className="text-green-500" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteRequest(user)} title="Eliminar">
                      <Trash2 size={14} className="text-red-400" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </Card>
      ) : (
        <Card className="animate-fade-in">
          <CardHeader actions={
            <Button onClick={handleSaveRolePermissions}>
              <ShieldCheck size={18} /> Guardar Cambios Globales
            </Button>
          }>
            Configuración de Permisos por Defecto: Vendedores
          </CardHeader>
          <CardBody>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl mb-6 flex gap-3">
              <AlertCircle className="text-amber-500 shrink-0" size={20} />
              <p className="text-xs text-amber-700 leading-relaxed">
                Aquí defines lo que un <b>Vendedor</b> puede hacer de forma predeterminada al ser registrado. 
                Los cambios aplicarán a todos los vendedores existentes que no tengan permisos personalizados.
              </p>
            </div>
            <PermissionsGrid 
              permissions={editingUserPermissions} 
              onChange={setEditingUserPermissions} 
            />
          </CardBody>
        </Card>
      )}

      {/* Modales */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveUser}>Guardar</Button>
          </>
        }
      >
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-border mb-6">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Selecciona Avatar</h3>
          <div className="flex flex-wrap gap-2">
            {AVATARS.map((avatar, i) => (
              <img 
                key={i} 
                src={avatar} 
                onClick={() => setFormData({...formData, avatar})}
                className={`w-10 h-10 rounded-full cursor-pointer border-2 transition-all hover:scale-110 ${formData.avatar === avatar ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Nombres" error={errors.firstName}>
            <Input value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
          </FormField>
          <FormField label="Apellidos" error={errors.lastName}>
            <Input value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
          </FormField>
          <FormField label="Correo" error={errors.email}>
            <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </FormField>
          <FormField label="Contraseña" error={errors.password}>
            <div className="relative">
              <Input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FormField>
          <FormField label="Rol">
            <Select 
              value={formData.role} 
              onChange={e => setFormData({...formData, role: e.target.value as 'admin' | 'vendor'})}
              options={[{value: 'admin', label: 'Administrador'}, {value: 'vendor', label: 'Vendedor'}]}
            />
          </FormField>
          <FormField label="Tipo Doc">
            <Select 
              value={formData.docType} 
              onChange={e => setFormData({...formData, docType: e.target.value})}
              options={[{value: 'CC', label: 'Cédula de Ciudadanía'}, {value: 'CE', label: 'Cédula de Extranjería'}, {value: 'PP', label: 'Pasaporte'}]}
            />
          </FormField>
          <FormField label="Documento" error={errors.docNumber}>
            <Input value={formData.docNumber} onChange={e => setFormData({...formData, docNumber: e.target.value})} />
          </FormField>
          <FormField label="Teléfono" error={errors.phone}>
            <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </FormField>
          <FormField label="Fecha Nacimiento" error={errors.birthDate}>
            <Input type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
          </FormField>
          <FormField label="Estado">
            <Select 
              value={formData.status} 
              onChange={e => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
              options={[{value: 'active', label: 'Activo'}, {value: 'inactive', label: 'Inactivo'}]}
            />
          </FormField>
        </div>
      </Modal>

      <Modal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        title={`Permisos: ${selectedUserForPermissions?.name}`}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsPermissionsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveUserPermissions}>Actualizar Permisos</Button>
          </>
        }
      >
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
          <ShieldCheck className="text-blue-500 shrink-0" size={24} />
          <div>
            <p className="text-sm font-bold text-blue-900">Configuración Personalizada</p>
            <p className="text-xs text-blue-700">Estos permisos sobrescriben la configuración global para este usuario específico.</p>
          </div>
        </div>
        <PermissionsGrid permissions={editingUserPermissions} onChange={setEditingUserPermissions} />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Eliminar Usuario"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
            <Button variant="danger" onClick={confirmDelete}>Confirmar Eliminación</Button>
          </>
        }
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">¿Estás seguro?</h3>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            Esta acción eliminará permanentemente al usuario <b>{userToDelete?.name}</b>. 
            Esta acción no se puede deshacer.
          </p>
        </div>
      </Modal>

    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) {
  return (
    <Card className={`text-white ${color} border-none shadow-lg`}>
      <CardBody className="flex items-center gap-4 py-3 px-4">
        <div className="p-2 bg-white/20 rounded-lg">{icon}</div>
        <div>
          <p className="text-[10px] font-medium text-white/70 uppercase tracking-wider">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </CardBody>
    </Card>
  );
}

function PermissionsGrid({ permissions, onChange }: { permissions: RolePermissions, onChange: (p: RolePermissions) => void }) {
  const toggle = (module: keyof RolePermissions, type: string) => {
    const next = { ...permissions };
    const modulePerms = { ...next[module] } as any;
    if (type in modulePerms) {
      if (typeof modulePerms[type] === 'boolean') {
        modulePerms[type] = !modulePerms[type];
      } else {
        // Para tipos string (como 'all' | 'own'), el toggle simple no aplica,
        // pero evitamos el error de tipo. Aquí podrías implementar una lógica de ciclo
        // o dejarlo para un selector específico. Por ahora evitamos el crash.
        if (modulePerms[type] === 'all') modulePerms[type] = 'own';
        else if (modulePerms[type] === 'own') modulePerms[type] = 'none';
        else modulePerms[type] = 'all';
      }
      (next as any)[module] = modulePerms;
      onChange(next);
    }
  };

  const modules: { id: keyof RolePermissions, label: string, icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={14} /> },
    { id: 'sales', label: 'Ventas', icon: <ShoppingBag size={14} /> },
    { id: 'clients', label: 'Clientes', icon: <UsersGroup size={14} /> },
    { id: 'itineraries', label: 'Itinerarios', icon: <Map size={14} /> },
    { id: 'users', label: 'Usuarios', icon: <Lock size={14} /> },
    { id: 'config', label: 'Configuración', icon: <Settings size={14} /> }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {modules.map(mod => (
        <div key={mod.id} className="p-4 border border-gray-border rounded-xl bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b">
            <div className="p-1.5 bg-gray-50 text-primary rounded-lg">{mod.icon}</div>
            <span className="font-bold text-sm text-primary">{mod.label}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(permissions[mod.id]).map(permKey => {
              const val = (permissions[mod.id] as any)[permKey];
              return (
                <div key={permKey} className="flex flex-col gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{permKey}</span>
                  {typeof val === 'boolean' ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded text-primary focus:ring-primary/20 w-4 h-4"
                        checked={val} 
                        onChange={() => toggle(mod.id, permKey)} 
                      />
                      <span className="text-xs font-medium text-gray-600">{val ? 'Activado' : 'Desactivado'}</span>
                    </label>
                  ) : (
                    <select 
                      className="text-xs bg-transparent border-none p-0 font-bold text-primary focus:ring-0 cursor-pointer"
                      value={val}
                      onChange={(e) => {
                        const next = { ...permissions };
                        (next[mod.id] as any)[permKey] = e.target.value;
                        onChange(next);
                      }}
                    >
                      <option value="all">Todo (All)</option>
                      <option value="own">Solo Propio (Own)</option>
                      <option value="none">Ninguno (None)</option>
                    </select>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

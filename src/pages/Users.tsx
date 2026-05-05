import { useState, useMemo } from "react";
import { Plus, CheckCircle, Users as UsersIcon, UserCheck, UserX, ShieldCheck, Shield, Briefcase } from "lucide-react";
import { useData } from "../context/DataContext";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { User, RolePermissions, ADMIN_PERMISSIONS, DEFAULT_VENDOR_PERMISSIONS } from "../types";
import { AVATARS } from "../config/avatars";
import {
  UserStatCard,
  UserFormModal,
  UsersListTable,
  UsersFilters,
  PermissionsModal,
  DeleteUserModal,
} from "../components/users";

const initialPermissions: RolePermissions = DEFAULT_VENDOR_PERMISSIONS;

export default function Users() {
  const { data, addUser, updateUser, deleteUser, updateRolePermissions, updateUserPermissions } = useData();

  const [activeTab, setActiveTab] = useState<"users" | "permissions">("users");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUserForPermissions, setSelectedUserForPermissions] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editingUserPermissions, setEditingUserPermissions] = useState<RolePermissions>(initialPermissions);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "vendor" as "admin" | "vendor",
    docType: "CC",
    docNumber: "",
    phone: "",
    birthDate: "",
    status: "active" as "active" | "inactive",
    avatar: AVATARS[0],
  });

  const stats = useMemo(() => ({
    total: data.users.length,
    active: data.users.filter((u) => u.status === "active").length,
    inactive: data.users.filter((u) => u.status === "inactive").length,
    admins: data.users.filter((u) => u.role === "admin").length,
    vendors: data.users.filter((u) => u.role === "vendor").length,
  }), [data.users]);

  const filteredUsers = useMemo(() => {
    return data.users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.docNumber.includes(searchTerm);
      const matchesRole = filterRole === "all" || user.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [data.users, searchTerm, filterRole]);

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      const nameParts = user.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      setFormData({
        firstName,
        lastName,
        email: user.email,
        password: user.password,
        role: user.role,
        docType: user.docType || "CC",
        docNumber: user.docNumber || "",
        phone: user.phone || "",
        birthDate: user.birthDate || "",
        status: user.status,
        avatar: user.avatar || AVATARS[0],
      });
    } else {
      setEditingUser(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "vendor",
        docType: "CC",
        docNumber: "",
        phone: "",
        birthDate: "",
        status: "active",
        avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSaveUser = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "El nombre es obligatorio";
    if (!formData.lastName.trim()) newErrors.lastName = "El apellido es obligatorio";
    if (!formData.email.trim()) newErrors.email = "El correo es obligatorio";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "El correo no es válido";
    if (!editingUser && !formData.password.trim()) newErrors.password = "La contraseña es obligatoria";
    if (!formData.docNumber.trim()) newErrors.docNumber = "El número de documento es obligatorio";
    if (!formData.phone.trim()) newErrors.phone = "El teléfono es obligatorio";
    if (!formData.birthDate) newErrors.birthDate = "La fecha de nacimiento es obligatoria";

    const isDuplicateEmail = data.users.some(
      (u) => u.email.toLowerCase() === formData.email.toLowerCase() && (!editingUser || u.id !== editingUser.id)
    );
    if (isDuplicateEmail) newErrors.email = "Este correo ya está registrado";

    const isDuplicateDoc = data.users.some(
      (u) => u.docNumber === formData.docNumber && (!editingUser || u.id !== editingUser.id)
    );
    if (isDuplicateDoc) newErrors.docNumber = "Este número de documento ya está registrado";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (editingUser) {
      updateUser(editingUser.id, {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
      });
      setSuccessMessage("Usuario actualizado exitosamente");
    } else {
      addUser({
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
      } as User);
      setSuccessMessage("Nuevo usuario registrado correctamente");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    setShowSuccess(true);
    setIsModalOpen(false);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleToggleStatus = (user: User) => {
    const action = user.status === "active" ? "desactivado" : "activado";
    updateUser(user.id, {
      status: user.status === "active" ? "inactive" : "active",
    });
    setSuccessMessage(`Usuario ${user.name} ${action} correctamente`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleOpenPermissions = (user: User) => {
    setSelectedUserForPermissions(user);
    const defaultPerms = user.role === "admin" ? ADMIN_PERMISSIONS : data.config.rolePermissions.vendor;
    setEditingUserPermissions(user.customPermissions || defaultPerms);
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
    setSuccessMessage("Permisos globales del rol Vendedor actualizados");
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
      setSuccessMessage("Usuario eliminado correctamente");
      setShowSuccess(true);
      setIsDeleteModalOpen(false);
      setTimeout(() => setShowSuccess(false), 3000);
    }
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
                color: ["#FFD700", "#FF4500", "#00BFFF", "#32CD32", "#FF69B4"][Math.floor(Math.random() * 5)],
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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <ShieldCheck className="text-accent w-8 h-8" /> Gestión de Usuarios
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Administra los accesos, roles y permisos de tu equipo corporativo.
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="shadow-lg shadow-primary/20"
        >
          <Plus size={18} /> Nuevo Usuario
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <UserStatCard icon={<UsersIcon />} label="Total" value={stats.total} color="bg-primary" />
        <UserStatCard icon={<UserCheck />} label="Activos" value={stats.active} color="bg-green-500" />
        <UserStatCard icon={<UserX />} label="Inactivos" value={stats.inactive} color="bg-red-500" />
        <UserStatCard icon={<Shield />} label="Admins" value={stats.admins} color="bg-purple-600" />
        <UserStatCard icon={<Briefcase />} label="Vendedores" value={stats.vendors} color="bg-orange-500" />
      </div>

      <div className="flex gap-2 border-b border-gray-border">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "users"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-primary"
          }`}
        >
          Lista de Usuarios
        </button>
        <button
          onClick={() => {
            setActiveTab("permissions");
            setEditingUserPermissions(data.config.rolePermissions.vendor);
          }}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "permissions"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-primary"
          }`}
        >
          Permisos por Rol
        </button>
      </div>

      {activeTab === "users" ? (
        <Card>
          <CardHeader
            actions={
              <UsersFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterRole={filterRole}
                onFilterRoleChange={setFilterRole}
              />
            }
          >
            Personal de la Agencia
          </CardHeader>
          <UsersListTable
            users={filteredUsers}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterRole={filterRole}
            onFilterRoleChange={setFilterRole}
            onEdit={handleOpenModal}
            onPermissions={handleOpenPermissions}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteRequest}
          />
        </Card>
      ) : (
        <Card className="animate-fade-in">
          <CardHeader
            actions={
              <Button onClick={handleSaveRolePermissions}>
                <ShieldCheck size={18} /> Guardar Cambios Globales
              </Button>
            }
          >
            Configuración de Permisos por Defecto: Vendedores
          </CardHeader>
          <CardBody>
            <PermissionsModal
              isOpen={true}
              onClose={() => {}}
              onSave={handleSaveRolePermissions}
              user={null}
              permissions={editingUserPermissions}
              onPermissionsChange={setEditingUserPermissions}
              isGlobal={true}
            />
          </CardBody>
        </Card>
      )}

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        editingUser={editingUser}
        formData={formData}
        onFormChange={setFormData}
        errors={errors}
        onErrorsChange={setErrors}
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
      />

      <PermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        onSave={handleSaveUserPermissions}
        user={selectedUserForPermissions}
        permissions={editingUserPermissions}
        onPermissionsChange={setEditingUserPermissions}
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        user={userToDelete}
      />
    </div>
  );
}
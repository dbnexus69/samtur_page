import { useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { FormField, Input, Select } from '../components/ui/Form';
import { Table, TableRow, TableCell } from '../components/ui/Table';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';

export default function Users() {
  const { data, addUser, updateUser } = useData();
  const { user: currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'vendor',
    status: 'active'
  });

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        status: user.status
      });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'vendor', status: 'active' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (editingUser) {
      updateUser(editingUser.id, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role as User['role'],
        status: formData.status as User['status']
      });
    } else {
      addUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role as User['role'],
        status: formData.status as User['status']
      });
    }
    setIsModalOpen(false);
  };

  const handleToggleStatus = (user: User) => {
    if (user.id === currentUser?.id) {
      alert('No puedes desactivar tu propio usuario');
      return;
    }
    updateUser(user.id, {
      status: user.status === 'active' ? 'inactive' : 'active'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader actions={
          <Button onClick={() => handleOpenModal()}>
            <Plus size={18} />
            Nuevo Usuario
          </Button>
        }>
          Usuarios del Sistema
        </CardHeader>
        <Table headers={['#', 'Nombre', 'Correo', 'Rol', 'Estado', 'Acciones']}>
          {data.users.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role === 'admin' ? 'Administrador' : 'Vendedor'}</TableCell>
              <TableCell><Badge variant={user.status}>{user.status === 'active' ? 'Activo' : 'Inactivo'}</Badge></TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenModal(user)}>
                    <Pencil size={14} />
                  </Button>
                  <Button
                    variant={user.status === 'active' ? 'danger' : 'success'}
                    size="sm"
                    onClick={() => handleToggleStatus(user)}
                  >
                    {user.status === 'active' ? 'Desactivar' : 'Activar'}
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
        title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
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
        <FormField label="Correo Electronico">
          <Input
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            placeholder="correo@ejemplo.com"
          />
        </FormField>
        <FormField label="Contrasena">
          <Input
            type="password"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            placeholder="Contrasena"
          />
        </FormField>
        <FormField label="Rol">
          <Select
            value={formData.role}
            onChange={e => setFormData({ ...formData, role: e.target.value })}
            options={[
              { value: 'vendor', label: 'Vendedor' },
              { value: 'admin', label: 'Administrador' }
            ]}
          />
        </FormField>
      </Modal>
    </div>
  );
}
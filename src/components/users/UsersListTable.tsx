import { User } from "../../types";
import { Button } from "../ui/Button";
import { Table, TableRow, TableCell } from "../ui/Table";
import { Badge } from "../ui/Badge";

interface UsersListTableProps {
  users: User[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterRole: string;
  onFilterRoleChange: (role: string) => void;
  onEdit: (user: User) => void;
  onPermissions: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UsersListTable({
  users,
  searchTerm,
  onSearchChange,
  filterRole,
  onFilterRoleChange,
  onEdit,
  onPermissions,
  onToggleStatus,
  onDelete,
}: UsersListTableProps) {
  return (
    <Table
      headers={[
        "#",
        "Usuario",
        "Rol",
        "Documento",
        "Teléfono",
        "Estado",
        "Acciones",
      ]}
    >
      {users.map((user) => (
        <TableRow key={user.id}>
          <TableCell>{user.id}</TableCell>
          <TableCell>
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                className="w-8 h-8 rounded-full border border-gray-200"
                alt={user.name}
              />
              <div className="flex flex-col">
                <span className="font-medium text-primary leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] text-gray-500">{user.email}</span>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Badge
              variant={user.role === "admin" ? "active" : "inactive"}
              className="uppercase text-[9px]"
            >
              {user.role}
            </Badge>
          </TableCell>
          <TableCell className="text-xs">
            {user.docType} {user.docNumber}
          </TableCell>
          <TableCell className="text-xs">{user.phone}</TableCell>
          <TableCell>
            <Badge variant={user.status}>
              {user.status === "active" ? "Activo" : "Inactivo"}
            </Badge>
          </TableCell>
          <TableCell>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(user)}
                title="Editar"
              >
                <EditIcon />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPermissions(user)}
                title="Permisos"
              >
                <KeyIcon />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleStatus(user)}
                title={user.status === "active" ? "Desactivar" : "Activar"}
              >
                {user.status === "active" ? (
                  <UserXIcon className="text-red-500" />
                ) : (
                  <UserCheckIcon className="text-green-500" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(user)}
                title="Eliminar"
              >
                <TrashIcon className="text-red-400" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
}

function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3" />
    </svg>
  );
}

function TrashIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function UserXIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="22" x2="16" y1="15" y2="15" />
      <line x1="19" x2="22" y1="18" y2="21" />
    </svg>
  );
}

function UserCheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}
import { useState } from "react";
import { Eye, Pencil, UserCheck, UserX } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Table, TableRow, TableCell } from "../ui/Table";
import { Input } from "../ui/Form";
import { Client } from "../../types";
import { formatDate } from "../../utils/formatters";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface ClientsListTableProps {
  clients: Client[];
  canEdit: boolean;
  onEdit: (client: Client) => void;
  onView: (client: Client) => void;
  onToggleStatus: (id: number) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: "all" | "active" | "inactive";
  onStatusFilterChange: (status: "all" | "active" | "inactive") => void;
}

interface SortConfig {
  key: keyof Client;
  direction: "asc" | "desc";
}

export function ClientsListTable({
  clients,
  canEdit,
  onEdit,
  onView,
  onToggleStatus,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: ClientsListTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "name",
    direction: "asc",
  });

  const requestSort = (key: keyof Client) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredClients = clients
    .filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.docNumber.includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || client.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key] || "";
      const bValue = b[sortConfig.key] || "";
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  const SortIcon = ({ active, direction }: { active: boolean; direction: "asc" | "desc" }) => {
    if (!active) return <ArrowUpDown size={12} className="text-gray-300" />;
    return direction === "asc" ? (
      <ArrowUp size={12} className="text-white bg-primary rounded-full p-0.5" />
    ) : (
      <ArrowDown size={12} className="text-white bg-primary rounded-full p-0.5" />
    );
  };

  return (
    <>
      <div className="flex gap-3 items-center flex-wrap mb-4">
        <div className="relative">
          <Input
            placeholder="Buscar por nombre, doc o correo..."
            className="pl-10 pr-9 w-72"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded"
            >
              ✕
            </button>
          )}
        </div>
        <select
          value={statusFilter}
          onChange={(e) =>
            onStatusFilterChange(e.target.value as "all" | "active" | "inactive")
          }
          className="text-sm border border-gray-border rounded-lg px-3 py-2 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">Todos los estados</option>
          <option value="active">Solo Activos</option>
          <option value="inactive">Solo Inactivos</option>
        </select>
      </div>

      <Table
        headers={[
          { key: "id", label: "#" },
          { key: "name", label: "Cliente" },
          { key: "docType", label: "Tipo Doc" },
          { key: "docNumber", label: "Número Doc" },
          { key: "phone", label: "Teléfono" },
          { key: "status", label: "Estado" },
          { key: "registrationDate", label: "Registro" },
          { key: null, label: "Acciones" },
        ].map((header) => (
          <div
            key={header.label}
            className={`flex items-center gap-2 ${
              header.key ? "cursor-pointer hover:text-primary transition-colors" : ""
            }`}
            onClick={() => header.key && requestSort(header.key as keyof Client)}
          >
            {header.label}
            {header.key && (
              <SortIcon
                active={sortConfig.key === header.key}
                direction={sortConfig.direction}
              />
            )}
          </div>
        ))}
      >
        {filteredClients.map((client) => (
          <TableRow key={client.id}>
            <TableCell>{client.id}</TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold overflow-hidden">
                  {client.avatar ? (
                    <img
                      src={client.avatar}
                      alt={client.name}
                      className="w-full h-full object-cover"
                    />
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
              <Badge variant={client.status}>
                {client.status === "active" ? "Activo" : "Inactivo"}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(client.registrationDate)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onView(client)} title="Ver detalle">
                  <Eye size={14} />
                </Button>
                {canEdit && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => onEdit(client)} title="Editar">
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggleStatus(client.id)}
                      title={client.status === "active" ? "Desactivar" : "Activar"}
                    >
                      {client.status === "active" ? (
                        <UserX size={14} className="text-red-500" />
                      ) : (
                        <UserCheck size={14} className="text-green-500" />
                      )}
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </Table>

      {filteredClients.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-gray-500 bg-white">
          <UserCheck size={48} className="text-gray-200 mb-4" />
          <p className="text-lg font-medium">No se encontraron clientes</p>
          <p className="text-sm">Prueba ajustando los términos de búsqueda.</p>
        </div>
      )}
    </>
  );
}
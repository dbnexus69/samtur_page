import { Search, Users as UsersIcon } from "lucide-react";
import { Input } from "../ui/Form";
import { Select } from "../ui/Form";

interface UsersFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterRole: string;
  onFilterRoleChange: (role: string) => void;
}

export function UsersFilters({
  searchTerm,
  onSearchChange,
  filterRole,
  onFilterRoleChange,
}: UsersFiltersProps) {
  return (
    <div className="flex gap-2">
      <div className="relative">
        <UsersIcon
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={16}
        />
        <input
          type="text"
          placeholder="Buscar..."
          className="pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-48"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select
        value={filterRole}
        onChange={(e) => onFilterRoleChange(e.target.value)}
        options={[
          { value: "all", label: "Todos los Roles" },
          { value: "admin", label: "Admins" },
          { value: "vendor", label: "Vendedores" },
        ]}
        className="w-32 py-1.5"
      />
    </div>
  );
}
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  DollarSign,
  Users,
  Plane,
  UserCog,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { usePermissions } from "../../context/PermissionsContext";
import { getInitials } from "../../utils/formatters";

export function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const { canView } = usePermissions();

  const mainLinks = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard", permission: 'dashboard' as const },
    { to: "/sales", icon: DollarSign, label: "Ventas", permission: 'sales' as const },
    { to: "/clients", icon: Users, label: "Clientes", permission: 'clients' as const },
    { to: "/itineraries", icon: Plane, label: "Itinerarios", permission: 'itineraries' as const },
  ];

  const adminLinks = [
    { to: "/users", icon: UserCog, label: "Usuarios", permission: 'users' as const },
    { to: "/config", icon: Settings, label: "Configuracion", permission: 'config' as const },
  ];

  const filteredMainLinks = mainLinks.filter(link => canView(link.permission));
  const filteredAdminLinks = adminLinks.filter(link => canView(link.permission));

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-primary text-white flex flex-col">
      <div className="p-6 border-b border-primary-light">
        <h1 className="text-2xl font-bold font-heading text-accent">Samtur</h1>
        <p className="text-xs text-gray-400 mt-1">Agencia de Viajes</p>
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-3">
          {filteredMainLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-accent text-white font-medium"
                      : "text-gray-300 hover:bg-primary-light hover:text-white"
                  }`
                }
              >
                <link.icon size={20} />
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {isAdmin && filteredAdminLinks.length > 0 && (
          <>
            <div className="px-4 py-3 mt-6">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Administracion
              </span>
            </div>
            <ul className="space-y-1 px-3">
              {filteredAdminLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-accent text-white font-medium"
                          : "text-gray-300 hover:bg-primary-light hover:text-white"
                      }`
                    }
                  >
                    <link.icon size={20} />
                    <span>{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-primary-light">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-semibold text-white">
            {user ? getInitials(user.name) : "??"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">
              {user?.role === "admin" ? "Administrador" : "Vendedor"}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-primary-light hover:text-white rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span>Cerrar Sesion</span>
        </button>
      </div>
    </aside>
  );
}

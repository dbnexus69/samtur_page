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
import { getInitials } from "../../utils/formatters";

export function Sidebar() {
  const { user, logout, isAdmin } = useAuth();

  const mainLinks = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/sales", icon: DollarSign, label: "Ventas" },
    { to: "/clients", icon: Users, label: "Clientes" },
    { to: "/itineraries", icon: Plane, label: "Itinerarios" },
  ];

  const adminLinks = [
    { to: "/users", icon: UserCog, label: "Usuarios" },
    { to: "/config", icon: Settings, label: "Configuracion" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-cyan-400">Samtur</h1>
        <p className="text-xs text-gray-400 mt-1">Agencia de Viajes</p>
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-3">
          {mainLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                <link.icon size={20} />
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {isAdmin && (
          <>
            <div className="px-4 py-3 mt-6">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Administracion
              </span>
            </div>
            <ul className="space-y-1 px-3">
              {adminLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
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

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-semibold">
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
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span>Cerrar Sesion</span>
        </button>
      </div>
    </aside>
  );
}

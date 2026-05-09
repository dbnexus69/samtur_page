import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  DollarSign,
  Users,
  Plane,
  UserCog,
  Settings,
  LogOut,
  Database,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { usePermissions } from "../../context/PermissionsContext";
import { getInitials } from "../../utils/formatters";

export function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const { canView } = usePermissions();
  const [isHovered, setIsHovered] = useState(false);

  const mainLinks = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard", permission: 'dashboard' as const },
    { to: "/sales", icon: DollarSign, label: "Ventas", permission: 'sales' as const },
    { to: "/clients", icon: Users, label: "Clientes", permission: 'clients' as const },
    { to: "/itineraries", icon: Plane, label: "Itinerarios", permission: 'itineraries' as const },
  ];

  const adminLinks = [
    { to: "/users", icon: UserCog, label: "Usuarios", permission: 'users' as const },
    { to: "/config", icon: Database, label: "Catálogos", permission: 'config' as const },
  ];

  const filteredMainLinks = mainLinks.filter(link => canView(link.permission));
  const filteredAdminLinks = adminLinks.filter(link => canView(link.permission));

  return (
    <aside 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed left-0 top-0 h-screen bg-primary text-white flex flex-col transition-all duration-300 ease-in-out z-50 shadow-2xl ${
        isHovered ? "w-64" : "w-20"
      }`}
    >
      <div className={`p-5 border-b border-primary-light overflow-hidden transition-all duration-300 ${isHovered ? "px-6" : "px-4"}`}>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl">
            <img src="/logo_samtur.png" alt="Samtur" className="w-8 h-8 object-contain" />
          </div>
          <div className={`transition-all duration-300 origin-left ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-0 w-0"}`}>
            <h1 className="text-xl font-bold font-heading text-accent whitespace-nowrap">Samtur</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-tighter whitespace-nowrap">Agencia de Viajes</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <ul className="space-y-2 px-3">
          {filteredMainLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center rounded-xl transition-all duration-300 group ${
                    isHovered ? "px-4 py-3 gap-3" : "px-0 py-3 justify-center"
                  } ${
                    isActive
                      ? "bg-accent text-white shadow-lg shadow-accent/20"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <div className={`flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                  <link.icon size={22} />
                </div>
                <span className={`font-medium whitespace-nowrap transition-all duration-300 origin-left ${
                  isHovered ? "opacity-100 scale-100" : "opacity-0 scale-0 w-0"
                }`}>
                  {link.label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>

        {isAdmin && filteredAdminLinks.length > 0 && (
          <div className="mt-8">
            <div className={`px-4 py-2 transition-all duration-300 ${isHovered ? "opacity-100" : "opacity-0 h-0 py-0"}`}>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] whitespace-nowrap">
                Administración
              </span>
            </div>
            <ul className="space-y-2 px-3 mt-2">
              {filteredAdminLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center rounded-xl transition-all duration-300 group ${
                        isHovered ? "px-4 py-3 gap-3" : "px-0 py-3 justify-center"
                      } ${
                        isActive
                          ? "bg-accent text-white shadow-lg shadow-accent/20"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    <div className={`flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                      <link.icon size={22} />
                    </div>
                    <span className={`font-medium whitespace-nowrap transition-all duration-300 origin-left ${
                      isHovered ? "opacity-100 scale-100" : "opacity-0 scale-0 w-0"
                    }`}>
                      {link.label}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      <div className={`p-4 border-t border-primary-light transition-all duration-300 ${isHovered ? "" : "items-center"}`}>
        <div className={`flex items-center gap-3 mb-4 transition-all duration-300 ${isHovered ? "" : "justify-center"}`}>
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent flex items-center justify-center font-bold text-white shadow-lg shadow-accent/20">
            {user ? getInitials(user.name) : "??"}
          </div>
          <div className={`transition-all duration-300 origin-left ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-0 w-0"}`}>
            <p className="text-sm font-bold truncate text-white">{user?.name}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">
              {user?.role === "admin" ? "Administrador" : "Vendedor"}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className={`flex items-center transition-all duration-300 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl group ${
            isHovered ? "px-4 py-3 gap-3 w-full" : "px-0 py-3 w-12 mx-auto justify-center"
          }`}
          title="Cerrar Sesión"
        >
          <LogOut size={20} className="transition-transform group-hover:rotate-12" />
          <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 origin-left ${
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-0 w-0"
          }`}>
            Cerrar Sesión
          </span>
        </button>
      </div>
    </aside>
  );
}

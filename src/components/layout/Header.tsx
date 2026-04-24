import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/sales': 'Ventas',
  '/clients': 'Clientes',
  '/itineraries': 'Itinerarios',
  '/users': 'Usuarios',
  '/config': 'Configuracion'
};

export function Header() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Samtour';

  return (
    <header className="sticky top-0 z-40 bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Samtour</span>
          <span className="text-gray-400">/</span>
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('es-CO', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </div>
      </div>
    </header>
  );
}
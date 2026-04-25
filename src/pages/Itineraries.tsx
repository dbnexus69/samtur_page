import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plane, ChevronDown, ChevronUp, Bell, X } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useData } from '../context/DataContext';
import { usePermissions } from '../context/PermissionsContext';
import { formatDate } from '../utils/formatters';
import { Flight } from '../types';

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DAYS = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

interface Notification {
  id: number;
  flight: Flight;
  message: string;
}

export default function Itineraries() {
  const { data, updateFlight } = useData();
  const { canEdit: canEditItinerary, canView } = usePermissions();
  const [currentTab, setCurrentTab] = useState<'ida' | 'regreso'>('ida');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const flights = useMemo(() => {
    return data.flights
      .filter(f => f.type === currentTab)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [data.flights, currentTab]);

  const allFlights = useMemo(() => {
    return [...data.flights].sort((a, b) => a.date.localeCompare(b.date));
  }, [data.flights]);

  const flightsIda = data.flights.filter(f => f.type === 'ida');
  const flightsRegreso = data.flights.filter(f => f.type === 'regreso');

  useEffect(() => {
    const nearFlights = allFlights.filter(f => {
      const daysUntil = getDaysUntil(f.date);
      return daysUntil >= 0 && daysUntil <= 3;
    });
  }, [allFlights]);

  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const changeMonth = (delta: number) => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;
    if (newMonth > 11) { newMonth = 0; newYear++; }
    if (newMonth < 0) { newMonth = 11; newYear--; }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const getDaysUntil = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleMarkCheckin = (flightId: number) => {
    if (!canEditItinerary('itineraries')) return;
    if (confirm('Marcar check-in como realizado?')) {
      updateFlight(flightId, { checkin: 'realizado' });
      dismissNotification(flightId);
    }
  };

  const toggleDay = (dayKey: string) => {
    setExpandedDays(prev => {
      const next = new Set(prev);
      if (next.has(dayKey)) {
        next.delete(dayKey);
      } else {
        next.add(dayKey);
      }
      return next;
    });
  };

  const calendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const daysInPrevMonth = getDaysInMonth(currentMonth - 1, currentYear);
    const days: { day: number; month: number; year: number; flights: Flight[] }[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      days.push({ day, month: prevMonth, year: prevYear, flights: [] });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayFlights = flights.filter(f => f.date === dateStr);
      days.push({ day: i, month: currentMonth, year: currentYear, flights: dayFlights });
    }

    while (days.length % 7 !== 0) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      days.push({ day: days.length - firstDay - daysInMonth + 1, month: nextMonth, year: nextYear, flights: [] });
    }

    return days;
  };

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  const getDayKey = (day: number, month: number, year: number) => 
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  if (!canView('itineraries')) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No tiene permisos para ver itinerarios</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-lg flex items-start gap-3 max-w-sm animate-pulse"
            >
              <Bell className="text-green-600 mt-0.5 flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">{notif.flight.passenger}</p>
                <p className="text-xs text-green-700">{notif.flight.route} - {notif.flight.time}</p>
                <p className="text-xs text-green-600 mt-1">{notif.message}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleMarkCheckin(notif.flight.id)}
                    className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  >
                    Check-in
                  </button>
                </div>
              </div>
              <button onClick={() => dismissNotification(notif.id)} className="text-green-500 hover:text-green-700">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Card>
        <div className="flex border-b">
          <button
            className={`flex-1 px-6 py-4 font-medium transition-colors ${currentTab === 'ida' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setCurrentTab('ida')}
          >
            Vuelos de Ida ({flightsIda.length})
          </button>
          <button
            className={`flex-1 px-6 py-4 font-medium transition-colors ${currentTab === 'regreso' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setCurrentTab('regreso')}
          >
            Vuelos de Regreso ({flightsRegreso.length})
          </button>
        </div>

        <CardBody className="p-0">
          <div className="flex items-center justify-between p-4 border-b">
            <Button variant="outline" size="sm" onClick={() => changeMonth(-1)}>
              <ChevronLeft size={16} />
            </Button>
            <h3 className="font-semibold">{MONTHS[currentMonth]} {currentYear}</h3>
            <Button variant="outline" size="sm" onClick={() => changeMonth(1)}>
              <ChevronRight size={16} />
            </Button>
          </div>

          <div className="grid grid-cols-7">
            {DAYS.map(day => (
              <div key={day} className="p-3 text-center text-xs font-semibold text-gray-500 bg-gray-light uppercase">
                {day}
              </div>
            ))}
            {calendarDays().map((item, i) => {
              const isOtherMonth = item.month !== currentMonth;
              const dayFlights = item.flights;
              const dayKey = getDayKey(item.day, item.month, item.year);
              const isExpanded = expandedDays.has(dayKey);
              const hasMoreThanOne = dayFlights.length > 1;
              const displayFlights = isExpanded ? dayFlights : dayFlights.slice(0, 1);
              const hasFlights = dayFlights.length > 0;
              const needsToggle = dayFlights.length > 1;

              return (
                <div
                  key={i}
                  className={`min-h-40 p-2 border-r border-b relative ${isOtherMonth ? 'bg-gray-light text-gray-400' : 'bg-white'}`}
                >
                  {hasFlights && (
                    <div className="absolute top-1 right-1 text-xs font-bold text-white bg-accent rounded-full w-5 h-5 flex items-center justify-center z-10">
                      {dayFlights.length}
                    </div>
                  )}
                  <div className={`text-sm font-medium mb-1 ${isToday(item.day) ? 'bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center' : ''}`}>
                    {item.day}
                  </div>
                  
                  {displayFlights.map((flight, idx) => {
                    const daysUntil = getDaysUntil(flight.date);
                    let colorClass = 'bg-blue-100 text-blue-700';
                    if (daysUntil < 0) colorClass = 'bg-red-100 text-red-700';
                    else if (daysUntil <= 3) colorClass = 'bg-green-100 text-green-700';

                    return (
                      <div
                        key={flight.id}
                        className={`text-xs p-1.5 rounded mb-1 cursor-pointer ${colorClass}`}
                        title={`${flight.passenger} - ${flight.route} - ${flight.time}`}
                      >
                        <div className="font-medium flex items-center gap-1">
                          <Plane size={10} />
                          {flight.passenger.split(' ')[0]}
                        </div>
                        <div className="text-xs opacity-75">{flight.route}</div>
                        {flight.checkin === 'pendiente' && canEditItinerary('itineraries') && (
                          <button
                            className="mt-1 text-xs bg-white px-1.5 py-0.5 rounded hover:bg-gray-100"
                            onClick={() => handleMarkCheckin(flight.id)}
                          >
                            Check-in
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {hasMoreThanOne && (
                    <button
                      onClick={() => toggleDay(dayKey)}
                      className="w-full flex items-center justify-center gap-1 text-xs font-bold text-accent bg-accent/10 border border-accent/30 rounded px-1 py-1 mt-1 hover:bg-accent/20 cursor-pointer"
                    >
                      {isExpanded ? `[−] Ver menos` : `[+] +${dayFlights.length - 1} más`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Vuelos Recientes</CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-light text-left text-xs font-semibold text-gray-600 uppercase">
                <th className="px-4 py-3">Pasajero</th>
                <th className="px-4 py-3">Ruta</th>
                <th className="px-4 py-3">Aerolinea</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Hora</th>
                <th className="px-4 py-3">Check-in</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {flights.slice(0, 8).map(flight => (
                <tr key={flight.id} className="hover:bg-gray-light">
                  <td className="px-4 py-3">{flight.passenger}</td>
                  <td className="px-4 py-3">{flight.route}</td>
                  <td className="px-4 py-3">{flight.airline}</td>
                  <td className="px-4 py-3">{formatDate(flight.date)}</td>
                  <td className="px-4 py-3">{flight.time}</td>
                  <td className="px-4 py-3">
                    <Badge variant={flight.checkin === 'realizado' ? 'realizado' : 'pendiente-check'}>
                      {flight.checkin === 'realizado' ? 'Realizado' : 'Pendiente'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
import { useState, useMemo } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useData } from "../context/DataContext";
import { usePermissions } from "../context/PermissionsContext";
import { useItineraries } from "../hooks/useItineraries";
import { Flight } from "../types";
import {
  FlightCalendar,
  FlightCheckinList,
  CheckinModal,
} from "../components/itineraries";

export default function Itineraries() {
  const { data, updateFlight } = useData();
  const { canEdit: canEditItinerary, canView } = usePermissions();
  const { getClientForFlight } = useItineraries();

  const [activeTab, setActiveTab] = useState<"calendar" | "checkin">("calendar");
  const [calendarTab, setCalendarTab] = useState<"ida" | "regreso">("ida");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [checkinSearch, setCheckinSearch] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [selectedFlightForCheckin, setSelectedFlightForCheckin] = useState<Flight | null>(null);
  const [isSending, setIsSending] = useState(false);

  const changeMonth = (delta: number) => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const toggleDay = (dayKey: string) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayKey)) next.delete(dayKey);
      else next.add(dayKey);
      return next;
    });
  };

  const handleCheckinClick = (flight: Flight) => {
    if (!canEditItinerary("itineraries")) return;
    setSelectedFlightForCheckin(flight);
    setIsCheckinModalOpen(true);
  };

  const confirmCheckin = async () => {
    if (!selectedFlightForCheckin) return;

    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const client = getClientForFlight(selectedFlightForCheckin);
    const emailTo = client ? client.email : "el cliente";

    updateFlight(selectedFlightForCheckin.id, { checkin: "realizado" });

    setIsSending(false);
    setIsCheckinModalOpen(false);
    setSelectedFlightForCheckin(null);
    setSuccessMessage(`Check-in enviado exitosamente a ${emailTo}`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const pendingCheckins = useMemo(
    () =>
      data.flights
        .filter((f) => f.checkin === "pendiente")
        .sort((a, b) => a.date.localeCompare(b.date)),
    [data.flights],
  );

  const filteredPending = useMemo(
    () =>
      pendingCheckins.filter(
        (f) =>
          f.passenger.toLowerCase().includes(checkinSearch.toLowerCase()) ||
          f.route.toLowerCase().includes(checkinSearch.toLowerCase()),
      ),
    [pendingCheckins, checkinSearch],
  );

  const modalClient = selectedFlightForCheckin
    ? getClientForFlight(selectedFlightForCheckin) || null
    : null;

  if (!canView("itineraries")) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <AlertCircle size={48} className="mb-4 opacity-20" />
        <p className="text-lg font-medium">Acceso Restringido</p>
        <p className="text-sm">No tiene permisos para ver itinerarios.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {showSuccess && (
        <div className="fixed top-20 right-6 z-[100] bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 animate-slide-in-right">
          <div className="bg-green-500 text-white rounded-full p-1">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="font-bold text-sm">Operación Exitosa</p>
            <p className="text-xs opacity-90">{successMessage}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <span className="text-3xl">✈️</span> Itinerarios de Vuelo
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Seguimiento de salidas, regresos y gestión de check-in.
          </p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-border w-fit h-fit">
          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "calendar"
                ? "bg-primary text-white shadow-md"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            📅 Calendario
          </button>
          <button
            onClick={() => setActiveTab("checkin")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "checkin"
                ? "bg-primary text-white shadow-md"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            ✅ Check-in
            {pendingCheckins.length > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {pendingCheckins.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === "calendar" && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setCalendarTab("ida")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              calendarTab === "ida"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            🛫 Vuelos de Ida
          </button>
          <button
            onClick={() => setCalendarTab("regreso")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              calendarTab === "regreso"
                ? "bg-indigo-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            🛬 Vuelos de Regreso
          </button>
        </div>
      )}

      {activeTab === "calendar" ? (
        <FlightCalendar
          currentMonth={currentMonth}
          currentYear={currentYear}
          flightType={calendarTab}
          onMonthChange={changeMonth}
          expandedDays={expandedDays}
          onDayToggle={toggleDay}
          onCheckinClick={handleCheckinClick}
          canEdit={canEditItinerary("itineraries")}
        />
      ) : (
        <FlightCheckinList
          flights={filteredPending}
          searchTerm={checkinSearch}
          onSearchChange={setCheckinSearch}
          onCheckinClick={handleCheckinClick}
          canEdit={canEditItinerary("itineraries")}
        />
      )}

      <CheckinModal
        flight={selectedFlightForCheckin}
        client={modalClient}
        isOpen={isCheckinModalOpen}
        onClose={() => {
          setIsCheckinModalOpen(false);
          setSelectedFlightForCheckin(null);
        }}
        onConfirm={confirmCheckin}
        isSending={isSending}
      />
    </div>
  );
}
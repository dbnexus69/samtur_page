import { useMemo } from "react";
import { ChevronLeft, ChevronRight, Plane, UserCheck, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { useItineraries } from "../../hooks/useItineraries";
import { Flight } from "../../types";

interface FlightCalendarProps {
  currentMonth: number;
  currentYear: number;
  flightType: "ida" | "regreso";
  onMonthChange: (delta: number) => void;
  expandedDays: Set<string>;
  onDayToggle: (dayKey: string) => void;
  onCheckinClick: (flight: Flight) => void;
  canEdit: boolean;
}

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const DAYS = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

export function FlightCalendar({
  currentMonth,
  currentYear,
  flightType,
  onMonthChange,
  expandedDays,
  onDayToggle,
  onCheckinClick,
  canEdit,
}: FlightCalendarProps) {
  const { getCalendarDays, getClientForFlight } = useItineraries();

  const calendarDays = useMemo(
    () => getCalendarDays(currentMonth, currentYear, flightType),
    [currentMonth, currentYear, flightType, getCalendarDays],
  );

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const todayStr = new Date().toISOString().split("T")[0];

  const getDayKey = (day: number, month: number, year: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {flightType === "ida" ? "Vuelos de Ida" : "Vuelos de Regreso"}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMonthChange(-1)}
            >
              <ChevronLeft size={16} />
            </Button>
            <span className="text-sm font-medium min-w-[140px] text-center">
              {MONTHS[currentMonth]} {currentYear}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMonthChange(1)}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-bold text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((dayInfo, index) => {
            const dayKey = getDayKey(dayInfo.day, dayInfo.month, dayInfo.year);
            const isCurrentMonth = dayInfo.month === currentMonth;
            const hasFlights = dayInfo.flights.length > 0;
            const isExpanded = expandedDays.has(dayKey);
            const isToday = dayKey === todayStr;

            return (
              <div key={index} className="min-h-[80px]">
                <button
                  onClick={() => hasFlights && onDayToggle(dayKey)}
                  disabled={!hasFlights}
                  className={`w-full h-full p-1 text-left rounded-lg transition-all ${
                    isCurrentMonth
                      ? isToday
                        ? "bg-accent/10 border-2 border-accent"
                        : "hover:bg-gray-50 border border-gray-100"
                      : "text-gray-300 bg-gray-50/50"
                  } ${hasFlights ? "cursor-pointer" : "cursor-default"}`}
                >
                  <span
                    className={`text-xs font-medium ${
                      isCurrentMonth ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    {dayInfo.day}
                  </span>
                  {hasFlights && (
                    <div className="mt-1 space-y-1">
                      {dayInfo.flights.slice(0, isExpanded ? undefined : 2).map((flight) => (
                        <div
                          key={flight.id}
                          className={`text-[10px] px-1 py-0.5 rounded truncate ${
                            flight.checkin === "realizado"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {flight.route}
                        </div>
                      ))}
                      {dayInfo.flights.length > 2 && !isExpanded && (
                        <div className="text-[10px] text-gray-500">
                          +{dayInfo.flights.length - 2} más
                        </div>
                      )}
                    </div>
                  )}
                </button>
                {isExpanded && hasFlights && (
                  <div className="mt-2 space-y-2">
                    {dayInfo.flights.map((flight) => {
                      const client = getClientForFlight(flight);
                      const isPast = flight.date < todayStr;
                      return (
                        <div
                          key={flight.id}
                          className="bg-white p-2 rounded-lg border shadow-sm text-xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold">
                              {flight.passenger}
                            </span>
                            <Badge variant={flight.checkin === "realizado" ? "realizado" : "pendiente-check"}>
                              {flight.checkin === "realizado" ? "Check-in ✓" : "Pendiente"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500 mb-1">
                            <Plane size={12} />
                            <span>{flight.route}</span>
                            <span>·</span>
                            <span>{flight.time}</span>
                            <span>·</span>
                            <span>{flight.airline}</span>
                          </div>
                          {client && (
                            <div className="text-gray-400 text-[10px]">
                              <UserCheck size={10} className="inline mr-1" />
                              {client.email}
                            </div>
                          )}
                          {canEdit && flight.checkin !== "realizado" && (
                            <Button
                              size="sm"
                              className="mt-1 w-full"
                              onClick={() => onCheckinClick(flight)}
                            >
                              <UserCheck size={12} className="mr-1" />
                              Check-in
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
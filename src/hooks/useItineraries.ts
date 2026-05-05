import { useMemo } from "react";
import { useData } from "../context/DataContext";
import { Flight } from "../types";

export interface FlightWithClient extends Flight {
  clientName?: string;
  clientEmail?: string;
}

export interface CalendarDay {
  day: number;
  month: number;
  year: number;
  flights: Flight[];
}

export function useItineraries() {
  const { data, updateFlight } = useData();

  const flightsIda = useMemo(
    () => data.flights.filter((f) => f.type === "ida"),
    [data.flights],
  );

  const flightsRegreso = useMemo(
    () => data.flights.filter((f) => f.type === "regreso"),
    [data.flights],
  );

  const pendingCheckins = useMemo(
    () =>
      data.flights
        .filter((f) => f.checkin === "pendiente")
        .sort((a, b) => a.date.localeCompare(b.date)),
    [data.flights],
  );

  const getClientForFlight = (flight: Flight) => {
    return data.clients.find((c) => c.name === flight.passenger);
  };

  const getFlightWithClient = (flight: Flight): FlightWithClient => {
    const client = getClientForFlight(flight);
    return {
      ...flight,
      clientName: client?.name,
      clientEmail: client?.email,
    };
  };

  const getCalendarDays = (
    month: number,
    year: number,
    flightType: "ida" | "regreso",
  ): CalendarDay[] => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: CalendarDay[] = [];

    // Días del mes anterior
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      days.push({ day, month: prevMonth, year: prevYear, flights: [] });
    }

    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const dayFlights = data.flights.filter(
        (f) => f.date === dateStr && f.type === flightType,
      );
      days.push({ day: i, month, year, flights: dayFlights });
    }

    // Días del mes siguiente
    while (days.length % 7 !== 0) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      days.push({
        day: days.length - firstDay - daysInMonth + 1,
        month: nextMonth,
        year: nextYear,
        flights: [],
      });
    }

    return days;
  };

  const markCheckin = (flightId: number) => {
    updateFlight(flightId, { checkin: "realizado" });
  };

  const getDayKey = (day: number, month: number, year: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const stats = useMemo(() => {
    const total = data.flights.length;
    const ida = flightsIda.length;
    const regreso = flightsRegreso.length;
    const checkinRealizados = data.flights.filter((f) => f.checkin === "realizado").length;
    const checkinPendientes = pendingCheckins.length;

    return {
      total,
      ida,
      regreso,
      checkinRealizados,
      checkinPendientes,
    };
  }, [data.flights, flightsIda, flightsRegreso, pendingCheckins]);

  return {
    flights: data.flights,
    flightsIda,
    flightsRegreso,
    pendingCheckins,
    getClientForFlight,
    getFlightWithClient,
    getCalendarDays,
    markCheckin,
    getDayKey,
    stats,
  };
}
import { useState } from "react";
import { Search, UserCheck, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Input } from "../ui/Form";
import { Flight } from "../../types";
import { formatDate } from "../../utils/formatters";

interface FlightCheckinListProps {
  flights: Flight[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onCheckinClick: (flight: Flight) => void;
  canEdit: boolean;
}

export function FlightCheckinList({
  flights,
  searchTerm,
  onSearchChange,
  onCheckinClick,
  canEdit,
}: FlightCheckinListProps) {
  const filteredFlights = flights.filter(
    (f) =>
      f.passenger.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.route.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const pendingCount = filteredFlights.filter((f) => f.checkin === "pendiente").length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck size={20} className="text-accent" />
            <h2 className="text-lg font-bold">Lista de Check-in</h2>
            {pendingCount > 0 && (
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                {pendingCount}_pending
              </span>
            )}
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar pasajero o ruta..."
              className="pl-9 w-64"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody>
        {filteredFlights.length > 0 ? (
          <div className="space-y-2">
            {filteredFlights.map((flight) => (
              <div
                key={flight.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  flight.checkin === "realizado"
                    ? "bg-green-50 border-green-200"
                    : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      flight.checkin === "realizado"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {flight.checkin === "realizado" ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <Clock size={20} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">
                        {flight.passenger}
                      </span>
                      <Badge
                        variant={
                          flight.checkin === "realizado"
                            ? "realizado"
                            : "pendiente-check"
                        }
                      >
                        {flight.checkin === "realizado"
                          ? "Check-in completado"
                          : "Pendiente"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span>{flight.route}</span>
                      <span>·</span>
                      <span>{formatDate(flight.date)}</span>
                      <span>·</span>
                      <span>{flight.time}</span>
                      <span>·</span>
                      <span>{flight.airline}</span>
                    </div>
                  </div>
                </div>
                {canEdit && flight.checkin !== "realizado" && (
                  <Button
                    size="sm"
                    onClick={() => onCheckinClick(flight)}
                  >
                    <UserCheck size={14} className="mr-1" />
                    Realizar Check-in
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <CheckCircle2 size={48} className="mb-4 text-green-300" />
            <p className="text-lg font-medium">No hay check-ins pendientes</p>
            <p className="text-sm">Todos los pasajeros ya completaron su check-in</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
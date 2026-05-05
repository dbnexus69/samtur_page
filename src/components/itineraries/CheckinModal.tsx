import { useState } from "react";
import { UploadCloud, Plane, UserCheck } from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardBody } from "../ui/Card";
import { Flight } from "../../types";
import { Client } from "../../types";

interface CheckinModalProps {
  flight: Flight | null;
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSending: boolean;
}

export function CheckinModal({
  flight,
  client,
  isOpen,
  onClose,
  onConfirm,
  isSending,
}: CheckinModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen || !flight) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleConfirm = () => {
    onConfirm();
    setSelectedFile(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-heading font-semibold text-white">
            Confirmar Check-in
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="p-6 bg-gray-light">
          <Card>
            <CardBody>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <UserCheck size={24} className="text-accent" />
                </div>
                <div>
                  <p className="font-bold text-primary">{flight.passenger}</p>
                  <p className="text-sm text-gray-500">{client?.email || "Sin email registrado"}</p>
                </div>
              </div>

              <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Plane size={16} className="text-gray-400" />
                  <span className="font-medium">{flight.route}</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-500">{flight.airline}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Fecha:</span>
                  <span className="font-medium">{flight.date}</span>
                  <span className="text-gray-500">·</span>
                  <span className="font-medium">{flight.time}</span>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UploadCloud size={16} className="inline mr-1" />
                  Adjuntar tarjeta de embarque (opcional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-accent transition-colors">
                  <input
                    type="file"
                    className="hidden"
                    id="boarding-pass"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="boarding-pass" className="cursor-pointer">
                    {selectedFile ? (
                      <div className="text-sm">
                        <p className="font-medium text-accent">{selectedFile.name}</p>
                        <p className="text-gray-500">Click para cambiar</p>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        <p className="font-medium">Click para seleccionar archivo</p>
                        <p className="text-xs">PDF, JPG o PNG</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  Se enviará un correo de confirmación a{" "}
                  <span className="font-bold">{client?.email || "el cliente"}</span>
                </p>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="px-6 py-4 bg-white border-t border-gray-border flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSending}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} isLoading={isSending}>
            {isSending ? "Enviando..." : "Confirmar Check-in"}
          </Button>
        </div>
      </div>
    </div>
  );
}
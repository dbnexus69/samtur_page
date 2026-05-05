import { ShoppingBag, Receipt } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { Sale, Client } from "../../types";

interface SaleDetailModalProps {
  sale: Sale | null;
  clients: Client[];
  onClose: () => void;
}

export function SaleDetailModal({ sale, clients, onClose }: SaleDetailModalProps) {
  if (!sale) return null;

  const client = clients.find((c) => c.id === sale.clientId);
  const commissionAmount = sale.commissionAmount || 0;
  const supplierCost = sale.supplierCost || 0;
  const gananciaNeta = sale.total - supplierCost - commissionAmount;

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-bold text-primary border-b border-gray-200 pb-2 mb-3">
          Información de la Venta
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div>
            <span className="text-gray-500 text-xs block">Venta #</span>{" "}
            <span className="font-bold text-gray-800">{sale.id}</span>
          </div>
          <div>
            <span className="text-gray-500 text-xs block">Fecha</span>{" "}
            <span className="font-medium text-gray-800">{formatDate(sale.date)}</span>
          </div>
          <div>
            <span className="text-gray-500 text-xs block">Estado</span>{" "}
            <Badge variant={sale.status}>{sale.status}</Badge>
          </div>
          <div>
            <span className="text-gray-500 text-xs block">Valor Final</span>{" "}
            <span className="font-black text-emerald-600">
              {formatCurrency(sale.total)}
            </span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-primary border-b border-gray-200 pb-2 mb-3">
          Detalles del Cliente
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="col-span-2 sm:col-span-1">
            <span className="text-gray-500 text-xs block">Nombre</span>{" "}
            <span className="font-medium text-gray-800">{sale.clientName}</span>
          </div>
          {client ? (
            <>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-gray-500 text-xs block">Documento</span>{" "}
                <span className="font-medium text-gray-800">
                  {client.docType} {client.docNumber}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-gray-500 text-xs block">Correo</span>{" "}
                <span className="font-medium text-gray-800 break-words">
                  {client.email}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-gray-500 text-xs block">Teléfono</span>{" "}
                <span className="font-medium text-gray-800">{client.phone}</span>
              </div>
            </>
          ) : (
            <div className="col-span-3 text-sm text-gray-400 italic flex items-center">
              Detalles adicionales del cliente no disponibles
            </div>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-primary border-b border-gray-200 pb-2 mb-3">
          Detalles Operativos y Financieros
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div>
            <span className="text-gray-500 text-xs block">Vendedor/Admin</span>{" "}
            <span className="font-medium text-gray-800">{sale.vendorName}</span>
          </div>
          <div>
            <span className="text-gray-500 text-xs block">Pago a Proveedores</span>{" "}
            <span className="font-medium text-rose-600">
              {formatCurrency(supplierCost)}
            </span>
          </div>
          <div>
            <span className="text-gray-500 text-xs block">Tarifa Admin (T.A)</span>{" "}
            <span className="font-medium text-gray-800">
              {formatCurrency(sale.ta || 0)}
            </span>
          </div>
          <div>
            <span className="text-gray-500 text-xs block">Ganancia Neta</span>{" "}
            <span className="font-bold text-emerald-600">
              {formatCurrency(gananciaNeta)}
            </span>
          </div>
        </div>
      </div>

      {(sale.commissionAgent || commissionAmount > 0) && (
        <div>
          <h4 className="text-sm font-bold text-primary border-b border-gray-200 pb-2 mb-3">
            Detalles del Comisionista
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div>
              <span className="text-gray-500 text-xs block">Nombre</span>{" "}
              <span className="font-medium text-gray-800">
                {sale.commissionAgent || "-"}
              </span>
            </div>
            <div>
              <span className="text-gray-500 text-xs block">Forma de Pago</span>{" "}
              <span className="font-medium text-gray-800">
                {sale.commissionPaymentMethod || "-"}
              </span>
            </div>
            <div>
              <span className="text-gray-500 text-xs block">Valor Pagado</span>{" "}
              <span className="font-medium text-rose-600">
                {formatCurrency(commissionAmount)}
              </span>
            </div>
          </div>
        </div>
      )}

      <div>
        <h4 className="text-sm font-bold text-primary border-b border-gray-200 pb-2 mb-3 flex items-center gap-2">
          <ShoppingBag size={16} className="text-accent" /> Descripción de los Servicios Vendidos
        </h4>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-inner min-h-[80px]">
          {sale.observations ? (
            <ul className="space-y-2">
              {sale.observations
                .split("\n")
                .filter((l) => l.trim())
                .map((line, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <Receipt
                      size={18}
                      className="text-green-500 shrink-0 mt-0.5"
                    />
                    <span className="font-medium">{line}</span>
                  </li>
                ))}
            </ul>
          ) : (
            <div className="flex items-center gap-2 text-gray-400 italic text-sm">
              <ShoppingBag size={16} />
              <span>No se detallaron los servicios vendidos...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
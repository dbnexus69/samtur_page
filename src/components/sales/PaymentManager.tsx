import { useState } from "react";
import { Receipt, FileDown, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Input, Select } from "../ui/Form";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { PaymentRecord } from "../../types";

interface PaymentManagerProps {
  payments: PaymentRecord[];
  totalAmount: number;
  onAddPayment: (payment: Omit<PaymentRecord, "id">) => void;
  onDeletePayment: (paymentId: number) => void;
  isAdmin?: boolean;
}

export function PaymentManager({
  payments,
  totalAmount,
  onAddPayment,
  onDeletePayment,
  isAdmin = false,
}: PaymentManagerProps) {
  const [newPayment, setNewPayment] = useState({
    amount: "",
    method: "Efectivo",
  });

  const totalPaidAmount = payments.reduce((acc, p) => acc + p.amount, 0);
  const remainingBalance = totalAmount - totalPaidAmount;

  const handleAddPayment = () => {
    const amount = Number(newPayment.amount);
    if (amount > 0 && amount <= remainingBalance) {
      onAddPayment({
        date: new Date().toISOString().split("T")[0],
        amount,
        method: newPayment.method,
      });
      setNewPayment({ amount: "", method: "Efectivo" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Valor a Pagar
          </p>
          <p className="text-xl font-black text-gray-800 mt-1">
            {formatCurrency(totalAmount)}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
            Total Pagado
          </p>
          <p className="text-xl font-black text-blue-700 mt-1">
            {formatCurrency(totalPaidAmount)}
          </p>
        </div>
        <div
          className={`p-4 rounded-xl border shadow-sm ${
            remainingBalance > 0 ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100"
          }`}
        >
          <p
            className={`text-[10px] font-bold uppercase tracking-widest ${
              remainingBalance > 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            Pendiente por Pagar
          </p>
          <p
            className={`text-xl font-black mt-1 ${
              remainingBalance > 0 ? "text-red-700" : "text-green-700"
            }`}
          >
            {formatCurrency(Math.max(0, remainingBalance))}
          </p>
        </div>
      </div>

      {remainingBalance > 0 && (
        <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <h4 className="text-sm font-bold text-gray-800 mb-4">
            Registrar Nuevo Abono
          </h4>
          <div className="flex flex-col sm:flex-row items-end gap-3">
            <div className="flex-1 w-full">
              <label className="text-xs font-bold text-gray-600 mb-1 block">
                Monto a abonar
              </label>
              <Input
                type="number"
                value={newPayment.amount}
                max={remainingBalance}
                onChange={(e) =>
                  setNewPayment({
                    ...newPayment,
                    amount: e.target.value,
                  })
                }
                placeholder="Ej: 500000"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="text-xs font-bold text-gray-600 mb-1 block">
                Método de pago
              </label>
              <Select
                value={newPayment.method}
                onChange={(e) =>
                  setNewPayment({
                    ...newPayment,
                    method: e.target.value,
                  })
                }
                options={[
                  { value: "Efectivo", label: "Efectivo" },
                  { value: "Transferencia", label: "Transferencia" },
                  { value: "Tarjeta de Crédito", label: "Tarjeta de Crédito" },
                ]}
              />
            </div>
            <Button
              type="button"
              onClick={handleAddPayment}
              className="mb-0.5 w-full sm:w-auto whitespace-nowrap"
              disabled={
                !newPayment.amount ||
                Number(newPayment.amount) <= 0 ||
                Number(newPayment.amount) > remainingBalance
              }
            >
              Registrar Abono
            </Button>
          </div>
          {Number(newPayment.amount) > remainingBalance && (
            <p className="text-[10px] text-red-500 font-bold mt-2">
              El abono supera el saldo restante de{" "}
              {formatCurrency(remainingBalance)}.
            </p>
          )}
        </div>
      )}

      <div>
        <h4 className="text-sm font-bold text-gray-700 mb-3">
          Historial de Pagos
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {payments.length > 0 ? (
            payments.map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl border border-gray-200"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-lg border border-gray-200 text-gray-400">
                    <Receipt size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-sm">
                      {formatCurrency(p.amount)}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {formatDate(p.date)} · {p.method}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 items-center mt-2 sm:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    className="text-xs py-1.5 px-2 h-auto"
                  >
                    <FileDown size={14} className="mr-1" /> PDF
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      className="text-xs py-1.5 px-2 h-auto border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300"
                      onClick={() => onDeletePayment(p.id)}
                      title="Eliminar abono"
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic p-4 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
              No hay pagos registrados para esta venta.
            </p>
          )}
        </div>
      </div>

      {totalAmount > 0 && (
        <div className="mt-5 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
            <span>Progreso de Pago</span>
            <span
              className={
                Math.round((totalPaidAmount / totalAmount) * 100) === 100
                  ? "text-green-600"
                  : "text-blue-600"
              }
            >
              {Math.round((totalPaidAmount / totalAmount) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                Math.round((totalPaidAmount / totalAmount) * 100) === 100
                  ? "bg-green-500"
                  : "bg-blue-500"
              }`}
              style={{
                width: `${Math.min(100, Math.round((totalPaidAmount / totalAmount) * 100))}%`,
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
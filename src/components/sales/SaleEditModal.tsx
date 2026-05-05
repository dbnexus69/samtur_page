import { useState, useEffect } from "react";
import { Receipt, ShoppingBag } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Input, Select, Textarea } from "../ui/Form";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { Sale, Client, PaymentRecord } from "../../types";
import { useData } from "../../context/DataContext";
import { PaymentManager } from "./PaymentManager";

interface SaleEditModalProps {
  sale: Sale | null;
  onClose: () => void;
  onSubmit: (data: Partial<Sale>) => void;
}

interface SaleFormData {
  clientId: string;
  total: string;
  paymentMethod: string;
  status: string;
  observations: string;
  isCredit: boolean;
  creditDueDate: string;
  commissionAgent: string;
  commissionAmount: string;
  commissionPaymentMethod: string;
  ta: string;
  supplierCost: string;
}

export function SaleEditModal({ sale, onClose, onSubmit }: SaleEditModalProps) {
  const { data } = useData();
  const isEditing = !!sale;

  const [formData, setFormData] = useState<SaleFormData>({
    clientId: "",
    total: "",
    paymentMethod: "",
    status: "pendiente",
    observations: "",
    isCredit: false,
    creditDueDate: "",
    commissionAgent: "",
    commissionAmount: "",
    commissionPaymentMethod: "",
    ta: "",
    supplierCost: "",
  });

  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  useEffect(() => {
    if (sale) {
      setFormData({
        clientId: String(sale.clientId),
        total: String(sale.total),
        paymentMethod: sale.paymentMethod,
        status: sale.status,
        observations: sale.observations || "",
        isCredit: sale.isCredit || false,
        creditDueDate: sale.creditDueDate || "",
        commissionAgent: sale.commissionAgent || "",
        commissionAmount: sale.commissionAmount ? String(sale.commissionAmount) : "",
        commissionPaymentMethod: sale.commissionPaymentMethod || "",
        ta: sale.ta ? String(sale.ta) : "",
        supplierCost: sale.supplierCost ? String(sale.supplierCost) : "",
      });
      setPayments(sale.payments || []);
    } else {
      setFormData({
        clientId: "",
        total: "",
        paymentMethod: "",
        status: "pendiente",
        observations: "",
        isCredit: false,
        creditDueDate: "",
        commissionAgent: "",
        commissionAmount: "",
        commissionPaymentMethod: "",
        ta: "",
        supplierCost: "",
      });
      setPayments([]);
    }
  }, [sale]);

  const totalSaleAmount = Number(formData.total) || 0;
  const totalPaidAmount = payments.reduce((acc, p) => acc + p.amount, 0);

  const handleSubmit = () => {
    const client = data.clients.find((c) => c.id === Number(formData.clientId));
    if (!client && isEditing) return;

    const newStatus =
      totalPaidAmount >= totalSaleAmount
        ? "pagado"
        : totalPaidAmount > 0
          ? "abonado"
          : "pendiente";

    const saleData: Partial<Sale> = isEditing
      ? {
          paymentMethod: formData.paymentMethod,
          status: newStatus,
          observations: formData.observations,
          isCredit: formData.isCredit,
          creditDueDate: formData.isCredit ? formData.creditDueDate : undefined,
          creditPaidAmount: formData.isCredit ? totalPaidAmount : undefined,
          commissionAgent: formData.commissionAgent,
          commissionAmount: Number(formData.commissionAmount) || 0,
          commissionPaymentMethod: formData.commissionPaymentMethod,
          ta: Number(formData.ta) || 0,
          supplierCost: Number(formData.supplierCost) || 0,
          payments,
        }
      : {
          clientId: Number(formData.clientId),
          clientName: client?.name || "",
          total: Number(formData.total),
          paymentMethod: formData.paymentMethod,
          status: newStatus,
          observations: formData.observations,
          isCredit: formData.isCredit,
          creditDueDate: formData.isCredit ? formData.creditDueDate : undefined,
          creditPaidAmount: formData.isCredit ? totalPaidAmount : undefined,
          commissionAgent: formData.commissionAgent,
          commissionAmount: Number(formData.commissionAmount) || 0,
          commissionPaymentMethod: formData.commissionPaymentMethod,
          ta: Number(formData.ta) || 0,
          supplierCost: Number(formData.supplierCost) || 0,
          payments,
        };

    onSubmit(saleData);
  };

  const handleAddPayment = (payment: Omit<PaymentRecord, "id">) => {
    setPayments([
      ...payments,
      { ...payment, id: Date.now() },
    ]);
  };

  const handleDeletePayment = (paymentId: number) => {
    setPayments(payments.filter((p) => p.id !== paymentId));
  };

  if (!isEditing) return null;

  const supplierCost = Number(formData.supplierCost) || 0;
  const commissionAmount = Number(formData.commissionAmount) || 0;
  const gananciaNeta = totalSaleAmount - supplierCost - commissionAmount;

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
          <h4 className="font-bold text-primary flex items-center gap-2">
            <Receipt size={18} /> Resumen de Venta #{sale.id}
          </h4>
          <Badge variant={sale.status}>
            {sale.status === "pagado"
              ? "Finalizado"
              : sale.status === "abonado"
                ? "Completado"
                : "Pendiente Crédito"}
          </Badge>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500 block text-xs font-medium mb-0.5">
              Fecha de Emisión
            </span>
            <span className="font-semibold text-gray-800">
              {formatDate(sale.date)}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs font-medium mb-0.5">Cliente</span>
            <span className="font-semibold text-gray-800">{sale.clientName}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs font-medium mb-0.5">Vendedor</span>
            <span className="font-semibold text-gray-800">{sale.vendorName}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs font-medium mb-0.5">
              Comisionista
            </span>
            <span className="font-semibold text-gray-800">
              {sale.commissionAgent || "N/A"}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-3 pt-3 mt-1 border-t border-gray-100">
            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
              <ShoppingBag size={14} className="text-accent" /> Productos
              Vendidos / Observaciones
            </span>
            <div className="bg-white p-3 rounded-lg border border-gray-100 max-h-32 overflow-y-auto custom-scrollbar">
              {sale.observations ? (
                <ul className="space-y-1.5">
                  {sale.observations
                    .split("\n")
                    .filter((l) => l.trim())
                    .map((line, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm font-medium text-gray-700"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0"></div>
                        <span>{line}</span>
                      </li>
                    ))}
                </ul>
              ) : (
                <span className="text-gray-400 italic text-sm">
                  No se detallaron servicios
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Valor Final
          </p>
          <p className="text-lg font-black text-gray-800">
            {formatCurrency(sale.total)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Pago Proveedores
          </p>
          <p className="text-lg font-black text-rose-600">
            {formatCurrency(supplierCost)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Ganancias Obtenidas
          </p>
          <p className="text-lg font-black text-emerald-600">
            {formatCurrency(gananciaNeta)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Pagado por Cliente
          </p>
          <p className="text-lg font-black text-blue-600">
            {formatCurrency(totalPaidAmount)}
          </p>
        </div>
      </div>

      <PaymentManager
        payments={payments}
        totalAmount={totalSaleAmount}
        onAddPayment={handleAddPayment}
        onDeletePayment={handleDeletePayment}
        isAdmin={true}
      />
    </div>
  );
}
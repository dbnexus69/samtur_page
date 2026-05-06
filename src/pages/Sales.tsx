import { useState, useMemo } from "react";
import {
  Plus,
  ShoppingBag,
  Receipt,
  TrendingUp,
  Wallet,
  Eye,
  Pencil,
  FileDown,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { FormField, Input, Select, Textarea } from "../components/ui/Form";
import { Table, TableRow, TableCell } from "../components/ui/Table";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { usePermissions } from "../context/PermissionsContext";
import { formatCurrency, formatDate } from "../utils/formatters";
import { Sale } from "../types";
import NewSaleWizard from "../components/sales/NewSaleWizard";

export default function Sales() {
  const { data, addSale, updateSale } = useData();
  const { user, isAdmin } = useAuth();
  const { canCreate, canEdit } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [payments, setPayments] = useState<any[]>([]);
  const [newPayment, setNewPayment] = useState({
    amount: "",
    method: "Efectivo",
  });

  const [formData, setFormData] = useState({
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

  const totalSaleAmount = Number(formData.total) || 0;
  const totalPaidAmount = payments.reduce((acc, p) => acc + p.amount, 0);
  const remainingBalance = totalSaleAmount - totalPaidAmount;

  const filteredSales = useMemo(() => {
    if (isAdmin) return data.sales;
    return data.sales.filter((s) => s.vendorId === user?.id);
  }, [data.sales, isAdmin, user?.id]);

  const totals = useMemo(() => {
    return filteredSales.reduce(
      (acc, s) => ({
        total: acc.total + s.total,
        pagado: acc.pagado + (s.status === "pagado" ? s.total : 0),
        pendiente: acc.pendiente + (s.status === "pendiente" ? s.total : 0),
      }),
      { total: 0, pagado: 0, pendiente: 0 },
    );
  }, [filteredSales]);

  const canEditThis = (sale: Sale): boolean => {
    if (!canEdit("sales")) return false;
    if (isAdmin) return true;
    return sale.vendorId === user?.id;
  };

  const handleOpenNewSale = () => {
    setIsWizardOpen(true);
  };

  const handleOpenModal = (sale?: Sale) => {
    if (sale && !canEditThis(sale)) return;
    if (sale) {
      setEditingSale(sale);
      setFormData({
        clientId: String(sale.clientId),
        total: String(sale.total),
        paymentMethod: sale.paymentMethod,
        status: sale.status,
        observations: sale.observations || "",
        isCredit: sale.isCredit || false,
        creditDueDate: sale.creditDueDate || "",
        commissionAgent: sale.commissionAgent || "",
        commissionAmount: (sale as any).commissionAmount
          ? String((sale as any).commissionAmount)
          : "",
        commissionPaymentMethod: (sale as any).commissionPaymentMethod || "",
        ta: sale.ta ? String(sale.ta) : "",
        supplierCost: sale.supplierCost ? String(sale.supplierCost) : "",
      });
      setPayments(
        (sale as any).payments || [
          {
            id: 1,
            date: "2023-10-15",
            amount: sale.total * 0.4,
            method: "Transferencia",
          },
          {
            id: 2,
            date: "2023-11-01",
            amount: sale.total * 0.2,
            method: "Efectivo",
          },
        ],
      );
    } else {
      setEditingSale(null);
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
    setNewPayment({ amount: "", method: "Efectivo" });
    setIsModalOpen(true);
  };

  const handleViewDetail = (sale: Sale) => {
    setSelectedSale(sale);
    setIsDetailOpen(true);
  };

  const handleDeletePayment = (paymentId: number) => {
    setPayments(payments.filter((p) => p.id !== paymentId));
  };

  const handleDownloadVoucher = (sale: Sale) => {
    setSuccessMessage(`Descargando voucher de la venta #${sale.id}...`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAddPayment = () => {
    const amount = Number(newPayment.amount);
    if (amount > 0 && amount <= remainingBalance) {
      setPayments([
        ...payments,
        {
          id: Date.now(),
          date: new Date().toISOString().split("T")[0],
          amount,
          method: newPayment.method,
        },
      ]);
      setNewPayment({ amount: "", method: "Efectivo" });
    }
  };

  const handleSubmit = () => {
    const client = data.clients.find((c) => c.id === Number(formData.clientId));
    if (!client) return;

    const newStatus =
      totalPaidAmount >= totalSaleAmount
        ? "pagado"
        : totalPaidAmount > 0
          ? "abonado"
          : "pendiente";

    const saleData = {
      clientId: Number(formData.clientId),
      clientName: client.name,
      total: Number(formData.total),
      paymentMethod: formData.paymentMethod,
      status: (editingSale ? newStatus : formData.status) as Sale["status"],
      observations: formData.observations,
      isCredit: formData.isCredit,
      creditDueDate: formData.isCredit ? formData.creditDueDate : undefined,
      creditPaidAmount: formData.isCredit ? totalPaidAmount : undefined,
      commissionAgent: formData.commissionAgent,
      commissionAmount: Number(formData.commissionAmount) || 0,
      commissionPaymentMethod: formData.commissionPaymentMethod,
      ta: Number(formData.ta) || 0,
      supplierCost: Number(formData.supplierCost) || 0,
      payments: payments,
    };

    if (editingSale) {
      updateSale(editingSale.id, saleData as any);
    } else {
      addSale({
        ...(saleData as any),
        vendorId: user!.id,
        vendorName: user!.name,
        date: new Date().toISOString().split("T")[0],
      });
    }
    setIsModalOpen(false);
  };

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

      {/* Header de Sección */}
      <div className="mb-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <ShoppingBag className="text-accent w-8 h-8" /> Gestión de Ventas
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Control de ingresos, facturación y estados de pago de tus clientes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
        <StatCard
          icon={<Receipt size={24} />}
          label="Total Ventas"
          value={formatCurrency(totals.total)}
          color="bg-primary"
        />
        <StatCard
          icon={<TrendingUp size={24} />}
          label="Recaudado (Pagado)"
          value={formatCurrency(totals.pagado)}
          color="bg-green-500"
        />
        <StatCard
          icon={<Wallet size={24} />}
          label="Por Cobrar (Pendiente)"
          value={formatCurrency(totals.pendiente)}
          color="bg-amber-500"
        />
      </div>

      <Card className="animate-fade-in">
        <CardHeader
          actions={
            canCreate("sales") ? (
              <Button onClick={handleOpenNewSale}>
                <Plus size={18} />
                Nueva Venta
              </Button>
            ) : undefined
          }
        >
          Lista de Ventas {isAdmin ? "(Todas)" : "(Mis Ventas)"}
        </CardHeader>
        <Table
          headers={[
            "#",
            "Cliente",
            "Operador/Vendedor",
            "Comisionista",
            "T.A",
            "Proveedores",
            "Total",
            "Fecha",
            "Estado",
            "Acciones",
          ]}
        >
          {filteredSales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{sale.id}</TableCell>
              <TableCell>{sale.clientName}</TableCell>
              <TableCell>{sale.vendorName}</TableCell>
              <TableCell>{sale.commissionAgent || "-"}</TableCell>
              <TableCell>{formatCurrency(sale.ta || 0)}</TableCell>
              <TableCell>{formatCurrency(sale.supplierCost || 0)}</TableCell>
              <TableCell className="font-semibold">
                {formatCurrency(sale.total)}
              </TableCell>
              <TableCell>{formatDate(sale.date)}</TableCell>
              <TableCell>
                <Badge variant={sale.status}>
                  {sale.status === "pagado"
                    ? "Finalizado"
                    : sale.status === "abonado"
                      ? "Completado"
                      : "Pendiente Crédito"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetail(sale)}
                    title="Ver detalle"
                  >
                    <Eye size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadVoucher(sale)}
                    title="Descargar Voucher"
                  >
                    <FileDown size={14} />
                  </Button>
                  {canEditThis(sale) ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenModal(sale)}
                      title="Editar"
                    >
                      <Pencil size={14} />
                    </Button>
                  ) : (
                    <span className="text-xs text-gray-400 self-center">
                      Sin acceso
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      {/* ===== WIZARD MODAL (Nueva Venta) ===== */}
      <Modal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        title="Nueva Venta"
        size="xl"
      >
        <NewSaleWizard
          onClose={() => setIsWizardOpen(false)}
          onSuccess={(msg) => {
            setSuccessMessage(msg);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
          }}
        />
      </Modal>

      {/* ===== EDIT MODAL (Editar Venta) ===== */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSale ? "Editar Venta" : "Nueva Venta"}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Guardar</Button>
          </>
        }
      >
        {editingSale ? (
          <div className="space-y-6">
            {/* Seccion Resumen Solo Lectura */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                <h4 className="font-bold text-primary flex items-center gap-2">
                  <Receipt size={18} /> Resumen de Venta #{editingSale.id}
                </h4>
                <Badge variant={editingSale.status}>
                  {editingSale.status === "pagado"
                    ? "Finalizado"
                    : editingSale.status === "abonado"
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
                    {formatDate(editingSale.date)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs font-medium mb-0.5">
                    Cliente
                  </span>
                  <span className="font-semibold text-gray-800">
                    {editingSale.clientName}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs font-medium mb-0.5">
                    Vendedor
                  </span>
                  <span className="font-semibold text-gray-800">
                    {editingSale.vendorName}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs font-medium mb-0.5">
                    Comisionista
                  </span>
                  <span className="font-semibold text-gray-800">
                    {editingSale.commissionAgent || "N/A"}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-3 pt-3 mt-1 border-t border-gray-100">
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                    <ShoppingBag size={14} className="text-accent" /> Productos
                    Vendidos / Observaciones
                  </span>
                  <div className="bg-white p-3 rounded-lg border border-gray-100 max-h-32 overflow-y-auto custom-scrollbar">
                    {editingSale.observations ? (
                      <ul className="space-y-1.5">
                        {editingSale.observations
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

            {/* Fila de Finanzas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Valor Final
                </p>
                <p className="text-lg font-black text-gray-800">
                  {formatCurrency(editingSale.total)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Pago Proveedores
                </p>
                <p className="text-lg font-black text-rose-600">
                  {formatCurrency(editingSale.supplierCost || 0)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Ganancias Obtenidas
                </p>
                <p className="text-lg font-black text-emerald-600">
                  {formatCurrency(
                    editingSale.total -
                      (editingSale.supplierCost || 0) -
                      ((editingSale as any).commissionAmount || 0),
                  )}
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

            <div className="mt-2 border-t border-gray-200 pt-6 space-y-6">
              <h3 className="text-lg font-black text-primary flex items-center gap-2">
                <Wallet className="text-accent" size={20} />
                Gestión de Pagos y Abonos
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Valor a Pagar
                  </p>
                  <p className="text-xl font-black text-gray-800 mt-1">
                    {formatCurrency(totalSaleAmount)}
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
                  className={`p-4 rounded-xl border shadow-sm ${remainingBalance > 0 ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100"}`}
                >
                  <p
                    className={`text-[10px] font-bold uppercase tracking-widest ${remainingBalance > 0 ? "text-red-600" : "text-green-600"}`}
                  >
                    Pendiente por Pagar
                  </p>
                  <p
                    className={`text-xl font-black mt-1 ${remainingBalance > 0 ? "text-red-700" : "text-green-700"}`}
                  >
                    {formatCurrency(Math.max(0, remainingBalance))}
                  </p>
                </div>
              </div>

              {/* B. Formulario de Agregar Nuevo Abono */}
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
                          {
                            value: "Tarjeta de Crédito",
                            label: "Tarjeta de Crédito",
                          },
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

              {/* C. Historial de Pagos */}
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
                            onClick={() => handleDownloadVoucher(editingSale!)}
                          >
                            <FileDown size={14} className="mr-1" /> PDF
                          </Button>
                          {isAdmin && (
                            <Button
                              variant="outline"
                              size="sm"
                              type="button"
                              className="text-xs py-1.5 px-2 h-auto border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300"
                              onClick={() => handleDeletePayment(p.id)}
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
              {/* Barra de progreso de pago */}
              {(() => {
                const progress =
                  totalSaleAmount > 0
                    ? Math.min(
                        100,
                        Math.round((totalPaidAmount / totalSaleAmount) * 100),
                      )
                    : 0;
                return (
                  <div className="mt-5 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                      <span>Progreso de Pago</span>
                      <span
                        className={
                          progress === 100 ? "text-green-600" : "text-blue-600"
                        }
                      >
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${progress === 100 ? "bg-green-500" : "bg-blue-500"}`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={`Detalle de Venta #${selectedSale?.id}`}
        size="lg"
        footer={
          <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
            Cerrar
          </Button>
        }
      >
        {selectedSale &&
          (() => {
            const client = data.clients.find(
              (c) => c.id === selectedSale.clientId,
            );
            const commissionAmount =
              (selectedSale as any).commissionAmount || 0;
            const supplierCost = selectedSale.supplierCost || 0;
            const gananciaNeta =
              selectedSale.total - supplierCost - commissionAmount;

            return (
              <div className="space-y-6">
                {/* Sección Venta */}
                <div>
                  <h4 className="text-sm font-bold text-primary border-b border-gray-200 pb-2 mb-3">
                    Información de la Venta
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div>
                      <span className="text-gray-500 text-xs block">
                        Venta #
                      </span>{" "}
                      <span className="font-bold text-gray-800">
                        {selectedSale.id}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">Fecha</span>{" "}
                      <span className="font-medium text-gray-800">
                        {formatDate(selectedSale.date)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">
                        Estado
                      </span>{" "}
                      <Badge variant={selectedSale.status}>
                        {selectedSale.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">
                        Valor Final
                      </span>{" "}
                      <span className="font-black text-emerald-600">
                        {formatCurrency(selectedSale.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sección Cliente */}
                <div>
                  <h4 className="text-sm font-bold text-primary border-b border-gray-200 pb-2 mb-3">
                    Detalles del Cliente
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-gray-500 text-xs block">
                        Nombre
                      </span>{" "}
                      <span className="font-medium text-gray-800">
                        {selectedSale.clientName}
                      </span>
                    </div>
                    {client ? (
                      <>
                        <div className="col-span-2 sm:col-span-1">
                          <span className="text-gray-500 text-xs block">
                            Documento
                          </span>{" "}
                          <span className="font-medium text-gray-800">
                            {client.docType} {client.docNumber}
                          </span>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <span className="text-gray-500 text-xs block">
                            Correo
                          </span>{" "}
                          <span className="font-medium text-gray-800 break-words">
                            {client.email}
                          </span>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <span className="text-gray-500 text-xs block">
                            Teléfono
                          </span>{" "}
                          <span className="font-medium text-gray-800">
                            {client.phone}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="col-span-3 text-sm text-gray-400 italic flex items-center">
                        Detalles adicionales del cliente no disponibles
                      </div>
                    )}
                  </div>
                </div>

                {/* Sección Operativo y Financiero */}
                <div>
                  <h4 className="text-sm font-bold text-primary border-b border-gray-200 pb-2 mb-3">
                    Detalles Operativos y Financieros
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div>
                      <span className="text-gray-500 text-xs block">
                        Vendedor/Admin
                      </span>{" "}
                      <span className="font-medium text-gray-800">
                        {selectedSale.vendorName}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">
                        Pago a Proveedores
                      </span>{" "}
                      <span className="font-medium text-rose-600">
                        {formatCurrency(supplierCost)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">
                        Tarifa Admin (T.A)
                      </span>{" "}
                      <span className="font-medium text-gray-800">
                        {formatCurrency(selectedSale.ta || 0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">
                        Ganancia Neta
                      </span>{" "}
                      <span className="font-bold text-emerald-600">
                        {formatCurrency(gananciaNeta)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sección Comisionista */}
                {(selectedSale.commissionAgent || commissionAmount > 0) && (
                  <div>
                    <h4 className="text-sm font-bold text-primary border-b border-gray-200 pb-2 mb-3">
                      Detalles del Comisionista
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <div>
                        <span className="text-gray-500 text-xs block">
                          Nombre
                        </span>{" "}
                        <span className="font-medium text-gray-800">
                          {selectedSale.commissionAgent || "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs block">
                          Forma de Pago
                        </span>{" "}
                        <span className="font-medium text-gray-800">
                          {(selectedSale as any).commissionPaymentMethod || "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs block">
                          Valor Pagado
                        </span>{" "}
                        <span className="font-medium text-rose-600">
                          {formatCurrency(commissionAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Servicios Vendidos */}
                <div>
                  <h4 className="text-sm font-bold text-primary border-b border-gray-200 pb-2 mb-3 flex items-center gap-2">
                    <ShoppingBag size={16} className="text-accent" />{" "}
                    Descripción de los Servicios Vendidos
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-inner min-h-[80px]">
                    {selectedSale.observations ? (
                      <ul className="space-y-2">
                        {selectedSale.observations
                          .split("\n")
                          .filter((l) => l.trim())
                          .map((line, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2.5 text-sm text-gray-700"
                            >
                              <CheckCircle2
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
          })()}
      </Modal>
    </div>
  );

  function StatCard({
    icon,
    label,
    value,
    color,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
  }) {
    return (
      <Card
        className={`text-white ${color} border-none shadow-lg shadow-gray-200`}
      >
        <CardBody className="flex items-center gap-4 py-4">
          <div className="p-3 bg-white/20 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <div>
            <p className="text-xs font-medium text-white/80 uppercase tracking-wider">
              {label}
            </p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </CardBody>
      </Card>
    );
  }
}

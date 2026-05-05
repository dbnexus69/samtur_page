import { useMemo } from "react";
import { CheckCircle, Clock, AlertCircle, CreditCard, DollarSign } from "lucide-react";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { ClientCreditSummary, CreditSaleInfo } from "../../utils/creditUtils";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { Sale } from "../../types";

interface CreditManagerPanelProps {
  clientsWithCredit: ClientCreditSummary[];
  selectedClient: ClientCreditSummary | null;
  onSelectClient: (client: ClientCreditSummary | null) => void;
  creditFilter: "all" | "overdue" | "urgent" | "pending";
  onFilterChange: (status: "all" | "overdue" | "urgent" | "pending") => void;
  sales: Sale[];
}

export function CreditManagerPanel({
  clientsWithCredit,
  selectedClient,
  onSelectClient,
  creditFilter,
  onFilterChange,
  sales,
}: CreditManagerPanelProps) {
  const creditTotals = useMemo(() => {
    return {
      totalPending: clientsWithCredit.reduce((acc, c) => acc + c.pendingAmount, 0),
      totalOverdue: clientsWithCredit.reduce((acc, c) => acc + c.overdueAmount, 0),
      totalUrgent: clientsWithCredit
        .filter((c) => c.status === "urgent")
        .reduce((acc, c) => acc + c.pendingAmount, 0),
    };
  }, [clientsWithCredit]);

  const filteredClients = useMemo(() => {
    if (creditFilter === "all") return clientsWithCredit;
    return clientsWithCredit.filter((c) => c.status === creditFilter);
  }, [clientsWithCredit, creditFilter]);

  const selectedClientSales = useMemo(() => {
    if (!selectedClient) return [];
    return sales
      .filter((s) => s.clientId === selectedClient.client.id && s.isCredit)
      .map((sale) => {
        const paid = sale.creditPaidAmount || 0;
        const pending = sale.total - paid;
        const dueDate = sale.creditDueDate ? new Date(sale.creditDueDate) : null;
        const today = new Date();
        const daysUntilDue = dueDate
          ? Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          : 0;
        let status: "paid" | "partial" | "overdue" | "pending" = "pending";
        if (paid >= sale.total) status = "paid";
        else if (paid > 0) status = "partial";
        else if (dueDate && dueDate < today) status = "overdue";
        return {
          sale,
          status,
          pendingAmount: pending,
          daysUntilDue,
        };
      });
  }, [selectedClient, sales]);

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      paid: "bg-green-100 text-green-700",
      partial: "bg-blue-100 text-blue-700",
      overdue: "bg-red-100 text-red-700",
      pending: "bg-yellow-100 text-yellow-700",
    };
    return colors[status] || colors.pending;
  };

  const getClientStatusColor = (status: string) => {
    const statusColors: Record<string, { bg: string; text: string; label: string }> = {
      all: { bg: "bg-gray-100", text: "text-gray-700", label: "Todos" },
      overdue: { bg: "bg-red-100", text: "text-red-700", label: "Vencido" },
      urgent: { bg: "bg-orange-100", text: "text-orange-700", label: "Pronto" },
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pendiente" },
    };
    return statusColors[status] || statusColors.pending;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <Card className="border-none shadow-lg">
          <CardHeader
            actions={
              <div className="flex gap-2">
                {(["all", "overdue", "urgent", "pending"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => onFilterChange(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      creditFilter === filter
                        ? filter === "overdue"
                          ? "bg-red-500 text-white"
                          : filter === "urgent"
                            ? "bg-orange-500 text-white"
                            : filter === "pending"
                              ? "bg-yellow-500 text-white"
                              : "bg-primary text-white"
                        : filter === "overdue"
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : filter === "urgent"
                            ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                            : filter === "pending"
                              ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {filter === "all"
                      ? `Todos (${clientsWithCredit.length})`
                      : filter === "overdue"
                        ? `Vencidos (${clientsWithCredit.filter((c) => c.status === "overdue").length})`
                        : filter === "urgent"
                          ? `Pronto (${clientsWithCredit.filter((c) => c.status === "urgent").length})`
                          : `Pendiente (${clientsWithCredit.filter((c) => c.status === "pending").length})`}
                  </button>
                ))}
              </div>
            }
          >
            Clientes con Crédito Pendiente
          </CardHeader>
          <CardBody className="p-0">
            {filteredClients.length > 0 ? (
              <div className="divide-y divide-gray-border">
                {filteredClients.map((creditClient) => {
                  const statusColors = getClientStatusColor(creditClient.status);
                  const isSelected = selectedClient?.client.id === creditClient.client.id;
                  return (
                    <div
                      key={creditClient.client.id}
                      className={`p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors cursor-pointer ${
                        isSelected ? "bg-primary/5 border-l-4 border-primary" : ""
                      }`}
                      onClick={() => onSelectClient(creditClient)}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${statusColors.bg} ${statusColors.text}`}
                        >
                          <CreditCard size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-primary">
                              {creditClient.client.name}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors.bg} ${statusColors.text}`}
                            >
                              {statusColors.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <DollarSign size={12} />{" "}
                              {creditClient.activeCredits} crédito(s)
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} />{" "}
                              {creditClient.nextDueDate
                                ? formatDate(creditClient.nextDueDate)
                                : "Sin fecha"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          {formatCurrency(creditClient.pendingAmount)}
                        </p>
                        <p className="text-xs text-gray-500">pendiente</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={32} />
                </div>
                <p className="font-bold text-gray-600">¡Todo al día!</p>
                <p className="text-sm">No hay clientes con crédito pendiente.</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="bg-primary text-white border-none shadow-xl shadow-primary/20">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <CreditCard size={24} />
              </div>
              <span className="bg-white/20 text-white border-none px-2 py-1 rounded-full text-xs font-medium">
                CARTERA
              </span>
            </div>
            <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider">
              Total Pendiente
            </h3>
            <p className="text-3xl font-bold mt-1">
              {formatCurrency(creditTotals.totalPending)}
            </p>
            <div className="mt-4 pt-4 border-t border-white/20 space-y-2">
              <div className="flex justify-between text-xs text-white/70">
                <span>Vencido</span>
                <span className="font-bold text-red-300">
                  {formatCurrency(creditTotals.totalOverdue)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-white/70">
                <span>Próximo (3 días)</span>
                <span className="font-bold text-orange-300">
                  {formatCurrency(creditTotals.totalUrgent)}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        {selectedClient ? (
          <Card className="border-none shadow-lg">
            <CardHeader>{selectedClient.client.name}</CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Total Crédito</p>
                  <p className="text-sm font-bold text-primary">
                    {formatCurrency(selectedClient.totalCredit)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Pendiente</p>
                  <p className="text-sm font-bold text-orange-600">
                    {formatCurrency(selectedClient.pendingAmount)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Pagado</p>
                  <p className="text-sm font-bold text-green-600">
                    {formatCurrency(selectedClient.paidAmount)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Vencido</p>
                  <p className="text-sm font-bold text-red-600">
                    {formatCurrency(selectedClient.overdueAmount)}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs font-bold text-gray-500 uppercase mb-3">
                  Ventas a Crédito
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedClientSales.map((saleInfo) => (
                    <div key={saleInfo.sale.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-bold text-primary">
                            Venta #{saleInfo.sale.id}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(saleInfo.sale.date)} · Vence:{" "}
                            {saleInfo.sale.creditDueDate
                              ? formatDate(saleInfo.sale.creditDueDate)
                              : "N/A"}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(
                            saleInfo.status,
                          )}`}
                        >
                          {saleInfo.status === "paid"
                            ? "Liquidado"
                            : saleInfo.status === "partial"
                              ? "Parcial"
                              : saleInfo.status === "overdue"
                                ? "Vencido"
                                : "Pendiente"}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">
                          Total:{" "}
                          <span className="font-semibold">
                            {formatCurrency(saleInfo.sale.total)}
                          </span>
                        </span>
                        <span className="text-gray-500">
                          Pagado:{" "}
                          <span className="font-semibold text-green-600">
                            {formatCurrency(saleInfo.sale.creditPaidAmount || 0)}
                          </span>
                        </span>
                        <span className="text-gray-500">
                          Pendiente:{" "}
                          <span className="font-semibold text-orange-600">
                            {formatCurrency(saleInfo.pendingAmount)}
                          </span>
                        </span>
                      </div>
                      {saleInfo.daysUntilDue <= 3 && saleInfo.daysUntilDue >= 0 && (
                        <div className="mt-2 flex items-center gap-1 text-[10px] text-orange-600 font-medium">
                          <Clock size={10} />{" "}
                          Vence en {saleInfo.daysUntilDue} día(s)
                        </div>
                      )}
                      {saleInfo.daysUntilDue < 0 && (
                        <div className="mt-2 flex items-center gap-1 text-[10px] text-red-600 font-medium">
                          <AlertCircle size={10} />{" "}
                          Vencido hace {Math.abs(saleInfo.daysUntilDue)} día(s)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        ) : (
          <Card className="border-none shadow-lg">
            <CardBody className="flex flex-col items-center justify-center p-8 text-gray-400">
              <CreditCard size={48} className="mb-4 opacity-20" />
              <p className="font-medium">Selecciona un cliente</p>
              <p className="text-sm">para ver sus créditos</p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
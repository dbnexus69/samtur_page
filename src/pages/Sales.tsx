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
} from "lucide-react";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Form";
import { Table, TableRow, TableCell } from "../components/ui/Table";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { usePermissions } from "../context/PermissionsContext";
import { formatCurrency, formatDate } from "../utils/formatters";
import { Sale } from "../types";
import { SalesStatCard, SaleDetailModal, SaleEditModal } from "../components/sales";
import NewSaleWizard from "../components/sales/NewSaleWizard";

export default function Sales() {
  const { data, addSale, updateSale } = useData();
  const { user, isAdmin } = useAuth();
  const { canCreate, canEdit } = usePermissions();

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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

  const handleOpenNewSale = () => setIsWizardOpen(true);

  const handleOpenEditModal = (sale: Sale) => {
    if (canEditThis(sale)) {
      setEditingSale(sale);
      setIsEditModalOpen(true);
    }
  };

  const handleViewDetail = (sale: Sale) => {
    setSelectedSale(sale);
    setIsDetailOpen(true);
  };

  const handleEditSubmit = (saleData: Partial<Sale>) => {
    if (editingSale) {
      updateSale(editingSale.id, saleData);
      setIsEditModalOpen(false);
      setEditingSale(null);
    }
  };

  const handleDownloadVoucher = (sale: Sale) => {
    setSuccessMessage(`Descargando voucher de la venta #${sale.id}...`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
    return (
      <Card className={`text-white ${color} border-none shadow-lg shadow-gray-200`}>
        <CardBody className="flex items-center gap-4 py-4">
          <div className="p-3 bg-white/20 rounded-xl flex items-center justify-center">{icon}</div>
          <div>
            <p className="text-xs font-medium text-white/80 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </CardBody>
      </Card>
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

      <div className="mb-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <ShoppingBag className="text-accent w-8 h-8" /> Gestión de Ventas
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Control de ingresos, facturación y estados de pago de tus clientes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
        <StatCard icon={<Receipt size={24} />} label="Total Ventas" value={formatCurrency(totals.total)} color="bg-primary" />
        <StatCard icon={<TrendingUp size={24} />} label="Recaudado (Pagado)" value={formatCurrency(totals.pagado)} color="bg-green-500" />
        <StatCard icon={<Wallet size={24} />} label="Por Cobrar (Pendiente)" value={formatCurrency(totals.pendiente)} color="bg-amber-500" />
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
              <TableCell className="font-semibold">{formatCurrency(sale.total)}</TableCell>
              <TableCell>{formatDate(sale.date)}</TableCell>
              <TableCell>
                <Badge variant={sale.status}>
                  {sale.status === "pagado" ? "Finalizado" : sale.status === "abonado" ? "Completado" : "Pendiente"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetail(sale)} title="Ver detalle">
                    <Eye size={14} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDownloadVoucher(sale)} title="Descargar Voucher">
                    <FileDown size={14} />
                  </Button>
                  {canEditThis(sale) ? (
                    <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(sale)} title="Editar">
                      <Pencil size={14} />
                    </Button>
                  ) : (
                    <span className="text-xs text-gray-400 self-center">Sin acceso</span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

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

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingSale(null);
        }}
        title={`Editar Venta #${editingSale?.id || ""}`}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => {
              setIsEditModalOpen(false);
              setEditingSale(null);
            }}>
              Cancelar
            </Button>
            <Button onClick={() => {
              const form = document.getElementById("sale-edit-form");
              if (form) {
                handleEditSubmit({} as Sale);
              }
            }}>
              Guardar
            </Button>
          </>
        }
      >
        {editingSale && (
          <SaleEditModal
            sale={editingSale}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingSale(null);
            }}
            onSubmit={handleEditSubmit}
          />
        )}
      </Modal>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedSale(null);
        }}
        title={`Detalle de Venta #${selectedSale?.id}`}
        size="lg"
        footer={
          <Button variant="outline" onClick={() => {
            setIsDetailOpen(false);
            setSelectedSale(null);
          }}>
            Cerrar
          </Button>
        }
      >
        <SaleDetailModal
          sale={selectedSale}
          clients={data.clients}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedSale(null);
          }}
        />
      </Modal>
    </div>
  );
}
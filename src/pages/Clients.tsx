import { useState, useMemo, useEffect } from "react";
import { Plus, Users as UsersIcon, CreditCard, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { useData } from "../context/DataContext";
import { usePermissions } from "../context/PermissionsContext";
import { Client } from "../types";
import {
  ClientStatsCard,
  ClientFormModal,
  ClientDetailModal,
  ClientsListTable,
  CreditManagerPanel,
} from "../components/clients";
import { getClientsWithCredit, getCreditSummaryTotals } from "../utils/creditUtils";

export default function Clients() {
  const { data, addClient, updateClient, toggleClientStatus } = useData();
  const { canCreate, canEdit } = usePermissions();

  const [activeTab, setActiveTab] = useState<"list" | "credit">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [creditFilter, setCreditFilter] = useState<"all" | "overdue" | "urgent" | "pending">("all");
  const [selectedCreditClient, setSelectedCreditClient] = useState<any>(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const clientsWithCredit = useMemo(
    () => getClientsWithCredit(data.clients, data.sales),
    [data.clients, data.sales],
  );

  const filteredClients = useMemo(() => {
    let clients = data.clients;
    if (statusFilter !== "all") {
      clients = clients.filter((c) => c.status === statusFilter);
    }
    return clients;
  }, [data.clients, statusFilter]);

  const stats = useMemo(() => {
    const total = data.clients.length;
    const active = data.clients.filter((c) => c.status === "active").length;
    const inactive = total - active;
    const recent = data.clients.filter((c) => {
      const regDate = new Date(c.registrationDate);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return regDate >= monthAgo;
    }).length;
    return { total, active, inactive, recent };
  }, [data.clients]);

  const handleOpenModal = (client?: Client) => {
    if (client && !canEdit("clients")) return;
    setEditingClient(client || null);
    setIsModalOpen(true);
  };

  const handleViewDetail = (client: Client) => {
    setSelectedClient(client);
    setIsDetailOpen(true);
  };

  const handleSubmit = (clientData: Partial<Client>) => {
    if (editingClient) {
      updateClient(editingClient.id, clientData);
      setSuccessMessage("Cliente actualizado exitosamente");
    } else {
      addClient({
        ...clientData,
        registrationDate: new Date().toISOString().split("T")[0],
      } as any);
      setSuccessMessage("Nuevo cliente registrado correctamente");
    }
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setIsModalOpen(false);
  };

  const handleToggleStatus = (id: number) => {
    if (!canEdit("clients")) return;
    toggleClientStatus(id);
  };

  return (
    <div className="space-y-6 relative">
      {showSuccess && (
        <div className="fixed top-20 right-6 z-[100] bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 animate-slide-in-right">
          <div className="bg-green-500 text-white rounded-full p-1">
            <CheckCircle size={18} />
          </div>
          <div>
            <p className="font-bold text-sm">Operación Exitosa</p>
            <p className="text-xs opacity-90">{successMessage}</p>
          </div>
        </div>
      )}

      <div className="mb-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
              <UsersIcon className="text-accent w-8 h-8" /> Gestión de Clientes
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Administra la base de datos de tus viajeros y su historial de compras.
            </p>
          </div>
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-border w-fit h-fit">
            <button
              onClick={() => setActiveTab("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "list"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <UsersIcon size={16} /> Lista
            </button>
            <button
              onClick={() => setActiveTab("credit")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                activeTab === "credit"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <CreditCard size={16} /> Crédito
              {clientsWithCredit.filter(
                (c) => c.status === "overdue" || c.status === "urgent",
              ).length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {clientsWithCredit.filter(
                    (c) => c.status === "overdue" || c.status === "urgent",
                  ).length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {activeTab === "list" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in mb-6">
            <ClientStatsCard
              icon={<UsersIcon size={24} />}
              label="Total Clientes"
              value={stats.total}
              color="bg-primary"
            />
            <ClientStatsCard
              icon={<UsersIcon size={24} />}
              label="Activos"
              value={stats.active}
              color="bg-green-500"
            />
            <ClientStatsCard
              icon={<UsersIcon size={24} />}
              label="Nuevos (Mes)"
              value={stats.recent}
              color="bg-accent"
            />
            <ClientStatsCard
              icon={<UsersIcon size={24} />}
              label="Inactivos"
              value={stats.inactive}
              color="bg-amber-500"
            />
          </div>

          <Card className="animate-fade-in">
            <CardHeader
              actions={
                canCreate("clients") ? (
                  <Button onClick={() => handleOpenModal()}>
                    <Plus size={18} />
                    Nuevo Cliente
                  </Button>
                ) : undefined
              }
            >
              Lista de Clientes
            </CardHeader>
            <ClientsListTable
              clients={filteredClients}
              canEdit={canEdit("clients")}
              onEdit={handleOpenModal}
              onView={handleViewDetail}
              onToggleStatus={handleToggleStatus}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />
          </Card>
        </>
      )}

      {activeTab === "credit" && (
        <CreditManagerPanel
          clientsWithCredit={clientsWithCredit}
          selectedClient={selectedCreditClient}
          onSelectClient={setSelectedCreditClient}
          creditFilter={creditFilter}
          onFilterChange={setCreditFilter}
          sales={data.sales}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClient ? "Editar Cliente" : "Nuevo Cliente"}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => handleSubmit({} as Client)}>Guardar</Button>
          </>
        }
      >
        <ClientFormModal
          client={editingClient}
          documentTypes={data.config.documentTypes}
          onSubmit={handleSubmit}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={`Detalle: ${selectedClient?.name}`}
        size="md"
        footer={
          <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
            Cerrar
          </Button>
        }
      >
        <ClientDetailModal
          client={selectedClient}
          sales={data.sales}
          flights={data.flights}
          onClose={() => setIsDetailOpen(false)}
        />
      </Modal>
    </div>
  );
}
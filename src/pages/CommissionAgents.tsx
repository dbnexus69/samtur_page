import { useState, useMemo } from "react";
import { 
  Coins, 
  Search, 
  Plus, 
  Filter, 
  TrendingUp, 
  Wallet, 
  History,
  FileText,
  UserCheck
} from "lucide-react";
import { Card, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { FormField, Input } from "../components/ui/Form";
import { useData } from "../context/DataContext";
import { formatCurrency } from "../utils/formatters";
import ConfigGrids from "../components/config/ConfigGrids";
import ConfigForms from "../components/config/ConfigForms";

export default function CommissionAgents() {
  const { data, addConfigItem, updateConfigItem, deleteConfigItem, settleCommissions } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<any>(null);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'agents' | 'settlements' | 'history'>('agents');
  
  // Estados para el formulario
  const [formData, setFormData] = useState<any>({});
  const [settleData, setSettleData] = useState<any>({
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Transferencia',
    reference: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filtrar comisionistas y calcular acumulados
  const filteredAgents = useMemo(() => {
    const agents = data.config?.commissionAgents || [];
    const sales = data.sales || [];
    return agents.map((agent: any) => {
      const accumulated = sales
        .filter(sale => sale.commissionAgentId === agent.id && !sale.isSettled)
        .reduce((sum, sale) => sum + (sale.commissionAgentNetPayment || 0), 0);
      return { ...agent, accumulated };
    }).filter((agent: any) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.docNumber.includes(searchTerm)
    );
  }, [data.config?.commissionAgents, data.sales, searchTerm]);

  // Calcular totales para los stats
  const stats = useMemo(() => {
    const pendingAmount = data.sales.reduce((acc, sale) => acc + (sale.commissionAgentNetPayment || 0), 0);
    return {
      totalAgents: data.config?.commissionAgents?.length || 0,
      pendingSettlement: pendingAmount,
      totalLiquidated: 12500000, 
    };
  }, [data.config?.commissionAgents, data.sales]);

  const handleOpenModal = (agent?: any) => {
    setErrors({});
    if (agent) {
      setEditingAgent(agent);
      setFormData({ ...agent });
    } else {
      setEditingAgent(null);
      setFormData({ status: 'Activo' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    // Validación básica rápida
    if (!formData.name || !formData.docNumber) {
      setErrors({ 
        name: !formData.name ? 'El nombre es obligatorio' : '',
        docNumber: !formData.docNumber ? 'El documento es obligatorio' : ''
      });
      return;
    }

    if (editingAgent) {
      updateConfigItem('commissionAgents', editingAgent.id, formData);
    } else {
      addConfigItem('commissionAgents', formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este comisionista?")) {
      deleteConfigItem('commissionAgents', id);
    }
  };

  const openSettleModal = (agent: any) => {
    setSelectedAgent(agent);
    setSettleData({
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Transferencia',
      amount: agent.accumulated,
      reference: '',
      notes: ''
    });
    setIsSettleModalOpen(true);
  };

  const handleSettle = () => {
    settleCommissions(selectedAgent.id, settleData);
    setIsSettleModalOpen(false);
    setActiveTab('history');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <Coins className="text-accent w-8 h-8" /> Gestión de Comisionistas
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Administra tus agentes externos, retenciones y liquidaciones de comisiones.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
        <Card className="bg-gradient-to-br from-primary to-blue-800 text-white border-none shadow-lg">
          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-1">Total Comisionistas</p>
              <h3 className="text-3xl font-black">{stats.totalAgents}</h3>
              <p className="text-blue-200 text-[10px] mt-2 flex items-center gap-1 font-semibold">
                <UserCheck size={12} /> {(data.config?.commissionAgents || []).filter((a: any) => a.status === 'Activo').length} activos actualmente
              </p>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl shadow-inner">
              <TrendingUp size={24} />
            </div>
          </div>
        </Card>

        <Card className="bg-white border-gray-100 shadow-sm border-l-4 border-l-amber-500">
          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Pendiente por Liquidar</p>
              <h3 className="text-3xl font-black text-amber-600">{formatCurrency(stats.pendingSettlement)}</h3>
              <p className="text-amber-500 text-[10px] mt-2 flex items-center gap-1 font-semibold">
                <Wallet size={12} /> Requiere atención este mes
              </p>
            </div>
            <div className="bg-amber-50 p-3 rounded-2xl text-amber-600">
              <Coins size={24} />
            </div>
          </div>
        </Card>

        <Card className="bg-white border-gray-100 shadow-sm border-l-4 border-l-emerald-500">
          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Histórico Pagado</p>
              <h3 className="text-3xl font-black text-emerald-600">{formatCurrency(stats.totalLiquidated)}</h3>
              <p className="text-emerald-500 text-[10px] mt-2 flex items-center gap-1 font-semibold">
                <History size={12} /> Acumulado desde el inicio
              </p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Layout with Left Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Vertical Menu */}
        <div className="lg:col-span-1 space-y-2">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-2 mb-4">Menú de Gestión</p>
            <div className="space-y-1">
              {[
                { id: 'agents', label: 'Directorio de Agentes', icon: UserCheck, desc: 'Gestión de perfiles' },
                { id: 'settlements', label: 'Liquidaciones', icon: Wallet, desc: 'Pagos pendientes' },
                { id: 'history', label: 'Historial de Pagos', icon: History, desc: 'Registro histórico' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-lg shadow-primary/20 translate-x-1'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                  }`}
                >
                  <tab.icon size={18} className={activeTab === tab.id ? 'text-accent' : ''} />
                  <div className="text-left">
                    <span className="block text-sm font-bold leading-none">{tab.label}</span>
                    <span className={`text-[9px] font-medium opacity-60 ${activeTab === tab.id ? 'text-white' : 'text-gray-400'}`}>
                      {tab.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3">
          {activeTab === 'agents' && (
            <Card className="animate-fade-in overflow-hidden border-none shadow-lg">
              <CardHeader
                actions={
                  <div className="flex flex-wrap gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <Input
                        className="pl-9 w-64 h-10 text-xs"
                        placeholder="Buscar agente por nombre o documento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button onClick={() => handleOpenModal()} className="h-10 px-6 bg-primary hover:bg-primary/90 shadow-md">
                      <Plus size={18} /> Nuevo Comisionista
                    </Button>
                  </div>
                }
              >
                Directorio de Comisionistas
              </CardHeader>
              
              <div className="p-6 bg-gray-50/30">
                <ConfigGrids 
                  section="commissionAgents"
                  filteredData={filteredAgents}
                  handleOpenModal={handleOpenModal}
                  handleDelete={handleDelete}
                />
              </div>
            </Card>
          )}

          {activeTab === 'settlements' && (
            <div className="space-y-4">
              <Card className="animate-fade-in border-none shadow-lg overflow-hidden">
                <CardHeader>Comisionistas Listos para Liquidar</CardHeader>
                <div className="p-6">
                  {filteredAgents.filter(a => (a.accumulated || 0) >= 50000).length > 0 ? (
                    <div className="space-y-3">
                      {filteredAgents.filter(a => (a.accumulated || 0) >= 50000).map(agent => (
                        <div key={agent.id} className="flex items-center justify-between p-4 bg-amber-50/50 border border-amber-100 rounded-2xl hover:bg-amber-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-lg shadow-amber-200">
                              {agent.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-black text-gray-800">{agent.name}</p>
                              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{agent.docType}: {agent.docNumber}</p>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-6">
                            <div>
                              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Monto Acumulado</p>
                              <p className="text-xl font-black text-gray-800">{formatCurrency(agent.accumulated)}</p>
                            </div>
                            <Button 
                              onClick={() => openSettleModal(agent)}
                              className="bg-amber-500 hover:bg-amber-600 text-white px-6 rounded-xl shadow-md shadow-amber-100"
                            >
                              Liquidar Pago
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <Wallet size={32} />
                      </div>
                      <p className="text-gray-500 font-medium">No hay comisionistas que superen el tope de $50,000 en este momento.</p>
                    </div>
                  )}
                </div>
              </Card>

              <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 flex items-center gap-4">
                <div className="p-3 bg-blue-500 text-white rounded-2xl">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900">¿Cómo funcionan las liquidaciones?</h4>
                  <p className="text-xs text-blue-700/70">Cuando un agente acumula más de $50,000 en comisiones netas de ventas, aparecerá en esta lista para que procedas con su pago físico o transferencia.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <Card className="animate-fade-in border-none shadow-lg overflow-hidden">
              <CardHeader>Historial de Liquidaciones</CardHeader>
              <div className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/80">
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Fecha</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Comisionista</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Método</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Referencia</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Monto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(data.config.commissionSettlements || []).length > 0 ? (
                        [...(data.config.commissionSettlements || [])].reverse().map(s => (
                          <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-gray-600">{s.date}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                                  {s.agentName.charAt(0)}
                                </div>
                                <span className="font-bold text-gray-800 text-sm">{s.agentName}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase">{s.paymentMethod}</span>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-500 italic">{s.reference || 'N/A'}</td>
                            <td className="px-6 py-4 text-right font-black text-gray-800">{formatCurrency(s.amount)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm italic">No hay liquidaciones registradas aún.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Modal de Creación/Edición */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAgent ? "Editar Perfil de Comisionista" : "Registrar Nuevo Comisionista"}
        size="lg"
      >
        <ConfigForms 
          section="commissionAgents"
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          data={data}
          handleSave={handleSave}
        />
      </Modal>

      {/* Modal de Liquidación */}
      <Modal
        isOpen={isSettleModalOpen}
        onClose={() => setIsSettleModalOpen(false)}
        title="Formulario de Liquidación"
      >
        <div className="space-y-6">
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Comisionista a pagar</p>
            <p className="text-xl font-black text-gray-800">{selectedAgent?.name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Fecha de Pago">
              <Input
                type="date"
                value={settleData.date}
                onChange={(e) => setSettleData({ ...settleData, date: e.target.value })}
              />
            </FormField>

            <FormField label="Método de Pago">
              <select
                className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none bg-white text-sm"
                value={settleData.paymentMethod}
                onChange={(e) => setSettleData({ ...settleData, paymentMethod: e.target.value })}
              >
                <option value="Transferencia">Transferencia</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Cheque">Cheque</option>
                <option value="Otro">Otro</option>
              </select>
            </FormField>

            <FormField label="Monto a Liquidar">
              <Input
                type="number"
                value={settleData.amount}
                readOnly
                className="bg-gray-100 font-bold"
              />
            </FormField>

            <FormField label="Número de Referencia / ID Transacción">
              <Input
                placeholder="Ej. TX-987654"
                value={settleData.reference}
                onChange={(e) => setSettleData({ ...settleData, reference: e.target.value })}
              />
            </FormField>
          </div>

          <FormField label="Notas / Observaciones">
            <textarea
              className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none bg-white text-sm"
              rows={3}
              placeholder="Añade detalles adicionales sobre el pago..."
              value={settleData.notes}
              onChange={(e) => setSettleData({ ...settleData, notes: e.target.value })}
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsSettleModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSettle} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
              Confirmar Liquidación
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

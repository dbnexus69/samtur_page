import { createContext, useContext, useEffect, ReactNode } from 'react';
import { AppData, User, Client, Sale, Flight, RolePermissions } from '../types';
import { mockData } from '../data/mockData';
import { useLocalStorage } from '../hooks/useLocalStorage';

type ConfigSection = 'cards' | 'paymentMethods' | 'documentTypes' | 'airlines' | 'suppliers' | 'airports' | 'baggage' | 'packages';

interface DataContextType {
  data: AppData;
  refreshData: () => void;
  addUser: (user: Omit<User, 'id'>) => User;
  updateUser: (id: number, user: Partial<User>) => void;
  deleteUser: (id: number) => void;
  updateUserPermissions: (id: number, permissions: RolePermissions) => void;
  addClient: (client: Omit<Client, 'id'>) => Client;
  updateClient: (id: number, client: Partial<Client>) => void;
  toggleClientStatus: (id: number) => void;
  addSale: (sale: Omit<Sale, 'id'>) => Sale;
  updateSale: (id: number, sale: Partial<Sale>) => void;
  registerCreditPayment: (saleId: number, amount: number, isTotal: boolean) => void;
  updateFlight: (id: number, flight: Partial<Flight>) => void;
  settleCommissions: (agentId: number, settlement: any) => void;
  addConfigItem: (section: ConfigSection, item: Record<string, unknown>) => Record<string, unknown>;
  updateConfigItem: (section: ConfigSection, id: number, item: Record<string, unknown>) => void;
  deleteConfigItem: (section: ConfigSection, id: number) => void;
  addCommissionAgent: (agent: any) => any;
  updateCommissionAgent: (id: number, agent: any) => void;
  deleteCommissionAgent: (id: number) => void;
  updateRolePermissions: (role: 'asesor' | 'freelancer', permissions: RolePermissions) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useLocalStorage<AppData>('itea_data', mockData);

  useEffect(() => {
    if (!data) return;

    // Migración de datos antiguos (vendor/vendedor -> asesor)
    const needsMigration = data.sales?.some(s => ((s as any).vendorName && !s.asesorName) || (s as any).status === 'pendiente') || 
                          data.users?.some(u => (u.role as string).toLowerCase() === 'vendedor' || (u.role as string).toLowerCase() === 'vendor');

    if (needsMigration) {
      const migratedSales = data.sales.map(s => ({
        ...s,
        asesorName: s.asesorName || (s as any).vendorName,
        asesorId: s.asesorId || (s as any).vendorId,
        status: (s as any).status === 'pendiente' ? 'credito' : s.status
      }));

      const migratedUsers = data.users.map(u => ({
        ...u,
        role: ['vendedor', 'vendor'].includes((u.role as string).toLowerCase()) ? 'asesor' : u.role
      }));

      setData({
        ...data,
        sales: migratedSales,
        users: migratedUsers
      });
    }

    const currentAirlines = data.config?.airlines || [];
    const hasOldAirlines = currentAirlines.length < 18 || currentAirlines.some((a: any) => !a.website || !a.type);
    
    const currentSuppliers = data.config?.suppliers || [];
    const hasOldSuppliers = currentSuppliers.some((s: any) => !s.website);

    const currentAirports = data.config?.airports || [];
    const hasOldAirports = currentAirports.length === 0;

    const currentBaggage = data.config?.baggage || [];
    const hasOldBaggage = currentBaggage.length === 0 || currentBaggage.some((b: any) => !b.airlineName || !b.fareType);

    const currentPackages = data.config?.packages || [];
    const hasOldPackages = !data.config?.packages || (currentPackages.length === 0 && mockData.config.packages.length > 0);

    if ((hasOldAirlines || hasOldSuppliers || hasOldAirports || hasOldBaggage || hasOldPackages) && mockData?.config) {
      setData({
        ...data,
        config: {
          ...data.config,
          airlines: hasOldAirlines ? mockData.config.airlines : data.config.airlines,
          suppliers: hasOldSuppliers ? mockData.config.suppliers : data.config.suppliers,
          airports: hasOldAirports ? mockData.config.airports : data.config.airports,
          baggage: hasOldBaggage ? mockData.config.baggage : data.config.baggage,
          packages: hasOldPackages ? mockData.config.packages : data.config.packages
        }
      });
    }

    // Migración y/o Inicialización de comisionistas (fuera de config)
    const hasAgents = data.commissionAgents && data.commissionAgents.length > 0;
    const hasOldConfigAgents = (data.config as any)?.commissionAgents;

    if (!hasAgents || hasOldConfigAgents) {
      const agents = hasAgents ? data.commissionAgents : (hasOldConfigAgents || mockData.commissionAgents || []);
      const settlements = data.commissionSettlements || (data.config as any)?.commissionSettlements || [];
      
      const newConfig = { ...data.config };
      delete (newConfig as any).commissionAgents;
      delete (newConfig as any).commissionSettlements;

      // También intentamos recuperar las ventas que deberían tener comisionista
      const updatedSales = data.sales.map(s => {
        const mockSale = mockData.sales.find(ms => ms.id === s.id);
        if (mockSale?.commissionAgentId && !s.commissionAgentId) {
          return { ...s, commissionAgentId: mockSale.commissionAgentId, commissionAgentName: mockSale.commissionAgentName };
        }
        return s;
      });

      setData({
        ...data,
        sales: updatedSales,
        commissionAgents: agents,
        commissionSettlements: settlements,
        config: newConfig
      });
    }
  }, []);

  const refreshData = () => {
    const stored = localStorage.getItem('itea_data');
    if (stored) {
      setData(JSON.parse(stored));
    }
  };

  const generateId = (list: any[]) => {
    if (!list || list.length === 0) return 1;
    return Math.max(...list.map((i: any) => i.id)) + 1;
  };

  const addUser = (user: Omit<User, 'id'>): User => {
    const newUser = { ...user, id: generateId(data.users) };
    setData({ ...data, users: [...data.users, newUser] });
    return newUser;
  };

  const updateUser = (id: number, userUpdate: Partial<User>) => {
    setData({
      ...data,
      users: data.users.map(u => u.id === id ? { ...u, ...userUpdate } : u)
    });
  };

  const deleteUser = (id: number) => {
    setData({
      ...data,
      users: data.users.filter(u => u.id !== id)
    });
  };

  const addClient = (client: Omit<Client, 'id'>): Client => {
    const newClient = { ...client, id: generateId(data.clients) };
    setData({ ...data, clients: [...data.clients, newClient] });
    return newClient;
  };

  const updateClient = (id: number, clientUpdate: Partial<Client>) => {
    setData({
      ...data,
      clients: data.clients.map(c => c.id === id ? { ...c, ...clientUpdate } : c)
    });
  };



  const toggleClientStatus = (id: number) => {
    const client = data.clients.find(c => c.id === id);
    if (client) {
      updateClient(id, { 
        status: client.status === 'active' ? 'inactive' : 'active' 
      });
    }
  };

  const addSale = (sale: Omit<Sale, 'id'>): Sale => {
    const newSale = { ...sale, id: generateId(data.sales) };
    
    const newFlights: Flight[] = [];
    if (sale.ticketData && sale.ticketData.length > 0) {
      let maxFlightId = generateId(data.flights);
      
      sale.ticketData.forEach(ticket => {
        ticket.legs?.forEach(leg => {
          if (leg.origin && leg.destination && leg.date) {
            newFlights.push({
              id: maxFlightId++,
              passenger: ticket.passengerInfo?.name || sale.clientName || 'Pasajero',
              route: `${leg.origin} - ${leg.destination}`,
              airline: ticket.airline,
              date: leg.date,
              time: 'TBD',
              type: 'ida',
              checkin: 'pendiente'
            });
          }
        });

        if (ticket.flightMode === 'round_trip' && ticket.returnLeg && ticket.returnLeg.origin && ticket.returnLeg.destination && ticket.returnLeg.date) {
          newFlights.push({
            id: maxFlightId++,
            passenger: ticket.passengerInfo?.name || sale.clientName || 'Pasajero',
            route: `${ticket.returnLeg.origin} - ${ticket.returnLeg.destination}`,
            airline: ticket.airline,
            date: ticket.returnLeg.date,
            time: 'TBD',
            type: 'regreso',
            checkin: 'pendiente'
          });
        }
      });
    }

    setData({ 
      ...data, 
      sales: [...data.sales, newSale],
      flights: [...data.flights, ...newFlights] 
    });
    return newSale;
  };

  const updateSale = (id: number, saleUpdate: Partial<Sale>) => {
    setData({
      ...data,
      sales: data.sales.map(s => s.id === id ? { ...s, ...saleUpdate } : s)
    });
  };

  const registerCreditPayment = (saleId: number, amount: number, isTotal: boolean) => {
    const sale = data.sales.find(s => s.id === saleId);
    if (!sale) return;
    
    const currentPaid = sale.creditPaidAmount || 0;
    const newPaidAmount = isTotal ? sale.total : currentPaid + amount;
    const newStatus: 'pagado' | 'abonado' = isTotal || newPaidAmount >= sale.total ? 'pagado' : 'abonado';
    
    setData({
      ...data,
      sales: data.sales.map(s => s.id === saleId ? {
        ...s,
        creditPaidAmount: newPaidAmount,
        status: newStatus
      } : s)
    });
  };

  const settleCommissions = (agentId: number, settlement: any) => {
    const agent = data.commissionAgents.find(a => a.id === agentId);
    const settlements = data.commissionSettlements || [];
    const settlementId = settlements.length > 0 ? Math.max(...settlements.map(s => s.id)) + 1 : 1;
    const newSettlement = {
      ...settlement,
      id: settlementId,
      agentId,
      agentName: agent?.name || 'Agente Desconocido',
      salesIds: data.sales
        .filter(s => s.commissionAgentId === agentId && !s.isSettled)
        .map(s => s.id)
    };
    setData({
      ...data,
      sales: data.sales.map(s =>
        s.commissionAgentId === agentId && !s.isSettled
          ? { ...s, isSettled: true, settlementDate: settlement.date }
          : s
      ),
      commissionSettlements: [...settlements, newSettlement]
    });
  };

  const updateFlight = (id: number, flightUpdate: Partial<Flight>) => {
    setData({
      ...data,
      flights: data.flights.map(f => f.id === id ? { ...f, ...flightUpdate } : f)
    });
  };

  const addConfigItem = (section: ConfigSection, item: Record<string, unknown>): Record<string, unknown> => {
    const sectionData = data.config[section] as any[];
    const newItem = { ...item, id: generateId(sectionData) };
    setData({
      ...data,
      config: {
        ...data.config,
        [section]: [...sectionData, newItem]
      }
    });
    return newItem;
  };

  const addCommissionAgent = (agent: any) => {
    const newAgent = { ...agent, id: generateId(data.commissionAgents) };
    setData({
      ...data,
      commissionAgents: [...data.commissionAgents, newAgent]
    });
    return newAgent;
  };

  const updateConfigItem = (section: ConfigSection, id: number, itemUpdate: Record<string, unknown>) => {
    const sectionData = data.config[section] as Record<string, unknown>[];
    setData({
      ...data,
      config: {
        ...data.config,
        [section]: sectionData.map(i => i.id === id ? { ...i, ...itemUpdate } : i)
      }
    });
  };

  const updateCommissionAgent = (id: number, agentUpdate: any) => {
    setData({
      ...data,
      commissionAgents: data.commissionAgents.map(a => a.id === id ? { ...a, ...agentUpdate } : a)
    });
  };

  const deleteConfigItem = (section: ConfigSection, id: number) => {
    const sectionData = data.config[section] as Record<string, unknown>[];
    setData({
      ...data,
      config: {
        ...data.config,
        [section]: sectionData.filter(i => i.id !== id)
      }
    });
  };

  const deleteCommissionAgent = (id: number) => {
    setData({
      ...data,
      commissionAgents: data.commissionAgents.filter(a => a.id !== id)
    });
  };

  const updateRolePermissions = (role: 'asesor' | 'freelancer', permissions: RolePermissions) => {
    setData({
      ...data,
      config: {
        ...data.config,
        rolePermissions: {
          ...data.config.rolePermissions,
          [role]: permissions
        }
      }
    });
  };

  const updateUserPermissions = (id: number, permissions: RolePermissions) => {
    setData({
      ...data,
      users: data.users.map(u => u.id === id ? { ...u, customPermissions: permissions } : u)
    });
  };

  return (
    <DataContext.Provider value={{
      data,
      refreshData,
      addUser,
      updateUser,
      deleteUser,
      updateUserPermissions,
      addClient,
      updateClient,
      toggleClientStatus,
      addSale,
      updateSale,
      settleCommissions,
      registerCreditPayment,
      updateFlight,
      addConfigItem,
      updateConfigItem,
      deleteConfigItem,
      addCommissionAgent,
      updateCommissionAgent,
      deleteCommissionAgent,
      updateRolePermissions
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
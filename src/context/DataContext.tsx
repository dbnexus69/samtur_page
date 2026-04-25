import { createContext, useContext, useEffect, ReactNode } from 'react';
import { AppData, User, Client, Sale, Flight, RolePermissions } from '../types';
import { mockData } from '../data/mockData';
import { useLocalStorage } from '../hooks/useLocalStorage';

type ConfigSection = 'cards' | 'paymentMethods' | 'documentTypes' | 'airlines' | 'suppliers' | 'routes' | 'baggage';

interface DataContextType {
  data: AppData;
  refreshData: () => void;
  addUser: (user: Omit<User, 'id'>) => User;
  updateUser: (id: number, user: Partial<User>) => void;
  updateUserPermissions: (id: number, permissions: RolePermissions) => void;
  addClient: (client: Omit<Client, 'id'>) => Client;
  updateClient: (id: number, client: Partial<Client>) => void;
  deleteClient: (id: number) => void;
  addSale: (sale: Omit<Sale, 'id'>) => Sale;
  updateSale: (id: number, sale: Partial<Sale>) => void;
  updateFlight: (id: number, flight: Partial<Flight>) => void;
  addConfigItem: (section: ConfigSection, item: Record<string, unknown>) => Record<string, unknown>;
  updateConfigItem: (section: ConfigSection, id: number, item: Record<string, unknown>) => void;
  deleteConfigItem: (section: ConfigSection, id: number) => void;
  updateRolePermissions: (permissions: RolePermissions) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  localStorage.removeItem('samtour_data');
  const [data, setData] = useLocalStorage<AppData>('samtour_data', mockData);

  useEffect(() => {
    setData(mockData);
  }, []);

  const refreshData = () => {
    const stored = localStorage.getItem('samtour_data');
    if (stored) {
      setData(JSON.parse(stored));
    }
  };

  const generateId = (array: { id: number }[]) => {
    return array.length > 0 ? Math.max(...array.map(i => i.id)) + 1 : 1;
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

  const deleteClient = (id: number) => {
    setData({
      ...data,
      clients: data.clients.filter(c => c.id !== id)
    });
  };

  const addSale = (sale: Omit<Sale, 'id'>): Sale => {
    const newSale = { ...sale, id: generateId(data.sales) };
    setData({ ...data, sales: [...data.sales, newSale] });
    return newSale;
  };

  const updateSale = (id: number, saleUpdate: Partial<Sale>) => {
    setData({
      ...data,
      sales: data.sales.map(s => s.id === id ? { ...s, ...saleUpdate } : s)
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

  const updateRolePermissions = (permissions: RolePermissions) => {
    setData({
      ...data,
      config: {
        ...data.config,
        rolePermissions: {
          vendor: permissions
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
      updateUserPermissions,
      addClient,
      updateClient,
      deleteClient,
      addSale,
      updateSale,
      updateFlight,
      addConfigItem,
      updateConfigItem,
      deleteConfigItem,
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
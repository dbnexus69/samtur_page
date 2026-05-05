import { useMemo } from "react";
import { useData } from "../context/DataContext";
import { Client, Sale } from "../types";

export interface ClientWithCredit {
  client: Client;
  activeCredits: number;
  totalCredit: number;
  pendingAmount: number;
  paidAmount: number;
  nextDueDate: string | null;
  overdueAmount: number;
  status: "all" | "overdue" | "urgent" | "pending";
}

export interface ClientFilters {
  status?: "active" | "inactive";
  searchTerm?: string;
}

export function useClients() {
  const { data, addClient, updateClient, toggleClientStatus } = useData();

  const getFilteredClients = (filters?: ClientFilters): Client[] => {
    let clients = data.clients;

    if (filters?.status) {
      clients = clients.filter((c) => c.status === filters.status);
    }

    if (filters?.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      clients = clients.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.docNumber.includes(term) ||
          c.email.toLowerCase().includes(term),
      );
    }

    return clients;
  };

  const getClientSales = (clientId: number): Sale[] => {
    return data.sales.filter((s) => s.clientId === clientId);
  };

  const getClientTotalSpent = (clientId: number): number => {
    return data.sales
      .filter((s) => s.clientId === clientId)
      .reduce((acc, s) => acc + s.total, 0);
  };

  const getClientsWithCredit = (): ClientWithCredit[] => {
    const today = new Date();
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

    return data.clients
      .map((client) => {
        const clientSales = getClientSales(client.id).filter((s) => s.isCredit);
        
        if (clientSales.length === 0) return null;

        let totalCredit = 0;
        let pendingAmount = 0;
        let paidAmount = 0;
        let overdueAmount = 0;
        let nextDueDate: string | null = null;

        clientSales.forEach((sale) => {
          totalCredit += sale.total;
          const paid = sale.creditPaidAmount || 0;
          paidAmount += paid;
          const pending = sale.total - paid;
          pendingAmount += pending;

          if (sale.creditDueDate) {
            const dueDate = new Date(sale.creditDueDate);
            if (!nextDueDate || dueDate < new Date(nextDueDate)) {
              nextDueDate = sale.creditDueDate;
            }
            if (dueDate < today) {
              overdueAmount += pending;
            }
          }
        });

        let status: ClientWithCredit["status"] = "all";
        if (overdueAmount > 0) {
          status = "overdue";
        } else if (nextDueDate && new Date(nextDueDate) <= threeDaysFromNow) {
          status = "urgent";
        } else if (pendingAmount > 0) {
          status = "pending";
        }

        return {
          client,
          activeCredits: clientSales.length,
          totalCredit,
          pendingAmount,
          paidAmount,
          nextDueDate,
          overdueAmount,
          status,
        };
      })
      .filter((c): c is ClientWithCredit => c !== null && c.pendingAmount > 0);
  };

  const getCreditTotals = () => {
    const clientsWithCredit = getClientsWithCredit();
    
    return {
      totalPending: clientsWithCredit.reduce((acc, c) => acc + c.pendingAmount, 0),
      totalOverdue: clientsWithCredit.reduce((acc, c) => acc + c.overdueAmount, 0),
      totalUrgent: clientsWithCredit.filter((c) => c.status === "urgent").reduce((acc, c) => acc + c.pendingAmount, 0),
      clientsCount: clientsWithCredit.length,
    };
  };

  const searchClients = (term: string): Client[] => {
    if (!term) return data.clients;
    const lowerTerm = term.toLowerCase();
    return data.clients.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerTerm) ||
        c.docNumber.includes(term) ||
        c.email.toLowerCase().includes(lowerTerm),
    );
  };

  return {
    clients: data.clients,
    filteredClients: getFilteredClients(),
    getFilteredClients,
    getClientSales,
    getClientTotalSpent,
    getClientsWithCredit,
    getCreditTotals,
    searchClients,
    addClient,
    updateClient,
    toggleClientStatus,
  };
}
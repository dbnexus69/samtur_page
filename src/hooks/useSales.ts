import { useMemo } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { Sale, PaymentRecord } from "../types";

export interface SalesTotals {
  total: number;
  pagado: number;
  pendiente: number;
  abonado: number;
}

export interface SaleFilters {
  vendorId?: number;
  status?: Sale["status"];
  category?: string;
  clientId?: number;
  dateFrom?: string;
  dateTo?: string;
}

export function useSales() {
  const { data, addSale, updateSale, registerCreditPayment } = useData();
  const { user, isAdmin } = useAuth();

  const getFilteredSales = (filters?: SaleFilters): Sale[] => {
    let sales = data.sales;

    if (filters?.vendorId && !isAdmin) {
      sales = sales.filter((s) => s.vendorId === filters.vendorId);
    } else if (!isAdmin && user) {
      sales = sales.filter((s) => s.vendorId === user.id);
    }

    if (filters?.status) {
      sales = sales.filter((s) => s.status === filters.status);
    }

    if (filters?.category) {
      sales = sales.filter((s) => s.category === filters.category);
    }

    if (filters?.clientId) {
      sales = sales.filter((s) => s.clientId === filters.clientId);
    }

    if (filters?.dateFrom) {
      sales = sales.filter((s) => s.date >= filters.dateFrom!);
    }

    if (filters?.dateTo) {
      sales = sales.filter((s) => s.date <= filters.dateTo!);
    }

    return sales;
  };

  const getSaleTotals = (sales: Sale[]): SalesTotals => {
    return sales.reduce(
      (acc, s) => ({
        total: acc.total + s.total,
        pagado: acc.pagado + (s.status === "pagado" ? s.total : 0),
        abonado: acc.abonado + (s.status === "abonado" ? s.total : 0),
        pendiente: acc.pendiente + (s.status === "pendiente" ? s.total : 0),
      }),
      { total: 0, pagado: 0, pendiente: 0, abonado: 0 },
    );
  };

  const canEditSale = (sale: Sale): boolean => {
    if (!user) return false;
    if (isAdmin) return true;
    return sale.vendorId === user.id;
  };

  const calculateSaleProfit = (sale: Sale): number => {
    const supplierCost = sale.supplierCost || 0;
    const commissionAmount = sale.commissionAmount || 0;
    return sale.total - supplierCost - commissionAmount;
  };

  const getSalePayments = (sale: Sale): PaymentRecord[] => {
    return sale.payments || [];
  };

  const calculatePaidAmount = (sale: Sale): number => {
    if (sale.payments && sale.payments.length > 0) {
      return sale.payments.reduce((acc, p) => acc + p.amount, 0);
    }
    return sale.creditPaidAmount || 0;
  };

  const getPendingBalance = (sale: Sale): number => {
    const paid = calculatePaidAmount(sale);
    return Math.max(0, sale.total - paid);
  };

  const isSaleFullyPaid = (sale: Sale): boolean => {
    return calculatePaidAmount(sale) >= sale.total;
  };

  return {
    sales: data.sales,
    filteredSales: getFilteredSales(),
    totals: getSaleTotals(getFilteredSales()),
    canEditSale,
    calculateSaleProfit,
    getSalePayments,
    calculatePaidAmount,
    getPendingBalance,
    isSaleFullyPaid,
  };
}
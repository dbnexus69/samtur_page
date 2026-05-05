import { Card, CardHeader } from "../ui/Card";
import { Sale } from "../../types";
import { formatCurrency, formatDate } from "../../utils/formatters";

interface RecentSalesTableProps {
  sales: Sale[];
}

export function RecentSalesTable({ sales }: RecentSalesTableProps) {
  const recentSales = sales.slice(0, 5);

  return (
    <Card>
      <CardHeader>Ultimas Ventas</CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Vendedor</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {recentSales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{sale.clientName}</td>
                <td className="px-4 py-3">{sale.vendorName}</td>
                <td className="px-4 py-3">{sale.date}</td>
                <td className="px-4 py-3 font-semibold">
                  {formatCurrency(sale.total)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sale.status === "pagado"
                        ? "bg-green-100 text-green-800"
                        : sale.status === "abonado"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {sale.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
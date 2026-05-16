import { Eye, FileDown, Pencil } from "lucide-react";
import { RxUpdate } from "react-icons/rx";
import { Table, TableRow, TableCell } from "../ui/Table";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { Sale } from "../../types";

interface SalesTableProps {
  sales: Sale[];
  onViewDetail: (sale: Sale) => void;
  onDownloadVoucher: (sale: Sale) => void;
  onEdit: (sale: Sale) => void;
  canEditThis: (sale: Sale) => boolean;
  isAdmin: boolean;
}

export default function SalesTable({
  sales,
  onViewDetail,
  onDownloadVoucher,
  onEdit,
  canEditThis,
  isAdmin,
}: SalesTableProps) {
  return (
    <Table
      headers={[
        "#",
        "Cliente",
        "Asesor",
        "Comisionista",
        "T.A",
        "Proveedores",
        "Total",
        "Fecha",
        "Estado",
        "Acciones",
      ]}
    >
      {sales.map((sale) => (
        <TableRow key={sale.id}>
          <TableCell>{sale.id}</TableCell>
          <TableCell>{sale.clientName}</TableCell>
          <TableCell>{sale.asesorName}</TableCell>
          <TableCell>{sale.commissionAgentName || "-"}</TableCell>
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
                  : "Crédito"}
            </Badge>
          </TableCell>
          <TableCell>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetail(sale)}
                title="Ver detalle"
              >
                <Eye size={14} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownloadVoucher(sale)}
                title="Descargar Voucher"
              >
                <FileDown size={14} />
              </Button>
              {canEditThis(sale) ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(sale)}
                  title="Actualizar abonos"
                >
                  <RxUpdate size={14} />
                </Button>
              ) : (
                <span className="self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    title="Actualizar abonos"
                    disabled
                  >
                    <RxUpdate size={14} />
                  </Button>
                </span>
              )}
            </div>
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
}

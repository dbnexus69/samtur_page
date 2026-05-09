import { CreditCard } from "lucide-react";
import { FormField, Input, Select, Textarea, Combobox } from "../../ui/Form";
import { WizardFormData } from "../wizardData";

export function Step3Payment({ form, set, data, errors }: any) {
  return (
    <div className="animate-fade-in space-y-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CreditCard size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-primary text-base">
              Observaciones y Pago
            </h3>
            <p className="text-xs text-gray-500">
              Agrega comentarios y configura la forma de pago.
            </p>
          </div>
        </div>

        <FormField label="Observaciones / Comentarios">
          <Textarea
            value={form.observations}
            onChange={(e) => set("observations", e.target.value)}
            placeholder="Detalles adicionales sobre los productos seleccionados..."
            rows={3}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Valor Total *" error={errors.total}>
            <Input
              type="number"
              value={form.total}
              readOnly
              className="bg-gray-100"
              placeholder="0"
              error={errors.total}
            />
          </FormField>

          <FormField
            label="Forma de Pago *"
            error={errors.paymentMethod}
          >
            <Combobox
              value={form.paymentMethod}
              onChange={(val) => set("paymentMethod", val)}
              options={data.config.paymentMethods.map((p: any) => ({
                value: p.name,
                label: p.name,
              }))}
              placeholder="Selecciona o escribe..."
              error={errors.paymentMethod}
            />
          </FormField>

          <FormField label="T.A. (Tarifa Administrativa)">
            <Input
              type="number"
              value={form.ta}
              readOnly
              className="bg-gray-100"
              placeholder="0"
            />
          </FormField>

          <FormField label="Costo Proveedores">
            <Input
              type="number"
              value={form.supplierCost}
              readOnly
              className="bg-gray-100"
              placeholder="0"
            />
          </FormField>

          <FormField label="Estado">
            <Combobox
              value={form.status}
              onChange={(val) => set("status", val)}
              options={[
                { value: "pendiente", label: "Pendiente Crédito" },
                { value: "abonado", label: "Completado" },
                { value: "pagado", label: "Finalizado" },
              ]}
            />
          </FormField>
        </div>

        <div className="flex items-center gap-3 py-2 border-t border-gray-border mt-4">
          <input
            type="checkbox"
            id="wizard-isCredit"
            checked={form.isCredit}
            onChange={(e) => set("isCredit", e.target.checked)}
            className="w-4 h-4 rounded border-gray-border text-primary focus:ring-primary"
          />
          <label
            htmlFor="wizard-isCredit"
            className="text-sm font-medium text-gray-700"
          >
            Venta a crédito
          </label>
        </div>

        {form.isCredit && (
          <FormField label="Fecha de Vencimiento">
            <Input
              type="date"
              value={form.creditDueDate}
              onChange={(e) => set("creditDueDate", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </FormField>
        )}

        {/* Summary card */}
        {Number(form.total) > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mt-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Resumen Financiero
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Total
                </p>
                <p className="font-black text-gray-800">
                  ${Number(form.total).toLocaleString("es-CO")}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Proveedores
                </p>
                <p className="font-black text-rose-600">
                  ${(Number(form.supplierCost) || 0).toLocaleString("es-CO")}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Comisión
                </p>
                <p className="font-black text-amber-600">
                  ${(Number(form.commissionAmount) || 0).toLocaleString("es-CO")}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Ganancia
                </p>
                <p className="font-black text-emerald-600">
                  $
                  {(
                    Number(form.total) -
                    (Number(form.supplierCost) || 0) -
                    (Number(form.commissionAmount) || 0)
                  ).toLocaleString("es-CO")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}

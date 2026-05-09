import { Users } from "lucide-react";
import { FormField, Input, Combobox, Select } from "../../ui/Form";
import { WizardFormData } from "../wizardData";

export function Step1Client({ form, set, data, errors }: any) {
  return (
    <div className="animate-fade-in space-y-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-primary text-base">
              Cliente y Comisionista
            </h3>
            <p className="text-xs text-gray-500">
              Selecciona el cliente y los datos del comisionista si aplica.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Cliente *" error={errors.clientId}>
            <Combobox
              value={form.clientId}
              onChange={(val) => set("clientId", val)}
              options={data.clients
                .filter((c: any) => c.status === "active")
                .map((c: any) => ({
                  value: c.name,
                  label: c.name,
                }))}
              placeholder="Seleccionar o escribir nombre..."
              error={errors.clientId}
            />
          </FormField>

          <FormField label="Vendedor / Operador *">
            <Combobox
              value={form.vendorName}
              onChange={(val) => {
                const selected = data.users.find((u: any) => u.name === val);
                if (selected) {
                  set("vendorId", String(selected.id));
                  set("vendorName", selected.name);
                } else {
                  set("vendorName", val);
                }
              }}
              options={data.users
                .filter((u: any) => u.status === "active")
                .map((u: any) => ({
                  value: u.name,
                  label: u.name,
                }))}
              placeholder="¿Quién realiza la venta?"
            />
          </FormField>

          <FormField label="Comisionista">
            <Combobox
              value={form.commissionAgent || ""}
              onChange={(val) => set("commissionAgent", val)}
              options={[
                { value: "Agencia Viajes Plus", label: "Agencia Viajes Plus" },
                { value: "Asesor Independiente", label: "Asesor Independiente" },
                { value: "Ventas Directas Web", label: "Ventas Directas Web" },
                { value: "Referido por Cliente", label: "Referido por Cliente" },
                { value: "Alianza Corporativa", label: "Alianza Corporativa" },
                { value: "Referido Familiar", label: "Referido Familiar" },
                { value: "Aliado Comercial", label: "Aliado Comercial" },
              ]}
              placeholder="Escribe o selecciona..."
            />
          </FormField>

          <FormField label="Valor Comisión">
            <Input
              type="number"
              value={form.commissionAmount}
              onChange={(e) => set("commissionAmount", e.target.value)}
              placeholder="0"
            />
          </FormField>

          <FormField label="Forma de Pago Comisión">
            <Select
              value={form.commissionPaymentMethod}
              onChange={(e) =>
                set("commissionPaymentMethod", e.target.value)
              }
              options={[
                { value: "", label: "No aplica / Pendiente" },
                ...data.config.paymentMethods.map((p) => ({
                  value: p.name,
                  label: p.name,
                })),
              ]}
            />
          </FormField>
        </div>

        {/* Client preview card */}
        {form.clientId && (() => {
          const client = data.clients.find(
            (c: any) => c.name === form.clientId,
          );
          if (!client) return null;
          return (
            <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <img
                src={client.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${client.firstName}`}
                alt={client.name}
                className="w-12 h-12 rounded-full bg-gray-100"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-sm truncate">
                  {client.name}
                </p>
                <p className="text-xs text-gray-500">
                  {client.docType} {client.docNumber} · {client.email}
                </p>
              </div>
            </div>
          );
        })()}
      </div>
  );
}

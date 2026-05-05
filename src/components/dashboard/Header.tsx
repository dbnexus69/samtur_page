import { ShoppingBag, Users, DollarSign, CreditCard } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          {title === "Panel de Control" ? (
            <Users className="w-8 h-8 text-accent" />
          ) : (
            <DollarSign className="w-8 h-8 text-accent" />
          )}
          {title}
        </h1>
        <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
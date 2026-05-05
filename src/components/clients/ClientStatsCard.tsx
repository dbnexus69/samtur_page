import { ReactNode } from "react";
import { Card, CardBody } from "../ui/Card";

interface ClientStatsCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  color: string;
}

export function ClientStatsCard({ icon, label, value, color }: ClientStatsCardProps) {
  return (
    <Card className={`text-white ${color} border-none shadow-lg shadow-gray-200`}>
      <CardBody className="flex items-center gap-4 py-4">
        <div className="p-3 bg-white/20 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium text-white/80 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardBody>
    </Card>
  );
}
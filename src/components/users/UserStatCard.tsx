import { Users as UsersIcon, UserCheck, UserX, Shield, Briefcase } from "lucide-react";
import { Card, CardBody } from "../ui/Card";

interface UserStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

export function UserStatCard({ icon, label, value, color }: UserStatCardProps) {
  return (
    <Card className={`text-white ${color} border-none shadow-lg`}>
      <CardBody className="flex items-center gap-4 py-3 px-4">
        <div className="p-2 bg-white/20 rounded-lg">{icon}</div>
        <div>
          <p className="text-[10px] font-medium text-white/70 uppercase tracking-wider">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </CardBody>
    </Card>
  );
}

export function UsersStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <UserStatCard icon={<UsersIcon />} label="Total" value={0} color="bg-primary" />
      <UserStatCard icon={<UserCheck />} label="Activos" value={0} color="bg-green-500" />
      <UserStatCard icon={<UserX />} label="Inactivos" value={0} color="bg-red-500" />
      <UserStatCard icon={<Shield />} label="Admins" value={0} color="bg-purple-600" />
      <UserStatCard icon={<Briefcase />} label="Vendedores" value={0} color="bg-orange-500" />
    </div>
  );
}
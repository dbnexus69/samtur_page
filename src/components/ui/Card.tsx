import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  const hasBackground = /\bbg-/.test(className);
  return (
    <div className={`${hasBackground ? '' : 'bg-white'} rounded-lg border border-gray-border shadow-sm ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  actions?: ReactNode;
}

export function CardHeader({ children, actions }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-border">
      <h2 className="text-lg font-heading font-semibold text-primary">{children}</h2>
      {actions}
    </div>
  );
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
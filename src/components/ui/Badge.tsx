interface BadgeProps {
  variant: 'pagado' | 'abonado' | 'pendiente' | 'active' | 'inactive' | 'realizado' | 'pendiente-check' | 'accent';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant, children, className = '' }: BadgeProps) {
  const variants: Record<string, string> = {
    'pagado': 'bg-green-100 text-green-800',
    'abonado': 'bg-blue-100 text-blue-800',
    'pendiente': 'bg-yellow-100 text-yellow-800',
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-red-100 text-red-800',
    'realizado': 'bg-green-100 text-green-800',
    'pendiente-check': 'bg-yellow-100 text-yellow-800',
    'accent': 'bg-accent/20 text-accent'
  };

  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
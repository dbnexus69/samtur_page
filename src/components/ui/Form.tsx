import { ChangeEvent, ReactNode } from 'react';
import { X, AlertCircle, Search } from 'lucide-react';

interface FormFieldProps {
  label: string;
  children: ReactNode;
  error?: string;
}

export function FormField({ label, children, error }: FormFieldProps) {
  return (
    <div className="mb-4">
      <label className={`block text-sm font-medium mb-1 ${error ? 'text-red-500' : 'text-gray-700'}`}>{label}</label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({ className = '', error, ...props }: InputProps) {
  return (
    <input
      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 ${
        error ? 'border-red-500' : 'border-gray-border'
      } ${className}`}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  error?: string;
}

export function Select({ options, error, className = '', ...props }: SelectProps) {
  return (
    <select
      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 ${
        error ? 'border-red-500' : 'border-gray-border'
      } ${className}`}
      {...props}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={`w-full px-3 py-2 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 ${className}`}
      {...props}
    />
  );
}

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange: (value: string) => void;
}

export function SearchInput({ className = '', onChange, ...props }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      <input
        type="text"
        className={`w-full pl-9 pr-4 py-2 border border-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 ${className}`}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </div>
  );
}
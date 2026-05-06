import { ChangeEvent, ReactNode, useState, useRef, useEffect, useMemo } from 'react';
import { X, AlertCircle, Search, ChevronDown, Check, ChevronUp } from 'lucide-react';

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

interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  className?: string;
  error?: string;
}

export function Combobox({ value, onChange, options, placeholder = "Seleccionar...", className = "", error }: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(o => o.value === value);
  
  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()));
  }, [options, search]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: ComboboxOption) => {
    onChange(option.value);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? search : (selectedOption?.label || "")}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            const matched = options.find(o => o.label.toLowerCase() === e.target.value.toLowerCase());
            if (matched) {
              onChange(matched.value);
            }
          }}
          onFocus={() => {
            setIsOpen(true);
            setSearch("");
          }}
          placeholder={placeholder}
          className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer ${
            error ? 'border-red-500' : 'border-gray-border'
          } ${!isOpen && selectedOption ? 'text-gray-800' : 'text-gray-500'}`}
        />
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setSearch("");
              inputRef.current?.focus();
            }
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option)}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                option.value === value ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {isOpen && filteredOptions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-border rounded-lg shadow-lg px-3 py-4 text-sm text-gray-400 text-center">
          No se encontraron opciones
        </div>
      )}
    </div>
  );
}
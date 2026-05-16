import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { mockData } from '../data/mockData';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, remember?: boolean) => { success: boolean; error?: string };
  logout: () => void;
  isAdmin: boolean;
  isLoading: boolean;
}

interface LoginError {
  code: 'not_found' | 'inactive' | 'invalid_password' | 'validation';
  message: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
const REMEMBER_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data] = useLocalStorage('itea_data', mockData);
  const [sessionExpiry, setSessionExpiry] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('itea_user');
    const expiry = localStorage.getItem('itea_session_expiry');
    
    if (stored && expiry) {
      const expiryTime = parseInt(expiry);
      if (Date.now() < expiryTime) {
        try {
          const userData = JSON.parse(stored);
          if (['vendedor', 'vendor'].includes((userData.role as string).toLowerCase())) {
            userData.role = 'asesor';
            localStorage.setItem('itea_user', JSON.stringify(userData));
          }
          setUser(userData);
          setSessionExpiry(expiryTime);
        } catch {
          localStorage.removeItem('itea_user');
          localStorage.removeItem('itea_session_expiry');
        }
      } else {
        localStorage.removeItem('itea_user');
        localStorage.removeItem('itea_session_expiry');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!sessionExpiry) return;
    
    const checkExpiry = setInterval(() => {
      if (Date.now() >= sessionExpiry) {
        logout();
      }
    }, 60000);

    return () => clearInterval(checkExpiry);
  }, [sessionExpiry]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): { valid: boolean; error?: string } => {
    if (password.length < 6) {
      return { valid: false, error: 'La contraseña debe tener al menos 6 caracteres' };
    }
    return { valid: true };
  };

  const login = (email: string, password: string, remember = false): { success: boolean; error?: string } => {
    if (!email || !password) {
      return { success: false, error: 'Por favor complete todos los campos' };
    }

    if (!validateEmail(email)) {
      return { success: false, error: 'Ingrese un correo electrónico válido' };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.error };
    }

    const foundUser = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!foundUser) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    if (foundUser.password !== password) {
      return { success: false, error: 'Contraseña incorrecta' };
    }

    if (foundUser.status === 'inactive') {
      return { success: false, error: 'Usuario inactivo. Contacte al administrador' };
    }

    const updatedUser = { 
      ...foundUser, 
      lastLogin: new Date().toISOString() 
    };
    
    setUser(updatedUser);
    
    const duration = remember ? REMEMBER_DURATION : SESSION_DURATION;
    const expiryTime = Date.now() + duration;
    
    localStorage.setItem('itea_user', JSON.stringify(updatedUser));
    localStorage.setItem('itea_session_expiry', String(expiryTime));
    setSessionExpiry(expiryTime);

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setSessionExpiry(null);
    localStorage.removeItem('itea_user');
    localStorage.removeItem('itea_session_expiry');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAdmin: user?.role === 'admin',
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
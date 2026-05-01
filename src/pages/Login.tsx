import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Plane, ShieldCheck, ChevronRight, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input, FormField } from '../components/ui/Form';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    const result = login(email, password, rememberMe);
    
    setIsLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Credenciales incorrectas. Intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Fondo con Imagen de Aeropuerto y Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] scale-110 animate-slow-zoom"
        style={{ 
          backgroundImage: 'url("/airport_bg.png")',
        }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-primary/90 via-primary/70 to-transparent" />
      
      {/* Círculos de luz decorativos */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-dark/40 rounded-full blur-[120px] z-10" />

      {/* Contenedor del Login */}
      <div className="relative z-20 w-full max-w-md animate-fade-in-up">
        {/* Branding Superior */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/20 shadow-xl">
            <Plane className="text-white w-10 h-10 -rotate-45" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Samtour</h1>
          <p className="text-white/60 mt-1 font-medium">Agencia de Viajes & Turismo</p>
        </div>

        {/* Tarjeta de Login Glassmorphism */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 border border-white/20">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-primary">Bienvenido de nuevo</h2>
            <p className="text-gray-500 text-sm">Ingresa tus credenciales para acceder al sistema.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormField label="Correo electrónico">
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="usuario@samtour.com"
                disabled={isLoading}
                autoComplete="email"
                className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
              />
            </FormField>

            <FormField label="Contraseña">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </FormField>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent/30 transition-all"
                />
                <span className="text-sm text-gray-600 group-hover:text-primary transition-colors font-medium">Recordarme</span>
              </label>
              <button type="button" className="text-sm text-accent font-bold hover:underline">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2 animate-shake">
                <Info size={16} />
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Verificando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Iniciar Sesión</span>
                  <ChevronRight size={20} />
                </div>
              )}
            </Button>
          </form>

          {/* Sección de Cuentas Demo Mejorada */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <button 
              onClick={() => setShowDemo(!showDemo)}
              className="w-full flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-primary transition-colors"
            >
              <span>Cuentas de demostración</span>
              <div className={`transition-transform duration-300 ${showDemo ? 'rotate-180' : ''}`}>
                <ChevronRight size={14} className="rotate-90" />
              </div>
            </button>
            
            {showDemo && (
              <div className="mt-4 grid grid-cols-1 gap-2 animate-fade-in">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between group hover:border-primary/30 transition-all cursor-pointer" onClick={() => {setEmail('admin@samtour.com'); setPassword('admin123');}}>
                  <div>
                    <p className="text-[10px] font-bold text-primary/60 uppercase">Administrador</p>
                    <p className="text-xs text-gray-600">admin@samtour.com</p>
                  </div>
                  <ShieldCheck size={16} className="text-primary/20 group-hover:text-primary transition-colors" />
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between group hover:border-accent/30 transition-all cursor-pointer" onClick={() => {setEmail('juan@samtour.com'); setPassword('vendor123');}}>
                  <div>
                    <p className="text-[10px] font-bold text-accent/60 uppercase">Vendedor</p>
                    <p className="text-xs text-gray-600">juan@samtour.com</p>
                  </div>
                  <Plane size={16} className="text-accent/20 group-hover:text-accent transition-colors" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer del Login */}
        <p className="text-center mt-8 text-white/40 text-xs">
          &copy; {new Date().getFullYear()} Samtour Agencia de Viajes. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
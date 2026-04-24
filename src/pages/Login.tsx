import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input, FormField } from '../components/ui/Form';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor complete todos los campos');
      return;
    }

    if (login(email, password)) {
      navigate('/');
    } else {
      setError('Credenciales invalidas');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Samtour</h1>
          <p className="text-gray-500 mt-2">Agencia de Viajes</p>
        </div>

        <form onSubmit={handleSubmit}>
          <FormField label="Correo electronico">
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </FormField>

          <FormField label="Contrasena">
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="*******"
            />
          </FormField>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full mt-4">
            Iniciar Sesion
          </Button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
          <p className="font-semibold text-gray-700 mb-2">Cuentas demo:</p>
          <div className="space-y-1 text-gray-600">
            <p><span className="font-medium">Admin:</span> admin@samtour.com / admin123</p>
            <p><span className="font-medium">Vendedor:</span> juan@samtour.com / vendor123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
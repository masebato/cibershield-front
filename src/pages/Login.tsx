import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../store/useAuthStore';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await login({ email, password, rememberMe });
  };

  return (
    <AuthLayout>
      <Card className="animate-fade-in-up w-full" style={{ animationDelay: '0.1s', opacity: 0 }}>
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-100">Inicio de sesión</h1>
          <p className="text-sm text-slate-400 mt-1">Ingresa tus credenciales de autenticación</p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3 mb-5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Correo electronico"
            type="email"
            placeholder="analyst@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            leftIcon={<Mail size={15} />}
          />

          <Input
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            leftIcon={<Lock size={15} />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-4 h-4 rounded border border-slate-600 bg-slate-800 peer-checked:bg-cyan-500 peer-checked:border-cyan-500 transition-colors flex items-center justify-center">
                  {rememberMe && (
                    <svg className="w-2.5 h-2.5 text-slate-900" fill="none" viewBox="0 0 10 8">
                      <path
                        d="M1 4l3 3 5-6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                Recuerdame
              </span>
            </label>

            {/* TODO: Wire up to /forgot-password route */}
            <button
              type="button"
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Olvidaste tu contraseña?
            </button>
          </div>

          <Button type="submit" size="lg" isLoading={isLoading} className="mt-2 w-full">
            {isLoading ? 'Verificando...' : 'Iniciar sesión'}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-400">
          ¿No estas registrado?{' '}
          <span
            className="text-blue-700 underline cursor-pointer"
            onClick={() => navigate('/register')}
          >
            Regístrate
          </span>
        </p>
      </Card>
    </AuthLayout>
  );
}

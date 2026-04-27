import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Globe, Server } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../store/useAuthStore';
import { useState, useEffect } from 'react';

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading, error, isAuthenticated, clearError } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [publicIP, setPublicIP] = useState('');
  const [cidr, setCidr] = useState('');
  const [domain, setDomain] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const success = await register({
      username,
      password,
      companyName,
      email,
      publicIP,
      cidr,
      domain,
      subdomain,
    });
    // console.log(success)
    if (success) {
      navigate('/login');
    }
  };

  return (
    <AuthLayout>
      <Card className="animate-fade-in-up w-full" style={{ animationDelay: '0.1s', opacity: 0 }}>
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-100">Registro</h1>
          <p className="text-sm text-slate-400 mt-1">
            Crea una cuenta ingresando los datos solicitados
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3 mb-5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Usuario"
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            leftIcon={<User size={15} />}
          />

          <Input
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            leftIcon={<Lock size={15} />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />

          <Input
            label="Nombre de la empresa"
            type="text"
            placeholder="Mi Empresa S.A."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            leftIcon={<Server size={15} />}
          />

          <Input
            label="Correo electronico"
            type="email"
            placeholder="contact@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            leftIcon={<Mail size={15} />}
          />

          <Input
            label="IP publica"
            type="text"
            placeholder="203.0.113.5"
            value={publicIP}
            onChange={(e) => setPublicIP(e.target.value)}
            required
            leftIcon={<Globe size={15} />}
          />

          <Input
            label="CIDR"
            type="text"
            placeholder="203.0.113.0/24"
            value={cidr}
            onChange={(e) => setCidr(e.target.value)}
            required
            leftIcon={<Globe size={15} />}
          />

          <Input
            label="Dominio"
            type="text"
            placeholder="example.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
            leftIcon={<Globe size={15} />}
          />

          <Input
            label="Subdominio"
            type="text"
            placeholder="api"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
            required
            leftIcon={<Globe size={15} />}
          />

          <Button type="submit" size="lg" isLoading={isLoading} className="mt-2 w-full">
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </Button>
        </form>
        <p className="mt-5 text-center text-xs text-slate-400">
          ¿Ya tienes usuario?{' '}
          <span
            className="text-blue-700 underline cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Iniciar sesion
          </span>
        </p>
      </Card>
    </AuthLayout>
  );
}

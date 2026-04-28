import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Building2, Briefcase, Check, X } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../store/useAuthStore';
import { useState, useEffect } from 'react';
import type { ApiFieldError } from '../types/auth.types';

interface FieldErrors {
  password?: string;
  companyName?: string;
  email?: string;
}

const passwordRules = [
  { label: 'Al menos 8 caracteres', test: (v: string) => v.length >= 8 },
  { label: 'Una letra mayúscula', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'Un número', test: (v: string) => /[0-9]/.test(v) },
  { label: 'Un carácter especial (!@#$...)', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

// Maps API error paths to form field keys
const API_PATH_TO_FIELD: Record<string, keyof FieldErrors> = {
  '/body/password': 'password',
  '/body/email': 'email',
  '/body/company_name': 'companyName',
};

const ERROR_CODE_LABELS: Record<string, string> = {
  'minLength.openapi.validation': 'No cumple la longitud mínima requerida.',
  'maxLength.openapi.validation': 'Excede la longitud máxima permitida.',
  'format.openapi.validation': 'Formato inválido.',
  'required.openapi.validation': 'Este campo es requerido.',
  'pattern.openapi.validation': 'El valor no cumple el formato esperado.',
};

function apiErrorsToFieldErrors(apiErrors: ApiFieldError[]): FieldErrors {
  const result: FieldErrors = {};
  for (const e of apiErrors) {
    const field = API_PATH_TO_FIELD[e.path];
    if (field) result[field] = ERROR_CODE_LABELS[e.errorCode] ?? e.message;
  }
  return result;
}

function validateEmail(value: string): string | undefined {
  if (!value) return 'El correo es requerido.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Ingresa un correo válido.';
}

function validatePassword(value: string): string | undefined {
  if (!value) return 'La contraseña es requerida.';
  const failed = passwordRules.find((r) => !r.test(value));
  if (failed) return failed.label;
}

function validateCompanyName(value: string): string | undefined {
  if (!value.trim()) return 'El nombre de la empresa es requerido.';
  if (value.trim().length < 2) return 'Debe tener al menos 2 caracteres.';
}

function PasswordChecklist({ value }: { value: string }) {
  return (
    <ul className="mt-2 flex flex-col gap-1">
      {passwordRules.map((rule) => {
        const ok = rule.test(value);
        return (
          <li
            key={rule.label}
            className={`flex items-center gap-2 text-xs transition-colors ${ok ? 'text-emerald-400' : 'text-slate-500'}`}
          >
            {ok
              ? <Check size={12} className="shrink-0" />
              : <X size={12} className="shrink-0 text-red-500/70" />}
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading, error, registerFieldErrors, isAuthenticated, clearError } = useAuthStore();

  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [sector, setSector] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<keyof FieldErrors, boolean>>({
    password: false,
    companyName: false,
    email: false,
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  // Reflect API field errors on the form when they arrive
  useEffect(() => {
    if (registerFieldErrors?.length) {
      const mapped = apiErrorsToFieldErrors(registerFieldErrors);
      setErrors((prev) => ({ ...prev, ...mapped }));
      setTouched({ password: true, companyName: true, email: true });
    }
  }, [registerFieldErrors]);

  const touch = (field: keyof FieldErrors) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const validate = (): FieldErrors => ({
    password: validatePassword(password),
    companyName: validateCompanyName(companyName),
    email: validateEmail(email),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSubmitAttempted(true);

    const fieldErrors = validate();
    setErrors(fieldErrors);
    setTouched({ password: true, companyName: true, email: true });

    if (Object.values(fieldErrors).some(Boolean)) return;

    const success = await register({
      password,
      email,
      company_name: companyName,
      sector: sector || undefined,
    });
    if (success) {
      alert('Usuario registrado con exito');
      navigate('/login');
    }
  };

  const clientErrors = submitAttempted
    ? Object.values(validate()).filter(Boolean) as string[]
    : [];

  const showPasswordChecklist = (passwordFocused || touched.password) && password.length > 0;

  return (
    <AuthLayout>
      <Card className="animate-fade-in-up w-full" style={{ animationDelay: '0.1s', opacity: 0 }}>
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-100">Registro</h1>
          <p className="text-sm text-slate-400 mt-1">
            Crea una cuenta empresarial con los campos definidos por la API
          </p>
        </div>

        {/* Generic API error (no field mapping available) */}
        {error && (
          <div className="flex items-start gap-2.5 p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <X size={15} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Client-side error summary on submit attempt */}
        {clientErrors.length > 0 && (
          <div className="p-3 mb-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
            <p className="font-semibold mb-1.5">Corrige los siguientes campos:</p>
            <ul className="flex flex-col gap-1">
              {clientErrors.map((msg) => (
                <li key={msg} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                  {msg}
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <Input
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (touched.password)
                  setErrors((prev) => ({ ...prev, password: validatePassword(e.target.value) }));
              }}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => {
                setPasswordFocused(false);
                touch('password');
                setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
              }}
              error={touched.password && !passwordFocused ? errors.password : undefined}
              required
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
            {showPasswordChecklist && <PasswordChecklist value={password} />}
          </div>

          <Input
            label="Nombre de la empresa"
            type="text"
            placeholder="Mi Empresa S.A."
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value);
              if (touched.companyName)
                setErrors((prev) => ({ ...prev, companyName: validateCompanyName(e.target.value) }));
            }}
            onBlur={() => {
              touch('companyName');
              setErrors((prev) => ({ ...prev, companyName: validateCompanyName(companyName) }));
            }}
            error={touched.companyName ? errors.companyName : undefined}
            required
            leftIcon={<Building2 size={15} />}
          />

          <Input
            label="Correo electrónico"
            type="email"
            placeholder="contact@company.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (touched.email)
                setErrors((prev) => ({ ...prev, email: validateEmail(e.target.value) }));
            }}
            onBlur={() => {
              touch('email');
              setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
            }}
            error={touched.email ? errors.email : undefined}
            required
            autoComplete="email"
            leftIcon={<Mail size={15} />}
          />

          <Select
            label="Sector (opcional)"
            value={sector}
            leftIcon={<Briefcase size={15} />}
            onChange={(e) => setSector(e.target.value)}
          >
            <option value="">Selecciona un sector</option>
            <option value="fintech">Fintech</option>
            <option value="salud">Salud</option>
            <option value="retail">Retail</option>
            <option value="educacion">Educacion</option>
            <option value="tecnologia">Tecnologia</option>
          </Select>

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

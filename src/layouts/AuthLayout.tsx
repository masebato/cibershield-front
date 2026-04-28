import type { ReactNode } from 'react';
import { Shield } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#06B6D4 1px, transparent 1px), linear-gradient(90deg, #06B6D4 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand header */}
        <div className="flex flex-col items-center mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 animate-glow">
              <Shield className="w-7 h-7 text-cyan-400" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-100">
              Cyber<span className="text-cyan-400">Shield</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 tracking-widest uppercase">
            Plataforma de operaciones de Seguridad
          </p>
        </div>

        {children}
      </div>

      <p className="relative z-10 mt-8 text-xs text-slate-600">
        &copy; {new Date().getFullYear()} CyberShield. Todos los derechos reservados.
      </p>
    </div>
  );
}

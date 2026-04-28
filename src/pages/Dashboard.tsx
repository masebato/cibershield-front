import { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, AlertTriangle, Server, Activity } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import {
  getAlertsRequest,
  getReportsRequest,
  getRiskAssetsSummaryRequest,
} from '../services/cibershieldApi';
import type { AlertItem, ReportItem, RiskAssetSummary } from '../types/auth.types';

interface StatCard {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [riskAssets, setRiskAssets] = useState<RiskAssetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [alertsData, reportsData, riskData] = await Promise.all([
          getAlertsRequest(),
          getReportsRequest(),
          getRiskAssetsSummaryRequest(),
        ]);
        setAlerts(alertsData);
        setReports(reportsData);
        setRiskAssets(riskData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo cargar el dashboard.');
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  const securityScore = useMemo(() => {
    if (!riskAssets.length) return '—';
    const maxCvss = Math.max(...riskAssets.map((item) => item.max_cvss), 0);
    const score = Math.max(0, 100 - Math.round(maxCvss * 10));
    return `${score}%`;
  }, [riskAssets]);

  const stats: StatCard[] = [
    {
      label: 'Threats Detected',
      value: String(alerts.length),
      icon: AlertTriangle,
      color: 'text-amber-400',
    },
    {
      label: 'Assets Monitored',
      value: String(user?.assets.length ?? 0),
      icon: Server,
      color: 'text-cyan-400',
    },
    {
      label: 'Security Score',
      value: securityScore,
      icon: ShieldCheck,
      color: 'text-emerald-400',
    },
    {
      label: 'Active Incidents',
      value: String(alerts.filter((alert) => !alert.read).length),
      icon: Activity,
      color: 'text-red-400',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <CardTitle>
                Welcome back, {user?.email.split('@')[0] ?? 'Analyst'}
              </CardTitle>
              <p className="text-sm text-slate-400 mt-0.5">
                Here's your security operations overview.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 px-3 py-2 bg-cyan-500/5 border border-cyan-500/10 rounded-lg text-sm text-slate-400 w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            All systems operational
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border border-red-500/20 bg-red-500/5">
          <p className="text-sm text-red-300">{error}</p>
        </Card>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-100 mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-slate-700/60 ${stat.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-3">
                {loading ? 'Cargando datos...' : 'Metrica calculada desde la API'}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Placeholder content area */}
      <Card className="flex items-center justify-center min-h-48 border-dashed border-slate-700">
        <div className="text-center">
          <Activity className="w-8 h-8 text-slate-700 mx-auto mb-2" />
          <p className="text-sm text-slate-600">
            {reports.length
              ? `Ultimo reporte generado: ${new Date(reports[0].generated_at).toLocaleString()}`
              : 'Aun no hay reportes generados'}
          </p>
        </div>
      </Card>
    </div>
  );
}

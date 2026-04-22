import { ShieldCheck, AlertTriangle, Server, Activity } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

interface StatCard {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ElementType;
  color: string;
}

// TODO: Replace with real data from /api/v1/dashboard/stats
const stats: StatCard[] = [
  {
    label: 'Threats Detected',
    value: '—',
    change: '—',
    positive: false,
    icon: AlertTriangle,
    color: 'text-amber-400',
  },
  {
    label: 'Assets Monitored',
    value: '—',
    change: '—',
    positive: true,
    icon: Server,
    color: 'text-cyan-400',
  },
  {
    label: 'Security Score',
    value: '—',
    change: '—',
    positive: true,
    icon: ShieldCheck,
    color: 'text-emerald-400',
  },
  {
    label: 'Active Incidents',
    value: '—',
    change: '—',
    positive: false,
    icon: Activity,
    color: 'text-red-400',
  },
];

export default function Dashboard() {
  const { user } = useAuthStore();

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
                Welcome back, {user?.name ?? 'Analyst'}
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
              {/* TODO: Populate change data from API */}
              <p className="text-xs text-slate-600 mt-3">No data yet — connect your backend</p>
            </Card>
          );
        })}
      </div>

      {/* Placeholder content area */}
      <Card className="flex items-center justify-center min-h-48 border-dashed border-slate-700">
        <div className="text-center">
          <Activity className="w-8 h-8 text-slate-700 mx-auto mb-2" />
          <p className="text-sm text-slate-600">
            {/* TODO: Replace with threat timeline / activity feed component */}
            Activity feed coming soon
          </p>
        </div>
      </Card>
    </div>
  );
}

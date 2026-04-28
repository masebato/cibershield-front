import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { AlertTriangle, Info } from 'lucide-react';
import { getAlertsRequest, markAlertReadRequest } from '../services/cibershieldApi';
import type { AlertItem } from '../types/auth.types';

const riskLabel: Record<string, string> = {
  critico: 'Critico',
  alto: 'Alto',
  medio: 'Medio',
  bajo: 'Bajo',
};

interface MyAlertsProps {
  title: string;
}

export default function MyAlerts({ title } : MyAlertsProps) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAlertsRequest();
        setAlerts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudieron cargar las alertas.');
      } finally {
        setLoading(false);
      }
    };
    void loadAlerts();
  }, []);

  const openAlert = async (alert: AlertItem) => {
    setSelectedAlert(alert);
    if (!alert.read) {
      try {
        const updated = await markAlertReadRequest(alert.id);
        setAlerts((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        setSelectedAlert(updated);
      } catch {
        // La lectura de detalle funciona aunque falle el marcado como leida.
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-slate-100">{title}</h1>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Card className="p-6 border border-slate-700">
        <table className="w-full text-sm text-slate-300">
          <thead className="text-xs uppercase text-slate-400 border-b border-slate-700">
            <tr>
              <th className="py-3 text-left">Activo Critico</th>
              <th className="py-3 text-center">Nivel de Riesgo</th>
              <th className="py-3 text-right">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id} className="border-b border-slate-700">
                <td className="py-4 font-mono text-blue-400">{alert.asset}</td>
                <td className="py-4">
                  <div className="flex justify-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border 
                      ${alert.risk_level === 'critico' || alert.risk_level === 'alto' ? 'border-red-500/50 text-red-500 bg-red-500/10' : 
                        alert.risk_level === 'medio' ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10' : 
                        'border-green-500/50 text-green-500 bg-green-500/10'}`}>
                      <AlertTriangle size={12} />
                      {riskLabel[alert.risk_level] ?? alert.risk_level}
                    </span>
                  </div>
                </td>
                <td className="py-4 text-right">
                  <button 
                    onClick={() => void openAlert(alert)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                  >
                    <Info size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {loading && (
              <tr>
                <td colSpan={3} className="py-6 text-center text-slate-500">
                  Cargando alertas...
                </td>
              </tr>
            )}
            {!loading && !alerts.length && (
              <tr>
                <td colSpan={3} className="py-6 text-center text-slate-500">
                  No hay alertas disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {/* Modal para ver puntos de riesgo */}
      <Modal 
        isOpen={!!selectedAlert} 
        onClose={() => setSelectedAlert(null)} 
        title={`Detalle de alerta: ${selectedAlert?.asset}`}
      >
        <div className="flex flex-col gap-4">
          <p className="text-slate-400 text-sm">{selectedAlert?.summary}</p>
          <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 text-sm text-slate-300">
            <p><strong>Tipo:</strong> {selectedAlert?.type}</p>
            <p><strong>Estado:</strong> {selectedAlert?.read ? 'Leida' : 'No leida'}</p>
            <p><strong>Fecha:</strong> {selectedAlert ? new Date(selectedAlert.created_at).toLocaleString() : '-'}</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
import { useState } from 'react';
import { Card } from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { AlertTriangle, Info } from 'lucide-react';

const myAlerts = [
  { 
    id: 1, 
    activo: '192.168.1.10', 
    riesgo: 'Alto', 
    puntos: ['Puerto 22 (SSH) abierto al público', 'Versión de OS obsoleta'] 
  },
  { 
    id: 2, 
    activo: 'https://drogueriasCyC.com/admin', 
    riesgo: 'Medio', 
    puntos: ['Certificado SSL por expirar', 'Falta cabecera HSTS'] 
  },
  { 
    id: 3, 
    activo: '10.0.0.5', 
    riesgo: 'Bajo', 
    puntos: ['Ping ICMP habilitado'] 
  },
];

interface MyAlertsProps {
  title: string;
}

export default function MyAlerts({ title } : MyAlertsProps) {
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-slate-100">{title}</h1>

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
            {myAlerts.map((alert) => (
              <tr key={alert.id} className="border-b border-slate-700">
                <td className="py-4 font-mono text-blue-400">{alert.activo}</td>
                <td className="py-4">
                  <div className="flex justify-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border 
                      ${alert.riesgo === 'Alto' ? 'border-red-500/50 text-red-500 bg-red-500/10' : 
                        alert.riesgo === 'Medio' ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10' : 
                        'border-green-500/50 text-green-500 bg-green-500/10'}`}>
                      <AlertTriangle size={12} />
                      {alert.riesgo}
                    </span>
                  </div>
                </td>
                <td className="py-4 text-right">
                  <button 
                    onClick={() => setSelectedAlert(alert)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                  >
                    <Info size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Modal para ver puntos de riesgo */}
      <Modal 
        isOpen={!!selectedAlert} 
        onClose={() => setSelectedAlert(null)} 
        title={`Puntos de Riesgo: ${selectedAlert?.activo}`}
      >
        <div className="flex flex-col gap-4">
          <p className="text-slate-400 text-sm">Se han detectado los siguientes puntos críticos que requieren atención:</p>
          <ul className="space-y-2">
            {selectedAlert?.puntos.map((punto: string, index: number) => (
              <li key={index} className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                <span className="text-slate-200 text-sm">{punto}</span>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  );
}
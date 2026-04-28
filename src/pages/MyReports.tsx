import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FileDown, FileText } from 'lucide-react';

const myReports = [
  { id: 1, nombre: 'Reporte de Alertas Semanal', fecha: '2026-04-25', formato: 'PDF' },
  { id: 2, nombre: 'Auditoría de Activos - Droguerías CyC', fecha: '2026-04-20', formato: 'PDF' },
  { id: 3, nombre: 'Escaneo Crítico - Segmento 192.168.1.0', fecha: '2026-04-15', formato: 'PDF' },
];

interface MyReportsProps {
  title: string;
}

export default function MyReports({ title } : MyReportsProps) {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const handleDownload = async (reportId: number) => {
    setDownloadingId(reportId);
    console.log(`Llamando al back para generar PDF del reporte: ${reportId}`);
    
    // Simulación de espera del backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setDownloadingId(null);
    alert("Descarga iniciada (El backend generó el archivo con éxito)");
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-slate-100">{title}</h1>

      <Card className="flex flex-col gap-4 p-6 border border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="text-blue-500" size={20} />
          <h2 className="text-lg font-semibold text-white">Historial de Reportes Generados</h2>
        </div>

        <table className="w-full text-sm text-slate-300">
          <thead className="text-xs uppercase text-slate-400 border-b border-slate-700">
            <tr>
              <th className="py-3 text-left pl-4">Nombre del Reporte</th>
              <th className="py-3 text-center">Fecha</th>
              <th className="py-3 text-right pr-4">Acción</th>
            </tr>
          </thead>
          <tbody>
            {myReports.map((report) => (
              <tr key={report.id} className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
                <td className="py-4 pl-4 font-medium">{report.nombre}</td>
                <td className="py-4 text-center text-slate-400">{report.fecha}</td>
                <td className="py-4 text-right pr-4">
                  <Button
                    size="sm"
                    className="bg-slate-700 hover:bg-blue-600 text-white flex items-center gap-2 ml-auto"
                    onClick={() => handleDownload(report.id)}
                    isLoading={downloadingId === report.id}
                  >
                    {!downloadingId && <FileDown size={14} />}
                    {downloadingId === report.id ? 'Generando...' : 'Descargar PDF'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
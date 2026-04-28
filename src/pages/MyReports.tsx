import { useEffect, useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Download, FileText, Sparkles } from 'lucide-react';
import {
  getAnalysisByIdRequest,
  generateReportRequest,
  getReportsRequest,
  getRiskAssetsSummaryRequest,
  getShodanDomainRequest,
  getShodanHostRequest,
  getShodanSearchRequest,
} from '../services/cibershieldApi';
import { useAuthStore } from '../store/useAuthStore';
import type {
  AnalysisResult,
  ReportItem,
  ShodanDomainResponse,
  ShodanHostResponse,
  ShodanSearchResponse,
} from '../types/auth.types';

interface MyReportsProps {
  title: string;
}

export default function MyReports({ title } : MyReportsProps) {
  const { user } = useAuthStore();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [riskByAsset, setRiskByAsset] = useState<Record<string, string>>({});

  const firstAsset = useMemo(() => user?.assets[0]?.value, [user?.assets]);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const [reportsData, riskSummaryData] = await Promise.all([
          getReportsRequest(),
          getRiskAssetsSummaryRequest(),
        ]);
        setReports(reportsData);
        setRiskByAsset(
          riskSummaryData.reduce<Record<string, string>>((acc, item) => {
            acc[item.asset] = item.global_risk;
            return acc;
          }, {}),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los reportes.');
      } finally {
        setLoading(false);
      }
    };
    void loadReports();
  }, []);

  const handleGenerateReport = async () => {
    if (!firstAsset) {
      setError('Necesitas al menos un activo registrado para generar reportes.');
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const report = await generateReportRequest({
        asset: firstAsset,
        globalRisk: riskByAsset[firstAsset],
      });
      setReports((prev) => [report, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo generar el reporte.');
    } finally {
      setGenerating(false);
    }
  };

  const isIpAsset = (value: string) => /^(\d{1,3}\.){3}\d{1,3}$/.test(value);

  const getRiskStyle = (risk: string | null) => {
    const normalized = (risk ?? '').toLowerCase();
    if (normalized === 'critico') return { label: 'CRITICO', color: [220, 38, 38] as [number, number, number] };
    if (normalized === 'alto') return { label: 'ALTO', color: [234, 88, 12] as [number, number, number] };
    if (normalized === 'medio') return { label: 'MEDIO', color: [202, 138, 4] as [number, number, number] };
    if (normalized === 'bajo') return { label: 'BAJO', color: [22, 163, 74] as [number, number, number] };
    return { label: 'NO DEFINIDO', color: [71, 85, 105] as [number, number, number] };
  };

  const downloadPdfFile = (
    filename: string,
    data: {
      report: ReportItem;
      companyName: string;
      shodanSummary: string[];
      externalFindings: string[];
      internalFindings: string[];
      recommendations: string[];
      notes: string[];
    },
  ) => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 48;
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - marginX * 2;
    const riskStyle = getRiskStyle(data.report.global_risk);
    let cursorY = 170;
    let pageNumber = 1;

    const ensurePageSpace = (requiredSpace = 18) => {
      if (cursorY + requiredSpace > pageHeight - 48) {
        doc.addPage();
        pageNumber += 1;
        drawPageHeader(false);
        cursorY = 95;
      }
    };

    const drawPageHeader = (isCover: boolean) => {
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, isCover ? 140 : 70, 'F');
      doc.setTextColor(248, 250, 252);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(isCover ? 24 : 14);
      doc.text('CIBERSHIELD', marginX, isCover ? 56 : 42);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(isCover ? 12 : 10);
      doc.text(
        isCover ? 'Reporte Ejecutivo de Ciberseguridad' : 'Reporte Ejecutivo',
        marginX,
        isCover ? 78 : 58,
      );
      doc.setFillColor(...riskStyle.color);
      doc.roundedRect(pageWidth - 170, isCover ? 36 : 26, 120, 28, 6, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`RIESGO: ${riskStyle.label}`, pageWidth - 160, isCover ? 55 : 45);
      doc.setTextColor(15, 23, 42);
    };

    const drawFooter = () => {
      doc.setDrawColor(203, 213, 225);
      doc.line(marginX, pageHeight - 32, pageWidth - marginX, pageHeight - 32);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('Confidencial - Uso exclusivo empresarial', marginX, pageHeight - 18);
      doc.text(`Pagina ${pageNumber}`, pageWidth - 95, pageHeight - 18);
      doc.setTextColor(15, 23, 42);
    };

    const writeWrappedText = (text: string, size = 11, bold = false, lineGap = 4) => {
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line: string) => {
        ensurePageSpace(size + 8);
        doc.text(line, marginX, cursorY);
        cursorY += size + lineGap;
      });
      cursorY += 4;
    };

    const drawSectionTitle = (title: string) => {
      ensurePageSpace(36);
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(marginX, cursorY - 14, maxWidth, 24, 4, 4, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(title, marginX + 10, cursorY + 1);
      cursorY += 18;
    };

    const drawBulletList = (items: string[]) => {
      if (!items.length) {
        writeWrappedText('- Sin informacion disponible.', 10);
        return;
      }
      items.forEach((item) => {
        writeWrappedText(`- ${item}`, 10);
      });
    };

    drawPageHeader(true);

    writeWrappedText(`Empresa: ${data.companyName}`, 11, true);
    writeWrappedText(`Activo evaluado: ${data.report.asset}`, 10);
    writeWrappedText(`Fecha del reporte: ${new Date(data.report.generated_at).toLocaleString()}`, 10);
    writeWrappedText(`Fecha de emision: ${new Date().toLocaleString()}`, 10);

    drawSectionTitle('Resumen Ejecutivo');
    drawBulletList([
      `Riesgo global clasificado como ${riskStyle.label}.`,
      'Documento orientado a decision directiva y priorizacion de remediaciones.',
      'Consolida evidencia interna y datos de superficie de exposicion externa.',
    ]);

    drawSectionTitle('Contexto Tecnico y Exposicion (Shodan)');
    drawBulletList(data.shodanSummary);

    drawSectionTitle('Hallazgos Externos Relevantes');
    drawBulletList(data.externalFindings);

    drawSectionTitle('Hallazgos de Analisis Interno');
    drawBulletList(data.internalFindings);

    drawSectionTitle('Recomendaciones Prioritarias');
    drawBulletList(data.recommendations);

    drawSectionTitle('Notas de Gobierno');
    drawBulletList(data.notes);

    for (let i = 1; i <= doc.getNumberOfPages(); i += 1) {
      doc.setPage(i);
      pageNumber = i;
      drawFooter();
    }

    doc.save(filename);
  };

  const buildExecutiveReportData = (params: {
    report: ReportItem;
    companyName: string;
    shodanHost?: ShodanHostResponse;
    shodanDomain?: ShodanDomainResponse;
    shodanSearch?: ShodanSearchResponse;
    analysis?: AnalysisResult;
    shodanWarning?: string;
  }) => {
    const { report, companyName, shodanHost, shodanDomain, shodanSearch, analysis, shodanWarning } = params;

    const hostVulns = Object.entries(shodanHost?.vulns ?? {})
      .map(([cve, detail]) => ({
        cve,
        cvss: detail.cvss ?? 0,
        summary: detail.summary ?? 'Sin descripcion',
      }))
      .sort((a, b) => b.cvss - a.cvss)
      .slice(0, 10);

    const analysisFindings = [...(analysis?.findings ?? [])]
      .sort((a, b) => b.cvssScore - a.cvssScore)
      .slice(0, 10);

    const shodanSummary = shodanWarning
      ? [
          'No fue posible recuperar datos de Shodan para este activo.',
          `Motivo reportado: ${shodanWarning}`,
          'El informe se emite con evidencia interna disponible.',
        ]
      : shodanHost
        ? [
            `IP: ${shodanHost.ip_str ?? report.asset}`,
            `Organizacion: ${shodanHost.org ?? 'No disponible'}`,
            `Pais: ${shodanHost.country_name ?? 'No disponible'}`,
            `Sistema operativo: ${shodanHost.os ?? 'No identificado'}`,
            `Puertos expuestos: ${shodanHost.ports?.length ? shodanHost.ports.join(', ') : 'No reportados'}`,
            `Hostnames: ${shodanHost.hostnames?.length ? shodanHost.hostnames.join(', ') : 'No reportados'}`,
          ]
        : shodanSearch?.matches?.length
          ? [
              `Consulta de busqueda: ${report.asset}`,
              `Resultados encontrados: ${shodanSearch.total ?? shodanSearch.matches.length}`,
              ...shodanSearch.matches
                .slice(0, 5)
                .map(
                  (match, index) =>
                    `Muestra ${index + 1}: IP ${match.ip_str ?? 'N/A'} | Puerto ${match.port ?? 'N/A'} | Org ${match.org ?? 'N/A'} | Producto ${match.product ?? 'N/A'}`,
                ),
            ]
          : [
              `Dominio consultado: ${shodanDomain?.domain ?? report.asset}`,
              `Subdominios detectados: ${shodanDomain?.subdomains?.length ?? 0}`,
              `Registros DNS observados: ${shodanDomain?.data?.length ?? 0}`,
            ];

    const externalFindings = shodanWarning
      ? ['No se incluyeron hallazgos externos de Shodan por limitacion de plan/API.']
      : hostVulns.length
        ? hostVulns.map((v, i) => `${i + 1}. ${v.cve} (CVSS ${v.cvss}) - ${v.summary}`)
        : ['Shodan no reporta vulnerabilidades CVE para el activo consultado.'];

    const internalFindings = analysisFindings.length
      ? analysisFindings.map(
          (f, i) =>
            `${i + 1}. [${f.level.toUpperCase()}] ${f.type} (CVSS ${f.cvssScore}) - ${f.description}. Recomendacion: ${f.recommendation}`,
        )
      : ['No se encontro detalle de analisis asociado al reporte.'];

    return {
      report,
      companyName,
      shodanSummary,
      externalFindings,
      internalFindings,
      recommendations: [
        'Priorizar remediacion de vulnerabilidades con CVSS >= 7.0 dentro de 30 dias.',
        'Ejecutar monitoreo continuo de puertos expuestos y cambios en superficie de ataque.',
        'Fortalecer ciclo de parches, hardening y validaciones post-remediacion.',
        'Reportar al comite de riesgos avance de cierres criticos y cumplimiento de SLA.',
      ],
      notes: [
        'Documento generado automaticamente por la plataforma CiberShield.',
        'Clasificacion: Confidencial. Distribucion limitada a personal autorizado.',
      ],
    };
  };

  const handleDownloadExecutive = async (report: ReportItem) => {
    setDownloadingId(report.id);
    setError(null);
    try {
      const [analysis, shodanResult] = await Promise.all([
        report.analysis_id ? getAnalysisByIdRequest(report.analysis_id).catch(() => null) : Promise.resolve(null),
        (async () => {
          try {
            if (isIpAsset(report.asset)) {
              const data = await getShodanHostRequest(report.asset);
              return {
                host: data as ShodanHostResponse | undefined,
                domain: undefined,
                search: undefined,
                warning: undefined,
              };
            }
            try {
              const data = await getShodanDomainRequest(report.asset);
              return {
                host: undefined,
                domain: data as ShodanDomainResponse | undefined,
                search: undefined,
                warning: undefined,
              };
            } catch (domainErr) {
              const domainMessage =
                domainErr instanceof Error ? domainErr.message.toLowerCase() : '';
              if (domainMessage.includes('membership') || domainMessage.includes('free tier')) {
                const searchData = await getShodanSearchRequest(report.asset, 1, true);
                return {
                  host: undefined,
                  domain: undefined,
                  search: searchData,
                  warning: undefined,
                };
              }
              throw domainErr;
            }
          } catch (err) {
            const message =
              err instanceof Error ? err.message : 'Servicio externo no disponible para esta consulta.';
            return {
              host: undefined,
              domain: undefined,
              search: undefined,
              warning: message,
            };
          }
        })(),
      ]);

      const reportData = buildExecutiveReportData({
        report,
        companyName: user?.company_name ?? 'Empresa',
        shodanHost: shodanResult.host,
        shodanDomain: shodanResult.domain,
        shodanSearch: shodanResult.search,
        analysis: analysis ?? undefined,
        shodanWarning: shodanResult.warning,
      });

      const filename = `reporte-ejecutivo-${report.asset.replace(/[^a-zA-Z0-9.-]/g, '_')}-${report.id}.pdf`;
      downloadPdfFile(filename, reportData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo descargar el reporte ejecutivo.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-slate-100">{title}</h1>

      <Card className="flex flex-col gap-4 p-6 border border-slate-700">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <FileText className="text-blue-500" size={20} />
            <h2 className="text-lg font-semibold text-white">Historial de Reportes Generados</h2>
          </div>
          <Button
            onClick={() => void handleGenerateReport()}
            isLoading={generating}
            disabled={!firstAsset}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Sparkles size={14} />
            {generating ? 'Generando...' : 'Generar reporte'}
          </Button>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <table className="w-full text-sm text-slate-300">
          <thead className="text-xs uppercase text-slate-400 border-b border-slate-700">
            <tr>
              <th className="py-3 text-left pl-4">Activo</th>
              <th className="py-3 text-center">Riesgo</th>
              <th className="py-3 text-center">Fecha</th>
              <th className="py-3 text-center">Descarga</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
                <td className="py-4 pl-4 font-medium">{report.asset}</td>
                <td className="py-4 text-center text-slate-300 uppercase">{report.global_risk ?? '-'}</td>
                <td className="py-4 text-center text-slate-400">
                  {new Date(report.generated_at).toLocaleString()}
                </td>
                <td className="py-4 text-center">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => void handleDownloadExecutive(report)}
                    isLoading={downloadingId === report.id}
                  >
                    <Download size={14} />
                    {downloadingId === report.id ? 'Armando...' : 'Descargar'}
                  </Button>
                </td>
              </tr>
            ))}
            {loading && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-slate-500">
                  Cargando reportes...
                </td>
              </tr>
            )}
            {!loading && !reports.length && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-slate-500">
                  Aun no hay reportes generados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
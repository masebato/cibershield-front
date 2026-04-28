import { AxiosError } from 'axios';
import api from './api';
import type {
  AccessTokenResponse,
  AnalysisResult,
  AlertItem,
  Asset,
  AssetType,
  RegisterData,
  RegisterResponse,
  ReportItem,
  RiskAssetSummary,
  ShodanDomainResponse,
  ShodanHostResponse,
  ShodanSearchResponse,
  UserProfile,
} from '../types/auth.types';

interface ApiErrorPayload {
  error?: string;
  message?: string;
}

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const payload = error.response?.data as ApiErrorPayload | undefined;
    return payload?.error ?? payload?.message ?? fallback;
  }
  return fallback;
}

export async function loginRequest(email: string, password: string): Promise<AccessTokenResponse> {
  try {
    const response = await api.post<AccessTokenResponse>('/api/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo iniciar sesión.'));
  }
}

export async function registerRequest(data: RegisterData): Promise<RegisterResponse> {
  try {
    const response = await api.post<RegisterResponse>('/api/auth/register', data);
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo completar el registro.'));
  }
}

export async function getProfileRequest(): Promise<UserProfile> {
  try {
    const response = await api.get<UserProfile>('/api/auth/profile');
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo cargar el perfil.'));
  }
}

export async function logoutRequest(refreshToken: string): Promise<void> {
  try {
    await api.post('/api/auth/logout', { refresh_token: refreshToken });
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo cerrar sesión.'));
  }
}

export async function createAssetRequest(payload: {
  type: AssetType;
  value: string;
}): Promise<Asset> {
  try {
    const response = await api.post<Asset>('/api/auth/assets', payload);
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo registrar el activo.'));
  }
}

export async function deleteAssetRequest(id: number): Promise<void> {
  try {
    await api.delete(`/api/auth/assets/${id}`);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo eliminar el activo.'));
  }
}

export async function getAlertsRequest(): Promise<AlertItem[]> {
  try {
    const response = await api.get<AlertItem[]>('/api/san/alerts');
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudieron cargar las alertas.'));
  }
}

export async function markAlertReadRequest(id: number): Promise<AlertItem> {
  try {
    const response = await api.put<AlertItem>(`/api/san/alerts/${id}/read`);
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo marcar la alerta como leida.'));
  }
}

export async function getReportsRequest(): Promise<ReportItem[]> {
  try {
    const response = await api.get<ReportItem[]>('/api/sre/report/list');
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudieron cargar los reportes.'));
  }
}

export async function generateReportRequest(payload: {
  analysisId?: number;
  asset: string;
  globalRisk?: string;
}): Promise<ReportItem> {
  try {
    const response = await api.post<ReportItem>('/api/sre/report/generate', payload);
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo generar el reporte.'));
  }
}

export async function getRiskAssetsSummaryRequest(): Promise<RiskAssetSummary[]> {
  try {
    const response = await api.get<RiskAssetSummary[]>('/api/sar/assets');
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo cargar el resumen de riesgos.'));
  }
}

export async function getShodanHostRequest(ip: string): Promise<ShodanHostResponse> {
  try {
    const response = await api.post<ShodanHostResponse>('/api/scs/host', { ip });
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo consultar informacion del host en Shodan.'));
  }
}

export async function getShodanDomainRequest(domain: string): Promise<ShodanDomainResponse> {
  try {
    const response = await api.post<ShodanDomainResponse>('/api/scs/dns/domain', { domain });
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo consultar informacion DNS en Shodan.'));
  }
}

export async function getShodanSearchRequest(
  query: string,
  page = 1,
  minify = true,
): Promise<ShodanSearchResponse> {
  try {
    const response = await api.post<ShodanSearchResponse>('/api/scs/search', {
      query,
      page,
      minify,
    });
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo consultar busqueda en Shodan.'));
  }
}

export async function getAnalysisByIdRequest(analysisId: number): Promise<AnalysisResult> {
  try {
    const response = await api.get<AnalysisResult>(`/api/sar/analysis/${analysisId}`);
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo obtener el detalle del analisis.'));
  }
}


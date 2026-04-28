export type RiskLevel = 'critico' | 'alto' | 'medio' | 'bajo';

export type AssetType = 'ip' | 'cidr' | 'domain' | 'subdomain';

export interface Asset {
  id: number;
  type: AssetType;
  value: string;
  created_at: string;
}

export interface UserProfile {
  id: number;
  email: string;
  role: string;
  company_id: number;
  company_name: string;
  sector?: string;
  assets: Asset[];
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  company_name: string;
  sector?: string;
}

export interface AccessTokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface RegisterResponse extends AccessTokenResponse {
  user: UserProfile;
}

export interface AlertItem {
  id: number;
  company_id: number;
  type: string;
  asset: string;
  risk_level: RiskLevel;
  summary: string;
  read: boolean;
  created_at: string;
}

export interface RiskAssetSummary {
  asset: string;
  global_risk: RiskLevel;
  max_cvss: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface ReportItem {
  id: number;
  company_id: number;
  asset: string;
  global_risk: RiskLevel | null;
  analysis_id: number | null;
  generated_at: string;
}

export interface ShodanVulnerability {
  cvss?: number;
  summary?: string;
}

export interface ShodanHostResponse {
  ip_str?: string;
  org?: string;
  country_name?: string;
  ports?: number[];
  hostnames?: string[];
  os?: string | null;
  last_update?: string;
  vulns?: Record<string, ShodanVulnerability>;
}

export interface ShodanDomainRecord {
  subdomain?: string;
  type?: string;
  value?: string;
  last_seen?: string;
}

export interface ShodanDomainResponse {
  domain?: string;
  subdomains?: string[];
  data?: ShodanDomainRecord[];
}

export interface ShodanSearchMatch {
  ip_str?: string;
  port?: number;
  org?: string;
  product?: string;
  version?: string;
  country_name?: string;
}

export interface ShodanSearchResponse {
  total?: number;
  matches?: ShodanSearchMatch[];
}

export interface AnalysisFinding {
  id: number;
  type: string;
  description: string;
  cvssScore: number;
  level: RiskLevel;
  affectedAsset: string;
  recommendation: string;
}

export interface AnalysisResult {
  analysisId: number;
  ip: string;
  globalRisk: RiskLevel;
  maxCvss: number;
  analyzedAt: string;
  findings: AnalysisFinding[];
}

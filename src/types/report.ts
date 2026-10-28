/**
 * Type definitions for SALS Security Daily Report (SDR)
 * SEM ALP Logistics Sdn. Bhd. - Security Department
 */

export interface GuardDeploymentItem {
  id: string;
  post: string;
  name: string;
  rem: string;
}

export interface AccessControlItem {
  id: string;
  cat: string;
  count: string;
  rem: string;
}

export interface IncidentLogItem {
  id: string;
  time: string;
  loc: string;
  desc: string;
  action: string;
  ir: string;
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface CctvStatusItem {
  id: string;
  sys: string;
  total: number | string;
  func: number | string;
  rem: string;
}

export interface PatrolClockingItem {
  id: string;
  finding: string;
  guard: string;
  obs: string;
}

export interface ObservationItem {
  id: string;
  time: string;
  area: string;
  obs: string;
  action: string;
}

export interface SecurityDailyReport {
  id: string;
  v: string;
  createdAt: string;
  updatedAt: string;
  // General Info
  facility: string;
  day: string;
  shift: 'Day' | 'Night';
  date: string;
  officer: string;
  provider: string;
  // Sections
  guard: GuardDeploymentItem[];
  access: AccessControlItem[];
  incident: IncidentLogItem[];
  cctv: CctvStatusItem[];
  patrol: PatrolClockingItem[];
  obs: ObservationItem[];
  // Handover & Signatures
  handover: string;
  prepName: string;
  prepRole: string;
  prepDate: string;
  revName: string;
  revRole: string;
  revDate: string;
  status?: 'Draft' | 'Submitted' | 'Reviewed' | 'Approved';
}

export interface SavedReportMeta {
  id: string;
  facility: string;
  date: string;
  shift: 'Day' | 'Night';
  officer: string;
  updatedAt: string;
  incidentsCount: number;
  cctvFaultyCount: number;
  status: string;
}

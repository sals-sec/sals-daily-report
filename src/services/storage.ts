import { SecurityDailyReport, SavedReportMeta } from '../types/report';
import { createBlankReport, VER } from '../constants/defaults';

const DRAFT_KEY = VER;
const HISTORY_KEY = 'sdr-archive-v1';

export function loadCurrentDraft(): SecurityDailyReport {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.guard || parsed.cctv)) {
        return {
          ...createBlankReport(),
          ...parsed,
          // ensure arrays have id keys
          guard: (parsed.guard || []).map((g: any, i: number) => ({
            id: g.id || `g-${i}`,
            post: g.post ?? '',
            name: g.name ?? '',
            rem: g.rem ?? '',
          })),
          access: (parsed.access || []).map((a: any, i: number) => ({
            id: a.id || `a-${i}`,
            cat: a.cat ?? '',
            count: a.count ?? '0',
            rem: a.rem ?? '',
          })),
          cctv: (parsed.cctv || []).map((c: any, i: number) => ({
            id: c.id || `c-${i}`,
            sys: c.sys ?? '',
            total: c.total ?? 0,
            func: c.func ?? 0,
            rem: c.rem ?? '',
          })),
          incident: (parsed.incident || []).map((inc: any, i: number) => ({
            id: inc.id || `inc-${i}`,
            time: inc.time ?? '',
            loc: inc.loc ?? '',
            desc: inc.desc ?? '',
            action: inc.action ?? '',
            ir: inc.ir ?? '',
            severity: inc.severity ?? 'Low',
          })),
          patrol: (parsed.patrol || []).map((p: any, i: number) => ({
            id: p.id || `p-${i}`,
            finding: p.finding ?? '',
            guard: p.guard ?? '',
            obs: p.obs ?? '',
          })),
          obs: (parsed.obs || []).map((o: any, i: number) => ({
            id: o.id || `o-${i}`,
            time: o.time ?? '',
            area: o.area ?? '',
            obs: o.obs ?? '',
            action: o.action ?? '',
          })),
        };
      }
    }
  } catch (err) {
    console.error('Failed to load draft from localStorage:', err);
  }
  return createBlankReport();
}

export function saveCurrentDraft(report: SecurityDailyReport): boolean {
  try {
    const dataToSave = {
      ...report,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(dataToSave));
    return true;
  } catch (err) {
    console.error('Failed to save draft to localStorage:', err);
    return false;
  }
}

export function loadHistory(): SavedReportMeta[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load report history:', err);
  }
  return [];
}

export function saveToHistory(report: SecurityDailyReport): void {
  try {
    const history = loadHistory();
    const cctvFaulty = report.cctv.reduce((acc, curr) => {
      const tot = Number(curr.total) || 0;
      const fn = Number(curr.func) || 0;
      return acc + Math.max(0, tot - fn);
    }, 0);

    const activeIncidents = report.incident.filter((i) => i.desc && i.desc.trim().length > 0).length;

    const meta: SavedReportMeta = {
      id: report.id,
      facility: report.facility || 'SALS Facility',
      date: report.date || 'No Date',
      shift: report.shift,
      officer: report.officer || 'Unassigned',
      updatedAt: new Date().toISOString(),
      incidentsCount: activeIncidents,
      cctvFaultyCount: cctvFaulty,
      status: report.status || 'Draft',
    };

    // Store the full report in dedicated key
    localStorage.setItem(`sdr-doc-${report.id}`, JSON.stringify(report));

    // Update index meta list
    const filtered = history.filter((h) => h.id !== report.id);
    filtered.unshift(meta);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered.slice(0, 50)));
  } catch (err) {
    console.error('Failed to save to history:', err);
  }
}

export function getReportFromHistory(id: string): SecurityDailyReport | null {
  try {
    const raw = localStorage.getItem(`sdr-doc-${id}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to get report by id:', err);
  }
  return null;
}

export function deleteFromHistory(id: string): void {
  try {
    localStorage.removeItem(`sdr-doc-${id}`);
    const history = loadHistory().filter((h) => h.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (err) {
    console.error('Failed to delete report:', err);
  }
}

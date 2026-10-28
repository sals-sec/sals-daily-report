import { SecurityDailyReport } from '../types/report';

function downloadFile(fileName: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function generateReportFileName(report: SecurityDailyReport, extension: string): string {
  const safeDate = report.date ? report.date.replace(/[^0-9-]/g, '') : 'draft';
  const safeShift = report.shift || 'Day';
  return `Security_Daily_Report_${safeDate}_${safeShift}.${extension}`;
}

export function exportReportJSON(report: SecurityDailyReport): void {
  const jsonContent = JSON.stringify(report, null, 2);
  const filename = generateReportFileName(report, 'json');
  downloadFile(filename, jsonContent, 'application/json');
}

export function exportReportCSV(report: SecurityDailyReport): void {
  const q = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines: string[] = [];

  // Title and header
  lines.push(['COMPANY', 'SEM ALP Logistics Sdn. Bhd. - Security Department'].map(q).join(','));
  lines.push(['DOCUMENT', 'SECURITY DAILY REPORT', `VERSION: ${report.v || 'v1.0'}`].map(q).join(','));
  lines.push('');

  // General Info
  lines.push(['Section', 'No', 'Field 1', 'Field 2', 'Field 3', 'Field 4', 'Field 5'].map(q).join(','));
  lines.push([
    'Header Info',
    '',
    `Facility: ${report.facility}`,
    `Date: ${report.date} (${report.day})`,
    `Shift: ${report.shift}`,
    `Officer: ${report.officer}`,
    `Provider: ${report.provider}`,
  ].map(q).join(','));
  lines.push('');

  // 1. Guard Deployment
  lines.push(['1. GUARD DEPLOYMENT', 'No.', 'Post / Location', 'Guard Name', 'Remarks'].map(q).join(','));
  report.guard.forEach((r, i) => {
    lines.push(['Guard Deployment', i + 1, r.post, r.name, r.rem].map(q).join(','));
  });
  lines.push('');

  // 2. Access Control
  lines.push(['2. ACCESS CONTROL', 'No.', 'Category', 'Count / Detail', 'Remarks'].map(q).join(','));
  report.access.forEach((r, i) => {
    lines.push(['Access Control', i + 1, r.cat, r.count, r.rem].map(q).join(','));
  });
  lines.push('');

  // 3. Incidents
  lines.push(['3. INCIDENTS', 'No.', 'Time', 'Location', 'Description of Occurrence', 'Action Taken', 'IR No.'].map(q).join(','));
  report.incident.forEach((r, i) => {
    if (r.desc || r.time || r.loc) {
      lines.push(['Incident', i + 1, r.time, r.loc, r.desc, r.action, r.ir].map(q).join(','));
    }
  });
  lines.push('');

  // 4. CCTV
  lines.push(['4. CCTV & SYSTEMS', 'No.', 'System', 'Total Units', 'Functioning', 'Faulty', 'Remarks'].map(q).join(','));
  report.cctv.forEach((r, i) => {
    const total = Number(r.total) || 0;
    const func = Number(r.func) || 0;
    const faulty = Math.max(0, total - func);
    lines.push(['CCTV & Security', i + 1, r.sys, total, func, faulty, r.rem].map(q).join(','));
  });
  lines.push('');

  // 5. Patrol
  lines.push(['5. PATROL / CLOCKING', 'No.', 'Finding / Checkpoint', 'Guard', 'Observations'].map(q).join(','));
  report.patrol.forEach((r, i) => {
    if (r.finding || r.guard || r.obs) {
      lines.push(['Patrol', i + 1, r.finding, r.guard, r.obs].map(q).join(','));
    }
  });
  lines.push('');

  // 6. Observations
  lines.push(['6. OBSERVATIONS', 'No.', 'Time', 'Location / Area', 'Observation', 'Corrective Action'].map(q).join(','));
  report.obs.forEach((r, i) => {
    if (r.obs || r.time || r.area) {
      lines.push(['Observation', i + 1, r.time, r.area, r.obs, r.action].map(q).join(','));
    }
  });
  lines.push('');

  // 7. Handover
  lines.push(['7. HANDOVER NOTES', '', report.handover].map(q).join(','));
  lines.push('');

  // 8. Sign-off
  lines.push([
    '8. SIGN-OFF',
    '',
    `Prepared by: ${report.prepName} (${report.prepRole}) Date: ${report.prepDate}`,
    `Reviewed by: ${report.revName} (${report.revRole}) Date: ${report.revDate}`,
    `Status: ${report.status || 'Draft'}`,
  ].map(q).join(','));

  const csvContent = '\ufeff' + lines.join('\n');
  const filename = generateReportFileName(report, 'csv');
  downloadFile(filename, csvContent, 'text/csv;charset=utf-8');
}

export function parseImportedJSON(fileContent: string): SecurityDailyReport {
  const parsed = JSON.parse(fileContent);
  if (!parsed || (!parsed.guard && !parsed.cctv)) {
    throw new Error('Invalid format: File is missing required Security Daily Report sections.');
  }
  return parsed as SecurityDailyReport;
}

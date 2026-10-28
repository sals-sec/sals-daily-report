import { SecurityDailyReport } from '../types/report';
import { GoogleGenAI } from '@google/genai';

export interface AIShiftAnalysis {
  overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  cctvUptimeRate: number;
  totalFaultyCctv: number;
  assignedGuardsCount: number;
  totalPostsCount: number;
  incidentsCount: number;
  observationsCount: number;
  executiveSummary: string;
  handoverDraft: string;
  actionItems: string[];
}

export function generateLocalShiftAnalysis(report: SecurityDailyReport): AIShiftAnalysis {
  let totalCctv = 0;
  let funcCctv = 0;
  report.cctv.forEach((c) => {
    const t = Number(c.total) || 0;
    const f = Number(c.func) || 0;
    totalCctv += t;
    funcCctv += f;
  });
  const faultyCctv = Math.max(0, totalCctv - funcCctv);
  const cctvUptimeRate = totalCctv > 0 ? Number(((funcCctv / totalCctv) * 100).toFixed(1)) : 100;

  const assignedGuards = report.guard.filter((g) => g.name && g.name.trim().length > 0).length;
  const totalPosts = report.guard.length;

  const activeIncidents = report.incident.filter(
    (inc) => (inc.desc && inc.desc.trim().length > 0) || (inc.action && inc.action.trim().length > 0)
  );

  const activeObs = report.obs.filter(
    (o) => (o.obs && o.obs.trim().length > 0) || (o.action && o.action.trim().length > 0)
  );

  let risk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (activeIncidents.length > 2 || faultyCctv > 5 || assignedGuards < totalPosts * 0.7) {
    risk = 'HIGH';
  } else if (activeIncidents.length > 0 || faultyCctv > 0 || activeObs.length > 2) {
    risk = 'MEDIUM';
  }

  const actionItems: string[] = [];
  if (faultyCctv > 0) {
    actionItems.push(`Notify CCTV technical vendor regarding ${faultyCctv} faulty surveillance unit(s).`);
  }
  if (assignedGuards < totalPosts) {
    actionItems.push(`Coordinate with ${report.provider || 'guarding contractor'} to backfill ${totalPosts - assignedGuards} unassigned post(s).`);
  }
  activeIncidents.forEach((inc) => {
    if (inc.ir && inc.ir !== 'N/A') {
      actionItems.push(`Ensure formal Incident Report [${inc.ir}] is signed off by Operations Manager.`);
    }
  });
  if (actionItems.length === 0) {
    actionItems.push('Maintain regular clockwise and counter-clockwise hourly patrol schedules.');
    actionItems.push('Enforce standard contractor PPE and visitor badge compliance at Main Gate.');
  }

  const shiftLabel = `${report.date || 'Today'} ${report.shift} Shift`;
  const executiveSummary = [
    `Security operations for ${report.facility || 'SALS Facility'} during the ${shiftLabel} concluded with ${activeIncidents.length} incident(s) reported.`,
    `Guard deployment achieved ${assignedGuards}/${totalPosts} post coverage (${totalPosts > 0 ? Math.round((assignedGuards / totalPosts) * 100) : 100}%).`,
    `Surveillance systems health is at ${cctvUptimeRate}% operational uptime (${funcCctv}/${totalCctv} devices online${faultyCctv > 0 ? `, ${faultyCctv} faulty` : ''}).`,
    `${activeObs.length} safety/security observation(s) were logged and addressed on-site.`,
  ].join(' ');

  const handoverDraft = [
    `Shift Handover Briefing (${report.shift} Shift):`,
    `1. Security Status: Area condition is peaceful and under control.`,
    faultyCctv > 0
      ? `2. CCTV Alert: ${faultyCctv} faulty camera(s) identified. Vendor service request ticket logged.`
      : `2. CCTV Alert: All ${totalCctv} surveillance and access control doors verified operational.`,
    activeIncidents.length > 0
      ? `3. Incidents Logged: ${activeIncidents.length} occurrence(s) handled: "${activeIncidents[0].desc.slice(0, 60)}..."`
      : `3. Incidents Logged: Zero security breach or lost property occurrences reported.`,
    `4. Patrol & Clocks: Patrol rounds carried out according to schedule with no unauthorized breaches.`,
    `5. Ongoing Instruction: Please continue monitoring all areas and report any incidents if observed.`,
  ].join('\n');

  return {
    overallRiskLevel: risk,
    cctvUptimeRate,
    totalFaultyCctv: faultyCctv,
    assignedGuardsCount: assignedGuards,
    totalPostsCount: totalPosts,
    incidentsCount: activeIncidents.length,
    observationsCount: activeObs.length,
    executiveSummary,
    handoverDraft,
    actionItems,
  };
}

export async function generateGeminiShiftBriefing(report: SecurityDailyReport): Promise<string> {
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || '';

  if (!apiKey) {
    const local = generateLocalShiftAnalysis(report);
    return local.handoverDraft;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
You are the Senior Security Operations Executive for SEM ALP Logistics Sdn. Bhd. (SALS).
Summarize this Security Daily Report into a concise, professional shift briefing and handover note:
Facility: ${report.facility}
Shift: ${report.shift}
Date: ${report.date} (${report.day})
Guards Deployed: ${report.guard.filter((g) => g.name).length}/${report.guard.length}
CCTV Systems: ${report.cctv.map((c) => `${c.sys}: ${c.func}/${c.total}`).join(', ')}
Incidents: ${JSON.stringify(report.incident.filter((i) => i.desc))}
Observations: ${JSON.stringify(report.obs.filter((o) => o.obs))}
Current Handover note: ${report.handover}

Provide a concise, 4-5 bullet point executive briefing with clear priority action items for the incoming shift supervisor. Keep it formal and operational.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || generateLocalShiftAnalysis(report).handoverDraft;
  } catch (err) {
    console.warn('Gemini briefing generation fallback:', err);
    return generateLocalShiftAnalysis(report).handoverDraft;
  }
}

import React from 'react';
import { SecurityDailyReport } from '../types/report';
import {
  Shield,
  Video,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  Printer,
  ChevronRight,
  Eye,
  AlertCircle,
} from 'lucide-react';

interface DashboardViewProps {
  report: SecurityDailyReport;
  onGoToForm: () => void;
  onPrint: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  report,
  onGoToForm,
  onPrint,
}) => {
  // Guard metrics
  const totalPosts = report.guard.length;
  const assignedGuards = report.guard.filter((g) => g.name.trim().length > 0).length;
  const guardCoveragePct = totalPosts > 0 ? Math.round((assignedGuards / totalPosts) * 100) : 100;

  // CCTV metrics
  let totalCctv = 0;
  let funcCctv = 0;
  report.cctv.forEach((c) => {
    totalCctv += Number(c.total) || 0;
    funcCctv += Number(c.func) || 0;
  });
  const faultyCctv = Math.max(0, totalCctv - funcCctv);
  const cctvUptime = totalCctv > 0 ? ((funcCctv / totalCctv) * 100).toFixed(1) : '100.0';

  // Access footfall
  const totalAccessCount = report.access.reduce((sum, item) => {
    const num = parseInt(item.count, 10);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  // Incidents
  const activeIncidents = report.incident.filter(
    (i) => i.desc.trim().length > 0 || i.action.trim().length > 0
  );

  // Patrol & Observations
  const completedPatrols = report.patrol.filter((p) => p.finding.trim().length > 0);
  const activeObservations = report.obs.filter((o) => o.obs.trim().length > 0);

  return (
    <div className="max-w-[1140px] mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-[var(--navy)] text-white p-6 rounded-xl shadow-md flex flex-wrap items-center justify-between gap-4 border border-[var(--line)]">
        <div>
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
            {report.facility || 'SALS Facility'}
          </div>
          <h2 className="text-2xl font-bold mt-1">Shift Operational Dashboard</h2>
          <div className="text-sm text-slate-200 mt-1 flex flex-wrap items-center gap-3">
            <span>📅 {report.date} ({report.day})</span>
            <span>•</span>
            <span className="font-semibold px-2 py-0.5 rounded bg-white/20 text-xs">
              {report.shift} Shift
            </span>
            <span>•</span>
            <span>Officer: {report.officer || 'Unassigned'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onGoToForm}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Open Report Form</span>
          </button>
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent)] hover:opacity-90 text-xs font-bold transition-all shadow"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Guard Coverage */}
        <div className="bg-white dark:bg-[#18181c] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Guard Coverage
            </span>
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-800 dark:text-white">
              {guardCoveragePct}%
            </span>
            <span className="text-xs text-slate-500">
              ({assignedGuards}/{totalPosts} Posts)
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                guardCoveragePct >= 90 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${guardCoveragePct}%` }}
            />
          </div>
        </div>

        {/* CCTV Health */}
        <div className="bg-white dark:bg-[#18181c] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              CCTV Surveillance
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-800 dark:text-white">
              {cctvUptime}%
            </span>
            <span className="text-xs text-slate-500">
              ({funcCctv}/{totalCctv} Online)
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            {faultyCctv > 0 ? (
              <span className="text-red-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {faultyCctv} Camera(s) Faulty
              </span>
            ) : (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> All Cameras Healthy
              </span>
            )}
          </div>
        </div>

        {/* Access Footfall */}
        <div className="bg-white dark:bg-[#18181c] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Access Footfall
            </span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-800 dark:text-white">
              {totalAccessCount}
            </span>
            <span className="text-xs text-slate-500">Total Entries / Checks</span>
          </div>
          <div className="mt-3 text-xs text-slate-500 truncate">
            {report.access.length} Categories Recorded
          </div>
        </div>

        {/* Incident Severity */}
        <div className="bg-white dark:bg-[#18181c] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Incidents
            </span>
            <div
              className={`p-2 rounded-lg ${
                activeIncidents.length > 0
                  ? 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400'
                  : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-800 dark:text-white">
              {activeIncidents.length}
            </span>
            <span className="text-xs text-slate-500">Occurrences Handled</span>
          </div>
          <div className="mt-3 text-xs">
            {activeIncidents.length === 0 ? (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Zero Security Breaches
              </span>
            ) : (
              <span className="text-red-600 font-semibold">
                Requires Supervisor Review
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Details breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: CCTV & Security Systems */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#18181c] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-sm text-[var(--navy)] dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Video className="w-4 h-4" />
                <span>Security Systems &amp; Surveillance Status</span>
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {report.cctv.length} Systems
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
              {report.cctv.map((item, idx) => {
                const total = Number(item.total) || 0;
                const func = Number(item.func) || 0;
                const faulty = Math.max(0, total - func);
                const pct = total > 0 ? Math.round((func / total) * 100) : 100;

                return (
                  <div key={item.id || idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                        {item.sys || `System #${idx + 1}`}
                      </div>
                      {item.rem && (
                        <div className="text-xs text-slate-500 mt-0.5">{item.rem}</div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {func} / {total} Active
                        </div>
                        <div className="text-[11px] text-slate-400">{pct}% operational</div>
                      </div>

                      <span
                        className={`text-xs px-2.5 py-1 rounded font-bold min-w-[70px] text-center ${
                          faulty > 0
                            ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}
                      >
                        {faulty > 0 ? `${faulty} Faulty` : 'Normal'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Incidents & Occurrences */}
          <div className="bg-white dark:bg-[#18181c] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-sm text-[var(--navy)] dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Incident Log &amp; Safety Occurrences</span>
              </h3>
              <span className="text-xs font-bold text-slate-500">
                {activeIncidents.length} Records
              </span>
            </div>

            {activeIncidents.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                <CheckCircle className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
                No security incidents reported on this shift. All operations nominal.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
                {activeIncidents.map((inc, i) => (
                  <div key={inc.id || i} className="py-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                          {inc.time || 'Time N/A'}
                        </span>
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                          {inc.loc || 'Location Unspecified'}
                        </span>
                      </div>
                      {inc.ir && (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-semibold border border-slate-300 dark:border-slate-700">
                          {inc.ir}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {inc.desc}
                    </p>
                    {inc.action && (
                      <div className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded border border-emerald-200 dark:border-emerald-900">
                        <strong>Action Taken:</strong> {inc.action}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Handover & Guard Deployments */}
        <div className="space-y-6">
          {/* Handover Briefing Card */}
          <div className="bg-white dark:bg-[#18181c] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-sm text-[var(--navy)] dark:text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Next Shift Handover Notes</span>
            </h3>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {report.handover || 'No handover instructions entered.'}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500">
              <span>Prepared by: {report.prepName || '—'}</span>
              <span>Review: {report.status || 'Draft'}</span>
            </div>
          </div>

          {/* Guard Deployment Quick Summary */}
          <div className="bg-white dark:bg-[#18181c] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-[var(--navy)] dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Guard Posts Assigned</span>
              </h3>
              <span className="text-xs font-bold text-slate-500">
                {assignedGuards}/{totalPosts}
              </span>
            </div>

            <div className="max-h-[280px] overflow-y-auto space-y-1.5 pr-1">
              {report.guard.map((g, i) => (
                <div
                  key={g.id || i}
                  className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/40 text-xs"
                >
                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                    {g.post || `Post #${i + 1}`}
                  </span>
                  <span
                    className={`font-medium truncate max-w-[130px] ${
                      g.name ? 'text-slate-900 dark:text-white' : 'text-slate-400 italic'
                    }`}
                  >
                    {g.name || 'Unassigned'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Access Categories */}
          <div className="bg-white dark:bg-[#18181c] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-sm text-[var(--navy)] dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>Visitor / Access Breakdown</span>
            </h3>

            <div className="space-y-2">
              {report.access.map((acc, i) => (
                <div key={acc.id || i} className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 truncate max-w-[200px]">
                    {acc.cat || `Category #${i + 1}`}
                  </span>
                  <span className="font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {acc.count || '0'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

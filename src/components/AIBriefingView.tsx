import React, { useState } from 'react';
import { SecurityDailyReport } from '../types/report';
import {
  generateLocalShiftAnalysis,
  generateGeminiShiftBriefing,
  AIShiftAnalysis,
} from '../services/aiReview';
import {
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Copy,
  Check,
  Send,
  RefreshCw,
  Video,
  Users,
  CheckCircle2,
  FileText,
  AlertTriangle,
} from 'lucide-react';

interface AIBriefingViewProps {
  report: SecurityDailyReport;
  onApplyHandover: (handoverText: string) => void;
  onGoToForm: () => void;
}

export const AIBriefingView: React.FC<AIBriefingViewProps> = ({
  report,
  onApplyHandover,
  onGoToForm,
}) => {
  const [analysis, setAnalysis] = useState<AIShiftAnalysis>(() =>
    generateLocalShiftAnalysis(report)
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleRefresh = async () => {
    setIsGenerating(true);
    try {
      const refreshedLocal = generateLocalShiftAnalysis(report);
      // Try Gemini enhancement if available
      const geminiBriefing = await generateGeminiShiftBriefing(report);
      if (geminiBriefing) {
        refreshedLocal.handoverDraft = geminiBriefing;
      }
      setAnalysis(refreshedLocal);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = `[SALS SECURITY SHIFT BRIEFING - ${report.shift.toUpperCase()} SHIFT]\nDate: ${report.date} (${report.day})\nFacility: ${report.facility}\nOfficer: ${report.officer || 'Officer on Duty'}\n\n${analysis.handoverDraft}\n\nRisk Assessment: ${analysis.overallRiskLevel}\nCCTV Uptime: ${analysis.cctvUptimeRate}% (${analysis.totalFaultyCctv} faulty)\nGuards Deployed: ${analysis.assignedGuardsCount}/${analysis.totalPostsCount}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    onApplyHandover(analysis.handoverDraft);
    setApplied(true);
    setTimeout(() => setApplied(false), 2500);
  };

  return (
    <div className="max-w-[1040px] mx-auto px-4 py-6 space-y-6">
      {/* AI Header Card */}
      <div className="bg-[var(--navy)] text-white p-6 rounded-xl shadow-md flex flex-wrap items-center justify-between gap-4 border border-[var(--line)]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>AI Shift Operational Review</span>
          </div>
          <h2 className="text-2xl font-bold">Shift Briefing &amp; Anomaly Scanner</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Automated intelligence analyzing guard attendance, CCTV camera uptime, incident
            severity, and generating formal executive handover notes for management.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[var(--navy)] font-bold text-xs shadow hover:bg-slate-100 active:scale-95 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Analyzing Report...' : 'Re-Analyze Shift'}</span>
        </button>
      </div>

      {/* Security Health Score Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Risk Level */}
        <div className="bg-white dark:bg-[#18181c] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center gap-4">
          <div
            className={`p-3 rounded-xl ${
              analysis.overallRiskLevel === 'HIGH'
                ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                : analysis.overallRiskLevel === 'MEDIUM'
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
            }`}
          >
            {analysis.overallRiskLevel === 'LOW' ? (
              <ShieldCheck className="w-8 h-8" />
            ) : (
              <ShieldAlert className="w-8 h-8" />
            )}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Shift Security Threat Level
            </div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {analysis.overallRiskLevel} RISK
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {analysis.overallRiskLevel === 'LOW'
                ? 'Normal routine logistics operations'
                : 'Attentions required on incidents/CCTV'}
            </div>
          </div>
        </div>

        {/* Guard Coverage */}
        <div className="bg-white dark:bg-[#18181c] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-slate-100 text-[var(--navy)] dark:bg-slate-800 dark:text-slate-300">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Guard Coverage Rate
            </div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {analysis.assignedGuardsCount}/{analysis.totalPostsCount} Posts
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {analysis.totalPostsCount > 0
                ? `${Math.round((analysis.assignedGuardsCount / analysis.totalPostsCount) * 100)}% deployed`
                : '100%'}
            </div>
          </div>
        </div>

        {/* CCTV Health */}
        <div className="bg-white dark:bg-[#18181c] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center gap-4">
          <div
            className={`p-3 rounded-xl ${
              analysis.totalFaultyCctv > 0
                ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
            }`}
          >
            <Video className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              CCTV System Integrity
            </div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {analysis.cctvUptimeRate}% Uptime
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {analysis.totalFaultyCctv > 0
                ? `${analysis.totalFaultyCctv} faulty camera unit(s)`
                : 'All cameras 100% operational'}
            </div>
          </div>
        </div>
      </div>

      {/* Handover Briefing Output */}
      <div className="bg-white dark:bg-[#18181c] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="font-bold text-sm text-[var(--navy)] dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Executive Shift Handover Briefing</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Synthesized from current guard logs, access numbers, and CCTV records.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            <button
              onClick={handleApply}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--navy)] hover:opacity-90 text-white text-xs font-semibold transition-colors shadow"
            >
              {applied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Applied to Section 7!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Apply to Handover Notes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Executive summary paragraph */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          {analysis.executiveSummary}
        </div>

        {/* Handover note content box */}
        <div className="relative">
          <textarea
            rows={8}
            value={analysis.handoverDraft}
            onChange={(e) => setAnalysis({ ...analysis, handoverDraft: e.target.value })}
            className="w-full p-4 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 leading-relaxed outline-none focus:ring-2 focus:ring-[var(--navy)]"
          />
        </div>

        {/* Action Items Recommendation List */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Recommended Priority Follow-up Actions</span>
          </h4>

          <div className="space-y-1.5">
            {analysis.actionItems.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-2 rounded bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                <span className="text-[var(--accent)] font-bold">•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onGoToForm}
            className="text-xs font-bold text-[var(--accent)] hover:underline"
          >
            ← Return to Form Sheet View
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef } from 'react';
import {
  SecurityDailyReport,
  GuardDeploymentItem,
  AccessControlItem,
  IncidentLogItem,
  CctvStatusItem,
  PatrolClockingItem,
  ObservationItem,
} from '../types/report';
import { SALS_LOGO_SRC } from '../constants/defaults';
import { Plus, Trash2, ChevronUp, ChevronDown, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ReportSheetProps {
  report: SecurityDailyReport;
  onChange: (updated: SecurityDailyReport) => void;
}

export const ReportSheet: React.FC<ReportSheetProps> = ({ report, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute weekday when date changes
  const handleDateChange = (newDate: string) => {
    let dayString = '';
    if (newDate) {
      const d = new Date(newDate + 'T00:00:00');
      if (!isNaN(d.getTime())) {
        dayString = d.toLocaleDateString('en-GB', { weekday: 'long' });
      }
    }
    onChange({
      ...report,
      date: newDate,
      day: dayString,
      prepDate: report.prepDate || newDate,
    });
  };

  // Auto-resize textareas to fit content dynamically
  useEffect(() => {
    if (!containerRef.current) return;
    const textareas = containerRef.current.querySelectorAll('textarea');
    textareas.forEach((ta) => {
      ta.style.height = 'auto';
      ta.style.height = `${Math.max(34, ta.scrollHeight)}px`;
    });
  }, [report]);

  // Section 1: Guard Deployment operations
  const addGuardRow = () => {
    const newGuard: GuardDeploymentItem = {
      id: Math.random().toString(36).substring(2, 9),
      post: '',
      name: '',
      rem: '',
    };
    onChange({ ...report, guard: [...report.guard, newGuard] });
  };

  const updateGuard = (index: number, field: keyof GuardDeploymentItem, value: string) => {
    const updated = [...report.guard];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...report, guard: updated });
  };

  const deleteGuardRow = (index: number) => {
    if (report.guard.length <= 1) {
      onChange({
        ...report,
        guard: [{ id: 'g0', post: '', name: '', rem: '' }],
      });
    } else {
      onChange({
        ...report,
        guard: report.guard.filter((_, i) => i !== index),
      });
    }
  };

  // Section 2: Access Control operations
  const addAccessRow = () => {
    const newAccess: AccessControlItem = {
      id: Math.random().toString(36).substring(2, 9),
      cat: '',
      count: '0',
      rem: '',
    };
    onChange({ ...report, access: [...report.access, newAccess] });
  };

  const updateAccess = (index: number, field: keyof AccessControlItem, value: string) => {
    const updated = [...report.access];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...report, access: updated });
  };

  const stepAccessCount = (index: number, delta: number) => {
    const current = parseInt(report.access[index].count, 10) || 0;
    const nextVal = Math.max(0, current + delta);
    updateAccess(index, 'count', String(nextVal));
  };

  const deleteAccessRow = (index: number) => {
    if (report.access.length <= 1) {
      onChange({
        ...report,
        access: [{ id: 'a0', cat: '', count: '0', rem: '' }],
      });
    } else {
      onChange({
        ...report,
        access: report.access.filter((_, i) => i !== index),
      });
    }
  };

  // Section 3: Incident Log operations
  const addIncidentRow = () => {
    const newInc: IncidentLogItem = {
      id: Math.random().toString(36).substring(2, 9),
      time: '',
      loc: '',
      desc: '',
      action: '',
      ir: '',
      severity: 'Low',
    };
    onChange({ ...report, incident: [...report.incident, newInc] });
  };

  const updateIncident = (index: number, field: keyof IncidentLogItem, value: string) => {
    const updated = [...report.incident];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...report, incident: updated });
  };

  const deleteIncidentRow = (index: number) => {
    if (report.incident.length <= 1) {
      onChange({
        ...report,
        incident: [
          {
            id: 'inc0',
            time: '',
            loc: '',
            desc: '',
            action: '',
            ir: '',
            severity: 'Low',
          },
        ],
      });
    } else {
      onChange({
        ...report,
        incident: report.incident.filter((_, i) => i !== index),
      });
    }
  };

  // Section 4: CCTV Systems operations
  const addCctvRow = () => {
    const newCctv: CctvStatusItem = {
      id: Math.random().toString(36).substring(2, 9),
      sys: '',
      total: 0,
      func: 0,
      rem: '',
    };
    onChange({ ...report, cctv: [...report.cctv, newCctv] });
  };

  const updateCctv = (index: number, field: keyof CctvStatusItem, value: any) => {
    const updated = [...report.cctv];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...report, cctv: updated });
  };

  const deleteCctvRow = (index: number) => {
    if (report.cctv.length <= 1) {
      onChange({
        ...report,
        cctv: [{ id: 'c0', sys: '', total: 0, func: 0, rem: '' }],
      });
    } else {
      onChange({
        ...report,
        cctv: report.cctv.filter((_, i) => i !== index),
      });
    }
  };

  // Section 5: Patrol operations
  const addPatrolRow = () => {
    const newPatrol: PatrolClockingItem = {
      id: Math.random().toString(36).substring(2, 9),
      finding: '',
      guard: '',
      obs: '',
    };
    onChange({ ...report, patrol: [...report.patrol, newPatrol] });
  };

  const updatePatrol = (index: number, field: keyof PatrolClockingItem, value: string) => {
    const updated = [...report.patrol];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...report, patrol: updated });
  };

  const deletePatrolRow = (index: number) => {
    if (report.patrol.length <= 1) {
      onChange({
        ...report,
        patrol: [{ id: 'p0', finding: '', guard: '', obs: '' }],
      });
    } else {
      onChange({
        ...report,
        patrol: report.patrol.filter((_, i) => i !== index),
      });
    }
  };

  // Section 6: Observations operations
  const addObsRow = () => {
    const newObs: ObservationItem = {
      id: Math.random().toString(36).substring(2, 9),
      time: '',
      area: '',
      obs: '',
      action: '',
    };
    onChange({ ...report, obs: [...report.obs, newObs] });
  };

  const updateObs = (index: number, field: keyof ObservationItem, value: string) => {
    const updated = [...report.obs];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...report, obs: updated });
  };

  const deleteObsRow = (index: number) => {
    if (report.obs.length <= 1) {
      onChange({
        ...report,
        obs: [{ id: 'o0', time: '', area: '', obs: '', action: '' }],
      });
    } else {
      onChange({
        ...report,
        obs: report.obs.filter((_, i) => i !== index),
      });
    }
  };

  // Quick insertion into Handover Notes
  const appendHandoverSnippet = (text: string) => {
    const current = report.handover ? report.handover.trim() : '';
    const updated = current ? `${current}\n- ${text}` : `- ${text}`;
    onChange({ ...report, handover: updated });
  };

  // CCTV Total stats calculation
  let cctvTotalSum = 0;
  let cctvFuncSum = 0;
  report.cctv.forEach((c) => {
    cctvTotalSum += Number(c.total) || 0;
    cctvFuncSum += Number(c.func) || 0;
  });
  const cctvFaultySum = Math.max(0, cctvTotalSum - cctvFuncSum);
  const cctvUptime =
    cctvTotalSum > 0 ? ((cctvFuncSum / cctvTotalSum) * 100).toFixed(1) : '100.0';

  return (
    <div ref={containerRef} className="pb-16 print:pb-0">
      <div className="sals-sheet" id="sheet">
        {/* Header Section */}
        <div className="sals-header">
          <div className="flex-shrink-0">
            <img
              alt="SALS"
              src={SALS_LOGO_SRC}
              className="sals-logo h-[54px] w-auto object-contain"
            />
          </div>
          <div className="flex-1 text-center">
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-[var(--navy)] uppercase m-0">
              SECURITY DAILY REPORT
            </h1>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5 tracking-wide">
              STANDARD OPERATING PROCEDURE FORM · SALS OPERATIONS
            </div>
          </div>
          <div className="text-right text-[11px] text-slate-600 leading-snug">
            <div className="font-semibold text-[var(--navy)]">
              SEM ALP Logistics Sdn. Bhd.
            </div>
            <div>Security Department</div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Ref: SDR-{report.date?.replace(/-/g, '') || 'DRAFT'}-
              {report.shift.charAt(0)}
            </div>
          </div>
        </div>

        {/* General Info Grid */}
        <div className="info border-b border-[var(--line)]">
          <label className="border-b md:border-b-0 border-r border-[var(--line)]">
            <span className="bg-[var(--label)] text-[var(--ink)] px-3 py-2 font-semibold text-xs flex items-center border-r border-[var(--line)]">
              Facility
            </span>
            <input
              type="text"
              value={report.facility}
              onChange={(e) => onChange({ ...report, facility: e.target.value })}
              placeholder="e.g. SALS – OMEGA 1 Bukit Raja, Klang"
              className="sals-input"
            />
          </label>

          <label className="border-b md:border-b-0 border-[var(--line)]">
            <span className="bg-[var(--label)] text-[var(--ink)] px-3 py-2 font-semibold text-xs flex items-center border-r border-[var(--line)]">
              Day
            </span>
            <input
              type="text"
              value={report.day}
              readOnly
              placeholder="Auto-calculated from Date"
              className="sals-input font-medium bg-[#fcfbfa] text-slate-800 cursor-not-allowed"
            />
          </label>

          <label className="border-t border-b md:border-b-0 border-r border-[var(--line)]">
            <span className="bg-[var(--label)] text-[var(--ink)] px-3 py-2 font-semibold text-xs flex items-center border-r border-[var(--line)]">
              Shift
            </span>
            <div className="shift">
              <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold">
                <input
                  type="radio"
                  name="shift"
                  value="Day"
                  checked={report.shift === 'Day'}
                  onChange={() => onChange({ ...report, shift: 'Day' })}
                  className="w-4 h-4 accent-[#ff2b00] cursor-pointer"
                />
                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                  Day (08:00 - 20:00)
                </span>
              </label>

              <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold">
                <input
                  type="radio"
                  name="shift"
                  value="Night"
                  checked={report.shift === 'Night'}
                  onChange={() => onChange({ ...report, shift: 'Night' })}
                  className="w-4 h-4 accent-[#ff2b00] cursor-pointer"
                />
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-300">
                  Night (20:00 - 08:00)
                </span>
              </label>
            </div>
          </label>

          <label className="border-t border-[var(--line)]">
            <span className="bg-[var(--label)] text-[var(--ink)] px-3 py-2 font-semibold text-xs flex items-center border-r border-[var(--line)]">
              Date
            </span>
            <input
              type="date"
              value={report.date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="sals-input"
            />
          </label>

          <label className="border-t border-r border-[var(--line)]">
            <span className="bg-[var(--label)] text-[var(--ink)] px-3 py-2 font-semibold text-xs flex items-center border-r border-[var(--line)]">
              Reporting Officer
            </span>
            <input
              type="text"
              value={report.officer}
              onChange={(e) => onChange({ ...report, officer: e.target.value })}
              placeholder="e.g. Sgt. Ahmad Faiz / Staff ID"
              className="sals-input"
            />
          </label>

          <label className="border-t border-[var(--line)]">
            <span className="bg-[var(--label)] text-[var(--ink)] px-3 py-2 font-semibold text-xs flex items-center border-r border-[var(--line)]">
              Guarding Provider
            </span>
            <input
              type="text"
              value={report.provider}
              onChange={(e) => onChange({ ...report, provider: e.target.value })}
              placeholder="e.g. Safeguards G4S / Securitas"
              className="sals-input"
            />
          </label>
        </div>

        {/* SECTION 1: GUARD DEPLOYMENT */}
        <div className="sals-sec">
          <div className="flex items-center gap-2">
            <span>1. GUARD DEPLOYMENT</span>
            <span className="text-[11px] font-normal opacity-80">
              ({report.guard.filter((g) => g.name.trim()).length}/
              {report.guard.length} Deployed)
            </span>
          </div>
          <button
            onClick={addGuardRow}
            className="no-print text-xs px-2.5 py-0.5 rounded bg-white/20 hover:bg-white/30 text-white flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add Post
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[640px]">
            <thead>
              <tr>
                <th className="sals-th w-10 text-center">No.</th>
                <th className="sals-th w-1/4">Post / Location</th>
                <th className="sals-th w-1/4">Guard Name</th>
                <th className="sals-th">Remarks</th>
                <th className="sals-th w-10 text-center no-print"></th>
              </tr>
            </thead>
            <tbody>
              {report.guard.map((row, idx) => (
                <tr key={row.id}>
                  <td className="sals-td-no">{idx + 1}</td>
                  <td className="sals-td">
                    <input
                      type="text"
                      value={row.post}
                      onChange={(e) => updateGuard(idx, 'post', e.target.value)}
                      placeholder="Post / Area"
                      className="sals-input font-medium"
                    />
                  </td>
                  <td className="sals-td">
                    <input
                      type="text"
                      value={row.name}
                      onChange={(e) => updateGuard(idx, 'name', e.target.value)}
                      placeholder="Guard Name / Badge"
                      className="sals-input"
                    />
                  </td>
                  <td className="sals-td">
                    <textarea
                      rows={1}
                      value={row.rem}
                      onChange={(e) => updateGuard(idx, 'rem', e.target.value)}
                      placeholder="Status, equipment, or remarks"
                      className="sals-textarea"
                    />
                  </td>
                  <td className="sals-td text-center no-print align-middle">
                    <button
                      onClick={() => deleteGuardRow(idx)}
                      title="Remove row"
                      className="text-red-500 hover:text-red-700 p-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SECTION 2: ACCESS CONTROL / VISITOR SUMMARY */}
        <div className="sals-sec">
          <div className="flex items-center gap-2">
            <span>2. ACCESS CONTROL / VISITOR SUMMARY</span>
          </div>
          <button
            onClick={addAccessRow}
            className="no-print text-xs px-2.5 py-0.5 rounded bg-white/20 hover:bg-white/30 text-white flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add Category
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[640px]">
            <thead>
              <tr>
                <th className="sals-th w-10 text-center">No.</th>
                <th className="sals-th w-1/3">Category</th>
                <th className="sals-th w-36 text-center">Count / Detail</th>
                <th className="sals-th">Remarks</th>
                <th className="sals-th w-10 text-center no-print"></th>
              </tr>
            </thead>
            <tbody>
              {report.access.map((row, idx) => (
                <tr key={row.id}>
                  <td className="sals-td-no">{idx + 1}</td>
                  <td className="sals-td-fixed">
                    <input
                      type="text"
                      value={row.cat}
                      onChange={(e) => updateAccess(idx, 'cat', e.target.value)}
                      placeholder="Access Category"
                      className="sals-input font-semibold bg-transparent"
                    />
                  </td>
                  <td className="sals-td text-center align-middle">
                    <div className="flex items-center justify-center gap-1 px-1">
                      <button
                        onClick={() => stepAccessCount(idx, -1)}
                        className="no-print text-xs px-1.5 py-0.5 rounded border border-slate-300 hover:bg-slate-200 transition-colors"
                        title="Decrement"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={row.count}
                        onChange={(e) => updateAccess(idx, 'count', e.target.value)}
                        className="sals-input text-center font-bold text-sm w-16"
                      />
                      <button
                        onClick={() => stepAccessCount(idx, 1)}
                        className="no-print text-xs px-1.5 py-0.5 rounded border border-slate-300 hover:bg-slate-200 transition-colors"
                        title="Increment"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="sals-td">
                    <textarea
                      rows={1}
                      value={row.rem}
                      onChange={(e) => updateAccess(idx, 'rem', e.target.value)}
                      placeholder="Remarks / Particulars"
                      className="sals-textarea"
                    />
                  </td>
                  <td className="sals-td text-center no-print align-middle">
                    <button
                      onClick={() => deleteAccessRow(idx)}
                      title="Remove row"
                      className="text-red-500 hover:text-red-700 p-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SECTION 3: INCIDENT / OCCURRENCE LOG */}
        <div className="sals-sec">
          <div className="flex items-center gap-2">
            <span>3. INCIDENT / OCCURRENCE LOG (attach IR form if applicable)</span>
            {report.incident.some((i) => i.desc.trim()) && (
              <span className="px-2 py-0.2 rounded text-[11px] bg-red-600 text-white font-semibold">
                {report.incident.filter((i) => i.desc.trim()).length} Logged
              </span>
            )}
          </div>
          <button
            onClick={addIncidentRow}
            className="no-print text-xs px-2.5 py-0.5 rounded bg-white/20 hover:bg-white/30 text-white flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add Incident Row
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[640px]">
            <thead>
              <tr>
                <th className="sals-th w-10 text-center">No.</th>
                <th className="sals-th w-20 text-center">Time</th>
                <th className="sals-th w-40">Location</th>
                <th className="sals-th">Description of Occurrence</th>
                <th className="sals-th">Action Taken</th>
                <th className="sals-th w-28">IR No. (if any)</th>
                <th className="sals-th w-10 text-center no-print"></th>
              </tr>
            </thead>
            <tbody>
              {report.incident.map((row, idx) => (
                <tr key={row.id}>
                  <td className="sals-td-no">{idx + 1}</td>
                  <td className="sals-td">
                    <input
                      type="text"
                      value={row.time}
                      onChange={(e) => updateIncident(idx, 'time', e.target.value)}
                      placeholder="HH:MM"
                      className="sals-input text-center"
                    />
                  </td>
                  <td className="sals-td">
                    <input
                      type="text"
                      value={row.loc}
                      onChange={(e) => updateIncident(idx, 'loc', e.target.value)}
                      placeholder="Location"
                      className="sals-input"
                    />
                  </td>
                  <td className="sals-td">
                    <textarea
                      rows={1}
                      value={row.desc}
                      onChange={(e) => updateIncident(idx, 'desc', e.target.value)}
                      placeholder="Details of occurrence / incident"
                      className="sals-textarea"
                    />
                  </td>
                  <td className="sals-td">
                    <textarea
                      rows={1}
                      value={row.action}
                      onChange={(e) => updateIncident(idx, 'action', e.target.value)}
                      placeholder="Action taken / mitigation"
                      className="sals-textarea"
                    />
                  </td>
                  <td className="sals-td">
                    <input
                      type="text"
                      value={row.ir}
                      onChange={(e) => updateIncident(idx, 'ir', e.target.value)}
                      placeholder="IR-2026-..."
                      className="sals-input text-xs"
                    />
                  </td>
                  <td className="sals-td text-center no-print align-middle">
                    <button
                      onClick={() => deleteIncidentRow(idx)}
                      title="Remove row"
                      className="text-red-500 hover:text-red-700 p-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SECTION 4: CCTV & SECURITY SYSTEMS STATUS */}
        <div className="sals-sec">
          <div className="flex items-center gap-2">
            <span>4. CCTV &amp; SECURITY SYSTEMS STATUS</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                cctvFaultySum > 0
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {cctvUptime}% Uptime ({cctvFuncSum}/{cctvTotalSum} Functional
              {cctvFaultySum > 0 ? ` · ${cctvFaultySum} Faulty` : ''})
            </span>
          </div>
          <button
            onClick={addCctvRow}
            className="no-print text-xs px-2.5 py-0.5 rounded bg-white/20 hover:bg-white/30 text-white flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add System
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[640px]">
            <thead>
              <tr>
                <th className="sals-th w-10 text-center">No.</th>
                <th className="sals-th w-1/3">System</th>
                <th className="sals-th w-24 text-center">Total</th>
                <th className="sals-th w-24 text-center">Function</th>
                <th className="sals-th w-24 text-center">Faulty</th>
                <th className="sals-th">Remarks</th>
                <th className="sals-th w-10 text-center no-print"></th>
              </tr>
            </thead>
            <tbody>
              {report.cctv.map((row, idx) => {
                const total = Number(row.total) || 0;
                const func = Number(row.func) || 0;
                const faulty = Math.max(0, total - func);

                return (
                  <tr key={row.id}>
                    <td className="sals-td-no">{idx + 1}</td>
                    <td className="sals-td-fixed">
                      <input
                        type="text"
                        value={row.sys}
                        onChange={(e) => updateCctv(idx, 'sys', e.target.value)}
                        placeholder="System Name"
                        className="sals-input font-semibold bg-transparent"
                      />
                    </td>
                    <td className="sals-td text-center">
                      <input
                        type="number"
                        min="0"
                        value={row.total}
                        onChange={(e) =>
                          updateCctv(idx, 'total', Math.max(0, parseInt(e.target.value, 10) || 0))
                        }
                        className="sals-input text-center font-medium"
                      />
                    </td>
                    <td className="sals-td text-center">
                      <input
                        type="number"
                        min="0"
                        value={row.func}
                        onChange={(e) =>
                          updateCctv(idx, 'func', Math.max(0, parseInt(e.target.value, 10) || 0))
                        }
                        className="sals-input text-center font-medium"
                      />
                    </td>
                    <td
                      className={`sals-td text-center font-bold ${
                        faulty > 0 ? 'faulty-bad' : 'text-emerald-700'
                      }`}
                    >
                      <div className="py-2 flex items-center justify-center gap-1">
                        {faulty > 0 && <AlertTriangle className="w-3.5 h-3.5 text-white" />}
                        <span>{faulty}</span>
                      </div>
                    </td>
                    <td className="sals-td">
                      <textarea
                        rows={1}
                        value={row.rem}
                        onChange={(e) => updateCctv(idx, 'rem', e.target.value)}
                        placeholder="Status, camera IDs, or vendor ticket no."
                        className="sals-textarea"
                      />
                    </td>
                    <td className="sals-td text-center no-print align-middle">
                      <button
                        onClick={() => deleteCctvRow(idx)}
                        title="Remove row"
                        className="text-red-500 hover:text-red-700 p-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* SECTION 5: PATROL / CLOCKING */}
        <div className="sals-sec">
          <div className="flex items-center gap-2">
            <span>5. PATROL / CLOCKING</span>
          </div>
          <button
            onClick={addPatrolRow}
            className="no-print text-xs px-2.5 py-0.5 rounded bg-white/20 hover:bg-white/30 text-white flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add Patrol Row
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[640px]">
            <thead>
              <tr>
                <th className="sals-th w-10 text-center">No.</th>
                <th className="sals-th w-1/3">Finding / Checkpoint</th>
                <th className="sals-th w-1/4">Guard</th>
                <th className="sals-th">Observations</th>
                <th className="sals-th w-10 text-center no-print"></th>
              </tr>
            </thead>
            <tbody>
              {report.patrol.map((row, idx) => (
                <tr key={row.id}>
                  <td className="sals-td-no">{idx + 1}</td>
                  <td className="sals-td">
                    <input
                      type="text"
                      value={row.finding}
                      onChange={(e) => updatePatrol(idx, 'finding', e.target.value)}
                      placeholder="e.g. Patrol Round 1 / Perimeter Check"
                      className="sals-input font-medium"
                    />
                  </td>
                  <td className="sals-td">
                    <input
                      type="text"
                      value={row.guard}
                      onChange={(e) => updatePatrol(idx, 'guard', e.target.value)}
                      placeholder="Guard Name"
                      className="sals-input"
                    />
                  </td>
                  <td className="sals-td">
                    <textarea
                      rows={1}
                      value={row.obs}
                      onChange={(e) => updatePatrol(idx, 'obs', e.target.value)}
                      placeholder="Observations during patrol"
                      className="sals-textarea"
                    />
                  </td>
                  <td className="sals-td text-center no-print align-middle">
                    <button
                      onClick={() => deletePatrolRow(idx)}
                      title="Remove row"
                      className="text-red-500 hover:text-red-700 p-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SECTION 6: SAFETY & SECURITY OBSERVATIONS / NON-COMPLIANCE */}
        <div className="sals-sec">
          <div className="flex items-center gap-2">
            <span>6. SAFETY &amp; SECURITY OBSERVATIONS / NON-COMPLIANCE</span>
          </div>
          <button
            onClick={addObsRow}
            className="no-print text-xs px-2.5 py-0.5 rounded bg-white/20 hover:bg-white/30 text-white flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add Observation Row
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[640px]">
            <thead>
              <tr>
                <th className="sals-th w-10 text-center">No.</th>
                <th className="sals-th w-20 text-center">Time</th>
                <th className="sals-th w-1/4">Location / Area</th>
                <th className="sals-th">Observation / Non-Compliance</th>
                <th className="sals-th">Corrective Action</th>
                <th className="sals-th w-10 text-center no-print"></th>
              </tr>
            </thead>
            <tbody>
              {report.obs.map((row, idx) => (
                <tr key={row.id}>
                  <td className="sals-td-no">{idx + 1}</td>
                  <td className="sals-td">
                    <input
                      type="text"
                      value={row.time}
                      onChange={(e) => updateObs(idx, 'time', e.target.value)}
                      placeholder="HH:MM"
                      className="sals-input text-center"
                    />
                  </td>
                  <td className="sals-td">
                    <input
                      type="text"
                      value={row.area}
                      onChange={(e) => updateObs(idx, 'area', e.target.value)}
                      placeholder="Location / Area"
                      className="sals-input"
                    />
                  </td>
                  <td className="sals-td">
                    <textarea
                      rows={1}
                      value={row.obs}
                      onChange={(e) => updateObs(idx, 'obs', e.target.value)}
                      placeholder="Non-compliance or hazard detected"
                      className="sals-textarea"
                    />
                  </td>
                  <td className="sals-td">
                    <textarea
                      rows={1}
                      value={row.action}
                      onChange={(e) => updateObs(idx, 'action', e.target.value)}
                      placeholder="Corrective action taken"
                      className="sals-textarea"
                    />
                  </td>
                  <td className="sals-td text-center no-print align-middle">
                    <button
                      onClick={() => deleteObsRow(idx)}
                      title="Remove row"
                      className="text-red-500 hover:text-red-700 p-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SECTION 7: HANDOVER NOTES / PENDING ACTIONS FOR NEXT SHIFT */}
        <div className="sals-sec">
          <span>7. HANDOVER NOTES / PENDING ACTIONS FOR NEXT SHIFT</span>
        </div>
        <div className="p-3 border-b border-[var(--line)]">
          <textarea
            rows={4}
            value={report.handover}
            onChange={(e) => onChange({ ...report, handover: e.target.value })}
            placeholder="Key briefings, pending actions, special vendor visits, perimeter status..."
            className="sals-textarea font-sans leading-relaxed border border-slate-200 rounded p-2"
          />

          {/* Quick preset chips */}
          <div className="no-print mt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            <span className="font-semibold text-slate-600">
              Quick Append:
            </span>
            <button
              onClick={() => appendHandoverSnippet('All perimeter emergency gates checked and magnetically secured.')}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 transition-colors"
            >
              + Gates Secured
            </button>
            <button
              onClick={() => appendHandoverSnippet('Cold Room / Chill DC airlock seals verified normal at -18°C.')}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 transition-colors"
            >
              + Chill DC Seals
            </button>
            <button
              onClick={() => appendHandoverSnippet('Tobacco cage high-value tamper seal intact; dual-key logged.')}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 transition-colors"
            >
              + Tobacco Cage
            </button>
            <button
              onClick={() => appendHandoverSnippet('Yard perimeter floodlights turned on; guard patrolling hourly.')}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 transition-colors"
            >
              + Yard Floodlights
            </button>
          </div>
        </div>

        {/* SECTION 8: SIGN-OFF */}
        <div className="sals-sec">
          <div className="flex items-center gap-2">
            <span>8. SIGN-OFF</span>
            <span className="text-[11px] font-normal opacity-90">
              (Status: {report.status || 'Draft'})
            </span>
          </div>
          <div className="no-print flex items-center gap-2">
            <label className="text-xs font-normal flex items-center gap-1 text-white">
              <span>Sign-off Status:</span>
              <select
                value={report.status || 'Draft'}
                onChange={(e) =>
                  onChange({
                    ...report,
                    status: e.target.value as any,
                  })
                }
                className="bg-white/20 border border-white/30 text-white rounded text-xs px-2 py-0.5 outline-none cursor-pointer"
              >
                <option value="Draft" className="text-slate-900">
                  Draft
                </option>
                <option value="Submitted" className="text-slate-900">
                  Submitted
                </option>
                <option value="Reviewed" className="text-slate-900">
                  Reviewed
                </option>
                <option value="Approved" className="text-slate-900">
                  Approved
                </option>
              </select>
            </label>
          </div>
        </div>

        <div className="sign">
          {/* Prepared by */}
          <div className="p-3 md:border-r border-b md:border-b-0 border-[var(--line)] flex flex-col justify-between">
            <div>
              <div className="font-bold text-xs uppercase text-[var(--navy)] mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Prepared by:</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-16 font-semibold text-slate-600">
                    NAME:
                  </span>
                  <input
                    type="text"
                    value={report.prepName}
                    onChange={(e) => onChange({ ...report, prepName: e.target.value })}
                    placeholder="Reporting Officer Name"
                    className="sals-input border-b border-[var(--line)] py-1 font-medium"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16 font-semibold text-slate-600">
                    ROLE:
                  </span>
                  <input
                    type="text"
                    value={report.prepRole}
                    onChange={(e) => onChange({ ...report, prepRole: e.target.value })}
                    placeholder="Designation"
                    className="sals-input border-b border-[var(--line)] py-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16 font-semibold text-slate-600">
                    DATE:
                  </span>
                  <input
                    type="date"
                    value={report.prepDate}
                    onChange={(e) => onChange({ ...report, prepDate: e.target.value })}
                    className="sals-input border-b border-[var(--line)] py-1"
                  />
                </div>
              </div>
            </div>

            {report.prepName && (
              <div className="mt-3 pt-2 border-t border-dashed border-slate-300 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                <span>DIGITAL VERIFIED: {report.prepName}</span>
                <span>{report.prepDate}</span>
              </div>
            )}
          </div>

          {/* Reviewed by */}
          <div className="p-3 flex flex-col justify-between">
            <div>
              <div className="font-bold text-xs uppercase text-[var(--navy)] mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-slate-700" />
                <span>Reviewed by:</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-16 font-semibold text-slate-600">
                    NAME:
                  </span>
                  <input
                    type="text"
                    value={report.revName}
                    onChange={(e) => onChange({ ...report, revName: e.target.value })}
                    placeholder="Reviewing Executive Name"
                    className="sals-input border-b border-[var(--line)] py-1 font-medium"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16 font-semibold text-slate-600">
                    ROLE:
                  </span>
                  <input
                    type="text"
                    value={report.revRole}
                    onChange={(e) => onChange({ ...report, revRole: e.target.value })}
                    placeholder="Designation"
                    className="sals-input border-b border-[var(--line)] py-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16 font-semibold text-slate-600">
                    DATE:
                  </span>
                  <input
                    type="date"
                    value={report.revDate}
                    onChange={(e) => onChange({ ...report, revDate: e.target.value })}
                    className="sals-input border-b border-[var(--line)] py-1"
                  />
                </div>
              </div>
            </div>

            {report.revName && (
              <div className="mt-3 pt-2 border-t border-dashed border-slate-300 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                <span>DIGITAL VERIFIED: {report.revName}</span>
                <span>{report.revDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Storage note & ver footer matching user's exact template */}
      <div className="no-print">
        <p className="note">
          Storage note: your draft is saved only in this browser (localStorage). Clearing browser data or switching device/browser will lose it, and private windows may not save at all. Use <b>Export JSON</b> to keep a copy and <b>Print / Save PDF</b> for the filed report.
        </p>
        <div className="ver">
          Form v1.1 · SALS brand theme · based on Security Daily Report template (27 Oct 2026)
        </div>
      </div>
    </div>
  );
};

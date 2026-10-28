import React, { useState } from 'react';
import { SavedReportMeta, SecurityDailyReport } from '../types/report';
import {
  Archive,
  Search,
  Calendar,
  Clock,
  Shield,
  AlertTriangle,
  ArrowRight,
  Copy,
  Trash2,
  FileCheck,
  PlusCircle,
  Video,
} from 'lucide-react';

interface ArchiveViewProps {
  currentReport: SecurityDailyReport;
  historyList: SavedReportMeta[];
  onLoadReport: (id: string) => void;
  onDuplicateReport: (id: string) => void;
  onDeleteReport: (id: string) => void;
  onSaveCurrentToArchive: () => void;
  onLoadSample: () => void;
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({
  currentReport,
  historyList,
  onLoadReport,
  onDuplicateReport,
  onDeleteReport,
  onSaveCurrentToArchive,
  onLoadSample,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterShift, setFilterShift] = useState<'All' | 'Day' | 'Night'>('All');

  const filteredHistory = historyList.filter((item) => {
    const matchesSearch =
      (item.facility && item.facility.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.date && item.date.includes(searchQuery)) ||
      (item.officer && item.officer.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesShift = filterShift === 'All' || item.shift === filterShift;

    return matchesSearch && matchesShift;
  });

  return (
    <div className="max-w-[1140px] mx-auto px-4 py-6 space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#18181c] border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[var(--navy)] dark:text-slate-100 flex items-center gap-2">
            <Archive className="w-5 h-5 text-[var(--accent)]" />
            <span>Security Daily Reports Archive</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse, review, duplicate, and load past shift logs stored on this workstation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSaveCurrentToArchive}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-colors"
          >
            <FileCheck className="w-4 h-4" />
            <span>Save Current Shift Log</span>
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by facility, date (YYYY-MM-DD), or officer name..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#18181c] text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-[#18181c] p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setFilterShift('All')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              filterShift === 'All'
                ? 'bg-[var(--navy)] text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Shifts
          </button>
          <button
            onClick={() => setFilterShift('Day')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              filterShift === 'Day'
                ? 'bg-[var(--navy)] text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setFilterShift('Night')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              filterShift === 'Night'
                ? 'bg-[var(--navy)] text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Night
          </button>
        </div>
      </div>

      {/* Archive List Grid */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white dark:bg-[#18181c] border border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-10 text-center space-y-3">
          <Archive className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
          <div className="text-base font-bold text-slate-700 dark:text-slate-300">
            No Archived Reports Found
          </div>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchQuery
              ? 'No reports matched your search criteria. Clear the filter to view all.'
              : 'You have not saved any past shift reports to the history archive yet.'}
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={onSaveCurrentToArchive}
              className="text-xs px-4 py-2 rounded-lg bg-[var(--navy)] hover:opacity-90 text-white font-semibold transition-colors"
            >
              Archive Current Report
            </button>
            <button
              onClick={onLoadSample}
              className="text-xs px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold border border-slate-300 dark:border-slate-600 transition-colors"
            >
              Load Sample Report
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHistory.map((item) => {
            const isCurrentlyActive = item.id === currentReport.id;

            return (
              <div
                key={item.id}
                className={`bg-white dark:bg-[#18181c] border rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                    isCurrentlyActive
                    ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-bold ${
                        item.shift === 'Day'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {item.shift} Shift
                    </span>

                    <span
                      className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                        item.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : item.status === 'Reviewed'
                          ? 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {item.status || 'Draft'}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {item.facility}
                  </h3>

                  <div className="text-xs text-slate-500 mt-2 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{item.officer}</span>
                    </div>
                  </div>

                  {/* Operational Tags */}
                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                    <span
                      className={`px-1.5 py-0.5 rounded flex items-center gap-1 font-medium ${
                        item.cctvFaultyCount > 0
                          ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      }`}
                    >
                      <Video className="w-3 h-3" />
                      <span>{item.cctvFaultyCount > 0 ? `${item.cctvFaultyCount} Faulty` : 'CCTV OK'}</span>
                    </span>

                    <span
                      className={`px-1.5 py-0.5 rounded flex items-center gap-1 font-medium ${
                        item.incidentsCount > 0
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>{item.incidentsCount} Incidents</span>
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onDuplicateReport(item.id)}
                      title="Duplicate as new shift report"
                      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteReport(item.id)}
                      title="Delete from archive"
                      className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onLoadReport(item.id)}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded bg-[var(--navy)] hover:opacity-90 text-white transition-colors"
                  >
                    <span>{isCurrentlyActive ? 'Editing' : 'Load Report'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

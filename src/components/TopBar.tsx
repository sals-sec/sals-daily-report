import React, { useRef } from 'react';
import {
  FileText,
  LayoutDashboard,
  Archive,
  Sparkles,
  Printer,
  Download,
  Upload,
  PlusCircle,
  FileSpreadsheet,
  Moon,
  Sun,
  Save,
  CheckCircle2,
  BookmarkCheck,
  Contrast,
  Flame,
} from 'lucide-react';

interface TopBarProps {
  currentTab: 'form' | 'dashboard' | 'archive' | 'ai';
  onTabChange: (tab: 'form' | 'dashboard' | 'archive' | 'ai') => void;
  statusText: string;
  isSaving: boolean;
  onSaveNow: () => void;
  onNewBlank: () => void;
  onLoadSample: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
  onImportJSON: (file: File) => void;
  onPrint: () => void;
  onSaveToArchive: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  bwMode: boolean;
  onToggleBwMode: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onTabChange,
  statusText,
  isSaving,
  onSaveNow,
  onNewBlank,
  onLoadSample,
  onExportJSON,
  onExportCSV,
  onImportJSON,
  onPrint,
  onSaveToArchive,
  darkMode,
  onToggleDarkMode,
  bwMode,
  onToggleBwMode,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJSON(file);
      e.target.value = '';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--navy)] text-white shadow-md no-print border-b-[3px] border-[var(--accent)] transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2">
        {/* Brand and Status - styled after sals.com.my nav and SDR template */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center font-black text-xl tracking-wider text-[var(--accent)]">
              SALS
            </div>
            <div className="h-4 w-px bg-white/20 hidden sm:block" />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold leading-none">
                SEM ALP Logistics · OMEGA 1
              </div>
              <h1 className="text-xs font-semibold leading-tight text-slate-200">
                Security Daily Report
              </h1>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 text-[11px] text-slate-300 border border-white/10">
            {isSaving ? (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span className="truncate max-w-[200px]">{statusText}</span>
            <button
              onClick={onSaveNow}
              title="Save draft immediately"
              className="ml-1 text-[11px] underline text-[#E8391A] hover:text-white"
            >
              Save
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="flex items-center bg-white/5 p-1 rounded-lg border border-white/10">
          <button
            onClick={() => onTabChange('form')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              currentTab === 'form'
                ? bwMode
                  ? 'bg-white text-black shadow-sm'
                  : 'bg-[#E8391A] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Report Form</span>
          </button>
          <button
            onClick={() => onTabChange('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              currentTab === 'dashboard'
                ? bwMode
                  ? 'bg-white text-black shadow-sm'
                  : 'bg-[#E8391A] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => onTabChange('archive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              currentTab === 'archive'
                ? bwMode
                  ? 'bg-white text-black shadow-sm'
                  : 'bg-[#E8391A] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Archive</span>
          </button>
          <button
            onClick={() => onTabChange('ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              currentTab === 'ai'
                ? bwMode
                  ? 'bg-white text-black shadow-sm'
                  : 'bg-[#E8391A] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Review</span>
          </button>
        </nav>

        {/* Primary and Utility Action Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Theme Palette Switcher: SALS vs B&W Monochrome */}
          <button
            onClick={onToggleBwMode}
            title={bwMode ? 'Switch to SALS Official Brand Theme' : 'Switch to Black & White Monochrome'}
            className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-md border transition-all ${
              bwMode
                ? 'bg-white text-black border-white shadow-sm'
                : 'bg-[#E8391A]/20 text-[#E8391A] border-[#E8391A]/40 hover:bg-[#E8391A]/30'
            }`}
          >
            {bwMode ? <Contrast className="w-3.5 h-3.5" /> : <Flame className="w-3.5 h-3.5 text-[#E8391A]" />}
            <span>{bwMode ? 'B&W Mode' : 'SALS Theme'}</span>
          </button>

          <button
            onClick={onNewBlank}
            title="Clear and start new blank report"
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md border border-white/20 hover:bg-white/10 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">New Blank</span>
          </button>

          <button
            onClick={onLoadSample}
            title="Load sample report with OMEGA logistics data"
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md border border-white/20 hover:bg-white/10 transition-colors"
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Sample Data</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            title="Import report from JSON file"
            className="flex items-center gap-1 text-xs px-2 py-1.5 rounded-md border border-white/20 hover:bg-white/10 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Import</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={onExportJSON}
            title="Export full report as JSON"
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md border border-white/20 hover:bg-white/10 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>

          <button
            onClick={onExportCSV}
            title="Export full report as Excel-compatible CSV"
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md border border-white/20 hover:bg-white/10 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={onSaveToArchive}
            title="Save copy to internal report history archive"
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 font-medium transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* Primary Action Button - matches SALS CTA button */}
          <button
            onClick={onPrint}
            title="Print or Save as PDF"
            className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-md shadow transition-all active:scale-95 ${
              bwMode
                ? 'bg-white text-black hover:bg-slate-200'
                : 'bg-[#E8391A] hover:bg-[#C42E14] text-white'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className="p-1.5 rounded-md border border-white/20 hover:bg-white/10 transition-colors ml-0.5 text-white"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};

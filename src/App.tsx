/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SecurityDailyReport, SavedReportMeta } from './types/report';
import { createBlankReport, createSampleReport } from './constants/defaults';
import {
  loadCurrentDraft,
  saveCurrentDraft,
  loadHistory,
  saveToHistory,
  getReportFromHistory,
  deleteFromHistory,
} from './services/storage';
import {
  exportReportJSON,
  exportReportCSV,
  parseImportedJSON,
} from './services/export';
import { TopBar } from './components/TopBar';
import { ReportSheet } from './components/ReportSheet';
import { DashboardView } from './components/DashboardView';
import { ArchiveView } from './components/ArchiveView';
import { AIBriefingView } from './components/AIBriefingView';

export default function App() {
  const [report, setReport] = useState<SecurityDailyReport>(() => loadCurrentDraft());
  const [currentTab, setCurrentTab] = useState<'form' | 'dashboard' | 'archive' | 'ai'>('form');
  const [historyList, setHistoryList] = useState<SavedReportMeta[]>(() => loadHistory());
  const [statusText, setStatusText] = useState<string>('Draft autosaves in this browser');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return (
      localStorage.getItem('sdr-theme') === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });
  const [bwMode, setBwMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('sdr-bw-mode');
    return saved !== null ? saved === 'true' : false; // Default to official sals.com.my theme
  });

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync dark mode class with root html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sdr-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sdr-theme', 'light');
    }
  }, [darkMode]);

  // Sync black & white adaptation mode with root html element
  useEffect(() => {
    if (bwMode) {
      document.documentElement.classList.add('theme-bw');
      localStorage.setItem('sdr-bw-mode', 'true');
    } else {
      document.documentElement.classList.remove('theme-bw');
      localStorage.setItem('sdr-bw-mode', 'false');
    }
  }, [bwMode]);

  // Queue autosave whenever report state changes
  const handleReportChange = useCallback((updated: SecurityDailyReport) => {
    setReport(updated);
    setIsSaving(true);
    setStatusText('Saving changes...');

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      saveCurrentDraft(updated);
      setIsSaving(false);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setStatusText(`Draft saved at ${timeStr}`);
    }, 400);
  }, []);

  const handleManualSave = () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveCurrentDraft(report);
    setIsSaving(false);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setStatusText(`Draft saved at ${timeStr}`);
  };

  const handleNewBlank = () => {
    if (window.confirm('Clear all fields and start a new blank daily report?')) {
      const blank = createBlankReport();
      handleReportChange(blank);
      setCurrentTab('form');
    }
  };

  const handleLoadSample = () => {
    if (window.confirm('Load sample logistics security daily report? This will populate all sections with demonstration data.')) {
      const sample = createSampleReport();
      handleReportChange(sample);
      setCurrentTab('form');
    }
  };

  const handleExportJSON = () => {
    exportReportJSON(report);
  };

  const handleExportCSV = () => {
    exportReportCSV(report);
  };

  const handleImportJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || '');
        const imported = parseImportedJSON(text);
        handleReportChange(imported);
        setCurrentTab('form');
        alert('Report JSON imported successfully!');
      } catch (err: any) {
        alert(err.message || 'The selected file is not a valid Security Daily Report JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handlePrint = () => {
    // Switch to form view first so the sheet is active for print
    setCurrentTab('form');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handleSaveToArchive = () => {
    saveToHistory(report);
    setHistoryList(loadHistory());
    setStatusText(`Saved to archive history at ${new Date().toLocaleTimeString()}`);
    alert(`Report [${report.facility} - ${report.date} ${report.shift} Shift] saved to Archive.`);
  };

  const handleLoadFromArchive = (id: string) => {
    const loaded = getReportFromHistory(id);
    if (loaded) {
      handleReportChange(loaded);
      setCurrentTab('form');
    }
  };

  const handleDuplicateFromArchive = (id: string) => {
    const original = getReportFromHistory(id);
    if (original) {
      const d = new Date();
      const isoDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);
      const dayName = d.toLocaleDateString('en-GB', { weekday: 'long' });

      const duplicated: SecurityDailyReport = {
        ...original,
        id: `sdr-${Date.now()}`,
        date: isoDate,
        day: dayName,
        prepDate: isoDate,
        revDate: '',
        status: 'Draft',
        // keep post and guard assignments, reset specific incidents
        incident: createBlankReport().incident,
      };

      handleReportChange(duplicated);
      setCurrentTab('form');
      alert(`Report duplicated for today (${isoDate}). You can now adjust guard assignments and incidents.`);
    }
  };

  const handleDeleteFromArchive = (id: string) => {
    if (window.confirm('Delete this report from archive history?')) {
      deleteFromHistory(id);
      setHistoryList(loadHistory());
    }
  };

  const handleApplyHandover = (handoverText: string) => {
    handleReportChange({
      ...report,
      handover: handoverText,
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col font-sans transition-colors duration-200">
      {/* Top Application Bar */}
      <TopBar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        statusText={statusText}
        isSaving={isSaving}
        onSaveNow={handleManualSave}
        onNewBlank={handleNewBlank}
        onLoadSample={handleLoadSample}
        onExportJSON={handleExportJSON}
        onExportCSV={handleExportCSV}
        onImportJSON={handleImportJSON}
        onPrint={handlePrint}
        onSaveToArchive={handleSaveToArchive}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        bwMode={bwMode}
        onToggleBwMode={() => setBwMode(!bwMode)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {currentTab === 'form' && (
          <ReportSheet report={report} onChange={handleReportChange} />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            report={report}
            onGoToForm={() => setCurrentTab('form')}
            onPrint={handlePrint}
          />
        )}

        {currentTab === 'archive' && (
          <ArchiveView
            currentReport={report}
            historyList={historyList}
            onLoadReport={handleLoadFromArchive}
            onDuplicateReport={handleDuplicateFromArchive}
            onDeleteReport={handleDeleteFromArchive}
            onSaveCurrentToArchive={handleSaveToArchive}
            onLoadSample={handleLoadSample}
          />
        )}

        {currentTab === 'ai' && (
          <AIBriefingView
            report={report}
            onApplyHandover={handleApplyHandover}
            onGoToForm={() => setCurrentTab('form')}
          />
        )}
      </main>
    </div>
  );
}

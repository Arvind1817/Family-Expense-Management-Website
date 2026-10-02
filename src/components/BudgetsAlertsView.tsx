import React, { useState } from 'react';
import { CurrencySymbol, BudgetCategory, ScheduledBill, AlertTrigger } from '../types';
import { formatCurrency } from '../utils/format';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  PlusCircle,
  AlertTriangle,
  Lock,
  Edit2,
  Bell,
  BellRing,
  Download,
  CalendarCheck,
  PiggyBank,
  CheckCircle2,
  Check,
  Search,
  ArrowRight,
  Receipt
} from 'lucide-react';

interface BudgetsAlertsViewProps {
  currency: CurrencySymbol;
  categories: BudgetCategory[];
  bills: ScheduledBill[];
  alerts: AlertTrigger[];
  onOpenAlertSettings: () => void;
  onOpenNewCategory: () => void;
  onPayBill: (billId: string) => void;
  onDismissAlerts: () => void;
  onToggleCategoryAlert: (categoryId: string) => void;
  onAdjustCategoryCap: (categoryId: string, delta: number) => void;
}

export const BudgetsAlertsView: React.FC<BudgetsAlertsViewProps> = ({
  currency,
  categories,
  bills,
  alerts,
  onOpenAlertSettings,
  onOpenNewCategory,
  onPayBill,
  onDismissAlerts,
  onToggleCategoryAlert,
  onAdjustCategoryCap,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [rolloverActive, setRolloverActive] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('October 2024');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editLimitValue, setEditLimitValue] = useState<string>('');

  const months = ['August 2024', 'September 2024', 'October 2024', 'November 2024'];
  const currentMonthIndex = months.indexOf(selectedMonth);

  const handlePrevMonth = () => {
    if (currentMonthIndex > 0) setSelectedMonth(months[currentMonthIndex - 1]);
  };

  const handleNextMonth = () => {
    if (currentMonthIndex < months.length - 1) setSelectedMonth(months[currentMonthIndex + 1]);
  };

  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
  const totalBudget = 6000.00;
  const progressPct = (totalSpent / totalBudget) * 100;

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    cat.subtext.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleStartEdit = (cat: BudgetCategory) => {
    setEditingCategoryId(cat.id);
    setEditLimitValue(cat.limit.toString());
  };

  const handleSaveEdit = (catId: string) => {
    const val = parseFloat(editLimitValue);
    if (!isNaN(val) && val > 0) {
      const existing = categories.find((c) => c.id === catId);
      if (existing) {
        onAdjustCategoryCap(catId, val - existing.limit);
      }
    }
    setEditingCategoryId(null);
  };

  return (
    <div className="space-y-8">
      {/* SUB-HEADER TOOLBAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-headline tracking-tight">
              Monthly Budget Planning & Alert Rules
            </h1>
            <span className="bg-[#82f5c1]/30 text-[#00714e] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#00714e]/20">
              Active Cycle
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Automated thresholds, family balance controls, and real-time expense monitoring
          </p>
        </div>

        {/* Action Group & Date Navigator */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Navigator */}
          <div className="inline-flex items-center bg-white border border-slate-300 rounded-xl p-1 shadow-xs">
            <button
              onClick={handlePrevMonth}
              disabled={currentMonthIndex <= 0}
              className="p-1.5 hover:bg-slate-100 disabled:opacity-30 rounded-lg text-slate-600 transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#005c55]" />
              <span className="text-xs font-bold text-slate-900 font-headline">{selectedMonth}</span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">(12 days remaining)</span>
            </div>
            <button
              onClick={handleNextMonth}
              disabled={currentMonthIndex >= months.length - 1}
              className="p-1.5 hover:bg-slate-100 disabled:opacity-30 rounded-lg text-slate-600 transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenAlertSettings}
            className="inline-flex items-center gap-1.5 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <span>Alert Settings</span>
          </button>

          <button
            onClick={onOpenNewCategory}
            className="inline-flex items-center gap-1.5 bg-[#005c55] text-white hover:bg-[#004e48] px-4 py-2 rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Budget Category</span>
          </button>
        </div>
      </div>

      {/* 1. HIGH-LEVEL PROGRESS BANNER & METRICS */}
      <section className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full bg-[#005c55]/5 blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Bar Details */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                  Cumulative Monthly Spent
                </span>
                <div className="flex items-baseline gap-2.5 mt-1">
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-headline">
                    {formatCurrency(totalSpent, currency)}
                  </span>
                  <span className="text-xs text-slate-500">
                    spent of <strong className="text-slate-800 font-semibold">{formatCurrency(totalBudget, currency)} Total Family Budget</strong>
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-[#005c55] font-headline">{progressPct.toFixed(1)}%</span>
                <span className="block text-[11px] text-slate-500">Target Pace: 61.3%</span>
              </div>
            </div>

            {/* Segmented Progress Bar */}
            <div className="relative w-full py-2">
              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex relative">
                <div
                  className="bg-[#005c55] h-full rounded-full transition-all duration-500 relative"
                  style={{ width: `${Math.min(100, progressPct)}%` }}
                ></div>
              </div>

              {/* Target Spend Pace Marker (61.3% for day 19/31) */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-slate-600 pointer-events-none z-10"
                style={{ left: '61.3%' }}
              >
                <span className="absolute -top-5 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap">
                  Expected (61%)
                </span>
              </div>

              {/* 80% Early Alert Line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-400 border-dashed pointer-events-none z-10"
                style={{ left: '80%' }}
              >
                <span className="absolute -bottom-5 -translate-x-1/2 text-red-600 text-[10px] font-bold tracking-wider">
                  80% WARN
                </span>
              </div>
            </div>

            {/* Sub-indicators row */}
            <div className="flex flex-wrap items-center justify-between text-xs pt-1 text-slate-600 gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span className="font-semibold text-slate-900">Pace: +10.1% higher than baseline</span>
                <span className="text-slate-400">(Driven primarily by Groceries & Dining)</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span>Remaining Cap: <strong className="text-slate-900 font-bold">{formatCurrency(totalBudget - totalSpent, currency)}</strong></span>
                <span>Daily Allowance: <strong className="text-slate-900 font-bold">~{formatCurrency((totalBudget - totalSpent) / 12, currency)}/day</strong></span>
              </div>
            </div>
          </div>

          {/* Metric Side Stats */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3 lg:border-l lg:border-slate-200 lg:pl-6">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Safe Projected Spend</span>
              <div className="flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-base font-bold text-slate-900 font-headline font-mono">
                  {formatCurrency(5820, currency)}
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 font-bold mt-1">-{currency}180 under ceiling</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Active Alert Rules</span>
              <div className="flex items-center gap-1.5 mt-1">
                <BellRing className="w-4 h-4 text-indigo-600" />
                <span className="text-base font-bold text-slate-900 font-headline">6 Configured</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">2 Triggered today</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ACTIVE URGENT ALERTS & THRESHOLD WARNINGS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[22px]">warning</span>
            <h2 className="text-lg font-bold text-slate-900 font-headline">
              Urgent Alerts & Action Triggers
            </h2>
            <span className="bg-[#ffdad6] text-[#93000a] text-[11px] font-bold px-2 py-0.5 rounded-full">
              {alerts.length} Action Items
            </span>
          </div>
          <button
            onClick={onDismissAlerts}
            className="text-xs font-semibold text-[#005c55] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Dismiss Non-Critical</span>
            <Check className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {alerts.map((al) => {
            const isWarning = al.type === 'warning';
            const isCritical = al.type === 'critical';
            const isScheduled = al.type === 'scheduled';

            return (
              <div
                key={al.id}
                className={`bg-white rounded-xl p-4 shadow-xs flex flex-col justify-between transition-all hover:shadow-md border border-[#e2e8f0] ${
                  isCritical
                    ? 'border-l-4 border-l-[#ba1a1a]'
                    : isWarning
                    ? 'border-l-4 border-l-amber-500'
                    : 'border-l-4 border-l-indigo-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isCritical
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : isWarning
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isCritical ? 'bg-rose-600' : isWarning ? 'bg-amber-500' : 'bg-indigo-600'
                        }`}
                      ></span>
                      <span>
                        {isCritical
                          ? 'Critical · Limit Exceeded'
                          : isWarning
                          ? 'Warning · Threshold 80%'
                          : 'Scheduled Payment · Due in 3 days'}
                      </span>
                    </span>
                    <span className="text-[11px] text-slate-400">{al.triggeredTime}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm font-headline mb-1.5">{al.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>{al.description}</strong> {al.details}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      if (isWarning) onAdjustCategoryCap('groceries', 200);
                      if (isCritical) alert('Reallocated $60 from Entertainment reserve buffer.');
                      if (isScheduled) alert('Opening PDF statement for ConEdison Electric & Gas.');
                    }}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors cursor-pointer text-center"
                  >
                    {al.actionSecondaryText}
                  </button>
                  <button
                    onClick={() => {
                      if (isWarning) onAdjustCategoryCap('groceries', 150);
                      if (isCritical) alert('Card temporarily locked for non-essential dining.');
                      if (isScheduled) alert('ConEdison auto-pay confirmed active.');
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer text-center ${
                      isCritical
                        ? 'bg-[#ba1a1a] hover:bg-red-800 text-white'
                        : isScheduled
                        ? 'bg-slate-100 text-slate-800 font-semibold'
                        : 'bg-[#005c55] hover:bg-[#004e48] text-white'
                    }`}
                  >
                    {al.actionPrimaryText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= MAIN TWO COLUMN WORKBENCH ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= 3. CATEGORY BUDGET MANAGER TABLE (8 Cols) ================= */}
        <section className="lg:col-span-8 bg-white border border-[#e2e8f0] rounded-2xl shadow-xs overflow-hidden">
          {/* Table Header & Filter Bar */}
          <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-headline">Category Envelopes & Limits</h2>
              <p className="text-xs text-slate-500">Live tracking across 8 dedicated household categories with 80% safety alerts</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter category..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="h-9 pl-8 pr-3 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#005c55] focus:border-[#005c55]"
                />
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-slate-400" />
              </div>
              <button
                onClick={onOpenAlertSettings}
                className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
                title="Display Options"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category Ledger Rows */}
          <div className="divide-y divide-slate-100">
            {filteredCategories.map((cat) => {
              const pct = (cat.spent / cat.limit) * 100;
              const isOver = pct >= 100;
              const isCaution = pct >= 80 && pct < 100;
              const remaining = cat.limit - cat.spent;
              const isEditing = editingCategoryId === cat.id;

              return (
                <div
                  key={cat.id}
                  className={`p-4 transition-colors ${
                    isOver ? 'bg-red-50/20' : isCaution ? 'bg-amber-50/20' : 'hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-[210px]">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isOver
                            ? 'bg-rose-100 text-rose-800'
                            : isCaution
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-[#f2f3ff] text-[#005c55]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">{cat.name}</span>
                          {cat.isLocked && (
                            <span title="Fixed Contract (Locked)">
                              <Lock className="w-3.5 h-3.5 text-slate-400" />
                            </span>
                          )}
                          {isOver && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-600 text-white">
                              +{currency}{(cat.spent - cat.limit).toFixed(0)} Over
                            </span>
                          )}
                          {isCaution && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                              {cat.percentage.toFixed(1)}%
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500">{cat.subtext}</span>
                      </div>
                    </div>

                    {/* Progress Bar & Numeric Data */}
                    <div className="flex-1 max-w-xs mx-4 hidden sm:block">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className={`font-semibold font-mono ${isOver ? 'text-rose-700 font-bold' : 'text-slate-700'}`}>
                          {formatCurrency(cat.spent, currency)} / {formatCurrency(cat.limit, currency)}
                        </span>
                        <span className={isOver ? 'text-rose-700 font-bold' : isCaution ? 'text-amber-700 font-bold' : 'text-slate-500'}>
                          {isOver ? `${pct.toFixed(0)}%` : `${formatCurrency(Math.max(0, remaining), currency)} left`}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isOver ? 'bg-[#ba1a1a]' : isCaution ? 'bg-[#f59e0b]' : 'bg-[#006c4a]'
                          }`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        ></div>
                        <div className="absolute inset-y-0 w-0.5 bg-red-400/80 left-[80%]"></div>
                      </div>
                    </div>

                    {/* Remaining & Actions */}
                    <div className="text-right min-w-[95px]">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editLimitValue}
                            onChange={(e) => setEditLimitValue(e.target.value)}
                            className="w-16 h-7 text-xs border border-[#005c55] rounded px-1 text-right font-mono"
                          />
                          <button
                            onClick={() => handleSaveEdit(cat.id)}
                            className="p-1 bg-[#005c55] text-white rounded cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span
                            className={`text-xs font-bold block font-mono ${
                              isOver ? 'text-rose-700' : isCaution ? 'text-amber-800' : 'text-slate-900'
                            }`}
                          >
                            {remaining < 0 ? `-${formatCurrency(Math.abs(remaining), currency)}` : formatCurrency(remaining, currency)} left
                          </span>
                          <span className={`text-[10px] ${isOver ? 'text-rose-600' : isCaution ? 'text-amber-700' : 'text-slate-400'}`}>
                            {isOver ? 'Exceeded' : isCaution ? 'Pacing over' : 'On Track'}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1 pl-2">
                      <button
                        onClick={() => handleStartEdit(cat)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                        title="Edit Budget Cap"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onToggleCategoryAlert(cat.id)}
                        className={`p-1.5 rounded cursor-pointer transition-colors ${
                          cat.alertActive ? 'text-[#005c55]' : 'text-slate-300 hover:text-slate-500'
                        }`}
                        title={cat.alertActive ? 'Threshold Alert Active' : 'Enable Alert'}
                      >
                        <Bell className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table Footer Summary */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006c4a]"></span>
                <span>&lt;80% Normal</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>
                <span>80%-99% Caution</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]"></span>
                <span>≥100% Exceeded</span>
              </span>
            </div>
            <button
              onClick={() => alert('Exporting Envelope Ledger (.CSV) with all monthly allocations.')}
              className="text-[#005c55] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Envelope Ledger (.CSV)</span>
            </button>
          </div>
        </section>

        {/* ================= 4. RECURRING BILL CALENDAR & ROLLOVER SIDEBAR (4 Cols) ================= */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Scheduled Bills Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-[#005c55]" />
                <h3 className="text-sm font-bold text-slate-900 font-headline">Upcoming Scheduled Bills</h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">Oct 19 - 31</span>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Bills due prior to monthly close. Assigned household payer and automated debit status.
            </p>

            <div className="space-y-3">
              {bills.map((bill) => (
                <div
                  key={bill.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white text-[#005c55] border border-slate-200 flex items-center justify-center font-bold text-xs font-mono shadow-2xs">
                      {bill.day}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">{bill.title}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500">
                        <span>{bill.isAutoPay ? 'Auto-Pay' : 'Manual Check'}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="font-semibold text-slate-700">{bill.assignedPayer}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 font-mono block">
                      {formatCurrency(bill.amount, currency)}
                    </span>
                    {bill.isPaid ? (
                      <span className="text-[10px] text-emerald-700 font-bold">Paid</span>
                    ) : bill.isAutoPay ? (
                      <span className="text-[10px] text-emerald-700 font-medium">{bill.statusNote}</span>
                    ) : (
                      <button
                        onClick={() => onPayBill(bill.id)}
                        className="text-[11px] text-[#005c55] hover:underline font-bold cursor-pointer"
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => alert('Connect new recurring subscription or utility account via Plaid Bill Pay.')}
              className="w-full mt-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>+ Link New Recurring Bill</span>
            </button>
          </div>

          {/* Budget Rollover & Family Savings Stash */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <PiggyBank className="w-5 h-5 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900 font-headline">Unspent Rollover Vault</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Automatically sweep remaining budget surplus at end-of-month into shared family savings destinations.
            </p>

            {/* Setting Switch Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Summer Vacation Fund</span>
                  <span className="text-[11px] text-emerald-700 font-semibold">Active: +{currency}340.00 swept last month</span>
                </div>
                {/* Styled Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rolloverActive}
                    onChange={(e) => setRolloverActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#005c55]"></div>
                </label>
              </div>

              {/* Target Allocation Info */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">Fund Target: {formatCurrency(4500, currency)}</span>
                <span className="text-slate-900 font-bold font-mono">
                  {formatCurrency(3120, currency)} reached (69%)
                </span>
              </div>
            </div>

            <div className="mt-4 pt-2 flex items-center justify-between text-[11px]">
              <button
                onClick={() => alert('Change destination vault: e.g. College 529, Emergency Stash, Holiday Trip.')}
                className="text-[#005c55] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Change Rollover Target</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <span className="text-slate-400">Auto-runs Oct 31, 11:59PM</span>
            </div>
          </div>

          {/* Household Rule Notification Preferences Mini-card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 font-headline uppercase tracking-wider">
              Threshold Safeguards
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Push alerts to Sarah and Mark at <strong>80% category limit</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Temporary hold on non-essential joint debit transactions when cap is passed</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Daily balance briefing sent via SMS every morning at 8:00 AM</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

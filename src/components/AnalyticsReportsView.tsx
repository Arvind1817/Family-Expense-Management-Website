import React, { useState } from 'react';
import { CurrencySymbol, FamilyMember, Transaction } from '../types';
import { formatCurrency, formatSignedCurrency } from '../utils/format';
import {
  Calendar,
  Users,
  Layers,
  Download,
  Search,
  SlidersHorizontal,
  Table as TableIcon,
  Receipt,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  ShoppingBag,
  Utensils,
  PiggyBank,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AnalyticsReportsViewProps {
  currency: CurrencySymbol;
  members: FamilyMember[];
  transactions: Transaction[];
  onOpenExportModal: () => void;
  onOpenReceipt: (tx: Transaction) => void;
}

export const AnalyticsReportsView: React.FC<AnalyticsReportsViewProps> = ({
  currency,
  members,
  transactions,
  onOpenExportModal,
  onOpenReceipt,
}) => {
  const [dateRange, setDateRange] = useState('October 2024 vs September 2024');
  const [memberFilter, setMemberFilter] = useState('all');
  const [comparisonMode, setComparisonMode] = useState<'last_month' | 'three_month_avg'>('last_month');
  const [tableSearch, setTableSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter transactions
  const filteredLedger = transactions.filter((tx) => {
    const matchesSearch =
      tx.merchant.toLowerCase().includes(tableSearch.toLowerCase()) ||
      tx.description.toLowerCase().includes(tableSearch.toLowerCase()) ||
      tx.category.toLowerCase().includes(tableSearch.toLowerCase());
    const matchesMember = memberFilter === 'all' || tx.paidById === memberFilter;
    return matchesSearch && matchesMember;
  });

  const pageSize = 5;
  const paginatedRows = filteredLedger.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredLedger.length / pageSize) || 1;

  return (
    <div className="space-y-6">
      {/* 1. Header & Filters Section */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                Consolidated Household View
              </span>
              <span className="text-slate-400 text-xs">Updated 12 mins ago</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-headline tracking-tight">
              Household Spending Analytics & Monthly Reports
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Analyze domestic cash outflows, track family spending shifts, and generate verified ledger summaries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenExportModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#005c55] text-white hover:bg-[#004e48] text-xs font-semibold shadow-xs transition-all active:scale-[0.99] cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Report (.xlsx / .pdf)</span>
            </button>
          </div>
        </div>

        {/* Controls & Deep Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Date Range Selector */}
            <div className="relative inline-flex items-center">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="pl-9 pr-8 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#005c55] cursor-pointer"
              >
                <option>October 2024 vs September 2024</option>
                <option>September 2024 vs August 2024</option>
                <option>Q3 2024 Consolidated (Jul-Sep)</option>
                <option>Year-to-Date (Jan - Oct 2024)</option>
                <option>Custom Date Window...</option>
              </select>
            </div>

            {/* Member Filter */}
            <div className="relative inline-flex items-center">
              <Users className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <select
                value={memberFilter}
                onChange={(e) => {
                  setMemberFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-8 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#005c55] cursor-pointer"
              >
                <option value="all">All Family Members (4)</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.alias})
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter Multi-Select Pill */}
            <button
              onClick={() => alert('Filter toggles: Groceries, Housing, Dining, Utilities, Kids, Transport, Health')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-[#005c55]" />
              <span>Categories: <strong className="text-[#005c55]">All (9 Active)</strong></span>
            </button>
          </div>

          {/* Comparison Mode Segmented Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setComparisonMode('last_month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                comparisonMode === 'last_month'
                  ? 'bg-white text-[#005c55] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Compare with Last Month
            </button>
            <button
              type="button"
              onClick={() => setComparisonMode('three_month_avg')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                comparisonMode === 'three_month_avg'
                  ? 'bg-white text-[#005c55] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Compare with 3-Month Average
            </button>
          </div>
        </div>
      </div>

      {/* 2. Executive Monthly Report Summary Cards (Bento Metric Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Net Monthly Outflow */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Net Monthly Outflow</span>
            <span className="w-8 h-8 rounded-lg bg-[#f2f3ff] flex items-center justify-center text-[#005c55]">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-headline font-mono">
              {formatCurrency(4285.50, currency)}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800">
                <TrendingDown className="w-3.5 h-3.5 mr-0.5 text-emerald-600" />
                -4.2%
              </span>
              <span className="text-slate-500">lower than Sept 28 MTD</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
            <span>Target Cap: {formatCurrency(5500, currency)}</span>
            <span className="text-[#006c4a] font-bold">Under by {formatCurrency(1214.50, currency)}</span>
          </div>
        </div>

        {/* Card 2: Top Spending Category */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Top Spending Category</span>
            <span className="w-8 h-8 rounded-lg bg-[#f2f3ff] flex items-center justify-center text-[#3b3bc9]">
              <ShoppingBag className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-lg font-bold text-slate-900 font-headline">Housing & Groceries</div>
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              <span className="font-bold text-[#005c55] font-mono">{formatCurrency(3080, currency)}</span>
              <span className="text-slate-500">combined (71.8% of total)</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#005c55] h-1.5 rounded-full" style={{ width: '71.8%' }}></div>
            </div>
          </div>
        </div>

        {/* Card 3: Biggest Expense Spike */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Biggest Expense Spike</span>
            <span className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-700">
              <Utensils className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-lg font-bold text-slate-900 font-headline">Dining Out</div>
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full font-bold bg-rose-100 text-rose-800">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                +34%
              </span>
              <span className="text-slate-500">vs last month ({currency}620 vs {currency}462)</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
            <span className="text-slate-400">Trigger: 3 weekend birthdays</span>
            <span className="text-rose-700 font-bold">Exceeded plan</span>
          </div>
        </div>

        {/* Card 4: Household Savings Rate */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Household Savings Rate</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <PiggyBank className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-headline">18.5%</div>
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                +2.1%
              </span>
              <span className="text-slate-500">allocated to reserves</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
            <span>Stashed: {formatCurrency(1420, currency)}</span>
            <span className="text-[#006c4a] font-bold">Ahead of Goal</span>
          </div>
        </div>
      </div>

      {/* 3. Analytics Visualizations (Two-Column Deep Dive) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: Month-over-Month Category Comparison (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-headline">Category Velocity & MoM Shift</h2>
                <p className="text-xs text-slate-500">September 2024 vs October 2024 (Grouped by Domestic Budget Center)</p>
              </div>
              {/* Chart Legend */}
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-slate-300"></span>
                  <span className="text-slate-500">September ({currency}4,472)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#005c55]"></span>
                  <span className="text-slate-900 font-bold">October ({currency}4,285)</span>
                </div>
              </div>
            </div>

            {/* Bar Chart Visualization Stack */}
            <div className="mt-6 space-y-5">
              {/* Category: Groceries */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#005c55]">shopping_basket</span>
                    <span className="font-semibold text-slate-900">Groceries & Market</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400">{currency}1,180</span> vs <strong className="text-[#005c55] font-bold">{currency}1,120</strong>
                    <span className="text-[#006c4a] font-bold ml-1.5">(-5.1%)</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 rounded-full h-2.5 flex overflow-hidden">
                    <div className="bg-slate-300 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 flex overflow-hidden">
                    <div className="bg-[#005c55] h-2.5 rounded-full" style={{ width: '74%' }}></div>
                  </div>
                </div>
              </div>

              {/* Category: Utilities */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#3b3bc9]">bolt</span>
                    <span className="font-semibold text-slate-900">Utilities & Home Tech</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400">{currency}480</span> vs <strong className="text-[#005c55] font-bold">{currency}410</strong>
                    <span className="text-[#006c4a] font-bold ml-1.5">(-14.6%)</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 rounded-full h-2.5 flex overflow-hidden">
                    <div className="bg-slate-300 h-2.5 rounded-full" style={{ width: '32%' }}></div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 flex overflow-hidden">
                    <div className="bg-[#005c55] h-2.5 rounded-full" style={{ width: '27%' }}></div>
                  </div>
                </div>
              </div>

              {/* Category: Transport */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#005c55]">directions_car</span>
                    <span className="font-semibold text-slate-900">Transport, Gas & Transit</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400">{currency}390</span> vs <strong className="text-[#005c55] font-bold">{currency}385</strong>
                    <span className="text-slate-400 ml-1.5">(-1.2%)</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 rounded-full h-2.5 flex overflow-hidden">
                    <div className="bg-slate-300 h-2.5 rounded-full" style={{ width: '26%' }}></div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 flex overflow-hidden">
                    <div className="bg-[#005c55] h-2.5 rounded-full" style={{ width: '25.5%' }}></div>
                  </div>
                </div>
              </div>

              {/* Category: Dining & Leisure */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">restaurant</span>
                    <span className="font-semibold text-slate-900">Dining Out & Entertainment</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400">{currency}462</span> vs <strong className="text-[#ba1a1a] font-bold">{currency}620</strong>
                    <span className="text-rose-700 font-bold ml-1.5">(+34.2%)</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 rounded-full h-2.5 flex overflow-hidden">
                    <div className="bg-slate-300 h-2.5 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 flex overflow-hidden">
                    <div className="bg-[#ba1a1a] h-2.5 rounded-full" style={{ width: '41%' }}></div>
                  </div>
                </div>
              </div>

              {/* Category: Education */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#006c4a]">school</span>
                    <span className="font-semibold text-slate-900">Education & Subscriptions</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400">{currency}580</span> vs <strong className="text-[#005c55] font-bold">{currency}490</strong>
                    <span className="text-[#006c4a] font-bold ml-1.5">(-15.5%)</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 rounded-full h-2.5 flex overflow-hidden">
                    <div className="bg-slate-300 h-2.5 rounded-full" style={{ width: '38%' }}></div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 flex overflow-hidden">
                    <div className="bg-[#005c55] h-2.5 rounded-full" style={{ width: '32%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Overall variance: -{currency}186.50 conserved compared to previous month</span>
            <button
              onClick={() => alert('Viewing detailed subcategory pivot matrix with individual item variance.')}
              className="text-[#005c55] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Explore full subcategory breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Chart: Daily Cumulative Spending Velocity (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-headline">Daily Spending Velocity</h2>
                <p className="text-xs text-slate-500">Cumulative monthly burn pace vs safety threshold</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                On Safe Track
              </span>
            </div>

            {/* Synthetic Cumulative Vector Graph Canvas */}
            <div className="mt-5 relative h-48 w-full border-b border-l border-slate-300 flex items-end">
              {/* Background Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                <div className="border-b border-dashed border-slate-200 w-full flex justify-end pr-2 text-[10px] text-slate-400">
                  {currency}5,500 Max
                </div>
                <div className="border-b border-dashed border-slate-200 w-full flex justify-end pr-2 text-[10px] text-slate-400">
                  {currency}4,000
                </div>
                <div className="border-b border-dashed border-slate-200 w-full flex justify-end pr-2 text-[10px] text-slate-400">
                  {currency}2,000
                </div>
                <div className="w-full flex justify-end pr-2 text-[10px] text-slate-400">{currency}0</div>
              </div>

              {/* SVG Visual Curve */}
              <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 300 150">
                {/* Ceiling Target Line (Dashed Red) */}
                <line x1="0" y1="150" x2="300" y2="25" stroke="#ba1a1a" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.6" />
                {/* Shaded Cumulative Area */}
                <path d="M0,150 Q75,135 150,90 T240,48 L240,150 Z" fill="url(#gradientPrimary)" opacity="0.15" />
                {/* Actual Cumulative Line */}
                <path d="M0,150 Q75,135 150,90 T240,48" stroke="#005c55" strokeWidth="3" strokeLinecap="round" />
                {/* Projected Line to End of Month */}
                <path d="M240,48 Q270,36 300,28" stroke="#005c55" strokeWidth="2" strokeDasharray="3 3" />
                {/* Current Day Marker (Day 28) */}
                <circle cx="240" cy="48" r="5" fill="#005c55" stroke="#ffffff" strokeWidth="2" />
                <defs>
                  <linearGradient id="gradientPrimary" x1="0" y1="0" x2="0" y2="150" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#005c55" />
                    <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Velocity Indicators */}
            <div className="mt-4 grid grid-cols-2 gap-3 pt-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Month-to-Date Burn</span>
                <span className="text-base font-bold text-slate-900 font-headline font-mono">
                  {formatCurrency(4285.50, currency)}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Day 28 of 31</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Projected Landing</span>
                <span className="text-base font-bold text-[#005c55] font-headline font-mono">
                  {formatCurrency(4650, currency)}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                  {currency}850 buffer remaining
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#005c55]"></span>
              <span>Current Pace: {currency}153/day avg</span>
            </div>
            <span>Ceiling limit: {formatCurrency(5500, currency)}</span>
          </div>
        </div>
      </div>

      {/* 4. Detailed Expense Audit & Breakdown Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xs overflow-hidden">
        {/* Table Header & Controls */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-headline">Household Transaction Ledger & Audit</h2>
            <p className="text-xs text-slate-500">Complete granular ledger for October 2024 with family member attributions and receipts.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search merchant, category or tag..."
                value={tableSearch}
                onChange={(e) => {
                  setTableSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-4 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#005c55] w-64"
              />
            </div>
            <button
              onClick={() => alert('Configuring columns: Tax, Split Status, Method, Timestamps.')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Columns</span>
            </button>
            <button
              onClick={onOpenExportModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#f2f3ff] text-[#005c55] font-semibold text-xs hover:bg-[#eaedff] cursor-pointer"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Quick Export</span>
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold text-slate-500">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Item / Merchant</th>
                <th className="py-3 px-4">Spender</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-center">Tax Flag</th>
                <th className="py-3 px-4">Split Type</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-3 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
              {paginatedRows.map((tx) => {
                const initial = tx.paidBy ? tx.paidBy.charAt(0) : 'S';

                return (
                  <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-medium font-mono">
                      {tx.date}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                        <span className="material-symbols-outlined text-[14px]">{tx.categoryIcon}</span>
                        <span>{tx.category}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <span>{tx.merchant}</span>
                      <span className="block font-normal text-slate-400 text-[11px]">{tx.description}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full font-bold text-[10px] flex items-center justify-center ${
                            tx.paidById === 'sarah'
                              ? 'bg-teal-100 text-teal-800'
                              : tx.paidById === 'mark'
                              ? 'bg-emerald-100 text-emerald-800'
                              : tx.paidById === 'alex'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {initial}
                        </div>
                        <span className="font-medium text-slate-800">{tx.paidBy}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                      {tx.paymentMethod}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {tx.taxFlag ? (
                        <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          TAX
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600 font-medium">
                        {tx.splitStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 whitespace-nowrap font-mono">
                      {formatSignedCurrency(tx.amount, tx.isIncome, currency)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {tx.hasReceipt ? (
                        <button
                          onClick={() => onOpenReceipt(tx)}
                          className="p-1 rounded text-[#005c55] hover:bg-slate-100 cursor-pointer"
                          title="View scanned receipt"
                        >
                          <Receipt className="w-4 h-4 text-emerald-700 inline" />
                        </button>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination & Ledger Summary Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-900">{Math.min(filteredLedger.length, (currentPage - 1) * pageSize + 1)} - {Math.min(filteredLedger.length, currentPage * pageSize)}</strong> of{' '}
            <strong className="text-slate-900">{filteredLedger.length}</strong> household expenses logged
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-md border border-slate-300 hover:bg-white disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 rounded-md text-xs font-semibold flex items-center justify-center cursor-pointer ${
                  currentPage === i + 1
                    ? 'bg-[#005c55] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-md border border-slate-300 hover:bg-white disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

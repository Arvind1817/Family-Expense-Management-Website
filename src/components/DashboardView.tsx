import React, { useState } from 'react';
import { CurrencySymbol, FamilyMember, BudgetCategory, Transaction } from '../types';
import { formatCurrency, formatSignedCurrency } from '../utils/format';
import {
  AlertTriangle,
  X,
  Calendar,
  Shield,
  Umbrella,
  Receipt,
  Camera,
  CheckCircle2,
  ArrowRight,
  Search,
  Filter,
  Check
} from 'lucide-react';

interface DashboardViewProps {
  currency: CurrencySymbol;
  members: FamilyMember[];
  categories: BudgetCategory[];
  transactions: Transaction[];
  onOpenAddExpense: () => void;
  onOpenReceipt: (tx: Transaction) => void;
  onNavigateTab: (tab: string) => void;
  onOpenTransferModal: (memberId: string) => void;
  onRecordQuickExpense: (tx: Partial<Transaction>) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currency,
  members,
  categories,
  transactions,
  onOpenAddExpense,
  onOpenReceipt,
  onNavigateTab,
  onOpenTransferModal,
  onRecordQuickExpense,
}) => {
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [quickAmount, setQuickAmount] = useState('');
  const [quickCategory, setQuickCategory] = useState('groceries');
  const [quickPayer, setQuickPayer] = useState('sarah');
  const [quickSplit, setQuickSplit] = useState<'Shared' | '50/50' | 'Custom'>('Shared');
  const [quickSuccess, setQuickSuccess] = useState(false);

  // Filters for recent activity table
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMemberFilter, setSelectedMemberFilter] = useState('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);

  // Calculate live KPI metrics
  const totalSpend = transactions
    .filter((t) => !t.isIncome)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalBudget = 6000.00;
  const remainingSafeToSpend = Math.max(0, totalBudget - totalSpend);
  const safeDailyAllowance = remainingSafeToSpend / 12; // 12 days left in billing cycle
  const spendPercentage = Math.min(100, (totalSpend / totalBudget) * 100);

  // Quick Expense Submit
  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(quickAmount);
    if (isNaN(parsed) || parsed <= 0) return;

    const memberObj = members.find((m) => m.id === quickPayer) || members[0];
    const catObj = categories.find((c) => c.id === quickCategory) || categories[0];

    onRecordQuickExpense({
      merchant: catObj.name === 'Groceries & Household' ? "Trader Joe's" : catObj.name,
      description: `${catObj.name} expense recorded`,
      amount: parsed,
      paidBy: memberObj.name,
      paidById: memberObj.id,
      category: catObj.name.split(' ')[0],
      categoryIcon: catObj.icon,
      splitStatus: quickSplit === 'Shared' ? 'Shared 100%' : quickSplit === '50/50' ? 'Split 50/50' : 'Custom Split',
      splitType: quickSplit === '50/50' ? 'joint_50_50' : 'full_pool',
      hasReceipt: true,
      paymentMethod: `${memberObj.cardName} ••${memberObj.cardLast4}`,
    });

    setQuickAmount('');
    setQuickSuccess(true);
    setTimeout(() => setQuickSuccess(false), 2000);
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMember =
      selectedMemberFilter === 'all' || tx.paidById === selectedMemberFilter;
    const matchesCategory =
      selectedCategoryFilter === 'all' ||
      tx.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase());
    return matchesSearch && matchesMember && matchesCategory;
  });

  const pageSize = 5;
  const paginatedTransactions = filteredTransactions.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1;

  return (
    <div className="space-y-6">
      {/* Active Spending Alert Banner */}
      {!alertDismissed && (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-start sm:items-center gap-3">
            <span className="p-2 rounded-lg bg-[#ffdad6] text-[#93000a] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-[#ba1a1a]" />
            </span>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#ba1a1a] uppercase tracking-wider">
                  Attention Required
                </span>
                <span className="text-xs text-slate-300">•</span>
                <span className="text-xs text-slate-500">Joint Household Account</span>
              </div>
              <p className="text-sm text-slate-800">
                <strong className="font-semibold text-slate-900">Notice:</strong> Groceries has reached{' '}
                <span className="text-[#ba1a1a] font-bold">86%</span> of its monthly cap. Electricity bill due in 3 days (
                <span className="font-semibold">{formatCurrency(185, currency)}</span>).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={() => onNavigateTab('budgets')}
              className="px-3.5 py-1.5 bg-[#eaedff] text-slate-800 text-xs font-semibold rounded-lg hover:bg-[#dae2fd] transition-colors cursor-pointer"
            >
              Review Bill
            </button>
            <button
              onClick={() => setAlertDismissed(true)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
              title="Dismiss Alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 1. Top KPI Summary Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Total Spend & Monthly Budget */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-xs space-y-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-500 block">Total Household Spend (Oct)</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-headline">
                  {formatCurrency(totalSpend, currency)}
                </span>
                <span className="text-xs text-slate-400">/ {formatCurrency(totalBudget, currency)}</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#006c4a] flex items-center gap-1 border border-emerald-200">
              <Calendar className="w-3.5 h-3.5" />
              <span>12 days left</span>
            </span>
          </div>

          {/* Budget Track Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500">
              <span>{spendPercentage.toFixed(1)}% Spent</span>
              <span className="font-semibold text-emerald-700">On Track</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#005c55] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, spendPercentage)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 2: Safe-to-Spend */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-xs space-y-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-500 block">Remaining Safe-to-Spend</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-emerald-700 font-headline">
                  {formatCurrency(remainingSafeToSpend, currency)}
                </span>
              </div>
            </div>
            <span className="w-9 h-9 rounded-xl bg-[#f2f3ff] text-[#005c55] flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Daily safe allowance:</span>
            <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
              {formatCurrency(safeDailyAllowance, currency)} / day
            </span>
          </div>
        </div>

        {/* Card 3: Family Savings Goal */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-xs space-y-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-500 block">Shared Savings Goal</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold text-[#3b3bc9] font-headline">
                  {formatCurrency(1250, currency)}
                </span>
                <span className="text-xs text-slate-400">/ {formatCurrency(2000, currency)}</span>
              </div>
            </div>
            <span className="w-9 h-9 rounded-xl bg-[#e1e0ff] text-[#3b3bc9] flex items-center justify-center">
              <Umbrella className="w-5 h-5" />
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500">
              <span className="font-medium text-slate-800">Summer Vacation Fund</span>
              <span className="font-semibold text-[#3b3bc9]">62.5% achieved</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3b3bc9] rounded-full transition-all duration-500"
                style={{ width: '62.5%' }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick Add Expense Floating / Docked Section */}
      <section className="bg-white border-2 border-[#005c55]/20 rounded-2xl p-5 shadow-sm relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#005c55]" />
            <h2 className="text-base font-bold text-slate-900 font-headline">Quick Add Expense</h2>
          </div>
          <div className="flex items-center gap-2">
            {quickSuccess && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1 border border-emerald-200">
                <Check className="w-3.5 h-3.5" />
                <span>Recorded!</span>
              </span>
            )}
            <span className="text-xs text-slate-500">Instant household ledger synchronization</span>
          </div>
        </div>

        <form onSubmit={handleQuickSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Amount Input */}
          <div className="md:col-span-2 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-bold text-sm">
              {currency}
            </span>
            <input
              type="number"
              step="0.01"
              required
              value={quickAmount}
              onChange={(e) => setQuickAmount(e.target.value)}
              placeholder="0.00"
              className="w-full h-11 pl-7 pr-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#005c55]/20 focus:border-[#005c55]"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-2">
            <select
              value={quickCategory}
              onChange={(e) => setQuickCategory(e.target.value)}
              className="w-full h-11 px-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#005c55]/20 focus:border-[#005c55]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name.split('&')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Paid By Member Selector */}
          <div className="md:col-span-3">
            <select
              value={quickPayer}
              onChange={(e) => setQuickPayer(e.target.value)}
              className="w-full h-11 px-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#005c55]/20 focus:border-[#005c55]"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.alias}) - {m.cardName}
                </option>
              ))}
            </select>
          </div>

          {/* Split Toggle Buttons */}
          <div className="md:col-span-2 flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(['Shared', '50/50', 'Custom'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setQuickSplit(mode)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg text-center transition-colors cursor-pointer ${
                  quickSplit === mode ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Receipt Camera Button */}
          <div className="md:col-span-1 flex justify-center">
            <button
              type="button"
              onClick={onOpenAddExpense}
              className="h-11 w-11 flex items-center justify-center border border-dashed border-slate-300 hover:border-[#005c55] text-slate-500 hover:text-[#005c55] rounded-xl transition-colors cursor-pointer"
              title="Open full expense drawer with receipt attachment"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>

          {/* Record Expense Submit Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full h-11 bg-[#005c55] hover:bg-[#004e48] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.99] transition-all shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Record Expense</span>
            </button>
          </div>
        </form>
      </section>

      {/* 3. Mid Section (2-Column Data Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Spending by Category (7 Cols) */}
        <section className="lg:col-span-7 bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-headline">Spending by Category</h2>
              <p className="text-xs text-slate-500">Allocated expenses versus defined monthly limits</p>
            </div>
            <button
              onClick={() => onNavigateTab('budgets')}
              className="text-xs font-semibold text-[#005c55] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Edit Budgets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Category Progress Stack */}
          <div className="space-y-4">
            {categories.slice(0, 6).map((cat) => {
              const pct = (cat.spent / cat.limit) * 100;
              const isCaution = pct >= 80 && pct < 100;
              const isOver = pct >= 100;

              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
                        <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                      </span>
                      <span className="font-semibold text-slate-800">{cat.name.split('&')[0]}</span>
                      {isOver && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold">
                          Exceeded Cap
                        </span>
                      )}
                      {isCaution && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                          {cat.percentage.toFixed(0)}% cap
                        </span>
                      )}
                    </div>
                    <span className="text-slate-900 font-bold font-mono">
                      {formatCurrency(cat.spent, currency)}{' '}
                      <span className="text-slate-400 font-normal">/ {formatCurrency(cat.limit, currency)}</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOver ? 'bg-[#ba1a1a]' : isCaution ? 'bg-[#f59e0b]' : 'bg-[#006c4a]'
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Column: Family Member Spending Share (5 Cols) */}
        <section className="lg:col-span-5 bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-bold text-slate-900 font-headline">Member Spending Share</h2>
              <span className="text-xs font-semibold text-slate-500">4 Active</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Household contribution breakdown for October</p>

            {/* Member Mini Cards Stack */}
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 ring-1 ring-slate-100"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">{member.name.split(' ')[0]}</span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded">
                          {member.alias}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {member.id === 'sarah'
                          ? 'Groceries & Utilities lead'
                          : member.id === 'mark'
                          ? 'Mortgage & Auto'
                          : member.id === 'maya'
                          ? 'Dorm supplies'
                          : 'School lunch & Books'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 block font-mono">
                      {formatCurrency(member.monthlySpend, currency)}
                    </span>
                    {member.role === 'dependent' ? (
                      <button
                        onClick={() => onOpenTransferModal(member.id)}
                        className="text-[11px] font-semibold text-[#005c55] hover:underline cursor-pointer"
                      >
                        {member.id === 'maya' ? 'Send Funds' : 'Send Allowance'}
                      </button>
                    ) : (
                      <button
                        onClick={() => onNavigateTab('members')}
                        className="text-[11px] font-semibold text-[#005c55] hover:underline cursor-pointer"
                      >
                        View Activity
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('members')}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
            <span>Manage Family Cards & Limits</span>
          </button>
        </section>
      </div>

      {/* 4. Bottom Section: Recent Family Activity Ledger Stream */}
      <section className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs space-y-4">
        {/* Title & Filters Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-headline">Recent Family Activity</h2>
            <p className="text-xs text-slate-500">Real-time ledger updates across joint cards and allowances</p>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search merchant or item..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="h-9 pl-9 pr-3 text-xs bg-white border border-slate-300 rounded-lg w-52 sm:w-60 text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#005c55] focus:border-[#005c55]"
              />
            </div>

            <select
              value={selectedMemberFilter}
              onChange={(e) => {
                setSelectedMemberFilter(e.target.value);
                setPage(1);
              }}
              className="h-9 px-3 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 cursor-pointer focus:outline-hidden"
            >
              <option value="all">All Members</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name.split(' ')[0]} ({m.alias})
                </option>
              ))}
            </select>

            <select
              value={selectedCategoryFilter}
              onChange={(e) => {
                setSelectedCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="h-9 px-3 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 cursor-pointer focus:outline-hidden"
            >
              <option value="all">All Categories</option>
              <option value="groceries">Groceries</option>
              <option value="utilities">Utilities</option>
              <option value="dining">Dining Out</option>
              <option value="education">Education</option>
              <option value="transport">Transport</option>
            </select>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Description / Merchant</th>
                <th className="py-3 px-3">Paid By</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Split Status</th>
                <th className="py-3 px-3 text-center">Receipt</th>
                <th className="py-3 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedTransactions.map((tx) => {
                const initial = tx.paidBy ? tx.paidBy.charAt(0) : 'S';
                const merchantInitials = tx.merchant.substring(0, 2).toUpperCase();

                return (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 whitespace-nowrap text-slate-500 font-medium">
                      {tx.date}, {tx.time}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                          {tx.isIncome ? '+' : merchantInitials}
                        </span>
                        <div>
                          <span className="font-semibold text-slate-900 block">{tx.merchant}</span>
                          <span className="text-[11px] text-slate-500">{tx.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
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
                        </span>
                        <span className="text-slate-800 font-medium">{tx.paidBy.split(' ')[0]}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {tx.splitStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {tx.hasReceipt ? (
                        <button
                          onClick={() => onOpenReceipt(tx)}
                          className="p-1 rounded text-[#005c55] hover:bg-slate-100 cursor-pointer"
                          title="View verified electronic receipt"
                        >
                          <Receipt className="w-4 h-4 text-emerald-700 inline" />
                        </button>
                      ) : (
                        <button
                          onClick={onOpenAddExpense}
                          className="text-[11px] text-slate-400 hover:text-[#005c55] underline cursor-pointer"
                        >
                          Upload
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap font-bold font-mono">
                      <span className={tx.isIncome ? 'text-emerald-700' : 'text-slate-900'}>
                        {formatSignedCurrency(tx.amount, tx.isIncome, currency)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <span>
            Showing <strong className="text-slate-900">{Math.min(filteredTransactions.length, (page - 1) * pageSize + 1)} - {Math.min(filteredTransactions.length, page * pageSize)}</strong> of{' '}
            <strong className="text-slate-900">{filteredTransactions.length}</strong> household transactions this billing cycle
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 rounded-md font-semibold cursor-pointer"
            >
              Previous
            </button>
            <span className="px-2 font-medium">Page {page} of {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 rounded-md font-semibold cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

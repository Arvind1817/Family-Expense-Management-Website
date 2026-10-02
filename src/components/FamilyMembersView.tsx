import React, { useState } from 'react';
import { CurrencySymbol, FamilyMember, BalanceSettlement } from '../types';
import { formatCurrency } from '../utils/format';
import {
  ChevronRight,
  UserPlus,
  Coins,
  Users,
  CreditCard,
  Scale,
  Calendar,
  Lock,
  Unlock,
  CheckCircle,
  Plus,
  ArrowRight,
  History,
  Zap,
  Shield,
  ArrowDown
} from 'lucide-react';

interface FamilyMembersViewProps {
  currency: CurrencySymbol;
  members: FamilyMember[];
  settlements: BalanceSettlement[];
  onOpenTransferModal: (memberId?: string) => void;
  onOpenSettleUpModal: () => void;
  onApproveReimbursement: (memberId: string) => void;
  onDeclineReimbursement: (memberId: string) => void;
  onSettleIndividual: (settlementId: string) => void;
  onTopUpMember: (memberId: string, amount: number) => void;
  onToggleCardLock: (memberId: string) => void;
}

export const FamilyMembersView: React.FC<FamilyMembersViewProps> = ({
  currency,
  members,
  settlements,
  onOpenTransferModal,
  onOpenSettleUpModal,
  onApproveReimbursement,
  onDeclineReimbursement,
  onSettleIndividual,
  onTopUpMember,
  onToggleCardLock,
}) => {
  const [showAddMemberNotice, setShowAddMemberNotice] = useState(false);
  const [selectedStatementMember, setSelectedStatementMember] = useState<string | null>(null);

  // Aggregated calculations
  const totalMemberSpend = members.reduce((sum, m) => sum + m.monthlySpend, 0);
  const totalAllowances = members
    .filter((m) => m.role === 'dependent')
    .reduce((sum, m) => sum + m.budgetCap, 0);
  const pendingSettlementCount = settlements.filter((s) => s.status === 'pending').length;
  const pendingSettlementAmount = settlements
    .filter((s) => s.status === 'pending')
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-8">
      {/* 1. HEADER & HOUSEHOLD SUMMARY SECTION */}
      <section className="space-y-6">
        {/* Breadcrumb and Top Action Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1 font-medium">
              <span>Household Hub</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#005c55] font-semibold">Family Members</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-headline tracking-tight">
              Family Members & Allowances
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage household member spending limits, track individual cards, and balance settlements.
            </p>
          </div>

          {/* Contextual Action Buttons */}
          <div className="flex items-center gap-3 self-start lg:self-auto">
            <button
              onClick={() => setShowAddMemberNotice(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold transition-colors active:scale-[0.99] shadow-xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-[#005c55]" />
              <span>Add Family Member</span>
            </button>
            <button
              onClick={() => onOpenTransferModal()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#005c55] hover:bg-[#004e48] text-white text-xs font-semibold transition-transform active:scale-[0.99] shadow-xs cursor-pointer"
            >
              <Coins className="w-4 h-4" />
              <span>Transfer Allowance</span>
            </button>
          </div>
        </div>

        {showAddMemberNotice && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900 animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#006c4a]" />
              <span>
                <strong>Family Vault Slot Ready:</strong> The Miller Family has 2 parent admin slots and 2 dependent slots active. Plaid Family Link supports up to 8 cards.
              </span>
            </div>
            <button
              onClick={() => setShowAddMemberNotice(false)}
              className="text-xs text-emerald-700 hover:underline font-bold ml-4 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Quick Stats Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat Card 1 */}
          <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs hover:shadow transition-shadow flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Members</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-headline">4</span>
                <span className="text-xs text-slate-400">Profiles</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>2 Parents, 2 Dependents</span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#f2f3ff] flex items-center justify-center text-[#005c55]">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs hover:shadow transition-shadow flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Member Spend</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-headline">
                  {formatCurrency(totalMemberSpend, currency)}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                <span className="text-[#059669] font-bold flex items-center">
                  <ArrowDown className="w-3.5 h-3.5" /> 4.2%
                </span>
                <span>vs last month</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#f2f3ff] flex items-center justify-center text-[#005c55]">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs hover:shadow transition-shadow flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Allowances Disbursed</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-headline">
                  {formatCurrency(totalAllowances, currency)}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>Next cycle: Nov 1st</span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#f2f3ff] flex items-center justify-center text-[#005c55]">
              <Coins className="w-5 h-5" />
            </div>
          </div>

          {/* Stat Card 4 */}
          <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs hover:shadow transition-shadow flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Settlements</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-headline">
                  {formatCurrency(pendingSettlementAmount, currency)}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#B45309] font-bold mt-1">
                <Scale className="w-3.5 h-3.5" />
                <span>{pendingSettlementCount} items need action</span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] flex items-center justify-center text-[#B45309]">
              <Scale className="w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOUSEHOLD PROFILES SECTION (BENTO GRID) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-headline">Household Profiles</h2>
            <p className="text-xs text-slate-500">Live spending cards, category breakdowns, and individual permission guards.</p>
          </div>
          <span className="text-xs font-medium text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-300">
            Billing Cycle: October 1 - 31
          </span>
        </div>

        {/* 4 Interactive Member Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CARD 1: Sarah Miller (Mom / Organizer) */}
          {members.filter((m) => m.id === 'sarah').map((sarah) => (
            <div
              key={sarah.id}
              className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-5">
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={sarah.avatar}
                      alt={sarah.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-[#005c55]/20"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base font-headline">{sarah.name}</h3>
                        <span className="text-xs text-[#005c55] font-semibold">({sarah.alias})</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-slate-100 text-[#005c55] font-bold">
                          {sarah.roleTag}
                        </span>
                        <span className="text-xs text-slate-400">• {sarah.roleDescription}</span>
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[#ECFDF5] text-[#047857] font-bold border border-[#047857]/20">
                    Within Budget (68%)
                  </span>
                </div>

                {/* Spend Metrics & Progress */}
                <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]/70 space-y-2.5">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="text-xs text-slate-500 block">Monthly Spend</span>
                      <span className="text-xl font-bold text-slate-900 font-headline">
                        {formatCurrency(sarah.monthlySpend, currency)}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">{sarah.transactionsCount} household transactions</span>
                  </div>
                  {/* Financial Progress Bar */}
                  <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#059669] h-full rounded-full transition-all duration-300" style={{ width: '68%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Shared Budget Cap: {formatCurrency(sarah.budgetCap, currency)}</span>
                    <span className="font-semibold text-emerald-800">
                      {formatCurrency(sarah.available, currency)} Available
                    </span>
                  </div>
                </div>

                {/* Top Categories */}
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-2">Top Spend Categories</span>
                  <div className="grid grid-cols-3 gap-2">
                    {sarah.topCategories.map((tc) => (
                      <div key={tc.name} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-0.5">
                        <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                          <span className="material-symbols-outlined text-[15px] text-[#005c55]">{tc.icon}</span>
                          <span>{tc.name}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-900 mt-1 font-mono">
                          {formatCurrency(tc.amount, currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connected Card Pill */}
                <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white border border-[#E2E8F0]">
                  <div className="flex items-center gap-2 text-xs text-slate-900 font-medium">
                    <CreditCard className="w-4 h-4 text-[#005c55]" />
                    <span>{sarah.cardName}</span>
                    <span className="text-slate-400 font-mono text-[11px]">•••• {sarah.cardLast4}</span>
                  </div>
                  <span className="text-xs text-[#059669] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span> Active
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-5 mt-4 border-t border-[#F1F5F9]">
                <button
                  onClick={() => setSelectedStatementMember('sarah')}
                  className="flex-1 py-2 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-slate-800 text-xs font-semibold border border-[#E2E8F0] transition-colors cursor-pointer"
                >
                  View Statements
                </button>
                <button
                  onClick={() => onToggleCardLock(sarah.id)}
                  className="flex-1 py-2 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#005c55] text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                >
                  Manage Card
                </button>
              </div>
            </div>
          ))}

          {/* CARD 2: Mark Miller (Dad / Co-Admin) */}
          {members.filter((m) => m.id === 'mark').map((mark) => (
            <div
              key={mark.id}
              className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-5">
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={mark.avatar}
                      alt={mark.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-[#005c55]/20"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base font-headline">{mark.name}</h3>
                        <span className="text-xs text-[#005c55] font-semibold">({mark.alias})</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-slate-100 text-[#005c55] font-bold">
                          {mark.roleTag}
                        </span>
                        <span className="text-xs text-slate-400">• {mark.roleDescription}</span>
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[#ECFDF5] text-[#047857] font-bold border border-[#047857]/20">
                    Within Budget (74%)
                  </span>
                </div>

                {/* Spend Metrics & Progress */}
                <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]/70 space-y-2.5">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="text-xs text-slate-500 block">Monthly Spend</span>
                      <span className="text-xl font-bold text-slate-900 font-headline">
                        {formatCurrency(mark.monthlySpend, currency)}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">{mark.transactionsCount} household transactions</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#059669] h-full rounded-full transition-all duration-300" style={{ width: '74%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Shared Budget Cap: {formatCurrency(mark.budgetCap, currency)}</span>
                    <span className="font-semibold text-emerald-800">
                      {formatCurrency(mark.available, currency)} Available
                    </span>
                  </div>
                </div>

                {/* Top Categories */}
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-2">Top Spend Categories</span>
                  <div className="grid grid-cols-3 gap-2">
                    {mark.topCategories.map((tc) => (
                      <div key={tc.name} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-0.5">
                        <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                          <span className="material-symbols-outlined text-[15px] text-[#005c55]">{tc.icon}</span>
                          <span>{tc.name}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-900 mt-1 font-mono">
                          {formatCurrency(tc.amount, currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connected Card */}
                <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white border border-[#E2E8F0]">
                  <div className="flex items-center gap-2 text-xs text-slate-900 font-medium">
                    <CreditCard className="w-4 h-4 text-[#005c55]" />
                    <span>{mark.cardName}</span>
                    <span className="text-slate-400 font-mono text-[11px]">•••• {mark.cardLast4}</span>
                  </div>
                  <span className="text-xs text-[#059669] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span> Active
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-5 mt-4 border-t border-[#F1F5F9]">
                <button
                  onClick={() => setSelectedStatementMember('mark')}
                  className="flex-1 py-2 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-slate-800 text-xs font-semibold border border-[#E2E8F0] transition-colors cursor-pointer"
                >
                  View Statements
                </button>
                <button
                  onClick={() => onToggleCardLock(mark.id)}
                  className="flex-1 py-2 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#005c55] text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                >
                  Manage Card
                </button>
              </div>
            </div>
          ))}

          {/* CARD 3: Alex Miller (Teen - Age 15) */}
          {members.filter((m) => m.id === 'alex').map((alex) => {
            const isCardLocked = alex.cardStatus === 'Locked';

            return (
              <div
                key={alex.id}
                className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-5">
                  {/* Header Row */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={alex.avatar}
                        alt={alex.name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base font-headline">{alex.name}</h3>
                          <span className="text-xs text-slate-500 font-semibold">(Age {alex.age})</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-[#EEF2FF] text-[#4F46E5] font-bold">
                            {alex.roleTag}
                          </span>
                          <span className="text-xs text-slate-400">• {alex.roleDescription}</span>
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[#FFFBEB] text-[#B45309] font-bold border border-[#B45309]/20">
                      85% of allowance spent
                    </span>
                  </div>

                  {/* Allowance Meter & Gauge */}
                  <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]/70 space-y-2.5">
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="text-xs text-slate-500 block">Monthly Allowance</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-slate-900 font-headline">
                            {formatCurrency(alex.budgetCap, currency)}
                          </span>
                          <span className="text-xs text-slate-400">/mo</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900 block font-mono">
                          {formatCurrency(alex.monthlySpend, currency)} spent
                        </span>
                        <span className="text-xs text-[#059669] font-bold block">
                          {formatCurrency(alex.available, currency)} remaining
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar 85% amber */}
                    <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#F59E0B] h-full rounded-full transition-all duration-300" style={{ width: '85%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Refreshes in {alex.refreshesInDays} days</span>
                      <span>{currency}25/day safety velocity</span>
                    </div>
                  </div>

                  {/* Safety Limit Controls & Restrictions */}
                  <div className="p-3.5 rounded-xl bg-[#f2f3ff]/60 border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-[#005c55]" />
                        <span>Parental Safety Guardrails</span>
                      </span>
                      <span className="text-[11px] text-[#005c55] font-semibold">Active</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <span className="material-symbols-outlined text-[16px] text-[#005c55]">speed</span>
                        <span>Daily Spend Cap: <strong>{formatCurrency(alex.dailyCap || 25, currency)}</strong></span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#FEF2F2] text-[#B91C1C] border border-[#B91C1C]/20 text-[11px] font-bold">
                        <span className="material-symbols-outlined text-[14px]">block</span>
                        <span>Blocked: Gaming & In-App</span>
                      </div>
                    </div>
                  </div>

                  {/* Connected Card */}
                  <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white border border-[#E2E8F0]">
                    <div className="flex items-center gap-2 text-xs text-slate-900 font-medium">
                      <CreditCard className="w-4 h-4 text-[#059669]" />
                      <span>{alex.cardName}</span>
                      <span className="text-slate-400 font-mono text-[11px]">•••• {alex.cardLast4}</span>
                    </div>
                    <button
                      onClick={() => onToggleCardLock(alex.id)}
                      className="text-xs text-slate-600 hover:text-[#005c55] flex items-center gap-1 font-medium cursor-pointer"
                    >
                      {isCardLocked ? (
                        <>
                          <Lock className="w-3.5 h-3.5 text-red-600" />
                          <span className="text-red-700 font-bold">Locked</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Lock available</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-3 pt-5 mt-4 border-t border-[#F1F5F9]">
                  <button
                    onClick={() => onTopUpMember(alex.id, 50)}
                    className="flex-1 py-2 rounded-lg bg-[#005c55] hover:bg-[#004e48] text-white text-xs font-semibold transition-colors active:scale-[0.99] shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Top-up +{currency}50</span>
                  </button>
                  <button
                    onClick={() => onOpenTransferModal(alex.id)}
                    className="flex-1 py-2 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-slate-800 text-xs font-semibold border border-[#E2E8F0] transition-colors cursor-pointer"
                  >
                    Adjust Limits
                  </button>
                </div>
              </div>
            );
          })}

          {/* CARD 4: Maya Miller (College Student - Age 20) */}
          {members.filter((m) => m.id === 'maya').map((maya) => (
            <div
              key={maya.id}
              className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-5">
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={maya.avatar}
                      alt={maya.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-200"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base font-headline">{maya.name}</h3>
                        <span className="text-xs text-slate-500 font-semibold">(Age {maya.age})</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-[#EEF2FF] text-[#4F46E5] font-bold">
                          {maya.roleTag}
                        </span>
                        <span className="text-xs text-slate-400">• {maya.roleDescription}</span>
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[#FFFBEB] text-[#B45309] font-bold border border-[#B45309]/20">
                    85% of budget spent
                  </span>
                </div>

                {/* Allowance Meter & Gauge */}
                <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]/70 space-y-2.5">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="text-xs text-slate-500 block">Monthly Budget</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-slate-900 font-headline">
                          {formatCurrency(maya.budgetCap, currency)}
                        </span>
                        <span className="text-xs text-slate-400">/mo</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900 block font-mono">
                        {formatCurrency(maya.monthlySpend, currency)} spent
                      </span>
                      <span className="text-xs text-[#059669] font-bold block">
                        {formatCurrency(maya.available, currency)} remaining
                      </span>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#F59E0B] h-full rounded-full transition-all duration-300" style={{ width: '85%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Off-campus card linked</span>
                    <span>Direct stipend active</span>
                  </div>
                </div>

                {/* Interactive Request Pending Alert Box */}
                {maya.hasReimbursementRequest && maya.reimbursementDetails?.status === 'pending' ? (
                  <div className="p-3.5 rounded-xl bg-[#FFFBEB] border border-[#F59E0B]/40 space-y-2.5 animate-in fade-in duration-150">
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-[#B45309] text-[20px] shrink-0 mt-0.5">
                        notifications_active
                      </span>
                      <div>
                        <span className="text-xs font-bold text-[#B45309] block">
                          Reimbursement Requested
                        </span>
                        <p className="text-xs text-slate-800 mt-0.5">
                          Requested <strong>{formatCurrency(maya.reimbursementDetails.amount, currency)}</strong> for {maya.reimbursementDetails.purpose}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onApproveReimbursement(maya.id)}
                        className="flex-1 py-1.5 rounded-lg bg-[#005c55] text-white text-xs font-semibold hover:bg-[#004e48] transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve & Send {formatCurrency(maya.reimbursementDetails.amount, currency)}</span>
                      </button>
                      <button
                        onClick={() => onDeclineReimbursement(maya.id)}
                        className="px-3 py-1.5 rounded-lg bg-white text-slate-600 border border-slate-300 text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>All semester reimbursements approved and settled!</span>
                  </div>
                )}

                {/* Connected Card */}
                <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white border border-[#E2E8F0]">
                  <div className="flex items-center gap-2 text-xs text-slate-900 font-medium">
                    <CreditCard className="w-4 h-4 text-[#005c55]" />
                    <span>{maya.cardName}</span>
                    <span className="text-slate-400 font-mono text-[11px]">•••• {maya.cardLast4}</span>
                  </div>
                  <span className="text-xs text-[#059669] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span> Active
                  </span>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center gap-3 pt-5 mt-4 border-t border-[#F1F5F9]">
                <button
                  onClick={() => setSelectedStatementMember('maya')}
                  className="flex-1 py-2 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-slate-800 text-xs font-semibold border border-[#E2E8F0] transition-colors cursor-pointer"
                >
                  View Activity
                </button>
                <button
                  onClick={() => onOpenTransferModal(maya.id)}
                  className="flex-1 py-2 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#005c55] text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                >
                  Deposit Funds
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SHARED POOL & BALANCE SETTLEMENT LEDGER ("Who Owes What") */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        {/* Section Header */}
        <div className="p-6 border-b border-[#F1F5F9] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#f2f3ff] flex items-center justify-center text-[#005c55]">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 font-headline">
                  Shared Pool & Balance Settlements
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857] text-xs font-bold border border-[#047857]/20">
                  Split Reconciliation Matrix
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically calculates joint household tabs and one-click settlements.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                alert('Viewing past settlement reconciliation archive.');
              }}
              className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <History className="w-4 h-4 text-slate-500" />
              <span>Past Settlement Logs</span>
            </button>
            <button
              onClick={onOpenSettleUpModal}
              className="px-4 py-2 rounded-lg bg-[#005c55] hover:bg-[#004e48] text-white text-xs font-semibold transition-all active:scale-[0.99] shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Settle Up with 1-Click</span>
            </button>
          </div>
        </div>

        {/* Ledger Table Rows */}
        <div className="divide-y divide-[#F1F5F9]">
          {settlements.map((item) => {
            const isPending = item.status === 'pending';
            const isSettled = item.status === 'settled';

            return (
              <div
                key={item.id}
                className="p-5 hover:bg-[#F8FAFC] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${item.payerBg} ${item.payerText}`}
                  >
                    {item.payerInitial}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">{item.title}</span>
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-[11px] text-slate-400">{item.date}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span
                      className={`text-base font-bold font-mono block ${
                        isSettled ? 'text-[#059669]' : 'text-slate-900'
                      }`}
                    >
                      {isSettled ? `+${formatCurrency(item.amount, currency)}` : formatCurrency(item.amount, currency)}
                    </span>
                    <span
                      className={`text-[11px] block font-medium ${
                        isPending ? 'text-[#B45309]' : 'text-[#047857]'
                      }`}
                    >
                      {item.methodNote}
                    </span>
                  </div>

                  {isPending ? (
                    <button
                      onClick={() => onSettleIndividual(item.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#005c55] text-white text-xs font-semibold hover:bg-[#004e48] transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>Pay Sarah → Mark</span>
                    </button>
                  ) : isSettled ? (
                    <span className="px-3 py-1 rounded-full bg-[#ECFDF5] text-[#047857] text-xs font-bold flex items-center gap-1 border border-[#047857]/20">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Settled</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1">
                      <span>Archive</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Integrated Settlement Action Drawer Bar */}
        <div className="p-4 bg-slate-50/70 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Shield className="w-4 h-4 text-[#005c55]" />
            <span>
              Integrated with <strong>Zelle</strong> and <strong>Plaid Family Link</strong> for instant zero-fee domestic settlements.
            </span>
          </div>
          <button
            onClick={() => alert('Auto-settlement rules are configured to reconcile joint checking expenses on the last calendar day of every month.')}
            className="text-[#005c55] hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Auto-Settlement Rules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Statement Preview Drawer if active */}
      {selectedStatementMember && (
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="text-xs">
            <span className="font-bold text-slate-900 block">
              Viewing Certified Statement for {members.find((m) => m.id === selectedStatementMember)?.name}
            </span>
            <span className="text-slate-500">October 2024 · All debit and credit transactions verified</span>
          </div>
          <button
            onClick={() => setSelectedStatementMember(null)}
            className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-md font-semibold hover:bg-slate-200 cursor-pointer"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

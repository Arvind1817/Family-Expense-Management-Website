/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CurrencySymbol,
  FamilyMember,
  BudgetCategory,
  Transaction,
  BalanceSettlement,
  ScheduledBill,
  AlertTrigger
} from './types';
import {
  INITIAL_MEMBERS,
  INITIAL_CATEGORIES,
  INITIAL_TRANSACTIONS,
  INITIAL_SETTLEMENTS,
  INITIAL_BILLS,
  INITIAL_ALERTS
} from './mockData';
import { TopNavBar } from './components/TopNavBar';
import { DashboardView } from './components/DashboardView';
import { FamilyMembersView } from './components/FamilyMembersView';
import { BudgetsAlertsView } from './components/BudgetsAlertsView';
import { AnalyticsReportsView } from './components/AnalyticsReportsView';
import { AddExpenseModal } from './components/AddExpenseModal';
import { TransferAllowanceModal } from './components/TransferAllowanceModal';
import { SettleUpModal } from './components/SettleUpModal';
import { ReceiptModal } from './components/ReceiptModal';
import { ExportModal } from './components/ExportModal';
import { AlertSettingsModal } from './components/AlertSettingsModal';
import { NewCategoryModal } from './components/NewCategoryModal';
import { HelpConciergeModal } from './components/HelpConciergeModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'members' | 'budgets' | 'analytics'>('dashboard');
  const [currency, setCurrency] = useState<CurrencySymbol>('$');

  // Application State
  const [members, setMembers] = useState<FamilyMember[]>(INITIAL_MEMBERS);
  const [categories, setCategories] = useState<BudgetCategory[]>(INITIAL_CATEGORIES);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [settlements, setSettlements] = useState<BalanceSettlement[]>(INITIAL_SETTLEMENTS);
  const [bills, setBills] = useState<ScheduledBill[]>(INITIAL_BILLS);
  const [alerts, setAlerts] = useState<AlertTrigger[]>(INITIAL_ALERTS);

  // Modals state
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [transferTargetMember, setTransferTargetMember] = useState<string>('alex');
  const [isSettleUpOpen, setIsSettleUpOpen] = useState(false);
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<Transaction | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAlertSettingsOpen, setIsAlertSettingsOpen] = useState(false);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Toast / notification feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Add Expense Handler
  const handleAddTransaction = (newTxData: Partial<Transaction>) => {
    const newId = `tx_${Date.now()}`;
    const newTx: Transaction = {
      id: newId,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      merchant: newTxData.merchant || 'General Store',
      description: newTxData.description || 'Household expense',
      paidBy: newTxData.paidBy || 'Sarah Miller',
      paidById: newTxData.paidById || 'sarah',
      category: newTxData.category || 'Groceries',
      categoryIcon: newTxData.categoryIcon || 'shopping_cart',
      splitStatus: newTxData.splitStatus || 'Shared 100%',
      splitType: newTxData.splitType || 'joint_50_50',
      amount: newTxData.amount || 0,
      hasReceipt: newTxData.hasReceipt || false,
      taxFlag: newTxData.taxFlag || false,
      paymentMethod: newTxData.paymentMethod || 'Joint Card',
    };

    setTransactions([newTx, ...transactions]);

    // Update Category Spend
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.name.toLowerCase().includes(newTx.category.toLowerCase())) {
          const updatedSpent = cat.spent + newTx.amount;
          return {
            ...cat,
            spent: updatedSpent,
            percentage: (updatedSpent / cat.limit) * 100,
            status: updatedSpent > cat.limit ? 'critical' : updatedSpent >= cat.limit * 0.8 ? 'caution' : 'normal',
          };
        }
        return cat;
      })
    );

    // Update Member Monthly Spend
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === newTx.paidById) {
          const newSpent = m.monthlySpend + newTx.amount;
          return {
            ...m,
            monthlySpend: newSpent,
            available: Math.max(0, m.budgetCap - newSpent),
            transactionsCount: m.transactionsCount + 1,
            percentageUsed: Math.min(100, Math.round((newSpent / m.budgetCap) * 100)),
          };
        }
        return m;
      })
    );

    showToast(`Recorded ${newTx.merchant} (${currency}${newTx.amount.toFixed(2)}) to household ledger.`);
  };

  // Transfer / Top-Up Allowance Handler
  const handleTransferAllowance = (memberId: string, amount: number, note: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            budgetCap: m.budgetCap + amount,
            available: m.available + amount,
          };
        }
        return m;
      })
    );

    const targetMember = members.find((m) => m.id === memberId);
    showToast(`Transferred ${currency}${amount.toFixed(2)} to ${targetMember?.name || 'Dependent'}.`);
  };

  // One-Click Settle All
  const handleSettleAll = () => {
    setSettlements((prev) =>
      prev.map((s) => ({
        ...s,
        status: 'settled',
        methodNote: 'Reconciled via Zelle 1-Click',
      }))
    );
    showToast('All household balance tabs successfully settled.');
  };

  // Individual Settlement
  const handleSettleIndividual = (settlementId: string) => {
    setSettlements((prev) =>
      prev.map((s) =>
        s.id === settlementId
          ? { ...s, status: 'settled', methodNote: 'Reconciled via Zelle' }
          : s
      )
    );
    showToast('Balance settlement recorded as settled.');
  };

  // Approve Reimbursement
  const handleApproveReimbursement = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId && m.reimbursementDetails) {
          return {
            ...m,
            hasReimbursementRequest: false,
            reimbursementDetails: {
              ...m.reimbursementDetails,
              status: 'approved',
            },
            monthlySpend: m.monthlySpend + m.reimbursementDetails.amount,
          };
        }
        return m;
      })
    );
    showToast('Reimbursement approved and funds sent to student card.');
  };

  const handleDeclineReimbursement = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId && m.reimbursementDetails) {
          return {
            ...m,
            hasReimbursementRequest: false,
            reimbursementDetails: {
              ...m.reimbursementDetails,
              status: 'declined',
            },
          };
        }
        return m;
      })
    );
    showToast('Reimbursement request declined.');
  };

  // Card Lock Toggle
  const handleToggleCardLock = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          const nextStatus = m.cardStatus === 'Active' ? 'Locked' : 'Active';
          showToast(`${m.name}'s card is now ${nextStatus}.`);
          return { ...m, cardStatus: nextStatus };
        }
        return m;
      })
    );
  };

  // Category Alert Toggle
  const handleToggleCategoryAlert = (catId: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId ? { ...c, alertActive: !c.alertActive } : c
      )
    );
  };

  // Adjust Category Limit
  const handleAdjustCategoryCap = (catId: string, delta: number) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === catId) {
          const updated = Math.max(100, c.limit + delta);
          return {
            ...c,
            limit: updated,
            percentage: (c.spent / updated) * 100,
            status: c.spent > updated ? 'critical' : c.spent >= updated * 0.8 ? 'caution' : 'normal',
          };
        }
        return c;
      })
    );
    showToast(`Updated budget cap.`);
  };

  // Pay Scheduled Bill
  const handlePayBill = (billId: string) => {
    setBills((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, isPaid: true } : b))
    );
    showToast('Scheduled bill marked as paid.');
  };

  // Dismiss Alerts
  const handleDismissAlerts = () => {
    setAlerts((prev) => prev.filter((a) => a.type === 'critical'));
    showToast('Non-critical alerts dismissed.');
  };

  // Create New Category
  const handleCreateCategory = (catData: { name: string; limit: number; icon: string; subtext: string }) => {
    const newCat: BudgetCategory = {
      id: `cat_${Date.now()}`,
      name: catData.name,
      limit: catData.limit,
      spent: 0,
      subtext: catData.subtext,
      icon: catData.icon,
      percentage: 0,
      status: 'normal',
      alertActive: true,
      septemberSpent: 0,
      octoberSpent: 0,
      variancePercentage: 0,
      varianceDirection: 'down',
    };
    setCategories([...categories, newCat]);
    showToast(`Added new category "${catData.name}".`);
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-sans selection:bg-[#005c55] selection:text-white">
      {/* Top Navigation Bar */}
      <TopNavBar
        activeTab={activeTab}
        setActiveTab={(tab: any) => setActiveTab(tab)}
        currency={currency}
        setCurrency={setCurrency}
        onOpenAddExpense={() => setIsAddExpenseOpen(true)}
        onOpenExportModal={() => setIsExportOpen(true)}
        onOpenHelpModal={() => setIsHelpOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {activeTab === 'dashboard' && (
          <DashboardView
            currency={currency}
            members={members}
            categories={categories}
            transactions={transactions}
            onOpenAddExpense={() => setIsAddExpenseOpen(true)}
            onOpenReceipt={(tx) => setSelectedReceiptTx(tx)}
            onNavigateTab={(tab: any) => setActiveTab(tab)}
            onOpenTransferModal={(memberId) => {
              setTransferTargetMember(memberId);
              setIsTransferOpen(true);
            }}
            onRecordQuickExpense={handleAddTransaction}
          />
        )}

        {activeTab === 'members' && (
          <FamilyMembersView
            currency={currency}
            members={members}
            settlements={settlements}
            onOpenTransferModal={(memberId) => {
              if (memberId) setTransferTargetMember(memberId);
              setIsTransferOpen(true);
            }}
            onOpenSettleUpModal={() => setIsSettleUpOpen(true)}
            onApproveReimbursement={handleApproveReimbursement}
            onDeclineReimbursement={handleDeclineReimbursement}
            onSettleIndividual={handleSettleIndividual}
            onTopUpMember={(memberId, amount) => handleTransferAllowance(memberId, amount, 'Quick top-up')}
            onToggleCardLock={handleToggleCardLock}
          />
        )}

        {activeTab === 'budgets' && (
          <BudgetsAlertsView
            currency={currency}
            categories={categories}
            bills={bills}
            alerts={alerts}
            onOpenAlertSettings={() => setIsAlertSettingsOpen(true)}
            onOpenNewCategory={() => setIsNewCategoryOpen(true)}
            onPayBill={handlePayBill}
            onDismissAlerts={handleDismissAlerts}
            onToggleCategoryAlert={handleToggleCategoryAlert}
            onAdjustCategoryCap={handleAdjustCategoryCap}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsReportsView
            currency={currency}
            members={members}
            transactions={transactions}
            onOpenExportModal={() => setIsExportOpen(true)}
            onOpenReceipt={(tx) => setSelectedReceiptTx(tx)}
          />
        )}
      </main>

      {/* Bottom Sticky Footer */}
      <footer className="w-full bg-white border-t border-[#e2e8f0] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#005c55] font-headline">KinSpend Household Sync</span>
            <span>•</span>
            <span>Miller Household Vault v2.4</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline text-emerald-700 font-semibold">256-bit AES Encrypted</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsExportOpen(true)}
              className="hover:text-[#005c55] transition-colors cursor-pointer"
            >
              Export CSV
            </button>
            <button
              onClick={() => setIsHelpOpen(true)}
              className="hover:text-[#005c55] transition-colors cursor-pointer"
            >
              Bank Connections (Plaid)
            </button>
            <button
              onClick={() => setIsHelpOpen(true)}
              className="hover:text-[#005c55] transition-colors cursor-pointer"
            >
              Privacy & Security
            </button>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        currency={currency}
        members={members}
        categories={categories}
        onAddTransaction={handleAddTransaction}
      />

      <TransferAllowanceModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        currency={currency}
        members={members}
        targetMemberId={transferTargetMember}
        onTransfer={handleTransferAllowance}
      />

      <SettleUpModal
        isOpen={isSettleUpOpen}
        onClose={() => setIsSettleUpOpen(false)}
        currency={currency}
        settlements={settlements}
        onSettleAll={handleSettleAll}
      />

      <ReceiptModal
        isOpen={!!selectedReceiptTx}
        onClose={() => setSelectedReceiptTx(null)}
        currency={currency}
        transaction={selectedReceiptTx}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        currency={currency}
        members={members}
        transactions={transactions}
      />

      <AlertSettingsModal
        isOpen={isAlertSettingsOpen}
        onClose={() => setIsAlertSettingsOpen(false)}
      />

      <NewCategoryModal
        isOpen={isNewCategoryOpen}
        onClose={() => setIsNewCategoryOpen(false)}
        currency={currency}
        onCreateCategory={handleCreateCategory}
      />

      <HelpConciergeModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}

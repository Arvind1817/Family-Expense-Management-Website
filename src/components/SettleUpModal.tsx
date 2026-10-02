import React, { useState } from 'react';
import { CurrencySymbol, BalanceSettlement } from '../types';
import { formatCurrency } from '../utils/format';
import { X, CheckCircle2, Shield, ArrowRight, Zap } from 'lucide-react';

interface SettleUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencySymbol;
  settlements: BalanceSettlement[];
  onSettleAll: () => void;
}

export const SettleUpModal: React.FC<SettleUpModalProps> = ({
  isOpen,
  onClose,
  currency,
  settlements,
  onSettleAll,
}) => {
  const [method, setMethod] = useState<'zelle' | 'plaid' | 'cash'>('zelle');
  const [settledSuccess, setSettledSuccess] = useState(false);

  if (!isOpen) return null;

  const pendingItems = settlements.filter((s) => s.status === 'pending');
  const totalPending = pendingItems.reduce((acc, curr) => acc + curr.amount, 0);

  const handleExecuteSettle = () => {
    setSettledSuccess(true);
    setTimeout(() => {
      onSettleAll();
      setSettledSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#005c55]/10 text-[#005c55] flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">1-Click Balance Settlement</h3>
              <p className="text-xs text-slate-500">Reconcile joint household tabs instantly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {settledSuccess ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-slate-900">Settlement Complete!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              {formatCurrency(totalPending, currency)} successfully settled between Sarah and Mark via {method.toUpperCase()}.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Total Net Balance Due</span>
                <span className="text-2xl font-bold text-slate-900 font-headline">
                  {formatCurrency(totalPending, currency)}
                </span>
                <span className="text-xs text-amber-700 block font-medium mt-0.5">
                  Sarah owes Mark · 1 pending item
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                Zero Fees
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Pending Items in Reconciliation</span>
              <div className="max-h-40 overflow-y-auto space-y-2 divide-y divide-slate-100">
                {pendingItems.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-800">{item.title}</p>
                      <p className="text-[11px] text-slate-500">{item.description}</p>
                    </div>
                    <span className="font-bold text-slate-900 ml-3">
                      {formatCurrency(item.amount, currency)}
                    </span>
                  </div>
                ))}
                {pendingItems.length === 0 && (
                  <p className="text-xs text-slate-500 py-2">All shared expenses currently settled!</p>
                )}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1.5">Settlement Rail</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('zelle')}
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition-colors ${
                    method === 'zelle'
                      ? 'border-[#005c55] bg-[#f2f3ff] text-[#005c55] font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-xs font-bold">Zelle</p>
                  <p className="text-[10px] text-slate-400">Instant direct</p>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('plaid')}
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition-colors ${
                    method === 'plaid'
                      ? 'border-[#005c55] bg-[#f2f3ff] text-[#005c55] font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-xs font-bold">Plaid Link</p>
                  <p className="text-[10px] text-slate-400">ACH transfer</p>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('cash')}
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition-colors ${
                    method === 'cash'
                      ? 'border-[#005c55] bg-[#f2f3ff] text-[#005c55] font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-xs font-bold">Manual</p>
                  <p className="text-[10px] text-slate-400">Mark as settled</p>
                </button>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center gap-2 text-[11px] text-emerald-900">
              <Shield className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Authorized via Plaid Family Link Vault. Bank encryption verified.
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={pendingItems.length === 0}
                onClick={handleExecuteSettle}
                className="px-5 py-2 rounded-lg bg-[#005c55] hover:bg-[#004e48] disabled:opacity-50 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-[0.99] transition-transform"
              >
                <span>Authorize & Pay {formatCurrency(totalPending, currency)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

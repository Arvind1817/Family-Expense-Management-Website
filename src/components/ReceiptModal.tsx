import React from 'react';
import { CurrencySymbol, Transaction } from '../types';
import { formatCurrency } from '../utils/format';
import { X, CheckCircle, Printer, Download, Store } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencySymbol;
  transaction: Transaction | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  currency,
  transaction,
}) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-slate-900">Verified Electronic Receipt</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Paper receipt mockup style */}
        <div className="bg-[#fafafa] border border-slate-200 rounded-xl p-4 font-mono text-xs text-slate-800 space-y-3 shadow-inner">
          <div className="text-center pb-2 border-b border-dashed border-slate-300">
            <div className="flex items-center justify-center gap-1 font-bold text-sm text-slate-900 font-sans">
              <Store className="w-4 h-4 text-[#005c55]" />
              <span>{transaction.merchant}</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">{transaction.date} · {transaction.time}</p>
            <p className="text-[10px] text-slate-400">Terminal #0492 · Auth: 938210</p>
          </div>

          <div className="space-y-1.5 py-1">
            <div className="flex justify-between text-slate-600">
              <span>Item / Description</span>
              <span>Amount</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-900">
              <span className="truncate max-w-[180px]">{transaction.description}</span>
              <span>{formatCurrency(transaction.amount, currency)}</span>
            </div>
            {transaction.taxFlag && (
              <div className="flex justify-between text-[11px] text-emerald-700">
                <span>Tax Deductible (529 Qualified)</span>
                <span>YES</span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-dashed border-slate-300 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="font-semibold text-slate-900">{transaction.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Paid By:</span>
              <span className="font-semibold text-slate-900">{transaction.paidBy}</span>
            </div>
            <div className="flex justify-between">
              <span>Split Allocation:</span>
              <span className="font-semibold text-slate-900">{transaction.splitStatus}</span>
            </div>
          </div>

          <div className="pt-2 border-t-2 border-slate-900 flex justify-between font-bold text-sm font-sans text-slate-900">
            <span>TOTAL CHARGED</span>
            <span>{formatCurrency(transaction.amount, currency)}</span>
          </div>

          <div className="pt-2 text-center text-[10px] text-slate-400 border-t border-dashed border-slate-300">
            <span>•••• BARCODE SYNCHRONIZED ••••</span>
            <div className="h-6 w-3/4 mx-auto my-1 bg-repeating-linear-stripes opacity-40">
              ||||| | |||| ||| |||| || ||| |||||
            </div>
            <span>Family Vault Ledger ID: {transaction.id}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-[#005c55] hover:bg-[#004e48] text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};

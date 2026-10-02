import React, { useState } from 'react';
import { CurrencySymbol, FamilyMember } from '../types';
import { X, ArrowRight, Wallet, Check } from 'lucide-react';

interface TransferAllowanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencySymbol;
  members: FamilyMember[];
  targetMemberId?: string;
  onTransfer: (memberId: string, amount: number, note: string) => void;
}

export const TransferAllowanceModal: React.FC<TransferAllowanceModalProps> = ({
  isOpen,
  onClose,
  currency,
  members,
  targetMemberId = 'alex',
  onTransfer,
}) => {
  const [selectedMember, setSelectedMember] = useState(targetMemberId);
  const [amount, setAmount] = useState('50.00');
  const [sourceAccount, setSourceAccount] = useState('joint_checking');
  const [note, setNote] = useState('Bi-weekly allowance top-up');

  if (!isOpen) return null;

  const dependents = members.filter((m) => m.role === 'dependent');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;
    onTransfer(selectedMember, val, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#006c4a]/10 text-[#006c4a] flex items-center justify-center font-bold">
              <Wallet className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Transfer Allowance</h3>
              <p className="text-xs text-slate-500">Instant parent-to-dependent card funding</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Recipient
            </label>
            <div className="grid grid-cols-2 gap-2">
              {dependents.map((dep) => {
                const isSelected = selectedMember === dep.id;
                return (
                  <button
                    type="button"
                    key={dep.id}
                    onClick={() => setSelectedMember(dep.id)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#005c55] bg-[#f2f3ff] ring-1 ring-[#005c55]'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={dep.avatar}
                      alt={dep.name}
                      className="w-8 h-8 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{dep.name}</p>
                      <p className="text-[10px] text-slate-500">{dep.alias} · Card ••{dep.cardLast4}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Transfer Amount ({currency})
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 font-bold text-lg">
                {currency}
              </span>
              <input
                type="number"
                step="5.00"
                min="1.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-11 pl-8 pr-3 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold text-xl focus:outline-hidden focus:ring-2 focus:ring-[#005c55]/20 focus:border-[#005c55]"
              />
            </div>
            {/* Quick preset buttons */}
            <div className="flex gap-2 mt-2">
              {['25.00', '50.00', '100.00', '150.00'].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setAmount(preset)}
                  className={`flex-1 py-1 text-xs font-semibold rounded-lg border cursor-pointer transition-colors ${
                    amount === preset
                      ? 'bg-[#005c55] border-[#005c55] text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  +{currency}{preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Source Account
            </label>
            <select
              value={sourceAccount}
              onChange={(e) => setSourceAccount(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#005c55]/20 focus:border-[#005c55]"
            >
              <option value="joint_checking">Miller Joint Checking ••7701 (Chase)</option>
              <option value="sarah_card">Sarah Chase Sapphire ••4821</option>
              <option value="mark_card">Mark Amex Blue ••9012</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Transfer Memo / Note
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Weekly allowance, textbook support"
              className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#005c55]/20 focus:border-[#005c55]"
            />
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
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#005c55] hover:bg-[#004e48] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-[0.99] transition-transform"
            >
              <Check className="w-4 h-4" />
              <span>Confirm & Send Funds</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

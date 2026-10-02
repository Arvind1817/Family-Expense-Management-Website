import React, { useState } from 'react';
import { CurrencySymbol, FamilyMember, BudgetCategory, Transaction } from '../types';
import { X, Camera, Check, Receipt } from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencySymbol;
  members: FamilyMember[];
  categories: BudgetCategory[];
  onAddTransaction: (newTx: Partial<Transaction>) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  currency,
  members,
  categories,
  onAddTransaction,
}) => {
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || 'groceries');
  const [paidBy, setPaidBy] = useState(members[0]?.id || 'sarah');
  const [splitType, setSplitType] = useState<'joint_50_50' | 'full_pool' | 'allowance'>('joint_50_50');
  const [receiptAttached, setReceiptAttached] = useState(false);
  const [taxDeductible, setTaxDeductible] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const selectedMember = members.find((m) => m.id === paidBy);
    const selectedCategory = categories.find((c) => c.id === category);

    const splitLabel =
      splitType === 'joint_50_50'
        ? 'Joint (50/50)'
        : splitType === 'full_pool'
        ? 'Shared 100%'
        : `${selectedMember?.name.split(' ')[0]} Allowance`;

    onAddTransaction({
      merchant: merchant.trim() || 'Household Store',
      description: description.trim() || 'Shared expense',
      amount: parsedAmount,
      paidBy: selectedMember ? selectedMember.name : 'Sarah Miller',
      paidById: paidBy,
      category: selectedCategory ? selectedCategory.name : 'Groceries',
      categoryIcon: selectedCategory?.icon || 'shopping_cart',
      splitStatus: splitLabel,
      splitType: splitType,
      hasReceipt: receiptAttached,
      taxFlag: taxDeductible,
      paymentMethod: selectedMember ? `${selectedMember.cardName} ••${selectedMember.cardLast4}` : 'Joint Card',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#005c55]/10 text-[#005c55] flex items-center justify-center font-bold">
              <Receipt className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Add Family Expense</h3>
              <p className="text-xs text-slate-500">Record an item in the live joint ledger</p>
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
              Expense Amount ({currency})
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 font-bold text-base">
                {currency}
              </span>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full h-11 pl-8 pr-3 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold text-lg focus:outline-hidden focus:ring-2 focus:ring-[#005c55]/30 focus:border-[#005c55]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Merchant / Store
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Trader Joe's, Costco"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#005c55]/20 focus:border-[#005c55]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#005c55]/20 focus:border-[#005c55]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description / Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Weekly family groceries, school supplies"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#005c55]/20 focus:border-[#005c55]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payer (Family Member)
              </label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#005c55]/20 focus:border-[#005c55]"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.alias})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Split Protocol
              </label>
              <select
                value={splitType}
                onChange={(e) => setSplitType(e.target.value as any)}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#005c55]/20 focus:border-[#005c55]"
              >
                <option value="joint_50_50">Split 50/50 (Sarah & Mark)</option>
                <option value="full_pool">Shared 100% (Family Pool)</option>
                <option value="allowance">Individual Allowance Cap</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setReceiptAttached(!receiptAttached)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                receiptAttached
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{receiptAttached ? 'Receipt Attached (Simulated)' : 'Attach Receipt Photo'}</span>
            </button>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                checked={taxDeductible}
                onChange={(e) => setTaxDeductible(e.target.checked)}
                className="rounded text-[#005c55] focus:ring-[#005c55]"
              />
              <span>Tax Deductible / 529 Flag</span>
            </label>
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
              <span>Save & Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

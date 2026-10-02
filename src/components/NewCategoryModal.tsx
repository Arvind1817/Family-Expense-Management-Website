import React, { useState } from 'react';
import { CurrencySymbol } from '../types';
import { X, Plus, FolderPlus } from 'lucide-react';

interface NewCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencySymbol;
  onCreateCategory: (cat: { name: string; limit: number; icon: string; subtext: string }) => void;
}

export const NewCategoryModal: React.FC<NewCategoryModalProps> = ({
  isOpen,
  onClose,
  currency,
  onCreateCategory,
}) => {
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');
  const [icon, setIcon] = useState('category');
  const [subtext, setSubtext] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(limit);
    if (!name.trim() || isNaN(parsed) || parsed <= 0) return;
    onCreateCategory({
      name: name.trim(),
      limit: parsed,
      icon,
      subtext: subtext.trim() || 'Allocated family budget',
    });
    onClose();
  };

  const icons = [
    { id: 'pets', label: 'Pets' },
    { id: 'flight', label: 'Travel' },
    { id: 'fitness_center', label: 'Fitness' },
    { id: 'savings', label: 'Investments' },
    { id: 'celebration', label: 'Gifts & Parties' },
    { id: 'build', label: 'Home Repair' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#005c55]/10 text-[#005c55] flex items-center justify-center font-bold">
              <FolderPlus className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-base">New Budget Category</h3>
              <p className="text-xs text-slate-500">Create an envelope with monthly ceiling</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Category Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Pet Care & Vet, Travel Fund"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#005c55]/20 focus:border-[#005c55]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Monthly Budget Ceiling ({currency})
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold text-sm">
                {currency}
              </span>
              <input
                type="number"
                step="10.00"
                required
                placeholder="300.00"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full h-10 pl-7 pr-3 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#005c55]/20 focus:border-[#005c55]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Select Icon</label>
            <div className="grid grid-cols-3 gap-2">
              {icons.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setIcon(item.id)}
                  className={`p-2 rounded-lg border flex items-center gap-1.5 cursor-pointer transition-colors ${
                    icon === item.id
                      ? 'border-[#005c55] bg-[#f2f3ff] text-[#005c55] font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{item.id}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Subtext / Vendors</label>
            <input
              type="text"
              placeholder="e.g. Petco, Chewy, Vet clinic"
              value={subtext}
              onChange={(e) => setSubtext(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#005c55]/20 focus:border-[#005c55]"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#005c55] hover:bg-[#004e48] text-white font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Category</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

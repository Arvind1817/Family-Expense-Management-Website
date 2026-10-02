import React from 'react';
import { X, ShieldCheck, Landmark, Key, Users2, HelpCircle } from 'lucide-react';

interface HelpConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpConciergeModal: React.FC<HelpConciergeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#005c55]/10 text-[#005c55] flex items-center justify-center font-bold">
              <HelpCircle className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-base">KinSpend Support & Security</h3>
              <p className="text-xs text-slate-500">Collaborative family finance stewardship</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
            <Landmark className="w-5 h-5 text-[#005c55] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900 mb-0.5">Bank Connections & Plaid Link</p>
              <p className="text-slate-500 leading-relaxed">
                KinSpend connects with Chase Sapphire, Amex Gold, Discover Student, and Greenlight Teen cards via read-only Plaid API with automated webhook updates.
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900 mb-0.5">Zero-Knowledge Household Encryption</p>
              <p className="text-slate-500 leading-relaxed">
                All receipts, sensitive account numbers, and financial ledgers are protected with end-to-end 256-bit AES encryption.
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
            <Users2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900 mb-0.5">Parental Controls & Teen Guardrails</p>
              <p className="text-slate-500 leading-relaxed">
                Parents can set real-time daily spend limits ($25/day), enforce category blocks (Gaming & In-App purchases), and review textbook reimbursements with 1-click approvals.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#005c55] hover:bg-[#004e48] text-white text-xs font-semibold cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

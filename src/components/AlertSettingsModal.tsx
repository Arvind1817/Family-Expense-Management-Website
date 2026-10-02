import React, { useState } from 'react';
import { X, BellRing, ShieldAlert, Check } from 'lucide-react';

interface AlertSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlertSettingsModal: React.FC<AlertSettingsModalProps> = ({ isOpen, onClose }) => {
  const [threshold, setThreshold] = useState(80);
  const [pushParents, setPushParents] = useState(true);
  const [holdDebit, setHoldDebit] = useState(true);
  const [dailySms, setDailySms] = useState(true);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
              <BellRing className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Alert Rules & Safeguards</h3>
              <p className="text-xs text-slate-500">Automated thresholds and velocity triggers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {saved ? (
          <div className="py-8 text-center space-y-2">
            <Check className="w-12 h-12 text-emerald-600 mx-auto" />
            <p className="text-sm font-bold text-slate-900">Alert Rules Updated</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-800">Early Warning Threshold</span>
                <span className="font-bold text-[#005c55] text-sm">{threshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
                className="w-full accent-[#005c55] cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Alert parents when any category reaches {threshold}% of its monthly cap.
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushParents}
                  onChange={(e) => setPushParents(e.target.checked)}
                  className="rounded text-[#005c55] focus:ring-[#005c55] mt-0.5"
                />
                <div>
                  <span className="font-bold text-slate-800 block">Instant Push Notifications to Admins</span>
                  <span className="text-slate-500 text-[11px]">Send immediate app alerts to Sarah and Mark Miller.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={holdDebit}
                  onChange={(e) => setHoldDebit(e.target.checked)}
                  className="rounded text-[#005c55] focus:ring-[#005c55] mt-0.5"
                />
                <div>
                  <span className="font-bold text-slate-800 block">Temporary Hold on Non-Essential Joint Debit</span>
                  <span className="text-slate-500 text-[11px]">Pause discretionary card swipes if category hits 100%.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dailySms}
                  onChange={(e) => setDailySms(e.target.checked)}
                  className="rounded text-[#005c55] focus:ring-[#005c55] mt-0.5"
                />
                <div>
                  <span className="font-bold text-slate-800 block">Daily Morning Briefing (8:00 AM)</span>
                  <span className="text-slate-500 text-[11px]">Digest of safe-to-spend balance and pending settlement tabs.</span>
                </div>
              </label>
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
                className="px-5 py-2 rounded-lg bg-[#005c55] hover:bg-[#004e48] text-white font-semibold shadow-xs cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

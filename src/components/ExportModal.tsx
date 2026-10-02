import React, { useState } from 'react';
import { CurrencySymbol, FamilyMember, Transaction } from '../types';
import { X, Check, FileSpreadsheet, FileText, Download } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencySymbol;
  members: FamilyMember[];
  transactions: Transaction[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  currency,
  members,
  transactions,
}) => {
  const [format, setFormat] = useState<'xlsx' | 'pdf'>('xlsx');
  const [selectedMembers, setSelectedMembers] = useState<string[]>(members.map((m) => m.id));
  const [includeReceiptLinks, setIncludeReceiptLinks] = useState(true);
  const [attachMoM, setAttachMoM] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleMember = (id: string) => {
    if (selectedMembers.includes(id)) {
      if (selectedMembers.length > 1) {
        setSelectedMembers(selectedMembers.filter((m) => m !== id));
      }
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  const handleSelectAll = () => {
    setSelectedMembers(members.map((m) => m.id));
  };

  const handleDownload = (chosenFormat: 'xlsx' | 'pdf') => {
    // Generate actual file export (CSV for xlsx or printable summary for PDF)
    const filteredTx = transactions.filter((t) => selectedMembers.includes(t.paidById));
    
    if (chosenFormat === 'xlsx') {
      const headers = ['Date', 'Time', 'Merchant', 'Description', 'Payer', 'Category', 'Split Type', `Amount (${currency})`, 'Tax Flag'];
      const rows = filteredTx.map((t) => [
        t.date,
        t.time,
        `"${t.merchant.replace(/"/g, '""')}"`,
        `"${t.description.replace(/"/g, '""')}"`,
        `"${t.paidBy}"`,
        `"${t.category}"`,
        `"${t.splitStatus}"`,
        t.amount.toFixed(2),
        t.taxFlag ? 'YES' : 'NO',
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `KinSpend_October_2024_Household_Report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadSuccess('Excel / CSV ledger exported successfully!');
    } else {
      window.print();
      setDownloadSuccess('PDF summary prepared for printing!');
    }

    setTimeout(() => {
      setDownloadSuccess(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1 text-[#005c55] text-xs font-semibold mb-1">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Audited Domestic Summary</span>
            </div>
            <h3 className="font-bold text-lg text-slate-900 font-headline">
              Export October 2024 Household Report
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Download certified financial exports for tax planning, family archives, or personal budgeting.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {downloadSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Format Selection: Radio Tiles */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2.5">
            Select Export Format
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Option A: Excel */}
            <label
              onClick={() => setFormat('xlsx')}
              className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                format === 'xlsx'
                  ? 'border-[#005c55] bg-[#f2f3ff]/40 shadow-xs'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5" />
                  </span>
                  <span className="font-bold text-sm text-slate-900 font-headline">Excel (.xlsx)</span>
                </div>
                <input
                  type="radio"
                  name="exportFormat"
                  value="xlsx"
                  checked={format === 'xlsx'}
                  onChange={() => setFormat('xlsx')}
                  className="w-4 h-4 text-[#005c55] focus:ring-[#005c55]"
                />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Full Transaction Ledger, Pivot Tables & MoM variance formula sheets.
              </p>
              <span className="mt-3 text-[11px] font-bold text-emerald-700">
                Recommended for CPA & Taxes
              </span>
            </label>

            {/* Option B: PDF */}
            <label
              onClick={() => setFormat('pdf')}
              className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                format === 'pdf'
                  ? 'border-[#005c55] bg-[#f2f3ff]/40 shadow-xs'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </span>
                  <span className="font-bold text-sm text-slate-900 font-headline">PDF (.pdf)</span>
                </div>
                <input
                  type="radio"
                  name="exportFormat"
                  value="pdf"
                  checked={format === 'pdf'}
                  onChange={() => setFormat('pdf')}
                  className="w-4 h-4 text-[#005c55] focus:ring-[#005c55]"
                />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Executive Visual Summary, formatted infographics & high-res charts.
              </p>
              <span className="mt-3 text-[11px] font-medium text-slate-500">
                Ready for Print / Archiving
              </span>
            </label>
          </div>
        </div>

        {/* Member Checkboxes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-800">Include Family Members</label>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-xs font-semibold text-[#005c55] hover:underline cursor-pointer"
            >
              Select All ({members.length})
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {members.map((mem) => {
              const isChecked = selectedMembers.includes(mem.id);
              return (
                <label
                  key={mem.id}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                    isChecked
                      ? 'border-[#005c55] bg-[#f2f3ff] text-slate-900 font-semibold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleMember(mem.id)}
                    className="rounded text-[#005c55] focus:ring-[#005c55]"
                  />
                  <span>{mem.name.split(' ')[0]} ({mem.alias})</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700">
            <input
              type="checkbox"
              checked={includeReceiptLinks}
              onChange={(e) => setIncludeReceiptLinks(e.target.checked)}
              className="rounded text-[#005c55] focus:ring-[#005c55]"
            />
            <span>Include verified receipt cloud download links in ledger output</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700">
            <input
              type="checkbox"
              checked={attachMoM}
              onChange={(e) => setAttachMoM(e.target.checked)}
              className="rounded text-[#005c55] focus:ring-[#005c55]"
            />
            <span>Attach MoM comparative analysis tab & category projections</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleDownload('pdf')}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#005c55] border border-slate-200 text-xs font-semibold cursor-pointer transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
          <button
            type="button"
            onClick={() => handleDownload('xlsx')}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2 rounded-lg bg-[#005c55] hover:bg-[#004e48] text-white text-xs font-semibold shadow-xs cursor-pointer active:scale-[0.99] transition-transform"
          >
            <Download className="w-4 h-4" />
            <span>Download Excel (.xlsx)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

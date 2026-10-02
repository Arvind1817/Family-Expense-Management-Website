import React, { useState } from 'react';
import { CurrencySymbol } from '../types';
import {
  Users,
  Bell,
  HelpCircle,
  Plus,
  Download,
  ChevronDown,
  Check,
  ShieldCheck,
  CreditCard,
  Menu,
  X
} from 'lucide-react';

interface TopNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currency: CurrencySymbol;
  setCurrency: (c: CurrencySymbol) => void;
  onOpenAddExpense: () => void;
  onOpenExportModal: () => void;
  onOpenHelpModal: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  onOpenAddExpense,
  onOpenExportModal,
  onOpenHelpModal,
}) => {
  const [showHouseholdMenu, setShowHouseholdMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'members', label: 'Family Members' },
    { id: 'budgets', label: 'Budgets & Alerts' },
    { id: 'analytics', label: 'Analytics & Reports' },
  ];

  return (
    <header className="w-full fixed top-0 z-50 bg-white border-b border-[#e2e8f0] shadow-xs h-16 transition-colors">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Brand & Global Nav Links */}
        <div className="flex items-center gap-4 lg:gap-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-xl font-bold text-[#005c55] flex items-center gap-2.5 tracking-tight hover:opacity-95 transition-opacity"
          >
            <span className="w-8 h-8 rounded-lg bg-[#005c55] flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-[20px]">family_restroom</span>
            </span>
            <span className="font-headline tracking-tight">KinSpend</span>
          </button>

          {/* Household Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setShowHouseholdMenu(!showHouseholdMenu)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] border border-[#cbd5e1]/60 text-[#131b2e] cursor-pointer transition-colors text-xs font-semibold"
            >
              <span className="w-2 h-2 rounded-full bg-[#006c4a]"></span>
              <span>The Miller Family</span>
              <span className="text-[11px] bg-white px-1.5 py-0.5 rounded-full text-[#64748b] border border-[#cbd5e1]/40">
                4 members
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
            </button>

            {/* Household Switcher & Currency Popup */}
            {showHouseholdMenu && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#e2e8f0] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">Miller Household Vault</p>
                  <p className="text-[11px] text-slate-500">2 Parents · 2 Dependents · Joint Synced</p>
                </div>

                <div className="px-3.5 py-2">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1.5">
                    Currency Preference
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-lg">
                    <button
                      onClick={() => {
                        setCurrency('$');
                        setShowHouseholdMenu(false);
                      }}
                      className={`py-1 text-xs font-semibold rounded flex items-center justify-center gap-1 transition-colors ${
                        currency === '$' ? 'bg-white text-[#005c55] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>USD ($)</span>
                      {currency === '$' && <Check className="w-3 h-3 text-[#005c55]" />}
                    </button>
                    <button
                      onClick={() => {
                        setCurrency('₹');
                        setShowHouseholdMenu(false);
                      }}
                      className={`py-1 text-xs font-semibold rounded flex items-center justify-center gap-1 transition-colors ${
                        currency === '₹' ? 'bg-white text-[#005c55] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>INR (₹)</span>
                      {currency === '₹' && <Check className="w-3 h-3 text-[#005c55]" />}
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <div className="px-3.5 py-1.5 text-xs text-slate-600 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>256-bit AES Vault Encryption</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-6 h-16 pt-1 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`h-full flex items-center pb-1 border-b-2 transition-colors cursor-pointer text-[13px] ${
                    isActive
                      ? 'border-[#005c55] text-[#005c55] font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Trailing Profile & Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Trigger Export CTA Button on Analytics tab or generally */}
          <button
            onClick={onOpenExportModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f2f3ff] text-[#005c55] hover:bg-[#eaedff] border border-[#cbd5e1]/60 text-xs font-semibold transition-all active:scale-[0.99] cursor-pointer"
            title="Download verified monthly ledger summary"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>

          {/* Notification Icon */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              className="p-2 rounded-full text-slate-600 hover:bg-[#f2f3ff] transition-colors relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#e2e8f0] p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900">Notifications & Alerts</span>
                  <span className="text-[11px] font-semibold text-emerald-600">3 new</span>
                </div>
                <div className="divide-y divide-slate-100 text-xs mt-2">
                  <div className="py-2">
                    <p className="font-semibold text-amber-800">Groceries Budget at 86%</p>
                    <p className="text-slate-500 text-[11px]">Approaching 80% category limit cap ($1,280 / $1,500)</p>
                  </div>
                  <div className="py-2">
                    <p className="font-semibold text-rose-700">Dining Out Exceeded</p>
                    <p className="text-slate-500 text-[11px]">Exceeded budget by $60.00 following Cheesecake Factory dinner</p>
                  </div>
                  <div className="py-2">
                    <p className="font-semibold text-blue-700">ConEdison Scheduled</p>
                    <p className="text-slate-500 text-[11px]">Due in 3 days ($185.00 auto-pay scheduled)</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Help Icon */}
          <button
            onClick={onOpenHelpModal}
            aria-label="Help & Guidance"
            className="p-2 rounded-full text-slate-600 hover:bg-[#f2f3ff] transition-colors cursor-pointer"
            title="Help, Plaid Connections & Family Guardrails"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Primary Action: Add Expense */}
          <button
            onClick={onOpenAddExpense}
            className="flex items-center gap-1.5 bg-[#005c55] text-white px-3.5 py-2 rounded-lg text-xs font-semibold hover:bg-[#004e48] active:scale-[0.99] transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>

          {/* Sarah Avatar (Profile) */}
          <div className="relative flex items-center ml-1 border-l border-slate-200 pl-3">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1.5 cursor-pointer focus:outline-hidden"
              title="Sarah Miller (Mom / Admin)"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS1rIBSI5zryInlqvs9Q8_KbNclRx0yixQcH6ALlUbnF_av1GbCNQF5e-Ox-KRS-yZcE7Y23BTBz32FnrQUONZLChFN4LDG9YEcO_1Av670yXaFyLOEWGsNspRVMxScT33W3A8tX2lD0JfE_Dlg3f2VdgjmzB3bmE3yDAP9x8tVDsUr6KnjaX-T7oc-my5DRHdxZCUwwop-RoDmsSyhSlGmvjtuYOxiZn-Xyl6jHtX3Z9eHGnMpy2e"
                alt="Sarah Miller avatar"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#005c55]/20"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="w-8 h-8 rounded-full bg-[#005c55] text-white text-xs font-bold items-center justify-center hidden" id="avatarFallback">
                SM
              </span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-10 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#e2e8f0] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">Sarah Miller (Mom)</p>
                  <span className="inline-block mt-0.5 px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-semibold rounded-full">
                    Parent / Admin
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">sarah.miller@familyvault.io</p>
                </div>
                <div className="py-1 text-xs text-slate-700">
                  <button
                    onClick={() => {
                      setActiveTab('members');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Manage Member Cards</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('budgets');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    <span>Threshold Safeguards</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2 px-3 rounded-lg text-sm font-medium ${
                activeTab === link.id
                  ? 'bg-[#005c55] text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Currency</span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrency('$')}
                className={`px-2.5 py-1 text-xs rounded font-semibold ${
                  currency === '$' ? 'bg-[#005c55] text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('₹')}
                className={`px-2.5 py-1 text-xs rounded font-semibold ${
                  currency === '₹' ? 'bg-[#005c55] text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                INR (₹)
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

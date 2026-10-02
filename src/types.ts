export type CurrencySymbol = '$' | '₹';

export interface FamilyMember {
  id: string;
  name: string;
  alias: string;
  role: 'admin' | 'dependent';
  roleTag: string;
  roleDescription: string;
  avatar: string;
  avatarInitial: string;
  monthlySpend: number;
  budgetCap: number;
  available: number;
  transactionsCount: number;
  percentageUsed: number;
  cardName: string;
  cardLast4: string;
  cardType: string;
  cardStatus: 'Active' | 'Locked';
  topCategories: {
    name: string;
    icon: string;
    amount: number;
  }[];
  // Specific for teens / students
  isTeen?: boolean;
  isStudent?: boolean;
  age?: number;
  allowancePeriod?: string;
  refreshesInDays?: number;
  safetyVelocity?: string;
  dailyCap?: number;
  hasReimbursementRequest?: boolean;
  reimbursementDetails?: {
    id: string;
    amount: number;
    purpose: string;
    status: 'pending' | 'approved' | 'declined';
  };
}

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  spent: number;
  limit: number;
  subtext: string;
  percentage: number;
  status: 'normal' | 'caution' | 'critical';
  isLocked?: boolean;
  alertActive: boolean;
  septemberSpent: number;
  octoberSpent: number;
  variancePercentage: number;
  varianceDirection: 'up' | 'down';
}

export interface Transaction {
  id: string;
  date: string;
  time: string;
  merchant: string;
  description: string;
  paidBy: string;
  paidById: string;
  category: string;
  categoryIcon: string;
  splitStatus: string;
  splitType: 'joint_50_50' | 'full_pool' | 'allowance' | 'income';
  amount: number;
  isIncome?: boolean;
  hasReceipt: boolean;
  receiptUrl?: string;
  taxFlag?: boolean;
  paymentMethod: string;
  badgeBg?: string;
  badgeText?: string;
}

export interface BalanceSettlement {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  payerName: string;
  payerInitial: string;
  payerBg: string;
  payerText: string;
  recipientName: string;
  amount: number;
  status: 'pending' | 'settled' | 'archived';
  methodNote: string;
}

export interface ScheduledBill {
  id: string;
  day: number;
  dueDate: string;
  title: string;
  assignedPayer: string;
  amount: number;
  statusNote: string;
  isAutoPay: boolean;
  isPaid?: boolean;
}

export interface AlertTrigger {
  id: string;
  type: 'warning' | 'critical' | 'scheduled';
  title: string;
  category: string;
  triggeredTime: string;
  description: string;
  details: string;
  actionPrimaryText: string;
  actionSecondaryText: string;
  isDismissed?: boolean;
}

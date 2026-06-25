export type Role = 'admin' | 'lead' | 'ic';

export type ProductId = 'qtest' | 'neoload' | 'tosca' | 'aiworkspace';

export type Product = {
  id: ProductId;
  name: string;
  budget: number;
  used: number;
  alertThreshold: number;
};

export type Project = {
  id: string;
  name: string;
  productId: ProductId;
  memberIds: string[];
  creditsUsed: number;
  budget: number;
  isTeam?: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  projectIds: string[];
};

export type CreditEvent = {
  userId: string;
  projectId: string;
  productId: ProductId;
  agentId: string;
  credits: number;
  timestamp: string;
};

export type Alert = {
  id: string;
  productId: ProductId;
  projectId?: string;
  message: string;
  threshold: number;
  triggeredAt: string;
  isRead: boolean;
};

export type DateRange = 'day' | 'week' | 'month' | 'custom';
export type BurnRateWindow = '7d' | '30d' | 'billing';

export type Tenant = {
  id: string;
  name: string;
  totalCredits: number;
  renewalDate: string;
  products: Product[];
};

export type DailyUsage = {
  date: string;
  credits: number;
};

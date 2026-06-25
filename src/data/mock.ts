import type { Tenant, Product, Project, User, CreditEvent, Alert, DailyUsage } from '../types';

export const USERS: User[] = [
  { id: 'u1', name: 'Maria Santos', email: 'maria.santos@tricentis-demo.com', role: 'lead', projectIds: ['p-qt-1', 'p-qt-2'] },
  { id: 'u2', name: 'James Okafor', email: 'james.okafor@tricentis-demo.com', role: 'admin', projectIds: ['p-qt-1', 'p-nl-1', 'p-ts-1', 'p-ai-1'] },
  { id: 'u3', name: 'Priya Nair', email: 'priya.nair@tricentis-demo.com', role: 'ic', projectIds: ['p-qt-1'] },
  { id: 'u4', name: 'Tom Bergmann', email: 'tom.bergmann@tricentis-demo.com', role: 'ic', projectIds: ['p-qt-1', 'p-qt-2'] },
  { id: 'u5', name: 'Aisha Mensah', email: 'aisha.mensah@tricentis-demo.com', role: 'ic', projectIds: ['p-qt-1'] },
  { id: 'u6', name: 'Luca Ferrari', email: 'luca.ferrari@tricentis-demo.com', role: 'lead', projectIds: ['p-qt-2', 'p-qt-3'] },
  { id: 'u7', name: 'Sara Kim', email: 'sara.kim@tricentis-demo.com', role: 'ic', projectIds: ['p-qt-2'] },
  { id: 'u8', name: 'Diego Rios', email: 'diego.rios@tricentis-demo.com', role: 'ic', projectIds: ['p-qt-3', 'p-nl-1'] },
  { id: 'u9', name: 'Nina Petrov', email: 'nina.petrov@tricentis-demo.com', role: 'lead', projectIds: ['p-nl-1', 'p-nl-2'] },
  { id: 'u10', name: 'Omar Hassan', email: 'omar.hassan@tricentis-demo.com', role: 'ic', projectIds: ['p-nl-1'] },
  { id: 'u11', name: 'Claire Dubois', email: 'claire.dubois@tricentis-demo.com', role: 'ic', projectIds: ['p-nl-2', 'p-nl-3'] },
  { id: 'u12', name: 'Raj Patel', email: 'raj.patel@tricentis-demo.com', role: 'lead', projectIds: ['p-ts-1', 'p-ts-2'] },
  { id: 'u13', name: 'Ana Lima', email: 'ana.lima@tricentis-demo.com', role: 'ic', projectIds: ['p-ts-1'] },
  { id: 'u14', name: 'Felix Wagner', email: 'felix.wagner@tricentis-demo.com', role: 'ic', projectIds: ['p-ts-1', 'p-ts-2'] },
  { id: 'u15', name: 'Hana Novak', email: 'hana.novak@tricentis-demo.com', role: 'ic', projectIds: ['p-ts-2', 'p-ts-3'] },
  { id: 'u16', name: 'Ben Adeyemi', email: 'ben.adeyemi@tricentis-demo.com', role: 'lead', projectIds: ['p-ai-1', 'p-ai-2'] },
  { id: 'u17', name: 'Sophie Laurent', email: 'sophie.laurent@tricentis-demo.com', role: 'ic', projectIds: ['p-ai-1'] },
  { id: 'u18', name: 'Chen Wei', email: 'chen.wei@tricentis-demo.com', role: 'ic', projectIds: ['p-ai-1', 'p-ai-2'] },
  { id: 'u19', name: 'Elena Rossi', email: 'elena.rossi@tricentis-demo.com', role: 'ic', projectIds: ['p-ai-2', 'p-ai-3'] },
  { id: 'u20', name: 'Carlos Vega', email: 'carlos.vega@tricentis-demo.com', role: 'ic', projectIds: ['p-ai-3', 'p-ts-3'] },
];

export const PRODUCTS: Product[] = [
  { id: 'qtest', name: 'qTest / ATC', budget: 5000, used: 3800, alertThreshold: 0.8 },
  { id: 'neoload', name: 'NeoLoad', budget: 4000, used: 1680, alertThreshold: 0.8 },
  { id: 'tosca', name: 'Tosca', budget: 6000, used: 5520, alertThreshold: 0.8 },
  { id: 'aiworkspace', name: 'AI Workspace', budget: 5000, used: 4350, alertThreshold: 0.8 },
];

export const PROJECTS: Project[] = [
  { id: 'p-qt-1', name: 'Falcon Web App', productId: 'qtest', memberIds: ['u1', 'u2', 'u3', 'u4', 'u5'], creditsUsed: 1640, budget: 1800 },
  { id: 'p-qt-2', name: 'Phoenix Mobile', productId: 'qtest', memberIds: ['u1', 'u4', 'u6', 'u7'], creditsUsed: 1120, budget: 1600 },
  { id: 'p-qt-3', name: 'Orion API Suite', productId: 'qtest', memberIds: ['u6', 'u8'], creditsUsed: 1040, budget: 1200 },
  { id: 'p-nl-1', name: 'Load Testing Pipeline', productId: 'neoload', memberIds: ['u2', 'u8', 'u9', 'u10'], creditsUsed: 820, budget: 1400 },
  { id: 'p-nl-2', name: 'Perf Baseline Checkout', productId: 'neoload', memberIds: ['u9', 'u11'], creditsUsed: 580, budget: 1200 },
  { id: 'p-nl-3', name: 'Stress Test Suite', productId: 'neoload', memberIds: ['u11'], creditsUsed: 280, budget: 800 },
  { id: 'p-ts-1', name: 'ERP Automation', productId: 'tosca', memberIds: ['u2', 'u12', 'u13', 'u14'], creditsUsed: 2100, budget: 2200 },
  { id: 'p-ts-2', name: 'SAP Regression', productId: 'tosca', memberIds: ['u12', 'u14', 'u15'], creditsUsed: 1980, budget: 2000 },
  { id: 'p-ts-3', name: 'Desktop App Tests', productId: 'tosca', memberIds: ['u15', 'u20'], creditsUsed: 1440, budget: 1800 },
  { id: 'p-ai-1', name: 'AI Copilot POC', productId: 'aiworkspace', memberIds: ['u2', 'u16', 'u17', 'u18'], creditsUsed: 2100, budget: 2000, isTeam: true },
  { id: 'p-ai-2', name: 'GenAI Test Gen', productId: 'aiworkspace', memberIds: ['u16', 'u18', 'u19'], creditsUsed: 1400, budget: 1600, isTeam: true },
  { id: 'p-ai-3', name: 'Prompt Playground', productId: 'aiworkspace', memberIds: ['u19', 'u20'], creditsUsed: 850, budget: 1400, isTeam: true },
];

export const TENANT: Tenant = {
  id: 'tenant-1',
  name: 'Tricentis Demo Corp',
  totalCredits: 20000,
  renewalDate: '2027-03-31',
  products: PRODUCTS,
};

export const ALERTS: Alert[] = [
  {
    id: 'a1',
    productId: 'tosca',
    message: 'Tosca has reached 92% of its credit budget (5,520 / 6,000 credits used).',
    threshold: 0.8,
    triggeredAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    isRead: false,
  },
  {
    id: 'a2',
    productId: 'aiworkspace',
    projectId: 'p-ai-1',
    message: 'AI Copilot POC project has exceeded its budget (2,100 / 2,000 credits used).',
    threshold: 0.8,
    triggeredAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isRead: false,
  },
  {
    id: 'a3',
    productId: 'aiworkspace',
    message: 'AI Workspace has reached 87% of its credit budget (4,350 / 5,000 credits used).',
    threshold: 0.8,
    triggeredAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    isRead: true,
  },
  {
    id: 'a4',
    productId: 'qtest',
    message: 'qTest / ATC has reached 76% of its credit budget (3,800 / 5,000 credits used).',
    threshold: 0.8,
    triggeredAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    isRead: true,
  },
];

function generateDailyUsage(avgDaily: number, days: number, variance = 0.3): DailyUsage[] {
  const result: DailyUsage[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const factor = 1 + (Math.random() - 0.5) * variance * 2;
    result.push({
      date: date.toISOString().split('T')[0],
      credits: Math.round(avgDaily * factor),
    });
  }
  return result;
}

export const DAILY_USAGE: Record<string, DailyUsage[]> = {
  qtest: generateDailyUsage(42, 90),
  neoload: generateDailyUsage(19, 90),
  tosca: generateDailyUsage(61, 90),
  aiworkspace: generateDailyUsage(48, 90),
};

const agentIds = ['agent-atc-v2', 'agent-gen-ai', 'agent-nlw', 'agent-tosca-ai', 'agent-workspace'];

export function generateCreditEvents(): CreditEvent[] {
  const events: CreditEvent[] = [];
  const now = new Date();

  PROJECTS.forEach((project) => {
    const members = project.memberIds;
    const totalCredits = project.creditsUsed;
    const eventCount = Math.floor(totalCredits / 5);

    for (let i = 0; i < eventCount; i++) {
      const daysAgo = Math.floor(Math.random() * 90);
      const ts = new Date(now);
      ts.setDate(ts.getDate() - daysAgo);

      events.push({
        userId: members[Math.floor(Math.random() * members.length)],
        projectId: project.id,
        productId: project.productId,
        agentId: agentIds[Math.floor(Math.random() * agentIds.length)],
        credits: Math.floor(Math.random() * 15) + 1,
        timestamp: ts.toISOString(),
      });
    }
  });

  return events;
}

export const CREDIT_EVENTS = generateCreditEvents();

export function getUserCreditsInProject(userId: string, projectId: string): number {
  return CREDIT_EVENTS.filter((e) => e.userId === userId && e.projectId === projectId)
    .reduce((sum, e) => sum + e.credits, 0);
}

export function getProjectUserCredits(projectId: string): Array<{ user: User; credits: number; requestCount: number }> {
  const project = PROJECTS.find((p) => p.id === projectId)!;
  return project.memberIds
    .map((uid) => {
      const user = USERS.find((u) => u.id === uid)!;
      const events = CREDIT_EVENTS.filter((e) => e.userId === uid && e.projectId === projectId);
      return {
        user,
        credits: events.reduce((s, e) => s + e.credits, 0),
        requestCount: events.length,
      };
    })
    .sort((a, b) => b.credits - a.credits);
}

export function calcBurnRate(dailyUsage: DailyUsage[], windowDays: number): number {
  const slice = dailyUsage.slice(-windowDays);
  if (slice.length === 0) return 0;
  return slice.reduce((s, d) => s + d.credits, 0) / slice.length;
}

export function calcRenewalHealth(used: number, budget: number, renewalDate: string, dailyUsage: DailyUsage[], window: '7d' | '30d' | 'billing'): {
  isAtRisk: boolean;
  monthsBeforeRenewal?: number;
  estimatedExhaustionDate?: string;
  daysRemaining?: number;
  dailyBurnRate: number;
} {
  const now = new Date();
  const renewal = new Date(renewalDate);
  const daysToRenewal = Math.ceil((renewal.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const remaining = budget - used;

  const windowDays = window === '7d' ? 7 : window === '30d' ? 30 : Math.max(dailyUsage.length, 7);
  const dailyBurnRate = calcBurnRate(dailyUsage, windowDays);

  if (dailyBurnRate <= 0) {
    return { isAtRisk: false, dailyBurnRate: 0 };
  }

  const daysRemaining = Math.round(remaining / dailyBurnRate);
  const exhaustionDate = new Date(now);
  exhaustionDate.setDate(exhaustionDate.getDate() + daysRemaining);

  const isAtRisk = daysRemaining < daysToRenewal;
  const monthsBeforeRenewal = isAtRisk
    ? Math.round((daysToRenewal - daysRemaining) / 30)
    : undefined;

  return {
    isAtRisk,
    monthsBeforeRenewal,
    estimatedExhaustionDate: exhaustionDate.toISOString().split('T')[0],
    daysRemaining,
    dailyBurnRate: Math.round(dailyBurnRate),
  };
}

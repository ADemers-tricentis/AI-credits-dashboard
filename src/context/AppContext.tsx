import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Role, DateRange, BurnRateWindow } from '../types';

type AppContextValue = {
  role: Role;
  setRole: (r: Role) => void;
  dateRange: DateRange;
  setDateRange: (d: DateRange) => void;
  burnRateWindow: BurnRateWindow;
  setBurnRateWindow: (w: BurnRateWindow) => void;
  currentUserId: string;
};

const AppContext = createContext<AppContextValue | null>(null);

const ROLE_USER_MAP: Record<Role, string> = {
  admin: 'u2',
  lead: 'u1',
  ic: 'u3',
};

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('admin');
  const [dateRange, setDateRange] = useState<DateRange>('month');
  const [burnRateWindow, setBurnRateWindow] = useState<BurnRateWindow>('billing');

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        dateRange,
        setDateRange,
        burnRateWindow,
        setBurnRateWindow,
        currentUserId: ROLE_USER_MAP[role],
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppContextProvider');
  return ctx;
}

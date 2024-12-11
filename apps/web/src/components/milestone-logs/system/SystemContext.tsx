import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

// 1. Define the shape of the context state
type SystemMilestone = {
  id: string;
  start_date: string | undefined;
  status: string;
  notes: string | undefined;
};
interface SystemContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedMilestone: SystemMilestone | null;
  setSelectedMilestone: (milestone: SystemMilestone | null) => void;
}

// 2. Create the context with an initial undefined value
const SystemContext = createContext<SystemContextType | undefined>(undefined);

// 3. Create the provider component and props type
interface SystemProviderProps {
  children: ReactNode;
}

export const SystemProvider: React.FC<SystemProviderProps> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedMilestone, setSelectedMilestone] = useState<SystemMilestone | null>(null);

  const value = useMemo(
    () => ({ open, setOpen, selectedMilestone, setSelectedMilestone }),
    [open, selectedMilestone],
  );

  return <SystemContext.Provider value={value}>{children}</SystemContext.Provider>;
};

// 4. Custom hook to use the context
export const useSystem = (): SystemContextType => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};

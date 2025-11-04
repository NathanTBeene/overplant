import { useStage } from "@/hooks/useStage";
import { useAlert } from "@/hooks/useAlert";
import { createContext, useContext, type FC, type ReactNode } from "react";

interface AppContextType {
  // Add more hooks here as needed
  stage: ReturnType<typeof useStage>;
  showAlert: ReturnType<typeof useAlert>["showAlert"];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const stage = useStage();
  const { showAlert, AlertDialogComponent } = useAlert();
  // Add more hooks here as needed

  const value: AppContextType = {
    stage,
    showAlert,
    // Add more hooks here as needed
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      {AlertDialogComponent}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// Specific hook context accessors
export const useStageContext = () => useAppContext().stage;
export const useAlertDialog = () => useAppContext().showAlert;

export { AppProvider };

import { useAlert } from "@/hooks/useAlert";
import { createContext, useContext, type FC, type ReactNode } from "react";

interface AppContextType {
  // Add more hooks here as needed
  showAlert: ReturnType<typeof useAlert>["showAlert"];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const { showAlert, AlertDialogComponent } = useAlert();
  // Add more hooks here as needed

  const value: AppContextType = {
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

// Specific hook context accessors
export const useAlertDialog = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAlertDialog must be used within an AppProvider");
  }
  return context.showAlert;
}

export { AppProvider };

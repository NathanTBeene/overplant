import { useAlert } from "@/hooks/useAlert";
import { createContext, useContext, type FC, type ReactNode } from "react";
import useModal from '../hooks/useModal';
import useMapImportExport from '@/hooks/useMapImportExport';

interface AppContextType {
  showAlert: ReturnType<typeof useAlert>["showAlert"];
  showModal: ReturnType<typeof useModal>["openModal"];
  exportMap: ReturnType<typeof useMapImportExport>["exportMap"];
  importMap: ReturnType<typeof useMapImportExport>["importMap"];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const { showAlert, AlertDialogComponent } = useAlert();
  const { openModal: showModal, ModalComponent } = useModal();
  const { exportMap, importMap } = useMapImportExport(showAlert);

  const value: AppContextType = {
    showAlert,
    showModal,
    exportMap,
    importMap,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      {ModalComponent}
      {AlertDialogComponent}
    </AppContext.Provider>
  );
};

export const useAlertDialog = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAlertDialog must be used within an AppProvider");
  }
  return context.showAlert;
}

export const useModalDialog = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useModalDialog must be used within an AppProvider");
  }
  return context.showModal;
}

export const useMapImportExportDialog = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useMapImportExportDialog must be used within an AppProvider");
  }
  return { exportMap: context.exportMap, importMap: context.importMap };
}

export { AppProvider };

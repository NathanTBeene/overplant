import { useAppStore } from "@/stores/useAppStore"
import { useUIStore } from "@/stores/useUIStore";
import useFileDialog from "./useFileDialog";
import { useCallback } from "react";
import { encryptData, decryptData } from "@/utils/crypt";

interface ExportData {
  elements: ReturnType<typeof useAppStore.getState>["elements"];
  timestamp: string;
  version: string;
}

const useMapImportExport = () => {
  const  { openFileDialog } = useFileDialog();
  const elements = useAppStore((state) => state.elements);
  const setElements = useAppStore((state) => state.setElements);
  const showAlert = useUIStore((state) => state.showAlert);

  const exportMap = useCallback(async (mapName: string) => {
    const exportData: ExportData = {
      elements,
      timestamp: new Date().toISOString(),
      version: "1.0",
    };

    const json = JSON.stringify(exportData, null, 2);
    const encrypted = await encryptData(json, "overplant");

    const blob = new Blob([encrypted], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${mapName.toLowerCase().replace(/[^a-z0-9]/g, '-') || "map"}.map`;
    link.click();

    URL.revokeObjectURL(url);
  }, [elements]);

  const importMap = useCallback(async () => {
    try {
      const file = await openFileDialog({ accept: ".map" });
      if (!file) return;

      const fileToImport = Array.isArray(file) ? file[0] : file;
      if (!fileToImport.name.endsWith(".map")) {
        showAlert({
          title: "Invalid File",
          description: "Please select a valid .map file.",
          type: "ok"
        });
        return;
      }

      const text = await fileToImport.text();
      const decoded = await decryptData(text, "overplant");
      const data: ExportData = JSON.parse(decoded);

      setElements(data.elements);
      showAlert({
        title: "Map Imported",
        description: "Map imported successfully!",
        type: "ok"
      })
    } catch (error) {
      console.error("Error importing map:", error);
      showAlert({
        title: "Import Failed",
        description: "Failed to import map. Please make sure the file is a valid .map file.",
        type: "ok"
      })
    }
  }, [openFileDialog, setElements, showAlert]);

  return { exportMap, importMap };
}

export default useMapImportExport

import { useAppStore } from "@/stores/useAppStore";
import { useUIStore } from "@/stores/useUIStore";
import useFileDialog from "./useFileDialog";
import { useCallback } from "react";
import { encryptData, decryptData } from "@/utils/crypt";
import type { Sequence } from "@/types/Sequence";
import type { MapElement } from "@/types/MapElement";

interface ExportDataV2 {
  sequences: Sequence[];
  timestamp: string;
  version: "2.0";
}

interface ExportDataV1 {
  elements: MapElement[];
  timestamp: string;
  version: "1.0";
}

type ExportData = ExportDataV2 | ExportDataV1;

const makeEmptySequences = (): Sequence[] =>
  Array.from({ length: 10 }, () => ({ elements: [], thumbnail: null }));

const useMapImportExport = () => {
  const { openFileDialog } = useFileDialog();
  const showAlert = useUIStore((state) => state.showAlert);

  const exportMap = useCallback(async (mapName: string) => {
    useAppStore.getState().saveCurrentToSequence();
    const sequences = useAppStore.getState().sequences;

    // Strip thumbnails from export (they're large and regenerate on hover)
    const exportSequences: Sequence[] = sequences.map((s) => ({
      elements: s.elements,
      thumbnail: null,
    }));

    const exportData: ExportDataV2 = {
      sequences: exportSequences,
      timestamp: new Date().toISOString(),
      version: "2.0",
    };

    const json = JSON.stringify(exportData, null, 2);
    const encrypted = await encryptData(json, "overplant");

    const blob = new Blob([encrypted], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${mapName.toLowerCase().replace(/[^a-z0-9]/g, "-") || "map"}.map`;
    link.click();

    URL.revokeObjectURL(url);
  }, []);

  const importMap = useCallback(async () => {
    try {
      const file = await openFileDialog({ accept: ".map" });
      if (!file) return;

      const fileToImport = Array.isArray(file) ? file[0] : file;
      if (!fileToImport.name.endsWith(".map")) {
        showAlert({
          title: "Invalid File",
          description: "Please select a valid .map file.",
          type: "ok",
        });
        return;
      }

      const text = await fileToImport.text();
      const decoded = await decryptData(text, "overplant");
      const data: ExportData = JSON.parse(decoded);

      if (data.version === "1.0") {
        // Backwards compat: wrap v1 elements into sequence 0
        const sequences = makeEmptySequences();
        sequences[0] = { elements: (data as ExportDataV1).elements, thumbnail: null };
        useAppStore.getState().setSequences(sequences);
      } else {
        // v2.0
        const sequences = makeEmptySequences();
        const imported = (data as ExportDataV2).sequences;
        imported.forEach((seq, i) => {
          if (i < 10) sequences[i] = { elements: seq.elements, thumbnail: null };
        });
        useAppStore.getState().setSequences(sequences);
      }

      showAlert({
        title: "Map Imported",
        description: "Map imported successfully!",
        type: "ok",
      });
    } catch (error) {
      console.error("Error importing map:", error);
      showAlert({
        title: "Import Failed",
        description: "Failed to import map. Please make sure the file is a valid .map file.",
        type: "ok",
      });
    }
  }, [openFileDialog, showAlert]);

  return { exportMap, importMap };
};

export default useMapImportExport;

import { useAppStore } from "@/stores/useAppStore";

const DebugOverlay = () => {
  const stagePosition = useAppStore((s) => s.stagePosition);
  const stageScale = useAppStore((s) => s.stageScale);
  const selectedElementId = useAppStore((s) => s.selectedElementId);
  const isDrawing = useAppStore((s) => s.isDrawing);
  const activeTool = useAppStore((s) => s.activeTool);
  const toolSettings = useAppStore((s) => s.toolSettings);

  return (
    <div className="absolute top-4 left-4 px-4 py-2 z-10 rounded-md bg-fill-dark">
      <p>Stage Position: {`(${stagePosition.x}, ${stagePosition.y})`}</p>
      <p>Stage Scale: {stageScale.toFixed(2)}</p>
      <p>Selected Element ID: {selectedElementId || "None"}</p>
      <p>Is Drawing: {isDrawing ? "Yes" : "No"}</p>
      <p>Active Tool: {activeTool || "None"}</p>
      {activeTool === "pen" && (
        <p>Brush: {toolSettings.pen.brushType}</p>
      )}
    </div>
  );
};

export default DebugOverlay;

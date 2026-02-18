import { Info } from "lucide-react";
import Switch from "../ui/Switch";
import { useAppStore } from "@/stores/useAppStore";
import Tooltip from "../ui/Tooltip";
import { useState } from "react";
import ValueSlider from "./ValueSlider";

interface SettingsOptionProps {
  name: string;
  description: string;
  value: boolean | string | number;
  onChange: (value: boolean | string | number) => void;
}

const SettingsOption = ({ name, description, value, onChange }: SettingsOptionProps) => {
  return (
    <div className="mb-4 flex flex-row w-full justify-between items-center">
      <div className="flex items-center gap-2">
        <h2 className="font-bold text-lg">{name}</h2>
        <Tooltip
          content={<div>{description}</div>}
          properties={{ side: "right", delay: 200 }}
        >
          <Info size={18} className="text-gray-400" />
        </Tooltip>
      </div>
      <div className="flex items-center">
        {typeof value === "boolean" ? (
          <Switch checked={value} onCheckedChange={onChange} />
        ) : ""}
      </div>
    </div>
  );
};

const TABS = ["General", "Sequence"] as const;
type Tab = (typeof TABS)[number];

const EASING_OPTIONS: { label: string; value: "linear" | "ease-in-out" | "spring" }[] = [
  { label: "Linear", value: "linear" },
  { label: "Ease", value: "ease-in-out" },
  { label: "Spring", value: "spring" },
];

const SettingsModal = () => {
  const [activeTab, setActiveTab] = useState<Tab>("General");
  const settings = useAppStore((state) => state.settings);
  const setSettings = useAppStore((state) => state.setSettings);

  return (
    <div className="min-w-100 min-h-100">
      <h1 className="font-bold text-3xl">Settings</h1>
      <p className="text-gray-500 text-sm mb-6">Settings will persist in local storage.</p>

      {/* Tab Bar */}
      <div className="flex gap-2 mb-8 border-b border-fill-dark">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-150 border-b-2 -mb-px ${
              activeTab === tab
                ? "border-accent text-accent-active"
                : "border-transparent text-gray-400 hover:text-text"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "General" && (
        <>
          <SettingsOption
            name="Debug Panel"
            description="Show debug panel with additional info about map elements."
            value={settings.debugOverlay}
            onChange={(value) => setSettings({ ...settings, debugOverlay: value as boolean })}
          />
          <SettingsOption
            name="Hero Transformers"
            description="Show transformers for hero elements. This allows you to move/resize heroes, but can get in the way when trying to select other elements close to heroes."
            value={settings.showHeroTransformers}
            onChange={(value) => setSettings({ ...settings, showHeroTransformers: value as boolean })}
          />
        </>
      )}

      {activeTab === "Sequence" && (
        <div className="flex flex-col gap-6">
          {/* Easing */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="font-bold text-lg">Transition Easing</h2>
              <Tooltip
                content={<div>Controls the motion curve when animating between sequences.</div>}
                properties={{ side: "right", delay: 200 }}
              >
                <Info size={18} className="text-gray-400" />
              </Tooltip>
            </div>
            <div className="flex gap-2">
              {EASING_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSettings({ ...settings, sequenceEasing: opt.value })}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                    settings.sequenceEasing === opt.value
                      ? "bg-accent text-white"
                      : "bg-fill hover:bg-fill-dark text-text"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transition Time */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="font-bold text-lg">Transition Time</h2>
              <Tooltip
                content={<div>How long the animation between sequences takes (ms).</div>}
                properties={{ side: "right", delay: 200 }}
              >
                <Info size={18} className="text-gray-400" />
              </Tooltip>
              <span className="ml-auto text-sm text-gray-400">{settings.sequenceTransitionDuration}ms</span>
            </div>
            <ValueSlider
              min={100}
              max={2000}
              step={50}
              startingValue={settings.sequenceTransitionDuration}
              onValueChange={(v) => setSettings({ ...settings, sequenceTransitionDuration: v[0] })}
            />
          </div>

          {/* Hold Time */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="font-bold text-lg">Hold Time</h2>
              <Tooltip
                content={<div>How long to pause on each sequence during auto-play (ms).</div>}
                properties={{ side: "right", delay: 200 }}
              >
                <Info size={18} className="text-gray-400" />
              </Tooltip>
              <span className="ml-auto text-sm text-gray-400">{settings.sequenceHoldTime}ms</span>
            </div>
            <ValueSlider
              min={0}
              max={5000}
              step={100}
              startingValue={settings.sequenceHoldTime}
              onValueChange={(v) => setSettings({ ...settings, sequenceHoldTime: v[0] })}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsModal;

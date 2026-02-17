import { Info } from "lucide-react"
import Switch from "../ui/Switch"
import { useAppStore } from "@/stores/useAppStore"
import Tooltip from "../ui/Tooltip"

interface SettingsOptionProps {
  name: string,
  description: string,
  value: boolean | string | number,
  onChange: (value: boolean | string | number) => void,
}

const SettingsOption = ({ name, description, value, onChange }: SettingsOptionProps) => {

  return (
    <div className="mb-4 flex flex-row w-full justify-between items-center">
      {/* Name and Description */}
      <div className="flex items-center gap-2">
        <h2 className="font-bold text-lg">{name}</h2>
        <Tooltip
          content={(
            <div>{description}</div>
          )}
          properties={{
            side: "right",
            delay: 200,
          }}
        >
          <Info size={18} className="text-gray-400"/>
        </Tooltip>
      </div>
      {/* Value */}
      <div className="flex items-center">
        {typeof value === "boolean" ? (
          <Switch checked={value} onCheckedChange={onChange} />
        ): ""}
      </div>
    </div>
  )
}

const SettingsModal = () => {

  const settings = useAppStore((state) => state.settings)

  return (
    <div className='min-w-100 min-h-100'>
      <h1 className="font-bold text-3xl mb-4">Settings</h1>

      <SettingsOption
        name="Debug Panel"
        description="Show debug panel with additional info about map elements."
        value={settings.debugOverlay}
        onChange={(value) => useAppStore.getState().setSettings({ ...settings, debugOverlay: value as boolean })}
      />

    </div>
  )
}

export default SettingsModal

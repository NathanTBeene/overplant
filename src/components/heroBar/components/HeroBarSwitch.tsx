import * as Switch from "@radix-ui/react-switch";

interface HeroBarSwitchProps {
  isAlly: boolean;
  onToggle: (isAlly: boolean) => void;
}

const HeroBarSwitch = ({ isAlly, onToggle }: HeroBarSwitchProps) => {
  return (
    <div className="w-75 h-full flex flex-row items-center justify-center">
      <span className="w-10 text-xl font-medium text-right">
        {isAlly ? "Ally" : "Enemy"}
      </span>

      <Switch.Root
        checked={isAlly}
        onCheckedChange={onToggle}
        className={`w-20 h-10 rounded-lg relative data-[state=checked]:bg-overwatch-ally/50 data-[state=unchecked]:bg-overwatch-enemy/50 ml-10`}
      >
        <Switch.Thumb className="block w-8 h-8 shadow-lg rounded-lg data-[state=checked]:bg-overwatch-ally data-[state=unchecked]:bg-overwatch-enemy transition-transform translate-x-2 data-[state=checked]:translate-x-10" />
      </Switch.Root>
    </div>
  );
};

export default HeroBarSwitch;

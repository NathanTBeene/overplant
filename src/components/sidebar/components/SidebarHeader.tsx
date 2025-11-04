import { Info } from "lucide-react";

interface SidebarHeaderProps {
  title: string;
  tooltip?: string;
}

const SidebarHeader = ({ title, tooltip }: SidebarHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font font-semibold">{title}</h1>
      {tooltip && <Info size={18} />}
    </div>
  );
};

export default SidebarHeader;

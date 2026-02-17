import * as RTooltip from "@radix-ui/react-tooltip";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  properties?: {
    delay?: number;
    side?: "top" | "right" | "bottom" | "left";
    sideOffset?: number;
    align?: "start" | "center" | "end";
    alignOffset?: number;
    maxWidth?: number;
  }
  styleOverrides?: React.CSSProperties;
}

const Tooltip = ({ content, children, properties, styleOverrides }: TooltipProps) => {

  if (!content || content === '') {
    return <>{children}</>;
  }

  return (
    <RTooltip.Root delayDuration={properties?.delay || 500}>
      <RTooltip.Trigger asChild>{children}</RTooltip.Trigger>
      <RTooltip.Portal>
        <RTooltip.Content
          className="bg-fill text-text px-2 py-1 rounded-md z-1000 TooltipContent"
          side={properties?.side || "top"}
          sideOffset={properties?.sideOffset || 5}
          align={properties?.align || "center"}
          alignOffset={properties?.alignOffset || 0}
          style={{ ...styleOverrides, maxWidth: properties?.maxWidth || 200 }}
        >
          {content}
        </RTooltip.Content>
      </RTooltip.Portal>
    </RTooltip.Root>
  )
}

export default Tooltip

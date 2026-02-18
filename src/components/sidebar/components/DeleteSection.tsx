import { User, Shapes, LineSquiggle, TextSelect, Image } from "lucide-react";
import SidebarHeader from "./SidebarHeader";
import { useUIStore } from "@/stores/useUIStore";
import { useAppStore } from "@/stores/useAppStore";
import Tooltip from '@/components/ui/Tooltip';

const DeleteSection = () => {
  // TODO: Finish implementation
  const showAlert = useUIStore((s) => s.showAlert);
  // const [currentSequence, setCurrentSequence] = useState<number>(1);

  const { elements, removeElement, clearElements } = useAppStore.getState();
  const activeSequenceIndex = useAppStore((s) => s.activeSequenceIndex);
  const clearSequence = useAppStore((s) => s.clearSequence);


  const onDeleteEverything = async () => {
    const response = await showAlert({
      title: "Delete Everything?",
      description: "Are you sure you want to delete all items?",
      type: "yes-no-cancel",
      required: true
    });

    if (response !== "yes") return;

    clearElements();
  };

  const onDeleteSequenceStep = async () => {
    const response = await showAlert({
      title: `Clear Sequence ${activeSequenceIndex + 1}?`,
      description: `Are you sure you want to clear all elements in Sequence ${activeSequenceIndex + 1}? This cannot be undone.`,
      type: "yes-no-cancel",
      required: true,
    });

    if (response !== "yes") return;
    clearSequence(activeSequenceIndex);
  };


  const onDeleteElementType = async (type: string) => {
    const response = await showAlert({
      title: `Delete All ${type}?`,
      description: `Are you sure you want to delete all ${type.toLowerCase()}? This action cannot be undone.`,
      type: "yes-no-cancel",
      required: true
    });

    if (response !== "yes") return;

    switch (type) {
      case "heroes": {
        const heroElements = elements.filter(el => el.type === "hero")
        heroElements.forEach(el => removeElement(el.id));
        break;
      }
      case "shapes": {
        const shapeElements = elements.filter(el => el.type === "rectangle" || el.type === "circle")
        shapeElements.forEach(el => removeElement(el.id));
        break;
      }
      case "lines": {
        const lineElements = elements.filter(el => el.type === "line" || el.type === "arrow")
        lineElements.forEach(el => removeElement(el.id));
        break;
      }
      case "text": {
        const textElements = elements.filter(el => el.type === "text")
        textElements.forEach(el => removeElement(el.id));
        break;
      }
      case "images": {
        const imageElements = elements.filter(el => el.type === "image")
        imageElements.forEach(el => removeElement(el.id));
        break;
      }
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      <SidebarHeader title="Delete" />
      <DeleteButton
        text="Everything"
        className="h-12 bg-accent! hover:bg-cancel!"
        onClick={onDeleteEverything}
      />
      <DeleteButton text={`Sequence ${activeSequenceIndex + 1}`} onClick={onDeleteSequenceStep} />
      <div className="flex gap-2 ">
        <DeleteButton
          icon={<User />}
          tooltip="Hero Portraits"
          onClick={() => onDeleteElementType("heroes")}
        />
        <DeleteButton
          icon={<Shapes />}
          tooltip="Shapes"
          onClick={() => onDeleteElementType("shapes")}
        />
        <DeleteButton
          icon={<LineSquiggle />}
          tooltip="Lines"
          onClick={() => onDeleteElementType("lines")}
        />
        <DeleteButton
          icon={<TextSelect />}
          tooltip="Text"
          onClick={() => onDeleteElementType("text")}
        />
        <DeleteButton
          icon={<Image />}
          tooltip="Images"
          onClick={() => onDeleteElementType("images")}
        />
      </div>
    </div>
  );
};

const DeleteButton = ({
  icon,
  text,
  className,
  onClick,
  tooltip,
}: {
  icon?: React.ReactNode;
  text?: string;
  className?: string;
  onClick?: () => void;
  tooltip?: string;
}) => {
  return (
    <Tooltip
      content={tooltip || ''}
      properties={{
        side: 'bottom',
      }}
    >
      <button
        className={`bg-fill hover:bg-fill-hover hover:cursor-pointer transition-all duration-200 w-full h-10 rounded-md flex items-center justify-center text-xl font-semibold ${className}`}
        onClick={onClick}
      >
        {icon || text}

      </button>
    </Tooltip>
  );
};

export default DeleteSection;

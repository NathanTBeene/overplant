import { useStageContext } from "@/providers/AppProvider";
import { Image } from "react-konva";
import useImage from "use-image";

const MapImage = ({ src }: { src: string }) => {
  const [image] = useImage(src);

  const { mapSide } = useStageContext();

  const scale = mapSide == "Defense" ? -1 : 1;
  const offsetx = mapSide == "Defense" ? image?.width ?? 0 : 0;
  const offsety = mapSide == "Defense" ? image?.height ?? 0 : 0;

  return (
    <Image
      id={`map-image-${mapSide.toLowerCase()}`}
      image={image}
      scaleX={scale}
      scaleY={scale}
      x={offsetx}
      y={offsety}
    />
  );
};

export default MapImage;

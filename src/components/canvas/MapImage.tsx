import { useAppStore } from "@/stores/useAppStore";
import { useEffect } from "react";
import { Image } from "react-konva";
import useImage from "use-image";

const MapImage = ({ src }: { src: string }) => {
  const [image] = useImage(src);

  const mapSide = useAppStore((s) => s.mapSide);
  const setMapImageSize = useAppStore((s) => s.setMapImageSize);

  const scale = mapSide == "Defense" ? -1 : 1;
  const offsetx = mapSide == "Defense" ? image?.width ?? 0 : 0;
  const offsety = mapSide == "Defense" ? image?.height ?? 0 : 0;

  useEffect(() => {
    if (image) {
      setMapImageSize({ width: image.width, height: image.height });
    }
  }, [image, setMapImageSize]);

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

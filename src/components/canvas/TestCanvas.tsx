import { Stage, Layer, Image } from "react-konva";
import useImage from "use-image";

const TestCanvas = () => {
  const [image] = useImage("/src/assets/maps/blizzardworld/map.png");

  const stageWidth = window.innerWidth;
  const stageHeight = window.innerHeight;
  const imageWidth = 5000;
  const imageHeight = 5000;

  return (
    <Stage
      width={stageWidth}
      height={stageHeight}
      scaleX={1}
      scaleY={1}
      x={0}
      y={0}
      draggable
    >
      <Layer>
        <Image
          image={image}
          width={imageWidth}
          height={imageHeight}
          scaleX={-1}
          scaleY={-1}
          x={stageWidth / 2}
          y={stageHeight / 2}
          offsetX={imageWidth / 2}
          offsetY={imageHeight / 2}
        />
      </Layer>
    </Stage>
  );
};

export default TestCanvas;

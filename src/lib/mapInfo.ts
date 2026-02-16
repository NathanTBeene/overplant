export interface Map {
  id: string;
  name: string;
  mapImage: string;
  headerImage: string;
  initialSettings: InitialSettings;
  type: "control" | "escort" | "push" | "flashpoint" | "assault" | "hybrid";
}

type InitialSettings = {
  attack: {
    scale: number;
    position: { x: number; y: number };
  };
  defense: {
    scale: number;
    position: { x: number; y: number };
  };
};

export const mapsInfo: Map[] = [
  {
    id: "blizzardworld",
    name: "Blizzard World",
    mapImage: "/src/assets/maps/blizzardworld/map.png",
    headerImage: "/src/assets/maps/blizzardworld/header.webp",
    initialSettings: {
      attack: {
        scale: 0.4,
        position: { x: -200, y: -380 },
      },
      defense: {
        scale: 0.4,
        position: { x: -2200, y: -380 },
      },
    },
    type: "hybrid",
  },
  {
    id: "busan",
    name: "Busan",
    mapImage: "/src/assets/maps/busan/map.png",
    headerImage: "/src/assets/maps/busan/header.webp",
    initialSettings: {
      attack: {
        scale: 0.4,
        position: { x: -150, y: -530 },
      },
      defense: {
        scale: 0.4,
        position: { x: -150, y: -530 },
      },
    },
    type: "control",
  },
  {
    id: "eichenwalde",
    name: "Eichenwalde",
    mapImage: "/src/assets/maps/eichenwalde/map.png",
    headerImage: "/src/assets/maps/eichenwalde/header.webp",
    initialSettings: {
      attack: {
        scale: 0.6,
        position: { x: -770, y: -1700 },
      },
      defense: {
        scale: 0.6,
        position: { x: -770, y: -1700 },
      },
    },
    type: "hybrid",
  },
  {
    id: "hanamura",
    name: "Hanamura",
    mapImage: "/src/assets/maps/hanamura/map.png",
    headerImage: "/src/assets/maps/hanamura/header.webp",
    initialSettings: {
      attack: {
        scale: 0.4,
        position: { x: -160, y: -520 },
      },
      defense: {
        scale: 0.4,
        position: { x: -160, y: -520 },
      },
    },
    type: "assault",
  },
  {
    id: "havana",
    name: "Havana",
    mapImage: "/src/assets/maps/havana/map.png",
    headerImage: "/src/assets/maps/havana/header.webp",
    initialSettings: {
      attack: {
        scale: 0.7,
        position: { x: -1160, y: -800 },
      },
      defense: {
        scale: 0.75,
        position: { x: -1352, y: -2733 },
      },
    },
    type: "escort",
  },
  {
    id: "hollywood",
    name: "Hollywood",
    mapImage: "/src/assets/maps/hollywood/map.png",
    headerImage: "/src/assets/maps/hollywood/header.webp",
    initialSettings: {
      attack: {
        scale: 0.6,
        position: { x: -280, y: -1400 },
      },
      defense: {
        scale: 0.6,
        position: { x: -280, y: -1400 },
      },
    },
    type: "hybrid",
  },
  {
    id: "ilios",
    name: "Ilios",
    mapImage: "/src/assets/maps/ilios/map.png",
    headerImage: "/src/assets/maps/ilios/header.webp",
    initialSettings: {
      attack: {
        scale: 0.5,
        position: { x: -580, y: -720 },
      },
      defense: {
        scale: 0.5,
        position: { x: -580, y: -720 },
      },
    },
    type: "control",
  },
  {
    id: "kingsrow",
    name: "King's Row",
    mapImage: "/src/assets/maps/kingsrow/map.png",
    headerImage: "/src/assets/maps/kingsrow/header.png",
    initialSettings: {
      attack: {
        scale: 0.5,
        position: { x: -1230, y: -1350 },
      },
      defense: {
        scale: 0.5,
        position: { x: 149, y: -303 },
      },
    },
    type: "hybrid",
  },
];

export const getInitialMapSettings = (mapId: string, side: "Attack" | "Defense") => {
  const map = mapsInfo.find((m) => m.id === mapId);
  if (!map) {
    return null;
  }

  const { attack, defense } = map.initialSettings;
  return side === "Attack" ? attack : defense;
};

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
    mapImage: "./assets/maps/blizzardworld/map.png",
    headerImage: "./assets/maps/blizzardworld/header.webp",
    initialSettings: {
      attack: {
        scale: 0.4,
        position: { x: 0, y: -1060 },
      },
      defense: {
        scale: 0.4,
        position: { x: -870, y: -500 },
      },
    },
    type: "hybrid",
  },
  {
    id: "busan",
    name: "Busan",
    mapImage: "./assets/maps/busan/map.png",
    headerImage: "./assets/maps/busan/header.webp",
    initialSettings: {
      attack: {
        scale: 0.2,
        position: { x: -297, y: -55 },
      },
      defense: {
        scale: 0.2,
        position: { x: -297, y: -55 },
      },
    },
    type: "control",
  },
  {
    id: "eichenwalde",
    name: "Eichenwalde",
    mapImage: "./assets/maps/eichenwalde/map.png",
    headerImage: "./assets/maps/eichenwalde/header.webp",
    initialSettings: {
      attack: {
        scale: 0.6,
        position: { x: -1470, y: -1680 },
      },
      defense: {
        scale: 0.5,
        position: { x: -431, y: -155 },
      },
    },
    type: "hybrid",
  },
  {
    id: "hanamura",
    name: "Hanamura",
    mapImage: "./assets/maps/hanamura/map.png",
    headerImage: "./assets/maps/hanamura/header.webp",
    initialSettings: {
      attack: {
        scale: 0.4,
        position: { x: -25, y: -905 },
      },
      defense: {
        scale: 0.4,
        position: { x: -690, y: -100 },
      },
    },
    type: "assault",
  },
  {
    id: "havana",
    name: "Havana",
    mapImage: "./assets/maps/havana/map.png",
    headerImage: "./assets/maps/havana/header.webp",
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
    mapImage: "./assets/maps/hollywood/map.png",
    headerImage: "./assets/maps/hollywood/header.webp",
    initialSettings: {
      attack: {
        scale: 0.6,
        position: { x: -45, y: -1680 },
      },
      defense: {
        scale: 0.6,
        position: { x: -1090, y: -740 },
      },
    },
    type: "hybrid",
  },
  {
    id: "ilios",
    name: "Ilios",
    mapImage: "./assets/maps/ilios/map.png",
    headerImage: "./assets/maps/ilios/header.webp",
    initialSettings: {
      attack: {
        scale: 0.2,
        position: { x: -425, y: -65 },
      },
      defense: {
        scale: 0.2,
        position: { x: -250, y: -35 },
      },
    },
    type: "control",
  },
  {
    id: "junkertown",
    name: "Junkertown",
    mapImage: "./assets/maps/junkertown/map.png",
    headerImage: "./assets/maps/junkertown/header.webp",
    initialSettings: {
      attack: {
        scale: 0.4,
        position: { x: -10, y: -1050 },
      },
      defense: {
        scale: 0.4,
        position: { x: -892, y: -473 },
      },
    },
    type: "escort",
  },
  {
    id: "kingsrow",
    name: "King's Row",
    mapImage: "./assets/maps/kingsrow/map.png",
    headerImage: "./assets/maps/kingsrow/header.png",
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
  {
    id: "lijiangtower",
    name: "Lijiang Tower",
    mapImage: "./assets/maps/lijiangtower/map.png",
    headerImage: "./assets/maps/lijiangtower/header.webp",
    initialSettings: {
      attack: {
        scale: 0.2,
        position: { x: -180, y: -50 },
      },
      defense: {
        scale: 0.2,
        position: { x: -480, y: -80 },
      },
    },
    type: "control",
  },
  {
    id: "nepal",
    name: "Nepal",
    mapImage: "./assets/maps/nepal/map.png",
    headerImage: "./assets/maps/nepal/header.png",
    initialSettings: {
      attack: {
        scale: 0.2,
        position: { x: -230, y: -70 },
      },
      defense: {
        scale: 0.2,
        position: { x: 149, y: -303 },
      },
    },
    type: "control",
  },
  {
    id: "numbani",
    name: "Numbani",
    mapImage: "./assets/maps/numbani/map.png",
    headerImage: "./assets/maps/numbani/header.webp",
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
  {
    id: "rialto",
    name: "Rialto",
    mapImage: "./assets/maps/rialto/map.png",
    headerImage: "./assets/maps/rialto/header.webp",
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
    type: "escort",
  },
  {
    id: "route66",
    name: "Route 66",
    mapImage: "./assets/maps/route66/map.png",
    headerImage: "./assets/maps/route66/header.webp",
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
    type: "escort",
  },
  {
    id: "watchpointgibraltar",
    name: "Watchpoint: Gibraltar",
    mapImage: "./assets/maps/watchpointgibraltar/map.png",
    headerImage: "./assets/maps/watchpointgibraltar/header.webp",
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
    type: "assault",
  }
];

export const getInitialMapSettings = (mapId: string, side: "Attack" | "Defense") => {
  const map = mapsInfo.find((m) => m.id === mapId);
  if (!map) {
    return null;
  }

  const { attack, defense } = map.initialSettings;
  return side === "Attack" ? attack : defense;
};

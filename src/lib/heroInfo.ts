export interface HeroInfo {
  id: string;
  name: string;
  role: "Tank" | "Damage" | "Support";
  portrait: string;
  abilities?: {
    name: string;
    icon: string;
    description: string;
  }[];
}

export const heroesInfo: HeroInfo[] = [
  {
    id: "ana",
    name: "Ana",
    role: "Support",
    portrait: "/src/assets/portraits/Ana.png",
  },
  {
    id: "ashe",
    name: "Ashe",
    role: "Damage",
    portrait: "/src/assets/portraits/Ashe.png",
  },
  {
    id: "baptiste",
    name: "Baptiste",
    role: "Support",
    portrait: "/src/assets/portraits/Baptiste.png",
  },
  {
    id: "bastion",
    name: "Bastion",
    role: "Damage",
    portrait: "/src/assets/portraits/Bastion.png",
  },
  {
    id: "brigitte",
    name: "Brigitte",
    role: "Support",
    portrait: "/src/assets/portraits/Brigitte.png",
  },
  {
    id: "cassidy",
    name: "Cassidy",
    role: "Damage",
    portrait: "/src/assets/portraits/Cassidy.png",
  },
  {
    id: "doomfist",
    name: "Doomfist",
    role: "Damage",
    portrait: "/src/assets/portraits/Doomfist.png",
  },
  {
    id: "dva",
    name: "D.Va",
    role: "Tank",
    portrait: "/src/assets/portraits/DVA.png",
  },
  {
    id: "echo",
    name: "Echo",
    role: "Damage",
    portrait: "/src/assets/portraits/Echo.png",
  },
];

export const getRoleHeroes = (role: "Tank" | "Damage" | "Support"): HeroInfo[] => {
  return heroesInfo.filter((hero) => hero.role === role);
};

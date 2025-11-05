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
    role: "Tank",
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
  {
    id: "freija",
    name: "Freija",
    role: "Damage",
    portrait: "/src/assets/portraits/Freija.png",
  },
  {
    id: "genji",
    name: "Genji",
    role: "Damage",
    portrait: "/src/assets/portraits/Genji.png",
  },
  {
    id: "hanzo",
    name: "Hanzo",
    role: "Damage",
    portrait: "/src/assets/portraits/Hanzo.png",
  },
  {
    id: "hazzard",
    name: "Hazzard",
    role: "Tank",
    portrait: "/src/assets/portraits/Hazzard.png",
  },
  {
    id: "illari",
    name: "Illari",
    role: "Support",
    portrait: "/src/assets/portraits/Illari.png",
  },
  {
    id: "junkerqueen",
    name: "Junker Queen",
    role: "Tank",
    portrait: "/src/assets/portraits/JunkerQueen.png",
  },
  {
    id: "junkrat",
    name: "Junkrat",
    role: "Damage",
    portrait: "/src/assets/portraits/Junkrat.png",
  },
  {
    id: "juno",
    name: "Juno",
    role: "Support",
    portrait: "/src/assets/portraits/Juno.png",
  },
  {
    id: "kiriko",
    name: "Kiriko",
    role: "Support",
    portrait: "/src/assets/portraits/Kiriko.png",
  },
  {
    id: "lifeweaver",
    name: "Lifeweaver",
    role: "Support",
    portrait: "/src/assets/portraits/Lifeweaver.png",
  },
  {
    id: "lucio",
    name: "Lucio",
    role: "Support",
    portrait: "/src/assets/portraits/Lucio.png",
  },
  {
    id: "mauga",
    name: "Mauga",
    role: "Tank",
    portrait: "/src/assets/portraits/Mauga.png",
  },
  {
    id: "mei",
    name: "Mei",
    role: "Damage",
    portrait: "/src/assets/portraits/Mei.png",
  },
  {
    id: "mercy",
    name: "Mercy",
    role: "Support",
    portrait: "/src/assets/portraits/Mercy.png",
  },
  {
    id: "moira",
    name: "Moira",
    role: "Support",
    portrait: "/src/assets/portraits/Moira.png",
  },
];

export const getRoleHeroes = (role: "Tank" | "Damage" | "Support"): HeroInfo[] => {
  return heroesInfo.filter((hero) => hero.role === role);
};

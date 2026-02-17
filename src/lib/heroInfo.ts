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
    portrait: "./assets/portraits/Ana.png",
  },
  {
    id: "anran",
    name: "Anran",
    role: "Damage",
    portrait: "./assets/portraits/Anran.png",
  },
  {
    id: "ashe",
    name: "Ashe",
    role: "Damage",
    portrait: "./assets/portraits/Ashe.png",
  },
  {
    id: "baptiste",
    name: "Baptiste",
    role: "Support",
    portrait: "./assets/portraits/Baptiste.png",
  },
  {
    id: "bastion",
    name: "Bastion",
    role: "Damage",
    portrait: "./assets/portraits/Bastion.png",
  },
  {
    id: "brigitte",
    name: "Brigitte",
    role: "Support",
    portrait: "./assets/portraits/Brigitte.png",
  },
  {
    id: "cassidy",
    name: "Cassidy",
    role: "Damage",
    portrait: "./assets/portraits/Cassidy.png",
  },
  {
    id: "domina",
    name: "Domina",
    role: "Tank",
    portrait: "./assets/portraits/Domina.png",
  },
  {
    id: "doomfist",
    name: "Doomfist",
    role: "Tank",
    portrait: "./assets/portraits/Doomfist.png",
  },
  {
    id: "dva",
    name: "D.Va",
    role: "Tank",
    portrait: "./assets/portraits/DVA.png",
  },
  {
    id: "echo",
    name: "Echo",
    role: "Damage",
    portrait: "./assets/portraits/Echo.png",
  },
  {
    id: "emre",
    name: "Emre",
    role: "Damage",
    portrait: "./assets/portraits/Emre.png",
  },
  {
    id: "freija",
    name: "Freija",
    role: "Damage",
    portrait: "./assets/portraits/Freija.png",
  },
  {
    id: "genji",
    name: "Genji",
    role: "Damage",
    portrait: "./assets/portraits/Genji.png",
  },
  {
    id: "hanzo",
    name: "Hanzo",
    role: "Damage",
    portrait: "./assets/portraits/Hanzo.png",
  },
  {
    id: "hazzard",
    name: "Hazzard",
    role: "Tank",
    portrait: "./assets/portraits/Hazzard.png",
  },
  {
    id: "illari",
    name: "Illari",
    role: "Support",
    portrait: "./assets/portraits/Illari.png",
  },
  {
    id: "jetpackcat",
    name: "Jetpack Cat",
    role: "Support",
    portrait: "./assets/portraits/JetpackCat.png",
  },
  {
    id: "junkerqueen",
    name: "Junker Queen",
    role: "Tank",
    portrait: "./assets/portraits/JunkerQueen.png",
  },
  {
    id: "junkrat",
    name: "Junkrat",
    role: "Damage",
    portrait: "./assets/portraits/Junkrat.png",
  },
  {
    id: "juno",
    name: "Juno",
    role: "Support",
    portrait: "./assets/portraits/Juno.png",
  },
  {
    id: "kiriko",
    name: "Kiriko",
    role: "Support",
    portrait: "./assets/portraits/Kiriko.png",
  },
  {
    id: "lifeweaver",
    name: "Lifeweaver",
    role: "Support",
    portrait: "./assets/portraits/Lifeweaver.png",
  },
  {
    id: "lucio",
    name: "Lucio",
    role: "Support",
    portrait: "./assets/portraits/Lucio.png",
  },
  {
    id: "mauga",
    name: "Mauga",
    role: "Tank",
    portrait: "./assets/portraits/Mauga.png",
  },
  {
    id: "mei",
    name: "Mei",
    role: "Damage",
    portrait: "./assets/portraits/Mei.png",
  },
  {
    id: "mercy",
    name: "Mercy",
    role: "Support",
    portrait: "./assets/portraits/Mercy.png",
  },
  {
    id: "mizuki",
    name: "Mizuki",
    role: "Support",
    portrait: "./assets/portraits/Mizuki.png",
  },
  {
    id: "moira",
    name: "Moira",
    role: "Support",
    portrait: "./assets/portraits/Moira.png",
  },
  {
    id: "vendetta",
    name: "Vendetta",
    role: "Damage",
    portrait: "./assets/portraits/Vendetta.png",
  }
];

export const getRoleHeroes = (role: "Tank" | "Damage" | "Support"): HeroInfo[] => {
  return heroesInfo.filter((hero) => hero.role === role);
};

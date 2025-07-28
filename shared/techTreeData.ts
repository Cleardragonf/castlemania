export interface TechNode {
  id: string;
  name: string;
  cost: number;
  benefits?: TechBenefits;
  description: string;
  category: string; 
  unlocked: boolean;
  prerequisites: string[];
  position: { x: number; y: number };
}

export interface TechNode {
  id: string;
  name: string;
  cost: number;
  description: string;
  category: string;
  unlocked: boolean;
  prerequisites: string[];
  position: { x: number; y: number };
}

export interface TechNode {
  id: string;
  name: string;
  cost: number;
  description: string;
  category: string; 
  unlocked: boolean;
  prerequisites: string[]; 
  position: { x: number; y: number }; 
}

// Top-level categories:
// - Survival
// - Toolmaking (split into Basic Tools, Weapons, Armor, Smithing, etc.)
// - Agriculture & Food
// - Construction & Infrastructure
// - Metalwork & Materials
// - Medicine & Health
// - Energy & Power
// - Communication & Information
// - Transportation & Navigation
// - Science & Theory
// - Computing & Automation

export type TechBenefits = Partial<{
  food: number;
  ore: number;
  coins: number;
  books: number;
  tools: number;
  weapons: number;
  armor: number;
  maps: number;
  health: number;
  power: number;
  knowledge: number;
  efficiency: number;
  automation: number;
}>;


export const technologyTree: TechNode[] = [
  {
    id: "fire_starting",
    name: "Fire Starting",
    cost: 10,
    benefits: { food: 2, health: 1 },
    description: "Harness fire for warmth and cooking.",
    category: "Survival",
    unlocked: false,
    prerequisites: [],
    position: { x: 0, y: 0 },
  },
  {
    id: "citizen_breeding",
    name: "Citizen Breeding",
    cost: 20,
    description: "Encourage citizens to breed for population growth.",
    category: "Survival",
    unlocked: false,
    prerequisites: ["fire_starting"],
    position: { x: 0, y: -1 },
  },
  {
    id: "wooden_tools",
    name: "Wooden Tools",
    cost: 15,
    benefits: { tools: 1 },
    description: "Basic tools made from wood.",
    category: "Toolmaking",
    unlocked: false,
    prerequisites: ["fire_starting"],
    position: { x: 1, y: 0 },
  },
    {
    id: "stone_tools",
    name: "Stone Tools",
    cost: 10,
    benefits: { tools: 1 },
    description: "Basic tools made from stone.",
    category: "Toolmaking",
    unlocked: false,
    prerequisites: ["wooden_tools"], 
    position: { x: 2, y: 0 },
  },
  {
    id: "agriculture",
    name: "Agriculture",
    cost: 20,
    benefits: { food: 3 },
    description: "Cultivate crops for food.",
    category: "Agriculture & Food",
    unlocked: false,
    prerequisites: [],
    position: { x: 0, y: -1 },
  },
  {
    id: "basic_weapons",
    name: "Basic Weapons",
    cost: 25,
    benefits: { weapons: 1 },
    description: "Craft basic weapons for defense.",
    category: "Toolmaking",
    unlocked: false,
    prerequisites: ["wooden_tools"],
    position: { x: 1, y: 1 },
  },
  {
    id: "basic_armor",
    name: "Basic Armor",
    cost: 30,
    benefits: { armor: 1 },
    description: "Craft basic armor for protection.",
    category: "Toolmaking",
    unlocked: false,
    prerequisites: ["wooden_tools"],
    position: { x: 1, y: 2 },
  },
  {
    id: "smithing",
    name: "Smithing",
    cost: 40,
    benefits: { tools: 1 },
    description: "Forge metal tools and weapons.",
    category: "Metalwork & Materials",
    unlocked: false,
    prerequisites: ["stone_tools"],
    position: { x: 3, y: 0 },
  },
  {
    id: "advanced_agriculture",
    name: "Advanced Agriculture",
    cost: 50,
    benefits: { food: 5 },
    description: "Improve crop yields and farming techniques.",
    category: "Agriculture & Food",
    unlocked: false,
    prerequisites: ["agriculture"],
    position: { x: 4, y: 0 },
  },
  {
    id: "advanced_weapons",
    name: "Advanced Weapons",
    cost: 60,
    benefits: { weapons: 1 },
    description: "Craft advanced weapons for combat.",
    category: "Toolmaking",
    unlocked: false,
    prerequisites: ["basic_weapons", "smithing"],
    position: { x: 2, y: 1 },
  },
  {
    id: "advanced_armor",
    name: "Advanced Armor",
    cost: 70,
    benefits: { armor: 1 },
    description: "Craft advanced armor for better protection.",
    category: "Toolmaking",
    unlocked: false,
    prerequisites: ["basic_armor", "smithing"],
    position: { x: 2, y: 2 },
  },
  {
    id: "medicine",
    name: "Medicine",
    cost: 80,
    benefits: { health: 2 },
    description: "Develop medical knowledge and practices.",
    category: "Medicine & Health",
    unlocked: false,
    prerequisites: ["agriculture"],
    position: { x: 3, y: 2 },
  },
  {
    id: "energy_sources",
    name: "Energy Sources",
    cost: 90,
    benefits: { power: 1 },
    description: "Discover and utilize various energy sources.",
    category: "Energy & Power",
    unlocked: false,
    prerequisites: ["smithing"],
    position: { x: 4, y: 1 },
  },
  {
    id: "communication",
    name: "Communication",
    cost: 100,
    benefits: { knowledge: 1 },
    description: "Establish methods of communication.",
    category: "Communication & Information",
    unlocked: false,
    prerequisites: ["medicine"],
    position: { x: 5, y: 0 },
  },
  {
    id: "navigation",
    name: "Navigation",
    cost: 110,
    benefits: { knowledge: 1 },
    description: "Develop navigation techniques and tools.",
    category: "Transportation & Navigation",
    unlocked: false,
    prerequisites: ["communication"],
    position: { x: 6, y: 0 },
  },
  {
    id: "computing",
    name: "Computing",
    cost: 120,
    benefits: { knowledge: 1 },
    description: "Create basic computing devices and algorithms.",
    category: "Computing & Automation",
    unlocked: false,
    prerequisites: ["navigation"],
    position: { x: 7, y: 0 },
  },
  {
    id: "automation",
    name: "Automation",
    cost: 130,
    benefits: { automation: 1 },
    description: "Automate processes using computing.",
    category: "Computing & Automation",
    unlocked: false,
    prerequisites: ["computing"],
    position: { x: 8, y: 0 },
  },
];
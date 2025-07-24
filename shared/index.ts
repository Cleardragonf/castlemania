export interface Loot {
  coins?: number;
  books?: number;
  swords?: number;
  shields?: number;
  wood?: number;
  stone?: number;
  maps?: number;
  boots?: number;
  food?: number;
  ore?: number;
  tools?: number;
  [key: string]: number | undefined; // 👈 this line allows dynamic access

}

export interface ProfessionDetails {
  name: string;
  cost: number;
  value: number;
}

export const professionList: ProfessionDetails[] = [
  { name: 'Warrior', cost: 2, value: 4 },
  { name: 'Builder', cost: 1, value: 3 },
  { name: 'Explorer', cost: 1, value: 3 },
  { name: 'farmer', cost: 1, value: 2 },
  { name: 'miner', cost: 2, value: 3 },
  { name: 'blacksmith', cost: 3, value: 5 },
  { name: 'carpenter', cost: 2, value: 3 },
  { name: 'hunter', cost: 1, value: 3 },
  { name: 'merchant', cost: 2, value: 4 },
  { name: 'soldier', cost: 2, value: 4 },
  { name: 'scholar', cost: 3, value: 5 },
  { name: 'artisan', cost: 2, value: 4 },
];

export type Profession = typeof professionList[number]['name'];

type ProfessionMap = {
  [key in Profession]?: number;
};

export interface People extends ProfessionMap {
  citizen?: number;
}


export interface Resources {
  loot?: Loot;
  people?: People;
}

export interface GameSession {
  id: number;
  userId: number;
  day: number;
  loot: Loot;
}

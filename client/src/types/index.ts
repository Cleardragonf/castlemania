export interface Loot {
  coins?: number;
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
// types.ts

export const professionList = [
  'Warrior',
  'Builder',
  'Explorer',
  'farmer',
  'miner',
  'blacksmith',
  'carpenter',
  'hunter',
  'merchant',
  'soldier',
  'scholar',
  'artisan',
] as const;

export type Profession = typeof professionList[number];

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

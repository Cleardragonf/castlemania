import { People, Resources } from ".";
import { TechBenefits } from "./techTreeData";

    const resources: Resources = {};
    const currentLoot = resources.loot ?? {};
  
    // Create a copy of loot that we'll mutate
    const updatedLoot = { ...currentLoot };
  
    // Define logic per profession
export const professionLootMap: {
    [profession: string]: (count: number, benefits: TechBenefits) => Partial<typeof updatedLoot>
} = {
    farmer: (count, benefits) => ({ food: count * 3 + (benefits.food ?? 0) }),
    miner: (count, benefits) => ({ ore: (updatedLoot.ore ?? 0) + count + (benefits.ore ?? 0) }),
    taxCollector: (count, benefits) => ({ coins: (updatedLoot.coins ?? 0) + count * 3 + (benefits.coins ?? 0) }),
    scholar: (count, benefits) => ({ books: count + (benefits.books ?? 0) }),
    blacksmith: (count) => ({ tools: (updatedLoot.tools ?? 0) + count }),
    explorer: (count) => ({ maps: count }),
  };

export const foodConsumptionPerProfession: { [profession: string]: number } = {
    warrior: 3,
    scholar: 2,
    taxCollector: 2,
  };

  
import { getAllTechnologyBenefits } from '@shared/global';
import { Resources, People } from '@shared/index';
import { foodConsumptionPerProfession, professionLootMap } from '@shared/professions';
import { TechNode } from '@shared/techTreeData';

export function applyWeeklyLogic(day: number, currentResources: Resources) {
  // Ensure people is at least an empty object
  const people: People = currentResources.people ?? {};

  // Ensure loot is defined with coins defaulting to 0
  const loot = {
    coins: currentResources.loot?.coins ?? 0,
    // Add other loot types if you want, e.g. swords, shields, etc.
  };

  // Calculate total citizens (values in people are numbers)
  const totalCitizens = Object.values(people).reduce((sum: number, count: number | undefined) => {
    return sum + (count ?? 0);
  }, 0);



  // Copy currentResources to new object, updating loot.coins if it's the 7th day
  const updated: Resources = {
    ...currentResources,
    people,
    loot: {
      ...currentResources.loot,
        coins: day % 7 === 0 ? loot.coins + (totalCitizens as number) : loot.coins,
    },
  };
  return updated;
}

export function applyProfessionLogic(day: number, resources: Resources, tech: TechNode[]) {
  const people: People = resources.people ?? {};
  const currentLoot = resources.loot ?? {};
  const updatedLoot = { ...currentLoot };

  const benefits = getAllTechnologyBenefits(tech); // 🧠 pass this into each reward function

  for (const [profession, count] of Object.entries(people)) {
    if (typeof count !== 'number') continue;

    const rewardFn = professionLootMap[profession.toLowerCase()];
    if (rewardFn) {
      const rewards = rewardFn(count, benefits); // ✅ use benefits
      for (const [lootType, amount] of Object.entries(rewards)) {
        if (typeof amount === 'number') {
          updatedLoot[lootType] = (updatedLoot[lootType] ?? 0) + amount;
        }
      }
    }
  }

  return {
    ...resources,
    people,
    loot: updatedLoot,
  };
}

function isCountDefinedAndPositive(entry: [string, number | undefined]): entry is [string, number] {
  const count = entry[1];
  return typeof count === 'number' && count > 0;
}


export function applyDailyLogic(day: number, resources: Resources, tech: TechNode[]){
  const people: People = { ...resources.people };
  const loot = resources.loot ?? {};
  const foodAvailable = loot.food ?? 0;

  console.log("Testing Tech Tree:", tech);

  let totalFoodNeeded = 0;
  for (const [profession, count] of Object.entries(people)) {
    if (typeof count !== 'number') continue; // Add this line
    totalFoodNeeded += count * (foodConsumptionPerProfession[profession.toLowerCase()] ?? 1);
  }


  let foodAfterConsumption = foodAvailable - totalFoodNeeded;
  let updatedPeople = { ...people };

  while (foodAfterConsumption < 0 && Object.keys(updatedPeople).length > 0) {
    const professionsWithPeople = Object.entries(updatedPeople).filter(isCountDefinedAndPositive);
    if (professionsWithPeople.length === 0) break;

    const randomIndex = Math.floor(Math.random() * professionsWithPeople.length);
    const [profession, count] = professionsWithPeople[randomIndex];

    // Fix: cast profession to keyof People
    const profKey = profession as keyof People;

    updatedPeople[profKey] = (updatedPeople[profKey] ?? 0) - 1;
    if (updatedPeople[profKey]! <= 0) {
      delete updatedPeople[profKey];
    }

    const foodPerPerson = foodConsumptionPerProfession[profession.toLowerCase()] ?? 1;
    totalFoodNeeded -= foodPerPerson;
    foodAfterConsumption = foodAvailable - totalFoodNeeded;
  }

  const updatedFood = Math.max(0, foodAfterConsumption);

  return {
    ...resources,
    people: updatedPeople,
    loot: {
      ...loot,
      food: updatedFood,
    },
  };
}




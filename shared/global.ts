import { TechNode } from "./techTreeData";

export function getAllTechnologyBenefits(tech: TechNode[]): { [key: string]: number } {
  const benefits: { [key: string]: number } = {};

  for (const node of tech) {
    if (node.unlocked) {
      for (const [key, value] of Object.entries(node.benefits || {})) {
        if (typeof value === 'number') {
          benefits[key] = (benefits[key] || 0) + value;
        }
      }
    }
  }

  return benefits;
}

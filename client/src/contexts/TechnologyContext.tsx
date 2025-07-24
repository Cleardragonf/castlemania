import React, { createContext, useContext, useState } from 'react';
import { TechNode, technologyTree } from '@shared/techTreeData';

interface TechnologyContextType {
  techTree: TechNode[];
  setTechTree: (tree: TechNode[]) => void;
  resetTechTree: () => void;
}

const TechnologyContext = createContext<TechnologyContextType | undefined>(undefined);

export const TechnologyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [techTree, setTechTreeState] = useState<TechNode[]>(() => {
    const stored = localStorage.getItem('technologyTree');
    return stored ? JSON.parse(stored) : technologyTree;
  });

  const setTechTree = (tree: TechNode[]) => {
    setTechTreeState(tree);
    localStorage.setItem('technologyTree', JSON.stringify(tree));
  };

const resetTechTree = () => {
  const clearedTree = technologyTree.map(node => ({ ...node, unlocked: false }));
  setTechTreeState(clearedTree);
  localStorage.removeItem('technologyTree'); // optional
};

  return (
    <TechnologyContext.Provider value={{ techTree, setTechTree, resetTechTree }}>
      {children}
    </TechnologyContext.Provider>
  );
};

export const useTechnologyContext = () => {
  const context = useContext(TechnologyContext);
  if (!context) throw new Error('useTechnologyContext must be used within TechnologyProvider');
  return context;
};

import React, { createContext, useContext, useState } from 'react';
import { TechNode, technologyTree as defaultTechTree } from '../types/techTreeData';

interface TechnologyContextType {
  techTree: TechNode[];
  setTechTree: (tree: TechNode[]) => void;
}

const TechnologyContext = createContext<TechnologyContextType | undefined>(undefined);

export const TechnologyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [techTree, setTechTreeState] = useState<TechNode[]>(() => {
    const stored = localStorage.getItem('technologyTree');
    return stored ? JSON.parse(stored) : defaultTechTree;
  });

  const setTechTree = (tree: TechNode[]) => {
    setTechTreeState(tree);
    localStorage.setItem('technologyTree', JSON.stringify(tree));
  };

  return (
    <TechnologyContext.Provider value={{ techTree, setTechTree }}>
      {children}
    </TechnologyContext.Provider>
  );
};

export const useTechnologyContext = () => {
  const context = useContext(TechnologyContext);
  if (!context) throw new Error('useTechnologyContext must be used within TechnologyProvider');
  return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Resources } from '@shared/index';

interface ResourceContextType {
  resources: Resources;
  setResources: (value: Resources) => void;
}

const defaultResources: Resources = {
  loot: {
    coins: 100,
    swords: 1,
    shields: 1,
    food: 5,
  },
  people: {},
};

const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

export const ResourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resources, setResourcesState] = useState<Resources>(() => {
    const stored = localStorage.getItem('startingLoot');
    return stored ? JSON.parse(stored) : defaultResources;
  });

  const setResources = (value: Resources) => {
    setResourcesState(value);
    localStorage.setItem('startingLoot', JSON.stringify(value));
  };

  return (
    <ResourceContext.Provider value={{ resources, setResources }}>
      {children}
    </ResourceContext.Provider>
  );
};

export const useResourceContext = () => {
  const context = useContext(ResourceContext);
  if (!context) throw new Error('useResourceContext must be used within ResourceProvider');
  return context;
};

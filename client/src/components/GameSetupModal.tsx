// client/src/components/GameSetupModal.tsx

import React from 'react';
import { Resources } from '../types';

interface LootOption {
  name: string;
  resources: Resources;
}

const lootOptions: LootOption[] = [
  { name: 'Warrior Pack', resources: { loot: {coins: 100, swords: 2, shields: 1 }, people: {citizen: 1, Warrior: 1} }},
  { name: 'Builder Pack', resources: { loot: {coins: 75, wood: 100, stone: 50 }, people: {citizen: 1, Builder: 1} }},
  { name: 'Explorer Pack', resources: { loot: {coins: 90, maps: 1, boots: 1 }, people: {citizen: 1, Explorer: 1} }},
  { name: 'Farmer Pack', resources: { loot: {coins: 50, food: 5 }, people: {citizen: 1, farmer: 1} }},
  { name: 'Miner Pack', resources: { loot: {coins: 60, ore: 100 }, people: {citizen: 1, miner: 1} }},
  { name: 'Blacksmith Pack', resources: { loot: {coins: 80, tools: 5 }, people: {citizen: 1, blacksmith: 1} }},
  { name: 'Merchant Pack', resources: { loot: {coins: 120, maps: 2 }, people: {citizen: 1, merchant: 1} }},
];

interface Props {
  onLootSelected: (loot: Resources) => void;
  onClose: () => void;
}

export const GameSetupModal: React.FC<Props> = ({ onLootSelected, onClose }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', background: '#f9f9f9' }}>
      <h2>Select Starting Loot</h2>
      <ul>
        {lootOptions.map(option => (
          <li key={option.name}>
            <button onClick={() => onLootSelected(option.resources)}>
              {option.name}: {JSON.stringify(option.resources)}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};


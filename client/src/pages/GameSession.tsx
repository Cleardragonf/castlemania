import React, { useState } from 'react';
import { Loot, Resources, People } from '../types';
import { advanceDay } from '../api/gameApi';
import { professionList, Profession } from '../types';

const defaultLoot: Loot = {
  coins: 100,
  swords: 1,
  shields: 1,
};

const defaultResources: Resources = {
  loot: defaultLoot,
  people: {},
};

export const GameSession: React.FC = () => {
  const [day, setDay] = useState(1);
  const [selectedProfession, setSelectedProfession] = useState<Profession>('farmer');

  const storedLoot = localStorage.getItem('startingLoot');
  let parsedLoot: Resources;

  try {
    parsedLoot = storedLoot ? JSON.parse(storedLoot) : defaultResources;
  } catch {
    parsedLoot = defaultResources;
  }

  const [loot, setLoot] = useState<Resources>(parsedLoot);

  const handleNextDay = async () => {
    try {
      const { day: newDay, resources: newRes } = await advanceDay(day, loot);
      setDay(newDay);
      setLoot(newRes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConvert = () => {
    if (!loot.people || (loot.people.citizen ?? 0) < 1) return;

    const prof = selectedProfession as keyof People;

    const updatedPeople: People = {
      ...loot.people,
      citizen: (loot.people.citizen ?? 1) - 1,
      [prof]: (loot.people[prof] ?? 0) + 1,
    };

    // Remove citizen if count is zero
    if (updatedPeople.citizen === 0) {
      delete updatedPeople.citizen;
    }

    setLoot({ ...loot, people: updatedPeople });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Game Session</h1>
      <h2>Day: {day}</h2>

      <div>
        <h3>Loot:</h3>
        <ul>
          {loot.loot &&
            Object.entries(loot.loot).map(([key, value]) => (
              <li key={key}>
                {key}: {String(value)}
              </li>
            ))}
        </ul>
      </div>

      <div>
        <h3>People:</h3>
        {loot.people && Object.keys(loot.people).length > 0 ? (
          <ul>
            {Object.entries(loot.people).map(([key, value]) => (
              <li key={key}>
                {key}: {String(value)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No people yet.</p>
        )}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleNextDay}>Next Day</button>

        {loot.people?.citizen && loot.people.citizen > 0 && day >= 3 && (
          <div style={{ marginTop: '1rem' }}>
            <label htmlFor="professionSelect">Convert a Citizen to: </label>
            <select
              id="professionSelect"
              value={selectedProfession}
              onChange={(e) => setSelectedProfession(e.target.value as Profession)}
            >
              {professionList.map((prof) => (
                <option key={prof} value={prof}>
                  {prof}
                </option>
              ))}
            </select>

            <button style={{ marginLeft: '1rem' }} onClick={handleConvert}>
              Convert
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

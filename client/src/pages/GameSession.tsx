import React, { useState, useEffect } from 'react';
import { Loot, Resources, People } from '../types';
import { advanceDay } from '../api/gameApi';
import { professionList, Profession } from '../types';

const defaultLoot: Loot = {
  coins: 100,
  swords: 1,
  shields: 1,
  food: 5, // make sure food is present
};

const defaultResources: Resources = {
  loot: defaultLoot,
  people: {},
};

export const GameSession: React.FC = () => {
  const [day, setDay] = useState(1);
  const [selectedProfession, setSelectedProfession] = useState<Profession>('farmer');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<string[]>([]);

  const storedLoot = localStorage.getItem('startingLoot');
  let parsedLoot: Resources;

  try {
    parsedLoot = storedLoot ? JSON.parse(storedLoot) : defaultResources;
  } catch {
    parsedLoot = defaultResources;
  }

  const [loot, setLoot] = useState<Resources>(parsedLoot);

  useEffect(() => {
    const entry = `Day ${day}: Food=${loot.loot?.food ?? 0}, People=${Object.values(loot.people ?? {}).reduce((sum, val) => sum + val, 0)}`;
    setHistory((prev) => [...prev, entry]);
    setScore(day * 10);
  }, [day]);

  const handleNextDay = async () => {
    try {
      const { day: newDay, resources: newRes } = await advanceDay(day, loot);
      const totalPeople = Object.values(newRes.people ?? {}).reduce((sum, val) => sum + val, 0);
      const food = newRes.loot?.food ?? 0;

      setDay(newDay);
      setLoot(newRes);

      if (food <= 0 && totalPeople === 0) {
        setGameOver(true);
      }
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

    if (updatedPeople.citizen === 0) {
      delete updatedPeople.citizen;
    }

    const updatedLoot = { ...loot, people: updatedPeople };

    setLoot(updatedLoot);
    localStorage.setItem('startingLoot', JSON.stringify(updatedLoot));
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
        <button onClick={handleNextDay} disabled={gameOver}>Next Day</button>

        {loot.people?.citizen && loot.people.citizen > 0 && !gameOver && (
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

      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[400px]">
            <h2 className="text-2xl font-bold text-red-600 text-center mb-4">Game Over</h2>
            <p className="text-center mb-2">You survived <strong>{day}</strong> days.</p>
            <p className="text-center mb-4">Score: <strong>{score}</strong></p>

            <h3 className="font-semibold mb-2">Detailed History:</h3>
            <div className="max-h-48 overflow-y-auto border rounded p-2 text-sm">
              {history.map((entry, index) => (
                <div key={index} className="border-b py-1">{entry}</div>
              ))}
            </div>

            <button
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Restart Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

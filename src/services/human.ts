import { Character, HumanStats } from '../types';
import { CHARACTER_PROFILES } from './personality';

export function createHuman(id: string, name: string): Character {
  const profile = CHARACTER_PROFILES[name] || {
    personality: 'A confused human trapped in a digital circus.',
    initialStats: { abstraction: 0, anger: 10, fear: 20 }
  };

  return {
    id,
    name,
    type: 'human',
    position: [Math.random() * 10 - 5, 0.5, Math.random() * 10 - 5],
    stats: { ...profile.initialStats },
    targetPosition: [Math.random() * 10 - 5, 0.5, Math.random() * 10 - 5],
  };
}

export function updateHumanStats(human: Character, worldStrangeness: number): Character {
  if (!human.stats) return human;

  const newStats: HumanStats = {
    abstraction: Math.min(100, human.stats.abstraction + worldStrangeness * 0.005),
    anger: Math.min(100, Math.max(0, human.stats.anger + (Math.random() - 0.5) * 1)),
    fear: Math.min(100, Math.max(0, human.stats.fear + (Math.random() - 0.5) * 2 + worldStrangeness * 0.1)),
  };

  return {
    ...human,
    stats: newStats,
    isAbstracted: newStats.abstraction >= 100,
  };
}

import { useState, useEffect, useCallback } from 'react';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  goldReward: number;
  priority: Priority;
  completed: boolean;
  createdAt: number;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  purchased: boolean;
}

export interface GameState {
  xp: number;
  gold: number;
  level: number;
  quests: Quest[];
  rewards: Reward[];
}

const DEFAULT_REWARDS: Reward[] = [
  { id: '1', name: '1 Hora de Jogo', description: 'Jogue por 1 hora sem culpa!', cost: 50, icon: '🎮', purchased: false },
  { id: '2', name: 'Lanche Especial', description: 'Um lanche que você adora.', cost: 100, icon: '🍕', purchased: false },
  { id: '3', name: 'Dia de Folga', description: 'Um dia inteiro sem tarefas.', cost: 300, icon: '🏖️', purchased: false },
  { id: '4', name: 'Filme/Série', description: 'Assista algo que quiser.', cost: 75, icon: '🎬', purchased: false },
  { id: '5', name: 'Presente Especial', description: 'Compre algo que quiser!', cost: 500, icon: '🎁', purchased: false },
];

function getXpForLevel(level: number): number {
  return 100 + (level - 1) * 50;
}

function calculateLevel(totalXp: number): { level: number; currentLevelXp: number; xpForNextLevel: number } {
  let level = 1;
  let remaining = totalXp;
  while (remaining >= getXpForLevel(level)) {
    remaining -= getXpForLevel(level);
    level++;
  }
  return { level, currentLevelXp: remaining, xpForNextLevel: getXpForLevel(level) };
}

const STORAGE_KEY = 'quest-rpg-state';

function loadState(): GameState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { xp: 0, gold: 0, level: 1, quests: [], rewards: DEFAULT_REWARDS };
}

export function useGameState() {
  const [state, setState] = useState<GameState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const levelInfo = calculateLevel(state.xp);

  const addQuest = useCallback((quest: Omit<Quest, 'id' | 'completed' | 'createdAt'>) => {
    setState(s => ({
      ...s,
      quests: [{ ...quest, id: crypto.randomUUID(), completed: false, createdAt: Date.now() }, ...s.quests],
    }));
  }, []);

  const toggleQuest = useCallback((id: string) => {
    setState(s => {
      const quest = s.quests.find(q => q.id === id);
      if (!quest) return s;
      const completing = !quest.completed;
      const xpDelta = completing ? quest.xpReward : -quest.xpReward;
      const goldDelta = completing ? quest.goldReward : -quest.goldReward;
      return {
        ...s,
        xp: Math.max(0, s.xp + xpDelta),
        gold: Math.max(0, s.gold + goldDelta),
        quests: s.quests.map(q => q.id === id ? { ...q, completed: !q.completed } : q),
      };
    });
  }, []);

  const deleteQuest = useCallback((id: string) => {
    setState(s => ({
      ...s,
      quests: s.quests.filter(q => q.id !== id),
    }));
  }, []);

  const purchaseReward = useCallback((id: string) => {
    setState(s => {
      const reward = s.rewards.find(r => r.id === id);
      if (!reward || s.gold < reward.cost) return s;
      return { ...s, gold: s.gold - reward.cost };
    });
  }, []);

  const addReward = useCallback((reward: Omit<Reward, 'id' | 'purchased'>) => {
    setState(s => ({
      ...s,
      rewards: [...s.rewards, { ...reward, id: crypto.randomUUID(), purchased: false }],
    }));
  }, []);

  const deleteReward = useCallback((id: string) => {
    setState(s => ({
      ...s,
      rewards: s.rewards.filter(r => r.id !== id),
    }));
  }, []);

  return {
    ...state,
    levelInfo,
    addQuest,
    toggleQuest,
    deleteQuest,
    purchaseReward,
    addReward,
    deleteReward,
  };
}

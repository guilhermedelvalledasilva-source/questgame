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
  dueDate?: number;
  isRoutine?: boolean;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  purchased: boolean;
  expiresAt?: number;
}

export interface HistoryEvent {
  id: string;
  type: 'xp_gained' | 'gold_gained' | 'gold_spent';
  amount: number;
  source: string;
  timestamp: number;
}

export interface GameState {
  xp: number;
  gold: number;
  level: number;
  quests: Quest[];
  rewards: Reward[];
  history: HistoryEvent[];
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
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, history: parsed.history || [] };
    }
  } catch {}
  return { xp: 0, gold: 0, level: 1, quests: [], rewards: DEFAULT_REWARDS, history: [] };
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

  const editQuest = useCallback((id: string, updates: Partial<Omit<Quest, 'id' | 'completed' | 'createdAt'>>) => {
    setState(s => ({
      ...s,
      quests: s.quests.map(q => q.id === id ? { ...q, ...updates } : q),
    }));
  }, []);

  const toggleQuest = useCallback((id: string) => {
    setState(s => {
      const quest = s.quests.find(q => q.id === id);
      if (!quest) return s;
      const completing = !quest.completed;
      const xpDelta = completing ? quest.xpReward : -quest.xpReward;
      const goldDelta = completing ? quest.goldReward : -quest.goldReward;
      const now = Date.now();
      const newHistory = completing
        ? [
            ...s.history,
            { id: crypto.randomUUID(), type: 'xp_gained' as const, amount: quest.xpReward, source: quest.title, timestamp: now },
            { id: crypto.randomUUID(), type: 'gold_gained' as const, amount: quest.goldReward, source: quest.title, timestamp: now },
          ]
        : s.history;

      let updatedQuests: Quest[];
      if (completing && quest.isRoutine) {
        // Mark completed but keep as active by creating a new copy
        updatedQuests = s.quests.map(q => q.id === id ? { ...q, completed: true } : q);
        updatedQuests = [
          { ...quest, id: crypto.randomUUID(), completed: false, createdAt: now },
          ...updatedQuests,
        ];
      } else {
        updatedQuests = s.quests.map(q => q.id === id ? { ...q, completed: !q.completed } : q);
      }

      return {
        ...s,
        xp: Math.max(0, s.xp + xpDelta),
        gold: Math.max(0, s.gold + goldDelta),
        quests: updatedQuests,
        history: newHistory,
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
      return {
        ...s,
        gold: s.gold - reward.cost,
        history: [
          ...s.history,
          { id: crypto.randomUUID(), type: 'gold_spent' as const, amount: reward.cost, source: reward.name, timestamp: Date.now() },
        ],
      };
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

  const spendGold = useCallback((amount: number, source: string) => {
    setState(s => {
      if (s.gold < amount) return s;
      return {
        ...s,
        gold: s.gold - amount,
        history: [
          ...s.history,
          { id: crypto.randomUUID(), type: 'gold_spent' as const, amount, source, timestamp: Date.now() },
        ],
      };
    });
  }, []);

  return {
    ...state,
    levelInfo,
    addQuest,
    editQuest,
    toggleQuest,
    deleteQuest,
    purchaseReward,
    addReward,
    deleteReward,
    spendGold,
  };
}

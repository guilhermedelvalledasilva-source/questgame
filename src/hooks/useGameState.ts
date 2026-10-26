import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  earnedXp?: number;
  earnedGold?: number;
  spawnedId?: string;
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

export interface Buffs {
  doubleXp: number;      // próximas missões com XP em dobro
  goldBonus: number;     // próximas missões com +50% ouro
  luck: number;          // próximas missões com chance de ouro extra
  xpShield: number;      // proteções de XP ao desmarcar
  discountUntil: number; // timestamp do fim do desconto de 50%
}

export interface GameState {
  xp: number;
  gold: number;
  level: number;
  quests: Quest[];
  rewards: Reward[];
  history: HistoryEvent[];
  buffs: Buffs;
}

const DEFAULT_BUFFS: Buffs = { doubleXp: 0, goldBonus: 0, luck: 0, xpShield: 0, discountUntil: 0 };

const DEFAULT_REWARDS: Reward[] = [
  { id: '1', name: '1 Hora de Jogo', description: 'Jogue por 1 hora sem culpa!', cost: 50, icon: '🎮', purchased: false },
  { id: '2', name: 'Lanche Especial', description: 'Um lanche que você adora.', cost: 100, icon: '🍕', purchased: false },
  { id: '3', name: 'Dia de Folga', description: 'Um dia inteiro sem tarefas.', cost: 300, icon: '🏖️', purchased: false },
  { id: '4', name: 'Filme/Série', description: 'Assista algo que quiser.', cost: 75, icon: '🎬', purchased: false },
  { id: '5', name: 'Presente Especial', description: 'Compre algo que quiser!', cost: 500, icon: '🎁', purchased: false },
];

const emptyState = (): GameState => ({ xp: 0, gold: 0, level: 1, quests: [], rewards: DEFAULT_REWARDS, history: [], buffs: { ...DEFAULT_BUFFS } });

function getXpForLevel(level: number): number {
  return 100 + (level - 1) * 50;
}

function calculateLevel(totalXp: number) {
  let level = 1;
  let remaining = totalXp;
  while (remaining >= getXpForLevel(level)) {
    remaining -= getXpForLevel(level);
    level++;
  }
  return { level, currentLevelXp: remaining, xpForNextLevel: getXpForLevel(level) };
}

const MYSTERY_QUESTS = [
  { title: 'Missão Secreta: 20 flexões', description: 'Faça 20 flexões agora!' },
  { title: 'Missão Secreta: Arrume a mesa', description: 'Organize seu espaço de trabalho.' },
  { title: 'Missão Secreta: Beba 2 copos de água', description: 'Hidratação é poder!' },
  { title: 'Missão Secreta: Leia 10 páginas', description: 'Conhecimento é XP.' },
  { title: 'Missão Secreta: Caminhe 15 minutos', description: 'Explore o mundo lá fora.' },
];

export function isDiscountActive(buffs: Buffs) {
  return buffs.discountUntil > Date.now();
}

export function useGameState(userId: string | null) {
  const [state, setState] = useState<GameState>(emptyState);
  const [loaded, setLoaded] = useState(false);
  const lockRef = useRef<Set<string>>(new Set());
  const lastToggleRef = useRef(0);

  // Load from database
  useEffect(() => {
    setLoaded(false);
    if (!userId) { setState(emptyState()); return; }
    let cancelled = false;
    supabase.from('game_states').select('state').eq('user_id', userId).maybeSingle().then(({ data }) => {
      if (cancelled) return;
      const s = (data?.state ?? null) as Partial<GameState> | null;
      setState(s && Object.keys(s).length ? { ...emptyState(), ...s, buffs: { ...DEFAULT_BUFFS, ...(s.buffs ?? {}) } } : emptyState());
      setLoaded(true);
    });
    return () => { cancelled = true; };
  }, [userId]);

  // Save to database (debounced)
  useEffect(() => {
    if (!userId || !loaded) return;
    const t = setTimeout(() => {
      supabase.from('game_states').upsert({ user_id: userId, state: state as never, updated_at: new Date().toISOString() }).then(({ error }) => {
        if (error) console.error('Falha ao salvar progresso', error);
      });
    }, 600);
    return () => clearTimeout(t);
  }, [state, userId, loaded]);

  const levelInfo = calculateLevel(state.xp);

  const addQuest = useCallback((quest: Omit<Quest, 'id' | 'completed' | 'createdAt'>) => {
    setState(s => ({ ...s, quests: [{ ...quest, id: crypto.randomUUID(), completed: false, createdAt: Date.now() }, ...s.quests] }));
  }, []);

  const editQuest = useCallback((id: string, updates: Partial<Omit<Quest, 'id' | 'completed' | 'createdAt'>>) => {
    setState(s => ({ ...s, quests: s.quests.map(q => q.id === id ? { ...q, ...updates } : q) }));
  }, []);

  const toggleQuest = useCallback((id: string) => {
    // Anti-duplicação: ignora cliques repetidos rápidos
    const now = Date.now();
    if (lockRef.current.has(id) || now - lastToggleRef.current < 400) return;
    lastToggleRef.current = now;
    lockRef.current.add(id);
    setTimeout(() => lockRef.current.delete(id), 800);

    // Rolar a sorte fora do updater (que pode rodar duas vezes)
    const luckRoll = Math.random() < 0.4;
    const newId = crypto.randomUUID();

    setState(s => {
      const quest = s.quests.find(q => q.id === id);
      if (!quest) return s;
      const buffs = { ...s.buffs };
      let quests = s.quests;
      let history = s.history;

      if (!quest.completed) {
        let xp = quest.xpReward;
        let gold = quest.goldReward;
        if (buffs.doubleXp > 0) { xp *= 2; buffs.doubleXp--; }
        if (buffs.goldBonus > 0) { gold = Math.round(gold * 1.5); buffs.goldBonus--; }
        if (buffs.luck > 0) { if (luckRoll) gold *= 2; buffs.luck--; }

        quests = quests.map(q => q.id === id ? { ...q, completed: true, earnedXp: xp, earnedGold: gold } : q);
        if (quest.isRoutine && !quest.spawnedId) {
          quests = [{ ...quest, id: newId, completed: false, createdAt: now, earnedXp: undefined, earnedGold: undefined, spawnedId: undefined }, ...quests]
            .map(q => q.id === id ? { ...q, spawnedId: newId } : q);
        }
        history = [
          ...history,
          { id: crypto.randomUUID(), type: 'xp_gained', amount: xp, source: quest.title, timestamp: now },
          { id: crypto.randomUUID(), type: 'gold_gained', amount: gold, source: quest.title, timestamp: now },
        ];
        return { ...s, buffs, quests, history, xp: s.xp + xp, gold: s.gold + gold };
      }

      // Desmarcar
      const xpLoss = buffs.xpShield > 0 ? 0 : (quest.earnedXp ?? quest.xpReward);
      if (buffs.xpShield > 0) buffs.xpShield--;
      const goldLoss = quest.earnedGold ?? quest.goldReward;
      quests = quests.map(q => q.id === id ? { ...q, completed: false, earnedXp: undefined, earnedGold: undefined, spawnedId: undefined } : q);
      if (quest.spawnedId) {
        const spawned = quests.find(q => q.id === quest.spawnedId);
        if (spawned && !spawned.completed) quests = quests.filter(q => q.id !== quest.spawnedId);
      }
      return { ...s, buffs, quests, xp: Math.max(0, s.xp - xpLoss), gold: Math.max(0, s.gold - goldLoss) };
    });
  }, []);

  const deleteQuest = useCallback((id: string) => {
    setState(s => ({ ...s, quests: s.quests.filter(q => q.id !== id) }));
  }, []);

  const purchaseReward = useCallback((id: string) => {
    setState(s => {
      const reward = s.rewards.find(r => r.id === id);
      if (!reward) return s;
      const cost = isDiscountActive(s.buffs) ? Math.ceil(reward.cost / 2) : reward.cost;
      if (s.gold < cost) return s;
      return {
        ...s,
        gold: s.gold - cost,
        history: [...s.history, { id: crypto.randomUUID(), type: 'gold_spent', amount: cost, source: reward.name, timestamp: Date.now() }],
      };
    });
  }, []);

  const addReward = useCallback((reward: Omit<Reward, 'id' | 'purchased'>) => {
    setState(s => ({ ...s, rewards: [...s.rewards, { ...reward, id: crypto.randomUUID(), purchased: false }] }));
  }, []);

  const deleteReward = useCallback((id: string) => {
    setState(s => ({ ...s, rewards: s.rewards.filter(r => r.id !== id) }));
  }, []);

  /** Compra e aplica um item do mercado. Retorna mensagem de erro ou null. */
  const buyMarketItem = useCallback((itemId: string, cost: number, name: string): string | null => {
    const s = state;
    if (s.gold < cost) return 'Ouro insuficiente!';
    const activeWithDue = s.quests.filter(q => !q.completed && q.dueDate).sort((a, b) => a.dueDate! - b.dueDate!);
    const routines = s.quests.filter(q => q.isRoutine);
    if (itemId === 'm2' && activeWithDue.length === 0) return 'Nenhuma missão ativa com prazo para estender.';
    if (itemId === 'm7' && routines.length === 0) return 'Você não tem missões de rotina.';

    const mysteryIdx = Math.floor(Math.random() * MYSTERY_QUESTS.length);
    const now = Date.now();
    setState(st => {
      if (st.gold < cost) return st;
      const buffs = { ...st.buffs };
      let quests = st.quests;
      switch (itemId) {
        case 'm1': buffs.doubleXp++; break;
        case 'm2': {
          const target = activeWithDue[0].id;
          quests = quests.map(q => q.id === target ? { ...q, dueDate: (q.dueDate ?? now) + 3 * 86400000 } : q);
          break;
        }
        case 'm3': buffs.discountUntil = Math.max(now, buffs.discountUntil) + 3600000; break;
        case 'm4': buffs.xpShield++; break;
        case 'm5': buffs.goldBonus += 3; break;
        case 'm6': {
          const m = MYSTERY_QUESTS[mysteryIdx];
          quests = [{ id: crypto.randomUUID(), title: m.title, description: m.description, xpReward: 60, goldReward: 80, priority: 'high', completed: false, createdAt: now }, ...quests];
          break;
        }
        case 'm7': {
          // Garante uma cópia ativa de cada rotina, removendo duplicadas
          const seen = new Set<string>();
          const kept: Quest[] = [];
          for (const q of quests) {
            if (q.isRoutine && !q.completed) {
              if (seen.has(q.title)) continue;
              seen.add(q.title);
            }
            kept.push(q);
          }
          const toAdd: Quest[] = [];
          for (const q of kept) {
            if (q.isRoutine && q.completed && !seen.has(q.title)) {
              seen.add(q.title);
              toAdd.push({ ...q, id: crypto.randomUUID(), completed: false, createdAt: now, earnedXp: undefined, earnedGold: undefined, spawnedId: undefined });
            }
          }
          quests = [...toAdd, ...kept];
          break;
        }
        case 'm8': buffs.luck += 3; break;
      }
      return {
        ...st,
        buffs,
        quests,
        gold: st.gold - cost,
        history: [...st.history, { id: crypto.randomUUID(), type: 'gold_spent', amount: cost, source: name, timestamp: now }],
      };
    });
    return null;
  }, [state]);

  return {
    ...state,
    loaded,
    levelInfo,
    addQuest,
    editQuest,
    toggleQuest,
    deleteQuest,
    purchaseReward,
    addReward,
    deleteReward,
    buyMarketItem,
  };
}

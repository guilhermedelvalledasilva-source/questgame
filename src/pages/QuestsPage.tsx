import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Quest } from '@/hooks/useGameState';
import { QuestCard } from '@/components/QuestCard';
import { CreateQuestDialog } from '@/components/CreateQuestDialog';

interface QuestsPageProps {
  quests: Quest[];
  onAdd: (quest: Omit<Quest, 'id' | 'completed' | 'createdAt'>) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Omit<Quest, 'id' | 'completed' | 'createdAt'>>) => void;
}

export default function QuestsPage({ quests, onAdd, onToggle, onDelete, onEdit }: QuestsPageProps) {
  const [showCompleted, setShowCompleted] = useState(false);
  const activeQuests = quests.filter(q => !q.completed);
  const completedQuests = quests.filter(q => q.completed);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          ⚔️ Missões <span className="text-sm font-normal text-muted-foreground">({activeQuests.length})</span>
        </h2>
        <CreateQuestDialog onAdd={onAdd} />
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {activeQuests.map(q => (
            <QuestCard key={q.id} quest={q} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </AnimatePresence>
        {activeQuests.length === 0 && (
          <div className="text-center py-12 text-muted-foreground rounded-xl border border-dashed border-border/60">
            <p className="text-sm">Nenhuma missão ativa.</p>
            <p className="text-xs mt-1">Crie uma nova missão para começar! ⚔️</p>
          </div>
        )}
      </div>

      {completedQuests.length > 0 && (
        <div className="space-y-2 pt-4">
          <button
            onClick={() => setShowCompleted(v => !v)}
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors w-full"
          >
            ✅ Completadas ({completedQuests.length})
            {showCompleted ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showCompleted && (
            <AnimatePresence mode="popLayout">
              {completedQuests.map(q => (
                <QuestCard key={q.id} quest={q} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
              ))}
            </AnimatePresence>
          )}
        </div>
      )}
    </div>
  );
}

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Trash2, Coins, Sparkles } from 'lucide-react';
import type { Quest, Priority } from '@/hooks/useGameState';

const priorityLabels: Record<Priority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  critical: 'Crítica',
};

interface QuestCardProps {
  quest: Quest;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function QuestCard({ quest, onToggle, onDelete }: QuestCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group relative rounded-lg border p-4 transition-all cursor-pointer ${
        quest.completed
          ? 'border-border/50 bg-card/50 opacity-60'
          : 'border-border bg-card hover:border-primary/50'
      }`}
      onClick={() => onToggle(quest.id)}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {quest.completed ? (
            <CheckCircle2 className="w-5 h-5 text-xp" />
          ) : (
            <Circle className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold text-sm ${quest.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {quest.title}
            </h3>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border bg-priority-${quest.priority}/10 text-priority-${quest.priority} border-priority-${quest.priority}/30`}>
              {priorityLabels[quest.priority]}
            </span>
          </div>
          {quest.description && (
            <p className="text-xs text-muted-foreground mb-2">{quest.description}</p>
          )}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs font-medium text-xp">
              <Sparkles className="w-3.5 h-3.5" /> +{quest.xpReward} XP
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-gold">
              <Coins className="w-3.5 h-3.5" /> +{quest.goldReward}
            </span>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(quest.id); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

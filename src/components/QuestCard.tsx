import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Trash2, Coins, Sparkles, Edit3, Repeat, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import type { Quest, Priority } from '@/hooks/useGameState';

const TOGGLE_LOCK_MS = 500;

const priorityLabels: Record<Priority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  critical: 'Crítica',
};

const priorities: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Crítica' },
];

interface QuestCardProps {
  quest: Quest;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Omit<Quest, 'id' | 'completed' | 'createdAt'>>) => void;
}

export function QuestCard({ quest, onToggle, onDelete, onEdit }: QuestCardProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(quest.title);
  const [description, setDescription] = useState(quest.description);
  const [xp, setXp] = useState(quest.xpReward);
  const [gold, setGold] = useState(quest.goldReward);
  const [priority, setPriority] = useState(quest.priority);
  const [dueDate, setDueDate] = useState(quest.dueDate ? new Date(quest.dueDate).toISOString().split('T')[0] : '');
  const [isRoutine, setIsRoutine] = useState(quest.isRoutine || false);
  const toggleLockRef = useRef(false);

  const handleToggle = () => {
    // Ignore rapid double-clicks/taps: without this, a second click landing before
    // the first re-render can toggle the just-regenerated routine quest, duplicating it.
    if (toggleLockRef.current) return;
    toggleLockRef.current = true;
    setTimeout(() => { toggleLockRef.current = false; }, TOGGLE_LOCK_MS);

    const willComplete = !quest.completed;
    onToggle(quest.id);
    if (willComplete) {
      toast.success(`Missão concluída! ${quest.title}`, {
        description: `+${quest.xpReward} XP · +${quest.goldReward} 🪙`,
      });
    }
  };

  const handleSave = () => {
    onEdit(quest.id, {
      title: title.trim(),
      description: description.trim(),
      xpReward: xp,
      goldReward: gold,
      priority,
      dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
      isRoutine,
    });
    setEditing(false);
  };

  const isOverdue = quest.dueDate && !quest.completed && quest.dueDate < Date.now();

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ scale: quest.completed ? 1 : 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`group relative rounded-xl border p-4 transition-all duration-200 cursor-pointer shadow-elevation-1 hover:shadow-elevation-2 ${
          quest.completed
            ? 'border-border/50 bg-card/50 opacity-60'
            : isOverdue
              ? 'border-destructive/50 bg-card hover:border-destructive'
              : 'border-border/60 bg-card hover:border-primary/50'
        }`}
        onClick={handleToggle}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            {quest.completed ? (
              <CheckCircle2 className="w-5 h-5 text-xp" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground transition-colors group-hover:text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className={`font-semibold text-sm ${quest.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {quest.title}
              </h3>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border bg-priority-${quest.priority}/10 text-priority-${quest.priority} border-priority-${quest.priority}/30`}>
                {priorityLabels[quest.priority]}
              </span>
              {quest.isRoutine && (
                <span className="text-[10px] font-medium text-primary flex items-center gap-0.5">
                  <Repeat className="w-3 h-3" /> Rotina
                </span>
              )}
            </div>
            {quest.description && (
              <p className="text-xs text-muted-foreground mb-2">{quest.description}</p>
            )}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1 text-xs font-medium text-xp">
                <Sparkles className="w-3.5 h-3.5" /> +{quest.xpReward} XP
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-gold">
                <Coins className="w-3.5 h-3.5" /> +{quest.goldReward}
              </span>
              {quest.dueDate && (
                <span className={`flex items-center gap-1 text-xs font-medium ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(quest.dueDate).toLocaleDateString('pt-BR')}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); setEditing(true); }}
              className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(quest.id); }}
              className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-md border-border/60 bg-card p-6" onClick={e => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold text-foreground">✏️ Editar Missão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Título</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} className="mt-1 bg-muted border-border/60" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Descrição</label>
              <Input value={description} onChange={e => setDescription(e.target.value)} className="mt-1 bg-muted border-border/60" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">XP</label>
                <Input type="number" min={1} value={xp} onChange={e => setXp(Number(e.target.value))} className="mt-1 bg-muted border-border/60" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ouro</label>
                <Input type="number" min={1} value={gold} onChange={e => setGold(Number(e.target.value))} className="mt-1 bg-muted border-border/60" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Data de Entrega (opcional)</label>
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="mt-1 bg-muted border-border/60" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Prioridade</label>
              <div className="flex gap-2">
                {priorities.map(p => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={`flex-1 text-xs font-semibold py-2 rounded-lg border transition-all ${
                      priority === p.value
                        ? `bg-priority-${p.value}/20 text-priority-${p.value} border-priority-${p.value}/50`
                        : 'bg-muted text-muted-foreground border-border hover:border-muted-foreground/30'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isRoutine} onChange={e => setIsRoutine(e.target.checked)} className="rounded border-border" />
              <Repeat className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-foreground">Missão de rotina (repete ao completar)</span>
            </label>
            <Button onClick={handleSave} variant="gradient" className="w-full font-semibold">
              Salvar ✅
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

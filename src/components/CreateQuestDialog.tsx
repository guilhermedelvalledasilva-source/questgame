import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Priority } from '@/hooks/useGameState';

interface CreateQuestDialogProps {
  onAdd: (quest: { title: string; description: string; xpReward: number; goldReward: number; priority: Priority }) => void;
}

const priorities: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Crítica' },
];

export function CreateQuestDialog({ onAdd }: CreateQuestDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [xp, setXp] = useState(50);
  const [gold, setGold] = useState(25);
  const [priority, setPriority] = useState<Priority>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), description: description.trim(), xpReward: xp, goldReward: gold, priority });
    setTitle(''); setDescription(''); setXp(50); setGold(25); setPriority('medium');
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 glow-blue font-semibold">
        <Plus className="w-4 h-4" /> Nova Missão
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-foreground">⚔️ Criar Missão</h2>
                <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-muted text-muted-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Título</label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Estudar por 1 hora" className="mt-1 bg-muted border-border" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Descrição (opcional)</label>
                  <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Detalhes da missão..." className="mt-1 bg-muted border-border" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">XP</label>
                    <Input type="number" min={1} value={xp} onChange={e => setXp(Number(e.target.value))} className="mt-1 bg-muted border-border" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ouro</label>
                    <Input type="number" min={1} value={gold} onChange={e => setGold(Number(e.target.value))} className="mt-1 bg-muted border-border" />
                  </div>
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
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                  Criar Missão ⚔️
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

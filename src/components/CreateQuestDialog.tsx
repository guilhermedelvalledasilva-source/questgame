import { useState } from 'react';
import { Plus, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Priority } from '@/hooks/useGameState';

interface CreateQuestDialogProps {
  onAdd: (quest: { title: string; description: string; xpReward: number; goldReward: number; priority: Priority; dueDate?: number; isRoutine?: boolean }) => void;
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
  const [dueDate, setDueDate] = useState('');
  const [isRoutine, setIsRoutine] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      description: description.trim(),
      xpReward: xp,
      goldReward: gold,
      priority,
      dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
      isRoutine,
    });
    setTitle(''); setDescription(''); setXp(50); setGold(25); setPriority('medium'); setDueDate(''); setIsRoutine(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 glow-blue font-semibold">
          <Plus className="w-4 h-4" /> Nova Missão
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-md rounded-xl border border-border bg-card p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">⚔️ Criar Missão</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
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
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Data de Entrega (opcional)</label>
            <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="mt-1 bg-muted border-border" />
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
            <span className="text-xs font-medium text-foreground">Missão de rotina</span>
          </label>
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
            Criar Missão ⚔️
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

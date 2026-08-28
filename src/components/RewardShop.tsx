import { useState } from 'react';
import { Plus, Coins, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import type { Reward } from '@/hooks/useGameState';

interface RewardShopProps {
  rewards: Reward[];
  gold: number;
  onPurchase: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (reward: Omit<Reward, 'id' | 'purchased'>) => void;
}

const EMOJI_OPTIONS = ['🎮', '🍕', '🏖️', '🎬', '🎁', '🎧', '📱', '🍫', '☕', '🎨', '📚', '🛒'];

export function RewardShop({ rewards, gold, onPurchase, onDelete, onAdd }: RewardShopProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState(100);
  const [icon, setIcon] = useState('🎁');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), description: description.trim(), cost, icon });
    setName(''); setDescription(''); setCost(100); setIcon('🎁');
    setOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center shadow-glow-gold">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
          <h2 className="font-display text-lg font-bold text-foreground">Loja de Recompensas</h2>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="p-1.5 rounded-lg border border-border/60 bg-muted hover:border-gold/50 hover:bg-gold/10 transition-all duration-200 text-gold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </DialogTrigger>
          <DialogContent className="w-[calc(100vw-2rem)] max-w-md border-border/60 bg-card p-6">
            <DialogHeader>
              <DialogTitle className="font-display text-lg font-bold text-foreground">🎁 Nova Recompensa</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: 1 Hora de Jogo" className="mt-1 bg-muted border-border/60" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Descrição</label>
                <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Detalhes da recompensa..." className="mt-1 bg-muted border-border/60" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Custo (Ouro)</label>
                <Input type="number" min={1} value={cost} onChange={e => setCost(Number(e.target.value))} className="mt-1 bg-muted border-border/60" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Ícone</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map(e => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setIcon(e)}
                      className={`text-xl p-1.5 rounded-lg border transition-all duration-200 ${
                        icon === e ? 'border-gold/50 bg-gold/20 scale-110' : 'border-border/60 bg-muted hover:border-muted-foreground/30'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full gradient-gold text-white hover:opacity-90 font-semibold shadow-glow-gold">
                Criar Recompensa 🎁
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-3">
        {rewards.map((reward, i) => (
          <motion.div
            key={reward.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3 shadow-elevation-1 hover:shadow-elevation-2 hover:border-gold/30 transition-all duration-200"
          >
            <span className="text-2xl">{reward.icon}</span>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground">{reward.name}</h3>
              <p className="text-xs text-muted-foreground">{reward.description}</p>
              <span className="flex items-center gap-1 text-xs font-bold text-gold mt-1">
                <Coins className="w-3.5 h-3.5" /> {reward.cost}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <Button
                size="sm"
                disabled={gold < reward.cost}
                onClick={() => {
                  onPurchase(reward.id);
                  toast.success(`${reward.icon} ${reward.name}`, { description: 'Recompensa comprada com sucesso!' });
                }}
                className="text-xs bg-gold/20 text-gold border border-gold/30 hover:bg-gold/30 disabled:opacity-40"
              >
                Comprar
              </Button>
              <button
                onClick={() => onDelete(reward.id)}
                className="opacity-0 group-hover:opacity-100 text-[10px] text-muted-foreground hover:text-destructive transition-all text-center"
              >
                remover
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

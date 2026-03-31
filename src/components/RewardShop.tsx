import { useState } from 'react';
import { Plus, Coins, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
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
          <ShoppingBag className="w-5 h-5 text-gold" />
          <h2 className="text-lg font-bold text-foreground">Loja de Recompensas</h2>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="p-1.5 rounded-lg border border-border bg-muted hover:border-gold/50 hover:bg-gold/10 transition-colors text-gold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </DialogTrigger>
          <DialogContent className="w-[calc(100vw-2rem)] max-w-md rounded-xl border border-border bg-card p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-foreground">🎁 Nova Recompensa</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: 1 Hora de Jogo" className="mt-1 bg-muted border-border" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Descrição</label>
                <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Detalhes da recompensa..." className="mt-1 bg-muted border-border" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Custo (Ouro)</label>
                <Input type="number" min={1} value={cost} onChange={e => setCost(Number(e.target.value))} className="mt-1 bg-muted border-border" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Ícone</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map(e => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setIcon(e)}
                      className={`text-xl p-1.5 rounded-lg border transition-all ${
                        icon === e ? 'border-gold/50 bg-gold/20 scale-110' : 'border-border bg-muted hover:border-muted-foreground/30'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full bg-gold/20 text-gold border border-gold/30 hover:bg-gold/30 font-semibold">
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
            className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3 hover:border-gold/30 transition-colors"
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
                onClick={() => onPurchase(reward.id)}
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

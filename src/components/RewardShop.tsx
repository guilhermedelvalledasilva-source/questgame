import { motion } from 'framer-motion';
import { Coins, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Reward } from '@/hooks/useGameState';

interface RewardShopProps {
  rewards: Reward[];
  gold: number;
  onPurchase: (id: string) => void;
  onDelete: (id: string) => void;
}

export function RewardShop({ rewards, gold, onPurchase, onDelete }: RewardShopProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="w-5 h-5 text-gold" />
        <h2 className="text-lg font-bold text-foreground">Loja de Recompensas</h2>
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
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-sm font-bold text-gold">
                <Coins className="w-4 h-4" /> {reward.cost}
              </span>
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
                className="opacity-0 group-hover:opacity-100 text-xs text-muted-foreground hover:text-destructive transition-all"
              >
                ✕
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

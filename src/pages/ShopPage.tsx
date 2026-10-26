import type { Reward } from '@/hooks/useGameState';
import { RewardShop } from '@/components/RewardShop';

interface ShopPageProps {
  rewards: Reward[];
  gold: number;
  discountActive?: boolean;
  onPurchase: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (reward: Omit<Reward, 'id' | 'purchased'>) => void;
}

export default function ShopPage({ rewards, gold, discountActive, onPurchase, onDelete, onAdd }: ShopPageProps) {
  const shown = discountActive ? rewards.map(r => ({ ...r, cost: Math.ceil(r.cost / 2) })) : rewards;
  return (
    <div className="space-y-3">
      {discountActive && (
        <div className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
          🏷️ Desconto Relâmpago ativo: 50% em todas as recompensas!
        </div>
      )}
      <RewardShop rewards={shown} gold={gold} onPurchase={onPurchase} onDelete={onDelete} onAdd={onAdd} />
    </div>
  );
}

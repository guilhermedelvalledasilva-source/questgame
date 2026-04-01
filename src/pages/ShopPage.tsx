import type { Reward } from '@/hooks/useGameState';
import { RewardShop } from '@/components/RewardShop';

interface ShopPageProps {
  rewards: Reward[];
  gold: number;
  onPurchase: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (reward: Omit<Reward, 'id' | 'purchased'>) => void;
}

export default function ShopPage({ rewards, gold, onPurchase, onDelete, onAdd }: ShopPageProps) {
  return (
    <div>
      <RewardShop rewards={rewards} gold={gold} onPurchase={onPurchase} onDelete={onDelete} onAdd={onAdd} />
    </div>
  );
}

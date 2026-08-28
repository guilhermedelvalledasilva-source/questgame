import { motion } from 'framer-motion';
import { Store, Coins } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface MarketItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  effect: string;
}

const MARKET_ITEMS: MarketItem[] = [
  { id: 'm1', name: 'Duo XP', description: 'Ganhe XP em dobro na próxima missão!', cost: 150, icon: '⚡', effect: '2x XP' },
  { id: 'm2', name: 'Extensão de Prazo', description: '+3 dias em qualquer missão ativa.', cost: 80, icon: '⏰', effect: '+3 dias' },
  { id: 'm3', name: 'Desconto Relâmpago', description: '50% de desconto na loja por 1 hora.', cost: 200, icon: '🏷️', effect: '-50%' },
  { id: 'm4', name: 'Escudo de XP', description: 'Protege seu XP ao falhar uma missão.', cost: 120, icon: '🛡️', effect: 'Proteção' },
  { id: 'm5', name: 'Bônus de Ouro', description: '+50% de ouro nas próximas 3 missões.', cost: 250, icon: '💰', effect: '+50% Ouro' },
  { id: 'm6', name: 'Missão Misteriosa', description: 'Revela uma missão bônus secreta!', cost: 300, icon: '🎲', effect: '??? Missão' },
  { id: 'm7', name: 'Reset de Rotina', description: 'Reseta todas as rotinas imediatamente.', cost: 100, icon: '🔄', effect: 'Reset' },
  { id: 'm8', name: 'Amuleto da Sorte', description: 'Chance de ganhar recompensas extras.', cost: 180, icon: '🍀', effect: '+Sorte' },
];

interface MarketPageProps {
  gold: number;
  onSpend: (amount: number, itemName: string) => void;
}

export default function MarketPage({ gold, onSpend }: MarketPageProps) {
  const handleBuy = (item: MarketItem) => {
    if (gold < item.cost) {
      toast.error('Ouro insuficiente! 😢', { description: `Você precisa de ${item.cost} ouro.` });
      return;
    }
    onSpend(item.cost, item.name);
    toast.success(`${item.icon} ${item.name} ativado!`, { description: item.effect });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Store className="w-5 h-5 text-primary" /> Mercado
        </h2>
        <div className="flex items-center gap-1 text-sm font-bold text-gold">
          <Coins className="w-4 h-4" /> {gold}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Power-ups e itens especiais para turbinar sua jornada!</p>

      <div className="grid grid-cols-2 gap-2">
        {MARKET_ITEMS.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2 }}
            className="rounded-xl border border-border/60 bg-card p-3 flex flex-col gap-2 shadow-elevation-1 hover:shadow-elevation-2 hover:border-primary/30 transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-foreground truncate">{item.name}</h3>
                <span className="text-[10px] text-primary font-medium">{item.effect}</span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground leading-tight">{item.description}</p>
            <button
              onClick={() => handleBuy(item)}
              disabled={gold < item.cost}
              className="mt-auto w-full text-[10px] font-bold py-1.5 rounded-md bg-primary/20 text-primary hover:bg-primary/30 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
            >
              <Coins className="w-3 h-3" /> {item.cost}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

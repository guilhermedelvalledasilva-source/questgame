import { motion } from 'framer-motion';
import { Store, Coins } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import type { Buffs } from '@/hooks/useGameState';

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
  { id: 'm2', name: 'Extensão de Prazo', description: '+3 dias na missão ativa com prazo mais próximo.', cost: 80, icon: '⏰', effect: '+3 dias' },
  { id: 'm3', name: 'Desconto Relâmpago', description: '50% de desconto na loja por 1 hora.', cost: 200, icon: '🏷️', effect: '-50%' },
  { id: 'm4', name: 'Escudo de XP', description: 'Protege seu XP na próxima vez que desmarcar uma missão.', cost: 120, icon: '🛡️', effect: 'Proteção' },
  { id: 'm5', name: 'Bônus de Ouro', description: '+50% de ouro nas próximas 3 missões.', cost: 250, icon: '💰', effect: '+50% Ouro' },
  { id: 'm6', name: 'Missão Misteriosa', description: 'Revela uma missão bônus secreta!', cost: 300, icon: '🎲', effect: '??? Missão' },
  { id: 'm7', name: 'Reset de Rotina', description: 'Reativa todas as suas rotinas e remove duplicadas.', cost: 100, icon: '🔄', effect: 'Reset' },
  { id: 'm8', name: 'Amuleto da Sorte', description: '40% de chance de ouro em dobro nas próximas 3 missões.', cost: 180, icon: '🍀', effect: '+Sorte' },
];

interface MarketPageProps {
  gold: number;
  buffs: Buffs;
  onBuy: (id: string, cost: number, name: string) => string | null;
}

export default function MarketPage({ gold, buffs, onBuy }: MarketPageProps) {
  const handleBuy = (item: MarketItem) => {
    const err = onBuy(item.id, item.cost, item.name);
    if (err) {
      toast.error(err, { description: `${item.name} custa ${item.cost} ouro.` });
      return;
    }
    toast.success(`${item.icon} ${item.name} ativado!`, { description: item.effect });
  };

  const discountMin = Math.max(0, Math.ceil((buffs.discountUntil - Date.now()) / 60000));
  const active = [
    buffs.doubleXp > 0 && `⚡ Duo XP x${buffs.doubleXp}`,
    buffs.goldBonus > 0 && `💰 Bônus de Ouro (${buffs.goldBonus} missões)`,
    buffs.luck > 0 && `🍀 Sorte (${buffs.luck} missões)`,
    buffs.xpShield > 0 && `🛡️ Escudo x${buffs.xpShield}`,
    discountMin > 0 && `🏷️ Desconto (${discountMin} min)`,
  ].filter(Boolean) as string[];

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

      {active.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {active.map(a => (
            <span key={a} className="text-[10px] font-semibold px-2 py-1 rounded-md bg-primary/15 text-primary border border-primary/30">{a}</span>
          ))}
        </div>
      )}

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

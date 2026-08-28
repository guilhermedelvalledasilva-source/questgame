import { motion } from 'framer-motion';
import { Shield, ShieldCheck, ShieldPlus, Swords, Crown, Coins, Sparkles } from 'lucide-react';

interface PlayerStatsProps {
  level: number;
  xp: number;
  gold: number;
  currentLevelXp: number;
  xpForNextLevel: number;
}

function getLevelIcon(level: number) {
  if (level >= 20) return { Icon: Crown, label: 'Lendário' };
  if (level >= 15) return { Icon: Swords, label: 'Mestre' };
  if (level >= 10) return { Icon: ShieldPlus, label: 'Veterano' };
  if (level >= 5) return { Icon: ShieldCheck, label: 'Guerreiro' };
  return { Icon: Shield, label: 'Novato' };
}

export function PlayerStats({ level, xp, gold, currentLevelXp, xpForNextLevel }: PlayerStatsProps) {
  const progress = (currentLevelXp / xpForNextLevel) * 100;
  const { Icon: LevelIcon, label: rankLabel } = getLevelIcon(level);

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="rounded-xl border border-border/60 bg-card p-5 shadow-elevation-2"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            key={level}
            initial={{ scale: 1.3, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            className="flex items-center justify-center w-12 h-12 rounded-lg gradient-primary shadow-glow-primary"
          >
            <LevelIcon className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{rankLabel}</p>
            <p className="text-2xl font-display font-bold text-primary">Nv. {level}</p>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-xp" />
            <div>
              <p className="text-xs text-muted-foreground">XP Total</p>
              <p className="text-lg font-bold text-xp">{xp}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-gold" />
            <div>
              <p className="text-xs text-muted-foreground">Ouro</p>
              <p className="text-lg font-bold text-gold">{gold}</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>{currentLevelXp} / {xpForNextLevel} XP</span>
          <span>Nível {level + 1}</span>
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full gradient-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

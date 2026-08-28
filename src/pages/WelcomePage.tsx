import { motion } from 'framer-motion';
import { Swords, Trophy, ShoppingBag, Store, BarChart3, Repeat, Sparkles, Coins, LogIn, CheckCircle2 } from 'lucide-react';

interface WelcomePageProps {
  onStart: () => void;
  onLoginClick: () => void;
}

const steps = [
  { icon: Swords, title: '1. Crie missões', desc: 'Transforme suas tarefas do dia a dia em missões, com recompensas de XP e ouro definidas por você.' },
  { icon: CheckCircle2, title: '2. Complete e evolua', desc: 'Ao concluir uma missão você ganha XP e ouro, sobe de nível e desbloqueia novos títulos.' },
  { icon: ShoppingBag, title: '3. Troque por recompensas', desc: 'Use o ouro acumulado para comprar recompensas reais que você mesmo cadastra na loja.' },
];

const highlights = [
  { icon: Repeat, label: 'Rotinas automáticas' },
  { icon: Store, label: 'Mercado de power-ups' },
  { icon: BarChart3, label: 'Gráficos de progresso' },
  { icon: Trophy, label: 'Níveis e títulos' },
];

export default function WelcomePage({ onStart, onLoginClick }: WelcomePageProps) {
  return (
    <div className="min-h-screen bg-background bg-gradient-hero">
      <header className="max-w-5xl mx-auto px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow-primary">
            <Swords className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-display font-bold text-base text-foreground">Quest<span className="text-primary">RPG</span></span>
        </div>
        <button
          onClick={onLoginClick}
          className="flex items-center gap-1.5 text-xs font-semibold text-foreground px-4 py-2 rounded-lg border border-border/60 bg-card/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 backdrop-blur-sm"
        >
          <LogIn className="w-3.5 h-3.5" /> Login
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-4 pb-16">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-10 pb-14 space-y-5">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="flex justify-center"
          >
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-glow-primary">
              <Swords className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Transforme tarefas em <span className="gradient-text-primary">missões épicas</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Quest RPG é um sistema de produtividade gamificado: crie missões a partir das suas tarefas reais, ganhe XP e
            ouro ao completá-las, suba de nível e troque suas conquistas por recompensas de verdade.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onStart}
              className="px-6 py-3 rounded-lg gradient-primary text-white font-semibold text-sm shadow-glow-primary hover:opacity-90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Começar Aventura ⚔️
            </button>
            <button
              onClick={onLoginClick}
              className="px-6 py-3 rounded-lg border border-border/60 text-foreground font-semibold text-sm hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
            >
              Já tenho conta
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground pt-1">Seu progresso fica salvo automaticamente neste dispositivo.</p>
        </motion.div>

        {/* Como funciona */}
        <div className="space-y-4 pb-14">
          <h2 className="text-center text-xl font-bold text-foreground">Como funciona</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border/60 bg-card p-5 shadow-elevation-1 hover:shadow-elevation-2 hover:border-primary/40 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-sm text-foreground mb-1">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border/60 bg-card p-5 shadow-elevation-2 mb-14"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Guerreiro</p>
                <p className="font-display font-bold text-lg text-primary">Nv. 7</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-xp">
                <Sparkles className="w-4 h-4" /> 420 XP
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gold">
                <Coins className="w-4 h-4" /> 180
              </div>
            </div>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden mb-1.5">
            <div className="h-full rounded-full gradient-primary" style={{ width: '64%' }} />
          </div>
          <p className="text-[10px] text-muted-foreground">
            Exemplo de progresso — assim que você completa missões, XP e ouro sobem automaticamente.
          </p>
        </motion.div>

        {/* Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {highlights.map(h => (
            <div key={h.label} className="flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card/60 p-4 text-center">
              <h.icon className="w-5 h-5 text-primary" />
              <span className="text-[11px] font-medium text-muted-foreground">{h.label}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

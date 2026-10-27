import { motion } from 'framer-motion';
import { Swords, ShoppingBag, BarChart3, Store, Star, Repeat, Clock, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
  { icon: Swords, title: 'Missões', desc: 'Crie tarefas como missões RPG e ganhe XP e ouro ao completá-las.', path: '/quests', color: 'text-primary' },
  { icon: Repeat, title: 'Rotinas', desc: 'Marque missões como rotina e elas se repetem automaticamente!', path: '/quests', color: 'text-xp' },
  { icon: ShoppingBag, title: 'Loja de Recompensas', desc: 'Gaste seu ouro em recompensas reais que você mesmo define.', path: '/shop', color: 'text-gold' },
  { icon: Store, title: 'Mercado', desc: 'Power-ups como Duo XP, extensão de prazo e muito mais!', path: '/market', color: 'text-primary' },
  { icon: BarChart3, title: 'Gráficos', desc: 'Acompanhe seu progresso com gráficos de XP e ouro.', path: '/charts', color: 'text-xp' },
  { icon: Clock, title: 'Prazos', desc: 'Adicione datas de entrega opcionais às suas missões.', path: '/quests', color: 'text-gold' },
  { icon: Edit3, title: 'Editar Missões', desc: 'Edite título, descrição, recompensas e prioridade.', path: '/quests', color: 'text-primary' },
  { icon: Star, title: 'Ranking', desc: 'Suba de nível e desbloqueie novos ícones e títulos!', path: '/quests', color: 'text-gold' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* How it works */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground text-center uppercase tracking-wider">Como funciona</h2>
        <div className="grid grid-cols-2 gap-2">
          {features.map((f, i) => (
            <motion.button
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -2 }}
              onClick={() => navigate(f.path)}
              className="rounded-xl border border-border/60 bg-card p-3 text-left shadow-elevation-1 hover:shadow-elevation-2 hover:border-primary/50 transition-all duration-200"
            >
              <f.icon className={`w-5 h-5 ${f.color} mb-2`} strokeWidth={2} />
              <h3 className="text-xs font-bold text-foreground">{f.title}</h3>
              <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{f.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Home, Swords, ShoppingBag, BarChart3, Store } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/', icon: Home, label: 'Início' },
  { path: '/quests', icon: Swords, label: 'Missões' },
  { path: '/shop', icon: ShoppingBag, label: 'Loja' },
  { path: '/market', icon: Store, label: 'Mercado' },
  { path: '/charts', icon: BarChart3, label: 'Gráficos' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-card/95 backdrop-blur-md shadow-elevation-2">
      <div className="max-w-5xl mx-auto flex items-center justify-around py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {active && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full gradient-primary" />
              )}
              <Icon className="w-5 h-5" strokeWidth={active ? 2.25 : 2} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

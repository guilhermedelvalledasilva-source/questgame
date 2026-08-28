import { useState, useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { HistoryEvent } from '@/hooks/useGameState';

type Period = 'day' | 'week' | 'month' | 'year';

interface ChartsPageProps {
  history: HistoryEvent[];
}

function getDateKey(timestamp: number, period: Period): string {
  const d = new Date(timestamp);
  switch (period) {
    case 'day':
      return `${d.getHours()}h`;
    case 'week':
      return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][d.getDay()];
    case 'month':
      return `${d.getDate()}/${d.getMonth() + 1}`;
    case 'year':
      return ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][d.getMonth()];
  }
}

function filterByPeriod(events: HistoryEvent[], period: Period): HistoryEvent[] {
  const now = Date.now();
  const ms: Record<Period, number> = {
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    year: 365 * 24 * 60 * 60 * 1000,
  };
  return events.filter(e => now - e.timestamp <= ms[period]);
}

const periodLabels: Record<Period, string> = {
  day: 'Dia',
  week: 'Semana',
  month: 'Mês',
  year: 'Ano',
};

export default function ChartsPage({ history }: ChartsPageProps) {
  const [period, setPeriod] = useState<Period>('week');

  const chartData = useMemo(() => {
    const filtered = filterByPeriod(history, period);
    const grouped: Record<string, { xpGained: number; goldGained: number; goldSpent: number }> = {};

    filtered.forEach(event => {
      const key = getDateKey(event.timestamp, period);
      if (!grouped[key]) grouped[key] = { xpGained: 0, goldGained: 0, goldSpent: 0 };
      if (event.type === 'xp_gained') grouped[key].xpGained += event.amount;
      if (event.type === 'gold_gained') grouped[key].goldGained += event.amount;
      if (event.type === 'gold_spent') grouped[key].goldSpent += event.amount;
    });

    return Object.entries(grouped).map(([name, data]) => ({ name, ...data }));
  }, [history, period]);

  const totals = useMemo(() => {
    const filtered = filterByPeriod(history, period);
    return filtered.reduce(
      (acc, e) => {
        if (e.type === 'xp_gained') acc.xp += e.amount;
        if (e.type === 'gold_gained') acc.goldGained += e.amount;
        if (e.type === 'gold_spent') acc.goldSpent += e.amount;
        return acc;
      },
      { xp: 0, goldGained: 0, goldSpent: 0 }
    );
  }, [history, period]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" /> Histórico
        </h2>
        <div className="flex gap-1 bg-muted rounded-lg p-0.5">
          {(Object.keys(periodLabels) as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                period === p ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-border/60 bg-card p-3 text-center shadow-elevation-1">
          <p className="text-[10px] text-muted-foreground uppercase">XP Ganho</p>
          <p className="text-lg font-bold text-xp">+{totals.xp}</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-3 text-center shadow-elevation-1">
          <p className="text-[10px] text-muted-foreground uppercase">Ouro Ganho</p>
          <p className="text-lg font-bold text-gold">+{totals.goldGained}</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-3 text-center shadow-elevation-1">
          <p className="text-[10px] text-muted-foreground uppercase">Ouro Gasto</p>
          <p className="text-lg font-bold text-destructive">-{totals.goldSpent}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-border/60 bg-card p-4 shadow-elevation-1">
        {chartData.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">Nenhum dado nesse período.</p>
            <p className="text-xs mt-1">Complete missões para ver seus gráficos! 📊</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '10px',
                  color: 'hsl(var(--card-foreground))',
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="xpGained" name="XP Ganho" fill="hsl(var(--xp))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="goldGained" name="Ouro Ganho" fill="hsl(var(--gold))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="goldSpent" name="Ouro Gasto" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* History list */}
      <div className="rounded-xl border border-border/60 bg-card shadow-elevation-1">
        <div className="p-3 border-b border-border/60">
          <h3 className="text-sm font-semibold text-foreground">Histórico Recente</h3>
        </div>
        <div className="max-h-60 overflow-y-auto divide-y divide-border/60">
          {filterByPeriod(history, period).slice().reverse().slice(0, 30).map(event => (
            <div key={event.id} className="px-3 py-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-foreground">{event.source}</p>
                <p className="text-[10px] text-muted-foreground">
                  {new Date(event.timestamp).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                </p>
              </div>
              <span className={`text-sm font-bold ${
                event.type === 'xp_gained' ? 'text-xp' : event.type === 'gold_gained' ? 'text-gold' : 'text-destructive'
              }`}>
                {event.type === 'gold_spent' ? '-' : '+'}{event.amount}
                {event.type === 'xp_gained' ? ' XP' : ' 🪙'}
              </span>
            </div>
          ))}
          {history.length === 0 && (
            <div className="p-4 text-center text-xs text-muted-foreground">Nenhum histórico ainda.</div>
          )}
        </div>
      </div>
    </div>
  );
}

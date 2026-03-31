import { AnimatePresence } from 'framer-motion';
import { Swords } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { PlayerStats } from '@/components/PlayerStats';
import { QuestCard } from '@/components/QuestCard';
import { CreateQuestDialog } from '@/components/CreateQuestDialog';
import { RewardShop } from '@/components/RewardShop';

const Index = () => {
  const {
    xp, gold, quests, rewards, levelInfo,
    addQuest, toggleQuest, deleteQuest, purchaseReward, deleteReward,
  } = useGameState();

  const activeQuests = quests.filter(q => !q.completed);
  const completedQuests = quests.filter(q => q.completed);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="w-6 h-6 text-primary" />
            <h1 className="font-pixel text-sm text-primary">QUEST RPG</h1>
          </div>
          <CreateQuestDialog onAdd={addQuest} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <PlayerStats
          level={levelInfo.level}
          xp={xp}
          gold={gold}
          currentLevelXp={levelInfo.currentLevelXp}
          xpForNextLevel={levelInfo.xpForNextLevel}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              ⚔️ Missões Ativas <span className="text-sm font-normal text-muted-foreground">({activeQuests.length})</span>
            </h2>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {activeQuests.map(q => (
                  <QuestCard key={q.id} quest={q} onToggle={toggleQuest} onDelete={deleteQuest} />
                ))}
              </AnimatePresence>
              {activeQuests.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-sm">Nenhuma missão ativa.</p>
                  <p className="text-xs mt-1">Crie uma nova missão para começar! ⚔️</p>
                </div>
              )}
            </div>

            {completedQuests.length > 0 && (
              <div className="space-y-2 pt-4">
                <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  ✅ Completadas ({completedQuests.length})
                  <span className="text-xs font-normal">— clique para desmarcar</span>
                </h2>
                <AnimatePresence mode="popLayout">
                  {completedQuests.map(q => (
                    <QuestCard key={q.id} quest={q} onToggle={toggleQuest} onDelete={deleteQuest} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div>
            <RewardShop rewards={rewards} gold={gold} onPurchase={purchaseReward} onDelete={deleteReward} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

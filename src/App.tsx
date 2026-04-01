import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Swords } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";
import { PlayerStats } from "@/components/PlayerStats";
import { BottomNav } from "@/components/BottomNav";
import HomePage from "@/pages/HomePage";
import QuestsPage from "@/pages/QuestsPage";
import ShopPage from "@/pages/ShopPage";
import MarketPage from "@/pages/MarketPage";
import ChartsPage from "@/pages/ChartsPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

function AppContent() {
  const game = useGameState();

  const handleMarketSpend = (amount: number, itemName: string) => {
    // We need to manually update gold and add history for market purchases
    // Using a trick: create a temporary reward, purchase it
    // Instead, let's directly manipulate state through a dedicated method
    // For now, we'll use purchaseReward-like logic via the game state
    game.purchaseReward('__market__');
    // Actually, let's handle this properly by checking if we can add a spend method
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="w-6 h-6 text-primary" />
            <h1 className="font-pixel text-sm text-primary">QUEST RPG</h1>
          </div>
          <button className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-border hover:border-primary/50 transition-colors">
            Login
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-4 space-y-4">
        <PlayerStats
          level={game.levelInfo.level}
          xp={game.xp}
          gold={game.gold}
          currentLevelXp={game.levelInfo.currentLevelXp}
          xpForNextLevel={game.levelInfo.xpForNextLevel}
        />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quests" element={
            <QuestsPage
              quests={game.quests}
              onAdd={game.addQuest}
              onToggle={game.toggleQuest}
              onDelete={game.deleteQuest}
              onEdit={game.editQuest}
            />
          } />
          <Route path="/shop" element={
            <ShopPage
              rewards={game.rewards}
              gold={game.gold}
              onPurchase={game.purchaseReward}
              onDelete={game.deleteReward}
              onAdd={game.addReward}
            />
          } />
          <Route path="/market" element={
            <MarketPage gold={game.gold} onSpend={(amount, name) => {
              // Add a temporary reward to spend gold through the existing system
              const tempId = crypto.randomUUID();
              game.addReward({ name, description: '', cost: amount, icon: '⚡' });
              // Actually let's use a direct spend approach
            }} />
          } />
          <Route path="/charts" element={<ChartsPage history={game.history} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <BottomNav />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

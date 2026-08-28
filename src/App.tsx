import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner, toast } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Swords, LogIn, LogOut } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";
import { useAuth, type AuthUser } from "@/hooks/useAuth";
import { PlayerStats } from "@/components/PlayerStats";
import { BottomNav } from "@/components/BottomNav";
import { AuthDialog } from "@/components/AuthDialog";
import WelcomePage from "@/pages/WelcomePage";
import HomePage from "@/pages/HomePage";
import QuestsPage from "@/pages/QuestsPage";
import ShopPage from "@/pages/ShopPage";
import MarketPage from "@/pages/MarketPage";
import ChartsPage from "@/pages/ChartsPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

function AppContent() {
  const auth = useAuth();
  const game = useGameState(auth.currentUser?.id ?? "guest");
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  const openAuth = (tab: "login" | "register" = "login") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const handleAuthSuccess = (user: AuthUser) => {
    toast.success(`Bem-vindo, ${user.name}! 🎉`, { description: "Seu progresso deste perfil foi carregado." });
  };

  if (!auth.hasEntered) {
    return (
      <>
        <WelcomePage onStart={auth.enter} onLoginClick={() => openAuth("login")} />
        <AuthDialog
          open={authOpen}
          onOpenChange={setAuthOpen}
          defaultTab={authTab}
          onLogin={auth.login}
          onRegister={auth.register}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-gradient-hero pb-20">
      <header className="border-b border-border/60 bg-card/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow-primary">
              <Swords className="w-4.5 h-4.5 text-white" />
            </div>
            <h1 className="font-display font-bold text-base tracking-tight text-foreground">
              Quest<span className="text-primary">RPG</span>
            </h1>
          </div>

          {auth.currentUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-xs font-semibold text-foreground">{auth.currentUser.name}</span>
                <span className="text-[10px] text-muted-foreground">{auth.currentUser.email}</span>
              </div>
              <button
                onClick={() => { auth.logout(); toast("Você saiu da conta.", { description: "Seus dados continuam salvos neste dispositivo." }); }}
                title="Sair"
                className="p-2 rounded-lg border border-border/60 hover:border-destructive/50 hover:text-destructive text-muted-foreground transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuth("login")}
              className="flex items-center gap-1.5 text-xs font-semibold text-foreground px-3 py-1.5 rounded-lg border border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
            >
              <LogIn className="w-3.5 h-3.5" /> Login
            </button>
          )}
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
            <MarketPage gold={game.gold} onSpend={game.spendGold} />
          } />
          <Route path="/charts" element={<ChartsPage history={game.history} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <BottomNav />
      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        defaultTab={authTab}
        onLogin={auth.login}
        onRegister={auth.register}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner position="top-center" richColors closeButton />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

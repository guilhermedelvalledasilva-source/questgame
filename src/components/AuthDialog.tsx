import { useEffect, useState } from 'react';
import { LogIn, Mail, Lock, User, UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { AuthUser } from '@/hooks/useAuth';

type Tab = 'login' | 'register';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: Tab;
  onLogin: (email: string, password: string) => Promise<AuthUser>;
  onRegister: (name: string, email: string, password: string) => Promise<AuthUser>;
  onSuccess: (user: AuthUser) => void;
}

export function AuthDialog({ open, onOpenChange, defaultTab = 'login', onLogin, onRegister, onSuccess }: AuthDialogProps) {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setTab(defaultTab);
      setError('');
    }
  }, [open, defaultTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = tab === 'login' ? await onLogin(email, password) : await onRegister(name, email, password);
      setName('');
      setEmail('');
      setPassword('');
      onOpenChange(false);
      onSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algo deu errado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-sm border-border/60 bg-card p-6">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold text-foreground flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow-primary shrink-0">
              {tab === 'login' ? <LogIn className="w-4 h-4 text-white" /> : <UserPlus className="w-4 h-4 text-white" />}
            </div>
            {tab === 'login' ? 'Entrar' : 'Criar Conta'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <button
            type="button"
            onClick={() => { setTab('login'); setError(''); }}
            className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-all duration-200 ${
              tab === 'login' ? 'bg-primary text-primary-foreground shadow-elevation-1' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(''); }}
            className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-all duration-200 ${
              tab === 'register' ? 'bg-primary text-primary-foreground shadow-elevation-1' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Criar Conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 mt-1">
          {tab === 'register' && (
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome</label>
              <div className="relative mt-1">
                <User className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" className="pl-9 bg-muted border-border/60" />
              </div>
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
            <div className="relative mt-1">
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@email.com" className="pl-9 bg-muted border-border/60" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Senha</label>
            <div className="relative mt-1">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input type="password" required minLength={4} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="pl-9 bg-muted border-border/60" />
            </div>
          </div>

          {error && <p className="text-xs text-destructive font-medium">{error}</p>}

          <Button type="submit" variant="gradient" disabled={loading} className="w-full font-semibold">
            {loading ? 'Aguarde...' : tab === 'login' ? 'Entrar' : 'Criar Conta'}
          </Button>

          <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
            Seus dados ficam salvos apenas neste dispositivo, no armazenamento local do navegador.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

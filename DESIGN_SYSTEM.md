# Quest RPG — Design System

Documento de referência do sistema de design aplicado ao projeto em 2026-08-28.
Baseado no visual original do app (fundo escuro + azul), tornado mais vivo com um
accent violeta para gradientes, tipografia mais legível e uma escala consistente
de bordas/sombras.

## 1. Paleta

| Token              | Hex        | HSL                  | Uso                                   |
|---------------------|-----------|-----------------------|----------------------------------------|
| `--background`      | `#0B1220` | `222 47% 6%`          | Fundo base da aplicação                |
| `--card`            | `#0F1729` | `222 44% 9%`          | Cards, superfícies elevadas            |
| `--primary`         | `#3B82F6` | `217 91% 60%`         | Cor primária (mantida do app original) |
| `--violet` (novo)   | `#8B5CF6` | `262 83% 63%`         | Accent para gradientes "primary → violet" |
| `--gold`            | `#EAB308` | `45 93% 58%`          | Ouro / moeda do jogo                   |
| `--xp`              | `#22C55E` | `142 71% 45%`         | XP / sucesso                           |
| `--destructive`     | `#DC2626` | `0 63% 50%`           | Erros, ações destrutivas               |

Gradientes sutis (135deg, `primary → violet` e `gold → âmbar`) são usados em:
botões primários, ícone do header/hero, badges de nível, barra de progresso de XP
e botão da loja de recompensas. Nunca em textos de corpo ou grandes áreas planas.

## 2. Tipografia

- **Display (títulos):** Space Grotesk — 500/600/700. Substitui a fonte pixelada
  (`Press Start 2P`) usada antes, que prejudicava a legibilidade.
- **Corpo:** Inter — 400/500/600/700 (mantida do app original).

Escala:

| Elemento | Tamanho | Peso | Espaçamento |
|----------|---------|------|-------------|
| H1       | 32px (2rem) | 700 | tracking-tight |
| H2       | 20–24px | 700 | tracking-tight |
| H3       | 14–18px | 600 | normal |
| Body     | 14–16px | 400–500 | normal |
| Caption/label | 10–12px | 500–700 | uppercase, tracking-wide |

## 3. Bordas & sombras

- Raio: botões/inputs `rounded-lg` (8px) · cards `rounded-xl` (12px) · modais `rounded-2xl` (16px).
- Bordas: 1px, sempre com opacidade reduzida (`border-border/60`) em vez de sólidas.
- Sombras em camadas, definidas em `tailwind.config.ts`:
  - `shadow-elevation-1` — cards em repouso
  - `shadow-elevation-2` — hover / elementos flutuantes
  - `shadow-elevation-3` — modais
  - `shadow-glow-primary` / `shadow-glow-gold` — glow sutil em elementos de destaque (botão primário, ícone do header, badge de nível)

## 4. Ícones

- Biblioteca única: **lucide-react** (já era a única usada no projeto — mantida).
- `stroke-width` padrão 2 em todo o app; itens ativos (nav inferior) usam 2.25 para leve ênfase.

## 5. Micro-interações

- Hover em cards/botões: leve elevação de sombra + `scale` sutil (1.01–1.02).
- `active:scale-[0.98]` em botões para feedback de clique.
- Transições padronizadas em 150–200ms, `ease` padrão do Tailwind.
- Foco visível (`focus-visible:ring-2 ring-ring`) mantido em todos os campos/botões shadcn.
- Toasts (via `sonner`) para: missão concluída, recompensa comprada, item do mercado comprado,
  login/cadastro/logout, erros de autenticação e ouro insuficiente.

## 6. Tokens centrais

Toda cor, gradiente, sombra e raio vive em dois lugares apenas:

- `src/index.css` — variáveis HSL (`:root`) + utilitários (`.gradient-primary`,
  `.gradient-gold`, `.gradient-text-primary`, `.bg-gradient-hero`).
- `tailwind.config.ts` — mapeamento das variáveis para classes Tailwind
  (`colors`, `boxShadow`, `backgroundImage`, `fontFamily`, `borderRadius`).

Nenhum componente deve usar cores hexadecimais/HSL soltas — o único lugar com
cores literais fora dos tokens é o `ChartsPage.tsx`, que agora referencia as
mesmas CSS vars (`hsl(var(--xp))` etc.) para colorir o gráfico do Recharts.

## 7. Autenticação e persistência (contexto do produto)

Não há backend — o app roda 100% no navegador. Login/cadastro (`useAuth.ts`) e
progresso do jogo (`useGameState.ts`) ficam salvos exclusivamente no
`localStorage` da máquina do usuário:

- `quest-rpg-users` — lista de contas locais (senha nunca é salva em texto puro;
  é hasheada com SHA-256 + salt via Web Crypto).
- `quest-rpg-session` — sessão ativa.
- `quest-rpg-state:<userId|guest>` — progresso (missões, recompensas, XP, ouro,
  histórico), namespaced por conta, permitindo múltiplos perfis no mesmo dispositivo.
- `quest-rpg-entered` — controla se a tela inicial (Welcome) já foi vista.

Como é um sistema local (sem servidor), o login funciona como um "perfil" —
segurança real de senha exigiria um backend, fora do escopo deste app estático.

## 8. Bug corrigido

Ao completar uma missão de rotina, o app cria automaticamente uma nova cópia
ativa (para repetição) enquanto marca a original como concluída. Um duplo clique
rápido no card disparava `onToggle` duas vezes antes do primeiro re-render:
o segundo clique "desmarcava" a cópia recém-concluída, deixando duas missões
ativas com o mesmo título. Corrigido com um lock de 500ms em
`src/components/QuestCard.tsx` (`toggleLockRef`), que ignora cliques repetidos
no mesmo card enquanto o primeiro ainda está sendo processado.

## 9. Revisão crítica (pontos de atenção)

- Os emojis (🎮🍕🏆 etc.) usados como ícones de recompensas continuam soltos —
  mantidos de propósito, pois são conteúdo definido *pelo usuário* na loja, não
  parte do sistema de ícones da UI.
- O botão "Login" nos estados deslogado usa `variant="outline"` manual (não o
  componente `Button` com a variante `gradient`) para não competir visualmente
  com o CTA principal — é a única inconsistência intencional do sistema.
- Os arquivos gerados pelo shadcn/ui não utilizados após a migração para
  `sonner` (`hooks/use-toast.ts`, `components/ui/toast.tsx`,
  `components/ui/toaster.tsx`) foram deixados no projeto (não são importados em
  nenhum lugar) para não quebrar um eventual `npx shadcn add` futuro — mas podem
  ser apagados com segurança se preferir um repositório mais enxuto.

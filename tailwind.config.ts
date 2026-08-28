import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  safelist: [
    'bg-priority-low/10', 'bg-priority-low/20', 'text-priority-low', 'border-priority-low/30', 'border-priority-low/50',
    'bg-priority-medium/10', 'bg-priority-medium/20', 'text-priority-medium', 'border-priority-medium/30', 'border-priority-medium/50',
    'bg-priority-high/10', 'bg-priority-high/20', 'text-priority-high', 'border-priority-high/30', 'border-priority-high/50',
    'bg-priority-critical/10', 'bg-priority-critical/20', 'text-priority-critical', 'border-priority-critical/30', 'border-priority-critical/50',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        violet: {
          DEFAULT: "hsl(var(--violet))",
          foreground: "hsl(var(--violet-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          foreground: "hsl(var(--gold-foreground))",
        },
        xp: {
          DEFAULT: "hsl(var(--xp))",
          foreground: "hsl(var(--xp-foreground))",
        },
        priority: {
          low: "hsl(var(--priority-low))",
          medium: "hsl(var(--priority-medium))",
          high: "hsl(var(--priority-high))",
          critical: "hsl(var(--priority-critical))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "elevation-1": "0 1px 2px 0 rgba(0,0,0,0.30)",
        "elevation-2": "0 4px 14px -2px rgba(0,0,0,0.35), 0 2px 4px -2px rgba(0,0,0,0.20)",
        "elevation-3": "0 16px 40px -10px rgba(0,0,0,0.50), 0 6px 16px -6px rgba(0,0,0,0.30)",
        "glow-primary": "0 0 0 1px hsl(217 91% 60% / 0.15), 0 8px 24px -8px hsl(217 91% 60% / 0.45)",
        "glow-gold": "0 0 0 1px hsl(45 93% 58% / 0.15), 0 8px 24px -8px hsl(45 93% 58% / 0.45)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--violet)))",
        "gradient-gold": "linear-gradient(135deg, hsl(var(--gold)), hsl(38 92% 50%))",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#08080A',
        'obsidian-mid': '#111116',
        'obsidian-light': '#1C1C24',
        'obsidian-surface': '#242430',
        platinum: '#E2E2E8',
        'platinum-dim': '#9090A0',
        'platinum-muted': '#58586A',
        'white-gold': {
          DEFAULT: '#C9B99A',
          bright: '#E0D0B8',
          deep: '#A89478',
          dim: 'rgba(201,185,154,0.3)',
        },
        mercury: '#8C8C9E',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body:    ['var(--font-jost)',      'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-sheen':
          'linear-gradient(90deg,#A89478,#E0D0B8,#C9B99A,#BFA87A,#E0D0B8,#A89478)',
      },
      boxShadow: {
        'gold-glow':
          '0 0 30px rgba(201,185,154,0.18), 0 0 60px rgba(201,185,154,0.06)',
      },
    },
  },
  plugins: [],
}

export default config

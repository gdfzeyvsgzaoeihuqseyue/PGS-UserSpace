import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primaryn: 'var(--color-primary)',
        secondaryn: 'var(--color-secondary)',
        textClr: 'var(--color-text)',
        danger: 'var(--color-danger)',
        dangerAct: 'var(--color-dangerAct)',
        bgClr: 'var(--color-background)',
        WtB: 'var(--color-WtB)',
        WtBAct: 'var(--color-WtBAct)',
        BtW: 'var(--color-BtW)',
        BtWAct: 'var(--color-BtWAct)',
        ash: 'var(--color-ash)',
        ashAct: 'var(--color-ashAct)',
        hsa: 'var(--color-hsa)',
        hsaAct: 'var(--color-hsaAct)',



        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
          950: 'var(--color-primary-950)',
          DEFAULT: 'var(--color-primary-600)',
        },
        secondary: {
          50: 'var(--color-secondary-50)',
          100: 'var(--color-secondary-100)',
          200: 'var(--color-secondary-200)',
          300: 'var(--color-secondary-300)',
          400: 'var(--color-secondary-400)',
          500: 'var(--color-secondary-500)',
          600: 'var(--color-secondary-600)',
          700: 'var(--color-secondary-700)',
          800: 'var(--color-secondary-800)',
          900: 'var(--color-secondary-900)',
          950: 'var(--color-secondary-950)',
          DEFAULT: 'var(--color-secondary-600)',
        }
      }
    },
  },
  plugins: [],
} satisfies Config

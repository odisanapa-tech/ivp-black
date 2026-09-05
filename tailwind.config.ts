import type { Config } from 'tailwindcss';

/**
 * Дизайн-система перенесена из репозитория старого сайта ivp-site:
 * палитра, типографская шкала, скругления, тени. Заказчику это оформление
 * нравится, поэтому значения не пересматриваются.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2rem' },
      screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1200px', '2xl': '1280px' },
    },
    extend: {
      colors: {
        page: '#F7F3EE',
        card: '#EDE5DE',
        accent: { DEFAULT: '#6E4C7A', hover: '#5A3D64', soft: '#EDE4F0' },
        bronze: '#A88054',
        ink: '#2A2028',
        muted: '#5F5560',
        rule: '#D9CFC6',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['clamp(2.5rem, 5vw, 4.25rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-2': ['clamp(2rem, 4vw, 3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'display-3': ['clamp(1.6rem, 3vw, 2.25rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      borderRadius: { lg: '14px', md: '10px', sm: '6px' },
      boxShadow: {
        soft: '0 1px 2px rgba(42, 32, 40, 0.04)',
        card: '0 1px 3px rgba(42, 32, 40, 0.05), 0 1px 1px rgba(42, 32, 40, 0.03)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: { 'fade-up': 'fade-up 0.4s ease-out both' },
    },
  },
  plugins: [],
};

export default config;

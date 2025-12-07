/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        'brand-blue': '#1F4E79',      // Institutional Navy Blue
        'brand-red': '#E30A17',       // Turkey Red (Accent)
        'brand-teal': '#00A896',      // Trust/Growth Green-Teal
        
        // Neutral Palette
        'neutral-white': '#FFFFFF',
        'neutral-light': '#F4F6F8',
        'neutral-pale': '#F9FAFB',
        'neutral-gray': '#E5E7EB',
        'neutral-text': '#1A1A1A',
        'neutral-muted': '#424242',
        'neutral-meta': '#5E6C84',
        
        // State Colors
        'success-light': '#D1E8DC',
        'success-dark': '#027857',
        'warning-light': '#FEF3C7',
        'warning-dark': '#D97706',
        'error-light': '#FEE2E2',
        'error-dark': '#DC2626',
        'info-light': '#DBEAFE',
        'info-dark': '#0284C7',
      },
      fontFamily: {
        'sans': ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
        'mono': ['Fira Code', 'monospace'],
      },
      fontSize: {
        'h1': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['2rem', { lineHeight: '1.3', fontWeight: '700' }],
        'h3': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'label': ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      spacing: {
        'section': '6rem',
        'container-padding': '2rem',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
        'elevated': '0 8px 24px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'lg': '0.5rem',
        'xl': '0.75rem',
      },
    },
  },
  plugins: [],
}

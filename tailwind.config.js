module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
      },
      keyframes: {
        flow: {
          '0%': { transform: 'translateX(-25%)' },
          '50%': { transform: 'translateX(25%)' },
          '100%': { transform: 'translateX(-25%)' },
        },
      },
      animation: {
        flow: 'flow 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

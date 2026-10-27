@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #2563eb;
  --bg-light: #f3f4f6;
}

html, body {
  height: 100%;
}

body {
  background-color: var(--bg-light);
  color: #0f172a;
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.hero-gradient {
  background: linear-gradient(120deg, rgba(37, 99, 235, 0.14), rgba(37, 99, 235, 0.06), rgba(96, 165, 250, 0.08));
  position: relative;
  overflow: hidden;
}

.hero-gradient::before {
  content: "";
  position: absolute;
  inset: -40% -10%;
  background: linear-gradient(120deg, rgba(37,99,235,0.10), rgba(99,102,241,0.08), rgba(59,130,246,0.12));
  filter: blur(48px);
  transform: translateX(-25%);
  animation: flow 10s ease-in-out infinite;
  z-index: 0;
}

@keyframes flow {
  0% { transform: translateX(-25%) scale(1); }
  50% { transform: translateX(25%) scale(1.08); }
  100% { transform: translateX(-25%) scale(1); }
}

.nav-sticky {
  backdrop-filter: blur(6px);
  background-color: rgba(255,255,255,0.7);
}

.tool-card {
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
textarea,
select {
  font: inherit;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

@media (max-width: 767px) {
  .max-w-7xl {
    max-width: 100%;
  }
}

input::placeholder {
  color: #64748b;
}


































































































































































































































































































































































































































































































";

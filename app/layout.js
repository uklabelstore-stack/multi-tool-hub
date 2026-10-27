@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #2563eb;
  --primary-soft: #dbeafe;
  --bg-soft: #f8fafc;
  --bg-section: #f3f4f6;
  --panel: #ffffff;
  --text: #0f172a;
  --muted: #475569;
  --line: rgba(148, 163, 184, 0.25);
}

html {
  scroll-behavior: smooth;
}

html,
body {
  min-height: 100%;
}

body {
  background: linear-gradient(180deg, #f8fbff 0%, #f5f8fb 100%);
  color: var(--text);
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

img {
  max-width: 100%;
  display: block;
}

p {
  margin: 0;
}

button,
input,
textarea,
select {
  font: inherit;
}

::selection {
  background: rgba(37, 99, 235, 0.15);
}

.hero-gradient {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.14), rgba(147, 197, 253, 0.12), rgba(255, 255, 255, 0.85));
  position: relative;
  overflow: hidden;
}

.hero-gradient::before {
  content: "";
  position: absolute;
  inset: -30% -10% auto -15%;
  height: 520px;
  background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.2), transparent 42%),
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.14), transparent 38%);
  filter: blur(30px);
  z-index: 0;
}

.hero-gradient > * {
  position: relative;
  z-index: 1;
}

.nav-sticky {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.76);
}

.tool-card {
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
}

.tool-card:focus-visible,
button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 3px solid rgba(37, 99, 235, 0.25);
  outline-offset: 2px;
}

#tool-search input::-webkit-search-cancel-button {
  display: none;
}

#tool-search input {
  -webkit-appearance: none;
}

input::placeholder {
  color: #64748b;
}

button,
input,
textarea,
select {
  border-radius: 0.75rem;
}

@media (max-width: 640px) {
  .tool-card {
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  .tool-card,
  .hero-gradient::before {
    transition: none;
    animation: none;
  }
}

@layer utilities {
  .shadow-soft {
    box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
  }
}

a {
  color: inherit;
  text-decoration: none;
}

@media (max-width: 767px) {
  .max-w-7xl {
    max-width: 100%;
  }
}











































































































































































































































































































































";






















































































































































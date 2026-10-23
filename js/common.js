document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const yearNode = document.getElementById('year');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  const preferredTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (preferredTheme === 'dark' || (!preferredTheme && systemDark)) {
    body.classList.add('dark');
  }

  const toggleButtons = document.querySelectorAll('.theme-toggle');
  toggleButtons.forEach((button) => {
    const updateButton = () => {
      button.textContent = body.classList.contains('dark') ? '☀️' : '🌙';
    };
    updateButton();
    button.addEventListener('click', () => {
      body.classList.toggle('dark');
      localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
      updateButton();
    });
  });
});

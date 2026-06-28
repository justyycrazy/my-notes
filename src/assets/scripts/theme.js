// View Transitions 页面切换时同步主题
document.addEventListener('astro:before-swap', (e) => {
  const theme = (() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (_) { /* noop */ }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  })();
  e.newDocument.documentElement.setAttribute('data-theme', theme);
});

// 监听系统主题变化：仅当用户未手动覆盖时跟随
const mq = window.matchMedia('(prefers-color-scheme: dark)');
mq.addEventListener('change', (e) => {
  try {
    if (localStorage.getItem('theme')) return;
  } catch (_) { /* noop */ }
  document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
});

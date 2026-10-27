// 從 YourWowAI 伺服器讀取即時統計（註冊人數、作品數），顯示在頁面上。讀不到就維持隱藏。
(() => {
  const boxes = document.querySelectorAll('[data-live-stats]');
  if (!boxes.length) return;
  fetch('https://yourwowai.onepointzeroone.org/api/stats')
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .then((stats) => {
      const fmt = new Intl.NumberFormat(document.documentElement.lang || 'en');
      boxes.forEach((box) => {
        box.querySelectorAll('[data-stat]').forEach((el) => {
          el.textContent = fmt.format(stats[el.dataset.stat] ?? 0);
        });
        box.querySelectorAll('[data-plural]').forEach((el) => {
          el.textContent = stats[el.dataset.plural] === 1 ? el.dataset.one : el.dataset.other;
        });
        box.hidden = false;
      });
    })
    .catch(() => {});
})();

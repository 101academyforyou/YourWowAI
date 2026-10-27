// 從 YourWowAI 伺服器讀取即時統計（註冊人數、作品數），顯示在頁面上。
// 區塊一開始就佔好位置（透明），數字到了再淡入，頁面不會跳動；上次的數字存在瀏覽器，下次一打開就先顯示。
(() => {
  const boxes = document.querySelectorAll('[data-live-stats]');
  if (!boxes.length) return;
  const CACHE_KEY = 'yourwowai.stats';
  const fmt = new Intl.NumberFormat(document.documentElement.lang || 'en');

  function show(stats) {
    boxes.forEach((box) => {
      box.querySelectorAll('[data-stat]').forEach((el) => {
        el.textContent = fmt.format(stats[el.dataset.stat] ?? 0);
      });
      box.querySelectorAll('[data-plural]').forEach((el) => {
        el.textContent = stats[el.dataset.plural] === 1 ? el.dataset.one : el.dataset.other;
      });
      box.classList.remove('is-loading');
    });
  }

  let cached = null;
  try {
    cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null');
  } catch {
    cached = null;
  }
  if (cached && typeof cached.users === 'number') show(cached);

  fetch('https://yourwowai.onepointzeroone.org/api/stats')
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .then((stats) => {
      show(stats);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ users: stats.users, posts: stats.posts }));
      } catch {
        // 無痕模式等情況存不了，沒關係
      }
    })
    .catch(() => {
      // 讀不到也沒有舊數字：收起區塊
      if (!cached) boxes.forEach((box) => { box.hidden = true; });
    });
})();

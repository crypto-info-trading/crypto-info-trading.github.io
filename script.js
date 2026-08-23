const header = document.querySelector('[data-header]');
const progress = document.querySelector('.progress span');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const youtubeLatest = document.querySelector('[data-youtube-latest]');
if (youtubeLatest) {
  const card = document.querySelector('[data-youtube-card]');
  const thumbnail = document.querySelector('[data-youtube-thumbnail]');
  const watchButton = document.querySelector('[data-youtube-watch]');
  const status = document.querySelector('[data-youtube-status]');
  const title = document.querySelector('[data-youtube-title]');

  const applyLatestVideo = ({ videoId, title: videoTitle }) => {
    if (!videoId) return;
    const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
    if (card) card.href = watchUrl;
    if (watchButton) watchButton.href = watchUrl;
    if (thumbnail) {
      thumbnail.src = `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/maxresdefault.jpg`;
      thumbnail.alt = videoTitle || 'Последний выпуск CRYPTO INFO | TRADING на YouTube';
    }
    if (title && videoTitle) title.textContent = videoTitle;
    if (status) status.textContent = 'Последний выпуск · обновляется автоматически';
  };

  if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    const metadataSources = window.location.hostname.endsWith('.github.io')
      ? ['youtube-latest.json']
      : ['/youtube-feed', 'youtube-latest.json'];

    const loadLatestVideo = async () => {
      for (const source of metadataSources) {
        try {
          const response = await fetch(source, {
            headers: { Accept: 'application/json' },
            cache: 'no-store'
          });
          if (!response.ok) continue;
          const payload = await response.json();
          if (payload.videoId) return payload;
        } catch {
          // Переходим к следующему безопасному источнику данных.
        }
      }
      throw new Error('YouTube metadata is unavailable');
    };

    loadLatestVideo()
      .then(applyLatestVideo)
      .catch(() => {
        if (status) status.textContent = 'Последний выпуск · смотреть на YouTube';
      });
  } else if (status) {
    status.textContent = 'Последний выпуск · смотреть на YouTube';
  }
}

function updateScrollUi() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  header?.classList.toggle('scrolled', scrollTop > 18);
  if (progress) progress.style.width = `${scrollable > 0 ? (scrollTop / scrollable) * 100 : 0}%`;
}

function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Открыть меню');
  navigation?.classList.remove('open');
  document.body.classList.remove('menu-open');
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');
  navigation?.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => { if (window.innerWidth > 980) closeMenu(); });
window.addEventListener('scroll', updateScrollUi, { passive: true });
updateScrollUi();

const revealItems = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach(item => item.classList.add('visible'));
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px' });
  revealItems.forEach(item => observer.observe(item));
}

document.querySelector('[data-year]').textContent = new Date().getFullYear();

/* ==========================================================================
   Личный кабинет ученика — логика страницы уроков (lessons.html)

   КАК ДОБАВИТЬ РЕАЛЬНОЕ ВИДЕО:
   Найдите нужный урок в массиве MODULES ниже и впишите ссылку на видео
   (embed-код с Bunny.net Stream или другого защищённого видеохостинга)
   в поле "embed" — например:
     embed: 'https://iframe.mediadelivery.net/embed/000000/xxxxxxxx-xxxx'
   Пока поле "embed" пустое — на месте видео показывается заглушка.

   КАК ПОМЕНЯТЬ НАЗВАНИЕ/ОПИСАНИЕ УРОКА:
   Меняйте поля "title" и "desc" у нужного урока.

   КАК ДОБАВИТЬ МАТЕРИАЛЫ К УРОКУ (PDF, файлы и т.д.):
   Впишите в поле "materials" список вида:
     materials: [{ label: 'Конспект урока', href: 'https://...' }]
   ========================================================================== */

function buildLessons(moduleNumber, count) {
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    return {
      id: `${moduleNumber}-${n}`,
      title: `Урок ${moduleNumber}.${n}`,
      desc: 'Описание урока появится здесь после наполнения программы.',
      embed: '',
      materials: []
    };
  });
}

const MODULES = [
  { title: 'Модуль 1', subtitle: 'Основы и терминология рынка', lessons: buildLessons(1, 10) },
  { title: 'Модуль 2', subtitle: 'Технический анализ и структура рынка', lessons: buildLessons(2, 12) },
  { title: 'Модуль 3', subtitle: 'Торговые сценарии и вход в сделку', lessons: buildLessons(3, 12) },
  { title: 'Модуль 4', subtitle: 'Управление капиталом и риском', lessons: buildLessons(4, 11) },
  { title: 'Модуль 5', subtitle: 'Психология трейдера и работа на дистанции', lessons: buildLessons(5, 10) }
];

const allLessons = MODULES.flatMap(m => m.lessons);
const totalLessons = allLessons.length;

const STORAGE_KEY = 'citLessonsProgress_v1';

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && Array.isArray(parsed.completed)) return parsed;
  } catch {
    // локальное хранилище недоступно — работаем без сохранения прогресса
  }
  return { completed: [], last: null };
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // тихо игнорируем — прогресс просто не сохранится между визитами
  }
}

let progress = loadProgress();
let currentLessonId = null;

function isCompleted(id) {
  return progress.completed.includes(id);
}

function findLessonMeta(id) {
  for (let mi = 0; mi < MODULES.length; mi++) {
    const li = MODULES[mi].lessons.findIndex(l => l.id === id);
    if (li !== -1) return { moduleIndex: mi, lessonIndex: li, lesson: MODULES[mi].lessons[li] };
  }
  return null;
}

function getAdjacentLesson(id, direction) {
  const idx = allLessons.findIndex(l => l.id === id);
  if (idx === -1) return null;
  return allLessons[idx + direction] || null;
}

const modulesRoot = document.querySelector('[data-modules]');
const videoFrame = document.querySelector('[data-video-frame]');
const lessonIndexEl = document.querySelector('[data-lesson-index]');
const lessonTitleEl = document.querySelector('[data-lesson-title]');
const lessonDescEl = document.querySelector('[data-lesson-desc]');
const watchedBtn = document.querySelector('[data-watched-toggle]');
const materialsBox = document.querySelector('[data-materials]');
const materialsList = document.querySelector('[data-materials-list]');
const prevBtn = document.querySelector('[data-prev-lesson]');
const nextBtn = document.querySelector('[data-next-lesson]');
const progressFill = document.querySelector('[data-progress-fill]');
const progressText = document.querySelector('[data-progress-text]');

function renderModules() {
  modulesRoot.innerHTML = '';
  MODULES.forEach((mod, mi) => {
    const wrap = document.createElement('div');
    wrap.className = 'lp-module';

    const doneInModule = mod.lessons.filter(l => isCompleted(l.id)).length;

    const head = document.createElement('button');
    head.type = 'button';
    head.className = 'lp-module-head';
    head.setAttribute('aria-expanded', 'false');
    head.innerHTML = `
      <span class="lp-module-index">${String(mi + 1).padStart(2, '0')}</span>
      <span class="lp-module-titles"><b>${mod.title}</b><small>${mod.subtitle}</small></span>
      <span class="lp-module-count">${doneInModule}/${mod.lessons.length}</span>
      <span class="lp-module-caret" aria-hidden="true">⌄</span>
    `;

    const body = document.createElement('div');
    body.className = 'lp-lessons';

    mod.lessons.forEach(lesson => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'lp-lesson-item';
      item.dataset.lessonId = lesson.id;
      if (isCompleted(lesson.id)) item.classList.add('done');
      item.innerHTML = `<span class="lp-lesson-check" aria-hidden="true"></span><span>${lesson.title}</span>`;
      item.addEventListener('click', () => selectLesson(lesson.id));
      body.appendChild(item);
    });

    head.addEventListener('click', () => {
      const expanded = head.getAttribute('aria-expanded') === 'true';
      head.setAttribute('aria-expanded', String(!expanded));
      wrap.classList.toggle('open', !expanded);
    });

    wrap.appendChild(head);
    wrap.appendChild(body);
    modulesRoot.appendChild(wrap);
  });
}

function updateOverallProgress() {
  const done = progress.completed.length;
  const pct = totalLessons ? Math.round((done / totalLessons) * 100) : 0;
  if (progressFill) progressFill.style.width = `${pct}%`;
  if (progressText) progressText.textContent = `${done} из ${totalLessons} уроков пройдено`;
}

function selectLesson(id) {
  const meta = findLessonMeta(id);
  if (!meta) return;
  const { lesson, moduleIndex, lessonIndex } = meta;
  currentLessonId = id;

  lessonIndexEl.textContent = `${moduleIndex + 1}.${lessonIndex + 1}`;
  lessonTitleEl.textContent = lesson.title;
  lessonDescEl.textContent = lesson.desc;

  if (lesson.embed) {
    videoFrame.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.src = lesson.embed;
    iframe.loading = 'lazy';
    iframe.allow = 'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture';
    iframe.allowFullscreen = true;
    videoFrame.appendChild(iframe);
  } else {
    videoFrame.innerHTML = `
      <div class="lp-video-placeholder">
        <span class="lp-video-icon" aria-hidden="true">▶</span>
        <p>Видео появится здесь после загрузки</p>
      </div>`;
  }

  if (lesson.materials && lesson.materials.length) {
    materialsList.innerHTML = lesson.materials
      .map(m => `<li><a href="${m.href}" target="_blank" rel="noopener noreferrer">${m.label}</a></li>`)
      .join('');
    materialsBox.hidden = false;
  } else {
    materialsList.innerHTML = '';
    materialsBox.hidden = true;
  }

  watchedBtn.classList.toggle('is-watched', isCompleted(id));
  watchedBtn.textContent = isCompleted(id) ? 'Урок просмотрен ✓' : 'Отметить как просмотренный';

  document.querySelectorAll('.lp-lesson-item').forEach(el => {
    el.classList.toggle('active', el.dataset.lessonId === id);
  });

  const moduleEls = document.querySelectorAll('.lp-module');
  moduleEls.forEach((el, i) => {
    if (i === moduleIndex) {
      el.classList.add('open');
      el.querySelector('.lp-module-head')?.setAttribute('aria-expanded', 'true');
    }
  });

  const prevLesson = getAdjacentLesson(id, -1);
  const nextLesson = getAdjacentLesson(id, 1);
  prevBtn.disabled = !prevLesson;
  nextBtn.disabled = !nextLesson;

  progress.last = id;
  saveProgress();

  closeDrawer();

  document.querySelector(`.lp-lesson-item[data-lesson-id="${id}"]`)
    ?.scrollIntoView({ block: 'nearest' });
}

watchedBtn?.addEventListener('click', () => {
  if (!currentLessonId) return;
  if (isCompleted(currentLessonId)) {
    progress.completed = progress.completed.filter(x => x !== currentLessonId);
  } else {
    progress.completed.push(currentLessonId);
  }
  saveProgress();
  renderModules();
  updateOverallProgress();
  selectLesson(currentLessonId);
});

prevBtn?.addEventListener('click', () => {
  const target = getAdjacentLesson(currentLessonId, -1);
  if (target) selectLesson(target.id);
});

nextBtn?.addEventListener('click', () => {
  const target = getAdjacentLesson(currentLessonId, 1);
  if (target) selectLesson(target.id);
});

function openDrawer() { document.body.classList.add('lp-drawer-open'); }
function closeDrawer() { document.body.classList.remove('lp-drawer-open'); }

document.querySelector('[data-drawer-open]')?.addEventListener('click', openDrawer);
document.querySelectorAll('[data-drawer-close]').forEach(el => el.addEventListener('click', closeDrawer));

const yearEl = document.querySelector('[data-year]');
if (yearEl) yearEl.textContent = new Date().getFullYear();

renderModules();
updateOverallProgress();

const startId = (progress.last && findLessonMeta(progress.last)) ? progress.last : allLessons[0]?.id;
if (startId) selectLesson(startId);

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

function menuLabel(key, fallback) {
  return (window.CIT_I18N && window.CIT_I18N.t(key)) || fallback;
}

function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', menuLabel('nav.menuOpenAria', 'Открыть меню'));
  navigation?.classList.remove('open');
  document.body.classList.remove('menu-open');
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen
    ? menuLabel('nav.menuOpenAria', 'Открыть меню')
    : menuLabel('nav.menuCloseAria', 'Закрыть меню'));
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

const paymentModal = document.querySelector('[data-payment-modal]');

if (paymentModal) {
  const paymentPlans = {
    trader: {
      name: 'TRADER с 0 до PRO 3.0',
      price: '999 USDT',
      oldPrice: '1 500 USDT'
    },
    individual: {
      name: 'Индивидуальный PRO 3.0',
      price: '1 499 USDT',
      oldPrice: '2 000 USDT'
    }
  };

  const paymentNetworks = {
    trc20: {
      code: 'TRC20',
      label: 'TRON',
      address: 'TFxyrMF5ArA4zmWMhLM5ibPCMNEZyV9Qjz'
    },
    bep20: {
      code: 'BEP20',
      label: 'BNB Smart Chain',
      address: '0x420d1fb0d0135d6172c4273b0f3bc01dc1d46d39'
    },
    erc20: {
      code: 'ERC20',
      label: 'Ethereum',
      address: '0x420d1fb0d0135d6172c4273b0f3bc01dc1d46d39'
    },
    ton: {
      code: 'TON',
      label: 'TON Network',
      address: 'UQCmhIwcfZGQb_AwKiAujijb19g8UrdJPw9-5AeUQsJCX-G6'
    },
    sol: {
      code: 'SOL',
      label: 'Solana',
      address: '5nQotK9T6FYYTd5pSTXkNbg6xrnM4R7swQiW9BrWfqCH'
    }
  };

  const planName = paymentModal.querySelector('[data-payment-plan-name]');
  const price = paymentModal.querySelector('[data-payment-price]');
  const oldPrice = paymentModal.querySelector('[data-payment-old-price]');
  const networkLabel = paymentModal.querySelector('[data-payment-network-label]');
  const address = paymentModal.querySelector('[data-payment-address]');
  const qr = paymentModal.querySelector('[data-payment-qr]');
  const warning = paymentModal.querySelector('[data-payment-warning]');
  const copyButton = paymentModal.querySelector('[data-payment-copy]');
  const form = paymentModal.querySelector('[data-payment-form]');
  const fileInput = paymentModal.querySelector('[data-payment-file]');
  const fileName = paymentModal.querySelector('[data-payment-file-name]');
  const error = paymentModal.querySelector('[data-payment-error]');
  const submitButton = form?.querySelector('.payment-submit');
  const submitButtonText = submitButton?.innerHTML;
  const networkButtons = [...paymentModal.querySelectorAll('[data-payment-network]')];
  let selectedNetwork = 'trc20';
  let lastTrigger = null;

  const setError = message => {
    if (error) error.textContent = message;
  };

  const setPaymentNetwork = networkId => {
    const network = paymentNetworks[networkId];
    if (!network) return;
    selectedNetwork = networkId;
    networkButtons.forEach(button => {
      const isActive = button.dataset.paymentNetwork === networkId;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
    if (networkLabel) networkLabel.textContent = `USDT · ${network.code}`;
    if (address) address.textContent = network.address;
    if (qr) {
      qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(network.address)}`;
      qr.alt = `QR-код адреса USDT ${network.code}`;
    }
    if (warning) {
      warning.innerHTML = `<b>Важно:</b> отправляйте только USDT по сети ${network.code} (${network.label}). Перевод через другую сеть может быть безвозвратно утрачен.`;
    }
    const networkField = form?.querySelector('[data-payment-form-network]');
    const addressField = form?.querySelector('[data-payment-form-address]');
    if (networkField) networkField.value = `USDT ${network.code} (${network.label})`;
    if (addressField) addressField.value = network.address;
    if (copyButton) copyButton.textContent = 'Скопировать адрес';
  };

  const openPayment = planId => {
    const plan = paymentPlans[planId];
    if (!plan) return;
    if (planName) planName.textContent = plan.name;
    if (price) price.textContent = plan.price;
    if (oldPrice) oldPrice.textContent = plan.oldPrice;
    const planField = form?.querySelector('[data-payment-form-plan]');
    const priceField = form?.querySelector('[data-payment-form-price]');
    if (planField) planField.value = plan.name;
    if (priceField) priceField.value = plan.price;
    setPaymentNetwork('trc20');
    setError('');
    paymentModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('payment-open');
    paymentModal.querySelector('[data-payment-close]')?.focus();
  };

  const closePayment = () => {
    paymentModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('payment-open');
    if (submitButton) {
      submitButton.classList.remove('is-loading');
      submitButton.disabled = false;
      if (submitButtonText) submitButton.innerHTML = submitButtonText;
    }
    lastTrigger?.focus();
  };

  document.querySelectorAll('[data-payment-plan]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      lastTrigger = trigger;
      openPayment(trigger.dataset.paymentPlan);
    });
  });

  paymentModal.querySelectorAll('[data-payment-close]').forEach(button => {
    button.addEventListener('click', closePayment);
  });

  networkButtons.forEach(button => {
    button.addEventListener('click', () => setPaymentNetwork(button.dataset.paymentNetwork));
  });

  copyButton?.addEventListener('click', async () => {
    const walletAddress = paymentNetworks[selectedNetwork].address;
    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(walletAddress);
      } else {
        const helper = document.createElement('textarea');
        helper.value = walletAddress;
        helper.setAttribute('readonly', '');
        helper.style.position = 'fixed';
        helper.style.opacity = '0';
        document.body.appendChild(helper);
        helper.select();
        document.execCommand('copy');
        helper.remove();
      }
      copyButton.textContent = 'Адрес скопирован ✓';
      window.setTimeout(() => { copyButton.textContent = 'Скопировать адрес'; }, 2200);
    } catch {
      copyButton.textContent = 'Скопируйте адрес вручную';
    }
  });

  fileInput?.addEventListener('change', () => {
    const selectedFile = fileInput.files?.[0];
    setError('');
    if (!selectedFile) {
      if (fileName) fileName.textContent = 'Выбрать PNG, JPG или WEBP';
      return;
    }
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(selectedFile.type)) {
      fileInput.value = '';
      if (fileName) fileName.textContent = 'Выбрать PNG, JPG или WEBP';
      setError('Загрузите скриншот в формате PNG, JPG или WEBP.');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      fileInput.value = '';
      if (fileName) fileName.textContent = 'Выбрать PNG, JPG или WEBP';
      setError('Размер скриншота не должен превышать 10 МБ.');
      return;
    }
    if (fileName) fileName.textContent = selectedFile.name;
  });

  form?.addEventListener('submit', event => {
    const selectedFile = fileInput?.files?.[0];
    if (!selectedFile) {
      event.preventDefault();
      setError('Добавьте скриншот перевода — без него заявка не отправится.');
      fileInput?.focus();
      return;
    }
    setError('');
    if (submitButton) {
      submitButton.classList.add('is-loading');
      submitButton.disabled = true;
      submitButton.textContent = 'Отправляем подтверждение…';
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && paymentModal.getAttribute('aria-hidden') === 'false') closePayment();
  });

  setPaymentNetwork('trc20');
}

document.querySelector('[data-year]').textContent = new Date().getFullYear();

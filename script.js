document.addEventListener("DOMContentLoaded", function() {
  const tgButtons = document.querySelectorAll("button.telegram_button");
  const tgLink = "https://t.me/brat_anton";

  tgButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      window.open(tgLink, "_blank");
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // инициализируем по каждому блоку .cases
  document.querySelectorAll(".cases").forEach(cases => {
    const children = Array.from(cases.children);

    // находим индекс шапки (где <h1>)
    const headerIndex = children.findIndex(div => div.querySelector("h1"));
    // находим индекс блока с кнопкой
    const toggleIndex = children.findIndex(div => div.querySelector(".arrow_button"));

    // вычленяем всё, что нужно скрыть (между 3-м кейсом и кнопкой)
    const hideIndices = children
      .map((_, i) => i)
      .filter(i => i > headerIndex + 2 && i < toggleIndex);

    // сразу прячем
    hideIndices.forEach(i => children[i].classList.add("hidden"));

    const toggleDiv = children[toggleIndex];
    const btn       = toggleDiv.querySelector(".arrow_button");
    const label     = btn.querySelector("p");

    btn.addEventListener("click", () => {
      const isOpen = cases.classList.toggle("show-all");

      // переключаем скрытие нужных кейсов
      hideIndices.forEach(i => children[i].classList.toggle("hidden", !isOpen));

      // меняем текст и состояние стрелки
      label.textContent = isOpen
        ? "Свернуть проекты"
        : "Посмотреть ещё проекты";
      btn.classList.toggle("expanded", isOpen);
    });
  });
});

  // JS: показываем кнопку после прокрутки первой секции и скроллим наверх по клику
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('backToTop');
  const firstSection = document.querySelector('section');

  if (!btn || !firstSection) return;

  const threshold = firstSection.offsetHeight;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > threshold) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});


(function () {
  const BREAKPOINT = 960; // тот же порог, что и в медиазапросах

  // Собираем все img с data-mobile-src
  const responsiveImgs = Array.from(document.querySelectorAll('img[data-mobile-src]'))
    .map(img => ({
      node: img,
      desktopSrc: img.getAttribute('src'),
      mobileSrc: img.getAttribute('data-mobile-src')
    }));

  if (!responsiveImgs.length) return;

  function applyResponsiveImages() {
    const isMobile = window.innerWidth <= BREAKPOINT;
    responsiveImgs.forEach(item => {
      const node = item.node;
      const target = isMobile ? item.mobileSrc : item.desktopSrc;
      if (!target) return;
      if (node.getAttribute('src') !== target) {
        node.setAttribute('src', target);
      }
    });
  }

  // при загрузке страницы
  window.addEventListener('DOMContentLoaded', applyResponsiveImages);
  // при ресайзе — с дебаунсом
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applyResponsiveImages, 120);
  });

  // при динамическом добавлении контента (опционально) — MutationObserver
  const observer = new MutationObserver(mutations => {
    // если добавились новые элементы с data-mobile-src — обновим массив и применим
    let added = false;
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          const imgs = node.querySelectorAll && node.querySelectorAll('img[data-mobile-src]');
          if (imgs && imgs.length) {
            imgs.forEach(img => {
              const exists = responsiveImgs.some(i => i.node === img);
              if (!exists) {
                responsiveImgs.push({
                  node: img,
                  desktopSrc: img.getAttribute('src'),
                  mobileSrc: img.getAttribute('data-mobile-src')
                });
                added = true;
              }
            });
          }
          if (node.matches && node.matches('img[data-mobile-src]')) {
            const img = node;
            const exists = responsiveImgs.some(i => i.node === img);
            if (!exists) {
              responsiveImgs.push({
                node: img,
                desktopSrc: img.getAttribute('src'),
                mobileSrc: img.getAttribute('data-mobile-src')
              });
              added = true;
            }
          }
        }
      });
    });
    if (added) applyResponsiveImages();
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();


document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menu__toggle');
  const menuBox = document.querySelector('.menu__box');
  const menuLabel = document.querySelector('.menu__btn[for="menu__toggle"]');

  if (!toggle || !menuBox) return;

  // если у вас фиксированный header — укажи селектор или оставь '' 
  const HEADER_SELECTOR = ''; 
  const headerEl = HEADER_SELECTOR ? document.querySelector(HEADER_SELECTOR) : null;
  function headerOffset() {
    if (!headerEl) return 0;
    const st = getComputedStyle(headerEl);
    if (/fixed|sticky/i.test(st.position)) return Math.ceil(headerEl.getBoundingClientRect().height);
    return 0;
  }

  function closeMenuNoJump() {
    // снимем чек и уберём фокус с активного элемента внутри меню
    toggle.checked = false;
    const a = document.activeElement;
    if (a && menuBox.contains(a)) a.blur();
    if (menuLabel) menuLabel.blur();
  }

  function smoothTo(target) {
    if (!target) return;
    const offset = headerOffset();
    const top = window.scrollY + target.getBoundingClientRect().top - offset;
    window.scrollTo({ top: Math.max(0, Math.round(top)), behavior: 'smooth' });
  }

  // Глобальный делегат: клики по ссылкам в меню
  menuBox.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';

    // Если это внешняя ссылка (включая tel/mailto) — позволяем переход, но закрываем меню сразу
    if (/^(https?:|mailto:|tel:)/i.test(href)) {
      closeMenuNoJump();
      return;
    }

    // Пустой/декоративный хеш (#) — предотвращаем дефолт (он может прыгнуть наверх)
    if (href === '#' || href.trim() === '') {
      e.preventDefault();
      closeMenuNoJump();
      return;
    }

    // Якорь внутри страницы
    if (href.startsWith('#')) {
      e.preventDefault();
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) { closeMenuNoJump(); return; }

      // Закрываем меню и даём небольшой таймаут для CSS‑анимации (если есть)
      closeMenuNoJump();
      // Delay: даём время закрытию/перерисовке, чтобы не было конфликта с focus/hash
      const DELAY = 60;
      setTimeout(() => smoothTo(target), DELAY);
      return;
    }

    // Любые другие ссылки — закрываем меню и позволяем перейти
    closeMenuNoJump();
  });

  // Надёжная обработка клика по label (крестику) — предотвращаем нативные артефакты
  if (menuLabel) {
    menuLabel.addEventListener('click', function (e) {
      e.preventDefault();               // отменяем нативный toggle
      const newState = !toggle.checked; // инвертируем состояние вручную
      toggle.checked = newState;
      // Убираем фокус чтобы не дергать скролл
      menuLabel.blur();
      if (!newState) {
        // при закрытии уберём фокус из меню
        const a = document.activeElement;
        if (a && menuBox.contains(a)) a.blur();
      }
    });
    // предотвращаем дефолтный mousedown поведение (фокус)
    menuLabel.addEventListener('mousedown', e => e.preventDefault());
  }

  // ESC закрывает меню
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.checked) closeMenuNoJump();
  });

  // Если hash изменился извне — закрываем меню чтобы не перекрывать секцию
  window.addEventListener('hashchange', () => {
    if (toggle.checked) closeMenuNoJump();
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const MOBILE_MAX = 768;
  if (window.innerWidth > MOBILE_MAX) return; // инициализируем только на мобилке

  const container = document.getElementById('trustGraphs');
  const dotsWrap = document.getElementById('trustDots');
  if (!container) return;
  const slides = Array.from(container.querySelectorAll('.trust_slide'));
  const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.trust_dot')) : [];

  // если слайдов мало — не инициализируем
  if (slides.length <= 1) {
    // гарантируем что все видны
    slides.forEach(s => s.classList.add('trust_slide--active'));
    return;
  }

  // создаём prev/next кнопки (вставляем рядом с контейнером)
  const prev = document.createElement('button');
  prev.className = 'trust_control trust_prev';
  prev.setAttribute('aria-label', 'Предыдущий слайд');
  prev.type = 'button';

  const next = document.createElement('button');
  next.className = 'trust_control trust_next';
  next.setAttribute('aria-label', 'Следующий слайд');
  next.type = 'button';

  // вставляем кнопки в DOM (вставка в родителя wrapper, чтобы позиционирование CSS сработало)
  const wrap = container.parentElement;
  if (wrap) {
    wrap.style.position = wrap.style.position || 'relative';
    wrap.appendChild(prev);
    wrap.appendChild(next);
  }

  let current = 0;
  const total = slides.length;

  function update() {
    slides.forEach((s, i) => s.classList.toggle('trust_slide--active', i === current));
    if (dots.length) {
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === current);
        if (i === current) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
    }
    // доступность стрелок
    prev.disabled = current === 0;
    next.disabled = current === total - 1;
  }

  // клики по точкам
  if (dots.length) {
    dots.forEach((d, i) => {
      d.addEventListener('click', () => {
        current = i;
        update();
      });
    });
  }

  prev.addEventListener('click', () => {
    if (current > 0) current--;
    update();
  });
  next.addEventListener('click', () => {
    if (current < total - 1) current++;
    update();
  });

  // keyboard navigation
  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { if (current > 0) { current--; update(); } }
    if (e.key === 'ArrowRight') { if (current < total - 1) { current++; update(); } }
  });


  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let isTouching = false;
  const SWIPE_THRESHOLD = 50; // px

  container.addEventListener('touchstart', (e) => {
    if (!e.touches || e.touches.length === 0) return;
    isTouching = true;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchEndX = touchStartX;
  }, {passive: true});

  container.addEventListener('touchmove', (e) => {
    if (!isTouching || !e.touches || e.touches.length === 0) return;
    touchEndX = e.touches[0].clientX;
    // не вызываем preventDefault: позволяем вертикальной прокрутке работать
  }, {passive: true});

  container.addEventListener('touchend', (e) => {
    if (!isTouching) return;
    isTouching = false;
    const dx = touchEndX - touchStartX;
    const dy = Math.abs((e.changedTouches && e.changedTouches[0]) ? (e.changedTouches[0].clientY - touchStartY) : 0);

    // Игнорируем жесты с доминирующей вертикальной составляющей (чтобы не мешать скроллу)
    if (dy > Math.abs(dx)) return;

    if (dx > SWIPE_THRESHOLD) {
      // свайп вправо — предыдущий
      if (current > 0) {
        current--;
        update();
      }
    } else if (dx < -SWIPE_THRESHOLD) {
      // свайп влево — следующий
      if (current < total - 1) {
        current++;
        update();
      }
    }
  }, {passive: true});

  // Инициализация: показываем первый слайд и синхронизируем точки
  update();

  // Обновление при ресайзе: если пользователь повернул устройство или расширил экран, удаляем инициализацию
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > MOBILE_MAX) {
        // удалить вставленные элементы и вернуть исходное поведение
        prev.remove(); next.remove();
        slides.forEach(s => s.classList.remove('trust_slide--active'));
        dots.forEach(d => d.classList.remove('active'), d.removeAttribute('aria-current'));
      }
    }, 160);
  });
});

//отзывы 
(function(){
  const track = document.getElementById('reviewsTrack');
  if (!track) return;

  const leftBtn = document.querySelector('.arrow_buttons.left button');
  const rightBtn = document.querySelector('.arrow_buttons.right button');

  let perView = getPerView(); // 3 или 1
  let isMoving = false;
  let index = 0;

  function getPerView(){
    return window.matchMedia('(max-width: 899px)').matches ? 1 : 3;
  }

  function clearClones(){
    Array.from(track.children).forEach(n => { if (n.classList && n.classList.contains('__clone')) n.remove(); });
  }

  function buildClones(){
    clearClones();
    const items = Array.from(track.querySelectorAll('.Reviews_block'));
    perView = getPerView();
    if (items.length === 0) return;
    const first = items.slice(0, perView).map(n => n.cloneNode(true));
    const last = items.slice(-perView).map(n => n.cloneNode(true));
    last.reverse().forEach(n => { n.classList.add('__clone'); track.insertBefore(n, track.firstChild); });
    first.forEach(n => { n.classList.add('__clone'); track.appendChild(n); });
  }

  function stepSize(){
    const item = track.querySelector('.Reviews_block');
    if (!item) return 0;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.gap) || 20;
    return item.getBoundingClientRect().width + gap;
  }

  function applyTransform(noTransition){
    const step = stepSize();
    if (noTransition) track.style.transition = 'none';
    else track.style.transition = 'transform 350ms ease';
    const offset = -index * step;
    track.style.transform = `translateX(${offset}px)`;
    if (noTransition){
      requestAnimationFrame(()=> track.style.transition = '');
    }
  }

  function setInitial(){
    perView = getPerView();
    buildClones();
    index = perView;
    // позиция должна центрироваться так, чтобы видна была область из .review_button::before
    applyTransform(true);
  }

  function move(dir){
    if (isMoving) return;
    isMoving = true;
    index += dir;
    applyTransform(false);
    track.addEventListener('transitionend', onEnd, { once: true });
  }

  function onEnd(){
    const total = track.children.length;
    if (index < perView){
      index = index + (total - perView*2);
      applyTransform(true);
    } else if (index >= total - perView){
      index = index - (total - perView*2);
      applyTransform(true);
    }
    isMoving = false;
  }

  if (rightBtn) rightBtn.addEventListener('click', ()=> move(1));
  if (leftBtn) leftBtn.addEventListener('click', ()=> move(-1));

  let rt;
  window.addEventListener('resize', ()=> {
    clearTimeout(rt);
    rt = setTimeout(()=> {
      const newPer = getPerView();
      if (newPer !== perView) setInitial();
      else applyTransform(true);
    }, 120);
  });

  requestAnimationFrame(setInitial);
})();
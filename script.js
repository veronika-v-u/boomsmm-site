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



(function() {
    const slider = document.querySelector('.Reviews');
    let isDown = false;
    let startX;
    let scrollLeft;

    // Для мыши
    slider.addEventListener('mousedown', e => {
      isDown = true;
      slider.classList.add('active');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.classList.remove('active');
    });
    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.classList.remove('active');
    });
    slider.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1;  // скорость прокрутки = 1
      slider.scrollLeft = scrollLeft - walk;
    });

    // Для тачскрина
    slider.addEventListener('touchstart', e => {
      startX = e.touches[0].pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('touchmove', e => {
      const x = e.touches[0].pageX - slider.offsetLeft;
      const walk = (x - startX) * 1;  // скорость прокрутки = 1
      slider.scrollLeft = scrollLeft - walk;
    });
  })();

  function initSlider(selector) {
    const slider = document.querySelector(selector);
    if (!slider) return;
    let isDown = false, startX, scrollLeft;

    // Общие обработчики
    function onDown(e) {
      isDown = true;
      startX = (e.touches ? e.touches[0].pageX : e.pageX) - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    }
    function onUp() {
      isDown = false;
    }
    function onMove(e) {
      if (!isDown) return;
      e.preventDefault();
      const x = (e.touches ? e.touches[0].pageX : e.pageX) - slider.offsetLeft;
      const walk = (x - startX) * 1;
      slider.scrollLeft = scrollLeft - walk;
    }

    // мышь
    slider.addEventListener('mousedown', onDown);
    slider.addEventListener('mouseup', onUp);
    slider.addEventListener('mouseleave', onUp);
    slider.addEventListener('mousemove', onMove);

    // сенсор
    slider.addEventListener('touchstart', onDown);
    slider.addEventListener('touchend', onUp);
    slider.addEventListener('touchmove', onMove);
  }

  // инициализируем оба слайдера
  initSlider('.Reviews');
  initSlider('.Reels');

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


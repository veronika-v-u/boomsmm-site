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
  const MOBILE_MAX = 768;
  if (window.innerWidth > MOBILE_MAX) return; // только на мобилке

  const container = document.getElementById('trustGraphs');
  const slides = container ? Array.from(container.querySelectorAll('.trust_slide')) : [];
  const dots = Array.from(document.querySelectorAll('.trust_dot'));
  if (!container || slides.length === 0) return;

  // вспомогательное состояние
  let slidePositions = []; // абсолютные left позиции слайдов относительно контейнера
  let raf = null;

  // вычислить массив позициий с учётом реального layout
  function updateSlidePositions() {
    slidePositions = slides.map(s => s.offsetLeft);
  }

  // прокрутка к слайду по индексу, использует реальные позиции
  function scrollToIndex(idx, smooth = true) {
    idx = Math.max(0, Math.min(idx, slides.length - 1));
    const left = slidePositions[idx] ?? (idx * container.clientWidth);
    container.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' });
    setActiveDot(idx);
  }

  // определить ближайший слайд по текущему scrollLeft
  function getCurrentIndexByScroll() {
    const left = container.scrollLeft;
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < slidePositions.length; i++) {
      const dist = Math.abs(slidePositions[i] - left);
      if (dist < bestDist) { bestDist = dist; bestIdx = i; }
    }
    return bestIdx;
  }

  // обновляем активную точку
  function setActiveDot(idx) {
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  // scroll handler с RAF
  container.addEventListener('scroll', () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const idx = getCurrentIndexByScroll();
      setActiveDot(idx);
    });
  }, { passive: true });

  // клики по точкам
  dots.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.index);
      scrollToIndex(idx);
    });
  });

  // пересчитать позиции после загрузки картинок (они влияют на layout)
  function init() {
    // жёсткий сброс паддингов контейнера, если есть
    container.style.paddingLeft = '0';
    container.style.paddingRight = '0';
    // ждём рендер/загрузку изображений, затем считаем позиции
    requestAnimationFrame(() => {
      updateSlidePositions();
      // прокрутка к первому слайда (без анимации)
      scrollToIndex(0, false);
      // выставим активную точку
      setActiveDot(0);
    });
  }

  // Пересчёт при загрузке изображений внутри слайдов
  const imgs = container.querySelectorAll('img');
  let imgsLoaded = 0;
  if (imgs.length === 0) {
    init();
  } else {
    imgs.forEach(img => {
      if (img.complete) {
        imgsLoaded++;
        if (imgsLoaded === imgs.length) init();
      } else {
        img.addEventListener('load', () => {
          imgsLoaded++;
          if (imgsLoaded === imgs.length) init();
        }, { once: true });
        img.addEventListener('error', () => {
          imgsLoaded++;
          if (imgsLoaded === imgs.length) init();
        }, { once: true });
      }
    });
  }

  // пересчитать позиции при resize / ориентации
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > MOBILE_MAX) return;
      updateSlidePositions();
      // корректируем прокрутку чтобы остаться на том же слайде
      const cur = getCurrentIndexByScroll();
      scrollToIndex(cur, false);
    }, 120);
  });

  // если DOM меняется (лазифайторы, картинки подгружаются динамически) — пересчёт
  const mo = new MutationObserver(() => {
    updateSlidePositions();
  });
  mo.observe(container, { childList: true, subtree: true });
});


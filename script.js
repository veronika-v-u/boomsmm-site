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

document.addEventListener("DOMContentLoaded", function() {
  const tgButtons = document.querySelectorAll("button.telegram_button");
  const tgLink    = "https://t.me/brat_anton";

  tgButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      window.open(tgLink, "_blank");
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const cases = document.querySelector(".cases");
  if (!cases) return;

  const children = Array.from(cases.children);
  // индекс шапки (где <h1>)
  const headerIndex = children.findIndex(div => div.querySelector("h1"));
  // индекс блока с кнопкой
  const toggleIndex = children.findIndex(div => div.querySelector(".arrow_button"));

  // формируем список индексов кейсов, которые нужно скрывать: 
  // всё между 3-м кейсом и кнопкой (не включая их)
  const hideIndices = children
    .map((_, i) => i)
    .filter(i => i > headerIndex + 2 && i < toggleIndex);

  // прячем их сразу
  hideIndices.forEach(i => children[i].classList.add("hidden"));

  const toggleDiv = children[toggleIndex];
  const btn       = toggleDiv.querySelector(".arrow_button");
  const label     = btn.querySelector("p");

  btn.addEventListener("click", () => {
    // переключаем состояние
    const isOpen = cases.classList.toggle("show-all");
    // скрываем/показываем необходимые блоки
    hideIndices.forEach(i => children[i].classList.toggle("hidden", !isOpen));
    // меняем текст
    label.textContent = isOpen
      ? "Свернуть проекты"
      : "Посмотреть ещё проекты";
    // добавляем/убираем класс для поворота стрелки
    btn.classList.toggle("expanded", isOpen);
  });
});
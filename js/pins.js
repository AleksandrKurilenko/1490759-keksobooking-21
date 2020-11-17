"use strict";

(() => {

  const mapFilterContainer = document.querySelector(`.map__filters-container`);
  const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
  const mapPins = document.querySelector(`.map__pins`);
  const map = document.querySelector(`.map`);

  const setPin = (pin) => {
    const pinElement = pinTemplate.cloneNode(true);
    const pinWidth = pinElement.style.width;
    const pinHeight = pinElement.style.height;
    pinElement.style.left = `${pin.location.x + pinWidth / 2}px`;
    pinElement.style.top = `${pin.location.y + pinHeight}px`;
    const img = pinElement.querySelector(`img`);
    img.src = pin.author.avatar;
    img.alt = pin.author.title;

    pinElement.addEventListener(`click`, () => {
      window.main.onButtonCloseClick();
      renderCardOnMap(pin);
      window.main.activePin = pinElement;
      window.main.activePin.classList.add(`map__pin--active`);
    });

    return pinElement;
  };

  const renderCardOnMap = (adsElement) => {
    map.insertBefore(window.card.set(adsElement), mapFilterContainer);
  };

  const renderOnMap = (pins) => {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < pins.length; i++) {
      fragment.appendChild(setPin(pins[i]));
    }
    mapPins.appendChild(fragment);
  };

  window.pins = {
    renderOnMap
  };
})();

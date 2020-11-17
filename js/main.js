'use strict';

(() => {

  const ESC_KEYCODE = 27;
  const HEIGHT_INDENT = 22;
  const PINS_LIMIT = 5;
  const fields = document.querySelectorAll(`.ad-form fieldset`);
  const mapFilters = document.querySelectorAll(`.map__filters select, .map__filters fieldset`);
  const addressInput = document.querySelector(`#address`);
  const errorTemplate = document.querySelector(`#error`).content.querySelector(`.error`);
  const mapPin = document.querySelector(`.map__pin--main`);
  const map = document.querySelector(`.map`);
  let currentCard = null;
  let activePin = null;
  let adsList = [];

  const escPush = {
    isEscEvent(evt, action) { // ф-я проверки нажатия кнопки esc и действия после нажатия
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    }
  };

  const onButtonCloseClick = function () { // ф-я закрытия карточки
    if (!window.main.currentCard) {
      return;
    }
    if (window.main.activePin) {
      window.main.activePin.classList.remove(`map__pin--active`);
      window.main.activePin = null;
    }
    window.main.currentCard.remove();
    window.main.currentCard = null;
    document.removeEventListener(`keydown`, onCardEscPress);
  };

  const onCardEscPress = function (evt) { // ф-я закрытия карточки по нажатию esc
    escPush.isEscEvent(evt, onButtonCloseClick);
    document.removeEventListener(`keydown`, onCardEscPress);
  };

  const getPinLocation = () => {
    const location = {
      x: mapPin.offsetLeft,
      y: mapPin.offsetTop,
    };
    const size = {
      width: mapPin.offsetWidth,
      height: mapPin.offsetHeight
    };
    if (map.classList.contains(`map--faded`)) {
      return {
        x: Math.round(location.x + size.width / 2),
        y: Math.round(location.y + size.height / 2)
      };
    } else {
      return {
        x: Math.round(location.x + size.width / 2),
        y: Math.round(location.y + size.height + HEIGHT_INDENT)
      };
    }
  };

  const addDisabled = () => {

    fields.forEach((item) => {
      item.setAttribute(`disabled`, true);
    });

    mapFilters.forEach((item) => {
      item.setAttribute(`disabled`, true);
    });
  };

  const onLoadError = (errorMessage) => {
    const errorElement = errorTemplate.cloneNode(true);
    const errorText = errorElement.querySelector(`.error__message`);
    errorText.textContent = window.load.setErrorsMessage(errorMessage);
    document.body.appendChild(errorElement);
    errorElement.addEventListener(`click`, () => {
      errorElement.remove();
      window.load.load(onPinsReceived, onLoadError);
    });
  };

  const onPinsReceived = (response) => {
    adsList = response;
  };

  window.load.load(onPinsReceived, onLoadError);

  const myData = () => adsList;

  const onMapPinClick = () => {
    map.classList.remove(`map--faded`);
    window.form.adForm.classList.remove(`ad-form--disabled`);
    window.form.setCapacityValue();
    window.form.setCapacityDisabled();
    window.pins.renderOnMap(adsList.slice(0, PINS_LIMIT));
    fields.forEach((item) => {
      item.removeAttribute(`disabled`);
    });

    mapFilters.forEach((item) => {
      item.removeAttribute(`disabled`);
    });
    mapPin.removeEventListener(`mousedown`, onMapPinClick);
  };

  mapPin.addEventListener(`mousedown`, onMapPinClick);

  const init = () => {
    addDisabled();
    const mainPinLocation = getPinLocation();
    window.form.setInputValue(addressInput, `${mainPinLocation.x}, ${mainPinLocation.y}`);
  };

  init();

  window.main = {
    mapPin,
    onMapPinClick,
    init,
    addDisabled,
    addressInput,
    getPinLocation,
    myData,
    currentCard,
    onButtonCloseClick,
    onCardEscPress,
    activePin
  };

})();

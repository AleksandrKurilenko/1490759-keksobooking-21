'use strict';

(() => {

  const ESC_KEYCODE = 27;
  const HEIGHT_INDENT = 22;
  const typesOfHousing = {
    palace: `Дворец`,
    flat: `Квартира`,
    house: `Дом`,
    bungalo: `Бунгало`,
  };

  const featuresClasses = {
    wifi: `popup__feature--wifi`,
    dishwasher: `popup__feature--dishwasher`,
    parking: `popup__feature--parking`,
    washer: `popup__feature--washer`,
    elevator: `popup__feature--elevator`,
    conditioner: `popup__feature--conditioner`,
  };
  let currentCard = null;
  let activePin = null;
  let adsList = [];
  const fields = document.querySelectorAll(`.ad-form fieldset`);
  const mapFilters = document.querySelectorAll(`.map__filters select, .map__filters fieldset`);
  const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
  const mapFilterContainer = document.querySelector(`.map__filters-container`);
  const addressInput = document.querySelector(`#address`);
  const errorTemplate = document.querySelector(`#error`).content.querySelector(`.error`);
  const mapPin = document.querySelector(`.map__pin--main`);
  const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
  const map = document.querySelector(`.map`);
  const mapPins = document.querySelector(`.map__pins`);


  const escPush = {
    isEscEvent(evt, action) { // ф-я проверки нажатия кнопки esc и действия после нажатия
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    }
  };

  const onButtonCloseClick = function () { // ф-я закрытия карточки
    if (!currentCard) {
      return;
    }
    if (activePin) {
      activePin.classList.remove(`map__pin--active`);
      activePin = null;
    }
    currentCard.remove();
    currentCard = null;
    document.removeEventListener(`keydown`, onCardEscPress);
  };

  const onCardEscPress = function (evt) { // ф-я закрытия карточки по нажатию esc
    escPush.isEscEvent(evt, onButtonCloseClick);
    document.removeEventListener(`keydown`, onCardEscPress);
  };

  const declension = (forms, number) => {
    const cases = [2, 0, 1, 1, 1, 2];
    return forms[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
  };

  const renderPhotos = (photos, container) => {
    const fragment = document.createDocumentFragment();
    const photoTemplate = container.querySelector(`.popup__photo`);
    let newPhoto;
    container.innerHTML = ``;

    photos.forEach((item) => {
      newPhoto = photoTemplate.cloneNode(false);
      newPhoto.src = item;
      fragment.appendChild(newPhoto);
    });

    container.appendChild(fragment);
  };

  const renderFeatures = (features, container) => {
    container.innerHTML = ``;

    features.forEach((item) => {
      const li = document.createElement(`li`);
      li.classList.add(`popup__feature`, featuresClasses[item]);
      container.appendChild(li);
    });
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
      onButtonCloseClick();
      renderCardOnMap(pin);
      activePin = pinElement;
      activePin.classList.add(`map__pin--active`);
    });

    return pinElement;
  };

  const setCard = (adsElement) => {
    const cardElement = cardTemplate.cloneNode(true);
    const {title, address, price, type, rooms, guests, checkin, checkout, description, features, photos} = adsElement.offer;
    const roomsForm = declension([`комната`, `комнаты`, `комнат`], rooms);
    const guestsForm = declension([`гостя`, `гостей`, `гостей`], guests);
    cardElement.querySelector(`.popup__title`).textContent = title;
    cardElement.querySelector(`.popup__text--address`).textContent = address;
    cardElement.querySelector(`.popup__text--price`).firstChild.textContent = `${price}\u20BD`;
    cardElement.querySelector(`.popup__type`).textContent = typesOfHousing[type];
    cardElement.querySelector(`.popup__text--capacity`).textContent = `${rooms} ${roomsForm} для ${guests} ${guestsForm}`;
    cardElement.querySelector(`.popup__text--time`).textContent = `Заезд после ${checkin} выезд до ${checkout}`;
    cardElement.querySelector(`.popup__description`).textContent = description;
    renderFeatures(features, cardElement.querySelector(`.popup__features`));
    renderPhotos(photos, cardElement.querySelector(`.popup__photos`));
    cardElement.querySelector(`.popup__avatar`).src = adsElement.author.avatar;
    currentCard = cardElement;
    cardElement.querySelector(`.popup__close`).addEventListener(`click`, onButtonCloseClick);
    document.addEventListener(`keydown`, onCardEscPress);
    return cardElement;
  };

  const renderPinsOnMap = (pins) => {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < pins.length; i++) {
      fragment.appendChild(setPin(pins[i]));
    }
    mapPins.appendChild(fragment);
  };

  const renderCardOnMap = (adsElement) => {
    map.insertBefore(setCard(adsElement), mapFilterContainer);
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

  const onMapPinClick = function () {
    map.classList.remove(`map--faded`);
    window.form.adForm.classList.remove(`ad-form--disabled`);
    window.form.setCapacityValue();
    window.form.setCapacityDisabled();
    renderPinsOnMap(adsList);
    const mainPinLocation = getPinLocation();
    window.form.setInputValue(addressInput, `${mainPinLocation.x}, ${mainPinLocation.y}`);
    fields.forEach((item) => {
      item.removeAttribute(`disabled`);
    });

    mapFilters.forEach((item) => {
      item.removeAttribute(`disabled`);
    });
    mapPin.removeEventListener(`click`, onMapPinClick);
  };

  mapPin.addEventListener(`click`, onMapPinClick);

  const init = () => {
    addDisabled();
  };

  init();

  window.main = {
    mapPin,
    onMapPinClick
  };

})();

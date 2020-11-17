"use strict";

(() => {

  const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
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

  const set = (adsElement) => {
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
    window.main.currentCard = cardElement;
    cardElement.querySelector(`.popup__close`).addEventListener(`click`, window.main.onButtonCloseClick);
    document.addEventListener(`keydown`, window.main.onCardEscPress);
    return cardElement;
  };

  window.card = {
    set
  };

})();

'use strict';

const PINS_AMOUNT = 8;

const TYPES = [`palace`, `flat`, `house`, `bungalo`];

const CHECK_IN = [`12:00`, `13:00`, `14:00`];

const FEATURES = [`wifi`, `dishwasher`, `parking`, `parking`, `elevator`, `conditioner`];

const PHOTOS = [
  `http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel3.jpg`
];

const map = document.querySelector(`.map`);

const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);

const mapPins = map.querySelector(`.map__pins`);

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


const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);

const mapFilterContainer = map.querySelector(`.map__filters-container`);

const getRandomNumbers = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const getRandomArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const setLeadingZero = (index) => {
  return index <= PINS_AMOUNT ? `0${index}` : index;
};

const declension = (forms, number) => {
  const cases = [2, 0, 1, 1, 1, 2];
  return forms[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
};


const createTemplate = (i) => {
  const type = getRandomArray(TYPES);
  const checkin = getRandomArray(CHECK_IN);
  const checkout = getRandomArray(CHECK_IN);
  const features = getRandomArray(FEATURES);
  const photos = getRandomArray(PHOTOS);
  const location = {
    x: getRandomNumbers(40, 1160),
    y: getRandomNumbers(130, 630)
  };
  const index = setLeadingZero(i + 1);

  return {
    author: {
      avatar: `img/avatars/user` + index + `.png`
    },
    offer: {
      title: `Заголовок объявления`,
      address: location.x + `, ` + location.y,
      price: getRandomNumbers(0, 1000001),
      type,
      rooms: getRandomNumbers(1, 99),
      guests: getRandomNumbers(1, 30),
      checkin,
      checkout,
      features,
      description: `Описание`,
      photos
    },
    location
  };
};

const fillAds = (quantity) => {
  const adsList = [];

  for (let i = 0; i < quantity; i++) {
    adsList.push(createTemplate(i));
  }

  return adsList;
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
//  FEATURES
const renderFeatures = (features, container) => {
  container.innerHTML = ``;

  features.forEach((item) => {
    const li = document.createElement(`li`);
    li.classList.add(`popup__feature`, featuresClasses[item]);
    container.appendChild(li);
  });
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

  return pinElement;
};


const setCard = (adsElement) => {
  // копируем коллекцию
  const cardElement = cardTemplate.cloneNode(true);

  const {title, address, price, type, rooms, guests, checkin, checkout, description, features, photos} = adsElement.offer;

  const roomsForm = declension([`комната`, `комнаты`, `комнат`], rooms);

  const guestsForm = declension([`гостя`, `гостей`, `гостей`], guests);
  // выводим данные в модальное окно
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


const init = () => {
  const adsList = fillAds(PINS_AMOUNT);
  renderPinsOnMap(adsList);
  map.classList.remove(`map--faded`);
};

init();
renderCardOnMap();

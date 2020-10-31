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

const mapPin = document.querySelector(`.map__pin--main`);

const fields = document.querySelectorAll(`.ad-form fieldset`);

const mapFilters = document.querySelectorAll(`.map__filters select, .map__filters fieldset`);

const map = document.querySelector(`.map`);

const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);

const mapPins = map.querySelector(`.map__pins`);

// модальное окно с информацией об объявлении
const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
// фильтрация объявлений: тип жилья, стоимость, число комнат, число жильцов
const mapFilterContainer = map.querySelector(`.map__filters-container`);

const adForm = document.querySelector(`.ad-form`);

const addressInput = adForm.querySelector(`#address`);

const initialMainPinSettings = {
  location: {
    x: mapPin.offsetLeft,
    y: mapPin.offsetTop,
  },
  size: {
    width: mapPin.offsetWidth,
    height: mapPin.offsetHeight
  }
};


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
  const features = FEATURES.slice(0, getRandomNumbers(0, FEATURES.length));
  const photos = PHOTOS.slice();
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

// фотографии
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

const getPinLocation = (location, pinSizes) => {
  return {
    x: Math.round(location.x + pinSizes.width / 2),
    y: Math.round(location.y + pinSizes.height / 2)
  };
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


const addDisabled = () => {

  fields.forEach((item) => {
    item.setAttribute(`disabled`, true);
  });

  mapFilters.forEach((item) => {
    item.setAttribute(`disabled`, true);
  });
};


const setValidation = () => {
  if (parseInt(adForm.rooms.value, 10) === 100 && parseInt(adForm.capacity.value, 10) > 0) {
    adForm.capacity.setCustomValidity(`Не для гостей`);
  } else if (parseInt(adForm.rooms.value, 10) < parseInt(adForm.capacity.value, 10)) {
    adForm.capacity.setCustomValidity(`На всех гостей комнат не хватит`);
  } else if (parseInt(adForm.rooms.value, 10) !== 100 && !parseInt(adForm.capacity.value, 10)) {
    adForm.capacity.setCustomValidity(`Для гостей`);
  } else {
    adForm.capacity.setCustomValidity(``);
  }
};

const setCapacityDisabled = () => {
  const roomValue = parseInt(adForm.rooms.value, 10);

  Array.from(adForm.capacity.options).forEach((item) => {
    const optionCapacity = parseInt(item.value, 10);

    if (roomValue === 100) {
      item.disabled = !!optionCapacity;
    } else {
      item.disabled = roomValue < optionCapacity || !optionCapacity;
    }
  });
};

const setInputValue = (element, value) => {
  element.value = value;
};

const setCapacityValue = () => {
  adForm.capacity.value = adForm.rooms.value < 100 ? adForm.rooms.value : 0;
};

const roomsChange = () => {
  setCapacityValue();
  setCapacityDisabled();
};

const capacityChange = () => {
  setValidation();
};

const onAdFormClick = () => {
  setValidation();
};


const onMapPinClick = function () {

  const adsList = fillAds(PINS_AMOUNT);
  const mainPinLocation = getPinLocation(initialMainPinSettings.location, initialMainPinSettings.size);
  setInputValue(addressInput, `${mainPinLocation.x}, ${mainPinLocation.y}`);
  setCapacityValue();
  setCapacityDisabled();
  renderPinsOnMap(adsList);
  renderCardOnMap(adsList[0]);
  map.classList.remove(`map--faded`);
  adForm.classList.remove(`ad-form--disabled`);
  fields.forEach((item) => {
    item.removeAttribute(`disabled`);
  });

  // mapFilters.removeAttribute(`disabled`);

  mapFilters.forEach((item) => {
    item.removeAttribute(`disabled`);
  });
  mapPin.removeEventListener(`click`, onMapPinClick);
};

const userTimeIn = document.querySelector(`#timein`);
const userTimeOut = document.querySelector(`#timeout`);

userTimeIn.addEventListener(`change`, function () {
  userTimeOut.value = userTimeIn.value;
});

userTimeOut.addEventListener(`change`, function () {
  userTimeIn.value = userTimeOut.value;
});

mapPin.addEventListener(`click`, onMapPinClick);

adForm.capacity.addEventListener(`change`, capacityChange);

adForm.rooms.addEventListener(`change`, roomsChange);

adForm.querySelector(`.ad-form__submit`).addEventListener(`click`, onAdFormClick);


const init = () => {
  addDisabled();
};


init();

'use strict';

(function () {

  const OBJ = 8;

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


  const getRandomNumbers = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  const getRandomArray = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const setLeadingZero = (index) => {
    return index < 8 ? `0${index}` : index;
  };

  const createTemplate = (i) => {
    const type = getRandomArray(TYPES);
    const checkin = getRandomArray(CHECK_IN);
    const checkout = getRandomArray(CHECK_IN);
    const features = getRandomArray(FEATURES);
    const photos = getRandomArray(PHOTOS);
    const location = {
      x: getRandomNumbers(40, 1160), y: getRandomNumbers(130, 630)
    };
    const index = setLeadingZero(i + 1);

    return {
      author: {
        avatar: `img/avatars/user` + index + `.png`
      },
      offer: {
        title: `Заголовок предложения`,
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

  const adsList = fillAds(OBJ);
  map.classList.remove(`map--faded`);

  const fragment = document.createDocumentFragment();

  const setPin = (i, ads) => {
    const pinElement = pinTemplate.cloneNode(true);

    const pinWidth = pinElement.style.width;

    const pinHeight = pinElement.style.height;

    pinElement.style.left = `${ads[i].location.x + pinWidth / 2}px`;
    pinElement.style.top = `${ads[i].location.y + pinHeight}px`;
    pinElement.querySelector(`img`).src = ads[i].author.avatar;
    pinElement.querySelector(`img`).alt = ads[i].author.title;

    return pinElement;
  };

  const renderPinsOnMap = (ads) => {

    for (let i = 0; i < ads.length; i++) {
      fragment.appendChild(setPin(i, ads));
    }

    mapPins.appendChild(fragment);
  };

  renderPinsOnMap(adsList);

})();

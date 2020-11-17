"use strict";

(() => {

  const adForm = document.querySelector(`.ad-form`);
  const map = document.querySelector(`.map`);
  const userTimeIn = document.querySelector(`#timein`);
  const userTimeOut = document.querySelector(`#timeout`);
  const userPriceInput = document.querySelector(`#price`);
  const userTypeOption = document.querySelector(`#type`);
  const successTemplate = document.querySelector(`#success`).content.querySelector(`.success`);
  const EnumerationOfConstants = {
    ESC_KEY: 27,
    TIME_INTERVAL: 100,
    START_COORDINATES_LEFT: 570,
    START_COORDINATES_TOP: 375,
    HUNDRED_ROOMS_VALUE: 100
  };

  const housePrices = {
    palace: 10000,
    flat: 1000,
    house: 5000,
    bungalo: 0
  };

  const setValidation = () => {
    if (parseInt(adForm.rooms.value, 10) === EnumerationOfConstants.HUNDRED_ROOMS_VALUE && parseInt(adForm.capacity.value, 10) > 0) {
      adForm.capacity.setCustomValidity(`Не для гостей`);
    } else if (parseInt(adForm.rooms.value, 10) < parseInt(adForm.capacity.value, 10)) {
      adForm.capacity.setCustomValidity(`На всех гостей комнат не хватит`);
    } else if (parseInt(adForm.rooms.value, 10) !== EnumerationOfConstants.HUNDRED_ROOMS_VALUE && !parseInt(adForm.capacity.value, 10)) {
      adForm.capacity.setCustomValidity(`Для гостей`);
    } else {
      adForm.capacity.setCustomValidity(``);
    }
  };

  userTimeIn.addEventListener(`change`, () => {
    userTimeOut.value = userTimeIn.value;
  });

  userTimeOut.addEventListener(`change`, () => {
    userTimeIn.value = userTimeOut.value;
  });

  userTypeOption.addEventListener(`change`, () => {
    userPriceInput.min = housePrices[userTypeOption.value];
    userPriceInput.placeholder = housePrices[userTypeOption.value];
  });

  const setCapacityDisabled = () => {
    const roomValue = parseInt(window.form.adForm.rooms.value, 10);

    Array.from(window.form.adForm.capacity.options).forEach((item) => {
      const optionCapacity = parseInt(item.value, 10);

      if (roomValue === EnumerationOfConstants.HUNDRED_ROOMS_VALUE) {
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
    adForm.capacity.value = adForm.rooms.value < EnumerationOfConstants.HUNDRED_ROOMS_VALUE ? adForm.rooms.value : 0;
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

  const errorEvent = (successMessage) => {
    const successElement = successTemplate.cloneNode(true);
    const successText = successElement.querySelector(`.success__message`);
    successText.textContent = window.load.setErrorsMessage(successMessage);
    document.body.appendChild(successElement);
    successElement.addEventListener(`click`, () => {
      successElement.remove();
    });
  };

  const setSuccessMessage = () => {
    const successElement = successTemplate.cloneNode(true);
    document.body.appendChild(successElement);
    document.addEventListener(`keydown`, onEscKey);
    document.addEventListener(`click`, onClick);

  };

  const removePins = () => {
    const allPins = document.querySelectorAll(`.map__pin`);
    const pins = [...allPins].slice(1);

    pins.forEach((item) => {
      item.remove();
    });
  };

  const clearAll = () => {
    if (document.querySelector(`.success`)) {
      document.querySelector(`.success`).remove();
    }
    setTimeout(() => {
      const mainPinLocation = window.main.getPinLocation();
      setInputValue(window.main.addressInput, `${mainPinLocation.x}, ${mainPinLocation.y}`);
    }, EnumerationOfConstants.TIME_INTERVAL);
    window.map.mapPin.style.left = `${EnumerationOfConstants.START_COORDINATES_LEFT}px`;
    window.map.mapPin.style.top = `${EnumerationOfConstants.START_COORDINATES_TOP}px`;
    document.removeEventListener(`keydown`, onEscKey);
    adForm.classList.add(`ad-form--disabled`);
    map.classList.add(`map--faded`);
    adForm.reset();
    window.main.addDisabled();
    removePins();
    window.main.mapPin.addEventListener(`mousedown`, window.main.onMapPinClick);
    document.removeEventListener(`keydown`, onEscKey);
    document.removeEventListener(`click`, onClick);
  };

  const onEscKey = (evt) => {
    evt.preventDefault();

    if (evt.keyCode === EnumerationOfConstants.ESC_KEY) {
      clearAll();
    }
  };

  const onClick = (evt) => {
    evt.preventDefault();
    clearAll();
  };

  const onSubmitForm = (evt) => {
    evt.preventDefault();
    window.load.save(setSuccessMessage, errorEvent, new FormData(adForm));
  };

  adForm.addEventListener(`submit`, onSubmitForm);
  adForm.addEventListener(`reset`, () => {
    clearAll();
  });
  adForm.capacity.addEventListener(`change`, capacityChange);
  adForm.rooms.addEventListener(`change`, roomsChange);
  adForm.querySelector(`.ad-form__submit`).addEventListener(`click`, onAdFormClick);

  window.form = {
    constants: EnumerationOfConstants,
    adForm,
    setInputValue,
    setValidation,
    setCapacityValue,
    roomsChange,
    capacityChange,
    onAdFormClick,
    setCapacityDisabled,
    removePins
  };

})();

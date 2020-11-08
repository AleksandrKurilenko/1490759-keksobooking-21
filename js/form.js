"use strict";

(() => {

  const adForm = document.querySelector(`.ad-form`);

  const userTimeIn = document.querySelector(`#timein`);

  const userTimeOut = document.querySelector(`#timeout`);

  const userPriceInput = document.querySelector(`#price`);

  const userTypeOption = document.querySelector(`#type`);

  const housePrices = {
    palace: 10000,
    flat: 1000,
    house: 5000,
    bungalo: 0
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


  userTimeIn.addEventListener(`change`, function () {
    userTimeOut.value = userTimeIn.value;
  });

  userTimeOut.addEventListener(`change`, function () {
    userTimeIn.value = userTimeOut.value;
  });


  userTypeOption.addEventListener(`change`, function () {
    userPriceInput.min = housePrices[userTypeOption.value];
    userPriceInput.placeholder = housePrices[userTypeOption.value];
  });


  const setCapacityDisabled = () => {
    const roomValue = parseInt(window.form.adForm.rooms.value, 10);

    Array.from(window.form.adForm.capacity.options).forEach((item) => {
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

  adForm.capacity.addEventListener(`change`, capacityChange);

  adForm.rooms.addEventListener(`change`, roomsChange);

  adForm.querySelector(`.ad-form__submit`).addEventListener(`click`, onAdFormClick);


  window.form = {
    adForm,
    setInputValue,
    setValidation,
    setCapacityValue,
    roomsChange,
    capacityChange,
    onAdFormClick,
    setCapacityDisabled,
  };

})();

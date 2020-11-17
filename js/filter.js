'use strict';

(() => {

  const PINS_LIMIT = 5;
  const mapFilters = document.querySelector(`.map__filters`);
  const housingType = mapFilters.querySelector(`#housing-type`);
  const housingGuests = mapFilters.querySelector(`#housing-guests`);
  const housingRooms = mapFilters.querySelector(`#housing-rooms`);
  const checkboxWifi = mapFilters.querySelectorAll(`.map__features input`);
  const selectPrice = mapFilters.querySelector(`#housing-price`);
  const PriceOfConstants = {
    MIN_PRICE: 10000,
    MAX_PRICE: 50000
  };

  const transferMoney = (elem) => {
    if (elem < PriceOfConstants.MIN_PRICE) {
      return `low`;
    } else if (elem >= PriceOfConstants.MIN_PRICE && elem < PriceOfConstants.MAX_PRICE) {
      return `middle`;
    } else {
      return `high`;
    }
  };

  const filterByHousingType = (item) => housingType.value === item.offer.type || housingType.value === `any`;

  const filterByGuests = (item) => +housingGuests.value === item.offer.guests || housingGuests.value === `any`;

  const filterByRooms = (item) => +housingRooms.value === item.offer.rooms || housingRooms.value === `any`;

  const filterByPrice = (item) => selectPrice.value === transferMoney(item.offer.price) || selectPrice.value === `any`;

  const filterFeatures = (item) => {
    const feauteresArray = item.offer.features;
    const checkboxes = [];
    checkboxWifi.forEach((it) => it.checked && checkboxes.push(it.value));

    return checkboxes.every((elem) => feauteresArray.indexOf(elem) > -1);
  };

  const updatePins = () => {
    const housingData = window.main.myData();
    const data = housingData.filter((item) => {
      return filterByHousingType(item) && filterByGuests(item) && filterByRooms(item) && filterByPrice(item) && filterFeatures(item);
    }).slice(0, PINS_LIMIT);
    window.form.removePins();
    window.pins.renderOnMap(data);
  };


  mapFilters.addEventListener(`change`, () => {
    window.debounce.debounce(updatePins);
  });

  window.filter = {
    updatePins,
    constants: PriceOfConstants,
  };
})();

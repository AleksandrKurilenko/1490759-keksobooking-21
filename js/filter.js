'use strict';

(() => {

  const PINS_LIMIT = 5;
  const mapFilters = document.querySelector(`.map__filters`);
  const housingType = mapFilters.querySelector(`#housing-type`);
  const housingGuests = mapFilters.querySelector(`#housing-guests`);
  const housingRooms = mapFilters.querySelector(`#housing-rooms`);
  const checkboxWifi = mapFilters.querySelectorAll(`.map__features input`);
  const selectPrice = mapFilters.querySelector(`#housing-price`);

  const transferMoney = function (elem) {
    if (elem < 10000) {
      return `low`;
    } else if (elem >= 10000 && elem < 50000) {
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
    let checkboxes = [];
    checkboxWifi.forEach((it) => it.checked && checkboxes.push(it.value));

    return checkboxes.every((elem) => feauteresArray.indexOf(elem) > -1);
  };

  const updatePins = () => {
    const housingData = window.main.myData();
    let data = housingData.filter((item) => {
      return filterByHousingType(item) && filterByGuests(item) && filterByRooms(item) && filterByPrice(item) && filterFeatures(item);
    }).slice(0, PINS_LIMIT);
    window.form.removePins();
    window.main.renderPinsOnMap(data);
  };

  mapFilters.addEventListener(`change`, updatePins);

  window.filter = {
    updatePins
  };
})();

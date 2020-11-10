"use strict";

(() => {

  const mapPin = document.querySelector(`.map__pin--main`);

  const map = document.querySelector(`.map`);

  const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);

  const mapPins = document.querySelector(`.map__pins`);

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


  window.pin = {
    map,
    pinTemplate,
    mapPin,
    mapPins,
    initialMainPinSettings,
  };

})();

"use strict";

(() => {

  const MainPin = {
    HEIGHT: 17,
    WIDTH: 33,
    RIGHT_X: 1200,
    LEFT_X: 0,
    TOP_Y: 130,
    BOTTOM_Y: 630
  };

  const map = document.querySelector(`.map`);
  const adForm = document.querySelector(`.ad-form`);
  const addressInput = adForm.querySelector(`[name="address"]`);
  const mapPin = document.querySelector(`.map__pin--main`);
  let isFirsRender = true;
  let dragged = true;

  const getPositionOffSetElem = function (elem) {
    return {
      x: elem.offsetLeft,
      y: elem.offsetTop
    };
  };

  // код перемещения метки по карте
  mapPin.addEventListener(`mousedown`, function (evt) {
    evt.preventDefault();
    dragged = false;
    const moveOfSet = {
      left: map.offsetLeft,
      top: map.offsetTop
    };

    const onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      const posX = Math.max(Math.min(moveEvt.pageX - moveOfSet.left, MainPin.RIGHT_X), MainPin.LEFT_X);
      const posY = Math.max(Math.min(moveEvt.pageY - moveOfSet.top, MainPin.BOTTOM_Y), MainPin.TOP_Y);
      mapPin.style.left = `${posX - mapPin.offsetWidth / 2}px`;
      mapPin.style.top = `${posY - mapPin.offsetHeight - MainPin.HEIGHT}px`;
      dragged = true;
      let posPin = getPositionOffSetElem(mapPin); // координаты метки
      addressInput.placeholder = posPin.x + `,` + posPin.y;
      // координата острого конца указателя по x
      const coordPinX = (posPin.x + mapPin.offsetWidth - MainPin.WIDTH);
      // координата острого конца указателя по y
      const coordPinY = (posPin.y + mapPin.offsetHeight + MainPin.HEIGHT);
      //  координаты с поправкой на указатель в поле
      addressInput.removeAttribute(`placeholder`);
      addressInput.value = coordPinX + `,` + coordPinY;
    };

    const onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener(`mousemove`, onMouseMove);
      document.removeEventListener(`mouseup`, onMouseUp);

      if (dragged) {
        if (isFirsRender) {
          isFirsRender = false;
        }
      }
    };

    document.addEventListener(`mousemove`, onMouseMove);
    document.addEventListener(`mouseup`, onMouseUp);
  });

  window.map = {
    constants: MainPin,
    mapPin
  };

})();

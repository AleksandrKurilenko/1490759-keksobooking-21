"use strict";

(() => {

  const MARK_POINTER_HEIGHT = 17;

  const RIGHT_X_POS = 1200;

  const LEFT_X_POS = 0;

  const TOP_X_POS = 130;

  const BOTTOM_X_POS = 670;

  const map = document.querySelector(`.map`);

  const adForm = document.querySelector(`.ad-form`);

  const addressInput = adForm.querySelector(`[name="address"]`);

  let isFirsRender = true;
  let dragged = true;


  const getPositionOffSetElem = function (elem) {
    return {
      x: elem.offsetLeft,
      y: elem.offsetTop
    };
  };


  // код перемещения метки по карте
  window.pin.mapPin.addEventListener(`mousedown`, function (evt) {
    evt.preventDefault();
    dragged = false;
    const moveOfSet = {
      left: map.offsetLeft,
      top: map.offsetTop
    };


    const onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      const posX = Math.max(Math.min(moveEvt.pageX - moveOfSet.left, RIGHT_X_POS), LEFT_X_POS);

      const posY = Math.max(Math.min(moveEvt.pageY - moveOfSet.top, BOTTOM_X_POS), TOP_X_POS);

      window.pin.mapPin.style.left = `${posX - window.pin.mapPin.offsetWidth / 2}px`;

      window.pin.mapPin.style.top = `${posY - window.pin.mapPin.offsetHeight - MARK_POINTER_HEIGHT}px`;

      dragged = true;

      let posPin = getPositionOffSetElem(window.pin.mapPin); // координаты метки

      addressInput.placeholder = posPin.x + `,` + posPin.y;

      // posPin = getPositionOffSetElem(window.pin.mapPin); // отступы элемента offsetTop и Left

      // координата острого конца указателя по x
      const coordPinX = Math.round((posPin.x + window.pin.mapPin.offsetWidth));

      // координата острого конца указателя по y
      const coordPinY = (posPin.y + window.pin.mapPin.offsetHeight + MARK_POINTER_HEIGHT);

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

})();

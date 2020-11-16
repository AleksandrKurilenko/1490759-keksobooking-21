"use strict";

(() => {

  let DEBOUNCE = 500; // ms
  let lastTimeout;

  const getRandomArray = (array, n) => {
    return array.sort(() => Math.random() - Math.random()).slice(0, n);
  };

  const debounce = (cb) => {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(cb, DEBOUNCE);
  };

  window.debounce = {
    debounce,
    getRandomArray
  };

})();

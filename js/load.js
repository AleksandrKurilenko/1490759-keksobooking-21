"use strict";

(() => {

  const TIMEOUT_IN_MS = 10000;
  const Url = {
    POST: `https://21.javascript.pages.academy/keksobooking`,
    GET: `https://21.javascript.pages.academy/keksobooking/data`,
  };
  const Method = {
    POST: `POST`,
    GET: `GET`,
  };
  const StatusCode = {
    OK: 200
  };


  const sendXhrRequest = (onLoad, onError) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = `json`;
    xhr.addEventListener(`load`, () => {

      if (xhr.status === StatusCode.OK) {
        onLoad(xhr.response);
      } else {
        onError(xhr.status);
      }
    });

    xhr.addEventListener(`error`, () => {
      onError(`Произошла ошибка соединения`);
    });

    xhr.addEventListener(`timeout`, () => {
      onError(`Запрос не успел выполниться за ${xhr.timeout} мс`);
    });

    xhr.timeout = TIMEOUT_IN_MS;
    return xhr;
  };

  const setErrorsMessage = (errorStatus) => {
    const CONSOLE_MESSAGE = `Пожалуйста, перегрузите страницу`;
    let error;
    switch (errorStatus) {
      case 400:
        error = `Неверный запрос. ${CONSOLE_MESSAGE}`;
        break;
      case 401:
        error = `Пользователь не авторизован.`;
        break;
      case 403:
        error = `Доступ запрещен.`;
        break;
      case 404:
        error = `Ничего не найдено.`;
        break;
      default:
        error = `${errorStatus}. ${CONSOLE_MESSAGE}`;
    }
    return error;
  };

  const load = (onLoad, onError) => {
    const xhr = sendXhrRequest(onLoad, onError);
    xhr.open(Method.GET, Url.GET);
    xhr.send();
  };

  const save = (onLoad, onError, data) => {
    const xhr = sendXhrRequest(onLoad, onError);
    xhr.open(Method.POST, Url.POST);
    xhr.send(data);
  };

  window.load = {
    load,
    save,
    setErrorsMessage,
  };

})();

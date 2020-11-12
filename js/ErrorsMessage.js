"use strict";

(() => {

  // const successTemplate = document.querySelector(`#success`);

  // const errTemplate = document.querySelector(`#error`);

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

  // const renderErrorsNode = (errorMessage) => {

  //   const errorNode = document.createElement(`div`);

  //   errorNode.classList.add(`error`, `error-message`);

  //   errorNode.textContent = setErrorsMessage(errorMessage);

  //   document.body.insertAdjacentElement(`afterbegin`, errorNode);

  // };

  window.ErrorsMessage = {
    // renderErrorsNode,
    setErrorsMessage
  };

})();

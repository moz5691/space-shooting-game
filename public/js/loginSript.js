/* eslint-disable */

const nextStep = function (event) {
  event.preventDefault();
  $('#login-page').hide();
};

$('#submit-btn').on('click', nextStep);

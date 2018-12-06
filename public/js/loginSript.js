/* eslint-disable */

const nextStep = function (event) {
  event.preventDefault();
  location.replace('/game');
};

$('#submit-btn').on('click', nextStep);

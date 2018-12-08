/* eslint-disable */

const nextStep = function (event) {
  event.preventDefault();
  location.replace('/start');
};

$('#submit-btn').on('click', nextStep);

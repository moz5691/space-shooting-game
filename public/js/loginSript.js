/* eslint-disable */

const nextStep = function (event) {
  event.preventDefault();
  location.replace('/intro');
};

$('#submit-btn').on('click', nextStep);

/* eslint-disable */

const nextStep = function (event) {
  event.preventDefault();
  const userInput = $('#icon_prefix').val();
  sessionStorage.setItem('user', `${userInput}`);
  location.replace('/start');
};

$('#submit-btn').on('click', nextStep);

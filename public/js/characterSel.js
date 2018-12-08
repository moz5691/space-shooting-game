/* eslint-disable */

function characterPage() {
  $("#canvas").empty();
  const ajaxGetData = sessionStorage.getItem("user");
  $("#canvas").append(
    $("<div>").append(
      $("<p>")
        .addClass("blinking")
        .attr("id", "welcome")
        .text("Welcome " + ajaxGetData)
        .css("font-size", "50px")
        .css("font-family", "'Press Start 2P', cursive")
        .css("text-align", "center"),
      $("<p>")
        .addClass("blinking")
        .attr("id", "choose")
        .text("Please choose your charater")
        .css("font-size", "20px")
        .css("text-align", "center")
        .css("font-family", "'Press Start 2P', cursive")
        .css("margin-top", "30px"),

      $('<div>')
        .addClass('charGroup')
        .append(
          $('<div>')
            .addClass('row s2')
            .append(
              $("<img src = 'assets/ship_1.png'>").addClass(
                'waves-effect waves-light shipButtonOne dis col s2',
              ),
              $("<img src = 'assets/ship_2.png'>").addClass(
                'waves-effect waves-light shipButtonTwo dis col s2',
              ),
              $("<img src = 'assets/ship_3.png'>").addClass(
                'waves-effect waves-light shipButtonThree dis col s2',
              ),
            ),
          $('<div>')
            .addClass('row s2')
            .append(
              $("<img src = 'assets/ship_4.png'>").addClass(
                'waves-effect waves-light shipButtonFour dis col s2',
              ),
              $("<img src = 'assets/ship_5.png'>").addClass(
                'waves-effect waves-light shipButtonFive dis col s2',
              ),
              $("<img src = 'assets/ship_6.png'>").addClass(
                'waves-effect waves-light shipButtonSix dis col s2',
              ),
            ),
        ),
      $('<button>')
        .attr('id', 'reselectButton')
        .text('Re-Select?')
        .addClass('btn btn-large btn-flat white-text waves-effect waves-light')
        .css('font-size', '9px')
        .css('font-family', "'Press Start 2P', cursive"),

      $('<button>')
        .attr('id', 'selectButton')
        .text('Select')
        .addClass('btn btn-large btn-flat white-text waves-effect waves-light')
        .css('font-family', "'Press Start 2P', cursive")
        .prop('disabled', true),
    ),
  );
}

function nextStep(event) {
  event.preventDefault();
  location.replace('/intro');
}

$(document).on('click', '.shipButtonOne', function (e) {
  e.preventDefault();

  $(this).toggleClass('grayEffect', 1000);
  $('.dis').prop('disabled', true);
  $('#selectButton').prop('disabled', false);
  sessionStorage.setItem('shipType', 1);
  sessionStorage.setItem('shipLife', 100);
  sessionStorage.setItem('shipSpeed', 0.5);
});
$(document).on('click', '.shipButtonTwo', function (e) {
  e.preventDefault();
  $(this).toggleClass('grayEffect', 1000);
  $('.dis').prop('disabled', true);
  $('#selectButton').prop('disabled', false);
  sessionStorage.setItem('shipType', 2);
  sessionStorage.setItem('shipLife', 70);
  sessionStorage.setItem('shipSpeed', 0.7);
});
$(document).on('click', '.shipButtonThree', function (e) {
  e.preventDefault();

  $(this).toggleClass('grayEffect', 1000);
  $('.dis').prop('disabled', true);
  $('#selectButton').prop('disabled', false);
  sessionStorage.setItem('shipType', 3);
  sessionStorage.setItem('shipLife', 150);
  sessionStorage.setItem('shipSpeed', 0.4);
});
$(document).on('click', '.shipButtonFour', function (e) {
  e.preventDefault();

  $(this).toggleClass('grayEffect', 1000);
  $('.dis').prop('disabled', true);
  $('#selectButton').prop('disabled', false);
  sessionStorage.setItem('shipType', 4);
  sessionStorage.setItem('shipLife', 200);
  sessionStorage.setItem('shipSpeed', 0.3);
});
$(document).on('click', '.shipButtonFive', function (e) {
  e.preventDefault();

  $(this).toggleClass('grayEffect', 1000);
  $('.dis').prop('disabled', true);
  $('#selectButton').prop('disabled', false);
  sessionStorage.setItem('shipType', 5);
  sessionStorage.setItem('shipLife', 50);
  sessionStorage.setItem('shipSpeed', 0.8);
});
$(document).on('click', '.shipButtonSix', function (e) {
  e.preventDefault();

  $(this).toggleClass('grayEffect', 1000);
  $('.dis').prop('disabled', true);
  $('#selectButton').prop('disabled', false);
  sessionStorage.setItem('shipType', 6);
  sessionStorage.setItem('shipLife', 90);
  sessionStorage.setItem('shipSpeed', 0.6);
});

$(document).on('click', '#reselectButton', () => {
  $('.dis').prop('disabled', false);
  $('.dis').removeClass('grayEffect');
  $('#selectButton').prop('disabled', true);
});
$(document).on('click', '#selectButton', nextStep);

// room
// registeration
// character
// main screen

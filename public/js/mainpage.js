/* eslint-disable */

/**
 * @param {string} mainPage - renders out the main page
 * @return {object} displays mainPage/startup page
 */

function mainPage() {
  $("#canvas").empty();
  $("#canvas").append(
    $("<div>")
    .attr('id', 'maindiv')
    .append(
      $("<h1>").append(
        $("<span>")
          .text("Blue ")
          .addClass("mainTitle blue-text blueTitle")
          .css("float", "left")
          .css("font-family", "'Press Start 2P', cursive"),
        $("<span>")
          .text("  Vs  ")
          .addClass("mainTitle white-text vsTitle")
          .css("float", "left")
          .css("font-family", "'Press Start 2P', cursive"),
        $("<span>")
          .text(" Red")
          .addClass("mainTitle red-text redTitle")
          .css("float", "left")
          .css("font-family", "'Press Start 2P', cursive")
      ),
      $("<br/>"),
      $("<p>")
        .addClass("enter")
        .text("Press Enter to Start")
        .css("font-size", "30px")
        .addClass("center-align startText blinking")
        .append(
          $("<i>")
            .addClass("medium material-icons iconGo blinking")
            .text("exit_to_app")
        )
    )
  );
}

function disable() {
  $("#canvas").bind("keypress", e => {
    if (e.keyCode === 13) {
      return false;
    }
  });
}

/**
 * @param {string} keypressEnter - response to enter button
 * @return {object} displays the login page on enter button down
 */

$(document).keypress(e => {
  if (e.keyCode === 13) {
    e.preventDefault();
    loginPage();
  }
});

mainPage();

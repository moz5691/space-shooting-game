/* eslint-disable */

/**
 * @param {string} leaderboard - renders out leaderboard page
 * @return {object} Leaderboard Page layout
 */
function leaderboard() {
  $("#canvas").empty();
  $("#canvas").append(
    $("<div>").append(
      $("<p>")
        .text("Top 10 players")
        .addClass("center-align boardTitle")
        .css("font-size", "60px")
        .css("font-family", "'Press Start 2P', cursive")
        .css("position", "relative")
        .css("left", "27px")
    ),
    $("<div>").addClass("userNScore row")
  );
  topFiveCal();

  $("#canvas").append(
    $("<p>")
      .text("Press Enter To Go Back")
      .addClass("center-align blinking")
      .css("font-family", "'Press Start 2P', cursive")
      .css("position", "relative")
      .css("left", "20px")
      .css("margin-top", "40px")
      .css("margin-bottom", "40px")
  );
}

/**
 * @param {string} topFiveCal - Gets the user data
 * @param {string} sort - sorts the data by score points
 * @return {object} renders out 10 top players
 */

function topFiveCal() {
  $.ajax({ url: "/api/user", method: "GET" }).then(function(data) {
    const dataArr = [];
    for (var score in data) {
      dataArr.push([score, data[score]]);
    }

    dataArr.sort(function(a, b) {
      return b[1].score - a[1].score;
    });
    for (let i = 0; i < 10; i++) {
      $(".userNScore").append(
        $("<p>")
          .text(dataArr[i][1].username)
          .addClass("center-align white-text col s8")
          .css("font-size", "50px")
          .css("margin-top", "20px")
          .css("position", "relative")
          .css("left", "10px"),
        $("<p>")
          .text(dataArr[i][1].score)
          .addClass("center-align white-text col s2")
          .css("font-size", "50px")
          .css("margin-top", "20px")
      );
    }
  });
}

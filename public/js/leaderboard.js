function leaderboard() {
  $("#canvas").empty();
  $("#canvas").append(
    $("<div>").append(
      $("<h1>")
        .text("Top 5 players")
        .addClass("center-align boardTitle")
    ),
    $("<div>").addClass("userNScore row")
  );
  getUserNScores();
}

function getUserNScores() {
  $.ajax({ url: "/api/user", method: "GET" }).then(function(data) {
    data.forEach(e => {
      $(".userNScore").append(
        // $("div")
        //   .addClass("row")
        //   .append(
        $("<p>")
          .text(e.username)
          .addClass("center-align white-text col s8")
          .css("font-size", "20px"),
        $("<p>")
          .text(e.score)
          .addClass("white-text col s2")
          .css("font-size", "20px")
        // )
      );
    });
  });
}

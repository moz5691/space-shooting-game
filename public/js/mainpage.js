function mainPage() {
  $("#canvas").empty();
  $("#canvas").append(
    $("<div>").append(
      $("<h1>").append(
        $("<span>")
          .text(`Blue `)
          .addClass("mainTitle blue-text blueTitle")
          .css("float", "left")
          .css("font-family", "'Press Start 2P', cursive"),
        $("<span>")
          .text(`  Vs  `)
          .addClass("mainTitle white-text vsTitle")
          .css("float", "left")
          .css("font-family", "'Press Start 2P', cursive"),
        $("<span>")
          .text(` Red`)
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
$(document).keypress(function(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    characterPage();
  }
});
mainPage();

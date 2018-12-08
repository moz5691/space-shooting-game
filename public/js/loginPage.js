function loginPage() {
  disable();
  $("#canvas").empty();
  $("#canvas").append(
    $("div")
      .addClass("row")
      .attr("id", "login-page")
      .attr("id", "canvas")
      .append(
        $("<div>")
          .addClass("col s8 center")
          .append(
            $("<h4>")
              .addClass("truncate bg-card-user border-button")
              .attr("id", "login-card"),
            // $("<img src = 'assets/Attack_017.png'>")
            //   .addClass("circle responsive-img login-page-wrap")
            //   .css("width", "200px"),
            $("<div>")
              .addClass("row login border-shape login-page-wrap")
              .css("position", "relative")
              .css("left", "60px")
              .css("top", "60px")
              .append(
                $("<h4>")
                  .addClass("left-align")
                  .text("Space Shooting")
                  .css("font-size", "80px")
                  .css("font-family", "'Press Start 2P', cursive")
                  .css("position", "relative")
                  .css("bottom", "50px"),
                $("<form>").addClass("col s1"),
                $("<div>")
                  .addClass("row")
                  .css("position", "relative")
                  .css("left", "50px")
                  .append(
                    $("<div>")
                      .addClass("input-field col m12 s12")
                      .append(
                        $("<i>")
                          .addClass("material-icons iconis prefix")
                          .text("account_box"),
                        $("<input>")
                          .attr("id", "icon_prefix")
                          .attr("type", "text")
                          .addClass("validate white-text")
                          .attr("placeholder", "Username")
                      )
                  ),
                $("<div>")
                  .addClass("row")
                  .append(
                    $("<button>")
                      .addClass("btn btn-large waves-effect waves-light")
                      .attr("id", "submit-btn")
                      .attr("type", "submit")
                      .attr("name", "action")
                      .text("LOGIN")
                      .css("position", "relative")
                      .css("left", "50px"),
                    $("<button>")
                      .addClass("btn btn-large wave-effect waves-light")
                      .attr("id", "leaderboard-btn")
                      .text("Leader Board")
                      .css("position", "relative")
                      .css("left", "90px")
                  )
              )
          )
      )
  );
}

const loginStep = function(event) {
  event.preventDefault();
  const username = $("#icon_prefix").val();
  if (username.trim() === "") alert("please insert player name");
  else {
    $.ajax({
      url: `/api/user/${username}`,
      method: "get"
    }).then(function(response) {
      if (response === null) {
        $.ajax({
          url: "/api/user",
          data: { username: username },
          method: "post"
        }).then(function(response) {
          saveUser(response);
        });
      } else saveUser(response);
    });
  }
};

$(document).on("click", "#submit-btn", function() {
  if ($(".validate").val() === "") {
    alert("Must need to input a ID");
  } else {
    sessionStorage.setItem("user", $(".validate").val());
    characterPage();
  }
});

/* eslint-disable */

/**
 * @author Yoon/ Maryam
 * @description make login tag in canvas
 */
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
            $("<div>")
              .addClass("row login border-shape login-page-wrap")
              .css("position", "relative")
              .css("left", "60px")
              .css("top", "60px")
              .append(
                $("<h4>")
                  .addClass("left-align blinking")
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

/**
 * @author Maryam
 * @return with click on submit button on login page save user information on database and sessionstorage
 */
const loginStep = function(event) {
  // event.preventDefault();
  const username = $("#icon_prefix").val();
  if (username.trim() === "") alert("please insert player name");
  else {
    $.ajax({
      url: `/api/user/${username}`,
      method: "get"
    }).then(response => {
      if (response === null) {
        $.ajax({
          url: "/api/user",
          data: { username, score: 0 },
          method: "post"
        }).then(response => {
          sessionStorage.setItem("user", response.username);
          characterPage();
        });
      } else sessionStorage.setItem("user", response.username);
      characterPage();
    });
  }
};

// const saveUser = function(response) {
//   $("#gameLogin").hide();
//   sessionStorage.setItem("user", response.username);
//   characterPage();
// };

$(document).on("click", "#submit-btn", () => {
  loginStep();
});
$(
  $(document).on("click", "#leaderboard-btn", () => {
    leaderboard();
  })
);

// $(document).on("click", "#submit-btn", () => {
//   if ($(".validate").val() === "") {
//     alert("Must need to input a ID");
//   } else {
//     sessionStorage.setItem("user", $(".validate").val());
//     characterPage();
//   }
// });

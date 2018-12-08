$(document).ready(function(){
  $("#gameLogin").hide();
})
function loginpage(){
    $("#gameLogin").show();
  }
   
  
const saveUser = function(response){
  $("#gameLogin").hide();
      sessionStorage.setItem('user', response.username);
      characterPage();
}

const leaderboardPage = function(){
  event.preventDefault();
<<<<<<< HEAD
  const userInput = $('#icon_prefix').val();
  sessionStorage.setItem('user', `${userInput}`);
  location.replace('/start');
=======
  location.replace("/leaderboard");
}

const loginStep = function (event) {
  event.preventDefault();
  const username = $('#icon_prefix').val();
  if(username.trim() === '') alert('please insert player name');
  else{
    $.ajax({
      url: `/api/user/${username}`,
      method: 'get'
    }).then(function(response) {
      if(response === null){
        $.ajax({
          url: '/api/user',
          data: {username: username},
          method: 'post'
        })
        .then(function (response) {
              saveUser(response);
          })

        }else saveUser(response);
    });
    
  }
>>>>>>> 550b78d4ac841d49d55314a997cd7777e207a0b8
};

$('#submit-btn').on('click', loginStep);

$('#leaderboardBtn').on('click', leaderboardPage);
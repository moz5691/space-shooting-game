/* eslint-disable */
/**
 * @author maryam 
 * @description modified by Yoon in loginpage.js
 */
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
};

$('#submit-btn').on('click', loginStep);

$('#leaderboardBtn').on('click', leaderboardPage);
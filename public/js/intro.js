/* eslint-disable */

// Sets the number of stars we wish to display
const numStars = 100;

// Gets random x, y values based on the size of the container
function getRandomPosition() {
  const y = window.innerWidth;
  const x = window.innerHeight;
  const randomX = Math.floor(Math.random() * x);
  const randomY = Math.floor(Math.random() * y);
  return [randomX, randomY];
}

// For every star we want to display
for (let i = 0; i < numStars; i++) {
  const star = document.createElement("div");
  star.className = "star";
  const xy = getRandomPosition();
  star.style.top = `${xy[0]}px`;
  star.style.left = `${xy[1]}px`;
  document.body.append(star);
}
const skipScene = e => {
  e.preventDefault();
  location.replace("/game");
};

const playerOne = sessionStorage.getItem("user");
const upperPlayer = playerOne.toUpperCase();

const renderText = () => {
  let htmlstr = "";
  htmlstr += `The FIRST ORDER reigns. Having decimated the peaceful Republic, Supreme Leader Evil ${upperPlayer} `;
  htmlstr +=
    "now deploys the merciless legions to seize military control of the galaxy.";
  htmlstr += "<br>";
  htmlstr += `Only General ${upperPlayer}'s band of RESISTANCE fighters stand against the rising tyranny,`;
  htmlstr +=
    " certain that Jedi Master CJ Hannah will return and restore a spark of code to the fight.";
  htmlstr += "<br>";
  htmlstr += "But the Resistance has been exposed.";
  htmlstr += "<br>";
  htmlstr +=
    "Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire.";
  htmlstr += "<br>";
  htmlstr +=
    "During the battle, Rebel spies managed to steal secret plans to the Empires ultimate weapon,";
  htmlstr +=
    " the DEATH STAR, an armored space station with enough power to destroy an entire planet.";
  htmlstr += "<br>";
  htmlstr += `Pursued by the Empires sinister agents, ${upperPlayer} races home aboard a starship, custodian of the `;
  htmlstr +=
    "stolen plans that can save her people and restore freedom to the galaxy.....";
  $("#playerIntro").html(htmlstr);
};

renderText();

$("#board").on("click", skipScene);
$(".intro").on("click", skipScene);

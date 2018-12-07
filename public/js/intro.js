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
  const star = document.createElement('div');
  star.className = 'star';
  const xy = getRandomPosition();
  star.style.top = `${xy[0]}px`;
  star.style.left = `${xy[1]}px`;
  document.body.append(star);
}
const skipScene = (e) => {
  e.preventDefault();
  location.replace('/game');
};

$('#board').on('click', skipScene);
$('.intro').on('click', skipScene);


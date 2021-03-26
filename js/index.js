import { Sound } from './sounds.js';
import { Ship, Asteroid } from './entities.js';
import { bulletAsteroidCollision, createRandomAsteroid, shipAsteroidCollision } from './helpers.js';

const canvas = document.getElementById("canvas");
const startGameBtn = document.getElementById("start-game-btn");
const modalWindowContainer = document.getElementById("modal-window-container");
const modalWindowTitle = document.getElementById("modal-window-title");
const score = document.getElementById("score");

export const ctx = canvas.getContext("2d");
export const ASTEROIDS_COUNT = 10;
export const ASTEROIDS_SPEED = 1;
export const FPS = 50;

export let gameShip, gameScore = 0;
export let gameAsteroids = [];
let gameRender;

export const asteroidParams = {
  1: {
    color: "#555",
    borderWidth: 1,
    score: 100
  },
  2: {
    color: "#999",
    borderWidth: 1.5,
    score: 50
  },
  4: {
    color: "#ddd",
    borderWidth: 2,
    score: 20
  }
}

function init() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  gameShip = new Ship("#fff", canvas.width / 2, canvas.height / 2);
  gameShip.draw();

  for (let i = 0; i < ASTEROIDS_COUNT; i++) {
    let newAsteroid = createRandomAsteroid();
    gameAsteroids.push(newAsteroid);
    newAsteroid.draw();
  }

  // let ast = new Asteroid(150, 150, 0, 4);
  // gameAsteroids.push(ast);
  // ast.draw();

  gameRender = setInterval(updateGameArea, 1000/FPS);

  window.addEventListener('keydown', function (e) {
    gameShip.keys = (gameShip.keys || []);
    gameShip.keys[e.code] = (e.type == "keydown");
  })
  window.addEventListener('keyup', function (e) {
    gameShip.keys[e.code] = (e.type == "keydown");
  })
  window.addEventListener('keyup', function (e) {
    if(e.code === 'Space'){
      gameShip.shot();
    }
  })
}

function startGame(){
  setTimeout(() => {
    modalWindowContainer.style.display = 'none';
    gameScore = 0;
    gameAsteroids = [];
    init();
  }, 300);
}

function finishGame(){
  clearInterval(gameRender);
  (new Sound("../sounds/spaceship-system-break-down.wav")).play();
  modalWindowContainer.style.display = 'flex';
  modalWindowTitle.textContent = 'Your score is ' + gameScore;
}

function updateGameArea() {
  let isFire = false;
  gameShip.clear();
  gameShip.speed = 0;
  gameShip.moveAngle = 0;

  if (gameShip.keys && gameShip.keys['ArrowUp']) {
    gameShip.speed = 5;
    isFire = true;
  }
  if (gameShip.keys && gameShip.keys['ArrowLeft']) {
    gameShip.moveAngle = -Math.PI * 1.1;
  }
  if (gameShip.keys && gameShip.keys['ArrowRight']) {
    gameShip.moveAngle = Math.PI * 1.1;
  }

  gameShip.update();
  gameShip.draw(isFire);
  gameShip.bullets.forEach(bullet => {
    bullet.update();
    bullet.draw();
  });
  gameAsteroids.forEach(asteroid => {
    asteroid.update();
    asteroid.draw();
    if(shipAsteroidCollision(asteroid)){
      finishGame();
    };
    gameShip.bullets.forEach(bullet => {
      if(bulletAsteroidCollision(bullet, asteroid)){
        (new Sound("../sounds/falling-hit.wav")).play();
        asteroid.destroy();
        gameShip.bullets.splice(gameShip.bullets.indexOf(bullet), 1);
        gameScore += asteroidParams[asteroid.size].score;
        score.textContent = gameScore;
      }
    });
  });
}

startGameBtn.addEventListener('click', startGame);
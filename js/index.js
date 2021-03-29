import { GameSounds } from './sounds.js';
import { Ship } from './entities.js';
import { bulletAsteroidCollision, createRandomAsteroid, shipAsteroidCollision } from './helpers.js';

const canvas = document.getElementById("canvas");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const startGameBtn = document.getElementById("start-game-btn");
const modalWindowContainer = document.getElementById("modal-window-container");
const modalWindowTitle = document.getElementById("modal-window-title");
const header = document.getElementById("header");
const scoreValue = document.getElementById("score");
const lifesValue = document.getElementById("lifes");

export const ctx = canvas.getContext("2d");
export const ASTEROIDS_COUNT = 10;
export const ASTEROIDS_SPEED = 1;
export const FPS = 60;

export let gameShip, gameScore = 0;
export let gameAsteroids = [];
let gameRender, backgroundRender;

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
  gameShip = new Ship("#fff", canvas.width / 2, canvas.height / 2);
  gameShip.draw();
  setTimeout(() => {
    gameShip.isRestored = true;
  }, 2000);

  for (let i = 0; i < ASTEROIDS_COUNT; i++) {
    let newAsteroid = createRandomAsteroid(gameShip.x, gameShip.y);
    gameAsteroids.push(newAsteroid);
    newAsteroid.draw();
  }

  gameRender = setInterval(updateGameArea, 1000/FPS);

  window.addEventListener('keydown', function (e) {
    gameShip.keys = (gameShip.keys || []);
    gameShip.keys[e.code] = (e.type == "keydown");
  })
  window.addEventListener('keyup', function (e) {
    gameShip.keys[e.code] = (e.type == "keydown");
  })
  window.addEventListener('keyup', function (e) {
    if(e.code === 'Space' && !gameShip.isDestroyed) gameShip.shot();
  })
}

function startGame(){
  setTimeout(() => {
    modalWindowContainer.style.display = 'none';
    header.style.visibility = 'visible';
    clearInterval(backgroundRender);
    clearInterval(gameRender);
    scoreValue.textContent = 0;
    gameScore = 0;
    gameAsteroids = [];
    init();
    lifesValue.textContent = gameShip.lifes.toString();
  }, 300);
  setTimeout(() => {
    gameShip.isReatored = true;
  }, 2000);
  GameSounds.playBackground();
}

function displayAsteroidsBackground(){
  for (let i = 0; i < ASTEROIDS_COUNT; i++) {
    let newAsteroid = createRandomAsteroid(canvas.width/2, canvas.height/2);
    gameAsteroids.push(newAsteroid);
    newAsteroid.draw();
  }
  backgroundRender = setInterval(updateAsteroidBackground, 1000/FPS);
}

function finishGame(){
  gameShip.isDestroyed = true;
  GameSounds.gameOver();
  GameSounds.stopBackground();
  GameSounds.stopBoost();
  modalWindowContainer.style.display = 'flex';
  modalWindowTitle.textContent = 'Your score is ' + gameScore;
}

function restoreShip(){

  gameShip.x = canvas.width / 2;
  gameShip.y = canvas.height / 2;
  gameShip.speed = 0;
  gameShip.angle = 0;
  gameShip.isBoost = false;
  gameShip.isRestored = false;
  gameShip.isAbleToMove = false;
  gameShip.additionalSpeed = 0;
  gameShip.bullets = [];
  gameShip.draw();
  GameSounds.stopBoost();
  setTimeout(() => {
    gameShip.isAbleToMove = true;
  }, 1000);

  setTimeout(() => {
    gameShip.isRestored = true;
  }, 2000);
}

function updateGameArea() {
  let isBoost = false;
  gameShip.clear();
  gameShip.speed = 0;
  gameShip.moveAngle = 0;

  if(gameShip.isAbleToMove && !gameShip.isDestroyed){
    if (gameShip.keys && gameShip.keys['ArrowUp']) {
      gameShip.speed = 5;
      isBoost = true;
    }
    if (gameShip.keys && gameShip.keys['ArrowLeft']) {
      gameShip.moveAngle = -Math.PI * 1.1;
    }
    if (gameShip.keys && gameShip.keys['ArrowRight']) {
      gameShip.moveAngle = Math.PI * 1.1;
    }
    if(isBoost !== gameShip.isBoost){
      isBoost ? GameSounds.playBoost() : GameSounds.stopBoost();
    }
  }

  gameShip.isBoost = isBoost;
  if(!gameShip.isDestroyed){
    gameShip.update();
    gameShip.isRestored ? gameShip.draw() : gameShip.drawBlicking();

    gameShip.bullets.forEach(bullet => {
      bullet.update();
      bullet.draw();
    });
  }
  gameAsteroids.forEach(asteroid => {
    if(gameShip.isRestored && !gameShip.isDestroyed){
      if(shipAsteroidCollision(asteroid)){
        gameShip.lifes--;
        lifesValue.textContent = gameShip.lifes.toString();
        asteroid.destroy();
        gameScore += asteroidParams[asteroid.size].score;
        scoreValue.textContent = gameScore.toString();
        if(gameShip.lifes === 0){
          finishGame();
        }else {
          GameSounds.break();
          restoreShip();
        }
      };

      gameShip.bullets.forEach(bullet => {
        if(bulletAsteroidCollision(bullet, asteroid)){
          GameSounds.destroy(asteroid.size);
          asteroid.destroy();
          gameShip.bullets.splice(gameShip.bullets.indexOf(bullet), 1);
          gameScore += asteroidParams[asteroid.size].score;
          scoreValue.textContent = gameScore.toString();
        }
      });
    }
    asteroid.update();
    asteroid.draw();
  });
}

function updateAsteroidBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  gameAsteroids.forEach(asteroid => {
    asteroid.update();
    asteroid.draw();
  });
}

startGameBtn.addEventListener('click', startGame);
displayAsteroidsBackground();
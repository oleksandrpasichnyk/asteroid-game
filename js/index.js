import { getPath1, getPath2, getPath3 } from './paths.js';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const score = document.getElementById("score");
let gameShip, gameAsteroids = [], gameScore = 0;
let gameRender = setInterval(updateGameArea, 20);

const asteroidParams = {
  1: {
    color: "#555",
    border: 1,
    score: 100
  },
  2: {
    color: "#999",
    border: 1.5,
    score: 50
  },
  4: {
    color: "#ddd",
    border: 2,
    score: 20
  }
}

class Ship {
  constructor(color, x, y) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.speed = 0;
    this.angle = 0;
    this.moveAngle = 0;

    this.additionalSpeed = 0;
    this.brakes = 0.98;

    this.bullets = [];

    this.draw = function (isFire) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.translate(-this.x, -this.y);
      ctx.strokeStyle = this.color;
      ctx.beginPath();
      if (isFire) {
        this.additionalSpeed = 5;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + 10, this.y);
        ctx.lineTo(this.x + 15, this.y + 15);
        ctx.lineTo(this.x, this.y - 30);
        ctx.lineTo(this.x - 15, this.y + 15);
        ctx.lineTo(this.x - 10, this.y);
        ctx.lineTo(this.x - 5, this.y);
        ctx.lineTo(this.x, this.y + 15);
        ctx.lineTo(this.x + 5, this.y);
        ctx.lineTo(this.x - 5, this.y);
        ctx.lineTo(this.x, this.y);
      } else {
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + 10, this.y);
        ctx.lineTo(this.x + 15, this.y + 15);
        ctx.lineTo(this.x, this.y - 30);
        ctx.lineTo(this.x - 15, this.y + 15);
        ctx.lineTo(this.x - 10, this.y);
        ctx.lineTo(this.x, this.y);
      }
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    };
    this.update = function () {
      if (this.speed === 0) {
        this.speed = this.additionalSpeed * this.brakes;
        this.additionalSpeed *= this.brakes;
      }
      this.angle += this.moveAngle * Math.PI / 180;
      this.x += (this.speed) * Math.sin(this.angle);
      this.y -= (this.speed) * Math.cos(this.angle);
      if (this.x < 0) {
        this.x = canvas.width - this.x;
      } else if (this.x > canvas.width) {
        this.x = this.x - canvas.width;
      }
      if (this.y < 0) {
        this.y = canvas.height - this.y;
      } else if (this.y > canvas.height) {
        this.y = this.y - canvas.height;
      }
    };

    this.getCoordinates = function () {
      return [{
        x1: this.x + 15,
        y1: this.y + 15,
        x2: this.x,
        y2: this.y - 30
      },
      {
        x1: this.x - 15,
        y1: this.y + 15,
        x2: this.x,
        y2: this.y - 30
      },
      {
        x1: this.x - 10,
        y1: this.y,
        x2: this.x + 10,
        y2: this.y
      }
      ];
    };
    this.shot = function () {
      let bullet = new Bullet(this.x + 30 * Math.sin(this.angle), this.y - 30 * Math.cos(this.angle), this.color, this.angle);
      bullet.draw();
      this.bullets.push(bullet);
      setTimeout(() => {
        this.bullets.splice(this.bullets.indexOf(bullet), 1);
      }, 1000);
    };
    this.clear = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }
}

class Asteroid {
  constructor(x, y, angle, size) {
    this.x = x;
    this.y = y;
    this.speed = 1;
    this.angle = angle;
    this.size = size; // 1, 2 or 4

    this.color = asteroidParams[this.size].color;
    this.border = asteroidParams[this.size].border;

    this.asteroidPath = [getPath1, getPath2, getPath3][Math.floor(Math.random() * Math.floor(3))];

    this.draw = function () {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.border;
      // ctx.save();
      // ctx.scale(size, size);
      ctx.stroke(this.getPath());
      // ctx.restore();
    };

    this.update = function () {
      if (this.x + (15 * this.size) < 0) {
        this.x = canvas.width + this.x;
      }
      else if (this.x - (15 * this.size) > canvas.width) {
        this.x = this.x - canvas.width;
      }
      if (this.y + (15 * this.size) < 0) {
        this.y = canvas.height + this.y;
      } else if (this.y - (15 * this.size) > canvas.height) {
        this.y = this.y - canvas.height;
      }
      this.x += this.speed * Math.sin(this.angle);
      this.y -= this.speed * Math.cos(this.angle);
      // console.log(this.x, this.y);
    };
    this.getPath = function () {
      return this.asteroidPath(this.x, this.y, this.size);
    };
    this.clear = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }
}

class Bullet {
  constructor(x, y, color, angle) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = 10;
    this.angle = angle;
    this.draw = function () {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
      ctx.fill();
    };
    this.update = function () {
      if (this.x < 0) {
        this.x = canvas.width - this.x;
      } else if (this.x > canvas.width) {
        this.x = this.x - canvas.width;
      }
      if (this.y < 0) {
        this.y = canvas.height - this.y;
      } else if (this.y > canvas.height) {
        this.y = this.y - canvas.height;
      }
      this.x += this.speed * Math.sin(this.angle);
      this.y -= this.speed * Math.cos(this.angle);
    };
  }
}

function init() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  gameShip = new Ship("#fff", canvas.width / 2, canvas.height / 2);
  gameShip.draw();

  for (let i = 0; i < 10; i++) {
    let newAsteroid = createAsteroid();
    gameAsteroids.push(newAsteroid);
    newAsteroid.draw();
  }
  // gameAsteroids.push(new Asteroid(150, 150, 0, 1));
  // gameAsteroids.push(new Asteroid(300, 150, 0, 2));
  console.log(canvas.width, canvas.height);
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

init();

function createAsteroid(){
  // let x, y;
  // do {
  //   x = Math.floor(Math.random() * Math.floor(canvas.width));
  //   y = Math.floor(Math.random() * Math.floor(canvas.height));
  // } while ((Math.abs(x - gameShip.x) < 50) && (Math.abs(y - gameShip.y) < 50));
  let x = Math.floor(Math.random() * Math.floor(canvas.width/2 - 100));
  let y = Math.floor(Math.random() * Math.floor(canvas.height/2 - 100));
  x = Math.random() > 0.5 ? x : canvas.width - x;
  y = Math.random() > 0.5 ? y : canvas.width - y;
  let angle = Math.floor(Math.random() * Math.floor(360));
  let size = [1, 2, 4][Math.floor(Math.random() * Math.floor(3))];
  let asteroid = new Asteroid(x, y, angle, size);
  return asteroid;
}

function finishGame(){
  clearInterval(gameRender);
}

function shipAsteroidCollision(ship, asteroid){
  let x = ship.getSides()[0].x2;
  let y = ship.getSides()[0].y2;
  // console.log(asteroid.getPath(), x, y);
  return ctx.isPointInPath(asteroid.getPath(), x, y);
}

function bulletAsteroidCollision(bullet, asteroid){
  // console.log(asteroid.getPath(), x, y);
  return ctx.isPointInPath(asteroid.getPath(), bullet.x, bullet.y);
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
  // if (gameShip.keys && gameShip.keys['Space']) {
  //   setTimeout(() => {
  //     gameShip.shot();
  //   }, 200);
  // }

  gameShip.update();
  gameShip.draw(isFire);
  gameShip.bullets.forEach(bullet => {
    bullet.update();
    bullet.draw();
  });
  gameAsteroids.forEach(asteroid => {
    asteroid.update();
    asteroid.draw();
    // if(shipAsteroidCollision(gameShip, asteroid)){
    //   finishGame();
    //   console.log('crash')
    // };
    gameShip.bullets.forEach(bullet => {
      // bullet.update();
      // bullet.draw();
      if(bulletAsteroidCollision(bullet, asteroid)){
        gameScore += asteroidParams[asteroid.size].score;
        score.textContent = gameScore;
        gameAsteroids.splice(gameAsteroids.indexOf(asteroid), 1);
        console.log(gameAsteroids);
        gameShip.bullets.splice(gameShip.bullets.indexOf(bullet), 1);
        let newAsteroid = createAsteroid();
        gameAsteroids.push(newAsteroid);
        newAsteroid.draw();
      }
    });
  });
}
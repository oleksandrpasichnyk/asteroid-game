import { createPath, asteroidPath1, asteroidPath2, asteroidPath3 } from './paths.js';
import { ctx, ASTEROIDS_SPEED, FPS, ASTEROIDS_COUNT, gameAsteroids, gameShip, asteroidParams } from './index.js';
import { getRotatedCoorditates, createRandomAsteroid } from './helpers.js';
import { Sound } from './sounds.js';

const asteroidPaths = [asteroidPath1, asteroidPath2, asteroidPath3];
const shipPath = [{x: 15, y: 15}, {x: 0, y: -30}, {x: -15, y: 15}, {x: 15, y: 15}];

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
      ctx.moveTo(this.x + 15, this.y + 15);
      ctx.lineTo(this.x, this.y - 30);
      ctx.lineTo(this.x - 15, this.y + 15);
      ctx.moveTo(this.x - 10, this.y);
      ctx.lineTo(this.x + 10, this.y);
      if (isFire) {
        this.additionalSpeed = 5;
        ctx.moveTo(this.x - 5, this.y);
        ctx.lineTo(this.x, this.y + 15);
        ctx.lineTo(this.x + 5, this.y);
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
    this.getPath = function () {
      return createPath(this.x, this.y, 1, shipPath);
    };
    this.getCoordinates = function () {
      let сoordinates = [];
      shipPath.forEach(c => {
        сoordinates.push({
          x: getRotatedCoorditates(this.x, this.y, this.x + c.x, this.y + c.y, this.angle).x,
          y: getRotatedCoorditates(this.x, this.y, this.x + c.x, this.y + c.y, this.angle).y
        });
      });
      return сoordinates;
    };
    this.shot = function () {
      let shotCoordinates = getRotatedCoorditates(this.x, this.y, this.x, this.y - 30, this.angle)
      let bullet = new Bullet(shotCoordinates.x, shotCoordinates.y, this.color, this.angle);
      bullet.draw();
      this.bullets.push(bullet);
      (new Sound("../sounds/short-laser-gun-shot.wav")).play()
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
    this.speed = ASTEROIDS_SPEED;
    this.angle = angle;
    this.size = size; // 1, 2 or 4

    this.color = asteroidParams[this.size].color;
    this.borderWidth = asteroidParams[this.size].borderWidth;

    this.asteroidPath = asteroidPaths[Math.floor(Math.random() * Math.floor(3))];
    this.pathIndex = asteroidPaths.indexOf(this.asteroidPath);
    this.draw = function () {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.borderWidth;
      ctx.stroke(this.getPath());
    };

    this.update = function () {
      if (this.x + (15 * this.size) < 0) {
        this.x = canvas.width + this.x + 30*this.size;
      }
      else if (this.x - (15 * this.size) > canvas.width) {
        this.x = this.x - canvas.width - 30*this.size;
      }
      if (this.y + (15 * this.size) < 0) {
        this.y = canvas.height + this.y + 30*this.size;
      } else if (this.y - (15 * this.size) > canvas.height) {
        this.y = this.y - canvas.height - 30*this.size;
      }
      this.x += this.speed * Math.sin(this.angle);
      this.y -= this.speed * Math.cos(this.angle);
    };
    this.getPath = function () {
      return createPath(this.x, this.y, this.size, this.asteroidPath);
    };
    this.getCoordinates = function () {
      let coordinates = [];
      asteroidPaths[this.pathIndex].forEach(c =>{
        coordinates.push({
          x: getRotatedCoorditates(this.x, this.y, this.x + c.x * this.size, this.y + c.x * this.size, this.angle).x,
          y: getRotatedCoorditates(this.x, this.y, this.x + c.y * this.size, this.y + c.y * this.size, this.angle).y
        });
      });
      return coordinates;
    };
    this.double = function(){
      let child1 = new Asteroid(this.x, this.y, this.angle + 0.25, this.size/2);
      let child2 = new Asteroid(this.x, this.y, this.angle - 0.25, this.size/2);
      gameAsteroids.push(child1);
      gameAsteroids.push(child2);
      child1.draw();
      child2.draw();
      gameAsteroids.splice(gameAsteroids.indexOf(this), 1);
    }
    this.destroy = function(){
      if(this.size === 1){
        gameAsteroids.splice(gameAsteroids.indexOf(this), 1);
        if(gameAsteroids.length < ASTEROIDS_COUNT){
          let newAsteroid = createRandomAsteroid();
          gameAsteroids.push(newAsteroid);
          newAsteroid.draw();
        }
      }else{
        this.double();
      }
    }
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
    this.time = 0;
    this.draw = function () {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
      ctx.fill();
    };
    this.update = function () {
      if(this.time > 1000){
        gameShip.bullets.splice(gameShip.bullets.indexOf(this), 1);
      }else {
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
        this.time += 1000/FPS;
      }
    };
  }
}

export { Ship, Asteroid, Bullet }
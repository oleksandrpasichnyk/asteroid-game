import { Asteroid } from './entities.js';
import { ctx, gameShip } from './index.js';

export function getRotatedCoorditates(xc, yc, x1, y1, angle){
  let l = Math.sqrt((xc - x1)**2 + (yc - y1)**2);
  let x2 = xc + (x1 - xc) * Math.cos(angle) - (y1 - yc) * Math.sin(angle);
  let y2 = yc + (x1 - xc) * Math.sin(angle) + (y1 - yc) * Math.cos(angle);
  return { x: x2, y: y2 };
  // return { x: x1 + l*Math.sin(angle), y: y1 + l*(1 - Math.cos(angle)) };
  // return { x: xc + (x1 - xc)*Math.cos(angle) + (y1 - yc)*Math.sin(angle), y: yc - (x1 - xc)*Math.sin(angle) + (y1 - yc)*Math.cos(angle) }
}

export function createRandomAsteroid(){
  let x = Math.floor(Math.random() * Math.floor(canvas.width/2 - 100));
  let y = Math.floor(Math.random() * Math.floor(canvas.height/2 - 100));
  x = Math.random() > 0.5 ? x : canvas.width - x;
  y = Math.random() > 0.5 ? y : canvas.width - y;
  let angle = Math.floor(Math.random() * Math.floor(360));
  let size = [1, 2, 4][Math.floor(Math.random() * Math.floor(3))];
  let asteroid = new Asteroid(x, y, angle, size);
  return asteroid;
}

export function bulletAsteroidCollision(bullet, asteroid){
  return ctx.isPointInPath(asteroid.getPath(), bullet.x, bullet.y);
}

export function shipAsteroidCollision(asteroid){

  for(let i = 0; i < gameShip.getCoordinates().length; i++){
    if(ctx.isPointInPath(asteroid.getPath(), gameShip.getCoordinates()[i].x, gameShip.getCoordinates()[i].y)){
      // ctx.fillStyle = "red";
      // ctx.beginPath();
      // ctx.arc(gameShip.getCoordinates()[i].x, gameShip.getCoordinates()[i].y, 2, 0, 2 * Math.PI);
      // ctx.fill();
      return true;
    }
  }

  let asteroidCoordinates = asteroid.getCoordinates();
  // console.log(gameShip.getCoordinates());
  for(let j = 0; j < asteroidCoordinates.length; j++){
    if(ctx.isPointInPath(gameShip.getPath(), asteroidCoordinates[j].x, asteroidCoordinates[j].y)){
      // console.log(asteroidCoordinates, gameShip.getCoordinates(), asteroidCoordinates[j].x, asteroidCoordinates[j].y);
      // ctx.fillStyle = "red";
      // ctx.beginPath();
      // ctx.arc(asteroidCoordinates[j].x, asteroidCoordinates[j].y, 4, 0, 2 * Math.PI);
      // ctx.fill();
      // ctx.fillStyle = "green";
      // for(let k = 0; k < asteroidCoordinates.length; k++){
      //   ctx.beginPath();
      //   ctx.arc(asteroidCoordinates[k].x, asteroidCoordinates[k].y, 2, 0, 2 * Math.PI);
      //   ctx.fill();
      // }
      // ctx.fillStyle = "yellow";
      // for(let k = 0; k < gameShip.getCoordinates().length; k++){
      //   ctx.beginPath();
      //   ctx.arc(gameShip.getCoordinates()[k].x, gameShip.getCoordinates()[k].y, 2, 0, 2 * Math.PI);
      //   ctx.fill();
      // }
      return true;
    }
  }

  return false;
}
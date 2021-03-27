import { Asteroid } from './entities.js';
import { ctx, gameShip } from './index.js';

export function getRotatedCoorditates(xc, yc, x1, y1, angle){
  let l = Math.sqrt((xc - x1)**2 + (yc - y1)**2);
  let x2 = xc + (x1 - xc) * Math.cos(angle) - (y1 - yc) * Math.sin(angle);
  let y2 = yc + (x1 - xc) * Math.sin(angle) + (y1 - yc) * Math.cos(angle);
  return { x: x2, y: y2 };
}

export function createRandomAsteroid(){
  let x = Math.floor(Math.random() * Math.floor(canvas.width/2 - 100));
  let y = Math.floor(Math.random() * Math.floor(canvas.height/2 - 100));
  x = Math.random() > 0.5 ? x : canvas.width - x;
  y = Math.random() > 0.5 ? y : canvas.height - y;
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
      showDots(gameShip.getCoordinates()[i].x, gameShip.getCoordinates()[i].y, asteroid);
      return true;
    }
  }

  for(let j = 0; j < asteroid.getCoordinates().length; j++){
    if(ctx.isPointInPath(gameShip.getPath(), asteroid.getCoordinates()[j].x, asteroid.getCoordinates()[j].y)){
      showDots(asteroid.getCoordinates()[j].x, asteroid.getCoordinates()[j].y, asteroid);
      ctx.strokeStyle = 'blue';
      ctx.stroke(gameShip.getPath());
      return true;
    }
  }
  return false;
}

function showDots(x, y, asteroid){
  ctx.fillStyle = "green";
  for(let k = 0; k < asteroid.getCoordinates().length; k++){
    ctx.beginPath();
    ctx.arc(asteroid.getCoordinates()[k].x, asteroid.getCoordinates()[k].y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.fillStyle = "yellow";
  for(let k = 0; k < gameShip.getCoordinates().length; k++){
    ctx.beginPath();
    ctx.arc(gameShip.getCoordinates()[k].x, gameShip.getCoordinates()[k].y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, 2 * Math.PI);
  ctx.fill();
}
const asteroidPath1 = [{ x: 5, y: 0}, { x: 15, y: -5}, { x: 0, y: -15}, { x: -10, y: -10}, { x: -5, y: -5}, { x: -15, y: -7}, { x: -15, y: 3}, { x: -5, y: 15}, { x: 5, y: 10}, { x: 10, y: 15}, { x: 18, y: 5}, { x: 5, y: 0}];
const asteroidPath2 = [{ x: 0, y: 0}, { x: -5, y: 15}, { x: 3, y: 15}, { x: 15, y: 3}, { x: 15, y: -3}, { x: 7, y: -15}, { x: -7, y: -15}, { x: -10, y: -5}, { x: -7, y: 0}, { x: -15, y: 0}, { x: -10, y: 15}, { x: 0, y: 0}];
const asteroidPath3 = [{ x: 6, y: 0}, { x: 15, y: -5}, { x: 8, y: -12}, { x: 3, y: -10}, { x: -3, y: -15}, { x: -12, y: -7}, { x: -8, y: 3}, { x: -15, y: 5}, { x: -10, y: 12}, { x: -5, y: 9}, { x: 5, y: 15}, { x: 12, y: 5}, { x: 6, y: 0}];

// const shipPath = [{ x: 15, y: 15}, { x: 0, y: -30}, { x: 8, y: -12}, { x: 3, y: -10}, { x: -3, y: -15}, { x: -12, y: -7}, { x: -8, y: 3}, { x: -15, y: 5}, { x: -10, y: 12}, { x: -5, y: 9}, { x: 5, y: 15}, { x: 12, y: 5}, { x: 6, y: 0}];
// const shipPathWithFire = [{ x: 6, y: 0}, { x: 15, y: -5}, { x: 8, y: -12}, { x: 3, y: -10}, { x: -3, y: -15}, { x: -12, y: -7}, { x: -8, y: 3}, { x: -15, y: 5}, { x: -10, y: 12}, { x: -5, y: 9}, { x: 5, y: 15}, { x: 12, y: 5}, { x: 6, y: 0}];


let createPath = function(x, y, size = 1, coordinates) {
  let path = new Path2D();
  path.moveTo(x + coordinates[0].x * size, y + coordinates[0].y * size);
  for(let i = 1; i < coordinates.length; i++){
    path.lineTo(x + coordinates[i].x * size, y + coordinates[i].y * size);
  }
  return path;
}

export { createPath, asteroidPath1, asteroidPath2, asteroidPath3 };
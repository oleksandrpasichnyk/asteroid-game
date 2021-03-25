let getPath1 = function(x, y, size) {
  let path1 = new Path2D();
  path1.moveTo(x + 5 * size, y );
  path1.lineTo(x + 15 * size, y - 5 * size);
  path1.lineTo(x, y - 15 * size);
  path1.lineTo(x - 10 * size, y - 10 * size);
  path1.lineTo(x - 5 * size, y - 5 * size);
  path1.lineTo(x - 15 * size, y - 7 * size);
  path1.lineTo(x - 15 * size, y + 3 * size);
  path1.lineTo(x - 5 * size, y + 15 * size);
  path1.lineTo(x + 5 * size, y + 10 * size);
  path1.lineTo(x + 10 * size, y + 15 * size);
  path1.lineTo(x + 18 * size, y + 5 * size);
  path1.lineTo(x + 5 * size, y);

  return path1;
}

let getPath2 = function(x, y, size) {
  let path2 = new Path2D();
  path2.moveTo(x, y);
  path2.lineTo(x - 5 * size, y + 15 * size);
  path2.lineTo(x + 3 * size, y + 15 * size);
  path2.lineTo(x + 15 * size, y + 3 * size);
  path2.lineTo(x + 15 * size, y - 3 * size);
  path2.lineTo(x + 7 * size, y - 15 * size);
  path2.lineTo(x - 7 * size, y - 15 * size);
  path2.lineTo(x - 10 * size, y - 5 * size);
  path2.lineTo(x - 7 * size, y);
  path2.lineTo(x - 15 * size, y);
  path2.lineTo(x - 10 * size, y + 15 * size);
  path2.lineTo(x, y );

  return path2;
}

let getPath3 = function(x, y, size) {
  let path3 = new Path2D();
  path3.moveTo(x + 6 * size, y);
  path3.lineTo(x + 15 * size, y - 5 * size);
  path3.lineTo(x + 8 * size, y - 12 * size);
  path3.lineTo(x + 3 * size, y - 10 * size);
  path3.lineTo(x - 3 * size, y - 15 * size);
  path3.lineTo(x - 12 * size, y - 7 * size);
  path3.lineTo(x - 8 * size, y + 3 * size);
  path3.lineTo(x - 15 * size, y + 5 * size);
  path3.lineTo(x - 10 * size, y + 12 * size);
  path3.lineTo(x - 5 * size, y + 9 * size);
  path3.lineTo(x + 5 * size, y + 15 * size);
  path3.lineTo(x + 12 * size, y + 5 * size);
  path3.lineTo(x + 6 * size, y);

  return path3;
}

export { getPath1, getPath2, getPath3 };
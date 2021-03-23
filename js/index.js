let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

function Ship(width, height, color, x, y){
  this.color = color;
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.speed = 0;
  this.angle = 0;
  this.moveAngle = 0;
 
  this.gravitySpeed = 2;
  this.bounce = 0.7;

  this.draw = function(isFire){
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.translate(-this.x, -this.y);
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    if(isFire) {
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x+10, this.y);
      ctx.lineTo(this.x+15, this.y+15);
      ctx.lineTo(this.x, this.y-30);
      ctx.lineTo(this.x-15, this.y+15);
      ctx.lineTo(this.x-10, this.y);
      ctx.lineTo(this.x-5, this.y);
      ctx.lineTo(this.x, this.y+15);
      ctx.lineTo(this.x+5, this.y);
      ctx.lineTo(this.x-5, this.y);
      ctx.lineTo(this.x, this.y);
      ctx.moveTo(this.x, this.y);
    }else {
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x+10, this.y);
      ctx.lineTo(this.x+15, this.y+15);
      ctx.lineTo(this.x, this.y-30);
      ctx.lineTo(this.x-15, this.y+15);
      ctx.lineTo(this.x-10, this.y);
      ctx.lineTo(this.x, this.y);
      ctx.moveTo(this.x, this.y);
    }
    ctx.stroke();
    ctx.restore();
  }
  this.update = function() {
    if (this.x < 0) { this.x = canvas.width - this.x; }
    else if (this.x > canvas.width) { this.x = this.x - canvas.width; }
    if (this.y < 0) { this.y = canvas.height - this.y; }
    else if (this.y > canvas.height) { this.y = this.y - canvas.height; }
    if(this.speed === 0) {
      this.speed = this.gravitySpeed * this.bounce;
    }
    this.angle += this.moveAngle * Math.PI / 180;
    this.x += (this.speed) * Math.sin(this.angle);
    this.y -= (this.speed) * Math.cos(this.angle);
    this.hitBottom();
  }
  this.hitBottom = function() {
    
    // var rockbottom = canvas.height - this.height;
    // if (this.y > rockbottom) {
    //     this.y = rockbottom;
    //     this.gravitySpeed = -(this.gravitySpeed * this.bounce);
    // }
}
  this.clear = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function init(){
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  gameShip = new Ship(30, 30, "#fff", canvas.width/2, canvas.height/2);

  gameShip.draw();

  setInterval(updateGameArea, 20);

  window.addEventListener('keydown', function (e) {
    gameShip.keys = (gameShip.keys || []);
    gameShip.keys[e.code] = (e.type == "keydown");
  })
  window.addEventListener('keyup', function (e) {
    gameShip.keys[e.code] = (e.type == "keydown");
  })
}

init();

function updateGameArea() {

  let isFire = false;
  gameShip.clear();
  gameShip.speed = 0;
  gameShip.moveAngle = 0;

  if(gameShip.keys && gameShip.keys['ArrowUp']){ gameShip.speed = 5; isFire = true; }
  if(gameShip.keys && gameShip.keys['ArrowDown']){ gameShip.speed = -5; }
  if(gameShip.keys && gameShip.keys['ArrowLeft']){ gameShip.moveAngle = -Math.PI * 1.1; }
  if(gameShip.keys && gameShip.keys['ArrowRight']){ gameShip.moveAngle =  Math.PI * 1.1; }

  gameShip.update();
  gameShip.draw(isFire);
}

// window.addEventListener('keydown', (event) => {
//   updateGameArea(event)
// });
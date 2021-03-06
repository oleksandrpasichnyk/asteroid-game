export class Sound {
  constructor(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
      this.sound.play();
    };
    this.stop = function () {
      this.sound.pause();
    };
  }
}

export class Sounds {
  constructor(){
    this.backgroundInterval = null;
    this.boostInterval = null;

    this.fire = function() {
      (new Sound("sounds/fire.wav")).play();
    }
    this.destroy = function(size) {
      switch (size) {
        case 1:
          (new Sound("sounds/bangSmall.wav")).play();
          break;
        case 2:
          (new Sound("sounds/bangMedium.wav")).play();
          break;
        case 4:
          (new Sound("sounds/bangLarge.wav")).play();
          break;
        default: break;
      }
    }
    this.break = function() {
      (new Sound("sounds/bangMedium.wav")).play();
    }
    this.gameOver = function() {
      (new Sound("sounds/gameOver.wav")).play();
    }
    this.playBoost = function() {
      this.boostInterval = setInterval(() => {
        (new Sound("sounds/thrust.wav")).play();
      }, 250);
    }
    this.stopBoost = function() {
      clearInterval(this.boostInterval);
    }
    this.playBackground = function() {
      let s = true;
      this.backgroundInterval = setInterval(() => {
        (new Sound(`sounds/beat${s ? 1 : 2}.wav`)).play();
        s = !s;
      }, 1000);
    }
    this.stopBackground = function() {
      clearInterval(this.backgroundInterval);
    }
  }
}

export const GameSounds = new Sounds();

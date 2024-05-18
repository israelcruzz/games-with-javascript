"use strict";

class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Game {
  constructor(difficulty) {
    this.difficulty = difficulty;
    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.pointAudio = new Audio("../assets/audio/audio.mp3");
    this.canvasWidth = 600;
    this.canvasHeight = 600;
    this.size = 30;
    this.initialPosition = new Position(270, 240);
    this.snake = [this.initialPosition];
    this.direction = null;
    this.gameLoop = null;
    this.food = null;
    this.foodColor = null;
    this.defaultValuePoints = 10;
    this.scorePointText = document.querySelector(".score__value");
    this.menuGameOver = document.querySelector(".menu-screen");
    this.scoreTextMenuGameOver = document.querySelector(".score_game_over");
    this.restartButtonGame = document.querySelector(".btn-play");

    this.setDifficulty();
    this.initializeCanvasSize();
    this.eventMovementSnake();
    this.gameStart();
    this.restartGameEvent();
  }

  setDifficulty() {
    switch (this.difficulty) {
      case "easy":
        this.difficulty = 5000;
        break;
      case "normal":
        this.difficulty = 3000;
        break;
      case "hard":
        this.difficulty = 1000;
        break;
    }
  }

  initializeCanvasSize() {
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
  }

  drawnSnake() {
    this.ctx.fillStyle = "gray";

    this.snake.forEach((positionSnake, index) => {
      if (index == this.snake.length - 1) {
        this.ctx.fillStyle = "white";
      }

      this.ctx.fillRect(positionSnake.x, positionSnake.y, this.size, this.size);
    });
  }

  eventMovementSnake() {
    document.addEventListener("keydown", ({ key }) => {
      if (key == "ArrowUp" || key == "w") {
        this.direction = "up";
      }
      if (key == "ArrowLeft" || key == "a") {
        this.direction = "left";
      }
      if (key == "ArrowDown" || key == "s") {
        this.direction = "down";
      }
      if (key == "ArrowRight" || key == "d") {
        this.direction = "right";
      }
    });
  }

  movementSnake() {
    if (!this.direction) return;

    const headSnake = this.snake[this.snake.length - 1];
    let newHead;

    switch (this.direction) {
      case "up":
        newHead = new Position(headSnake.x, headSnake.y - this.size);
        break;
      case "down":
        newHead = new Position(headSnake.x, headSnake.y + this.size);
        break;
      case "left":
        newHead = new Position(headSnake.x - this.size, headSnake.y);
        break;
      case "right":
        newHead = new Position(headSnake.x + this.size, headSnake.y);
        break;
    }

    this.snake.push(newHead);
    this.snake.shift();
  }

  randomIndex(array, length) {
    const randomIndexNumber = Math.floor(Math.random() * length);

    return array[randomIndexNumber];
  }

  randomColorFood() {
    const colorsArray = [
      "#FF5733",
      "#33FF57",
      "#3357FF",
      "#FF33A6",
      "#A633FF",
      "#33FFF2",
      "#FF9633",
      "#33FF96",
      "#9633FF",
      "#FF3396",
      "#FF3333",
      "#33FF33",
      "#3333FF",
      "#FFFF33",
      "#FF33FF",
      "#33FFFF",
      "#FF6633",
      "#3366FF",
      "#66FF33",
      "#FF3366",
    ];

    return this.randomIndex(colorsArray, colorsArray.length - 1);
  }

  generateMultiplesOfThree() {
    const numbers = [];
    for (let i = 0; i < this.canvasWidth - this.size; i += 30) {
      numbers.push(i);
    }

    return this.randomIndex(numbers, numbers.length - 1);
  }

  drawnFood() {
    if (!this.food) {
      this.food = new Position(
        this.generateMultiplesOfThree(),
        this.generateMultiplesOfThree()
      );

      this.foodColor = this.randomColorFood();
    }

    this.ctx.fillStyle = this.foodColor;

    this.ctx.fillRect(this.food.x, this.food.y, this.size, this.size);
  }

  incrementPoints() {
    this.scorePointText.innerHTML =
      parseInt(this.scorePointText.innerHTML) + this.defaultValuePoints;
  }

  checkFoodCollision() {
    const head = this.snake[this.snake.length - 1];

    if (head.x == this.food.x && head.y == this.food.y) {
      this.incrementPoints();
      this.food = null;
      this.snake.push(head);
      this.pointAudio.play();
    }
  }

  checkLandscapeCollision() {
    const head = this.snake[this.snake.length - 1];
    const neckIndex = this.snake.length - 2;

    const conditionForVerifyCollisionInX =
      head.x < 0 || head.x > this.canvasWidth;

    const conditionForVerifyCollisionInY =
      head.y < 0 || head.y > this.canvasWidth;

    const conditionForVerifyCollisionSnake = this.snake.find(
      (position, index) =>
        index < neckIndex && position.x == head.x && position.y == head.y
    );

    if (
      conditionForVerifyCollisionInX ||
      conditionForVerifyCollisionInY ||
      conditionForVerifyCollisionSnake
    ) {
      this.gameOver();
    }
  }

  gameOver() {
    this.direction = null;
    this.menuGameOver.style.display = "flex";
    this.canvas.style.filter = "blur(2px)";
    this.scoreTextMenuGameOver.innerHTML = this.scorePointText.textContent;
  }

  restartGameEvent() {
    this.restartButtonGame.addEventListener("click", () => {
      this.menuGameOver.style.display = "none";
      this.canvas.style.filter = "blur(0px)";
      this.scorePointText.textContent = 0;
      this.snake = [this.initialPosition];
    });
  }

  gameStart() {
    this.gameLoop = setInterval(() => {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      this.drawnSnake();
      this.movementSnake();
      this.drawnFood();
      this.checkFoodCollision();
      this.checkLandscapeCollision();
    }, 300);

    setInterval(() => {
      this.food = null;
    }, this.difficulty);
  }
}

window.onload = () => {
  const initMenu = document.querySelector(".initial-menu");
  const nickname = document.querySelector("#nickname");
  const difficulty = document.querySelector(".difficulty-game");
  const initGameBtn = document.querySelector(".init_game");
  const canvas = document.querySelector("canvas");
  const nicknameText = document.querySelector(".nickname_player");
  const errorsText = document.querySelector(".error_text");

  initGameBtn.addEventListener("click", () => {
    if (!nickname.value || !difficulty.value) {
      errorsText.style.display = "block";
      return;
    }

    nicknameText.textContent = nickname.value;

    initMenu.style.display = "none";
    canvas.style.display = "flex";

    new Game(difficulty.value);
  });
};

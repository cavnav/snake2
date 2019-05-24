/*
 игровое поле.
 змейка.
 пища.
 очки.
 
 перемещение змейки по полю.
 столкновение змейки со стенками.
 столкновение змейки со своим телом.
 поедание пищи.
 рост змейки.
 начисление очков.
 конец игры.
 
  
 
 
 */
(() => {
  gameField = {
    width: 400,
    height: 400
  };

  class Snake {
    head = {
      x: 100,
      y: 100
    };
    length = 3;
    segment = 10; // 10x10
  }

  class Painter {
    constructor(id) {
      this.canvasElement = document.getElementById(id);
      this.canvasContext = this.canvasElement.getContext('2d');
      this.canvasElement.width = gameField.width;
      this.canvasElement.height = gameField.height;
    }
  }

  class Game {
    snake = new Snake();
    painter = new Painter('gameField').canvasContext;

    constructor(gameFieldElement) {
      const canvasElement = document.getElementById('gameField');
      const snake = this.snake;
      snake.head = this.getRandomPlaceSnake();
      snake.move = this.getRandomSnakeMove();
      this.painter.fillRect(
        snake.head.x,
        snake.head.y,
        snake.segment,
        snake.segment
      );

      document.addEventListener(this.onkeydown);

      setTimeout(this.timer);
    }

    getRandomSnakeMove() {
      const values = [-1, 1];
      const coords = ['x', 'y'];
      const randomIndex = Math.floor(Math.random() * 2);
      return {
        ...{ x: 0, y: 0 },
        [coords[randomIndex]]: values[randomIndex]
      };
    }

    timer = () => {
      this.painter.fillRect(
        snake.head.x,
        snake.head.y,
        snake.segment,
        snake.segment
      );

      setTimeout(timer, 1000 / 15);
    };

    onKeydown = ({ keyCode }) => {
      switch (keyCode) {
        case 37:
          snake.move = { x: -1, y: 0 };
          break;
        case 38:
          snake.move = { x: 0, y: -1 };
          break;
        case 39:
          snake.move = { x: 1, y: 0 };
          break;
        case 40:
          snake.move = { x: 0, y: 1 };
          break;
      }
    };

    getRandomPlaceSnake() {
      return {
        x: Math.floor(Math.random() * gameField.width),
        y: Math.floor(Math.random() * gameField.height)
      };
    }
  }

  new Game();
})();

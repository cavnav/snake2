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

  class Food {
    coords = {};
    width = 10;
    height = 10;
  }

  class Snake {
    head = {
      x: 100,
      y: 100
    };
    length = 3;
    segment = 10; // 10x10
    move = {};
    body = [];
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
    food = new Food();
    painter = new Painter('gameField').canvasContext;

    constructor(gameFieldElement) {
      const canvasElement = document.getElementById('gameField');
      const snake = this.snake;
      snake.head = this.getRandomPlace();
      snake.move = this.getRandomSnakeMove();

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

    snakeMove() {
      const { head, move, segment, body, length } = this.snake;
      const { x: foodX, y: foodY } = this.food;
      const painter = this.painter;

      head.x += move.x;
      head.y += move.y;

      body.push(head);

      painter.fillStyle = 'lime';
      if (body.length > length) {
        body.shift().map(part => {
          painter.fillRect(part.x, part.y, segment - 2, segment - 2);
        });
      }

      if (head.x === foodX && head.y === foodY) {
        this.food.coords = this.getRandomPlace();
      }
    }

    timer = () => {
      const painter = this.painter;
      const { width, height } = gameField;

      painter.fillStyle = 'black';
      painter.fillRect(0, 0, width, height);

      this.paintFood();
      this.snakeMove();

      setTimeout(timer, 1000 / 15);
    };

    paintFood() {
      const {
        coords: { x, y },
        width,
        height
      } = this.food;
      painter.fillStyle = 'red';
      painter.fillRect(x, y, width, height);
    }

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

    getRandomPlace() {
      return {
        x: Math.floor(Math.random() * gameField.width),
        y: Math.floor(Math.random() * gameField.height)
      };
    }
  }

  new Game();
})();

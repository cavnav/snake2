(() => {
  class Food {
    coords = {};
  }

  class Snake {
    headXY = {};
    length = 3;
    move = {};
    body = [];
  }

  class Painter {
    constructor(id, field) {
      this.canvasElement = document.getElementById(id);
      this.canvasContext = this.canvasElement.getContext('2d');
      this.canvasElement.width = field.width;
      this.canvasElement.height = field.height;
    }
  }

  class Game {
    field = {
      width: 400,
      height: 400,
      segment: 20,
      segmentGap: 18
    };
    speed = 1000 / 15;
    snake = new Snake();
    food = new Food();
    painter = new Painter('gameField', this.field).canvasContext;

    constructor(gameFieldElement) {
      const canvasElement = document.getElementById('gameField');
      const snake = this.snake;
      const food = this.food;

      snake.headXY = this.getRandomPlace();
      food.coords = this.getRandomPlace();
      snake.move = this.getRandomSnakeMove();

      document.addEventListener('keydown', this.onKeydown);

      setTimeout(this.timer);
    }

    getRandomSnakeMove() {
      const values = [-1, 1];
      const coords = ['x', 'y'];
      const randomIndex = Math.floor(Math.random() * 2);
      const randomCoord = Math.floor(Math.random() * 2);
      return {
        ...{ x: 0, y: 0 },
        [coords[randomCoord]]: values[randomIndex]
      };
    }

    snakeMove() {
      const snake = this.snake;
      const { headXY, move, length } = snake;
      const {
        coords: { x: foodX, y: foodY }
      } = this.food;
      const painter = this.painter;
      const { segment, segmentGap } = this.field;

      headXY.x += move.x;
      headXY.y += move.y;

      snake.body.push({ ...headXY });

      painter.fillStyle = 'lime';
      if (snake.body.length > length) {
        snake.body = snake.body.slice(1);
      }

      snake.body.map(part => {
        painter.fillRect(
          part.x * segment,
          part.y * segment,
          segmentGap,
          segmentGap
        );
      });

      if (headXY.x === foodX && headXY.y === foodY) {
        this.snake.length++;
        this.food.coords = this.getRandomPlace();
      }
    }

    timer = () => {
      const painter = this.painter;
      const { width, height } = this.field;

      painter.fillStyle = 'black';
      painter.fillRect(0, 0, width, height);

      this.paintFood();
      this.snakeMove();

      setTimeout(this.timer, this.speed);
    };

    paintFood() {
      const {
        coords: { x, y }
      } = this.food;
      const { segment, segmentGap } = this.field;
      this.painter.fillStyle = 'red';
      this.painter.fillRect(x * segment, y * segment, segmentGap, segmentGap);
    }

    onKeydown = ({ keyCode }) => {
      const snake = this.snake;

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
      const { segment } = this.field;
      return {
        x: Math.floor(Math.random() * segment),
        y: Math.floor(Math.random() * segment)
      };
    }
  }

  new Game();
})();

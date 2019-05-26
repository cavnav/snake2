(() => {
  class Food {
    coords = {};
    props;

    constructor(props) {
      this.props = props;
      this.coords = this.props.getRandomPlace();
    }

    paint() {
      const { x, y } = this.coords;
      const { segment, segmentGap, painter } = this.props;
      painter.fillStyle = 'red';
      painter.fillRect(x * segment, y * segment, segmentGap, segmentGap);
    }

    paintNext() {
      this.coords = this.props.getRandomPlace();
      this.paint();
    }
  }

  class Snake {
    headXY = {};
    length = 3;
    move = {};
    body = [];
    isGrowUp = false;
    props;

    constructor(props) {
      this.props = props;

      this.headXY = this.props.getRandomPlace();
      this.move = this.getRandomMove();
    }

    getRandomMove() {
      const values = [-1, 1];
      const coords = ['x', 'y'];
      const randomIndex = Math.floor(Math.random() * 2);
      const randomCoord = Math.floor(Math.random() * 2);
      return {
        ...{ x: 0, y: 0 },
        [coords[randomCoord]]: values[randomIndex]
      };
    }

    paint() {
      const {
        food: {
          coords: { x: foodX, y: foodY }
        },
        painter,
        field: { segment, segmentGap }
      } = this.props;

      const fillRect = painter.fillRect.bind(painter);

      this.headXY.x += this.move.x;
      this.headXY.y += this.move.y;

      this.headXY = this.ifWentAbroadScreen();

      this.body.push({ ...this.headXY });

      painter.fillStyle = 'lime';
      if (this.body.length > this.length) {
        this.body = this.body.slice(1);
      }

      this.body.map(part => {
        fillRect(part.x * segment, part.y * segment, segmentGap, segmentGap);
      });

      this.isGrowUp = false;
      if (this.headXY.x === foodX && this.headXY.y === foodY) {
        this.length++;
        this.isGrowUp = true;
      }
    }

    ifWentAbroadScreen() {
      let { x: newX, y: newY } = this.headXY;
      const { width, height, segment } = this.props.field;
      const lastSegmentsX = width / segment - 1;
      const lastSegmentsY = height / segment - 1;

      if (newX > lastSegmentsX) {
        newX = 0;
      }
      if (newX < 0) {
        newX = lastSegmentsX;
      }
      if (newY > lastSegmentsY) {
        newY = 0;
      }
      if (newY < 0) {
        newY = lastSegmentsY;
      }

      return {
        x: newX,
        y: newY
      };
    }
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
    painter = new Painter('gameField', this.field).canvasContext;
    food = new Food({
      segment: this.field.segment,
      segmentGap: this.field.segmentGap,
      painter: this.painter,
      getRandomPlace: this.getRandomPlace.bind(this)
    });
    snake = new Snake({
      painter: this.painter,
      field: this.field,
      food: this.food,
      getRandomPlace: this.getRandomPlace.bind(this)
    });

    constructor(gameFieldElement) {
      const canvasElement = document.getElementById('gameField');

      document.addEventListener('keydown', this.onKeydown);

      setTimeout(this.timer);
    }

    timer = () => {
      const painter = this.painter;
      const { width, height } = this.field;

      painter.fillStyle = 'black';
      painter.fillRect(0, 0, width, height);

      this.food.paint();
      this.snake.paint();
      if (this.snake.isGrowUp) {
        this.food.paintNext();
      }

      setTimeout(this.timer, this.speed);
    };

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

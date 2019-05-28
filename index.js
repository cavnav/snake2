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
    // const.
    startLength = 3;
    props;

    headXY = {};
    length;
    move = {};
    body = [];
    isGrowUp = false;

    constructor(props) {
      this.props = props;

      this.headXY = this.props.getRandomPlace();
      this.move = this.getRandomMove();
      this.length = this.props.length || this.startLength;

      document.addEventListener('keydown', this.moveTo);
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

    moveTo = ({ keyCode }) => {
      switch (keyCode) {
        case 37:
          this.move = { x: -1, y: 0 };
          break;
        case 38:
          this.move = { x: 0, y: -1 };
          break;
        case 39:
          this.move = { x: 1, y: 0 };
          break;
        case 40:
          this.move = { x: 0, y: 1 };
          break;
      }
    };

    paintCore(body) {
      const {
        painter,
        field: { segment, segmentGap }
      } = this.props;

      const fillRect = painter.fillRect.bind(painter);

      painter.fillStyle = 'lime';
      body.map(part => {
        fillRect(part.x * segment, part.y * segment, segmentGap, segmentGap);
      });
    }

    paint() {
      this.headXY.x += this.move.x;
      this.headXY.y += this.move.y;
      this.headXY = this.ifWentAbroadScreen();

      this.length = this.ifCollisionYourself(this.headXY);
      const newLength = this.ifAteFood(this.headXY);
      this.isGrowUp = newLength > this.length;
      this.length = newLength;

      this.body.push({ ...this.headXY });
      this.body = this.body.slice(-this.length);

      this.paintCore(this.body);
    }

    ifAteFood({ x, y }) {
      const { x: foodX, y: foodY } = this.props.food.coords;
      return x === foodX && y === foodY ? this.length + 1 : this.length;
    }

    ifCollisionYourself({ x, y }) {
      return this.body.find(part => part.x === x && part.y === y)
        ? this.startLength
        : this.length;
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
    painter;
    food;
    snake;

    constructor(targetElement) {
      this.painter = new Painter(targetElement, this.field).canvasContext;
      this.food = new Food({
        segment: this.field.segment,
        segmentGap: this.field.segmentGap,
        painter: this.painter,
        getRandomPlace: this.getRandomPlace.bind(this)
      });
      this.snake = new Snake({
        painter: this.painter,
        field: this.field,
        food: this.food,
        getRandomPlace: this.getRandomPlace.bind(this)
      });

      setTimeout(this.timer);
    }

    timer = () => {
      const painter = this.painter;
      const { width, height } = this.field;

      // clear all.
      painter.fillStyle = 'black';
      painter.fillRect(0, 0, width, height);

      this.food.paint();
      this.snake.paint();
      if (this.snake.isGrowUp) {
        this.food.paintNext();
      }

      setTimeout(this.timer, this.speed);
    };

    getRandomPlace() {
      const { segment } = this.field;
      return {
        x: Math.floor(Math.random() * segment),
        y: Math.floor(Math.random() * segment)
      };
    }
  }

  window.onload = () => {
    new Game('gameField');
  };
})();

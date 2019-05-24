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
	}
	 
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
			const snakeBornXY = this.randomPlaceSnake();
			this.painter.fillRect(snakeBornXY.x, snakeBornXY.y, snake.segment, snake.segment);

			document.addEventListener(this.onkeydown);
		}
		
		onKeydown = ({keyCode}) => {

		}

		randomPlaceSnake() {
			return {
				x: Math.floor(Math.random() * gameField.width),
				y: Math.floor(Math.random() * gameField.height)
			}
		}
	}

	new Game();

})();
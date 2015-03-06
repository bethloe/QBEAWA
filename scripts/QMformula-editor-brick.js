var QMBrick = function (vals) {
	var xPos = vals.x;
	var yPos = vals.y;
	var ctx = vals.ctx;
	var type = vals.type; //Defines if it's a menu item or a moveable brick
	var controller = vals.controller;
	var width = 150;
	var height = 120;
	var description = vals.description;
	var input;
	if (vals.hasOwnProperty("input")) {
		input = vals.input;
		input.onsubmit(function () {
			newResultName();
		});
	}
	var weight = vals.weight;
	var upDownButtonHeight = 20;
	var drawBoder = false;
	var isOverUpButton = false;
	var isOverDownButton = false;
	var colorFont = "white";
	var colorBackground = "white";

	var qmBrick = {};

	//Private:
	var drawBrick = function () {

		ctx.globalAlpha = weight;

		var gradient = ctx.createLinearGradient(xPos, yPos, width, height);
		gradient.addColorStop("0", "white");
		gradient.addColorStop("1.0", "green");
		ctx.fillStyle = colorBackground;
		ctx.fillRect(xPos, yPos, width, height);

		//Create Buttons up down

		//WHITE BACKGROUND
		if (type != 'result') {
			ctx.globalAlpha = 1;
			ctx.fillStyle = "white";
			ctx.fillRect(xPos, yPos + height - upDownButtonHeight, width, upDownButtonHeight);
			ctx.fillRect(xPos, yPos, width, upDownButtonHeight);
			//-------------------------------
			ctx.globalAlpha = 0.5;
			ctx.fillStyle = "blue";

			if (isOverUpButton) {
				ctx.globalAlpha = 0.1;
			}
			ctx.fillRect(xPos, yPos, width, upDownButtonHeight);
			ctx.globalAlpha = 0.5;
			if (isOverDownButton)
				ctx.globalAlpha = 0.1;
			ctx.fillRect(xPos, yPos + height - upDownButtonHeight, width, upDownButtonHeight);
			ctx.globalAlpha = 0.5;

			//Create arrows for buttons

			ctx.beginPath();
			drawUpArrow(xPos + width / 2, yPos + 6);
			drawDownArrow(xPos + width / 2, yPos +
				height - 5);

			ctx.stroke();
		}
		if (drawBoder) {
			ctx.globalAlpha = 0.8;
			ctx.strokeStyle = "white";
			ctx.lineWidth = 2;
			ctx.strokeRect(xPos, yPos, width - 2, height - 2);
		}

		ctx.font = "30px Times New Roman";
		ctx.fillStyle = colorFont;
		ctx.fillText(description, xPos + 40, yPos + height - 50);
		if (input != undefined) {
			input.render();
		}
	}

	var drawDownArrow = function (fromx, fromy) {

		ctx.moveTo(fromx, fromy);
		ctx.lineTo(fromx - 10, fromy - 10);

		ctx.moveTo(fromx, fromy);
		ctx.lineTo(fromx + 10, fromy - 10);
	}

	var drawUpArrow = function (fromx, fromy) {
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(fromx - 10, fromy + 10);

		ctx.moveTo(fromx, fromy);
		ctx.lineTo(fromx + 10, fromy + 10);
	}

	var newResultName = function () {
		console.log("New result name " + input.value());
		description = input.value();
		//IT'S UGLY I KNOW
		input.x(-1000);
		input.y(-1000);
		input = null;
		controller.draw();
	}

	//Public:
	qmBrick.hit = function (xHit, yHit) {
		if (xHit >= xPos && xHit <= xPos + width && yHit >= yPos && yHit <= yPos + height) {
			return (true);
		}
		return (false);
	}

	qmBrick.hitDownButton = function (xHit, yHit) {
		if (xHit >= xPos && xHit <= xPos + width && yHit >= yPos + height - upDownButtonHeight && yHit <= yPos + height) {
			return (true);
		}
		return (false);
	}

	qmBrick.hitUpButton = function (xHit, yHit) {
		if (xHit >= xPos && xHit <= xPos + width && yHit >= yPos && yHit <= yPos + upDownButtonHeight) {
			return (true);
		}
		return (false);
	}

	qmBrick.setOverUpButton = function (overUpButton) {
		isOverUpButton = overUpButton;
	}

	qmBrick.setOverDownButton = function (overDownButton) {
		isOverDownButton = overDownButton;
	}

	qmBrick.getOverUpButton = function () {
		return isOverUpButton;
	}

	qmBrick.getOverDownButton = function () {
		return isOverDownButton;
	}

	qmBrick.getHeight = function () {
		return height;
	}

	qmBrick.getWidth = function () {
		return width;
	}

	qmBrick.getX = function () {
		return xPos;
	}

	qmBrick.getY = function () {
		return yPos;
	}

	qmBrick.getBorder = function () {
		return drawBoder;
	}

	qmBrick.setBorder = function (border /*boolean*/
	) {
		drawBoder = border;
	}

	qmBrick.getType = function () {
		return type;
	}

	qmBrick.setPos = function (x, y) {
		if (type != 'menu') {
			xPos = x;
			yPos = y;
			if (input != undefined) {
				input.x(x);
				input.y(y + 40);
			}
		}
	}

	qmBrick.setSize = function (w, h) {
		width = w;
		height = h;
	}

	qmBrick.getDescription = function () {
		return description;
	}

	qmBrick.getWeight = function () {
		return weight;
	}

	qmBrick.setDescription = function (d) {
		description = d;
	}

	qmBrick.setWeight = function (w) {
		weight = w;
	}

	qmBrick.draw = function () {
		drawBrick();
	}

	return qmBrick;
}

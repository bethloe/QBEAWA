var MoveableBricksEventHandler = function (vals) {

	var moveableBricksEventHandler = {};
	var offsetX = vals.offsetX;
	var offsetY = vals.offsetY;
	var ctx = vals.ctx;
	var controller = vals.controller;
	var moveableBricks = [];
	var selectedBrick;
	var isDown = false;
	var startX = 0;
	var startY = 0;
	var moving = false;
	var isDrawConnection = false;
	var connectionFromX = 0;
	var connectionFromY = 0;
	var selectedBrickForConnectionIndex = -1;
	var connectors = [];
	var selectedBricks = []; //TODO GO ON HERE
	//An example
	/*connectors.push({
	brick0 : 0, //index of moveableBricks array
	brick1 : 1,
	operation: 'add'
	});*/

	moveableBricksEventHandler.drawConnections = function (e) {
		for (var i = 0; i < connectors.length; i++) {
			var connector = connectors[i];
			var brick0 = moveableBricks[connector.brick0];
			var brick1 = moveableBricks[connector.brick1];
			ctx.beginPath();
			ctx.fillStyle = "white";

			//TODO: CHECK conditions
			if ((brick1.getY() > brick0.getY() + brick0.getHeight() && (brick1.getX() >= brick0.getX() && brick1.getX() <= brick0.getX() + brick0.getWidth())) ||
				(brick1.getY() > brick0.getY() + brick0.getHeight() && (brick1.getX() + brick1.getWidth() <= brick0.getX() + brick0.getX() && brick1.getX() + brick1.getWidth() >= brick0.getX()))) {
				ctx.moveTo(brick0.getX() + brick0.getWidth() / 2, brick0.getY() + brick0.getHeight());
				ctx.lineTo(brick1.getX() + brick0.getWidth() / 2, brick1.getY());
			} else if ((brick1.getY() < brick0.getY() + brick0.getHeight() && (brick1.getX() >= brick0.getX() && brick1.getX() <= brick0.getX() + brick0.getWidth())) ||
				(brick1.getY() < brick0.getY() + brick0.getHeight() && (brick1.getX() + brick1.getWidth() <= brick0.getX() + brick0.getX() && brick1.getX() + brick1.getWidth() >= brick0.getX()))) {
				ctx.moveTo(brick0.getX() + brick0.getWidth() / 2, brick0.getY());
				ctx.lineTo(brick1.getX() + brick0.getWidth() / 2, brick1.getY() + brick0.getHeight());
			} else if (brick0.getX() < brick1.getX()) {
				ctx.moveTo(brick0.getX() + brick0.getWidth(), brick0.getY() + brick0.getHeight() / 2);
				ctx.lineTo(brick1.getX(), brick1.getY() + brick1.getHeight() / 2);
			} else if (brick1.getX() < brick0.getX()) {
				ctx.moveTo(brick0.getX(), brick0.getY() + brick0.getHeight() / 2);
				ctx.lineTo(brick1.getX() + brick0.getWidth(), brick1.getY() + brick1.getHeight() / 2);
			} else {
				ctx.moveTo(brick0.getX() + brick0.getWidth() / 2, brick0.getY() + brick0.getHeight() / 2);
				ctx.lineTo(brick1.getX() + brick1.getWidth() / 2, brick1.getY() + brick1.getHeight() / 2);
			}
			ctx.stroke();
		}
	}

	moveableBricksEventHandler.deleteElement = function () {

		if (selectedBrick) { //DELETE THAT BRICK
			var index = 0;
			for (var i = 0; i < moveableBricks.length; i++) {
				if (selectedBrick == moveableBricks[i]) {
					index = i;
				}
			}
			moveableBricks.splice(index, 1);
			controller.draw();
		}
	}

	moveableBricksEventHandler.handleMouseMove = function (e) {
		handleMouseOver(e);
		// Draw connection
		if (isDrawConnection) {
			moving = true;
			mouseX = parseInt(e.clientX - offsetX);
			mouseY = parseInt(e.clientY - offsetY);
			controller.drawForConnection(connectionFromX, connectionFromY, mouseX, mouseY);
		}
		// Move brick
		else if (isDown) {
			moving = true;
			mouseX = parseInt(e.clientX - offsetX);
			mouseY = parseInt(e.clientY - offsetY);

			var dx = mouseX - startX;
			var dy = mouseY - startY;
			selectedBrick.setPos(dx, dy);
			controller.draw();
		}
	}

	moveableBricksEventHandler.handleMouseUp = function (e) {
		if (isDown) {
			selectedBrick = null;
			isDown = false;
		} else if (isDrawConnection) {

			x = parseInt(e.clientX - offsetX);
			y = parseInt(e.clientY - offsetY);
			for (var i = 0; i < moveableBricks.length; i++) {
				var brick = moveableBricks[i];
				if (brick.hit(x, y) && i != selectedBrickForConnectionIndex && selectedBrickForConnectionIndex != -1) {
					console.log("IN HERE");
					//CREATE CONNECTION
					connectors.push({
						brick0 : selectedBrickForConnectionIndex, //index of moveableBricks array
						brick1 : i,
						operation : 'add'
					});
					isDrawConnection = false;
					selectedBrickForConnectionIndex = -1;
					controller.draw();
					return;
				}
			}
			//NOTHING HIT
			isDrawConnection = false;
			selectedBrickForConnectionIndex = -1;

			controller.draw();
		}
	}

	moveableBricksEventHandler.hit = function (x, y) {
		moving = false;
		startX = x;
		startY = y;
		for (var i = 0; i < moveableBricks.length; i++) {
			var brick = moveableBricks[i];
			if (brick.hit(x, y)) {
				selectedBrick = brick;
				startX -= selectedBrick.getX();
				startY -= selectedBrick.getY();
				isDown = true;
				return (true);
			}
		}
		return (false);
	}

	moveableBricksEventHandler.handleMouseDown = function (e) {
		if (e.button == 0)
			this.hit(parseInt(e.clientX - offsetX), parseInt(e.clientY - offsetY));
		else if (e.button == 2)
			drawConnectionLine(parseInt(e.clientX - offsetX), parseInt(e.clientY - offsetY));
	}

	var drawConnectionLine = function (x, y) {
		for (var i = 0; i < moveableBricks.length; i++) {
			var brick = moveableBricks[i];
			if (brick.hit(x, y)) {
				isDrawConnection = true;
				connectionFromX = x;
				connectionFromY = y;
				selectedBrickForConnectionIndex = i;
			}
		}
	}

	moveableBricksEventHandler.drawMoveableBricks = function () {
		for (var i = 0; i < moveableBricks.length; i++) {
			var moveableBrick = moveableBricks[i];
			moveableBrick.draw();
		}
	}

	moveableBricksEventHandler.handleMouseClick = function (e) {
		var x = parseInt(e.clientX - offsetX);
		var y = parseInt(e.clientY - offsetY);
		//If a menu item is selected clone it and draw it
		selectedMenuBrick = controller.getSelectedMenuBrick();
		if (selectedMenuBrick && !controller.getSelectionClick()) {
			if (selectedMenuBrick.getType() == 'result') {
				var input = new CanvasInput({
						canvas : document.getElementById("canvas"),
						fontSize : 18,
						fontFamily : 'Arial',
						fontColor : '#212121',
						fontWeight : 'bold',
						width : 130,
						padding : 8,
						borderWidth : 1,
						borderColor : '#000',
						borderRadius : 3,
						boxShadow : '1px 1px 0px #fff',
						innerShadow : '0px 0px 5px rgba(0, 0, 0, 0.5)',
						placeHolder : 'Result name',
						x : (x - 75),
						y : (y - 20)
					});
				var moveableBrick = new QMBrick({
						ctx : ctx,
						x : (x - 75),
						y : (y - 60),
						type : 'result',
						description : selectedMenuBrick.getDescription(),
						weight : selectedMenuBrick.getWeight(),
						controller : controller,
						input : input
					});
			} else {
				var moveableBrick = new QMBrick({
						ctx : ctx,
						x : (x - 75),
						y : (y - 60),
						type : 'moveable',
						description : selectedMenuBrick.getDescription(),
						weight : selectedMenuBrick.getWeight(),
						controller : controller
					});
			}
			moveableBricks.push(moveableBrick);
			controller.setSelectedMenuBrick(null);
			deleteMenuSelection();
			controller.draw();
		}

		if (!moving) {
			for (var i = 0; i < moveableBricks.length; i++) {
				brick = moveableBricks[i];
				if (brick.hitUpButton(x, y)) {
					brick.setWeight(brick.getWeight() + 0.1);
				} else if (brick.hitDownButton(x, y)) {
					if (brick.getWeight() > 0.1) {
						brick.setWeight(brick.getWeight() - 0.1);
					}
				} else if (brick.hit(x, y)) {
					brick.setBorder(!brick.getBorder());
					controller.draw();
				}
			}
		}

	}

	var handleMouseOver = function (e) {
		var x = parseInt(e.clientX - offsetX);
		var y = parseInt(e.clientY - offsetY);
		for (var i = 0; i < moveableBricks.length; i++) {
			brick = moveableBricks[i];
			if (brick.hitUpButton(x, y)) {
				brick.setOverUpButton(true);
				controller.draw();
				return;
			} else if (brick.hitDownButton(x, y)) {
				brick.setOverDownButton(true);
				controller.draw();
				return;
			}
			if (brick.getOverUpButton() || brick.getOverDownButton()) {
				brick.setOverUpButton(false);
				brick.setOverDownButton(false);
				controller.draw();
				return;
			}
		}
	}

	return moveableBricksEventHandler;

}

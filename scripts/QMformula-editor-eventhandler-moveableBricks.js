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
	var isTransforming = false;
	var connectionFromX = 0;
	var connectionFromY = 0;
	//var selectedBrickForConnectionIndex = -1;
	var selectedBrickForConnection;
	var connectors = [];
	var selectedBricks = [];
	var selectedConnectors = [];
	var oldGlobalPosX = 0;
	var oldGlobalPosY = 0;
	//An example
	/*connectors.push({
	brick0 : b0, //an element of moveableBricks array
	brick1 : b1,
	operation: 'add'
	});*/

	var calculateQMScore = function (brick, sum) {
		for (var i = 0; i < connectors.length; i++) {
			if (connectors[i].brick1.compare(brick)) {
				sum += connectors[i].brick0.getTotalScore();
				//console.log("SUEM: " + sum + " BRICK0: " + connectors[i].brick0.getDescription());
				sum = calculateQMScore(connectors[i].brick0, sum);
			}
		}
		return sum;
	}

	moveableBricksEventHandler.calculateQMScore = function (brick) {
		return calculateQMScore(brick, 0);
	}
	moveableBricksEventHandler.drawConnections = function (e) {
		for (var i = 0; i < connectors.length; i++) {
			var connector = connectors[i];
			var brick0 = connector.brick0; //moveableBricks[connector.brick0];
			var brick1 = connector.brick1; //moveableBricks[connector.brick1];
			//console.log(brick0.getDescription() + " "+brick1.getDescription() + " " +brick1.getY() + " < " + (brick0.getY() + brick0.getHeight()));
			if ((brick1.getY() > brick0.getY() + brick0.getHeight() && (brick1.getX() >= brick0.getX() && brick1.getX() <= brick0.getX() + brick0.getWidth())) ||
				(brick1.getY() > brick0.getY() + brick0.getHeight() && (brick1.getX() + brick1.getWidth() <= brick0.getX() + brick0.getX() && brick1.getX() + brick1.getWidth() >= brick0.getX()))) {
				utility_drawArrow(ctx, brick0.getX() + brick0.getWidth() / 2, brick0.getY() + brick0.getHeight(), brick1.getX() + brick0.getWidth() / 2, brick1.getY(), connector.operation, connector.color, connector.lineWidth);
				connector.fromX = brick0.getX() + brick0.getWidth() / 2;
				connector.fromY = brick0.getY() + brick0.getHeight();
				connector.toX = brick1.getX() + brick0.getWidth() / 2;
				connector.toY = brick1.getY();
			} else if ((brick1.getY() + brick1.getHeight() < brick0.getY() && (brick1.getX() >= brick0.getX() && brick1.getX() <= brick0.getX() + brick0.getWidth())) ||
				(brick1.getY() + brick1.getHeight() < brick0.getY() && (brick1.getX() + brick1.getWidth() <= brick0.getX() + brick0.getX() && brick1.getX() + brick1.getWidth() >= brick0.getX()))) {
				utility_drawArrow(ctx, brick0.getX() + brick0.getWidth() / 2, brick0.getY(), brick1.getX() + brick0.getWidth() / 2, brick1.getY() + brick0.getHeight(), connector.operation, connector.color, connector.lineWidth);
				connector.fromX = brick0.getX() + brick0.getWidth() / 2;
				connector.fromY = brick0.getY();
				connector.toX = brick1.getX() + brick0.getWidth() / 2;
				connector.toY = brick1.getY() + brick0.getHeight();
			} else if (brick0.getX() < brick1.getX()) {
				utility_drawArrow(ctx, brick0.getX() + brick0.getWidth(), brick0.getY() + brick0.getHeight() / 2, brick1.getX(), brick1.getY() + brick1.getHeight() / 2, connector.operation, connector.color, connector.lineWidth);
				connector.fromX = brick0.getX() + brick0.getWidth();
				connector.fromY = brick0.getY() + brick0.getHeight() / 2;
				connector.toX = brick1.getX();
				connector.toY = brick1.getY() + brick1.getHeight() / 2;
			} else if (brick1.getX() < brick0.getX()) {
				utility_drawArrow(ctx, brick0.getX(), brick0.getY() + brick0.getHeight() / 2, brick1.getX() + brick0.getWidth(), brick1.getY() + brick1.getHeight() / 2, connector.operation, connector.color, connector.lineWidth);
				connector.fromX = brick0.getX();
				connector.fromY = brick0.getY() + brick0.getHeight() / 2;
				connector.toX = brick1.getX() + brick0.getWidth();
				connector.toY = brick1.getY() + brick1.getHeight() / 2;
			} else {
				utility_drawArrow(ctx, brick0.getX() + brick0.getWidth() / 2, brick0.getY() + brick0.getHeight() / 2, brick1.getX() + brick1.getWidth() / 2, brick1.getY() + brick1.getHeight() / 2, connector.operation, connector.color, connector.lineWidth);
				connector.fromX = brick0.getX() + brick0.getWidth() / 2;
				connector.fromY = brick0.getY() + brick0.getHeight() / 2;
				connector.toX = brick1.getX() + brick1.getWidth() / 2;
				connector.toY = brick1.getY() + brick1.getHeight() / 2;
			}
			ctx.stroke();
		}
	}

	var getIndexOfMoveableBrick = function (brick) {
		for (var j = 0; j < moveableBricks.length; j++) {
			if (moveableBricks[j].compare(brick))
				return j;
		}
		return -1;
	}

	var getIndexOfConnector = function (connector) {
		for (var j = 0; j < connectors.length; j++) {
			if (compareConnectors(connectors[j], connector))
				return j;
		}
		return -1;
	}

	moveableBricksEventHandler.deleteConnections = function (brick) {
		var help = [];
		for (var i = connectors.length - 1; i >= 0; i--) {
			if (connectors[i].brick0.compare(brick) || connectors[i].brick1.compare(brick)) {
				help.push(i);
			}
		}
		for (var i = 0; i < help.length; i++) {
			connectors.splice(help[i], 1);
		}
	}
	moveableBricksEventHandler.deleteElement = function () {

		if (selectedBricks.length > 0) { //DELETE THAT BRICKs
			for (var i = 0; i < selectedBricks.length; i++) {
				var index = getIndexOfMoveableBrick(selectedBricks[i].brick);
				if (index >= 0) {
					this.deleteConnections(selectedBricks[i].brick);
					moveableBricks.splice(index, 1);
				}

			}
			selectedBricks.splice(0, selectedBricks.length);
			controller.draw();
		}

		if (selectedConnectors.length > 0) { //DELETE THAT CONNECTORs
			for (var i = 0; i < selectedConnectors.length; i++) {
				var index = getIndexOfConnector(selectedConnectors[i]);
				if (index >= 0) {
					connectors.splice(index, 1);
				}
			}
			selectedConnectors.splice(0, selectedConnectors.length);
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

		//transformation
		else if (isTransforming) {
			mouseX = parseInt(e.clientX - offsetX);
			mouseY = parseInt(e.clientY - offsetY);
			this.transformation(oldGlobalPosX, oldGlobalPosY, mouseX, mouseY);
			oldGlobalPosX = mouseX;
			oldGlobalPosY = mouseY;
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
				if (brick.hit(x, y) && !brick.compare(selectedBrickForConnection) && selectedBrickForConnection != null) {
					//CREATE CONNECTION
					connectors.push({
						brick0 : selectedBrickForConnection,
						brick1 : brick,
						fromX : 0,
						fromY : 0,
						toX : 0,
						toY : 0,
						color : 'white',
						lineWidth : 1,
						operation : '+'
					});
					isDrawConnection = false;
					selectedBrickForConnection = null;
					controller.draw();
					return;
				}
			}
			//NOTHING HIT
			isDrawConnection = false;
			selectedBrickForConnection = null;
			controller.draw();
		} else if (isTransforming)
			isTransforming = false;
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
		else if (e.button == 1) { //someone is pressing the wheel perform transformation
			isTransforming = true;
			oldGlobalPosX = parseInt(e.clientX - offsetX);
			oldGlobalPosY = parseInt(e.clientY - offsetY);
		} else if (e.button == 2)
			drawConnectionLine(parseInt(e.clientX - offsetX), parseInt(e.clientY - offsetY));
	}

	var drawConnectionLine = function (x, y) {
		for (var i = 0; i < moveableBricks.length; i++) {
			var brick = moveableBricks[i];
			if (brick.hit(x, y)) {
				isDrawConnection = true;
				connectionFromX = x;
				connectionFromY = y;
				//selectedBrickForConnectionIndex = i;
				selectedBrickForConnection = brick;
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
						type : 'resultMoveable',
						description : selectedMenuBrick.getDescription(),
						value : selectedMenuBrick.getValue(),
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
						value : selectedMenuBrick.getValue(),
						weight : selectedMenuBrick.getWeight(),
						controller : controller
					});
			}
			moveableBricks.push(moveableBrick);
			controller.setSelectedMenuBrick(null);
			deleteMenuSelection();
			controller.draw();
			return;
		}

		if (!moving) {
			for (var i = 0; i < moveableBricks.length; i++) {
				brick = moveableBricks[i];
				if (brick.hitUpButton(x, y)) {
					if (parseFloat(brick.getWeight()) < 1)
						brick.setWeight(parseFloat(parseFloat(brick.getWeight()) + parseFloat(0.1)).toFixed(1));
				} else if (brick.hitDownButton(x, y)) {
					if (parseFloat(brick.getWeight()) > 0)
						brick.setWeight(parseFloat(parseFloat(brick.getWeight()) - parseFloat(0.1)).toFixed(1));

				} else if (brick.hit(x, y)) {
					brick.setBorder(!brick.getBorder());
					//If the user selected a new element push the index into the selectedBricks array
					if (brick.getBorder()) {
						selectedBricks.push({
							brick : brick
						});

						//HIGHTLIGHT CONNECTORS IN RED IF RESULT BRICK IS SELECTED
						if (brick.getType() == 'resultMoveable') {
							highlightConnectorsForQMResult(brick, true);
						}
					} else { //remove it from selectedBricks array
						if (brick.getType() == 'resultMoveable') {
							highlightConnectorsForQMResult(brick, false); // => false because we want that it's not highlighted any more
						}
						var index = -1;
						for (var j = 0; j < selectedBricks.length; j++) {
							if (selectedBricks[j].brick == brick) {
								index = j;
								break;
							}
						}
						if (index >= 0) {
							selectedBricks.splice(index, 1);
						}
					}
					controller.draw();
				}
			}
			//CHECK CONNECTORS
			for (var i = 0; i < connectors.length; i++) {
				var currentConnector = connectors[i];
				if (connectorGotHit(currentConnector, x, y)) {
					var isAlreadySelected = false;
					var index = -1;
					for (var j = 0; j < selectedConnectors.length; j++) {
						if (compareConnectors(currentConnector, selectedConnectors[j])) {
							currentConnector.color = 'white';
							isAlreadySelected = true;
							index = j;
							currentConnector.lineWidth = 1;
						}
					}
					if (!isAlreadySelected) {
						selectedConnectors.push(currentConnector);
						currentConnector.color = 'white';
						currentConnector.lineWidth = 3;
					} else
						selectedConnectors.splice(index, 1);
				}
			}
		}

	}

	var highlightConnectorsForQMResult = function (brick, highlighting) {
		for (var i = 0; i < connectors.length; i++) {
			if (connectors[i].brick1.compare(brick)) {
				if (highlighting)
					connectors[i].color = 'red';
				else
					connectors[i].color = 'white';
				highlightConnectorsForQMResult(connectors[i].brick0, highlighting); //TODO CHECK LOOP!!
			}
		}

	}

	var compareConnectors = function (c1, c2) {
		//TODO CREATE CONNECTOR CLASS
		if (c1.fromX == c2.fromX && c1.fromY == c2.fromY && c1.toX == c2.toX && c1.toY == c2.toY) {
			return true;
		}
		return false;
	}

	var connectorGotHit = function (connector, mouseX, mouseY) {
		var lineRect = defineLineAsRect(connector.fromX, connector.fromY, connector.toX, connector.toY, 20);
		drawLineAsRect(ctx, lineRect, "transparent");
		return ctx.isPointInPath(mouseX, mouseY);
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

	moveableBricksEventHandler.zoomIn = function () {
		for (var i = 0; i < moveableBricks.length; i++) {
			moveableBricks[i].setWidth(moveableBricks[i].getWidth() * 2);
			moveableBricks[i].setHeight(moveableBricks[i].getHeight() * 2);
		}
		for (var i = 0; i < connectors.length; i++) {
			var currentConnector = connectors[i];
			for (var j = 0; j < moveableBricks.length; j++) {
				var currentMovableBrick = moveableBricks[j];
				if (currentConnector.brick1.compare(moveableBricks[j])) {
					var dx = currentConnector.toX - currentConnector.fromX;
					var dy = currentConnector.toY - currentConnector.fromY;
					console.log(currentMovableBrick.getDescription());
					currentMovableBrick.setX(currentMovableBrick.getX() + (dx));
					currentMovableBrick.setY(currentMovableBrick.getY() + (dy));
				}
			}
		}
		draw();
	}

	moveableBricksEventHandler.zoomOut = function () {
		for (var i = 0; i < moveableBricks.length; i++) {
			moveableBricks[i].setWidth(moveableBricks[i].getWidth() / 2);
			moveableBricks[i].setHeight(moveableBricks[i].getHeight() / 2);
		}
		for (var i = 0; i < connectors.length; i++) {
			var currentConnector = connectors[i];
			for (var j = 0; j < moveableBricks.length; j++) {
				var currentMovableBrick = moveableBricks[j];
				if (currentConnector.brick1.compare(moveableBricks[j])) {
					var dx = currentConnector.toX - currentConnector.fromX;
					var dy = currentConnector.toY - currentConnector.fromY;
					console.log(currentMovableBrick.getDescription());
					currentMovableBrick.setX(currentMovableBrick.getX() - (dx));
					currentMovableBrick.setY(currentMovableBrick.getY() - (dy));
				}
			}
		}
		draw();
	}

	moveableBricksEventHandler.transformation = function (fromX, fromY, toX, toY) {
		var dx = toX - fromX;
		var dy = toY - fromY;
		for (var i = 0; i < moveableBricks.length; i++) {
			moveableBricks[i].setX(moveableBricks[i].getX() + dx);
			moveableBricks[i].setY(moveableBricks[i].getY() + dy);
		}

		draw();
	}

	return moveableBricksEventHandler;
}

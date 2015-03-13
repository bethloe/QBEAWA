var MoveableBricksEventHandler = function (vals) {

	var moveableBricksEventHandler = {};
	var offsetX = vals.offsetX;
	var offsetY = vals.offsetY;
	var ctx = vals.ctx;
	var controller = vals.controller;
	var data = vals.data;
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
	var mathOperations = ["+", "-", "*", "/"];
	//An example
	/*connectors.push({
	brick0 : b0, //an element of moveableBricks array
	brick1 : b1,
	operation: 0 //index of mathOperations array
	});*/

	//TODO CHECK CALCULATION WITH * and /.  (multiplication and division first, then addition and subtraction)
	var calculateQMScore = function (brick, sum) {
		for (var i = 0; i < connectors.length; i++) {
			if (connectors[i].brick1.compare(brick)) {
				if (mathOperations[connectors[i].operation] == '+')
					sum += connectors[i].brick0.getTotalScore();
				else if (mathOperations[connectors[i].operation] == '-')
					sum -= connectors[i].brick0.getTotalScore();
				else if (mathOperations[connectors[i].operation] == '*')
					sum *= connectors[i].brick0.getTotalScore();
				else if (mathOperations[connectors[i].operation] == '/')
					sum /= connectors[i].brick0.getTotalScore();
				//console.log("SUEM: " + sum + " BRICK0: " + connectors[i].brick0.getDescription());
				sum = calculateQMScore(connectors[i].brick0, sum);
			}
		}
		return sum;
	}

	var calculateColorForQMResult = function (brick, r, g, b, init) {
		var color = "rgb(" + r + "," + g + "," + b + ")";
		var currentColor;
		for (var i = 0; i < connectors.length; i++) {
			if (connectors[i].brick1.compare(brick)) {
				currentColor = connectors[i].brick0.getColor();
				var rgbArray = currentColor.split("rgb(")[1].split(")")[0].split(",");
				if (init) {
					init = false;
					color = calculateColorForQMResult(connectors[i].brick0, parseInt((r + parseInt(rgbArray[0]))), parseInt((g + parseInt(rgbArray[1]))), parseInt((b + parseInt(rgbArray[2]))), false);
				} else
					color = calculateColorForQMResult(connectors[i].brick0, parseInt((r + parseInt(rgbArray[0])) / 2), parseInt((g + parseInt(rgbArray[1])) / 2), parseInt((b + parseInt(rgbArray[2])) / 2), false);
				rgbArray = color.split("rgb(")[1].split(")")[0].split(",");
				r = parseInt(rgbArray[0]);
				g = parseInt(rgbArray[1]);
				b = parseInt(rgbArray[2]);
			}
		}
		return color;
	}

	var createFormulaForQM = function (brick, formula, first) {
		for (var i = 0; i < connectors.length; i++) {
			if (connectors[i].brick1.compare(brick)) {
				if (first) {
					first = false;
					formula += connectors[i].brick1.getRealName() + "=," + mathOperations[connectors[i].operation] + "|" + connectors[i].brick0.getWeight() + "|" + connectors[i].brick0.getRealName();
				} else
					formula += "," + mathOperations[connectors[i].operation] + "|" + connectors[i].brick0.getWeight() + "|" + connectors[i].brick0.getRealName();
				formula = createFormulaForQM(connectors[i].brick0, formula, false);
			}
		}
		return formula;
	}

	var findMoveableBrickForConnectionsToLoad = function (brickToCompare) {
		for (var i = 0; i < moveableBricks.length; i++) {
			if (moveableBricks[i].compare(brickToCompare)) {
				return moveableBricks[i];
			}
		}
	}

	moveableBricksEventHandler.setValuesOfBricks = function (currentData) {
		for (var key in currentData) {
			for (var i = 0; i < moveableBricks.length; i++) {
				var brick = moveableBricks[i];
				if (brick.getRealName() == key) {
					brick.setValue(currentData[key]);
				}
			}
		}
	}

	moveableBricksEventHandler.loadDataFromJsonFile = function (jsonData) {
		moveableBricks.splice(0, moveableBricks.length);
		jsonData = jsonData.replace(/\\"/g, '"');
		var dataToLoad = JSON.parse(jsonData);
		var moveableBricksToLoad = dataToLoad.moveableBricks;
		var connectorsToLoad = dataToLoad.connectors;
		for (var i = 0; i < moveableBricksToLoad.length; i++) {
			console.log("x : " + moveableBricksToLoad[i].x + " y: " + moveableBricksToLoad[i].y);
			var qmBrick = new QMBrick({
					ctx : ctx,
					x : moveableBricksToLoad[i].x,
					y : moveableBricksToLoad[i].y,
					type : moveableBricksToLoad[i].type,
					value : moveableBricksToLoad[i].value,
					description : moveableBricksToLoad[i].description,
					realName : moveableBricksToLoad[i].realName,
					weight : moveableBricksToLoad[i].weight,
					color : moveableBricksToLoad[i].color,
					controller : controller
				});
			moveableBricks.push(qmBrick);
		}

		//TODO LOAD CONNECTIONS
		connectors.splice(0, connectors.length);
		for (var i = 0; i < connectorsToLoad.length; i++) {

			var qmBrick0 = new QMBrick({
					x : connectorsToLoad[i].brick0.x,
					y : connectorsToLoad[i].brick0.y,
					type : connectorsToLoad[i].brick0.type,
					value : connectorsToLoad[i].brick0.value,
					description : connectorsToLoad[i].brick0.description,
					realName : connectorsToLoad[i].brick0.realName,
					weight : connectorsToLoad[i].brick0.weight,
					color : connectorsToLoad[i].brick0.color
				});

			var qmBrick1 = new QMBrick({
					x : connectorsToLoad[i].brick1.x,
					y : connectorsToLoad[i].brick1.y,
					type : connectorsToLoad[i].brick1.type,
					value : connectorsToLoad[i].brick1.value,
					description : connectorsToLoad[i].brick1.description,
					realName : connectorsToLoad[i].brick1.realName,
					weight : connectorsToLoad[i].brick1.weight,
					color : connectorsToLoad[i].brick1.color
				});

			connectors.push({
				brick0 : findMoveableBrickForConnectionsToLoad(qmBrick0),
				brick1 : findMoveableBrickForConnectionsToLoad(qmBrick1),
				fromX : connectorsToLoad[i].fromX,
				fromY : connectorsToLoad[i].fromY,
				toX : connectorsToLoad[i].toX,
				toY : connectorsToLoad[i].toY,
				color : connectorsToLoad[i].color,
				lineWidth : connectorsToLoad[i].lineWidth,
				operation : connectorsToLoad[i].operation
			});
		}
	}

	moveableBricksEventHandler.createFormulaForQM = function () {
		console.log("createFormulaForQM");
		var qmArray = [];
		for (var i = 0; i < moveableBricks.length; i++) {
			var brick = moveableBricks[i];
			if (brick.getType() == 'resultMoveable') {
				console.log("createFormulaForQM into if");
				qmArray.push(createFormulaForQM(brick, "", true));
			}
		}
		return qmArray;
	}

	moveableBricksEventHandler.getMoveableBricksInJsonFormat = function () {
		var moveableBrickJsonStringArray = [];
		for (var i = 0; i < moveableBricks.length; i++) {
			moveableBrickJsonStringArray.push(JSON.parse(moveableBricks[i].toJSONString()));
		}
		return moveableBrickJsonStringArray;
	}

	moveableBricksEventHandler.getConnectorsInJsonFormat = function () {
		console.log(JSON.stringify(connectors));
		var connectorsJsonStringArray = [];

		for (var i = 0; i < connectors.length; i++) {
			connectorsJsonStringArray.push({
				brick0 : JSON.parse(connectors[i].brick0.toJSONString()),
				brick1 : JSON.parse(connectors[i].brick1.toJSONString()),
				fromX : connectors[i].fromX,
				fromY : connectors[i].fromY,
				toX : connectors[i].toX,
				toY : connectors[i].toY,
				color : connectors[i].color,
				lineWidth : connectors[i].lineWidth,
				operation : connectors[i].operation
			});
		}
		return connectorsJsonStringArray;
	}

	moveableBricksEventHandler.calculateColorForQMResult = function (brick) {
		return calculateColorForQMResult(brick, 0, 0, 0, true);
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
				utility_drawArrow(ctx, brick0.getX() + brick0.getWidth() / 2, brick0.getY() + brick0.getHeight(), brick1.getX() + brick0.getWidth() / 2, brick1.getY(), mathOperations[connector.operation], connector.color, connector.lineWidth);
				connector.fromX = brick0.getX() + brick0.getWidth() / 2;
				connector.fromY = brick0.getY() + brick0.getHeight();
				connector.toX = brick1.getX() + brick0.getWidth() / 2;
				connector.toY = brick1.getY();
			} else if ((brick1.getY() + brick1.getHeight() < brick0.getY() && (brick1.getX() >= brick0.getX() && brick1.getX() <= brick0.getX() + brick0.getWidth())) ||
				(brick1.getY() + brick1.getHeight() < brick0.getY() && (brick1.getX() + brick1.getWidth() <= brick0.getX() + brick0.getX() && brick1.getX() + brick1.getWidth() >= brick0.getX()))) {
				utility_drawArrow(ctx, brick0.getX() + brick0.getWidth() / 2, brick0.getY(), brick1.getX() + brick0.getWidth() / 2, brick1.getY() + brick0.getHeight(), mathOperations[connector.operation], connector.color, connector.lineWidth);
				connector.fromX = brick0.getX() + brick0.getWidth() / 2;
				connector.fromY = brick0.getY();
				connector.toX = brick1.getX() + brick0.getWidth() / 2;
				connector.toY = brick1.getY() + brick0.getHeight();
			} else if (brick0.getX() < brick1.getX()) {
				utility_drawArrow(ctx, brick0.getX() + brick0.getWidth(), brick0.getY() + brick0.getHeight() / 2, brick1.getX(), brick1.getY() + brick1.getHeight() / 2, mathOperations[connector.operation], connector.color, connector.lineWidth);
				connector.fromX = brick0.getX() + brick0.getWidth();
				connector.fromY = brick0.getY() + brick0.getHeight() / 2;
				connector.toX = brick1.getX();
				connector.toY = brick1.getY() + brick1.getHeight() / 2;
			} else if (brick1.getX() < brick0.getX()) {
				utility_drawArrow(ctx, brick0.getX(), brick0.getY() + brick0.getHeight() / 2, brick1.getX() + brick0.getWidth(), brick1.getY() + brick1.getHeight() / 2, mathOperations[connector.operation], connector.color, connector.lineWidth);
				connector.fromX = brick0.getX();
				connector.fromY = brick0.getY() + brick0.getHeight() / 2;
				connector.toX = brick1.getX() + brick0.getWidth();
				connector.toY = brick1.getY() + brick1.getHeight() / 2;
			} else {
				utility_drawArrow(ctx, brick0.getX() + brick0.getWidth() / 2, brick0.getY() + brick0.getHeight() / 2, brick1.getX() + brick1.getWidth() / 2, brick1.getY() + brick1.getHeight() / 2, mathOperations[connector.operation], connector.color, connector.lineWidth);
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
						operation : 0
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
						realName : selectedMenuBrick.getRealName(),
						value : selectedMenuBrick.getValue(),
						weight : selectedMenuBrick.getWeight(),
						color : selectedMenuBrick.getColor(),
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
						realName : selectedMenuBrick.getRealName(),
						value : selectedMenuBrick.getValue(),
						weight : selectedMenuBrick.getWeight(),
						color : selectedMenuBrick.getColor(),
						controller : controller
					});
			}
			moveableBricks.push(moveableBrick);
			controller.setSelectedMenuBrick(null);
			controller.deleteMenuSelection();
			controller.draw();
			return;
		}

		if (!moving) {
			for (var i = 0; i < moveableBricks.length; i++) {
				brick = moveableBricks[i];
				if (brick.hitUpButton(x, y) && brick.getType() != 'resultMoveable') {
					if (parseFloat(brick.getWeight()) < 1)
						brick.setWeight(parseFloat(parseFloat(brick.getWeight()) + parseFloat(0.1)).toFixed(1));
				} else if (brick.hitDownButton(x, y) && brick.getType() != 'resultMoveable') {
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
				} else if (connectorUpButtonGotHit(currentConnector, x, y)) {
					currentConnector.operation = getNextOperation(currentConnector.operation);
				} else if (connectorDownButtonGotHit(currentConnector, x, y)) {
					currentConnector.operation = getPrevOperation(currentConnector.operation);
				}
			}
		}

	}
	var getNextOperation = function (operationIndex) {
		if (mathOperations.length > operationIndex + 1)
			return (operationIndex + 1);
		else
			return 0;
	}

	var getPrevOperation = function (operationIndex) {
		if (0 <= operationIndex - 1)
			return (operationIndex - 1);
		else
			return (mathOperations.length - 1);
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
	var connectorUpButtonGotHit = function (connector, mouseX, mouseY) {
		var lineRect = defineLineAsRect(connector.fromX, connector.fromY - 20, connector.toX, connector.toY - 20, 20);
		drawLineAsRect(ctx, lineRect, "transparent");
		return ctx.isPointInPath(mouseX, mouseY);
	}

	var connectorDownButtonGotHit = function (connector, mouseX, mouseY) {
		var lineRect = defineLineAsRect(connector.fromX, connector.fromY + 20, connector.toX, connector.toY + 20, 20);
		drawLineAsRect(ctx, lineRect, "transparent");
		return ctx.isPointInPath(mouseX, mouseY);
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
		/*for (var i = 0; i < moveableBricks.length; i++) {
		moveableBricks[i].setWidth(moveableBricks[i].getWidth() * 2);
		moveableBricks[i].setHeight(moveableBricks[i].getHeight() * 2);
		}*/

		/*var bricksAlreadyZoomed = [];
		for (var i = 0; i < connectors.length; i++) {
		var currentConnector = connectors[i];
		for (var j = 0; j < moveableBricks.length; j++) {
		var currentMovableBrick = moveableBricks[j];
		if (currentConnector.brick1.compare(currentMovableBrick)) {
		var alreadyZoomed = false;
		for (var k = 0; k < bricksAlreadyZoomed.length; k++) {
		if (currentMovableBrick.compare(bricksAlreadyZoomed[k])) {
		alreadyZoomed = true;
		}
		}
		if (!alreadyZoomed) {
		var moveableBrickHelp;
		for (var k = 0; k < moveableBricks.length; k++) {
		if (currentConnector.brick0.compare(moveableBricks[k])) {
		moveableBrickHelp = moveableBricks[k];
		}
		}
		var fromX = moveableBrickHelp.getX();
		var fromY = moveableBrickHelp.getY();
		var toX = currentMovableBrick.getX();
		var toY = currentMovableBrick.getY();
		var dx = 0;
		var dy = 0;
		console.log(currentMovableBrick.getDescription() + ": " + fromX + " " + fromY + " " + toX + " " + toY);
		if (toX >= fromX) {
		dx = (toX - fromX);
		console.log(currentMovableBrick.getDescription() + ": " + currentMovableBrick.getX() + " " + dx);
		currentMovableBrick.setX(currentMovableBrick.getX() + dx);
		} else {
		dx = (fromX - toX) ;
		currentMovableBrick.setX(currentMovableBrick.getX() - dx);
		}
		if (toY >= fromY) {
		dy = (toY - fromY);
		currentMovableBrick.setY(currentMovableBrick.getY() + dy);
		} else {
		dy = (fromY - toY);
		currentMovableBrick.setY(currentMovableBrick.getY() - +dy);
		}
		bricksAlreadyZoomed.push(currentMovableBrick);
		}
		}
		}
		}*/

		for (var i = 0; i < connectors.length; i++) {
			var currentConnector = connectors[i];
			for (var j = 0; j < moveableBricks.length; j++) {
				var currentMovableBrick = moveableBricks[j];
				if (currentConnector.brick1.compare(moveableBricks[j])) {

					var fromX = currentConnector.fromX;
					var fromY = currentConnector.fromY;
					var toX = currentConnector.toX;
					var toY = currentConnector.toY;
					var dx = toX - fromX;
					var dy = toY - fromY;

					if (toX >= fromX) {
						dx = (toX - fromX);
						console.log("ZOOM IN : " + currentMovableBrick.getDescription() + ": " + " " + fromX + " " + toX + " " + dx);
						currentMovableBrick.setX(currentMovableBrick.getX() + dx);
					} else {
						dx = (fromX - toX);
						currentMovableBrick.setX(currentMovableBrick.getX() - dx);
					}
					if (toY >= fromY) {
						dy = (toY - fromY);
						currentMovableBrick.setY(currentMovableBrick.getY() + dy);
					} else {
						dy = (fromY - toY);
						currentMovableBrick.setY(currentMovableBrick.getY() - dy);
					}
					//controller.draw();
				}
			}
		}
		controller.draw();
	}

	moveableBricksEventHandler.zoomOut = function () {
		/*for (var i = 0; i < moveableBricks.length; i++) {
		moveableBricks[i].setWidth(moveableBricks[i].getWidth() / 2);
		moveableBricks[i].setHeight(moveableBricks[i].getHeight() / 2);
		}*/

		/*	var bricksAlreadyZoomed = [];
		for (var i = 0; i < connectors.length; i++) {
		var currentConnector = connectors[i];
		for (var j = 0; j < moveableBricks.length; j++) {
		var currentMovableBrick = moveableBricks[j];
		if (currentConnector.brick1.compare(currentMovableBrick)) {
		var alreadyZoomed = false;
		for (var k = 0; k < bricksAlreadyZoomed.length; k++) {
		if (currentMovableBrick.compare(bricksAlreadyZoomed[k])) {
		alreadyZoomed = true;
		}
		}
		if (!alreadyZoomed) {
		var moveableBrickHelp;
		for (var k = 0; k < moveableBricks.length; k++) {
		if (currentConnector.brick0.compare(moveableBricks[k])) {
		moveableBrickHelp = moveableBricks[k];
		}
		}
		var fromX = moveableBrickHelp.getX();
		var fromY = moveableBrickHelp.getY();
		var toX = currentMovableBrick.getX();
		var toY = currentMovableBrick.getY();
		var dx = 0;
		var dy = 0;
		console.log(currentMovableBrick.getDescription() + ": " + fromX + " " + fromY + " " + toX + " " + toY);
		if (toX >= fromX) {
		dx = (toX - fromX) / 2;
		console.log(currentMovableBrick.getDescription() + ": " + currentMovableBrick.getX() + " " + dx);
		currentMovableBrick.setX(currentMovableBrick.getX() - dx);
		} else {
		dx = (fromX - toX) / 2;
		currentMovableBrick.setX(currentMovableBrick.getX() + dx);
		}
		if (toY >= fromY) {
		dy = (toY - fromY) / 2;
		currentMovableBrick.setY(currentMovableBrick.getY() - dy);
		} else {
		dy = (fromY - toY) / 2;
		currentMovableBrick.setY(currentMovableBrick.getY() + dy);
		}
		bricksAlreadyZoomed.push(currentMovableBrick);
		}
		}
		}
		}*/

		for (var i = 0; i < connectors.length; i++) {
			var currentConnector = connectors[i];
			for (var j = 0; j < moveableBricks.length; j++) {
				var currentMovableBrick = moveableBricks[j];
				if (currentConnector.brick1.compare(moveableBricks[j])) {

					var fromX = currentConnector.fromX;
					var fromY = currentConnector.fromY;
					var toX = currentConnector.toX;
					var toY = currentConnector.toY;
					var dx = toX - fromX;
					var dy = toY - fromY;

					if (toX >= fromX) {
						dx = (toX - fromX) / 2;
						console.log(currentMovableBrick.getDescription() + ": " + " " + fromX + " " + toX + " " + dx);
						if(dx > 100)
						currentMovableBrick.setX(currentMovableBrick.getX() - dx);
					} else {
						dx = (fromX - toX) / 2;
						if(dx > 100)
						currentMovableBrick.setX(currentMovableBrick.getX() + dx);
					}
					if (toY >= fromY) {
						dy = (toY - fromY) / 2;
						if(dx > 100)
						currentMovableBrick.setY(currentMovableBrick.getY() - dy);
					} else {
						dy = (fromY - toY) / 2;
						if(dx > 100)
						currentMovableBrick.setY(currentMovableBrick.getY() + dy);
					}
					//controller.draw();
				}
			}
		}
		controller.draw();
	}

	moveableBricksEventHandler.transformation = function (fromX, fromY, toX, toY) {
		var dx = toX - fromX;
		var dy = toY - fromY;
		for (var i = 0; i < moveableBricks.length; i++) {
			moveableBricks[i].setX(moveableBricks[i].getX() + dx);
			moveableBricks[i].setY(moveableBricks[i].getY() + dy);
		}

		controller.draw();
	}
	moveableBricksEventHandler.setData = function (d) {
		data = d;
	}

	return moveableBricksEventHandler;
}

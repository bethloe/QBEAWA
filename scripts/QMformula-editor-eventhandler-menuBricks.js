var MenuBricksEventHandler = function (vals) {

	var menuBricksEventHandler = {};
	var offsetX = vals.offsetX;
	var offsetY = vals.offsetY;
	var controller = vals.controller;
	var ctx = vals.ctx;
	var selectionClick = false;

	var selectedBrick;

	var menuBricks = [];

	var GLOBAL_spaceBetweenInitmenuBricks = 5;
	var GLOBAL_dataBrickWidth = 150;


	menuBricksEventHandler.handleMouseUp = function (e) {
		// Put your mouseup stuff here
		//selectedBrick = null;
		//isDown = false;
	}

	menuBricksEventHandler.handleMouseMove = function (e) {}

	menuBricksEventHandler.deleteMenuSelection = function () {
		for (var j = 0; j < menuBricks.length; j++) {
			menuBricks[j].setBorder(false);
		}
	}

	menuBricksEventHandler.handleMouseDown = function (e) {
		this.hit(parseInt(e.clientX - offsetX), parseInt(e.clientY - offsetY));
	}

	menuBricksEventHandler.hit = function (x, y) {
		return (false);
	}

	menuBricksEventHandler.drawMenuBricks = function () {
		for (var i = 0; i < menuBricks.length; i++) {
			var bricks = menuBricks[i];
			bricks.draw();
		}
	}

	menuBricksEventHandler.init = function () {
		for (var i = 0; i < 8; i++) {
			var qmBrick = new QMBrick({
					ctx : ctx,
					x : i == 0 ? GLOBAL_spaceBetweenInitmenuBricks : (i * (GLOBAL_dataBrickWidth + GLOBAL_spaceBetweenInitmenuBricks) + GLOBAL_spaceBetweenInitmenuBricks),
					y : 0,
					type : 'menu',
					value : i,
					description : ('data' + i),
					weight : (i / 10),
					controller : controller
				});
			menuBricks.push(qmBrick);
		}
		//RESULT Brick

		var qmBrick = new QMBrick({
				ctx : ctx,
				x : i == 0 ? GLOBAL_spaceBetweenInitmenuBricks : (i * (GLOBAL_dataBrickWidth + GLOBAL_spaceBetweenInitmenuBricks) + GLOBAL_spaceBetweenInitmenuBricks),
				y : 0,
				type : 'result',
				description : 'Result',
				weight : (i / 10),
				controller : controller
			});
		menuBricks.push(qmBrick);
	}

	menuBricksEventHandler.getSelectedBrick = function () {
		return selectedBrick;
	}

	menuBricksEventHandler.setSelectedBrick = function (sB) {
		selectedBrick = sB;
	}

	menuBricksEventHandler.handleMouseClick = function (e) {
		var startX = parseInt(e.clientX - offsetX);
		var startY = parseInt(e.clientY - offsetY);
		for (var i = 0; i < menuBricks.length; i++) {
			var brick = menuBricks[i];
			if (brick.hit(startX, startY)) {
				deleteMenuSelection();
				brick.setBorder(true);
				selectedBrick = brick;
				selectionClick = true;
				return (true);
			}
		}
		selectionClick = false;
		return (false);

	}

	menuBricksEventHandler.handleMouseDown = function (e) {
		startX = parseInt(e.clientX - offsetX);
		startY = parseInt(e.clientY - offsetY);
	}

	menuBricksEventHandler.getSelectionClick = function () {
		return selectionClick;
	}

	menuBricksEventHandler.handleMouseOver = function (e) {}

	return menuBricksEventHandler;

}

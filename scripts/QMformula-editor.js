(function Controller() {
	$('body').on('contextmenu', '#canvas', function (e) {
		return false;
	});
	var canvas = document.getElementById("canvas");
	canvas.width = screen.width -100;
	canvas.height = screen.height -200;
	var ctx = canvas.getContext("2d");

	var canvasOffset = $("#canvas").offset();
	var offsetX = canvasOffset.left;
	var offsetY = canvasOffset.top;
	var scale = 0;

	var moveableBricksEventHandler = new MoveableBricksEventHandler({
			offsetX : offsetX,
			offsetY : offsetY,
			controller : this,
			ctx : ctx
		});

	var menuBricksEventHandler = new MenuBricksEventHandler({
			offsetX : offsetX,
			offsetY : offsetY,
			controller : this,
			ctx : ctx
		});

	menuBricksEventHandler.init();
	draw();
	function drawMenuBackground() {
		//DRAW RECTANGLE
		ctx.fillStyle = 'black';
		ctx.globalAlpha = 1;
		ctx.fillRect(0, 0, canvas.width, 130);
		//DRAW LINE
		ctx.beginPath();
		ctx.strokeStyle = 'white';
		ctx.lineWidth = 5;
		ctx.globalAlpha = 1;
		ctx.moveTo(0, 130);
		ctx.lineTo(canvas.width, 130);
		ctx.stroke();
	}
	function draw() {
		// clear the canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		moveableBricksEventHandler.drawMoveableBricks();
		moveableBricksEventHandler.drawConnections();
		drawMenuBackground();
		menuBricksEventHandler.drawMenuBricks();
	}

	function handleMouseOut(e) {
		menuBricksEventHandler.handleMouseUp(e);
		moveableBricksEventHandler.handleMouseUp(e);
	}

	//Event handling
	$("#canvas").mousedown(function (e) {
		menuBricksEventHandler.handleMouseDown(e); //.hit(parseInt(e.clientX - offsetX), parseInt(e.clientY - offsetY));
		moveableBricksEventHandler.handleMouseDown(e); //.hit(parseInt(e.clientX - offsetX), parseInt(e.clientY - offsetY));
	});
	$("#canvas").mousemove(function (e) {
		menuBricksEventHandler.handleMouseMove(e);
		moveableBricksEventHandler.handleMouseMove(e);
	});
	$("#canvas").mouseup(function (e) {
		handleMouseOut(e);
	});
	$("#canvas").mouseout(function (e) {
		handleMouseOut(e);
	});
	$("canvas").click(function (e) {
		menuBricksEventHandler.handleMouseClick(e);
		moveableBricksEventHandler.handleMouseClick(e);
		draw();
	});
	var onMouseWheel = function (e) {
		/*var wheel = e.wheelDelta / 120; //n or -n
		console.log("WHEEL: " + wheel);
		if (wheel == 1) {
		scale += 0.2;
		console.log(scale);
		ctx.scale(scale, scale);
		} else if (wheel == -1) {
		scale -= 0.2;
		ctx.scale(scale, scale);
		}
		draw();*/
	}

	var doKeyDown = function (e) {
		if (e.keyCode == 107 || e.keyCode == 187) { //+
			//zoom in
			//ctx.scale(2, 2);
			//draw();
			moveableBricksEventHandler.zoomIn();
		}
		if (e.keyCode == 109 || e.keyCode == 189) { //-
			//zoom out

			moveableBricksEventHandler.zoomOut();
		}
		if (e.keyCode == 46) { //del
			moveableBricksEventHandler.deleteElement();
		}
	}
	window.addEventListener('keydown', doKeyDown, true);
	canvas.addEventListener('mousewheel', onMouseWheel, true);

	//Public:
	this.deleteMenuSelection = function () {
		menuBricksEventHandler.deleteMenuSelection();
	};

	this.getSelectedMenuBrick = function () {
		return menuBricksEventHandler.getSelectedBrick();
	}

	this.setSelectedMenuBrick = function () {
		menuBricksEventHandler.setSelectedBrick(null);
	}

	//Check if a click is for selection of a menu item or not
	this.getSelectionClick = function () {
		return menuBricksEventHandler.getSelectionClick();
	}

	this.drawForConnection = function (fromX, fromY, toX, toY) {
		draw();

		utility_drawArrow(ctx, fromX, fromY, toX, toY, '', 'white', 1);
		//ctx.moveTo(fromX, fromY);
		//ctx.lineTo(toX, toY);
		ctx.stroke();
	}
	this.draw = function () {
		draw();
	}

	this.test = function () {
		console.log("TEST");
	}

	this.calculateQMScore = function (brick) {
		return moveableBricksEventHandler.calculateQMScore(brick);
	}

})();

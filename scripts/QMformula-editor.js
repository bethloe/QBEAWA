(function Controller() {
	$('body').on('contextmenu', '#canvas', function (e) {
		return false;
	});
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	var canvasOffset = $("#canvas").offset();
	var offsetX = canvasOffset.left;
	var offsetY = canvasOffset.top;

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

	function draw() {
		// clear the canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		menuBricksEventHandler.drawMenuBricks();
		moveableBricksEventHandler.drawMoveableBricks();
		moveableBricksEventHandler.drawConnections();

		//input.render();

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
	
	var doKeyDown = function(e){
		if(e.keyCode == 46) { //del
			moveableBricksEventHandler.deleteElement();
		}
	}
	window.addEventListener('keydown', doKeyDown, true);

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
		ctx.beginPath();
		ctx.moveTo(fromX, fromY);
		ctx.lineTo(toX, toY);
		ctx.stroke();
	}
	this.draw = function () {
		draw();
	}

})();

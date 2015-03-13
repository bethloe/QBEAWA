var Controller = function (vals) {
	$('body').on('contextmenu', '#canvas', function (e) {
		return false;
	});

	var controller = {};
	var canvas = document.getElementById("canvas");
	canvas.width = screen.width - 100;
	canvas.height = screen.height - 200;
	var ctx = canvas.getContext("2d");

	var canvasOffset = $("#canvas").offset();
	var offsetX = canvasOffset.left;
	var offsetY = canvasOffset.top;
	var scale = 0;
	var data = vals.data;
	var visController = vals.visController;
	var showValues = false;

	function drawMoveableBackground() {
		//MAKE IT BLACK
		ctx.fillStyle = 'black';
		ctx.globalAlpha = 1;
		ctx.fillRect(0, 45, canvas.width, canvas.height);

		ctx.beginPath();
		ctx.strokeStyle = 'white';
		ctx.lineWidth = 1;
		ctx.globalAlpha = 0.5;
		var yCnt = 45;
		while (menuBricksEventHandler.getBottomOfTheMenu() + yCnt < canvas.height) {
			ctx.moveTo(0, yCnt);
			ctx.lineTo(canvas.width, yCnt);
			yCnt += 50;
		}
		var xCnt = 0;
		while (xCnt < canvas.width) {
			ctx.moveTo(xCnt, 45);
			ctx.lineTo(xCnt, canvas.height);
			xCnt += 50;
		}
		ctx.stroke();
	}
	function draw() {
		// clear the canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawMoveableBackground();
		moveableBricksEventHandler.drawMoveableBricks();
		moveableBricksEventHandler.drawConnections();
		menuBricksEventHandler.drawMenuBackground();
		menuBricksEventHandler.drawMenuBricks();
		menuBricksEventHandler.drawHideMenuButton();
		menuBricksEventHandler.drawSaveButton();
	}

	function handleMouseOut(e) {
		menuBricksEventHandler.handleMouseUp(e);
		moveableBricksEventHandler.handleMouseUp(e);
	}
	
	function loadDataFromJsonFile(jsonData){
		menuBricksEventHandler.loadDataFromJsonFile(jsonData);
		moveableBricksEventHandler.loadDataFromJsonFile(jsonData);
		draw();	
	}
	
	function setValuesOfBricks(currentData){
		menuBricksEventHandler.setValuesOfBricks(currentData);
		moveableBricksEventHandler.setValuesOfBricks(currentData);
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
	controller.deleteMenuSelection = function () {
		menuBricksEventHandler.deleteMenuSelection();
	};

	controller.getSelectedMenuBrick = function () {
		return menuBricksEventHandler.getSelectedBrick();
	}

	controller.setSelectedMenuBrick = function () {
		menuBricksEventHandler.setSelectedBrick(null);
	}

	//Check if a click is for selection of a menu item or not
	controller.getSelectionClick = function () {
		return menuBricksEventHandler.getSelectionClick();
	}

	controller.drawForConnection = function (fromX, fromY, toX, toY) {
		draw();

		utility_drawArrow(ctx, fromX, fromY, toX, toY, '', 'white', 1);
		//ctx.moveTo(fromX, fromY);
		//ctx.lineTo(toX, toY);
		ctx.stroke();
	}
	controller.draw = function () {
		draw();
	}

	controller.test = function () {
		console.log("TEST");
	}

	controller.calculateQMScore = function (brick) {
		return moveableBricksEventHandler.calculateQMScore(brick);
	}
	
	controller.calculateColorForQMResult = function(brick) {
		return moveableBricksEventHandler.calculateColorForQMResult(brick);	
	}

	controller.setData = function (d) {
		console.log("SET DATA");
		data = d;
		menuBricksEventHandler.setData(data);
		moveableBricksEventHandler.setData(data);
	}

	controller.transformMovable = function (fromX, fromY, toX, toY) {
		moveableBricksEventHandler.transformation(fromX, fromY, toX, toY);
	}
	
	controller.getMoveableBricksInJsonFormat = function(){
		return moveableBricksEventHandler.getMoveableBricksInJsonFormat();
	}
	
	controller.getConnectorsInJsonFormat = function() {
		return moveableBricksEventHandler.getConnectorsInJsonFormat();
	}
	
	controller.createFormulaForQM = function() {
		return moveableBricksEventHandler.createFormulaForQM();
	}
	
	controller.saveQMFormula = function(formulas, JSONFormatOfVis) {
		visController.newQM(formulas, JSONFormatOfVis);
	}
	
	controller.setData = function(d){
		data = d;
	}
	
	controller.loadData = function(vizDatainJsonFormat){
		loadDataFromJsonFile(vizDatainJsonFormat);
	}
	
	controller.setValues = function(currentData){
		setValuesOfBricks(currentData);
	}
	
	controller.setShowValues = function(sv) {
		showValues = sv;
		draw();
	}
	
	controller.getShowValues = function(){
		return showValues; 
	}
	
	var moveableBricksEventHandler = new MoveableBricksEventHandler({
			offsetX : offsetX,
			offsetY : offsetY,
			controller : controller,
			ctx : ctx,
			data : data,
			maxWidth : canvas.width
		});

	var menuBricksEventHandler = new MenuBricksEventHandler({
			offsetX : offsetX,
			offsetY : offsetY,
			controller : controller,
			ctx : ctx,
			data : data,
			maxWidth : canvas.width
		});
	menuBricksEventHandler.init();
	draw();

	return controller;
}

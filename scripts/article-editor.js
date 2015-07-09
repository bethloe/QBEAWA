var ArticleEditorController = function (vals) {
	$('body').on('contextmenu', '#canvas_article_editor', function (e) {
		return false;
	});

	var articleEditorController = {};
	var canvas = document.getElementById("canvas_article_editor");
	canvas.width = screen.width - 100;
	canvas.height = screen.height - 200;
	var ctx = canvas.getContext("2d");

	var canvasOffset = $("#canvas_article_editor").offset();
	var offsetX = canvasOffset.left;
	var offsetY = canvasOffset.top;
	var scale = 0;
	var data = vals.data;
	var visarticleEditorController = vals.visarticleEditorController;
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
	$("#canvas_article_editor").mousedown(function (e) {
		menuBricksEventHandler.handleMouseDown(e); //.hit(parseInt(e.clientX - offsetX), parseInt(e.clientY - offsetY));
		moveableBricksEventHandler.handleMouseDown(e); //.hit(parseInt(e.clientX - offsetX), parseInt(e.clientY - offsetY));
	});
	$("#canvas_article_editor").mousemove(function (e) {
		menuBricksEventHandler.handleMouseMove(e);
		moveableBricksEventHandler.handleMouseMove(e);
	});
	$("#canvas_article_editor").mouseup(function (e) {
		handleMouseOut(e);
	});
	$("#canvas_article_editor").mouseout(function (e) {
		handleMouseOut(e);
	});
	$("canvas_article_editor").click(function (e) {
		menuBricksEventHandler.handleMouseClick(e);
		moveableBricksEventHandler.handleMouseClick(e);
		draw();
	});
	var onMouseWheel = function (e) {
		/*var wheel = e.wheelDelta / 120; //n or -n
		//console.log("WHEEL: " + wheel);
		if (wheel == 1) {
		scale += 0.2;
		//console.log(scale);
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
	articleEditorController.deleteMenuSelection = function () {
		menuBricksEventHandler.deleteMenuSelection();
	};

	articleEditorController.getSelectedMenuBrick = function () {
		return menuBricksEventHandler.getSelectedBrick();
	}

	articleEditorController.setSelectedMenuBrick = function () {
		menuBricksEventHandler.setSelectedBrick(null);
	}

	//Check if a click is for selection of a menu item or not
	articleEditorController.getSelectionClick = function () {
		return menuBricksEventHandler.getSelectionClick();
	}

	articleEditorController.drawForConnection = function (fromX, fromY, toX, toY) {
		draw();

		utility_drawArrow(ctx, fromX, fromY, toX, toY, '', 'white', 1);
		//ctx.moveTo(fromX, fromY);
		//ctx.lineTo(toX, toY);
		ctx.stroke();
	}
	articleEditorController.draw = function () {
		draw();
	}

	articleEditorController.test = function () {
		//console.log("TEST");
	}

	articleEditorController.calculateQMScore = function (brick) {
		return moveableBricksEventHandler.calculateQMScore(brick);
	}
	
	articleEditorController.calculateQMAverageWeight = function(brick){
		return moveableBricksEventHandler.calculateQMAverageWeight(brick);
	}
	
	articleEditorController.calculateColorForQMResult = function(brick) {
		return moveableBricksEventHandler.calculateColorForQMResult(brick);	
	}

	articleEditorController.setData = function (d) {
		//console.log("SET DATA");
		data = d;
		menuBricksEventHandler.setData(data);
		moveableBricksEventHandler.setData(data);
	}

	articleEditorController.transformMovable = function (fromX, fromY, toX, toY) {
		moveableBricksEventHandler.transformation(fromX, fromY, toX, toY);
	}
	
	articleEditorController.getMoveableBricksInJsonFormat = function(){
		return moveableBricksEventHandler.getMoveableBricksInJsonFormat();
	}
	
	articleEditorController.getConnectorsInJsonFormat = function() {
		return moveableBricksEventHandler.getConnectorsInJsonFormat();
	}
	
	articleEditorController.createFormulaForQM = function() {
		return moveableBricksEventHandler.createFormulaForQM();
	}
	
	articleEditorController.saveQMFormula = function(formulas, JSONFormatOfVis) {
		visarticleEditorController.newQM(formulas, JSONFormatOfVis);
	}
	
	articleEditorController.setData = function(d){
		data = d;
	}
	
	articleEditorController.loadData = function(vizDatainJsonFormat){
		loadDataFromJsonFile(vizDatainJsonFormat);
	}
	
	articleEditorController.setValues = function(currentData){
		setValuesOfBricks(currentData);
	}
	
	articleEditorController.setShowValues = function(sv) {
		showValues = sv;
		draw();
	}
	
	articleEditorController.getShowValues = function(){
		return showValues; 
	}
	
	var moveableBricksEventHandler = new MoveableBricksEventHandler({
			offsetX : offsetX,
			offsetY : offsetY,
			articleEditorController : articleEditorController,
			ctx : ctx,
			data : data,
			maxWidth : canvas.width
		});

	var menuBricksEventHandler = new MenuBricksEventHandler({
			offsetX : offsetX,
			offsetY : offsetY,
			articleEditorController : articleEditorController,
			ctx : ctx,
			data : data,
			maxWidth : canvas.width
		});
	menuBricksEventHandler.init();
	draw();

	return articleEditorController;
}

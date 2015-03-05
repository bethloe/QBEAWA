$(function () {

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	var canvasOffset = $("#canvas").offset();
	var offsetX = canvasOffset.left;
	var offsetY = canvasOffset.top;

	var startX;
	var startY;
	var isDown = false;
	var dragTarget;

	var boxes = [];
	boxes.push({
		x : 50,
		y : 255,
		w : 75,
		h : 50
	}); // x,y,width,height
	boxes.push({
		x : 200,
		y : 255,
		w : 50,
		h : 50
	});
	var GLOBAL_dataBrickWidth = 150;
	var GLOBAL_dataBrickHeight = 120;
	var GLOBAL_dataBrickUpDownButtonHeight = 20;
	var GLOBAL_spaceBetweenInitBricks = 5;

	var initDataBricks = [];
	function init() {
		for (var i = 0; i < 10; i++) {
			initDataBricks.push({
				x : i == 0 ? GLOBAL_spaceBetweenInitBricks : (i * (GLOBAL_dataBrickWidth + GLOBAL_spaceBetweenInitBricks) + GLOBAL_spaceBetweenInitBricks),
				y : 0,
				w : GLOBAL_dataBrickWidth,
				h : GLOBAL_dataBrickHeight,
				descrioption : 'data2'
			});
		}
	}

	var connectors = [];
	connectors.push({
		box1 : 0,
		box2 : 1
	});
	init();
	draw();

	function drawArrow() {
		//TODO GO ON HERE 
		var headlen = 10; // length of head in pixels
		var angle = Math.atan2(toy - fromy, tox - fromx);
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
		ctx.moveTo(tox, toy);
		ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
	}
}

	function drawInitBricks() {

	for (var i = 0; i < initDataBricks.length; i++) {
		var initDataBrick = initDataBricks[i];

		ctx.font = "30px Times New Roman";
		ctx.fillText(initDataBrick.descrioption, initDataBrick.x + GLOBAL_spaceBetweenInitBricks * 8, initDataBrick.y + GLOBAL_dataBrickHeight - 50);

		ctx.globalAlpha = 0.2;
		ctx.fillStyle = "blue";
		ctx.fillRect(initDataBrick.x, initDataBrick.y, initDataBrick.w, initDataBrick.h);

		//Create Buttons up down
		ctx.globalAlpha = 0.5;
		ctx.fillStyle = "blue";
		ctx.fillRect(initDataBrick.x, initDataBrick.y, initDataBrick.w, GLOBAL_dataBrickUpDownButtonHeight);
		ctx.fillRect(initDataBrick.x, GLOBAL_dataBrickHeight - GLOBAL_dataBrickUpDownButtonHeight, initDataBrick.w, GLOBAL_dataBrickUpDownButtonHeight);

		drawArrow();

		ctx.globalAlpha = 0.8;
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.strokeRect(initDataBrick.x, initDataBrick.y, initDataBrick.w - 2, initDataBrick.h - 2);
	}
}

	function draw() {

	// clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (var i = 0; i < boxes.length; i++) {
		var box = boxes[i];
		ctx.fillRect(box.x, box.y, box.w, box.h);
	}

	drawInitBricks();

	for (var i = 0; i < connectors.length; i++) {
		var connector = connectors[i];
		var box1 = boxes[connector.box1];
		var box2 = boxes[connector.box2];
		ctx.beginPath();
		ctx.moveTo(box1.x + box1.w / 2, box1.y + box1.h / 2);
		ctx.lineTo(box2.x + box2.w / 2, box2.y + box2.h / 2);
		ctx.stroke();
	}

}

	function hit(x, y) {
	for (var i = 0; i < boxes.length; i++) {
		var box = boxes[i];
		if (x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h) {
			dragTarget = box;
			return (true);
		}
	}
	return (false);
}

	function handleMouseDown(e) {
	startX = parseInt(e.clientX - offsetX);
	startY = parseInt(e.clientY - offsetY);

	// Put your mousedown stuff here
	isDown = hit(startX, startY);
}

	function handleMouseUp(e) {
	// Put your mouseup stuff here
	dragTarget = null;
	isDown = false;
}

	function handleMouseOut(e) {
	handleMouseUp(e);
}

	function handleMouseMove(e) {
	if (!isDown) {
		return;
	}

	mouseX = parseInt(e.clientX - offsetX);
	mouseY = parseInt(e.clientY - offsetY);

	// Put your mousemove stuff here
	var dx = mouseX - startX;
	var dy = mouseY - startY;
	startX = mouseX;
	startY = mouseY;
	dragTarget.x += dx;
	dragTarget.y += dy;
	draw();
}
	$("#canvas").mousedown(function (e) {
		handleMouseDown(e);
	});
	$("#canvas").mousemove(function (e) {
		handleMouseMove(e);
	});
	$("#canvas").mouseup(function (e) {
		handleMouseUp(e);
	});
	$("#canvas").mouseout(function (e) {
		handleMouseOut(e);
	});

	});

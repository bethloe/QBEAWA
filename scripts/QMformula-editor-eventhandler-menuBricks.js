var MenuBricksEventHandler = function (vals) {

	var menuBricksEventHandler = {};
	var offsetX = vals.offsetX;
	var offsetY = vals.offsetY;
	var controller = vals.controller;
	var ctx = vals.ctx;
	var selectionClick = false;
	var data = vals.data;
	var maxWidth = vals.maxWidth;
	var bottomOfMenu = 0;
	var menuHideButton = {
		xPos : maxWidth - 50 - 30,
		yPos : 8,
		width : 60,
		height : 30,
		hidden : false
	};
	var menuSaveButton = {
		xPos : maxWidth - 70,
		yPos : 40,
		width : 50,
		height : 50
	}

	var img = new Image();
	img.src = "media/save.png";
	img.onload = function () {
		ctx.drawImage(img, menuSaveButton.xPos, menuSaveButton.yPos, menuSaveButton.width, menuSaveButton.height);
	};

	var menuEntries = ["article length", "currency", "external links", "num. edits", "num. anony. user edits", "num. reg. user edits", "num. admin user edits",
		"admin edit share", "num. unique editors", "diversity", "links here", "internal links", "num. images", "article age", "flesch", "kincaid"];

	var selectedBrick;

	var menuBricks = [];

	var GLOBAL_spaceBetweenInitmenuBricks = 5;
	var GLOBAL_dataBrickWidth = 150;

	menuBricksEventHandler.drawSaveButton = function () {
		//img.onload = function () {
		ctx.drawImage(img, maxWidth - 70, 40, 50, 50);
		//};
	}

	menuBricksEventHandler.drawHideMenuButton = function () {

		ctx.globalAlpha = 1;
		ctx.strokeStyle = 'white';
		ctx.lineWidth = 3;

		ctx.strokeRect(menuHideButton.xPos, menuHideButton.yPos, menuHideButton.width, menuHideButton.height);
		if (!menuHideButton.hidden)
			drawUpArrow(ctx, maxWidth - 50, 10, 30);
		else
			drawUpArrow(ctx, maxWidth - 50, 40, -30);
	}

	menuBricksEventHandler.drawMenuBackground = function () {

		if (!menuHideButton.hidden) {
			//DRAW RECTANGLE
			ctx.fillStyle = 'black';
			ctx.globalAlpha = 1;
			ctx.fillRect(0, 0, maxWidth, bottomOfMenu + 70);
			//DRAW LINE
			ctx.beginPath();
			ctx.strokeStyle = 'white';
			ctx.lineWidth = 5;
			ctx.globalAlpha = 1;
			ctx.moveTo(0, bottomOfMenu + 70);
			ctx.lineTo(canvas.width, bottomOfMenu + 70);
			ctx.stroke();
		} else {

			//DRAW RECTANGLE
			ctx.fillStyle = 'black';
			ctx.globalAlpha = 1;
			ctx.fillRect(0, 0, maxWidth, 45);

		}
	}
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
		if (!menuHideButton.hidden) {
			for (var i = 0; i < menuBricks.length; i++) {
				var brick = menuBricks[i];
				brick.drawMenuBrick();
			}
		}
	}

	menuBricksEventHandler.init = function () {
		console.log("DATA LENGTH: " + data.length);
		var cnt = 0;
		bottomOfMenu = 0;
		for (var i = 0; i < menuEntries.length; i++) {
			if ((cnt * (GLOBAL_dataBrickWidth + GLOBAL_spaceBetweenInitmenuBricks) + GLOBAL_spaceBetweenInitmenuBricks) + 150 > maxWidth) {
				bottomOfMenu += 70;
				cnt = 0;
			}
			var qmBrick = new QMBrick({
					ctx : ctx,
					x : cnt == 0 ? GLOBAL_spaceBetweenInitmenuBricks : (cnt * (GLOBAL_dataBrickWidth + GLOBAL_spaceBetweenInitmenuBricks) + GLOBAL_spaceBetweenInitmenuBricks),
					y : bottomOfMenu,
					type : 'menu',
					value : cnt,
					description : menuEntries[i],
					weight : 0.5,
					color : "rgb(" + randomIntFromInterval(100, 255) + "," + randomIntFromInterval(100, 255) + "," + randomIntFromInterval(100, 255) + ")",
					controller : controller
				});
			menuBricks.push(qmBrick);
			cnt += 1;
		}

		/*
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
		}*/
		//RESULT Brick

		var qmBrick = new QMBrick({
				ctx : ctx,
				x : cnt == 0 ? GLOBAL_spaceBetweenInitmenuBricks : (cnt * (GLOBAL_dataBrickWidth + GLOBAL_spaceBetweenInitmenuBricks) + GLOBAL_spaceBetweenInitmenuBricks),
				y : bottomOfMenu,
				type : 'result',
				description : 'new QM',
				weight : 1,
				color : "white", //"rgb(" + randomIntFromInterval(100, 255) + "," + randomIntFromInterval(100, 255) + "," + randomIntFromInterval(100, 255) + ")",
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
				this.deleteMenuSelection();
				brick.setBorder(true);
				selectedBrick = brick;
				selectionClick = true;
				return (true);
			}
		}
		selectionClick = false;

		if (startX >= menuHideButton.xPos && startX <= menuHideButton.xPos + menuHideButton.width && startY >= menuHideButton.yPos && startY <= menuHideButton.yPos + menuHideButton.height) {
			//MENU BUTTON PRESSED!
			menuHideButton.hidden = !menuHideButton.hidden;
			if (menuHideButton.hidden) {
				//TRANFROM up
				controller.transformMovable(0, bottomOfMenu, 0, 0);
			} else {
				//TRANFROM down
				controller.transformMovable(0, 0, 0, bottomOfMenu);
			}
			return (true);
		} else if (startX >= menuSaveButton.xPos && startX <= menuSaveButton.xPos + menuSaveButton.width && startY >= menuSaveButton.yPos && startY <= menuSaveButton.yPos + menuSaveButton.height) {
			//MENU SAVE BUTTON PRESSED
			//NO WE HAVE TO STROE EVERYTHING TO A JSON STRING
			var jsonObject = {};
			var menuBrickJsonStringArray = [];
			for (var i = 0; i < menuBricks.length; i++) {
				menuBrickJsonStringArray.push(menuBricks[i].toJSONString());
			}
			//console.log(JSON.stringify(menuBrickJsonStringArray));
			jsonObject.menuBricks = JSON.stringify(menuBrickJsonStringArray);
			jsonObject.moveableBricks = controller.getMoveableBricksInJsonFormat();
			jsonObject.connectors = controller.getConnectorsInJsonFormat();
			//console.log(JSON.stringify(jsonObject));

			//Create the formula
			var qmArray = controller.createFormulaForQM();
			/*console.log("LENGTH: " + qmArray.length);
			for (var i = 0; i < qmArray.length; i++) {
			console.log("FROMULA: " + qmArray[i]);
			}*/
			controller.saveQMFormula(qmArray, JSON.stringify(jsonObject));
			return (true);
		}
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

	menuBricksEventHandler.setData = function (d) {
		data = d;
	}

	menuBricksEventHandler.getBottomOfTheMenu = function () {
		return bottomOfMenu;
	}

	return menuBricksEventHandler;

}

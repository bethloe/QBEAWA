var ArticleLogicSemanticZooming = function (vals) {
	var GLOBAL_network = vals.network;
	var GLOBAL_minID = vals.minID;
	var GLOBAL_maxID = vals.maxID;
	var GLOBAL_minX = vals.minX;
	var GLOBAL_maxX = vals.maxX;
	var GLOBAL_minY = vals.minY;
	var GLOBAL_maxY = vals.maxY;
	var GLOBAL_data = vals.data; //data.nodes, data.edges
	var GLOBAL_articleName = vals.articleName;
	var GLOBAL_controller = vals.controller;
	var GLOBAL_renderer = vals.renderer;
	var articleRendererSemanticZooming = {};

	//
	var nodesHideAndSeek = new vis.DataSet();
	var textNodes = new vis.DataSet();
	var levelOfSemanticZooming = 0;
	var intoOverviewMode = false;
	var hideSectionText = false;
	var centerAfterScaling = true;
	//SWITCH ON OFF FLAGS
	var hideParagraphMode = true;
	var overviewMode = true;
	var imageSwitcher = false;
	//------------------------------
	var hideTextAt = 0.02;
	var switchToOverviewModeAt = 0.007;

	function scaleWikiImage(min, max, total, value) {
		//console.log("IN HERE");
		if (max == min) {
			return 0.5;
		} else {
			var scale = 1 / (max - min);
			return Math.max(0, (value - min) * scale);
		}

	}
	articleRendererSemanticZooming.reset = function () {}
	articleRendererSemanticZooming.func_overviewMode = function () {
		if (GLOBAL_network.getScale() < switchToOverviewModeAt && !intoOverviewMode) {
			var items = GLOBAL_data.nodes.get();
			for (var i = 0; i < items.length; i++) {
				if (idInRange(items[i].id))
					nodesHideAndSeek.add(items[i]);
			}
			var idCounter = GLOBAL_renderer.getIdCounter();
			var x = ((GLOBAL_renderer.getBiggestXValue() + GLOBAL_renderer.getSmallestXValue()) / 2);
			var y = GLOBAL_renderer.getSmallestYValue();
			GLOBAL_renderer.cleanUp();
			GLOBAL_data.nodes.add({
				id : idCounter,
				x : x,
				y : y,
				//title : GLOBAL_articleName,
				label : GLOBAL_articleName,
				image : "media/wikiLogo.png",
				shape : "image",
				//widthMin : 1000,
				//widthMax : 1100,
				fontSize : 6000,
				fontSizeMin : 6000,
				fontSizeMax : 6010,
				value : 50000,

				allowedToMoveX : true,
				allowedToMoveY : true
			});
			intoOverviewMode = true;
			GLOBAL_renderer.setIdCounter(idCounter + 1); //Race condition!!!! :-(

			GLOBAL_renderer.centerWithoutScaling();
		}

		if (GLOBAL_network.getScale() >= switchToOverviewModeAt && intoOverviewMode) {
			intoOverviewMode = false;
			GLOBAL_renderer.cleanUp();
			var items = nodesHideAndSeek.get();

			for (var i = 0; i < items.length; i++) {
				GLOBAL_data.nodes.add(items[i]);
			}
			nodesHideAndSeek.clear();

		}
	}
	function getMaxLevel() {
		var items = GLOBAL_data.nodes.get();
		var maxLevel = -1;
		for (var i = 0; i < items.length; i++) {
			if (items[i].wikiLevel > maxLevel && idInRange(items[i].id))
				maxLevel = items[i].wikiLevel;
		}
		return maxLevel;
	}

	function redrawSections() {
		var items = GLOBAL_data.nodes.get();
		var currentlevelCnt = getMaxLevel();
		var sumHeight = 0;
		var heightCnt = 0;
		var currentLevelMaxX = 0;
		var oldLevelMaxX = 0;
		var addX = 0;
		var addY = 5000;
		for (var clc = currentlevelCnt; clc >= -1; clc--) {

			items = GLOBAL_data.nodes.get();
			if (currentLevelMaxX < oldLevelMaxX) {
				var offset = (oldLevelMaxX - currentLevelMaxX) / 2;
				//console.log("OFFSET: " + offset);
				for (var i = 0; i < items.length; i++) {
					var item = items[i];
					if (item.type == 'section' && idInRange(item.id) && item.wikiLevel == clc + 1) {
						GLOBAL_data.nodes.update({
							id : item.id,
							x : item.x + offset,
							title : item.x + offset
						});
						currentLevelMaxX = item.x + offset;
					}
				}
			}
			if (clc > -1) {
				//oldLevelMaxX = currentLevelMaxX;
				var sumWidth = 0;
				var heightAddFlag = true;
				//console.log("-------------------------LEVEL: " + clc);
				for (var i = 0; i < items.length; i++) {
					var item = items[i];
					if (item.type == 'section' && idInRange(item.id) && item.wikiLevel == clc) {
						if (heightAddFlag) {
							//console.log("HEIGHT: " + item.height);
							sumHeight += (item.height + (item.height / 2));
							heightAddFlag = false;
							heightCnt++;
						}
						GLOBAL_data.nodes.update({
							id : item.id,
							x : sumWidth == 0 ? 0 : sumWidth + (item.width / 2) + addX,
							title : sumWidth + (item.width / 2) + 2000,
							/*space between*/
							y : clc == currentlevelCnt ? GLOBAL_maxY : (GLOBAL_maxY - (sumHeight + (item.height / 2) + addY * heightCnt))
						});

						sumWidth += (item.width);
						//console.log("LABEL : " + item.label + " " + item.width + " " + item.x + " " + item.y + " " + (GLOBAL_maxY - (sumHeight + (item.height / 2) + addY)));
						currentLevelMaxX = sumWidth + (item.width / 2) + addX;

						if (clc == currentlevelCnt)
							oldLevelMaxX = sumWidth + (item.width / 2) + addX;

					}
				}

				console.log("-------------------------LEVEL ENDS ---------------- " + sumHeight);
			}
		}

	}

	function getMaxHeightOfLevelTextNodes(level) {
		var items = GLOBAL_data.nodes.get();
		var maxHeight = -1;
		for (var i = 0; i < items.length; i++) {
			if (items[i].wikiLevel == level && items[i].height > maxHeight && idInRange(items[i].id) && items[i].type == "text")
				maxHeight = items[i].height;
		}
		return maxHeight;
	}

	function getMaxHeightOfLevelSectionNodes(level) {
		var items = GLOBAL_data.nodes.get();
		var maxHeight = -1;
		for (var i = 0; i < items.length; i++) {
			if (items[i].wikiLevel == level && items[i].height > maxHeight && idInRange(items[i].id) && items[i].type == "section")
				maxHeight = items[i].height;
		}
		return maxHeight;
	}

	function redrawSectionsWithText() {

		var items = GLOBAL_data.nodes.get();
		var currentlevelCnt = getMaxLevel();
		var sumHeight = 0;
		var heightCnt = 0;
		var currentLevelMaxX = 0;
		var oldLevelMaxX = 0;
		var addXSections = 200;
		var addXText = 50;
		var addY = 500;
		var bottomLevel = true;

		var xMult = 0;
		for (var clc = currentlevelCnt; clc >= -1; clc--) {
			items = GLOBAL_data.nodes.get();

			var maxHeightTextNodes = getMaxHeightOfLevelTextNodes(clc);
			var maxHeightSectionNodes = getMaxHeightOfLevelSectionNodes(clc);
			var sumWidth = 0;
			var heightAddFlag = true;
			//	console.log("-------------------------LEVEL: " + clc);
			var textFoundInLevel = false;
			xMult = 0;
			for (var i = 0; i < items.length; i++) {

				var item = items[i];
				if (item.type == 'text' && idInRange(item.id) && item.wikiLevel == clc) {

					GLOBAL_data.nodes.update({
						id : item.id,
						x : sumWidth == 0 ? 0 : sumWidth + (item.width / 2) + addXText * xMult,
						title : sumWidth + (item.width / 2) + 2000,
						/*space between*/
						y : bottomLevel ? GLOBAL_maxY : (GLOBAL_maxY - (sumHeight + (item.height / 2) + addY * heightCnt))
					});
					xMult++;
					sumWidth += (item.width);
					//console.log("Type : " + item.type + " " + item.width + " " + item.x + " " + item.y + " " + (GLOBAL_maxY - (sumHeight + (item.height / 2) + addY)));
					currentLevelMaxX = sumWidth + (item.width / 2) + addXText * xMult;

					if (bottomLevel)
						oldLevelMaxX = sumWidth + (item.width / 2) + addXText * xMult;
					textFoundInLevel = true;
				}
			}
			if (heightAddFlag) {
				//	console.log("HEIGHT: " + item.height);
				sumHeight += maxHeightTextNodes; //(item.height + (item.height / 2));
				heightAddFlag = false;
				heightCnt++;
			}

			if (bottomLevel && textFoundInLevel) {
				bottomLevel = false;
			}
			items = GLOBAL_data.nodes.get();

			if (currentLevelMaxX < oldLevelMaxX) {
				//	console.log("OFFSET: " + offset);
				var offset = (oldLevelMaxX - currentLevelMaxX) / 2;
				for (var i = 0; i < items.length; i++) {
					var item = items[i];
					if ((item.type == 'text') && (idInRange(item.id) && item.wikiLevel == clc)) {
						GLOBAL_data.nodes.update({
							id : item.id,
							x : item.x + offset,
							title : item.x + offset
						});
						currentLevelMaxX = item.x + offset;
					}
				}
			}
			sumWidth = 0;

			heightAddFlag = true;

			items = GLOBAL_data.nodes.get();
			xMult = 0;
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (item.type == 'section' && idInRange(item.id) && item.wikiLevel == clc) {

					GLOBAL_data.nodes.update({
						id : item.id,
						x : sumWidth == 0 ? 0 : sumWidth + (item.width / 2) + addXSections * xMult,
						title : sumWidth + (item.width / 2) + 2000,
						/*space between*/
						y : bottomLevel ? GLOBAL_maxY : (GLOBAL_maxY - (sumHeight + (item.height / 2) + addY * heightCnt))
					});
					xMult++;
					sumWidth += (item.width);
					//	console.log("Type : " + item.id + " " + item.type + " " + item.width + " " + item.x + " " + item.y + " " + (GLOBAL_maxY - (sumHeight + (item.height / 2) + addY)));
					currentLevelMaxX = sumWidth + (item.width / 2) + addXSections * xMult;

					if (bottomLevel || (sumWidth + (item.width / 2) + addXSections * xMult) > oldLevelMaxX)
						oldLevelMaxX = sumWidth + (item.width / 2) + addXSections * xMult;

				}
			}
			if (heightAddFlag) {
				//	console.log("HEIGHT: " + item.height);
				sumHeight += maxHeightSectionNodes; //(item.height + (item.height / 2));
				heightAddFlag = false;
				heightCnt++;
			}
			bottomLevel = false;

			items = GLOBAL_data.nodes.get();
			if (currentLevelMaxX < oldLevelMaxX) {
				var offset = (oldLevelMaxX - currentLevelMaxX) / 2;
				//	console.log("currentLevelMaxX : " + currentLevelMaxX + " oldLEVELMAXX : " + oldLevelMaxX + " OFFSET: " + offset);
				for (var i = 0; i < items.length; i++) {
					var item = items[i];
					if (item.type == 'section' && idInRange(item.id) && item.wikiLevel == clc) {

						//	console.log("UPDATING ID: " + item.id + " before " + item.x + " after " + parseFloat(item.x + offset));
						GLOBAL_data.nodes.update({
							id : item.id,
							x : parseFloat(item.x + offset),
							title : "ID: " + item.id + (item.x + offset)
						});
						currentLevelMaxX = item.x + offset;
					}
				}
			}
			//console.log("-------------------------LEVEL ENDS ---------------- " + sumHeight);

		}

	}

	function func_test() {
		if (!hideSectionText) {
			hideSectionText = true;
			var object = {};
			object.scale = 0.12;
			GLOBAL_network.moveTo(object);
			centerAfterScaling = true;
			var items = GLOBAL_data.nodes.get();

			var xCnt = 0;
			var yCnt = 0;
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (item.type == 'text' && idInRange(item.id)) {
					textNodes.add(item);
				}

			}
			GLOBAL_network.redraw();
			GLOBAL_network
			items = textNodes.get();
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				GLOBAL_data.nodes.remove(item.id);
			}

			/*items = GLOBAL_data.nodes.get();
			for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (item.type == 'section' && idInRange(item.id)) {
			GLOBAL_data.nodes.update({
			id : item.id,
			fontSize : parseFloat(10.4 / (GLOBAL_network.getScale() + 0.15)),
			fontSizeMin : parseFloat(10.4 / (GLOBAL_network.getScale() + 0.15)),
			fontSizeMax : parseFloat(10.4 / (GLOBAL_network.getScale() + 0.15)) + 10
			});
			}

			}
			GLOBAL_network.redraw();
			GLOBAL_renderer.redraw();
			if (centerAfterScaling) {
			GLOBAL_renderer.centerWithoutScaling();
			}*/
		}
		console.log("GLOBAL_network.getScale() : " + GLOBAL_network.getScale());
		items = GLOBAL_data.nodes.get();
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (item.type == 'section' && idInRange(item.id)) {
				GLOBAL_data.nodes.update({
					id : item.id,
					fontSize : parseFloat(10.4 / (GLOBAL_network.getScale())),
					fontSizeMin : parseFloat(10.4 / (GLOBAL_network.getScale())),
					fontSizeMax : parseFloat(10.4 / (GLOBAL_network.getScale())) + 10
				});
			}

		}
		GLOBAL_network.redraw();
		GLOBAL_renderer.redraw();
		if (centerAfterScaling) {
			GLOBAL_renderer.centerWithoutScaling();
		}

	}
	function func_hideParagraphMode() {
		//	if (GLOBAL_network.getScale() < hideTextAt && !hideSectionText) {
		hideSectionText = true;

		centerAfterScaling = true;
		var items = GLOBAL_data.nodes.get();

		var xCnt = 0;
		var yCnt = 0;
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (item.type == 'text' && idInRange(item.id)) {
				textNodes.add(item);
			}
			if (item.type == 'section' && idInRange(item.id)) {
				console.log("IN HERE " + item.id + " " + xCnt + " " + (item.x + xCnt) + " " + (item.y + yCnt) + " " + yCnt);
				GLOBAL_data.nodes.update({
					id : item.id,
					//x : (item.x + xCnt),
					//y : (item.y + yCnt),
					title : item.x + xCnt + " " + item.y + yCnt,
					/*fontSize : 1000 / GLOBAL_network.getScale(),
					fontSizeMin : 1000 / GLOBAL_network.getScale(),
					fontSizeMax : 1000 / GLOBAL_network.getScale()*/
					fontSize : 2000,
					fontSizeMin : 2000,
					fontSizeMax : 2100

				});
				xCnt += 10000;
				yCnt += 10000;
			}

		}
		GLOBAL_network.redraw();

		items = textNodes.get();
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			GLOBAL_data.nodes.remove(item.id);
		}

		//	}

		if (GLOBAL_network.getScale() < hideTextAt) {
			redrawSections();
			if (centerAfterScaling) {
				centerAfterScaling = false;
				GLOBAL_renderer.centerWithoutScaling();
			}
		}

		if (GLOBAL_network.getScale() >= hideTextAt && hideSectionText) {

			centerAfterScaling = true;
			hideSectionText = false;
			console.log("IN HERE");

			GLOBAL_network.redraw();
		}
		if (GLOBAL_network.getScale() >= hideTextAt) {
			items = GLOBAL_data.nodes.get();
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (item.type == 'section' && idInRange(item.id)) {
					GLOBAL_data.nodes.update({
						id : item.id,
						fontSize : parseFloat(10.4 / GLOBAL_network.getScale()),
						fontSizeMin : parseFloat(10.4 / GLOBAL_network.getScale()),
						fontSizeMax : parseFloat(10.4 / GLOBAL_network.getScale()) + 10
					});
				}

			}
			GLOBAL_network.redraw();
			GLOBAL_renderer.redraw();
			if (centerAfterScaling) {
				GLOBAL_renderer.centerWithoutScaling();
			}
		}
	}
	articleRendererSemanticZooming.reloadData = function () {
		hideSectionText = false;
		var items = textNodes.get();
		if (items.length > 0) {
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				GLOBAL_data.nodes.add(item);
			}
			items = GLOBAL_data.nodes.get();
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (item.type == 'section' && idInRange(item.id)) {
					GLOBAL_data.nodes.update({
						id : item.id,
						fontSize : 14,
						fontSizeMin : 14,
						fontSizeMax : 30
					});
				}
			}
			textNodes.clear();
		}
		var items = nodesHideAndSeek.get();
		if (items.length > 0) {
			intoOverviewMode = false;
			GLOBAL_renderer.cleanUp();
			var items = nodesHideAndSeek.get();

			for (var i = 0; i < items.length; i++) {
				GLOBAL_data.nodes.add(items[i]);
			}
			nodesHideAndSeek.clear();
		}

	}
	articleRendererSemanticZooming.doZooming = function (properties) {

		//IMPLEMENT SEMANTIC ZOOMING HERE
		//LET'S A PLAY HIDE AND A SEEK AH (Pls read with an italian accent ;-)

		//---------------------------------------------------------
		// HIDE PARAGRAPHS MODE
		//console.log("SCALE: " + GLOBAL_network.getScale());
		if (hideParagraphMode) {
			//func_hideParagraphMode();
			func_test();
		}

		//---------------------------------------------------------
		// OVERVIEW MODE
		//if (overviewMode) {
		//	articleRendererSemanticZooming.func_overviewMode();
		//}
		//----------------------------------------------------------------
		/*if (imageSwitcher) {
		if (GLOBAL_network.getScale() < 1 && levelOfSemanticZooming < 1) {
		//console.log("GLOBAL_network.getSCALE < 1!!!");
		levelOfSemanticZooming = 1;
		var items = GLOBAL_data.nodes.get();

		for (var i = 0; i < items.length; i++) {
		if (items[i].hasOwnProperty('image') && idInRange(items[i].id)) {
		var help = items[i].image;

		GLOBAL_data.nodes.update({
		id : items[i].id,
		label : 'test' + i,
		image : items[i].dataToChange,
		dataToChange : help
		});
		}

		}
		}

		if (GLOBAL_network.getScale() >= 1 && levelOfSemanticZooming >= 1) {
		levelOfSemanticZooming = 0;

		var items = GLOBAL_data.nodes.get();

		for (var i = 0; i < items.length; i++) {
		if (items[i].hasOwnProperty('image') && idInRange(items[i].id)) {
		//console.log("images: " + items[i].id);
		//GLOBAL_data.update({id: 1, text: 'item 1 (updated)'}); // triggers an 'update' event
		var help = items[i].image;

		GLOBAL_data.nodes.update({
		id : items[i].id,
		label : 'test' + i,
		image : items[i].dataToChange,
		dataToChange : help
		});
		}

		}
		}
		}*/
	}

	//---------------------------------- Helpers -------------------------------
	var idInRange = function (id) {
		return id >= GLOBAL_minID && id <= GLOBAL_maxID ? true : false;
	}
	return articleRendererSemanticZooming;
};

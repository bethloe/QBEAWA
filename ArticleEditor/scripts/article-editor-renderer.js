var ArticleRenderer = function (vals) {
	var GLOBAL_network = vals.network;
	console.log("GLOBAL_network: " + GLOBAL_network);
	var GLOBAL_minID = vals.minID;
	var GLOBAL_maxID = vals.maxID;
	var GLOBAL_minX = vals.minX;
	var GLOBAL_maxX = vals.maxX;
	var GLOBAL_minY = vals.minY;
	var GLOBAL_maxY = vals.maxY;
	var GLOBAL_data = vals.data; //data.nodes, data.edges
	var GLOBAL_articleName = vals.articleName;
	var GLOBAL_controller = vals.controller;

	//create new DataRetriever
	var dataRetriever = new DataRetriever();

	//DataSets for operations
	var nodesHideAndSeek = new vis.DataSet();
	var textNodes = new vis.DataSet();
	var allNodesBackup = new vis.DataSet();

	//Flags and variables for operations
	var showReferencesFlag = false;
	var levelOfSemanticZooming = 0;
	var intoOverviewMode = false;
	var hideSectionText = false;
	var hideTextAt = 0.1;
	var switchToOverviewModeAt = 0.05;
	var hideParagraphMode = false;
	var overviewMode = false;
	var imageSwitcher = false;
	var sectionNodes = [];
	var sectionsSplitted = false;
	var viewJustSpecificSection = false;

	//GLOBAL ID COUNTER
	var GLOBAL_idCounter = GLOBAL_minID;
	var GLOBAL_startID = GLOBAL_minID;

	var articleRenderer = {};

	var cleanUp = function () {
		var items = GLOBAL_data.nodes.get();
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (idInRange(item.id))
				GLOBAL_data.nodes.remove(item.id);
		}
	}

	articleRenderer.retrieveData = function () {
		dataRetriever.setTitle(GLOBAL_articleName);
		dataRetriever.getAllMeasures();
	}

	articleRenderer.copy = function () {
		var items = GLOBAL_data.nodes.get();
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			GLOBAL_data.nodes.add({
				id : GLOBAL_idCounter,
				x : item.x + 30000,
				y : item.y,
				title : item.title,
				label : item.label,
				image : item.image,
				shape : item.shape,
				//value : 30,
				allowedToMoveX : item.allowedToMoveX,
				allowedToMoveY : item.allowedToMoveY,
				type : item.type,
				wikiLevel : item.wikiLevel,
				masterId : item.masterId

			});
			GLOBAL_idCounter++;
		}
	}

	var getNodeToSectionName = function (sectionName) {
		var items = GLOBAL_data.nodes.get();

		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (item.type == "section" && idInRange(item.id)) {
				console.log("|" + item.label + "| |" + sectionName + "|");
				if (item.label == sectionName) {
					console.log("sectionName: " + sectionName + " == " + item.label);
					return item;
				}
			}
		}
		return null;
	}

	articleRenderer.posImages = function () {
		var somethingIsChanging = 0;

		var maxX = this.getBiggestXValue();
		var minX = this.getSmallestXValue();
		var maxY = this.getBiggestYValue();
		var minY = this.getSmallestYValue();
		do {
			somethingIsChanging = 0;
			var items = GLOBAL_data.nodes.get();
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (item.type == 'img' && idInRange(item.id)) {
					for (var j = 0; j < items.length; j++) {
						var innerItem = items[j];
						if (innerItem.type == 'img' && innerItem.id != item.id) {
							//console.log("width: " + innerItem.width + " height: " + innerItem.height);
							//console.log(item.x + " >= " + innerItem.x + " && " + item.x + " <= " + (innerItem.x + innerItem.width) + " && " + item.y + " >= " + innerItem.y + " && " + item.y + " <= " + (innerItem.y + innerItem.height));
							if (item.x >= innerItem.x && item.x <= (innerItem.x + innerItem.width) && item.y >= innerItem.y && item.y <= (innerItem.y + innerItem.height)) {
								//console.log("IN HERE");

								somethingIsChanging++;
								if (item.x <= minX || item.y <= minY)
									GLOBAL_data.nodes.update({
										id : item.id,
										x : item.x - innerItem.width,
										y : item.y - innerItem.height
									});
								else
									GLOBAL_data.nodes.update({
										id : item.id,
										x : item.x + innerItem.width,
										y : item.y + innerItem.height
									});
							}
						}
					}

				}

			}
			console.log("------------------------------------------> " + somethingIsChanging);
		} while (somethingIsChanging > 0);
	}

	articleRenderer.showImages = function () {
		var images = dataRetriever.getImageArray();
		var maxX = this.getBiggestXValue();
		var minX = this.getSmallestXValue();
		var maxY = this.getBiggestYValue();
		var minY = this.getSmallestYValue();
		var offsetY = 1000;
		var offsetX = 2000;
		for (var i = 0; i < images.length; i++) {
			var image = images[i];
			var x = getRandomInt(minX, maxX);
			var y = getRandomInt(minY, maxY);

			if (i % 2 == 0) {
				if (getRandomInt(1, 2) == 1)
					y = minY - offsetY;
				else
					y = maxY + offsetY;
			} else {
				if (getRandomInt(1, 2) == 1)
					x = minX - offsetX;
				else
					x = maxX + offsetX;
			}
			GLOBAL_data.nodes.add({
				id : GLOBAL_idCounter,
				x : x,
				y : y,
				title : image,
				label : image,
				image : image,
				shape : "image",
				//value : 30,
				allowedToMoveX : true,
				allowedToMoveY : true,
				type : "img",
				wikiLevel : -1,
				masterId : -1

			});
			GLOBAL_idCounter++;
		}
		console.log("END");

		GLOBAL_network.redraw();
		//Now that we have the height and the width of the images we can put them into a non overlapping position
	}

	articleRenderer.hideImages = function () {
		var items = GLOBAL_data.nodes.get();
		for (var i = 0; i < items.length; i++) {
			if (items[i].type == 'img' && idInRange(items[i].id))
				GLOBAL_data.nodes.remove(items[i].id);
		}
	}

	articleRenderer.showReferences = function () {
		showReferencesFlag = true;
		var refs = dataRetriever.getAllReferences();
		var rawTextWithData = dataRetriever.getRawTextWithData();
		var sectionNameToRefCnt = {};
		for (var i = 0; i < refs.length; i++) {
			console.log(refs[i]);
			try {
				if (rawTextWithData.search(refs[i]) > -1) {
					var sectionName = getSectionToRef(rawTextWithData, refs[i]);
					console.log("SECTIONNAME: " + sectionName);
					if (sectionName != undefined) { //WE HAVE SOME UNDEFINED SECTION NAMES BECAUSE OF THE INTRO!!
						//console.log("REF: " + refs[i]);
						var item = getNodeToSectionName(sectionName);
						if (item != null) {
							var idHelp = item.id;
							//NOW WE HAVE THE SECTION HEADLINE NODE BUT WE WANT THE TEXT NODES SO LET'S GO ON
							var children = getAllChildrenOfANode(item.id);
							var childrenItem = children.get();
							var xPos = item.x;
							var yPos = item.y;
							var height = item.height;
							var wikiLevel = item.wikiLevel;
							var masterId = item.masterId;
							var idHelp = item.id;
							var xyOffset = 0;

							if (childrenItem.length > 0) {
								xPos = childrenItem[0].x;
								yPos = childrenItem[0].y;
								height = childrenItem[0].height;
								wikiLevel = childrenItem[0].wikiLevel;
								masterId = childrenItem[0].masterId;
								idHelp = childrenItem[0].id;
							}
							if (!sectionNameToRefCnt.hasOwnProperty(sectionName)) {
								sectionNameToRefCnt[sectionName] = 1;
							} else {
								sectionNameToRefCnt[sectionName] += 1;
							}
							xyOffset = sectionNameToRefCnt[sectionName];

							//console.log("sectionName: " + sectionName + " x: " + item.x + " ref: " + refs[i] + " id : " + idHelp);
							GLOBAL_data.nodes.add({
								id : GLOBAL_idCounter,
								x : i % 2 == 0 ? xPos + xyOffset * 30 : xPos - xyOffset * 30,
								y : yPos + height + xyOffset * 60, //i%2==0?500:-7000,
								title : refs[i],
								label : refs[i],
								value : 1,
								shape : 'box',
								type : 'ref',
								allowedToMoveX : true,
								allowedToMoveY : true,
								wikiLevel : wikiLevel,
								masterId : masterId //if from == -1 the no master
							});

							GLOBAL_data.edges.add({
								from : GLOBAL_idCounter,
								to : idHelp,
								style : "arrow"
							});

							GLOBAL_idCounter++;
						}
					}
				}
			} catch (err) {
				console.log(err);
			}
		}
	}

	articleRenderer.hideReferences = function () {
		showReferencesFlag = false;
		var items = GLOBAL_data.nodes.get();
		for (var i = 0; i < items.length; i++) {
			if (items[i].type == "ref" && idInRange(items[i].id)) {
				GLOBAL_data.nodes.remove(items[i].id);
			}
		}
	}

	var center = function () {
		console.log(articleRenderer.getBiggestXValue() + " " + articleRenderer.getBiggestYValue() + " " + articleRenderer.getSmallestXValue() + " " + articleRenderer.getSmallestYValue());
		var object = {};
		object.position = {
			x : (articleRenderer.getBiggestXValue() + articleRenderer.getSmallestXValue()) / 2,
			y : (articleRenderer.getSmallestYValue() + articleRenderer.getBiggestYValue()) / 2
		};
		object.scale = 0.07;
		GLOBAL_network.moveTo(object);

	}

	articleRenderer.fillDataNew = function () {
		cleanUp();
		var sectionInfos = dataRetriever.getSectionInfos();
		var articleText = dataRetriever.getRawText();
		var xOffset = 1500;
		var yOffset = 600;
		var idCnt = 0;
		var levelOld = 0;
		var currentLevel = 0;
		var topIds = [];
		var sameSectionPosition = [];
		for (var i = 0; i < sectionInfos.length; i++) {

			currentLevel = parseInt(sectionInfos[i].level);
			//console.log("CURRENT LEVEL: " + currentLevel);
			var from = -1;
			for (var j = 0; j < topIds.length; j++) {
				if (topIds[j].level == sectionInfos[i].toclevel) {
					from = topIds[j].id;
				}
			}
			if (currentLevel == levelOld) {

				var sectionsInSameLevel = 0;
				for (var j = 0; j < sameSectionPosition.length; j++) {
					if (sameSectionPosition[j].level == currentLevel) {
						sectionInSameLevelAlreadyDefined = true;
						sameSectionPosition[j].sectionsInSameLevel += 1;
						sectionsInSameLevel = sameSectionPosition[j].sectionsInSameLevel;
					}
				}
				GLOBAL_data.nodes.add({
					id : GLOBAL_idCounter,
					x : sectionsInSameLevel * xOffset + GLOBAL_minX,
					y : currentLevel * yOffset +  + GLOBAL_minY,
					title : sectionInfos[i].line,
					label : sectionInfos[i].line, // + ' currentLEVEL: ' + currentLevel + ' x: ' + (sectionInfos[i].level * xOffset) + ' y: ' + (sectionsInSameLevel * yOffset),
					value : 1,
					allowedToMoveX : true,
					allowedToMoveY : true,
					wikiLevel : currentLevel,
					masterId : from, //if from == -1 the no master
					type : 'section'
				});
				idCnt = GLOBAL_idCounter;
				GLOBAL_idCounter++;
				var textOfSection = getTextOfSection(sectionInfos[i].line);

				//console.log("-----------------------> " + sectionInfos[i].line + " ---- > " + textOfSection);
				//console.log("LENGTH: " + textOfSection.length);
				if (textOfSection != "" && textOfSection.length > 10) {

					var value = textOfSection.split(' ').length;
					textOfSection = repalceNewLineWithTwoNewLines(textOfSection, "\n", "\n\n", 1);
					textOfSection = replaceCharacterWithAnother(textOfSection, " ", '\n', 10);
					GLOBAL_data.nodes.add({
						id : GLOBAL_idCounter,
						x : sectionsInSameLevel * xOffset + GLOBAL_minX,
						y : currentLevel * yOffset + 800 +  + GLOBAL_minY,
						title : textOfSection.length > 50 ? textOfSection.substring(0, 50) + "..." : textOfSection.substring(0, 10) + "...",
						label : textOfSection,
						value : value,
						shape : 'box',
						allowedToMoveX : true,
						allowedToMoveY : true,
						wikiLevel : currentLevel,
						masterId : idCnt, //if from == -1 the no master
						type : 'text'
					});
					GLOBAL_data.edges.add({
						from : idCnt,
						to : GLOBAL_idCounter,
						style : "arrow"
					});
					GLOBAL_idCounter++;

					GLOBAL_network.redraw();
				}

			} else {
				levelOld = currentLevel;
				var sectionInSameLevelAlreadyDefined = false;
				var sectionsInSameLevel = 0;
				for (var j = 0; j < sameSectionPosition.length; j++) {
					if (sameSectionPosition[j].level == currentLevel) {
						sectionInSameLevelAlreadyDefined = true;
						sameSectionPosition[j].sectionsInSameLevel += 1;
						sectionsInSameLevel = sameSectionPosition[j].sectionsInSameLevel;
					}
				}
				if (!sectionInSameLevelAlreadyDefined)
					sameSectionPosition.push({
						level : currentLevel,
						sectionsInSameLevel : 0
					});

				GLOBAL_data.nodes.add({
					id : GLOBAL_idCounter,
					x : sectionsInSameLevel * xOffset + GLOBAL_minX,
					y : currentLevel * yOffset + GLOBAL_minY,
					title : sectionInfos[i].line,
					label : sectionInfos[i].line, // + ' currentLEVEL: ' + currentLevel + ' x: ' + (sectionInfos[i].level * xOffset) + ' y: ' + (sectionsInSameLevel * yOffset),
					value : 1,
					allowedToMoveX : true,
					allowedToMoveY : true,
					wikiLevel : currentLevel,
					masterId : from, //if from == -1 the no master
					type : 'section'
				});
				idCnt = GLOBAL_idCounter;
				GLOBAL_idCounter++;
				var textOfSection = getTextOfSection(sectionInfos[i].line);
				//console.log("-----------------------> " + sectionInfos[i].line + " ---- > " + textOfSection);
				if (textOfSection != "" && textOfSection.length > 10) {

					var value = textOfSection.split(' ').length;
					textOfSection = repalceNewLineWithTwoNewLines(textOfSection, "\n", "\n\n", 1);
					textOfSection = replaceCharacterWithAnother(textOfSection, " ", '\n', 10);
					GLOBAL_data.nodes.add({
						id : GLOBAL_idCounter,
						x : sectionsInSameLevel * xOffset + 800 + GLOBAL_minX,
						y : currentLevel * yOffset + GLOBAL_minX,
						title : textOfSection.length > 50 ? textOfSection.substring(0, 50) + "..." : textOfSection.substring(0, 10) + "...",
						label : textOfSection,
						shape : 'box',
						value : value,
						allowedToMoveX : true,
						allowedToMoveY : true,
						wikiLevel : currentLevel,
						masterId : idCnt, //if from == -1 the no master
						type : 'text'
					});
					GLOBAL_data.edges.add({
						from : idCnt,
						to : GLOBAL_idCounter,
						style : "arrow"
					});
					GLOBAL_idCounter++;
				}

			}
			//CHECK topIds
			for (var j = 0; j < topIds.length; j++) {
				if (topIds[j].level == currentLevel) {
					topIds.splice(j, 1); //DELETE ENTRY
				}
			}
			topIds.push({
				id : idCnt,
				toclevel : sectionInfos[i].toclevel,
				level : currentLevel
			});

			if (idCnt != 0 && from != -1) {

				GLOBAL_data.edges.add({
					from : from,
					to : idCnt,
					style : "arrow"
				});
			}
			//idCnt++;

		}

		GLOBAL_network.redraw();
		redraw();
		center();
	}

	function redraw() {
		GLOBAL_network.redraw();
		var currentlevelCnt = getMaxLevel();
		var sumMaxHeightOfLevel = 0; //BUG IN Y DIRECTION
		console.log("currentlevelCnt : " + currentlevelCnt);
		var nodesWithoutTextAsChildren = [];
		for (var clc = currentlevelCnt; clc >= 0; clc--) {
			sumMaxHeightOfLevel += getMaxHeightOfLevel(clc) + 500;
			var allMasterOfALevel = getAllTextNodeMastersOfALevel(clc);
			var xCnt = 0;
			console.log(allMasterOfALevel.length);
			for (var i = 0; i < allMasterOfALevel.length; i++) {
				var nodesHelp = getAllTextNodesSameLevelSameMaster(clc, allMasterOfALevel[i]);
				var xCntStart = 0;
				var xCntEnd = 0;
				var items = nodesHelp.get();
				//console.log("UPDATE NODE MASTER: " + allMasterOfALevel[i] + " LEVEL: " + clc);
				for (var j = 0; j < items.length; j++) {
					if (j == 0)
						xCntStart = xCnt;
					if (j + 1 == items.length)
						xCntEnd = xCnt;
					//console.log("ID: " + items[j].id + " " + xCnt + " " + items[j].width + " " + (-sumMaxHeightOfLevel) + " " + allMasterOfALevel[i] + " " + items[j].wikiLevel);
					GLOBAL_data.nodes.update({
						id : items[j].id,
						x : xCnt + GLOBAL_minX,
						y : (-sumMaxHeightOfLevel + 300) +  + GLOBAL_minY
					});
					xCnt += items[j].width + 50;
				}
				if (xCntStart == 0 && xCntEnd == 0) //No text node as child
					nodesWithoutTextAsChildren.push(GLOBAL_data.nodes.get(allMasterOfALevel[i]));
				else
					GLOBAL_data.nodes.update({
						id : allMasterOfALevel[i],
						x : ((xCntStart + xCntEnd) / 2) + GLOBAL_minX, //getXValueOfMasterNode(allMasterOfALevel[i]),//((xCntStart + xCntEnd) / 2),//
						y : -sumMaxHeightOfLevel - 300 + GLOBAL_minY //getYValueOfMasterNode(allMasterOfALevel[i])//
					});

			}
		}

		for (var i = 0; i < nodesWithoutTextAsChildren.length; i++) {
			var node = nodesWithoutTextAsChildren[i];
			if (node != null) {
				var x = getXValueOfMasterNode(node.id);
				var y = getYValueOfMasterNode(node.id);
				GLOBAL_data.nodes.update({
					id : node.id,
					x : x,
					y : y
				});
			}
		}
		GLOBAL_network.redraw();
	}

	articleRenderer.colorLevels = function (isColor) {
		var currentlevelCnt = getMaxLevel();
		for (var clc = currentlevelCnt; clc >= 0; clc--) {
			colorAllNodesOfLevel(clc, isColor ? getRandomColor() : "#97C2FC");
		}
	}

	function colorAllNodesOfLevel(level, color) {
		var items = GLOBAL_data.nodes.get();
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (item.wikiLevel == level && idInRange(item.id)) {
				GLOBAL_data.nodes.update({
					id : item.id,
					color : {
						background : color,
						border : '#2B7CE9',
						highlight : {
							background : '#D2E5FF',
							border : '#2B7CE9'
						}
					}
				});
			}

		}
	}

	articleRenderer.showNode = function (network, id) {
		if (idInRange(id)) {
			var item = GLOBAL_data.nodes.get(id);

			var object = {};
			object.position = {
				x : item.x,
				y : item.y
			};
			object.scale = 0.5;
			network.moveTo(object);
		}
	}

	articleRenderer.selectAllNodes = function () {
		var arrayToSelect = [];
		for (var i = GLOBAL_startID; i < GLOBAL_idCounter; i++) {
			arrayToSelect.push(i);
			console.log(i);
		}
		console.log("SELECT ALL NODES " + arrayToSelect.length);
		GLOBAL_network.selectNodes(arrayToSelect, true);
	}

	articleRenderer.getBiggestXValue = function () {
		var items = GLOBAL_data.nodes.get();
		var maxX = 0;
		var start = true;
		for (var i = 0; i < items.length; i++) {
			if (start && idInRange(items[i].id)) {
				start = false;
				maxX = items[i].x;
			}
			if (items[i].x > maxX && idInRange(items[i].id)) {
				maxX = items[i].x;
			}
		}

		return maxX;
	}

	articleRenderer.getBiggestYValue = function () {
		var items = GLOBAL_data.nodes.get();
		var maxY = 0;
		var start = true;
		for (var i = 0; i < items.length; i++) {
			if (start && idInRange(items[i].id)) {
				start = false;
				maxY = items[i].y;
			}
			if (items[i].y > maxY && idInRange(items[i].id)) {
				maxY = items[i].y;
			}
		}

		return maxY;

	}

	articleRenderer.getSmallestXValue = function () {
		var items = GLOBAL_data.nodes.get();
		var minX = 0;
		var start = true;
		for (var i = 0; i < items.length; i++) {
			if (start && idInRange(items[i].id)) {
				start = false;
				minX = items[i].x;
			}
			if (items[i].x < minX && idInRange(items[i].id)) {
				minX = items[i].x;
			}
		}

		return minX;
	}

	articleRenderer.getSmallestYValue = function () {
		var items = GLOBAL_data.nodes.get();
		var minY = 0;
		var start = true;
		for (var i = 0; i < items.length; i++) {
			if (start && idInRange(items[i].id)) {
				start = false;
				minY = items[i].y;
			}
			if (items[i].y < minY && idInRange(items[i].id)) {
				minY = items[i].y;
			}
		}

		return minY;

	}

	function getXValueOfMasterNode(master) {
		var items = GLOBAL_data.nodes.get();
		var minX = 0;
		var maxX = 0;
		var start = true;
		for (var i = 0; i < items.length; i++) {
			if (items[i].masterId == master && idInRange(items[i].id)) {
				if (start && idInRange(items[i].id)) {
					start = false;
					minX = items[i].x;
					maxX = items[i].x;
				}
				if (items[i].x < minX && idInRange(items[i].id)) {
					minX = items[i].x;
				}
				if (items[i].x > maxX && idInRange(items[i].id)) {
					maxX = items[i].x;
				}
			}
		}
		return (maxX + minX) / 2;
	}

	function getYValueOfMasterNode(master) {
		var items = GLOBAL_data.nodes.get();
		var minY = 0;
		var maxY = 0;
		var start = true;
		for (var i = 0; i < items.length; i++) {
			if (items[i].masterId == master && idInRange(items[i].id)) {
				if (start && idInRange(items[i].id)) {
					start = false;
					minY = items[i].y;
					maxY = items[i].y;
				}
				if (items[i].y < minY && idInRange(items[i].id)) {
					minY = items[i].y;
				}
				if (items[i].y > maxY && idInRange(items[i].id)) {
					maxY = items[i].y;
				}
			}
		}
		return minY - 300;
	}

	function getAllTextNodeMastersOfALevel(level) {
		var items = GLOBAL_data.nodes.get();
		var help = [];
		for (var i = 0; i < items.length; i++) {
			var masterInhelp = false;
			if (items[i].wikiLevel == level && idInRange(items[i].id)) {
				for (var j = 0; j < help.length; j++) {
					if (help[j] == items[i].masterId && idInRange(items[i].id)) {
						masterInhelp = true;
					}
				}
				if (!masterInhelp)
					help.push(items[i].masterId);
			}
		}
		return help;
	}

	function getAllChildrenOfANode(master) {
		var items = GLOBAL_data.nodes.get();
		var help = new vis.DataSet();
		for (var i = 0; i < items.length; i++) {
			if (items[i].masterId == master && idInRange(items[i].id)) {
				help.add(items[i]);
			}
		}
		return help;
	}

	function getAllTextNodesSameLevelSameMaster(level, master) {
		var items = GLOBAL_data.nodes.get();
		var help = new vis.DataSet();
		for (var i = 0; i < items.length; i++) {
			if (items[i].masterId == master && items[i].wikiLevel == level && items[i].type == 'text' && idInRange(items[i].id)) {
				help.add(items[i]);
			}
		}
		return help;
	}
	function getMaxHeightOfLevel(level) {
		var items = GLOBAL_data.nodes.get();
		var maxHeight = -1;
		for (var i = 0; i < items.length; i++) {
			if (items[i].wikiLevel == level && items[i].height > maxHeight && idInRange(items[i].id))
				maxHeight = items[i].height + 300;
		}
		return maxHeight;
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

	function getTextOfSection(sectionTitle) {
		console.log("sectionTITLE: " + sectionTitle);
		var stringToSearch = "== \xA7" + sectionTitle + " ==";
		var articleText = dataRetriever.getRawText();
		var index = articleText.search(stringToSearch);
		if (index == -1) {
			stringToSearch = sectionTitle;
			index = articleText.search(stringToSearch);
		}
		console.log("index: " + index);
		var str = articleText.substring((index + stringToSearch.length), articleText.length);

		str = deleteEqualsSigns(str, 0);

		index = str.search("==");
		var ret = "";
		if (index > -1)
			ret = str.substr(0, index);
		else
			ret = str;
		ret.replace("=", " ");
		return ret;
	}

	articleRenderer.onZoom = function (properties) {
		//IMPLEMENT SEMANTIC ZOOMING HERE
		//LET'S A PLAY HIDE AND A SEEK AH (Pls read with an italian accent ;-)

		//---------------------------------------------------------
		// HIDE PARAGRAPHS MODE
		if (hideParagraphMode) {
			if (GLOBAL_network.getScale() < hideTextAt && !hideSectionText) {
				hideSectionText = true;
				var items = GLOBAL_data.nodes.get();

				for (var i = 0; i < items.length; i++) {
					var item = items[i];
					if (item.type == 'text' && idInRange(item.id)) {
						textNodes.add(item);
					}
				}

				items = textNodes.get();
				for (var i = 0; i < items.length; i++) {
					var item = items[i];
					GLOBAL_data.nodes.remove(item.id);
				}
			}

			if (GLOBAL_network.getScale() >= hideTextAt && hideSectionText) {
				hideSectionText = false;
				var items = textNodes.get();
				for (var i = 0; i < items.length; i++) {
					var item = items[i];
					GLOBAL_data.nodes.add(item);
				}
				textNodes.clear();
			}
		}

		//---------------------------------------------------------
		// OVERVIEW MODE
		if (overviewMode) {
			if (GLOBAL_network.getScale() < switchToOverviewModeAt && !intoOverviewMode) {
				var items = GLOBAL_data.nodes.get();

				for (var i = 0; i < items.length; i++) {
					if (idInRange(itmes[i].id))
						nodesHideAndSeek.add(items[i]);
				}
				cleanUp()
				GLOBAL_data.nodes.add({
					id : 0,
					x : 0,
					y : 0,
					title : 'Albert Einstein',
					label : "Albert Einstein",
					fontSize : 200,
					fontSizeMin : 200,
					fontSizeMax : 210,
					allowedToMoveX : true,
					allowedToMoveY : true
				});
				intoOverviewMode = true;
			}

			if (GLOBAL_network.getScale() >= switchToOverviewModeAt && intoOverviewMode) {
				intoOverviewMode = false;
				cleanUp();
				var items = nodesHideAndSeek.get();

				for (var i = 0; i < items.length; i++) {
					GLOBAL_data.nodes.add(items[i]);
				}
				nodesHideAndSeek.clear();

			}
		}
		//----------------------------------------------------------------
		if (imageSwitcher) {
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
						console.log("images: " + items[i].id);
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
		}
	}

	articleRenderer.splitSectionsIntoParagraphs = function () {
		if (!sectionsSplitted) {
			sectionsSplitted = true;
			var items = GLOBAL_data.nodes.get();
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (item.type == 'text' && idInRange(item.id)) {
					var text = item.label;
					var paragraphArray = text.split("\n\n");
					for (var j = 0; j < paragraphArray.length; j++) {
						if (paragraphArray[j].length > 10) {
							GLOBAL_data.nodes.add({
								id : GLOBAL_idCounter,
								x : item.x,
								y : item.y,
								shape : item.shape,
								title : paragraphArray[j].length > 50 ? paragraphArray[j].substring(0, 50) + "..." : paragraphArray[j].substring(0, 10) + "...",
								label : paragraphArray[j],
								value : paragraphArray[j].length,
								allowedToMoveX : item.allowedToMoveX,
								allowedToMoveY : item.allowedToMoveY,
								wikiLevel : item.wikiLevel,
								masterId : item.masterId,
								type : item.type
							});

							GLOBAL_data.edges.add({
								from : item.masterId,
								to : GLOBAL_idCounter,
								style : "arrow"
							});

							GLOBAL_idCounter++;
						}
					}
					sectionNodes.push(item);
					GLOBAL_data.nodes.remove(item.id);
				}
			}
			redraw();
			if (showReferencesFlag) {
				hideReferences();
				showReferences();
			}
		}
	}

	articleRenderer.combineParagaphsToSections = function () {
		if (sectionsSplitted) {
			sectionsSplitted = false;
			removeAllTextNodes();
			for (var i = 0; i < sectionNodes.length; i++) {
				GLOBAL_data.nodes.add(sectionNodes[i]);
			}

			redraw();

			if (showReferencesFlag) {
				hideReferences();
				showReferences();
			}
		}
	}

	function removeAllTextNodes() {
		var items = GLOBAL_data.nodes.get();
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (item.type == 'text' && idInRange(item.id)) {
				GLOBAL_data.nodes.remove(item.id);
			}
		}
	}

	articleRenderer.onSelect = function (properties) {
		console.log("ON SELECT " + properties.nodes);
		//GLOBAL_network.focusOnNode(properties.nodes);
	}

	function getAllConnectedNodes(id, newNodeContainer) {
		var items = GLOBAL_data.nodes.get();
		for (var i = 0; i < items.length; i++) {
			var item = items[i];

			if (item.masterId == id && idInRange(item.id)) {
				newNodeContainer.add(item);
				newNodeContainer = getAllConnectedNodes(item.id, newNodeContainer);
			}
		}
		return newNodeContainer;
	}

	articleRenderer.onDoubleClick = function (properties) {
		var options = {
			scale : 8
		};
		//GLOBAL_network.focusOnNode(properties.nodes, options);
		//SHOW JUST THE SELECTED ELEMENT AND ALL ELEMENTES WHICH ARE CONNECTED TO THIS ELEMENT
		//TODO WILL BECOME A PROBLEM WHEN ADDING ELEMENTS IS POSSIBLE


		var id = properties.nodes;

		if (idInRange(id)) {
			//console.log("WHOLE: " + JSON.stringify(nodes.get(id)));
			//console.log("WIDTH: " + nodes.get(id)[0].width);
			var newNodeContainer = new vis.DataSet();
			//go recursively through all nodes
			//console.log("THE ID: " + id);

			newNodeContainer.add(GLOBAL_data.nodes.get(id));
			newNodeContainer = getAllConnectedNodes(id, newNodeContainer);

			if (!viewJustSpecificSection)
				copyAllNodesInRange(GLOBAL_data.nodes, allNodesBackup, GLOBAL_minID, GLOBAL_maxID);

			cleanUp();
			copyAllNodes(newNodeContainer, GLOBAL_data.nodes);

			viewJustSpecificSection = true;
		}
	}

	articleRenderer.showAllItems = function () {
		if (viewJustSpecificSection) {
			viewJustSpecificSection = false;
			cleanUp();
			copyAllNodes(allNodesBackup, GLOBAL_data.nodes);
			allNodesBackup.clear();
		}
	}

	articleRenderer.onDragEnd = function (properties) {
		if (properties.nodeIds.length > 0) {
			var id = parseInt(properties.nodeIds[0]);
			var help = GLOBAL_network.getPositions(id);
			GLOBAL_data.nodes.update({
				id : id,
				x : help[properties.nodeIds[0]].x
			});
			GLOBAL_data.nodes.update({
				id : id,
				y : help[properties.nodeIds[0]].y
			});
		}
	}
	//---------------------------------- Helpers -------------------------------
	var idInRange = function (id) {
		return id >= GLOBAL_minID && id <= GLOBAL_maxID ? true : false;
	}

	articleRenderer.getTitle = function () {
		return GLOBAL_articleName;
	}
	return articleRenderer;
};

var ArticleRenderer = function (vals) {
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
	var GLOBAL_introID = 0;
	var GLOBAL_introTextID = 0;
	var GLOBAL_editToken = "";
	var GLOBAL_allData = new vis.DataSet();

	//DataSets for operations
	var allNodesBackup = new vis.DataSet();

	//Flags and variables for operations

	var showReferencesFlag = false;
	var sectionNodes = [];
	var sectionsSplitted = false;
	var viewJustSpecificSection = false;
	var semanticZooming = false;
	var showQualityFlag = false;

	//GLOBAL ID COUNTER
	var GLOBAL_idCounter = GLOBAL_minID;
	var GLOBAL_startID = GLOBAL_minID;

	var articleRenderer = {};

	var articleRendererSemanticZooming = new ArticleRendererSemanticZooming({
			network : GLOBAL_network,
			minID : GLOBAL_minID,
			maxID : GLOBAL_maxID,
			minX : GLOBAL_minX,
			maxX : GLOBAL_maxX,
			minY : GLOBAL_minY,
			maxY : GLOBAL_maxY,
			data : GLOBAL_data,
			articleName : GLOBAL_articleName,
			renderer : articleRenderer,
			controller : articleController
		});

	var qualityManager = new QualityManager({
			renderer : articleRenderer,
			controller : articleController
		});

	//create new DataRetriever
	var dataRetriever = new DataRetriever({
			articleRenderer : articleRenderer
		});

	articleRenderer.getDataRetriever = function () {
		return dataRetriever;
	}

	articleRenderer.getDataRetrieverById = function (id) {
		if (idInRange(id)) {
			return dataRetriever;
		}
		return false;
	}

	articleRenderer.getQualityManager = function () {
		return qualityManager;
	}

	articleRenderer.cleanUp = function () {
		var items = GLOBAL_data.nodes.get();
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (idInRange(item.id))
				GLOBAL_data.nodes.remove(item.id);
		}
	}

	articleRenderer.getIdCounter = function () {
		return GLOBAL_idCounter;
	}

	articleRenderer.setIdCounter = function (idCounter) {
		GLOBAL_idCounter = idCounter;
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
				//console.log("|" + item.label + "| |" + sectionName + "|");
				if (item.label == sectionName) {
					//console.log("sectionName: " + sectionName + " == " + item.label);
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
			//console.log("------------------------------------------> " + somethingIsChanging);
		} while (somethingIsChanging > 0);
	}

	var GLOBAL_showOrHideImages = false;
	articleRenderer.showImages = function () {
		GLOBAL_showOrHideImages = !GLOBAL_showOrHideImages;
		if (!GLOBAL_showOrHideImages)
			articleRenderer.hideImages();
		else {
			var images = dataRetriever.getImageArray();
			var maxX = this.getBiggestXValue();
			var minX = this.getSmallestXValue();
			var maxY = this.getBiggestYValue();
			var minY = this.getSmallestYValue();
			var offsetY = 1000;
			var offsetX = 2000;
			for (var i = 0; i < images.length; i++) {
				var image = images[i].url;
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
					imageInfos : images[i],
					shape : "image",
					//width : 500,
					//value : 30,
					allowedToMoveX : true,
					allowedToMoveY : true,
					type : "img",
					wikiLevel : -1,
					masterId : -1

				});
				GLOBAL_idCounter++;
				var items = GLOBAL_data.nodes.get();
				for (var k = 0; k < items.length; k++) {
					var item = items[k];
					if (idInRange(item.id)) {
						if (item.hasOwnProperty("imagesToThisNode")) {
							for (var j = 0; j < item.imagesToThisNode.length; j++) {
								//if (item.title == "Introduction")
								//	console.log(images[i].imageTitle + " ==" + ("File:" + item.imagesToThisNode[j]).replace(/_/g, " "));
								if (images[i].imageTitle == ("File:" + item.imagesToThisNode[j]).replace(/_/g, " ") || images[i].imageTitle == item.imagesToThisNode[j]) {
									GLOBAL_data.nodes.update({
										id : GLOBAL_idCounter - 1,
										wikiLevel : item.wikiLevel,
										masterId : item.id
									});
									GLOBAL_data.edges.add({
										from : GLOBAL_idCounter - 1,
										to : item.id,
										style : "arrow"
									});

								}
							}
						}
					}
				}
			}
			console.log("END");

			GLOBAL_network.redraw();
			articleRenderer.redraw();
		}
		//Now that we have the height and the width of the images we can put them into a non overlapping position
	}

	articleRenderer.updateSection = function (id) {
		if (idInRange(id)) {
			var item = GLOBAL_data.nodes.get(id);
			//console.log("UPDATE SECTION: " + JSON.stringify(item.sectionInfos));
			var sectionData = dataRetriever.reloadSection(item.index, articleRenderer.CBupdateSection);
		}
	}

	articleRenderer.CBupdateSection = function (JSONResponse) {
		var object = JSON.parse(JSON.stringify(JSONResponse));
		console.log("CBupdateSection object : " + JSON.stringify(object));
		//console.log("CBupdateSection item : " +
		var items = GLOBAL_data.nodes.get();
		if (object.parse.sections.length == 0) {
			//It's the introduction

			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (item.title == "Introduction") {
					var textOfSection = "";
					textOfSection = object.parse.wikitext['*'];
					var originalText = textOfSection;
					var rawText = getIntroOfArticle();
					var wikitext = textOfSection;
					wikitext = repalceNewLineWithTwoNewLines(wikitext, "\n", "\n\n", 1);
					wikitext = replaceCharacterWithAnother(wikitext, " ", '\n', 10);
					var rawText = getIntroOfArticle();
					GLOBAL_data.nodes.update({
						id : item.id,
						title : "Introduction",
						label : wikitext,
						originalText : originalText,
						rawText : rawText,
						quality : 0,
						sectionInfos : object.parse,
						imagesToThisNode : object.parse.images,
						refsToThisNode : object.parse.externallinks
					});

				}
			}
		} else {
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (item.type == "text") {
					if (item.sectionInfos.sections.length > 0) {
						if (item.sectionInfos.sections[0].line == object.parse.sections[0].line) {
							var textOfSection = "";
							if (object.parse.sections.length > 1) {
								textOfSection = object.parse.wikitext['*'];
								textOfSection = trimToOneParagraph(textOfSection, object.parse.sections[0].line);
							} else {
								textOfSection = object.parse.wikitext['*'];
							}
							var originalText = textOfSection;
							var rawText = getTextOfSection(object.parse.sections[0].line);
							if (textOfSection != "" && textOfSection.length > 10) {
								var value = textOfSection.split(' ').length;
								textOfSection = replaceCharacterWithAnother(textOfSection, " ", '\n', 10);
								GLOBAL_data.nodes.update({
									id : item.id,
									title : object.parse.sections[0].line,
									label : textOfSection,
									originalText : originalText,
									rawText : rawText,
									quality : 0,
									sectionInfos : object.parse,
									imagesToThisNode : object.parse.images,
									refsToThisNode : object.parse.externallinks
								});
							}
						}
					}
				}
			}
		}
		//articleRenderer.redraw();
		articleRenderer.redrawEverything();
		articleRenderer.showQuality();

	}

	articleRenderer.redrawEverything = function () {
		for (var i = 0; i < 2; i++) {
			articleRenderer.showImages();
			articleRenderer.showReferences();
		}
		articleRenderer.redraw();

	}

	articleRenderer.resizeSections = function () {
		var items = GLOBAL_data.nodes.get();
		for (var i = 0; i < items.length; i++) {
			if (items[i].type == 'section' && idInRange(items[i].id))
				GLOBAL_data.nodes.update({
					id : items[i].id,
					fontSize : 3000,
					fontSizeMin : 3000,
					fontSizeMax : 3010
				});
		}
		articleRenderer.redraw();
	}

	articleRenderer.hideImages = function () {
		var items = GLOBAL_data.nodes.get();
		for (var i = 0; i < items.length; i++) {
			if (items[i].type == 'img' && idInRange(items[i].id))
				GLOBAL_data.nodes.remove(items[i].id);
		}
		articleRenderer.redraw();
	}
	var GLOBAL_showOrHideReferences = false;
	articleRenderer.showReferences = function () {
		GLOBAL_showOrHideReferences = !GLOBAL_showOrHideReferences;
		if (!GLOBAL_showOrHideReferences)
			articleRenderer.hideReferences();
		else {
			var refs = dataRetriever.getAllReferences();
			var maxX = this.getBiggestXValue();
			var minX = this.getSmallestXValue();
			var maxY = this.getBiggestYValue();
			var minY = this.getSmallestYValue();
			var offsetY = 1000;
			var offsetX = 2000;
			for (var i = 0; i < refs.length; i++) {
				var ref = refs[i];
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
					title : ref,
					label : ref,
					box : "image",
					//width : 500,
					//value : 30,
					allowedToMoveX : true,
					allowedToMoveY : true,
					type : 'ref',
					wikiLevel : -1,
					masterId : -1

				});
				GLOBAL_idCounter++;
				var items = GLOBAL_data.nodes.get();
				for (var k = 0; k < items.length; k++) {
					var item = items[k];
					if (idInRange(item.id)) {
						if (item.hasOwnProperty("refsToThisNode")) {
							for (var j = 0; j < item.refsToThisNode.length; j++) {
								if (ref == (item.refsToThisNode[j])) {
									//if (item.title == "Introduction")
									//	console.log(ref + " ==" + (item.refsToThisNode[j]));
									GLOBAL_data.nodes.update({
										id : GLOBAL_idCounter - 1,
										wikiLevel : item.wikiLevel,
										masterId : item.id
									});
									GLOBAL_data.edges.add({
										from : GLOBAL_idCounter - 1,
										to : item.id,
										style : "arrow"
									});

								}
							}
						}
					}
				}
			}
			console.log("END");

			GLOBAL_network.redraw();
			articleRenderer.redraw();
		}
		//Now that we have the height and the width of the images we can put them into a non overlapping position
	}
	articleRenderer.hideReferences = function () {
		showReferencesFlag = false;
		var items = GLOBAL_data.nodes.get();
		for (var i = 0; i < items.length; i++) {
			if (items[i].type == "ref" && idInRange(items[i].id)) {
				GLOBAL_data.nodes.remove(items[i].id);
			}
		}

		articleRenderer.redraw();
	}

	articleRenderer.center = function () {
		//console.log(articleRenderer.getBiggestXValue() + " " + articleRenderer.getBiggestYValue() + " " + articleRenderer.getSmallestXValue() + " " + articleRenderer.getSmallestYValue());
		var object = {};
		object.position = {
			x : (articleRenderer.getBiggestXValue() + articleRenderer.getSmallestXValue()) / 2,
			y : (articleRenderer.getSmallestYValue() + articleRenderer.getBiggestYValue()) / 2
		};
		object.scale = 0.02;
		GLOBAL_network.moveTo(object);
		//articleRendererSemanticZooming.func_overviewMode();

	}
	articleRenderer.centerWithoutScaling = function () {
		var object = {};
		object.position = {
			x : (articleRenderer.getBiggestXValue() + articleRenderer.getSmallestXValue()) / 2,
			y : (articleRenderer.getSmallestYValue() + articleRenderer.getBiggestYValue()) / 2
		};
		GLOBAL_network.moveTo(object);
	}
	articleRenderer.centerWithScaleFactor = function (scale) {
		var object = {};
		object.position = {
			x : (articleRenderer.getBiggestXValue() + articleRenderer.getSmallestXValue()) / 2,
			y : (articleRenderer.getSmallestYValue() + articleRenderer.getBiggestYValue()) / 2
		};
		object.scale = scale;
		GLOBAL_network.moveTo(object);
	}
	articleRenderer.doRedraw = function () {
		articleRenderer.redraw();
	}

	var defaultQualityScoreItems = function (sectionName) {
		if (sectionName == 'References' || sectionName == 'See also' || sectionName == 'Notes' || sectionName == 'Sources' || sectionName == 'Further reading' || sectionName == 'External links') {
			return false;
		}
		return true;
	}

	articleRenderer.fillDataNew = function () {
		articleRenderer.cleanUp();
		var intro = dataRetriever.getIntro();
		var title = dataRetriever.getTitle();
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
					y : currentLevel * yOffset + GLOBAL_minY,
					title : sectionInfos[i].line,
					label : sectionInfos[i].line, // + ' currentLEVEL: ' + currentLevel + ' x: ' + (sectionInfos[i].level * xOffset) + ' y: ' + (sectionsInSameLevel * yOffset),
					index : sectionInfos[i].index,
					value : 1,
					allowedToMoveX : true,
					allowedToMoveY : true,
					wikiLevel : currentLevel,
					masterId : from, //if from == -1 the no master
					sectionInfos : dataRetriever.getSectionContentData(sectionInfos[i].line),
					//imagesToThisNode : dataRetriever.getSectionContentData(sectionInfos[i].line).images,
					type : 'section'
				});
				idCnt = GLOBAL_idCounter;
				GLOBAL_idCounter++;
				var sectionData = dataRetriever.getSectionContentData(sectionInfos[i].line);
				var textOfSection = "";

				if (sectionData.sections.length > 1) {
					textOfSection = sectionData.wikitext['*'];
					textOfSection = trimToOneParagraph(textOfSection, sectionInfos[i].line);
				} else {
					textOfSection = sectionData.wikitext['*'];
				}
				var originalText = textOfSection;
				//console.log("LINE: " + sectionInfos[i].line);
				var rawText = getTextOfSection(sectionInfos[i].line);

				//console.log("-----------------------> " + sectionInfos[i].line + " ---- > " + textOfSection);
				//console.log("LENGTH: " + textOfSection.length);
				if (textOfSection != "" && textOfSection.length > 10) {

					var value = textOfSection.split(' ').length;
					//	textOfSection = repalceNewLineWithTwoNewLines(textOfSection, "\n", "\n\n", 1);
					textOfSection = replaceCharacterWithAnother(textOfSection, " ", '\n', 10);
					//console.log("images : " + JSON.stringify(sectionData.images));
					GLOBAL_data.nodes.add({
						id : GLOBAL_idCounter,
						x : sectionsInSameLevel * xOffset + GLOBAL_minX,
						y : currentLevel * yOffset + 800 +  + GLOBAL_minY,
						title : sectionInfos[i].line, //textOfSection.length > 50 ? textOfSection.substring(0, 50) + "..." : textOfSection.substring(0, 10) + "...",
						label : textOfSection,
						originalText : originalText,
						index : sectionInfos[i].index,
						value : value,
						shape : 'box',
						allowedToMoveX : true,
						allowedToMoveY : true,
						wikiLevel : currentLevel,
						masterId : idCnt, //if from == -1 the no master
						type : 'text',
						useForQualityCalculation : defaultQualityScoreItems(sectionInfos[i].line),
						quality : 0,
						rawText : rawText,
						sectionInfos : dataRetriever.getSectionContentData(sectionInfos[i].line),
						imagesToThisNode : sectionData.images,
						refsToThisNode : sectionData.externallinks
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
					index : sectionInfos[i].index,
					value : 1,
					allowedToMoveX : true,
					allowedToMoveY : true,
					wikiLevel : currentLevel,
					masterId : from, //if from == -1 the no master
					sectionInfos : dataRetriever.getSectionContentData(sectionInfos[i].line),
					//imagesToThisNode : dataRetriever.getSectionContentData(sectionInfos[i].line).images,
					type : 'section'
				});
				idCnt = GLOBAL_idCounter;
				GLOBAL_idCounter++;
				var sectionData = dataRetriever.getSectionContentData(sectionInfos[i].line);
				var textOfSection = "";
				if (sectionData.sections.length > 1) {
					textOfSection = sectionData.wikitext['*'];
					textOfSection = trimToOneParagraph(textOfSection, sectionInfos[i].line);
				} else {
					textOfSection = sectionData.wikitext['*'];
				}
				var rawText = getTextOfSection(sectionInfos[i].line);
				var originalText = textOfSection;
				if (textOfSection != "" && textOfSection.length > 10) {

					var value = textOfSection.split(' ').length;
					//		textOfSection = repalceNewLineWithTwoNewLines(textOfSection, "\n", "\n\n", 1);
					textOfSection = replaceCharacterWithAnother(textOfSection, " ", '\n', 10);
					GLOBAL_data.nodes.add({
						id : GLOBAL_idCounter,
						x : sectionsInSameLevel * xOffset + 800 + GLOBAL_minX,
						y : currentLevel * yOffset + GLOBAL_minX,
						title : sectionInfos[i].line, //textOfSection.length > 50 ? textOfSection.substring(0, 50) + "..." : textOfSection.substring(0, 10) + "...",
						label : textOfSection,
						originalText : originalText,
						index : sectionInfos[i].index,
						shape : 'box',
						value : value,
						allowedToMoveX : true,
						allowedToMoveY : true,
						wikiLevel : currentLevel,
						masterId : idCnt, //if from == -1 the no master
						type : 'text',
						useForQualityCalculation : defaultQualityScoreItems(sectionInfos[i].line),
						quality : 0,
						rawText : rawText,
						sectionInfos : dataRetriever.getSectionContentData(sectionInfos[i].line),
						imagesToThisNode : sectionData.images,
						refsToThisNode : sectionData.externallinks
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
		//CREATE INTRO
		GLOBAL_data.nodes.add({
			id : GLOBAL_idCounter,
			x : 0,
			y : 0,
			title : title,
			label : title, // + ' currentLEVEL: ' + currentLevel + ' x: ' + (sectionInfos[i].level * xOffset) + ' y: ' + (sectionsInSameLevel * yOffset),
			index : 0,
			value : 1,
			allowedToMoveX : true,
			allowedToMoveY : true,
			wikiLevel : 0,
			masterId : -1, //if from == -1 the no master
			type : 'section'
		});
		GLOBAL_introID = GLOBAL_idCounter;
		GLOBAL_idCounter++;
		var wikitext = intro.wikitext['*'];
		var originalText = wikitext;
		wikitext = repalceNewLineWithTwoNewLines(wikitext, "\n", "\n\n", 1);
		wikitext = replaceCharacterWithAnother(wikitext, " ", '\n', 10);
		var rawText = getIntroOfArticle();
		//console.log("INTRO RAW TEXT: " + rawText);
		GLOBAL_data.nodes.add({
			id : GLOBAL_idCounter,
			x : 0,
			y : 0,
			title : "Introduction",
			shape : "box",
			label : wikitext, // + ' currentLEVEL: ' + currentLevel + ' x: ' + (sectionInfos[i].level * xOffset) + ' y: ' + (sectionsInSameLevel * yOffset),
			originalText : originalText,
			value : 1,
			index : 0,
			allowedToMoveX : true,
			allowedToMoveY : true,
			wikiLevel : 1,
			masterId : GLOBAL_idCounter - 1, //if from == -1 the no master
			type : 'text',
			useForQualityCalculation : true,
			quality : 0,
			sectionInfos : dataRetriever.getIntro(),
			imagesToThisNode : dataRetriever.getIntro().images,
			refsToThisNode : dataRetriever.getIntro().externallinks,
			rawText : rawText
		});
		GLOBAL_introTextID = GLOBAL_idCounter;
		var items = GLOBAL_data.nodes.get();
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (item.wikiLevel == 2 && idInRange(item.id) && item.type == "section") {
				GLOBAL_data.nodes.update({
					id : item.id,
					masterId : GLOBAL_idCounter - 1
				});
				GLOBAL_data.edges.add({
					from : GLOBAL_idCounter - 1,
					to : item.id,
					style : "arrow"
				});
			}
		}
		GLOBAL_idCounter++;
		GLOBAL_data.edges.add({
			from : GLOBAL_idCounter - 2,
			to : GLOBAL_idCounter - 1,
			style : "arrow"
		});

		GLOBAL_network.redraw();
		articleRenderer.redraw();
		articleRenderer.center();
	}

	function trimToOneParagraph(textOfSection, sectionName) {
		var hIndex = textOfSection.indexOf(sectionName);
		var hi = 0;

		if (hIndex > -1) {
			while (textOfSection[hIndex + hi] != "=") {
				hi++;
			}
			while (textOfSection[hIndex + hi] == "=") {
				hi++;
			}
			var help = textOfSection.substr(hIndex + hi).indexOf("==");
			/*while (textOfSection[hIndex + hi] != "=") {
			hi++;
			}*/
			return textOfSection.substr(0, hIndex + hi + help);
		} else {
			/*console.log("-----------------------------------------------------");
			console.log("SECTIONNAME: " + sectionName);
			console.log("TEXTOFSECTION: " + textOfSection);
			console.log("-----------------------------------------------------");*/
		}
		return textOfSection;
	}
	function getMaxHeightOfLevelType(level, type) {
		var items = GLOBAL_data.nodes.get();
		var maxHeight = -1;
		for (var i = 0; i < items.length; i++) {
			if (items[i].wikiLevel == level && items[i].height > maxHeight && idInRange(items[i].id) && items[i].type == type)
				maxHeight = items[i].height;
		}
		return maxHeight;
	}

	articleRenderer.showOverview = function () {
		var items = GLOBAL_data.nodes.get();
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if ((item.type == 'text' || item.type == 'section') && idInRange(item.id)) {
				GLOBAL_data.nodes.update({
					id : item.id,
					fontSize : 14,
					fontSizeMin : 14,
					fontSizeMax : 30
				});
			}
		}
		GLOBAL_network.redraw();
		articleRenderer.redraw();
		articleRenderer.center();
	}

	articleRenderer.redraw = function () {
		var items = GLOBAL_data.nodes.get();
		var currentlevelCnt = getMaxLevel();
		var sumHeight = 0;
		var heightCnt = 0;
		var currentLevelMaxXRef = 0;
		var currentLevelMaxXImg = 0;
		var currentLevelMaxXText = 0;
		var currentLevelMaxXSection = 0;
		var oldLevelMaxX = 0;
		var addXSections = 200;
		var addXText = 50;
		var addY = 500;
		var refOffset = 3000;
		var sectionOffset = 100;
		var bottomLevel = true;

		var xMult = 0;
		for (var clc = currentlevelCnt; clc >= -1; clc--) {
			items = GLOBAL_data.nodes.get();

			var maxHeightTextNodes = getMaxHeightOfLevelType(clc, "text");
			var maxHeightSectionNodes = getMaxHeightOfLevelType(clc, "section");
			var maxHeightImageNodes = getMaxHeightOfLevelType(clc, "img");
			var maxHeightRefNodes = getMaxHeightOfLevelType(clc, "ref") + refOffset;
			/*TO BE SURE THAT WE HAVE ENOUGH SPACE*/

			var sumWidth = 0;
			//var heightAddFlag = true;
			var itemFoundInLevel = false;
			xMult = 0;

			for (var i = 0; i < items.length; i++) {

				var item = items[i];
				if (item.type == 'img' && idInRange(item.id) && item.wikiLevel == clc) {

					GLOBAL_data.nodes.update({
						id : item.id,
						x : sumWidth == 0 ? 0 : sumWidth + (item.width / 2) + addXText * xMult,
						//title : sumWidth + (item.width / 2) + 2000,
						/*space between*/
						y : bottomLevel ? (GLOBAL_maxY - (item.height / 2)) : (GLOBAL_maxY - (sumHeight + (item.height / 2) + addY * heightCnt))
					});
					xMult++;
					sumWidth += (item.width);
					//console.log("Type : " + item.type + " " + item.width + " " + item.x + " " + item.y + " " + (GLOBAL_maxY - (sumHeight + (item.height / 2) + addY)));
					currentLevelMaxXImg = sumWidth + (item.width / 2) + addXText * xMult;

					if (bottomLevel || (sumWidth + (item.width / 2) + addXText * xMult) > oldLevelMaxX)
						oldLevelMaxX = sumWidth + (item.width / 2) + addXText * xMult;
					itemFoundInLevel = true;
				}
			}

			sumWidth = 0;
			if (itemFoundInLevel)
				sumHeight += maxHeightImageNodes;
			xMult = 0;
			if (bottomLevel && itemFoundInLevel) {
				bottomLevel = false;
			}
			//console.log("SUM HEIGHT: " + sumHeight + " " + bottomLevel);
			xMult = 0;
			itemFoundInLevel = false;
			items = GLOBAL_data.nodes.get();
			for (var i = 0; i < items.length; i++) {

				var item = items[i];
				if (item.type == 'ref' && idInRange(item.id) && item.wikiLevel == clc) {

					GLOBAL_data.nodes.update({
						id : item.id,
						x : sumWidth == 0 ? 0 : sumWidth + (item.width / 2) + addXText * xMult,
						//title : sumWidth + (item.width / 2) + 2000,
						/*space between*/
						y : bottomLevel ? (GLOBAL_maxY - (item.height / 2)) : (GLOBAL_maxY - (sumHeight + (item.height / 2) + addY * heightCnt))
					});
					xMult++;
					sumWidth += (item.width);
					//console.log("Type : " + item.type + " " + item.width + " " + item.x + " " + item.y + " " + (GLOBAL_maxY - (sumHeight + (item.height / 2) + addY)));
					currentLevelMaxXRef = sumWidth + (item.width / 2) + addXText * xMult;

					//if (bottomLevel || (sumWidth + (item.width / 2) + addXText * xMult) > oldLevelMaxX)
					//	oldLevelMaxX = sumWidth + (item.width / 2) + addXText * xMult;
					itemFoundInLevel = true;
				}
			}

			sumWidth = 0;
			if (itemFoundInLevel)
				sumHeight += maxHeightRefNodes;
			xMult = 0;
			if (bottomLevel && itemFoundInLevel) {
				bottomLevel = false;
			}
			itemFoundInLevel = false;
			items = GLOBAL_data.nodes.get();
			for (var i = 0; i < items.length; i++) {

				var item = items[i];
				if (item.type == 'text' && idInRange(item.id) && item.wikiLevel == clc) {

					GLOBAL_data.nodes.update({
						id : item.id,
						x : sumWidth == 0 ? 0 : sumWidth + (item.width / 2) + addXText * xMult,
						//title : sumWidth + (item.width / 2) + 2000,
						/*space between*/
						y : bottomLevel ? (GLOBAL_maxY - (item.height / 2)) : (GLOBAL_maxY - (sumHeight + (item.height / 2) + addY * heightCnt))
					});
					xMult++;
					sumWidth += (item.width);
					//console.log("Type : " + item.type + " " + item.width + " " + item.x + " " + item.y + " " + (GLOBAL_maxY - (sumHeight + (item.height / 2) + addY)));
					currentLevelMaxXText = sumWidth + (item.width / 2) + addXText * xMult;

					if (bottomLevel || (sumWidth + (item.width / 2) + addXText * xMult) > oldLevelMaxX)
						oldLevelMaxX = sumWidth + (item.width / 2) + addXText * xMult;
					itemFoundInLevel = true;
				}
			}

			if (itemFoundInLevel)
				sumHeight += maxHeightTextNodes;

			if (bottomLevel && itemFoundInLevel) {
				bottomLevel = false;
			}

			sumWidth = 0;
			itemFoundInLevel = false;
			items = GLOBAL_data.nodes.get();
			xMult = 0;
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (item.type == 'section' && idInRange(item.id) && item.wikiLevel == clc) {

					GLOBAL_data.nodes.update({
						id : item.id,
						x : sumWidth == 0 ? 0 : sumWidth + (item.width / 2) + addXSections * xMult,
						//title : sumWidth + (item.width / 2) + 2000,
						/*space between*/
						y : bottomLevel ? (GLOBAL_maxY - (item.height / 2)) : (GLOBAL_maxY - (sumHeight + (item.height / 2) + sectionOffset + addY * heightCnt))
					});
					xMult++;
					sumWidth += (item.width);
					//	console.log("Type : " + item.id + " " + item.type + " " + item.width + " " + item.x + " " + item.y + " " + (GLOBAL_maxY - (sumHeight + (item.height / 2) + addY)));
					currentLevelMaxXSection = sumWidth + (item.width / 2) + addXSections * xMult;

					if (bottomLevel || (sumWidth + (item.width / 2) + addXSections * xMult) > oldLevelMaxX)
						oldLevelMaxX = sumWidth + (item.width / 2) + addXSections * xMult;

				}
			}

			if (itemFoundInLevel)
				sumHeight += maxHeightSectionNodes;
			heightCnt++;
			bottomLevel = false;
			itemFoundInLevel = false;
			items = GLOBAL_data.nodes.get();
			if (currentLevelMaxXRef < oldLevelMaxX) {
				// console.log("OFFSET: " + offset);
				var offset = (oldLevelMaxX - currentLevelMaxXRef) / 2;
				for (var i = 0; i < items.length; i++) {
					var item = items[i];
					if ((item.type == 'ref') && (idInRange(item.id) && item.wikiLevel == clc)) {
						GLOBAL_data.nodes.update({
							id : item.id,
							x : item.x + offset,
							//title : item.x + offset
						});
						currentLevelMaxXRef = item.x + offset;
					}
				}
			}
			items = GLOBAL_data.nodes.get();
			if (currentLevelMaxXImg < oldLevelMaxX) {
				// console.log("OFFSET: " + offset);
				var offset = (oldLevelMaxX - currentLevelMaxXImg) / 2;
				for (var i = 0; i < items.length; i++) {
					var item = items[i];
					if ((item.type == 'img') && (idInRange(item.id) && item.wikiLevel == clc)) {
						GLOBAL_data.nodes.update({
							id : item.id,
							x : item.x + offset,
							//title : item.x + offset
						});
						currentLevelMaxXImg = item.x + offset;
					}
				}
			}
			items = GLOBAL_data.nodes.get();
			if (currentLevelMaxXText < oldLevelMaxX) {
				// console.log("OFFSET: " + offset);
				var offset = (oldLevelMaxX - currentLevelMaxXText) / 2;
				for (var i = 0; i < items.length; i++) {
					var item = items[i];
					if ((item.type == 'text') && (idInRange(item.id) && item.wikiLevel == clc)) {
						GLOBAL_data.nodes.update({
							id : item.id,
							x : item.x + offset,
							//title : item.x + offset
						});
						currentLevelMaxXText = item.x + offset;
					}
				}
			}
			items = GLOBAL_data.nodes.get();
			if (currentLevelMaxXSection < oldLevelMaxX) {
				var offset = (oldLevelMaxX - currentLevelMaxXSection) / 2;
				//	console.log("currentLevelMaxX : " + currentLevelMaxX + " oldLEVELMAXX : " + oldLevelMaxX + " OFFSET: " + offset);
				for (var i = 0; i < items.length; i++) {
					var item = items[i];
					if (item.type == 'section' && idInRange(item.id) && item.wikiLevel == clc) {

						//	console.log("UPDATING ID: " + item.id + " before " + item.x + " after " + parseFloat(item.x + offset));
						GLOBAL_data.nodes.update({
							id : item.id,
							x : parseFloat(item.x + offset),
							//title : "ID: " + item.id + (item.x + offset)
						});
						currentLevelMaxXSection = item.x + offset;
					}
				}
			}
			//console.log("-------------------------LEVEL ENDS ---------------- " + sumHeight);

		}

		repositionRefs();

	}

	function getAllReferencesToSectionText(id) {
		var arrayRefs = [];
		var items = GLOBAL_data.nodes.get();

		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (idInRange(item.id) && item.type == "ref" && item.masterId == id) {
				arrayRefs.push(item.id);
			}
		}
		return arrayRefs;
	}

	function repositionRefs() {
		var items = GLOBAL_data.nodes.get();

		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (idInRange(item.id) && item.type == "text") {
				var arrayRefIds = getAllReferencesToSectionText(item.id);
				var xOffset = 0;
				var yOffset = 0;
				for (var j = 0; j < arrayRefIds.length; j++) {
					var itemRef = GLOBAL_data.nodes.get(arrayRefIds[j]);
					GLOBAL_data.nodes.update({
						id : arrayRefIds[j],
						x : j % 2 == 0 ? item.x + xOffset : item.x - xOffset,
						y : item.y + item.height / 2 + 500 + yOffset
					});
					//xOffset += itemRef.width;
					yOffset += itemRef.height;
				}
			}
		}

	}

	var isColor = false;
	articleRenderer.colorLevels = function () {
		console.log("ISCOLOR: " + isColor);
		isColor = !isColor;
		console.log("ISCOLOR2: " + isColor);
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
			if (item.type == "img") {
				var object = {};
				object.position = {
					x : item.x,
					y : item.y
				};
				object.scale = 0.5;
				network.moveTo(object);
			}
		}
	}

	articleRenderer.selectAllNodes = function () {
		var arrayToSelect = [];

		var allIDs = GLOBAL_data.nodes.getIds();
		var inAllIDs = false;
		for (var i = GLOBAL_startID; i < GLOBAL_idCounter; i++) {
			inAllIDs = false;
			for (var j = 0; j < allIDs.length; j++) {
				if (allIDs[j] == i) {
					inAllIDs = true;
				}
			}
			if (inAllIDs) {
				arrayToSelect.push(i);
			}
		}
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

	articleRenderer.getBiggestYValueOfLevel = function (level) {
		var items = GLOBAL_data.nodes.get();
		var maxY = 0;
		var start = true;
		for (var i = 0; i < items.length; i++) {
			if (start && idInRange(items[i].id) && items[i].type == "section" && items[i].wikiLevel == level) {
				start = false;
				maxY = items[i].y;
			}
			if (items[i].y > maxY && idInRange(items[i].id) && items[i].type == "section" && items[i].wikiLevel == level) {
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
	articleRenderer.getSmallestYValueOfLevel = function (level) {
		var items = GLOBAL_data.nodes.get();
		var minY = 0;
		var start = true;
		for (var i = 0; i < items.length; i++) {
			if (start && idInRange(items[i].id) && items[i].type == "section" && items[i].wikiLevel == level) {
				start = false;
				minY = items[i].y;
			}
			if (items[i].y < minY && idInRange(items[i].id) && items[i].type == "section" && items[i].wikiLevel == level) {
				minY = items[i].y;
			}
		}

		return minY;

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
		return minY - 400;
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

	function isNodeAParentNode(id) {
		var items = GLOBAL_data.nodes.get();
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (item.masterId == id)
				return true;
		}
		return false;
	}

	function getAllTextAndNoParanetsNodesSameLevelSameMaster(level, master) {
		var items = GLOBAL_data.nodes.get();
		var help = new vis.DataSet();
		for (var i = 0; i < items.length; i++) {
			if (items[i].masterId == master && items[i].wikiLevel == level && (items[i].type == 'text' || !isNodeAParentNode(items[i].id)) && idInRange(items[i].id)) {
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

	function getIntroOfArticle() {
		var articleText = dataRetriever.getRawText();
		index = articleText.indexOf("==");
		var ret = "";
		if (index > -1)
			ret = articleText.substr(0, index);
		else
			ret = "";
		return ret;
	}

	function getTextOfSection(sectionTitle) {
		//console.log("GETTEXTOFSECTION");
		var stringToSearch = "== \xA7" + sectionTitle + " ==";
		var articleText = dataRetriever.getRawText();
		var index = articleText.indexOf(stringToSearch);
		if (sectionTitle.split("Early years").length > 1) {
			//console.log("INDEX1 : " + index);
			//console.log("STRING TO SEARCH: " + stringToSearch);
			//console.log("ARTICLETEXT:  " + articleText);
		}
		if (index == -1) {
			stringToSearch = "== " + sectionTitle + " ==";
			index = articleText.indexOf(stringToSearch);
			/*	if (sectionTitle.split("Early years").length > 1) {
			console.log("INDEX2 : " + index);
			console.log("STRING TO SEARCH: " + stringToSearch);
			console.log("ARTICLETEXT:  " + articleText);
			}*/
			if (index == -1) {
				stringToSearch = sectionTitle;
				index = articleText.indexOf(stringToSearch);
			}
		}
		//console.log("index: " + index);
		var str = articleText.substring((index + stringToSearch.length), articleText.length);

		str = deleteEqualsSigns(str, 0);

		index = str.indexOf("==");
		var ret = "";
		if (index > -1)
			ret = str.substr(0, index);
		else
			ret = str;
		ret.replace("=", " ");
		//console.log("----------------------------> |" + sectionTitle + "|" + sectionTitle.split("Early years").length );
		//	if (sectionTitle.split("Early years").length > 1)
		//	console.log("RETURN : " + ret);
		return ret;
	}

	articleRenderer.onZoom = function (properties) {
		if (semanticZooming)
			articleRendererSemanticZooming.doZooming(properties);
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
			articleRenderer.redraw();
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

			articleRenderer.redraw();

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
	articleRenderer.retrievingDataAnimation = function (text) {
		//$("#overallScore").html("<b>" + text + "</b>");
		$("#workingAnimation").html(text);
	}

	articleRenderer.retrievingDataDone = function (text) {
		$("#workingAnimation").html("<b>" + text + "</b>");
		GLOBAL_controller.closeEditDialog();
	}

	articleRenderer.changeValueOfCheckbox = function (id, isSet) {
		if (idInRange(id)) {
			console.log("changeValueOfCheckbox : " + id + " " + isSet);
			GLOBAL_data.nodes.update({
				id : id,
				useForQualityCalculation : isSet
			});
			articleRenderer.showQuality();
		}
	}

	articleRenderer.getItem = function (id) {
		if (!idInRange)
			return false;
		var item = GLOBAL_data.nodes.get(id);
		if (item == null)
			item = articleRenderer.getItemFromBackup(id);
		return item;
	}

	articleRenderer.getItemFromBackup = function (id) {
		return allNodesBackup.get(id);
	}
	articleRenderer.onClick = function (properties) {
		//console.log("ONCLICK1");
		if (!selectHelper && !isAddNodeMode) {
		//	console.log("ONCLICK2");
			currentSelectedSectionIndex = -1;
			currentSelectedSectionId = -1;
		//	console.log("CID3: " + currentSelectedSectionId);
			var item = GLOBAL_data.nodes.get(properties.nodes[0]);
			//Highlight all elements which are connected to that

			var edges = GLOBAL_data.edges.get();
			for (var i = 0; i < edges.length; i++) {
				var itemEdge = edges[i];
				GLOBAL_data.edges.update({
					id : itemEdge.id,
					color : '#2B7CE9',
					width : 2
				});

			}
		}
		selectHelper = false;
	}

	var selectHelper = false;
	articleRenderer.onSelect = function (properties) {
		currentSelectedSectionIndex = -1;
		currentSelectedSectionId = -1;
		//console.log("CID: " + currentSelectedSectionId);
		//console.log("ON SELECT " + properties.nodes);
		//GLOBAL_network.focusOnNode(properties.nodes);
		if (properties.nodes.length == 1) {
			var item = GLOBAL_data.nodes.get(properties.nodes[0]);
			//Highlight all elements which are connected to that
			selectHelper = true;
			var edges = GLOBAL_data.edges.get();
			for (var i = 0; i < edges.length; i++) {
				var itemEdge = edges[i];
				GLOBAL_data.edges.update({
					id : itemEdge.id,
					color : '#2B7CE9',
					width : 2
				});

			}
			for (var i = 0; i < edges.length; i++) {
				var itemEdge = edges[i];
				if (itemEdge.from == item.id || itemEdge.to == item.id) {
					GLOBAL_data.edges.update({
						id : itemEdge.id,
						color : 'red',
						width : 10
					});
				} else {
					GLOBAL_data.edges.update({
						id : itemEdge.id,
						color : '#2B7CE9',
						width : 1
					});
				}
			}

			/*
			var connectedNodes = GLOBAL_network.getConnectedNodes(item.id);
			for(var i = 0; i < connectedNodes.length; i++){
			var connectedItemID = connectedNodes[i];
			console.log("connectedItemID: " + (connectedItemID));
			//GLOBAL_data.nodes.update({id : connectedItemID, color: {border: 'red'}});
			}*/
			//------------------------------------------------------------
			if ((item.type == "section" || item.type == "text") && isAddNodeMode) {
				currentSelectedSectionIndex = item.index;
				currentSelectedSectionId = item.id;
			//	console.log("CID1: " + currentSelectedSectionId);
				if (item.title == "Introduction")
					alert("This operation is not allowed!");
				else
					GLOBAL_controller.addNode();
			}
			if (item.type == "text") {
				currentSelectedSectionIndex = item.index;
				currentSelectedSectionId = item.id;
			//	console.log("CID2: " + currentSelectedSectionId);
				var text = item.label;
				$("#editor").html(text);

				if (showQualityFlag) {
					var masterItem = articleRenderer.getItem(item.masterId);

					var allKeys = Object.keys(item.allQulityParameters);
					var qmStr = "<table border='1' width='400' style=' max-width: 400px' >";
					qmStr += ("<tr bgcolor=\"white\"><td><b>" + masterItem.label + "</b></td><td></td><td></td></tr>");
					for (var i = 0; i < allKeys.length; i++) {
						var bgColor = item.allQulityParameters[allKeys[i]] < 0.5 ? "red" : "white";
						var status = item.allQulityParameters[allKeys[i]] < 0.5 ? "improve" : "OK";
						qmStr += ("<tr bgcolor=\"" + bgColor + "\"><td>" + allKeys[i] + "</td><td> \
																																																																																																																																						  <meter title=\"" + item.allQulityParameters[allKeys[i]].toFixed(2) + "\" min=\"0\" max=\"100\" low=\"50\" \
																																																																																																																																						  high=\"80\" optimum=\"100\" value=\"" + (item.allQulityParameters[allKeys[i]].toFixed(2) * 100) + "\"></meter> \
																																																																																																																																						  </td><td>" + status + "</td></tr>");
					}
					if (item.useForQualityCalculation)
						qmStr += ("<tr bgcolor=\"white\"><td>add to overall quality socre</td><td style=\"width:15px\"><input style=\"width:15px\" id=\"checkboxTextQualityTable\" type=\"checkbox\" value=\"" + item.id + "\" checked></td><td></td></tr>");
					else
						qmStr += ("<tr bgcolor=\"white\"><td>add to overall quality socre</td><td style=\"width:15px\"><input style=\"width:15px\" id=\"checkboxTextQualityTable\" type=\"checkbox\" value=\"" + item.id + "\"></td><td></td></tr>");
					qmStr += "</table>";
					qmStr += "<script> 	\
																																																																																																																																									$('#checkboxTextQualityTable').mousedown(function () { \
																																																																																																																																										if (!$(this).is(':checked')) { \
																																																																																																																																											articleController.changeValueOfCheckbox($(this).val(), true); \
																																																																																																																																										} \
																																																																																																																																										else{\
																																																																																																																																											articleController.changeValueOfCheckbox($(this).val(), false); \
																																																																																																																																										} \
																																																																																																																																									}); </script>";
					$("#qualityParameters").html(qmStr);
				}
			} else if (item.type == "img") {
				var allKeys = Object.keys(item.imageInfos);
				var qmStr = "<table border='1' width='400' style=' width:400px; max-width: 400px' >";
				for (var i = 0; i < allKeys.length; i++) {
					qmStr += ("<tr bgcolor=\"" + "white" + "\"><td>" + allKeys[i] + "</td><td>" + item.imageInfos[allKeys[i]] + "</td><td>" + "OK" + "</td></tr>");
				}
				qmStr += "</table>";
				$("#qualityParameters").html(qmStr);
			} else if (item.type == "section") {
				var qmStr = "<table border='1' width='400' style=' width:400px; max-width: 400px' >";
				var bgColor = item.quality < 0.5 ? "red" : "white";
				var status = item.quality < 0.5 ? "improve" : "OK";

				qmStr += ("<tr bgcolor=\"" + bgColor + "\"><td>" + "Section score: " + "</td><td>" + item.quality + "</td><td>" + status + "</td></tr>");
				qmStr += "</table>";
				$("#qualityParameters").html(qmStr);
			}
		}
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

	function distanceBetweenTwoPoints(p1X, p1Y, p2X, p2Y) {
		return Math.sqrt(Math.pow((p1X - p2X), 2) + Math.pow((p1Y - p2Y), 2));
	}

	function getMaxHeightOfNodes(id) {
		var items = GLOBAL_data.nodes.get();
		var maxHeight = -1;
		for (var i = 0; i < items.length; i++) {
			if (items[i].id != id && idInRange(items[i].id) && items[i].height > maxHeight)
				maxHeight = items[i].height;
		}
		return maxHeight;
	}
	function getMaxWidthOfNodes(id) {
		var items = GLOBAL_data.nodes.get();
		var maxWidth = -1;
		for (var i = 0; i < items.length; i++) {
			if (items[i].id != id && idInRange(items[i].id) && items[i].width > maxWidth)
				maxWidth = items[i].width;
		}
		return maxWidth;
	}

	function drawAllNodesAroundThatID(id) {
		var mainItem = GLOBAL_data.nodes.get(id);
		var topLeftX = mainItem.x - (mainItem.width / 2);
		var topLeftY = mainItem.y - (mainItem.height / 2);
		var bottomLeftX = mainItem.x - (mainItem.width / 2);
		var bottomLeftY = mainItem.y + (mainItem.height / 2);
		var topRightX = mainItem.x + (mainItem.width / 2);
		var topRightY = mainItem.y - (mainItem.height / 2);
		var bottomRightX = mainItem.x + (mainItem.width / 2);
		var bottomRightY = mainItem.y + (mainItem.height / 2);
		var centerX = mainItem.x;
		var centerY = mainItem.y;
		var items = GLOBAL_data.nodes.get();
		var arrayNewPoints = [];
		var maxHeight = getMaxHeightOfNodes(id);
		var maxWidth = getMaxWidthOfNodes(id);
		var radius = distanceBetweenTwoPoints(topLeftX - maxWidth, topLeftY - maxHeight, bottomRightX + maxWidth, bottomRightY + maxHeight) / 2;
		var numPoints = items.length - 1;
		var slice = 2 * Math.PI / numPoints;
		for (var j = 0; j < numPoints; j++) {
			var angle = slice * j;
			var newX = (centerX + radius * Math.cos(angle));
			var newY = (centerY + radius * Math.sin(angle));
			console.log("newX : " + newX + " newY: " + newY);
			arrayNewPoints.push({
				x : newX,
				y : newY
			});
		}
		/*
		void DrawCirclePoints(int points, double radius, Point center){
		double slice = 2 * Math.PI / points;
		for (int i = 0; i < points; i++){
		double angle = slice * i;
		int newX = (int)(center.X + radius * Math.Cos(angle));
		int newY = (int)(center.Y + radius * Math.Sin(angle));
		Point p = new Point(newX, newY);
		Console.WriteLine(p);
		}
		}*/
		var pointCnt = 0;
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (item.id != mainItem.id && idInRange(item.id)) {
				console.log(item.id + " OLD COR: " + item.x + " " + item.y + " NEW COR: " + arrayNewPoints[pointCnt].x + " " + arrayNewPoints[pointCnt].y);
				GLOBAL_data.nodes.update({
					id : item.id,
					x : arrayNewPoints[pointCnt].x,
					y : arrayNewPoints[pointCnt].y
				});
				pointCnt++;
			}
		}
		GLOBAL_network.redraw();
	}

	articleRenderer.onDoubleClick = function (properties) {
		var options = {
			scale : 8
		};
		//GLOBAL_network.focusOnNode(properties.nodes, options);
		//SHOW JUST THE SELECTED ELEMENT AND ALL ELEMENTES WHICH ARE CONNECTED TO THIS ELEMENT
		//TODO WILL BECOME A PROBLEM WHEN ADDING ELEMENTS IS POSSIBLE

		console.log("ON DOUBLE CLICK");
		var id = properties.nodes;

		if (idInRange(id)) {
			//What we are going to do, depends on the node
			var item = GLOBAL_data.nodes.get(id)[0];
			var newNodeContainer = new vis.DataSet();
			console.log(JSON.stringify(item));
			newNodeContainer.add(GLOBAL_data.nodes.get(id));
			var drawAroundNode = false;
			if (item.type == "img") {
				var edgesItems = GLOBAL_data.edges.get();
				console.log("LENGTH: " + edgesItems.length);
				for (var i = 0; i < edgesItems.length; i++) {
					var edge = edgesItems[i];
					if (edge.from == item.id) {
						newNodeContainer.add(GLOBAL_data.nodes.get(edge.to));
					}
				}
				drawAroundNode = true;
			} else {
				newNodeContainer = getAllConnectedNodes(id, newNodeContainer);
			}

			if (!viewJustSpecificSection)
				copyAllNodesInRange(GLOBAL_data.nodes, allNodesBackup, GLOBAL_minID, GLOBAL_maxID);

			articleRenderer.cleanUp();
			copyAllNodes(newNodeContainer, GLOBAL_data.nodes);

			viewJustSpecificSection = true;
			if (drawAroundNode)
				drawAllNodesAroundThatID(item.id);
		}
	}

	articleRenderer.showAllItems = function () {
		if (viewJustSpecificSection) {
			viewJustSpecificSection = false;
			articleRenderer.cleanUp();
			copyAllNodes(allNodesBackup, GLOBAL_data.nodes);
			allNodesBackup.clear();
		}
	}

	articleRenderer.onDragEnd = function (properties) {
		if (properties.nodeIds.length > 0) {
			for (var i = 0; i < properties.nodeIds.length; i++) {
				var id = parseInt(properties.nodeIds[i]);
				var help = GLOBAL_network.getPositions(id);
				GLOBAL_data.nodes.update({
					id : id,
					x : help[properties.nodeIds[i]].x
				});
				GLOBAL_data.nodes.update({
					id : id,
					y : help[properties.nodeIds[i]].y
				});
			}
		}
	}
	articleRenderer.semanticZooming = function () {
		semanticZooming = !semanticZooming;
	}
	function generateRawText(text, title) {
		var rawText = "";
		var rawTextCnt = 0;
		var bracketCnt = 0;
		for (var i = 0; i < text.length; i++) {
			if (text[i] == "{") {
				bracketCnt++;
			} else if (bracketCnt == 0) {
				rawText += text[i];
			} else if (text[i] == "}") {
				bracketCnt--;
			}
		}
		rawText = rawText.replace(/[\n\[&\/\\#,+()$~%.'":*?<>{}\]]/g, '');
		//console.log("TITLE: " + title + " rawTEXTLENGT: " + rawText.length);
		return rawText;
	}

	articleRenderer.showQuality = function () {
		showQualityFlag = true;
		var items = GLOBAL_data.nodes.get();
		var cnt = 0;
		var sum = 0;
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (idInRange(item.id) && item.type == "text") {
				var quality = qualityManager.calculateQuality(item.rawText, item.sectionInfos, item.title);
				if (item.useForQualityCalculation) {
					cnt++;
					sum += quality.score;
				}
				GLOBAL_data.nodes.update({
					id : item.id,
					quality : quality.score,
					allQulityParameters : quality
				});
			}
		}
		sum = parseFloat(sum / cnt);
		sum = sum.toFixed(2);
		$('#progressBarOverallScore').val(sum * 100);
		$('#overallScore').html("<b>Quality score of this article:</b> " + sum);
		//alert("THE OVERALL QUALITY: " + sum);
		//AND NOW THE SCORE FOR THE SECTIONS
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (idInRange(item.id) && item.type == "section") {
				var object = {
					score : 0,
					numTextElements : 0
				};
				var sectionData = calculateScoreForSection(item.id, object);
				GLOBAL_data.nodes.update({
					id : item.id,
					quality : (sectionData.score / sectionData.numTextElements)
				});
			}
		}
		colorTextBasedOnTheQulityValue();
	}
	var calculateScoreForSection = function (id, object) {
		var items = GLOBAL_data.nodes.get();
		for (var i = 0; i < items.length; i++) {
			var item = items[i];

			if (item.masterId == id && idInRange(item.id)) {
				if (item.type == "text") {
					object.score += item.quality;
					object.numTextElements++;
				}
				object = calculateScoreForSection(item.id, object);
			}
		}
		return object;
	}

	var colorTextBasedOnTheQulityValue = function () {
		var items = GLOBAL_data.nodes.get();
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (idInRange(item.id)) {
				if (item.quality == 0) {
					GLOBAL_data.nodes.update({
						id : item.id,
						//title : item.quality,
						color : {
							background : "#FF0000",
							border : '#2B7CE9',
							highlight : {
								background : '#D2E5FF',
								border : '#2B7CE9'
							}
						}
					});
				} else if (item.quality > 0 && item.quality <= 0.4 - overallScoreInterval) {
					GLOBAL_data.nodes.update({
						id : item.id,
						//title : item.quality,
						color : {
							background : "#FF4500",
							border : '#2B7CE9',
							highlight : {
								background : '#D2E5FF',
								border : '#2B7CE9'
							}
						}
					});
				} else if (item.quality > 0.4 - overallScoreInterval && item.quality <= 0.6 - overallScoreInterval) {
					GLOBAL_data.nodes.update({
						id : item.id,
						//title : item.quality,
						color : {
							background : "#FFA500",
							border : '#2B7CE9',
							highlight : {
								background : '#D2E5FF',
								border : '#2B7CE9'
							}
						}
					});
				} else if (item.quality > 0.6 - overallScoreInterval && item.quality <= 0.9 - overallScoreInterval) {
					GLOBAL_data.nodes.update({
						id : item.id,
						//title : item.quality,
						color : {
							background : "#00FF00",
							border : '#2B7CE9',
							highlight : {
								background : '#D2E5FF',
								border : '#2B7CE9'
							}
						}
					});
				} else if (item.quality > 0.9 - overallScoreInterval) {
					GLOBAL_data.nodes.update({
						id : item.id,
						//title : item.quality,
						color : {
							background : "#00EE00",
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
	}

	/*articleRenderer.showTheWholeArticle = function(){

	}*/

	articleRenderer.reset = function () {
		qualityManager.reset();
		articleRendererSemanticZooming.reset();
		cleanUp();
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

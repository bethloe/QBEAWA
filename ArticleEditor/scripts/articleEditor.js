//----------- retrieve necessary data -----------------
var dr = new DataRetriever();
var dropdown = document.getElementById("dropdownID");
dropdown.onchange = update;
var roundnessSlider = document.getElementById("roundnessSlider");
roundnessSlider.onchange = update;

var roundnessScreen = document.getElementById("roundnessScreen");

var data = '<svg xmlns="http://www.w3.org/2000/svg" width="243" height="65">' +
	'<rect x="0" y="0" width="100%" height="100%" fill="#7890A7" stroke-width="20" stroke="#ffffff" ></rect>' +
	'<foreignObject x="15" y="10" width="100%" height="100%">' +
	'<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:40px">' +
	'<em>I</em> like' +
	'<span style="color:white; text-shadow:0 0 20px #000000;">' +
	'cheese</span>' +
	'</div>' +
	'</foreignObject>' +
	'</svg>';

var data2 = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">' +
	'<rect x="0" y="0" width="100%" height="100%" fill="#7890A7" stroke-width="1" stroke="#ffffff" ></rect>' +
	'<foreignObject x="0" y="0" width="100%" height="100%">' +
	'<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:11px">'
	 + '<p><b>Albert Einstein</b> (* <a href="/wiki/14._M%C3%A4rz" title="14. März">14. März</a> <a href="/wiki/1879" title="1879">1879</a> in <a href="/wiki/Ulm" title="Ulm">Ulm</a>; † <a href="/wiki/18._April" title="18. April">18. April</a> <a href="/wiki/1955" title="1955">1955</a> in <a href="/wiki/Princeton_(New_Jersey)" title="Princeton (New Jersey)">Princeton</a>, <a href="/wiki/New_Jersey" title="New Jersey">New Jersey</a>) war ein <a href="/wiki/Theoretische_Physik" title="Theoretische Physik" class="mw-redirect">theoretischer Physiker</a>. Seine Forschungen zur Struktur von <a href="/wiki/Materie_(Physik)" title="Materie (Physik)">Materie</a>, <a href="/wiki/Raum_(Physik)" title="Raum (Physik)">Raum</a> und <a href="/wiki/Zeit" title="Zeit">Zeit</a> sowie dem Wesen der <a href="/wiki/Gravitation" title="Gravitation">Gravitation</a> veränderten maßgeblich das physikalische Weltbild. Er gilt daher als einer der bedeutendsten Physiker aller Zeiten.<sup id="cite_ref-BBC-Artikel_1-0" class="reference"><a href="#cite_note-BBC-Artikel-1">[1]</a></sup></p>' +
	'</div>' + '</foreignObject>' + '</svg>';

var DOMURL = window.URL || window.webkitURL || window;

var img = new Image();
var svg = new Blob([data2], {
		type : 'image/svg+xml;charset=utf-8'
	});
var svgHELP = new Blob([data], {
		type : 'image/svg+xml;charset=utf-8'
	});
var url = DOMURL.createObjectURL(svg);
var urlTest = DOMURL.createObjectURL(svgHELP);

// create an array with nodes

var nodes = new vis.DataSet();
var nodesHideAndSeek = new vis.DataSet();
var textNodes = new vis.DataSet();
var allNodesBackup = new vis.DataSet();

// create an array with edges

var edges = new vis.DataSet();

var container = document.getElementById('mynetwork');
var data = {
	nodes : nodes,
	edges : edges
};
var rawEinsteinDataStr = "";
function rawEinsteinData(data) {
	//console.log("DATA: " + data);
	rawEinsteinDataStr = data;
}

albertEinsteinRawData(rawEinsteinData);

var retrieveData = function () {
	var articleName = $("#articleName").val();
	console.log("articleName: " + articleName);
	dr.setTitle(articleName);
	dr.getAllMeasures();
}

var cleanUp = function () {
	nodes.clear();
	edges.clear();
}

var reverseString = function (s) {
	return s.split("").reverse().join("");
}

var getSectionToRef = function (rawText, ref) {
	var str = rawText.substring(0, rawText.search(ref));
	var equalsFound = false;
	var sectionName = "";
	for (var i = str.length - 1; i > 0; i--) {
		if (!equalsFound) {
			if (str[i] == "=" && str[i - 1] == "=") {
				while (str[i - 1] == "=")
					i--;
				equalsFound = true;
			}
		} else {
			if (str[i] != "=") {
				sectionName += str[i];
				cutSectionName = true;
			} else {
				sectionName = reverseString(sectionName);
				if (sectionName[sectionName.length - 1] == " ")
					sectionName = sectionName.substring(0, sectionName.length - 1);
				if (sectionName[0] == " ")
					sectionName = sectionName.substring(1, sectionName.length);
				return sectionName;
			}
		}
	}
}

var copyID = 100000;
var copy = function () {

	var items = nodes.get();

	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		nodes.add({
			id : copyID,
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
		copyID++;
	}

}

var getNodeToSectionName = function (sectionName) {
	var items = nodes.get();

	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		if (item.type == "section") {
			console.log("|" + item.label + "| |" + sectionName + "|");
			if (item.label == sectionName) {
				console.log("sectionName: " + sectionName + " == " + item.label);
				return item;
			}
		}
	}
	return null;
}

var showReferencesFlag = false;

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var posImages = function () {
	var somethingIsChanging = 0;

	var maxX = getBiggestXValue();
	var minX = getSmallestXValue();
	var maxY = getBiggestYValue();
	var minY = getSmallestYValue();
	do {
		somethingIsChanging = 0;

		var items = nodes.get();
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (item.type == 'img') {
				for (var j = 0; j < items.length; j++) {
					var innerItem = items[j];
					if (innerItem.type == 'img' && innerItem.id != item.id) {
						//console.log("width: " + innerItem.width + " height: " + innerItem.height);
						//console.log(item.x + " >= " + innerItem.x + " && " + item.x + " <= " + (innerItem.x + innerItem.width) + " && " + item.y + " >= " + innerItem.y + " && " + item.y + " <= " + (innerItem.y + innerItem.height));
						if (item.x >= innerItem.x && item.x <= (innerItem.x + innerItem.width) && item.y >= innerItem.y && item.y <= (innerItem.y + innerItem.height)) {
							//console.log("IN HERE");

							somethingIsChanging++;
							if (item.x <= minX || item.y <= minY)
								nodes.update({
									id : item.id,
									x : item.x - innerItem.width,
									y : item.y - innerItem.height
								});
							else
								nodes.update({
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

var imageIdCnt = 80000;
var showImages = function () {
	var images = dr.getImageArray();
	var maxX = getBiggestXValue();
	var minX = getSmallestXValue();
	var maxY = getBiggestYValue();
	var minY = getSmallestYValue();
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
		nodes.add({
			id : imageIdCnt,
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
		imageIdCnt++;
	}
	console.log("END");

	network.redraw();
	//Now that we have the height and the width of the images we can put them into a non overlapping position

}

var hideImages = function () {
	var items = nodes.get();
	for (var i = 0; i < items.length; i++) {
		if (items[i].type == 'img')
			nodes.remove(items[i].id);

	}
}

var refIdCnt = 70000;
var showReferences = function () {
	showReferencesFlag = true;
	var refs = dr.getAllReferences();
	var rawTextWithData = dr.getRawTextWithData();
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
						nodes.add({
							id : refIdCnt,
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

						edges.add({
							from : refIdCnt,
							to : idHelp,
							style : "arrow"
						});

						refIdCnt++;
					}
				}
			}
		} catch (err) {
			console.log(err);
		}
	}
}

var hideReferences = function () {
	showReferencesFlag = false;
	var items = nodes.get();
	for (var i = 0; i < items.length; i++) {
		if (items[i].type == "ref") {
			nodes.remove(items[i].id);
		}
	}
}

var levelOfSemanticZooming = 0;

var center = function () {
	console.log(getBiggestXValue() + " " + getBiggestYValue() + " " + getSmallestXValue() + " " + getSmallestYValue());
	var object = {};
	object.position = {
		x : (getBiggestXValue() + getSmallestXValue()) / 2,
		y : (getSmallestYValue() + getBiggestYValue()) / 2
	};
	object.scale = 0.07;
	network.moveTo(object);

}

var sectionId = 50000;
var idCnt = 0;
var fillDataNew = function () {
	cleanUp();
	var sectionInfos = dr.getSectionInfos();
	var articleText = dr.getRawText();
	var xOffset = 1500;
	var yOffset = 600;
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
			nodes.add({
				id : idCnt,
				x : sectionsInSameLevel * xOffset,
				y : currentLevel * yOffset,
				title : sectionInfos[i].line,
				label : sectionInfos[i].line, // + ' currentLEVEL: ' + currentLevel + ' x: ' + (sectionInfos[i].level * xOffset) + ' y: ' + (sectionsInSameLevel * yOffset),
				value : 1,
				allowedToMoveX : true,
				allowedToMoveY : true,
				wikiLevel : currentLevel,
				masterId : from, //if from == -1 the no master
				type : 'section'
			});
			var textOfSection = getTextOfSection(sectionInfos[i].line);

			//console.log("-----------------------> " + sectionInfos[i].line + " ---- > " + textOfSection);
			//console.log("LENGTH: " + textOfSection.length);
			if (textOfSection != "" && textOfSection.length > 10) {

				var value = textOfSection.split(' ').length;
				textOfSection = repalceNewLineWithTwoNewLines(textOfSection, "\n", "\n\n", 1);
				textOfSection = replaceCharacterWithAnother(textOfSection, " ", '\n', 10);
				nodes.add({
					id : sectionId,
					x : sectionsInSameLevel * xOffset,
					y : currentLevel * yOffset + 800,
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
				edges.add({
					from : idCnt,
					to : sectionId,
					style : "arrow"
				});
				sectionId++;

				network.redraw();
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

			nodes.add({
				id : idCnt,
				x : sectionsInSameLevel * xOffset,
				y : currentLevel * yOffset,
				title : sectionInfos[i].line,
				label : sectionInfos[i].line, // + ' currentLEVEL: ' + currentLevel + ' x: ' + (sectionInfos[i].level * xOffset) + ' y: ' + (sectionsInSameLevel * yOffset),
				value : 1,
				allowedToMoveX : true,
				allowedToMoveY : true,
				wikiLevel : currentLevel,
				masterId : from, //if from == -1 the no master
				type : 'section'
			});

			var textOfSection = getTextOfSection(sectionInfos[i].line);
			//console.log("-----------------------> " + sectionInfos[i].line + " ---- > " + textOfSection);
			if (textOfSection != "" && textOfSection.length > 10) {

				var value = textOfSection.split(' ').length;
				textOfSection = repalceNewLineWithTwoNewLines(textOfSection, "\n", "\n\n", 1);
				textOfSection = replaceCharacterWithAnother(textOfSection, " ", '\n', 10);
				nodes.add({
					id : sectionId,
					x : sectionsInSameLevel * xOffset + 800,
					y : currentLevel * yOffset,
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
				edges.add({
					from : idCnt,
					to : sectionId,
					style : "arrow"
				});
				sectionId++;
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

			edges.add({
				from : from,
				to : idCnt,
				style : "arrow"
			});
		}
		idCnt++;

	}

	network.redraw();
	redraw();
	center();
}

function redraw() {
	network.redraw();
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
			console.log("UPDATE NODE MASTER: " + allMasterOfALevel[i] + " LEVEL: " + clc);
			for (var j = 0; j < items.length; j++) {
				if (j == 0)
					xCntStart = xCnt;
				if (j + 1 == items.length)
					xCntEnd = xCnt;
				console.log("ID: " + items[j].id + " " + xCnt + " " + items[j].width + " " + (-sumMaxHeightOfLevel) + " " + allMasterOfALevel[i] + " " + items[j].wikiLevel);
				nodes.update({
					id : items[j].id,
					x : xCnt,
					y : (-sumMaxHeightOfLevel + 300)
				});
				xCnt += items[j].width + 50;
			}
			if (xCntStart == 0 && xCntEnd == 0) //No text node as child
				nodesWithoutTextAsChildren.push(nodes.get(allMasterOfALevel[i]));
			else
				nodes.update({
					id : allMasterOfALevel[i],
					x : ((xCntStart + xCntEnd) / 2), //getXValueOfMasterNode(allMasterOfALevel[i]),//((xCntStart + xCntEnd) / 2),//
					y : -sumMaxHeightOfLevel - 300 //getYValueOfMasterNode(allMasterOfALevel[i])//
				});

		}
	}

	for (var i = 0; i < nodesWithoutTextAsChildren.length; i++) {
		var node = nodesWithoutTextAsChildren[i];
		if (node != null) {
			console.log("HERE: " + JSON.stringify(node));
			var x = getXValueOfMasterNode(node.id);
			var y = getYValueOfMasterNode(node.id);
			nodes.update({
				id : node.id,
				x : x,
				y : y
			});
		}
	}
	network.redraw();
}

function getRandomColor() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function colorLevels(isColor) {
	var currentlevelCnt = getMaxLevel();
	for (var clc = currentlevelCnt; clc >= 0; clc--) {
		colorAllNodesOfLevel(clc, isColor ? getRandomColor() : "#97C2FC");
	}
}

function colorAllNodesOfLevel(level, color) {

	var items = nodes.get();
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		if (item.wikiLevel == level) {
			nodes.update({
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

function getBiggestXValue() {
	var items = nodes.get();
	var maxX = 0;
	var start = true;
	for (var i = 0; i < items.length; i++) {
		if (start) {
			start = false;
			maxX = items[i].x;
		}
		if (items[i].x > maxX) {
			maxX = items[i].x;
		}
	}

	return maxX;
}

function getBiggestYValue() {
	var items = nodes.get();
	var maxY = 0;
	var start = true;
	for (var i = 0; i < items.length; i++) {
		if (start) {
			start = false;
			maxY = items[i].y;
		}
		if (items[i].y > maxY) {
			maxY = items[i].y;
		}
	}

	return maxY;

}

function getSmallestXValue() {
	var items = nodes.get();
	var minX = 0;
	var start = true;
	for (var i = 0; i < items.length; i++) {
		if (start) {
			start = false;
			minX = items[i].x;
		}
		if (items[i].x < minX) {
			minX = items[i].x;
		}
	}

	return minX;
}

function getSmallestYValue() {
	var items = nodes.get();
	var minY = 0;
	var start = true;
	for (var i = 0; i < items.length; i++) {
		if (start) {
			start = false;
			minY = items[i].y;
		}
		if (items[i].y < minY) {
			minY = items[i].y;
		}
	}

	return minY;

}

function getXValueOfMasterNode(master) {
	var items = nodes.get();
	var minX = 0;
	var maxX = 0;
	var start = true;
	for (var i = 0; i < items.length; i++) {
		if (items[i].masterId == master) {
			if (start) {
				start = false;
				minX = items[i].x;
				maxX = items[i].x;
			}
			if (items[i].x < minX) {
				minX = items[i].x;
			}
			if (items[i].x > maxX) {
				maxX = items[i].x;
			}
		}
	}

	return (maxX + minX) / 2;

}

function getYValueOfMasterNode(master) {
	var items = nodes.get();
	var minY = 0;
	var maxY = 0;
	var start = true;
	for (var i = 0; i < items.length; i++) {
		if (items[i].masterId == master) {
			if (start) {
				start = false;
				minY = items[i].y;
				maxY = items[i].y;
			}
			if (items[i].y < minY) {
				minY = items[i].y;
			}
			if (items[i].y > maxY) {
				maxY = items[i].y;
			}
		}
	}

	return minY - 300;

}

function getAllTextNodeMastersOfALevel(level) {
	var items = nodes.get();
	var help = [];
	for (var i = 0; i < items.length; i++) {
		var masterInhelp = false;
		if (items[i].wikiLevel == level) {
			for (var j = 0; j < help.length; j++) {
				if (help[j] == items[i].masterId) {
					masterInhelp = true;
				}
			}
			if (!masterInhelp)
				help.push(items[i].masterId);
		}
	}
	/*console.log("getAllTextNodeMastersOfALevel " + level);

	for (var j = 0; j < help.length; j++) {
	console.log(j + ". Master: " + help[j]);

	}*/
	return help;
}

function getAllChildrenOfANode(master) {
	var items = nodes.get();
	var help = new vis.DataSet();
	for (var i = 0; i < items.length; i++) {
		if (items[i].masterId == master) {
			help.add(items[i]);
		}
	}
	return help;
}

function getAllTextNodesSameLevelSameMaster(level, master) {
	var items = nodes.get();
	var help = new vis.DataSet();
	for (var i = 0; i < items.length; i++) {
		if (items[i].masterId == master && items[i].wikiLevel == level && items[i].type == 'text') {
			help.add(items[i]);
		}
	}
	return help;
}

function getMaxHeightOfLevel(level) {
	var items = nodes.get();
	var maxHeight = -1;
	for (var i = 0; i < items.length; i++) {
		if (items[i].wikiLevel == level && items[i].height > maxHeight)
			maxHeight = items[i].height + 300;
	}
	return maxHeight;
}

function getMaxLevel() {
	var items = nodes.get();
	var maxLevel = -1;
	for (var i = 0; i < items.length; i++) {
		if (items[i].wikiLevel > maxLevel)
			maxLevel = items[i].wikiLevel;
	}
	return maxLevel;
}
function deleteEqualsSigns(str, cnt /*to cancle the procedure*/
) {
	if (str.search("==") == 0 && cnt < 5)
		str = deleteEqualsSigns(str.substring(2, str.length), cnt + 1);
	return str;
}
function getTextOfSection(sectionTitle) {
	var stringToSearch = "== \xA7" + sectionTitle + " ==";
	var articleText = dr.getRawText();
	var index = articleText.search(stringToSearch);
	//console.log("STRING TO SEARCH: " + stringToSearch + " FOUND AT: " + index);
	var str = articleText.substring((index + stringToSearch.length), articleText.length);

	//console.log("STR: " + str);
	str = deleteEqualsSigns(str, 0);
	index = str.search("==");

	var ret = "";
	if (index > -1)
		ret = str.substr(0, index);
	else
		ret = str;

	//console.log("INDEXT TWO: " + index);
	ret.replace("=", " ");
	//console.log("RET: " + ret);
	return ret;
	//console.log(articleText);
}

String.prototype.replaceAt = function (index, character) {
	return this.substr(0, index) + character + this.substr(index + character.length);
}

String.prototype.replaceAtHelp = function (index, character) {
	return this.substr(0, index) + character + this.substr(index - 1 + character.length);
}

function repalceNewLineWithTwoNewLines(str, find, replace, n) {
	var cnt = 0;
	for (var i = 0; i < str.length; i++) {
		if (str[i] == find) {
			cnt += 1;
		}
		if (cnt == n) {
			str = str.replaceAtHelp(i, replace);
			cnt = 0;
			i++;
		}
	}
	return str;
}

function replaceCharacterWithAnother(str, find, replace, n) {
	var cnt = 0;
	for (var i = 0; i < str.length; i++) {
		if (str[i] == find) {
			cnt += 1;
		}
		if (cnt == n) {
			str = str.replaceAt(i, replace);
			cnt = 0;
		}
	}
	return str;
}
var intoOverviewMode = false;
var hideSectionText = false;
var hideTextAt = 0.1;
var switchToOverviewModeAt = 0.05;
var hideParagraphMode = false;
var overviewMode = false;
var imageSwitcher = false;
function onZoom(properties) {
	//console.log("ON ZOOM " + properties.direction + " SCALE: " + network.getScale());
	//IMPLEMENT SEMANTIC ZOOMING HERE
	//LET'S A PLAY HIDE AND A SEEK AH (Pls read with an italian accent ;-)

	//---------------------------------------------------------
	// HIDE PARAGRAPHS MODE
	if (hideParagraphMode) {
		if (network.getScale() < hideTextAt && !hideSectionText) {
			hideSectionText = true;
			var items = nodes.get();

			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (item.type == 'text') {
					textNodes.add(item);
				}
			}

			items = textNodes.get();
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				nodes.remove(item.id);
			}
		}

		if (network.getScale() >= hideTextAt && hideSectionText) {
			hideSectionText = false;
			var items = textNodes.get();
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				nodes.add(item);
			}
			textNodes.clear();
		}
	}

	//---------------------------------------------------------
	// OVERVIEW MODE
	if (overviewMode) {
		if (network.getScale() < switchToOverviewModeAt && !intoOverviewMode) {
			var items = nodes.get();

			for (var i = 0; i < items.length; i++) {
				nodesHideAndSeek.add(items[i]);
			}
			//console.log("NODES HIDE AND SEEK: " + JSON.stringify(nodesHideAndSeek));
			nodes.clear();
			nodes.add({
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

		if (network.getScale() >= switchToOverviewModeAt && intoOverviewMode) {
			intoOverviewMode = false;
			nodes.clear();
			var items = nodesHideAndSeek.get();

			for (var i = 0; i < items.length; i++) {
				nodes.add(items[i]);
			}
			nodesHideAndSeek.clear();

		}
	}
	//----------------------------------------------------------------
	if (imageSwitcher) {
		if (network.getScale() < 1 && levelOfSemanticZooming < 1) {
			//console.log("network.getSCALE < 1!!!");
			levelOfSemanticZooming = 1;
			/*nodes.add({
			id : 6,
			title : 'tooltip6',
			label : 'Node 6',
			group : 2,
			allowedToMoveX : true,
			allowedToMoveY : true
			});
			edges.add({
			from : 2,
			to : 6,
			style : "arrow"
			});*/
			var items = nodes.get();

			for (var i = 0; i < items.length; i++) {
				if (items[i].hasOwnProperty('image')) {
					//	console.log("images: " + items[i].id);
					//data.update({id: 1, text: 'item 1 (updated)'}); // triggers an 'update' event
					var help = items[i].image;

					nodes.update({
						id : items[i].id,
						label : 'test' + i,
						image : items[i].dataToChange,
						dataToChange : help
					});
				}

			}
		}

		if (network.getScale() >= 1 && levelOfSemanticZooming >= 1) {
			//console.log("network.getSCALE >= 1!!!");
			levelOfSemanticZooming = 0;
			/*nodes.add({
			id : 6,
			title : 'tooltip6',
			label : 'Node 6',
			group : 2,
			allowedToMoveX : true,
			allowedToMoveY : true
			});
			edges.add({
			from : 2,
			to : 6,
			style : "arrow"
			});*/
			var items = nodes.get();

			for (var i = 0; i < items.length; i++) {
				if (items[i].hasOwnProperty('image')) {
					console.log("images: " + items[i].id);
					//data.update({id: 1, text: 'item 1 (updated)'}); // triggers an 'update' event
					var help = items[i].image;

					nodes.update({
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

var sectionNodes = [];
var sectionsSplitted = false;
var paragraphIdCnt = 60000;
function splitSectionsIntoParagraphs() {
	if (!sectionsSplitted) {
		sectionsSplitted = true;
		var items = nodes.get();
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (item.type == 'text') {
				var text = item.label;
				var paragraphArray = text.split("\n\n");
				for (var j = 0; j < paragraphArray.length; j++) {
					if (paragraphArray[j].length > 10) {
						nodes.add({
							id : paragraphIdCnt,
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

						edges.add({
							from : item.masterId,
							to : paragraphIdCnt,
							style : "arrow"
						});

						paragraphIdCnt++;
					}
				}
				sectionNodes.push(item);
				nodes.remove(item.id);
			}
		}
		redraw();
		if (showReferencesFlag) {
			hideReferences();
			showReferences();
		}
	}
}

function combineParagaphsToSections() {
	if (sectionsSplitted) {
		sectionsSplitted = false;
		removeAllTextNodes();
		for (var i = 0; i < sectionNodes.length; i++) {
			nodes.add(sectionNodes[i]);
		}

		redraw();

		if (showReferencesFlag) {
			hideReferences();
			showReferences();
		}
	}
}

function removeAllTextNodes() {
	var items = nodes.get();
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		if (item.type == 'text') {
			nodes.remove(item.id);
		}
	}
}

function onSelect(properties) {
	console.log("ON SELECT " + properties.nodes);
	//network.focusOnNode(properties.nodes);
}

function getAllConnectedNodes(id, newNodeContainer) {
	var items = nodes.get();
	for (var i = 0; i < items.length; i++) {
		var item = items[i];

		if (item.masterId == id) {
			newNodeContainer.add(item);
			newNodeContainer = getAllConnectedNodes(item.id, newNodeContainer);
		}
	}
	return newNodeContainer;
}

function copyAllNodes(source, dest) {
	var items = source.get();
	for (var i = 0; i < items.length; i++) {
		dest.add(items[i]);
	}
}

var viewJustSpecificSection = false;

function onDoubleClick(properties) {
	var options = {
		scale : 8
	};
	//network.focusOnNode(properties.nodes, options);
	//SHOW JUST THE SELECTED ELEMENT AND ALL ELEMENTES WHICH ARE CONNECTED TO THIS ELEMENT
	//TODO WILL BECOME A PROBLEM WHEN ADDING ELEMENTS IS POSSIBLE


	var id = properties.nodes;
	//console.log("WHOLE: " + JSON.stringify(nodes.get(id)));
	//console.log("WIDTH: " + nodes.get(id)[0].width);
	var newNodeContainer = new vis.DataSet();
	//go recursively through all nodes
	//console.log("THE ID: " + id);

	newNodeContainer.add(nodes.get(id));
	newNodeContainer = getAllConnectedNodes(id, newNodeContainer);

	if (!viewJustSpecificSection)
		copyAllNodes(nodes, allNodesBackup);

	nodes.clear();
	copyAllNodes(newNodeContainer, nodes);

	viewJustSpecificSection = true;
}

function showAllItems() {
	if (viewJustSpecificSection) {
		viewJustSpecificSection = false;
		nodes.clear();
		copyAllNodes(allNodesBackup, nodes);
		allNodesBackup.clear();
	}
}

function onDragEnd(properties) {
	//console.log(properties.nodeIds);
	if (properties.nodeIds.length > 0) {
		var id = parseInt(properties.nodeIds[0]);
		var help = network.getPositions(id);
		nodes.update({
			id : id,
			x : help[properties.nodeIds[0]].x
		});
		nodes.update({
			id : id,
			y : help[properties.nodeIds[0]].y
		});
	}
}

function update() {
	var type = dropdown.value;
	var roundness = roundnessSlider.value;
	roundnessScreen.value = roundness;
	var options = {
		dataManipulation : {
			enabled : true,
			initiallyVisible : true
		},
		smoothCurves : {
			type : 'continuous',
			roundness : 1,
			dynamic : false,
			type : '1'
		}
	}

	network.setOptions(options);
}
var opt = {
	dataManipulation : {
		enabled : true,
		initiallyVisible : true
	},
	physics : {
		barnesHut : {
			gravitationalConstant : 0,
			springConstant : 0,
			centralGravity : 0
		}
	},
	smoothCurves : {
		type : 'continuous',
		roundness : 1,
		dynamic : false,
		type : '1'
	}
};

var network = new vis.Network(container, data, opt);

network.on('zoom', onZoom);

network.on('select', onSelect);

network.on('doubleClick', onDoubleClick);

network.on('dragEnd', onDragEnd);

update();

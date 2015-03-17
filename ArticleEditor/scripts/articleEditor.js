//----------- retrieve necessary data -----------------
var dr = new DataRetriever({
		title : 'Albert Einstein'
	});
dr.getAllMeasures();

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

/*nodes.add([{
id : 1,
title : 'tooltip1',
label : 'Node 1',
image : "http://upload.wikimedia.org/wikipedia/commons/6/6f/Einstein-formal_portrait-35.jpg",
shape : "image",
value : 30,
group : 1,
allowedToMoveX : true,
allowedToMoveY : true
}, {
id : 2,
title : 'tooltip2',
label : 'Node 2',
image : url,
dataToChange : urlTest,
shape : 'image',
group : 1,
allowedToMoveX : true,
allowedToMoveY : true
}, {
id : 3,
title : 'tooltip3',
label : 'Node 3',
group : 2,
allowedToMoveX : true,
allowedToMoveY : true
}, {
id : 4,
title : 'tooltip4',
label : 'Node 4',
group : 2,
allowedToMoveX : true,
allowedToMoveY : true
}, {
id : 5,
title : 'tooltip5',
label : 'Node 5',
group : 2,
allowedToMoveX : true,
allowedToMoveY : true
}
]);*/

// create an array with edges

var edges = new vis.DataSet();
/*edges.add([{
from : 1,
to : 2,
style : "arrow"
}, {
from : 1,
to : 3,
style : "arrow"
}, {
from : 2,
to : 4,
style : "arrow"
}, {
from : 2,
to : 5,
style : "arrow"
}
]);*/

// create a network
var container = document.getElementById('mynetwork');
var data = {
	nodes : nodes,
	edges : edges
};

var levelOfSemanticZooming = 0;

var fillDataNew = function () {
	var sectionInfos = dr.getSectionInfos();
	var articleText = dr.getRawText();
	var xOffset = 1500;
	var yOffset = 600;
	var idCnt = 0;
	var levelOld = 0;
	var currentLevel = 0;
	var topIds = [];
	var sameSectionPosition = [];
	var sectionId = 50000;
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
				title : 'tooltip' + idCnt,
				label : sectionInfos[i].line + ' currentLEVEL: ' + currentLevel + ' x: ' + (sectionInfos[i].level * xOffset) + ' y: ' + (sectionsInSameLevel * yOffset),
				value : 1,
				allowedToMoveX : true,
				allowedToMoveY : true,
				wikiLevel : currentLevel,
				masterId : from, //if from == -1 the no master
				imtext : false
			});
			var textOfSection = getTextOfSection(sectionInfos[i].line);

			//console.log("-----------------------> " + sectionInfos[i].line + " ---- > " + textOfSection);
			//console.log("LENGTH: " + textOfSection.length);
			if (textOfSection != "" && textOfSection.length > 5) {

				var value = textOfSection.split(' ').length;
				textOfSection = replaceCharacterWithAnother(textOfSection, " ", '\n', 10);
				nodes.add({
					id : sectionId,
					x : sectionsInSameLevel * xOffset,
					y : currentLevel * yOffset + 800,
					title : 'tooltip' + idCnt,
					label : textOfSection,
					value : value,
					shape : 'box',
					allowedToMoveX : true,
					allowedToMoveY : true,
					wikiLevel : currentLevel,
					masterId : idCnt, //if from == -1 the no master
					imtext : true
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
				title : 'tooltip' + idCnt,
				label : sectionInfos[i].line + ' currentLEVEL: ' + currentLevel + ' x: ' + (sectionInfos[i].level * xOffset) + ' y: ' + (sectionsInSameLevel * yOffset),
				value : 1,
				allowedToMoveX : true,
				allowedToMoveY : true,
				wikiLevel : currentLevel,
				masterId : from, //if from == -1 the no master
				imtext : false
			});

			var textOfSection = getTextOfSection(sectionInfos[i].line);
			//console.log("-----------------------> " + sectionInfos[i].line + " ---- > " + textOfSection);
			if (textOfSection != "" && textOfSection.length > 5) {

				var value = textOfSection.split(' ').length;
				textOfSection = replaceCharacterWithAnother(textOfSection, " ", '\n', 10);
				nodes.add({
					id : sectionId,
					x : sectionsInSameLevel * xOffset + 800,
					y : currentLevel * yOffset,
					title : 'tooltip' + idCnt,
					label : textOfSection,
					shape : 'box',
					value : value,
					allowedToMoveX : true,
					allowedToMoveY : true,
					wikiLevel : currentLevel,
					masterId : idCnt, //if from == -1 the no master
					imtext : true
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
	/*
	var items = nodes.get();

	var arrayHeightHelper = [];
	for (var i = 0; i < items.length; i++) {
	var sum = 0;
	var mainItem = items[i];
	if (mainItem.imtext) {
	for (var j = 0; j < items.length; j++) {
	var item = items[j];
	//console.log("HERE : " +mainItem.id + " " + mainItem.y+" < "+item.y+" && "+mainItem.wikiLevel+" == "+item.wikiLevel+" && "+item.imtext);
	if (mainItem.y > item.y && mainItem.wikiLevel == item.wikiLevel && item.imtext) {
	sum += item.height;
	}
	}
	}
	console.log("ID: " + mainItem.id + " sum : " + sum + " TEXT " + mainItem.label);
	arrayHeightHelper.push({
	id : mainItem.id,
	y : (mainItem.y + sum)
	});
	}

	for (var i = 0; i < arrayHeightHelper.length; i++) {
	nodes.update({
	id : arrayHeightHelper[i].id,
	y : arrayHeightHelper[i].y
	});
	}*/

	var currentlevelCnt = getMaxLevel();
	var sumMaxHeightOfLevel = 0; //BUG IN Y DIRECTION
	console.log("currentlevelCnt : " + currentlevelCnt);
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
			for (var j = 0; j < items.length; j++) {
				if (j == 0)
					xCntStart = xCnt;
				if (j + 1 == items.length)
					xCntEnd = xCnt;
				console.log("ID: " + items[j].id + " " + xCnt + " " + (-sumMaxHeightOfLevel));
				nodes.update({
					id : items[j].id,
					x : xCnt,
					y : (-sumMaxHeightOfLevel)
				});
				xCnt += items[j].width + 300;
			}
			console.log("UPDATE NODE");
			nodes.update({
				id : allMasterOfALevel[i],
				x : ((xCntStart + xCntEnd) / 2),//getXValueOfMasterNode(allMasterOfALevel[i]),//((xCntStart + xCntEnd) / 2),//
				y : -sumMaxHeightOfLevel - 500//getYValueOfMasterNode(allMasterOfALevel[i])//
			});

		}
	}
	network.redraw();
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

	return (maxY + minY) / 2;

}

function getAllTextNodeMastersOfALevel(level) {
	var items = nodes.get();
	var help = [];
	for (var i = 0; i < items.length; i++) {
		var masterInhelp = false;
		if (items[i].wikiLevel == level) {
			for (var j = 0; j < help.length; j++) {
				if (help[i] == items[i].masterId) {
					masterInhelp = true;
				}
			}
			if (!masterInhelp)
				help.push(items[i].masterId);
		}
	}
	return help;
}

function getAllTextNodesSameLevelSameMaster(level, master) {
	var items = nodes.get();
	var help = new vis.DataSet();
	for (var i = 0; i < items.length; i++) {
		if (items[i].masterId == master && items[i].wikiLevel == level && items[i].imtext) {
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
			maxHeight = items[i].height;
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

function replaceCharacterWithAnother(str, find, replace, n) {
	var cnt = 0;
	for (var i = 0; i < str.length; i++) {
		if (str[i] == find) {
			cnt += 1;
		}
		if (cnt == n) {
			str = str.replaceAt(i, "\n");

			cnt = 0;
		}
	}
	return str;
}
var intoOverviewMode = false;
var hideSectionText = false;
var hideTextAt = 0.3;
var switchToOverviewModeAt = 0.05;
var hideParagraphMode = false;
var overviewMode = false;
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
				if (item.imtext) {
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
	viewJustSpecificSection = false;
	nodes.clear();
	copyAllNodes(allNodesBackup, nodes);
	allNodesBackup.clear();
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

var ArticleController = function (vals) {

	var networkDetailView = null;
	var network = null;
	var container = null;
	var containerDetailView = null;
	var nodes = null;
	var edges = null;
	var data = null;
	var phpConnector = null;
	var isLoggedIn = false;

	//ArticleRenderers
	var articleRenderers = [];
	var minID = 1;
	var maxID = 999;
	var minX = 0;
	var maxX = 4999;
	var minY = 0;
	var maxY = 4999;
	var editToken = "";
	var userToken = "";
	var GLOBAL_loginName = "";

	var articleController = {};
	var dataManipulator;

	var sensiumRequester;

	function update() {
		var type = "continuous";
		var roundness = 0.5;
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
			},
			hover : true
		}

		network.setOptions(options);
	}
	var opt = {
		dataManipulation : {
			enabled : true,
			initiallyVisible : true
		},
		onConnect : function (data, callback) {
			dataManipulator.connectNodes(data, callback);
		},
		onEdit : function (data, callback) {
			dataManipulator.editNodes(data, callback);
		},
		onAdd : function (data, callback) {
			console.log("IN HERE");
			dataManipulator.addNode(data);
		},
		physics : {
			barnesHut : {
				gravitationalConstant : 0,
				springConstant : 0,
				centralGravity : 0
			}
		},
		nodes : {
			widthMin : 1000,
			widthMax : 50000,
		},
		smoothCurves : {
			type : 'continuous',
			roundness : 1,
			dynamic : false,
			type : '1'
		},
		/*clustering : {
		enabled : true
		},*/
		hover : true
	};

	
	//-------------------- User Input -------------------
	articleController.retrieveData = function () {
		console.log("articleController.retrieveData");
		var articleName = $("#articleName").val();
		sensiumRequester = new SensiumRequester({controller : articleController});
		sensiumRequester.sensiumURLRequest("https://en.wikipedia.org/wiki/" + articleName);
		var articleRenderer = new ArticleRenderer({
				network : network,
				minID : minID,
				maxID : maxID,
				minX : minX,
				maxX : maxX,
				minY : minY,
				maxY : maxY,
				data : data,
				articleName : articleName,
				controller : articleController
			});
		dataManipulator = new DataManipulator({
				network : network,
				data : data,
				articleName : articleName,
				controller : articleController
			});
		minID += 1000;
		maxID += 1000;
		minX += 5000;
		maxX += 5000;
		minY += 5000;
		maxY += 5000;

		articleRenderers.push(articleRenderer);
		articleRenderer.retrieveData();
	}

	articleController.fillDataNew = function () {
		var articleName = $("#articleName").val();
		for (var i = 0; i < articleRenderers.length; i++) {
			if (articleRenderers[i].getTitle() == articleName)
				articleRenderers[i].fillDataNew();
		}
	}
		
	articleController.getSensiumRequester = function(){
		return sensiumRequester;
	}

	articleController.showAllItems = function () {
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].showAllItems();
		}
	}
	articleController.colorLevels = function () {
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].colorLevels();
		}
	}
	articleController.splitSectionsIntoParagraphs = function () {
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].splitSectionsIntoParagraphs();
		}
	}
	articleController.combineParagaphsToSections = function () {
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].combineParagaphsToSections();
		}
	}
	articleController.showReferences = function () {
		if ($('#showReferences a span').attr("class") == "ca-icon") {
			$('#showReferences a span').attr("class", "ca-icon-selected");
			$('#showReferences a div h2').attr("class", "ca-main-selected");
			$('#showReferences').css("background-color", "#000");
		} else {
			$('#showReferences a span').attr("class", "ca-icon");
			$('#showReferences a div h2').attr("class", "ca-main");
			$('#showReferences').css("background-color", "grey");
		}
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].showReferences();
		}
	}
	articleController.hideReferences = function () {
		if ($('#showReferences a span').attr("class") == "ca-icon") {
			$('#showReferences a span').attr("class", "ca-icon-selected");
			$('#showReferences a div h2').attr("class", "ca-main-selected");
			$('#showReferences').css("background-color", "#000");
		} else {
			$('#showReferences a span').attr("class", "ca-icon");
			$('#showReferences a div h2').attr("class", "ca-main");
			$('#showReferences').css("background-color", "grey");
		}
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].hideReferences();
		}
	}
	articleController.showImages = function () {
		if ($('#showImages a span').attr("class") == "ca-icon") {
			$('#showImages a span').attr("class", "ca-icon-selected");
			$('#showImages a div h2').attr("class", "ca-main-selected");
			$('#showImages').css("background-color", "#000");
		} else {
			$('#showImages a span').attr("class", "ca-icon");
			$('#showImages a div h2').attr("class", "ca-main");
			$('#showImages').css("background-color", "grey");
		}
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].showImages();
		}
	}
	articleController.hideImages = function () {
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].hideImages();
		}
	}
	articleController.posImages = function () {
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].posImages();
		}
	}
	articleController.copy = function () {
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].copy();
		}
	}
	articleController.doRedraw = function () {
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].doRedraw();
		}
	}
	articleController.semanticZooming = function () {
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].semanticZooming();
		}
	}
	articleController.showOverview = function () {
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].showOverview();
		}
	}
	articleController.showQuality = function () {
		articleController.showTheWholeArticleInMainView();
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].showQuality();
		}
	}
	articleController.reset = function () {
		//Actually we just have to remove the articleRenderers
		articleRenderers.splice(0, articleRenderers.length);
		//We destroy the network
		network.destroy();
		articleController.init();
		$('#qualityParameters').html("");
		$('#overallScore').html("<b>Quality score of the article:</b>");
		$("#sensiumOverallScore").html("<b>Sensium score:</b>");
		$('#wikiTextInner').children().remove();
		$('#progressBarOverallScore').attr("value", "0");
		$('#progressBarSensiumOverallScoreController').css("right", 200 - 0 * 200);
		$('#qualityFlawViewText').html("");
	}
	articleController.showTheWholeArticle = function () {
		//TODO: Do a refactoring so that it work for more than one article at the end
		dataManipulator.showTheWholeArticle(articleRenderers[0].getDataRetriever(), articleRenderers[0].getQualityManager());
	}

	articleController.highlightSectionInTree = function (sectionName) {
		$("#editor_section_name").html(sectionName);
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].highlightSectionInTree(sectionName);
		}
	}

	articleController.showQualityTable = function (sectionName) {
		//TODO: Do a refactoring so that it work for more than one article at the end
		dataManipulator.showQualityTableOfSection(sectionName, articleRenderers[0].getDataRetriever(), articleRenderers[0].getQualityManager());
	}

	articleController.showTheWholeArticleInMainView = function () {
		dataManipulator.showTheWholeArticleInMainView(articleRenderers[0].getDataRetriever(), articleRenderers[0].getQualityManager());
	}

	articleController.resizeSections = function () {
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].resizeSections();
		}
	}

	articleController.login = function () {
		phpConnector = new PhpConnector({
				controller : articleController
			});
		$("#dialogLogin").dialog({
			buttons : [{
					text : "Login",
					click : function () {
						GLOBAL_loginName = $("#loginUsername").val();
						phpConnector.login($("#loginUsername").val(), $("#loginPassword").val());
					}
				}, {
					text : "Cancel",
					click : function () {
						$(this).dialog("close");
					}
				}
			]
		});
		$("#dialogLogin").dialog("open");
	}

	articleController.setUserToken = function (token) {
		isLoggedIn = true;
		userToken = token;
		console.log("USER TOKEN: " + userToken);
		$("#dialogLogin").dialog("close");
		console.log("LOGIN NAME2: " + GLOBAL_loginName);
		$("#loginSUB").html(GLOBAL_loginName);
		$("#liLogin .ca-icon").css("color", "#ccff00");
		$("#liLogin .ca-content").css("color", "#ccff00");
		$("#liLogin .ca-content .ca-main").css("color", "#ccff00");
		$("#liLogin .ca-content .ca-sub").css("color", "#ccff00");
		phpConnector.getEditToken();
	}

	articleController.setEditToken = function (token) {
		editToken = token;
		editToken = editToken.replace("+\\", "%2B%5C");
		console.log("EDIT TOKEN: " + editToken);

		//JUST FOR TESTS
		//var url = "http://en.wikipedia.org/w/api.php?action=edit&format=xml";
		//var params = "action=edit&title=User:Dst2015/sandbox&section=2&token=" + editToken + "&text=THIS IS A TEST2!!!";
		//articleController.editRequest(url, params);
	}

	articleController.getUserToken = function () {
		return userToken;
	}

	articleController.getEditToken = function () {
		return editToken;
	}

	articleController.newSection = function (url, params) {
		if (isLoggedIn) {
			phpConnector.createRequest(url, params, articleController.newSectionCreated);
		} else
			alert("U r not logged in!!!");
	}

	articleController.newImage = function (url, params) {
		if (isLoggedIn) {
			phpConnector.createRequest(url, params, articleController.newImageCreated);
		} else
			alert("U r not logged in!!!");
	}

	articleController.editRequest = function (url, params, id) {
		if (isLoggedIn) {
			phpConnector.editRequest(url, params, id, articleController.updateSection);
		} else
			alert("U r not logged in!!!");
	}

	articleController.updateSection = function (id) {
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].updateSection(id);
		}
		dataManipulator.editAnimation(false);
	}

	articleController.reload = function (id) {
		articleController.reset();
		articleController.retrieveData();
	}
	articleController.newImageCreated = function (id) {
		console.log("NEW Image CREATED");
		articleController.reset();
		articleController.retrieveData();
	}
	articleController.newSectionCreated = function (id) {
		console.log("NEW SECTION CREATED");
		articleController.reset();
		articleController.retrieveData();
	}

	articleController.changeValueOfCheckbox = function (id, isSet) {
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].changeValueOfCheckbox(id, isSet);
		}
	}

	articleController.getItem = function (id) {
		for (var i = 0; i < articleRenderers.length; i++) {
			var item = articleRenderers[i].getItem(id);
			if (item != false)
				return item;
		}
		return null;
	}

	articleController.addNode = function () {
		dataManipulator.addNode(data);
	}

	articleController.getDataRetrieverById = function (id) {
		for (var i = 0; i < articleRenderers.length; i++) {
			var currentDataRetriever = articleRenderers[i].getDataRetrieverById(id);
			if (currentDataRetriever != false)
				return currentDataRetriever;
		}
	}

	articleController.closeEditDialog = function () {
		dataManipulator.closeEditDialog();
		articleController.showTheWholeArticleInMainView();
	}

	articleController.goToSection = function (sectionName, tag) {
		//HIGHLIGHT TAG FIRST:
		$(".highlight").contents().unwrap();
		$('#wikiTextInner *').highlight(tag, "highlight");
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[0].highlightSectionInTree(sectionName, true);
		}

	}
	
	articleController.setSentimentScoreOfSection = function(sentimentScore, sectionName){
	//	console.log("setSentimentScoreOfSection " + sectionName + " score " + sentimentScore);
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[0].setSentimentScoreOfSection(sectionName, sentimentScore);
		}
	}
	//-------------------- EVENTS ----------------------


	articleController.onhoverNode = function (properties) {
		//console.log("ONHOVERNODE " + JSON.stringify(properties));
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].showNode(networkDetailView, properties.node);
		}
	}

	articleController.onblurNode = function (properties) {
		/*	console.log("onblurNode " + JSON.stringify(properties));
		var object = {scale : 0.05};
		networkDetailView.moveTo(object);*/

	}

	articleController.onZoom = function (properties) {
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].onZoom(properties);
		}
	}

	articleController.onSelect = function (properties) {

		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].onSelect(properties);
		}
	}

	articleController.onDoubleClick = function (properties) {
		//console.log("ON DOUBLE CLICK " + JSON.stringify(properties));
		//Select everything (does not work with doubleclick if someone can fix it
		//I'd be really happy!!!)
		/*	if (properties.nodes.length == 0 && properties.edges.length == 0) {

		var x = properties.pointer.canvas.x;
		var y = properties.pointer.canvas.y;
		for (var i = 0; i < articleRenderers.length; i++) {
		var maxX = articleRenderers[i].getBiggestXValue();
		var maxY = articleRenderers[i].getBiggestYValue();
		var minX = articleRenderers[i].getSmallestXValue();
		var minY = articleRenderers[i].getSmallestYValue();
		console.log(x + " >= " + minX + " && " + x + " <= " + maxX + " && " + y + " >=  " + minY + " && " + y + " <= " + maxY);
		if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
		articleRenderers[i].selectAllNodes();
		}
		}

		} else {*/
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].onDoubleClick(properties);
		}
		//}
	}

	articleController.onClick = function (properties) {
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].onClick(properties);
		}
		//console.log("ON DOUBLE CLICK " + JSON.stringify(properties));
		/*var x = properties.pointer.canvas.x;
		var y = properties.pointer.canvas.y;
		if (properties.nodes.length == 0 && properties.edges.length == 0) {

		for (var i = 0; i < articleRenderers.length; i++) {
		var maxX = articleRenderers[i].getBiggestXValue();
		var maxY = articleRenderers[i].getBiggestYValue();
		var minX = articleRenderers[i].getSmallestXValue();
		var minY = articleRenderers[i].getSmallestYValue();
		console.log(x + " >= " + minX + " && " + x + " <= " + maxX + " && " + y + " >=  " + minY + " && " + y + " <= " + maxY);
		if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
		articleRenderers[i].selectAllNodes();
		}
		}

		}*/
	}

	articleController.onDragEnd = function (properties) {
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].onDragEnd(properties);
		}
	}

	articleController.showSettings = function () {
		$("#dialogSettings").dialog("open");
		if ($('#showSettings a span').attr("class") == "ca-icon") {
			$('#showSettings a span').attr("class", "ca-icon-selected");
			$('#showSettings a div h2').attr("class", "ca-main-selected");
			$('#showSettings').css("background-color", "#000");
		} else {
			$('#showSettings a span').attr("class", "ca-icon");
			$('#showSettings a div h2').attr("class", "ca-main");
			$('#showSettings').css("background-color", "grey");
		}
	}

	articleController.init = function () {

		container = document.getElementById('mynetwork');
		containerDetailView = document.getElementById('mynetworkDetailView');
		nodes = new vis.DataSet();
		edges = new vis.DataSet();

		data = {
			nodes : nodes,
			edges : edges
		};
		network = new vis.Network(container, data, opt);
		networkDetailView = new vis.Network(containerDetailView, data, opt);
		network.on('zoom', this.onZoom);

		network.on('select', this.onSelect);

		network.on('doubleClick', this.onDoubleClick);

		network.on('click', this.onClick);

		network.on('dragEnd', this.onDragEnd);

		network.on('hoverNode', this.onhoverNode);

		network.on('blurNode', this.onblurNode);

		update();
	}

	articleController.sensium = function () {
		var sensiumRequester = new SensiumRequester();
		sensiumRequester.sensium();
	}

	return articleController;

};

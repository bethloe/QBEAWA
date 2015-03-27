var ArticleController = function (vals) {

	var networkDetailView = null;
	var network = null;
	var container = null;
	var containerDetailView = null;
	var nodes = null;
	var edges = null;
	var data = null;

	//ArticleRenderers
	var articleRenderers = [];
	var minID = 1;
	var maxID = 999;
	var minX = 0;
	var maxX = 4999;
	var minY = 0;
	var maxY = 4999;

	var articleController = {};
	var dataManipulator;

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

	articleController.showAllItems = function () {
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].showAllItems();
		}
	}
	articleController.colorLevels = function (isColor) {
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].colorLevels(isColor);
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
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].showReferences();
		}
	}
	articleController.hideReferences = function () {
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].hideReferences();
		}
	}
	articleController.showImages = function () {
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
	articleController.semanticZooming = function (onOrOff) {
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].semanticZooming(onOrOff);
		}
	}
	articleController.showOverview = function () {
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].showOverview();
		}
	}
	articleController.showQuality = function () {
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].showQuality();
		}
	}
	articleController.reset = function () {
		//console.log("RESET");
		/*for (var i = 0; i < articleRenderers.length; i++) {
		articleRenderers[i].reset();
		}*/
		//Actually we just have to remove the articleRenderers
		articleRenderers.splice(0, articleRenderers.length);
		//We destroy the network
		network.destroy();
		articleController.init();
		$('#qualityParameters').html("");
		$('#overallScore').html("");
	}
	articleController.showTheWholeArticle = function () {
		//TODO: Do a refactoring so that it work for more than one article at the end
		dataManipulator.showTheWholeArticle(articleRenderers[0].getDataRetriever(), articleRenderers[0].getQualityManager());
	}
	articleController.showQualityTable = function (sectionName) {
		//TODO: Do a refactoring so that it work for more than one article at the end
		dataManipulator.showQualityTableOfSection(sectionName, articleRenderers[0].getDataRetriever(), articleRenderers[0].getQualityManager());
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
		if (properties.nodes.length == 0 && properties.edges.length == 0) {

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

		} else {
			for (var i = 0; i < articleRenderers.length; i++) {
				articleRenderers[i].onDoubleClick(properties);
			}
		}
	}

	articleController.onClick = function (properties) {
		//console.log("ON DOUBLE CLICK " + JSON.stringify(properties));
		var x = properties.pointer.canvas.x;
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

		}
	}

	articleController.onDragEnd = function (properties) {
		for (var i = 0; i < articleRenderers.length; i++) {
			articleRenderers[i].onDragEnd(properties);
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
	return articleController;

};

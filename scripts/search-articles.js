
var GLOBAL_linkToAPI = "http://en.wikipedia.org/w/api.php?";
var GLOBAL_keyWord = "";
var GLOBAL_maxNumSearch = 0;
var GLOBAL_searchCount = 0;
var GLOBAL_dataCollector = [];
var GLOBAL_CrawledArticles = {};
var GLOBAL_numElements = 17;
var GLOBAL_interval;
var GLOBAL_generatingDataCnt = 0;
var retrieveData = function (urlInclAllOptions, functionOnSuccess) {
	$.ajax({
		url : urlInclAllOptions,
		jsonp : "callback",
		dataType : "jsonp",
		cache : false,
		success : functionOnSuccess,
	});
}

var searchArticle = function (keyword, maxNumSearch) {
	GLOBAL_keyWord = $("#article-name").val(); //keyword;
	GLOBAL_maxNumSearch = parseInt($("#max-num").val()); //maxNumSearch;
	GLOBAL_searchCount = 0;
	GLOBAL_dataCollector = [];
	GLOBAL_CrawledArticles = {};
	retrieveData(GLOBAL_linkToAPI + "action=query&list=search&format=json&srsearch=" + GLOBAL_keyWord + "&srlimit=max&srprop=&continue", handleSearch);
	//showAllData();
	/*window.setInterval(function () {
	console.log("IN HERE");
	showAllDataTest();
	}, 2000);*/
	GLOBAL_interval = setInterval(showAllDataAsList, 1000);
}

var handleSearch = function (JSONResponse) {
	var articles = JSON.parse(JSON.stringify(JSONResponse));
	var JSONArticleTitles = articles.query.search;

	for (var i = 0; i < JSONArticleTitles.length; i++) {
		if (GLOBAL_searchCount >= GLOBAL_maxNumSearch) {
			console.log("SEARCH IS DONE2");
			return;
		}
		if (!GLOBAL_CrawledArticles.hasOwnProperty(JSONArticleTitles[i].title)) {
			console.log("TITLE: " + JSONArticleTitles[i].title);
			GLOBAL_CrawledArticles[JSONArticleTitles[i].title] = 1;
			var dr = new DataRetriever({
					title : JSONArticleTitles[i].title
				});
			GLOBAL_dataCollector.push(dr);
			dr.getAllMeasures();
			GLOBAL_searchCount += 1;
		}
	}
	if (articles.hasOwnProperty("continue")) {
		if (articles.continue.hasOwnProperty("sroffset")) {
			//GET REST OF THE DATA:
			retrieveData(GLOBAL_linkToAPI + "action=query&list=search&format=json&srsearch=" + GLOBAL_keyWord + "&srlimit=max&rsoffset=" + articles.continue.sroffset + "&srprop=&continue", handleSearch);
		}
	} else {
		console.log("SEARCH IS DONE");
	}
}

var showAllDataAsList = function () {
	//CHECK IF WE ARE DONE:
	var done = true;
	console.log("IN HERE");

	var visController = new VisController();
	if (GLOBAL_generatingDataCnt == 0) {
		visController.updateHeaderInfoSection("Generating Data.");
		GLOBAL_generatingDataCnt += 1;
	} else if (GLOBAL_generatingDataCnt == 1) {
		visController.updateHeaderInfoSection("Generating Data..");
		GLOBAL_generatingDataCnt += 1;
	} else if (GLOBAL_generatingDataCnt == 2) {
		visController.updateHeaderInfoSection("Generating Data...");
		GLOBAL_generatingDataCnt = 0;
	}

	for (var i = 0; i < GLOBAL_dataCollector.length; i++) {
		var jsonData = JSON.parse(GLOBAL_dataCollector[i].getJSONString());
		if (Object.keys(jsonData).length < GLOBAL_numElements)
			done = false;
	}
	//----------------------------------------------------------------------
	if (done) {
		clearInterval(GLOBAL_interval);
		var articles = {
			data : []
		};

		for (var i = 0; i < GLOBAL_dataCollector.length; i++) {
			var jsonData = JSON.parse(GLOBAL_dataCollector[i].getJSONString());
			var temp = {};
			for (var key in jsonData) {
				temp[key] = jsonData[key];
			}
			articles.data.push(
				temp);
		}
		visController.init(articles);
	}
}

var showAllDataAsTable = function () {
	//console.log("LENGTH: " + GLOBAL_dataCollector.length);
	var done = true;

	for (var i = 0; i < GLOBAL_dataCollector.length; i++) {
		var jsonData = JSON.parse(GLOBAL_dataCollector[i].getJSONString());
		if (Object.keys(jsonData).length < GLOBAL_numElements)
			done = false;
	}
	//----------------------------------------------------------------------
	if (done) {
		$('#output').empty();
		var content = "<table border=\"1\">";
		content += "<tr><th>Article Name</th><th>Total Number of Edits</th><th>Number of Registered User Edits</th><th>Number of Anonymous User Edits</th><th>Number of Admin Edits</th> \
																																															<th>Admin Edit Share</th><th>Number of Unique Editors</th><th>Article length (in # of characters)</th><th>Currency (in days)</th><th>Num. of Internal Links (This value is wrong I guess)</th> \
																																															<th>Num. of External Links</th><th>Num. of Pages which links to this page</th><th>Num. of Images</th><th>Article age (in days)</th><th>Diversity</th> \
																																															<th>Flesch</th><th>Kincaid</th><th>Num. of Internal Broken Links</th><th>Number of Reverts (no permissions)</th><th>Article Median Revert Time (no permissions)</th><th>Article Connectivity (Have problems with that)</th> \
																																															<th>Article Median Revert Time (no permissions)</th><th>Information noise(content) (Have to figure that out)</th>";

		for (var i = 0; i < GLOBAL_dataCollector.length; i++) {
			//console.log(GLOBAL_dataCollector[i].getJSONString());
			var jsonData = JSON.parse(GLOBAL_dataCollector[i].getJSONString());
			content += "<tr><td>" + jsonData.title + "</td><td>" + jsonData.numEdits + "</td><td>" + jsonData.numRegisteredUserEdits + "</td><td>" + jsonData.numAnonymousUserEdits + "</td><td>" + jsonData.numAdminUserEdits + "</td> \
																																																																										<td>" + jsonData.adminEditShare + "</td><td>" + jsonData.numUniqueEditors + "</td><td>" + jsonData.articleLength + "</td><td>" + jsonData.currency + "</td><td>" + jsonData.internalLinks + "</td> \
																																																																										<td>" + jsonData.externalLinks + "</td><td>" + jsonData.linksHere + "</td><td>" + jsonData.numImages + "</td><td>" + jsonData.articleAge + "</td><td>" + jsonData.diversity + "</td> \
																																																																										<td>" + jsonData.flesch + "</td><td>" + jsonData.kincaid + "</td></tr>";

		}
		content += "</table>";

		$('#output').append(content);
	}
}

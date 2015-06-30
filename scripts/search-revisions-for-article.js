
var GLOBAL_linkToAPIRev = "http://en.wikipedia.org/w/api.php?";
var GLOBAL_keyWordRev = "";
var GLOBAL_maxNumSearchRev = 0;
var GLOBAL_searchCountRev = 0;
var GLOBAL_dataCollectorRev = [];
var GLOBAL_CrawledArticlesRev = {};
var GLOBAL_numElementsRev = 11;
var GLOBAL_intervalRev;
var GLOBAL_generatingDataCntRev = 0;
var visController;
var GLOBLA_getFeaturedArticlesLinkRev = "action=query&format=json&list=categorymembers&cmlimit=50&cmtitle=Category:Featured%20articles&continue"
	var GLOBLA_getFeaturedArticlesLinkRevContinueRev = "action=query&format=json&list=categorymembers&cmlimit=10&cmtitle=Category:Featured%20articles"

	var retrieveData = function (urlInclAllOptions, functionOnSuccess) {
	$.ajax({
		url : urlInclAllOptions,
		jsonp : "callback",
		dataType : "jsonp",
		cache : false,
		success : functionOnSuccess,
	});
}

var getVisController = function () {
	return visController;
}

var searchRevision = function (revid, maxNumSearch, equationEditor, visControllerPar) {
	GLOBAL_keyWordRev = revid; //keyword;
	GLOBAL_maxNumSearchRev = maxNumSearch; //maxNumSearch;
	GLOBAL_searchCountRev = 0;
	GLOBAL_dataCollectorRev = [];
	GLOBAL_CrawledArticlesRev = {};

	retrieveData(GLOBAL_linkToAPIRev + "action=query&format=json&prop=revisions&revids=" + GLOBAL_keyWordRev + "&rvprop=ids|user&continue", handleSearchRevision);

	GLOBAL_intervalRev = setInterval(showAllDataAsListRev, 1000);

	visController = visControllerPar;
	visController.showPreparingMessage("Generating Data.");
	//equationEditor.setVisController(visController);
	GLOBAL_generatingDataCntRev += 1;
}
/*
var handleSearchFeaturedArticles = function (JSONResponse) {
	var articles = JSON.parse(JSON.stringify(JSONResponse));
	var JSONArticleTitles = articles.query.categorymembers;

	for (var i = 0; i < JSONArticleTitles.length; i++) {
		if (GLOBAL_searchCountRev >= GLOBAL_maxNumSearchRev) {
			return;
		}
		if (!GLOBAL_CrawledArticlesRev.hasOwnProperty(JSONArticleTitles[i].title)) {
			GLOBAL_CrawledArticlesRev[JSONArticleTitles[i].title] = 1;
			var dr = new DataRetriever({
					title : JSONArticleTitles[i].title,
					featured : true
				});
			GLOBAL_dataCollectorRev.push(dr);
			dr.getAllMeasures();
			GLOBAL_searchCountRev += 1;
		}
	}
	if (articles.hasOwnProperty("continue")) {
		if (articles.continue.hasOwnProperty("cmcontinue")) {
			//GET REST OF THE DATA:
			//retrieveData(GLOBAL_linkToAPIRev + GLOBLA_getFeaturedArticlesLinkRevContinueRev  + "&cmcontinue="+articles.continue.cmcontinue+"&continue", //handleSearchFeaturedArticles);

			retrieveData(GLOBAL_linkToAPIRev + "action=query&list=search&format=json&srsearch=" + GLOBAL_keyWordRev + "&srlimit=10&srprop=&continue", handleSearch);
		}
	} else {
		console.log("SEARCH IS DONE");
	}
}*/

var handleSearchRevision = function (JSONResponse) {
	var articles = JSON.parse(JSON.stringify(JSONResponse));
	console.log("-------------> " + JSON.stringify(JSONResponse));
	var JSONArticleTitles2 = articles.query.pages[Object.keys(articles.query.pages)[0]].revisions;
	var JSONArticleTitles = JSONArticleTitles2[0];
	if (JSONArticleTitles != undefined) {
		if (GLOBAL_searchCountRev >= GLOBAL_maxNumSearchRev) {
			return;
		}
		if (!GLOBAL_CrawledArticlesRev.hasOwnProperty(JSONArticleTitles.revid)) {
			GLOBAL_CrawledArticlesRev[JSONArticleTitles.revid] = 1;
			console.log("....................> " + JSONArticleTitles.revid);
			var dr = new DataRetrieverRevisions({
					title : JSONArticleTitles.revid,
					featured : false
				});
			GLOBAL_dataCollectorRev.push(dr);
			dr.getAllMeasures();
			GLOBAL_searchCountRev += 1;
		}
	}
	if (JSONArticleTitles.hasOwnProperty("parentid")) {
		retrieveData(GLOBAL_linkToAPIRev + "action=query&format=json&prop=revisions&revids=" + JSONArticleTitles.parentid + "&rvprop=ids|user&continue", handleSearchRevision);
	} else {
		console.log("SEARCH IS DONE");
	}
}
var showAllDataAsListRev = function () {
	//CHECK IF WE ARE DONE:
	var done = true;
	
		console.log("showAllDataAsList");

	var crawledArticles = 0;
	for (var i = 0; i < GLOBAL_dataCollectorRev.length; i++) {
		var jsonData = JSON.parse(GLOBAL_dataCollectorRev[i].getJSONString());
		console.log("NUM ELEMENTS: " + Object.keys(jsonData).length + " < " +GLOBAL_numElementsRev);
		if (Object.keys(jsonData).length < GLOBAL_numElementsRev)
			done = false;
		else {
			crawledArticles += 1;
		}
	}

	if (GLOBAL_generatingDataCntRev == 0) {
		visController.updateHeaderInfoSection("Generating Data.");
		visController.updatePreparingMessage(crawledArticles + "/" + GLOBAL_maxNumSearchRev + " Generating Data.");
		GLOBAL_generatingDataCntRev += 1;
	} else if (GLOBAL_generatingDataCntRev == 1) {
		visController.updateHeaderInfoSection("Generating Data..");
		visController.updatePreparingMessage(crawledArticles + "/" + GLOBAL_maxNumSearchRev + " Generating Data..");
		GLOBAL_generatingDataCntRev += 1;
	} else if (GLOBAL_generatingDataCntRev == 2) {
		visController.updateHeaderInfoSection("Generating Data...");
		visController.updatePreparingMessage(crawledArticles + "/" + GLOBAL_maxNumSearchRev + " Generating Data...");
		GLOBAL_generatingDataCntRev = 0;
	}

	//----------------------------------------------------------------------
	if (done) {
		clearInterval(GLOBAL_intervalRev);

		visController.updateHeaderInfoSection("Generation done!");
		var articles = {
			data : []
		};
		/*var array = [];
		for (var i = 0; i < GLOBAL_dataCollectorRev.length; i++) {
		array.push(GLOBAL_dataCollectorRev[i].getJSONString());
		}
		console.log("OUTPUT: " + JSON.stringify(array));*/

		for (var i = 0; i < GLOBAL_dataCollectorRev.length; i++) {
			var jsonData = JSON.parse(GLOBAL_dataCollectorRev[i].getJSONString());
			//Calculation of the QMs.

			var authority = 0.2 * jsonData.numUniqueEditors + 0.2 * jsonData.numEdits + 0.1 * /*Connectivity*/
				1 + 0.3 * /*Num. of Reverts*/
				1 + 0.2 * jsonData.externalLinks + 0.1 * jsonData.numRegisteredUserEdits + 0.2 * jsonData.numAnonymousUserEdits;
			jsonData.Authority = authority;
			var completeness = 0.4 * /*Num. Internal Broken Links*/
				1 + 0.4 * jsonData.internalLinks + 0.2 * jsonData.articleLength;
			jsonData.Completeness = completeness;
			var complexity = 0.5 * jsonData.flesch - 0.5 * jsonData.kincaid;
			jsonData.Complexity = complexity;
			var informativeness = 0.6 * /*InfoNoise*/
				 - 0.6 * jsonData.diversity + 0.3 * jsonData.numImages;
			jsonData.Informativeness = informativeness;
			var consistency = 0.6 * jsonData.adminEditShare + 0.5 * jsonData.articleAge;
			jsonData.Consistency = consistency;
			var currency = jsonData.currency;
			jsonData.Currency = currency;
			var volatility = /*Median Revert Time*/
				1;
			jsonData.Volatility = volatility;

			var temp = {};
			for (var key in jsonData) {
				temp[key] = jsonData[key];
			}
			articles.data.push(
				temp);
			//console.log(JSON.stringify(temp));
		}
		visController.init(articles);
		visController.hidePreparingMessage();
	}
}

var showAllDataAsTable = function () {
	//console.log("LENGTH: " + GLOBAL_dataCollectorRev.length);
	var done = true;

	for (var i = 0; i < GLOBAL_dataCollectorRev.length; i++) {
		var jsonData = JSON.parse(GLOBAL_dataCollectorRev[i].getJSONString());
		if (Object.keys(jsonData).length < GLOBAL_numElementsRev)
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

		for (var i = 0; i < GLOBAL_dataCollectorRev.length; i++) {
			//console.log(GLOBAL_dataCollectorRev[i].getJSONString());
			var jsonData = JSON.parse(GLOBAL_dataCollectorRev[i].getJSONString());
			content += "<tr><td>" + jsonData.title + "</td><td>" + jsonData.numEdits + "</td><td>" + jsonData.numRegisteredUserEdits + "</td><td>" + jsonData.numAnonymousUserEdits + "</td><td>" + jsonData.numAdminUserEdits + "</td> \
																																																																																																																				<td>" + jsonData.adminEditShare + "</td><td>" + jsonData.numUniqueEditors + "</td><td>" + jsonData.articleLength + "</td><td>" + jsonData.currency + "</td><td>" + jsonData.internalLinks + "</td> \
																																																																																																																				<td>" + jsonData.externalLinks + "</td><td>" + jsonData.linksHere + "</td><td>" + jsonData.numImages + "</td><td>" + jsonData.articleAge + "</td><td>" + jsonData.diversity + "</td> \
																																																																																																																				<td>" + jsonData.flesch + "</td><td>" + jsonData.kincaid + "</td></tr>";

		}
		content += "</table>";

		$('#output').append(content);
	}
}

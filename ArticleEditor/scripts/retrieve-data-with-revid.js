var DataRetrieverRevision = function (vals) {
	var GLOBAL_title = "";
	var GLOBAL_articleRenderer = vals.articleRenderer;
	/*if (vals.hasOwnProperty('title')) {
	GLOBAL_title = vals.title;
	}*/
	var GLOBAL_linkToAPI = "http://en.wikipedia.org/w/api.php?";
	var GLOBAL_cntEdits = 0;
	var GLOBAL_cntEditsHELP = 0;
	var GLOBAL_mapUsernames = {};
	var GLOBAL_adminEditCount = 0;
	var GLOBAL_anonymousEditCount = 0;
	var GLOBAL_registeredEditCount = 0;
	var VAL_ADMIN = 'ADMIN';
	var VAL_REG = 'REG';
	var VAL_ANONYMOUS = 'ANONYMOUS';
	var GLOBAL_uniqueEditors = 0;
	var GLOBAL_internalLinksCount = 0;
	var GLOBAL_externalLinksCount = 0;
	var GLOBAL_incomingLinksCount = 0;
	var GLOBAL_imageCount = 0;
	var GLOBAL_JSON = new Object();
	var GLOBAL_imageArray = [];
	var GLOBAL_referencesArray = [];
	var GLOBAL_rawText = "";
	var GLOBAL_rawTextWithData = "";
	var GLOBAL_sectionInfos;
	var GLOBAL_sectionContentData = [];
	var GLOBAL_intro = "";
	var GLOBAL_interval;
	var dataRetriever = {};
	var allDataRetrieved = 0;
	var allDataRetrievedCheck = 0;
	var allDataRetrievedFlag = false;
	var GLOBAL_rev = "";

	var resetData = function () {
		GLOBAL_title = "";
		GLOBAL_rev = "";
		GLOBAL_cntEdits = 0;
		GLOBAL_cntEditsHELP = 0;
		GLOBAL_mapUsernames = {};
		GLOBAL_adminEditCount = 0;
		GLOBAL_anonymousEditCount = 0;
		GLOBAL_registeredEditCount = 0;
		GLOBAL_uniqueEditors = 0;
		GLOBAL_internalLinksCount = 0;
		GLOBAL_externalLinksCount = 0;
		GLOBAL_incomingLinksCount = 0;
		GLOBAL_imageCount = 0;
	}

	dataRetriever.getTitle = function () {
		return GLOBAL_title;
	}

	dataRetriever.setTitle = function (title) {

		var help = title.split("&oldid=");
		GLOBAL_title = title;
		GLOBAL_rev = help[1];
	}

	dataRetriever.getJSONString = function () {
		return JSON.stringify(GLOBAL_JSON);
	}

	var GLOBAL_revisionIDs = [];
	var GLOBAL_maxRevision = 2000;
	var GLOBAL_articleName = "";
	dataRetriever.loadArticleRevIDs = function (articleName) {
		GLOBAL_revisionIDs = []
		GLOBAL_articleName = articleName;
		retrieveData(GLOBAL_linkToAPI + "action=query&format=json&prop=revisions&titles=" + articleName + "&rvlimit=max&rvprop=ids|user&continue", handleSearchRevision);

	}

	var handleSearchRevision = function (JSONResponse) {
		if (GLOBAL_revisionIDs.length >= GLOBAL_maxRevision) {

			GLOBAL_articleRenderer.setRevisions(GLOBAL_revisionIDs);
			return;
		}
		var articles = JSON.parse(JSON.stringify(JSONResponse));
	//	console.log("-------------> " + JSON.stringify(JSONResponse));
		var JSONArticleTitles2 = articles.query.pages[Object.keys(articles.query.pages)[0]].revisions;
		for (var i = 0; i < JSONArticleTitles2.length; i++) {
			if (GLOBAL_revisionIDs.length >= GLOBAL_maxRevision) {
				GLOBAL_articleRenderer.setRevisions(GLOBAL_revisionIDs);
				return;
			}
			GLOBAL_revisionIDs.push(JSONArticleTitles2[i].revid);
			
		//	GLOBAL_articleRenderer.addOneRevision(JSONArticleTitles2[i].revid);
		}

		if (articles.hasOwnProperty("continue")) {
			if (articles.continue.hasOwnProperty("rvcontinue")) {
				console.log("INTO CONTINUE");
				retrieveData(GLOBAL_linkToAPI + "action=query&format=json&prop=revisions&titles=" + GLOBAL_articleName + "&rvlimit=max&rvcontinue=" + articles.continue.rvcontinue + "&rvprop=ids|user&continue", handleSearchRevision);
			}
		}
		else{
			GLOBAL_articleRenderer.setRevisions(GLOBAL_revisionIDs);
		}
	}
	dataRetriever.getAllMeasures = function () {

		//GET ALL SECTIONS TITLES:
		retrieveData(GLOBAL_linkToAPI + "action=parse&format=json&prop=sections&page=" + GLOBAL_title, handleSectionTitles);

		//GET ALL IMAGES:
		retrieveData(GLOBAL_linkToAPI + "action=query&prop=images&format=json&imlimit=max&revids=" + GLOBAL_rev + "&continue", handleImages);

		//GET RAW TEXT:
		retrieveData(GLOBAL_linkToAPI + "action=query&format=json&prop=extracts&explaintext=&revids=" + GLOBAL_rev + "&continue", handleRawText);

		//GET ALL REFERENCES (EXTERNAL LINKS right now that's the only way I know :-( ):
		retrieveData(GLOBAL_linkToAPI + "action=query&prop=extlinks&format=json&ellimit=max&revids=" + GLOBAL_rev + "&continue", handleExternalLinks);

		//GET RAW TEXT WITH ALL DATA:
		//retrieveDataText("http://en.wikipedia.org/w/index.php?" + "action=raw&format=json&title=" + GLOBAL_rev , handleRawTextWithData);
		retrieveData(GLOBAL_linkToAPI + "action=query&format=json&prop=revisions&rvprop=content&revids=" + GLOBAL_rev + "&continue", handleRawTextWithData);

		//GET INTRO
		retrieveData(GLOBAL_linkToAPI + "action=parse&format=json&contentmodel=wikitext&section=0&page=" + GLOBAL_title + "&prop=wikitext|langlinks|categories|links|templates|images|externallinks|sections|revid|displaytitle|iwlinks|properties", handleIntro);

		GLOBAL_interval = setInterval(checkIfAllDataRetrieved, 500);
	}
	var GLOBAL_retrieveCnt = 0;
	function checkIfAllDataRetrieved() {

		console.log(allDataRetrieved + " == " + allDataRetrievedCheck);
		if (allDataRetrieved == allDataRetrievedCheck && allDataRetrieved != 0 && allDataRetrievedCheck != 0) {
			clearInterval(GLOBAL_interval);
			allDataRetrievedFlag = true;
			GLOBAL_articleRenderer.fillDataNew();
			GLOBAL_articleRenderer.retrievingDataDone(".");
			return;
		}

		if (GLOBAL_retrieveCnt == 6) {
			GLOBAL_articleRenderer.retrievingDataAnimation(GLOBAL_retrieveCnt + 1);
			GLOBAL_retrieveCnt++;
			GLOBAL_retrieveCnt = 0;
			return;
		} else {
			GLOBAL_articleRenderer.retrievingDataAnimation(GLOBAL_retrieveCnt + 1);
			GLOBAL_retrieveCnt++;
			return;
		}
		/*if (GLOBAL_retrieveCnt == 0) {
		GLOBAL_articleRenderer.retrievingDataAnimation("1");
		GLOBAL_retrieveCnt++;
		return;
		}
		if (GLOBAL_retrieveCnt == 1) {
		GLOBAL_articleRenderer.retrievingDataAnimation("2");
		GLOBAL_retrieveCnt++;
		return;
		}
		if (GLOBAL_retrieveCnt == 2) {
		GLOBAL_articleRenderer.retrievingDataAnimation("3");
		GLOBAL_retrieveCnt = 0;
		return;
		}*/
	}

	dataRetriever.getIntro = function () {
		return GLOBAL_intro;
	}
	dataRetriever.getAllSectionContentData = function () {
		return GLOBAL_sectionContentData;
	}
	dataRetriever.getSectionContentData = function (sectionName) {
		for (var i = 0; i < GLOBAL_sectionContentData.length; i++) {
			//console.log("GLOBAL_sectionContentData[i].sections[0].index : " + GLOBAL_sectionContentData[i].sections[0].index);
			if (GLOBAL_sectionContentData[i] != undefined) {
				if (GLOBAL_sectionContentData[i].hasOwnProperty("sections")) {
					if (GLOBAL_sectionContentData[i].sections.length > 0) {
						if (GLOBAL_sectionContentData[i].sections[0].line == sectionName) {
							//console.log("SECTIONINDEX: " + sectionIndex + " DATA : " + JSON.stringify(GLOBAL_sectionContentData[i]));
							return GLOBAL_sectionContentData[i];
						}
					}
				}
			}
		}

		console.log("NOT FOUND SECTION INDEX: " + sectionName);
		return null;
	}

	dataRetriever.getImageArray = function () {
		return GLOBAL_imageArray;
	}

	dataRetriever.getRawText = function () {
		return GLOBAL_rawText;
	}

	dataRetriever.getRawTextWithData = function () {
		//return albertEinsteinRawData();

		return GLOBAL_rawTextWithData;
	}

	dataRetriever.getSectionInfos = function () {
		return GLOBAL_sectionInfos;
	}

	dataRetriever.reloadSection = function (sectionId, callbackFunction) {
		retrieveData(GLOBAL_linkToAPI + "action=query&format=json&prop=extracts&explaintext=&revids=" + GLOBAL_rev + "&continue", handleRawText);
		retrieveData(GLOBAL_linkToAPI + "action=parse&format=json&contentmodel=wikitext&generatexml&section=" + sectionId + "&page=" + GLOBAL_title + "&prop=wikitext|langlinks|categories|links|templates|images|externallinks|sections|revid|displaytitle|iwlinks|properties", callbackFunction);
	}

	dataRetriever.getAllReferences = function () {
		return GLOBAL_referencesArray;
	}

	var retrieveData = function (urlInclAllOptions, functionOnSuccess) {
		$.ajax({
			url : urlInclAllOptions,
			jsonp : "callback",
			dataType : "jsonp",
			cache : false,
			success : functionOnSuccess,
		});
	}

	var retrieveDataText = function (urlInclAllOptions, functionOnSuccess) {
		$.ajax({
			url : urlInclAllOptions,
			dataType : "jsonp",
			cache : false,
			success : functionOnSuccess,
		});
	}

	var handleIntro = function (JSONResponse) {
		GLOBAL_intro = JSON.parse(JSON.stringify(JSONResponse)).parse;
	}

	var handleSectionContentData = function (JSONResponse) {
		var object = JSON.parse(JSON.stringify(JSONResponse));
		GLOBAL_sectionContentData.push(object.parse);
		allDataRetrieved++;
	}

	var handleSectionTitles = function (JSONResponse) {
		var sectionTitles = JSON.parse(JSON.stringify(JSONResponse));
		GLOBAL_sectionInfos = sectionTitles.parse.sections;
		if (GLOBAL_sectionInfos.length > 0) {
			allDataRetrievedCheck = GLOBAL_sectionInfos.length;
			for (var i = 0; i < GLOBAL_sectionInfos.length; i++) {
				retrieveData(GLOBAL_linkToAPI + "action=parse&format=json&contentmodel=wikitext&generatexml&section=" + GLOBAL_sectionInfos[i].index + "&page=" + GLOBAL_title + "&prop=wikitext|langlinks|categories|links|templates|images|externallinks|sections|revid|displaytitle|iwlinks|properties", handleSectionContentData);

			}
		}
	}

	var handleRawTextWithData = function (JSONResponse) {
		var text = JSON.parse(JSON.stringify(JSONResponse));
		var extractPlainText = text.query.pages[Object.keys(text.query.pages)[0]].revisions[0]['*'];
		if (extractPlainText != undefined) {
			GLOBAL_rawTextWithData = extractPlainText;
		} else {
			GLOBAL_rawTextWithData = "";
		}
	}

	var handleRawText = function (JSONResponse) {
		var text = JSON.parse(JSON.stringify(JSONResponse));
		var extractPlainText = text.query.pages[Object.keys(text.query.pages)[0]].extract;
		//console.log(extractPlainText);
		if (extractPlainText != undefined) {
			GLOBAL_rawText = extractPlainText;
		} else {
			GLOBAL_rawText = "";
		}
	}

	var handleFlesch = function (JSONResponse) {
		var text = JSON.parse(JSON.stringify(JSONResponse));
		var extractPlainText = text.query.pages[Object.keys(text.query.pages)[0]].extract;
		//console.log(extractPlainText);
		if (extractPlainText != undefined) {
			var stat = new textstatistics(extractPlainText);

			var flesch = 0;
			var kincaid = 0;
			if (text != "" && text != undefined) {
				flesch = stat.fleschKincaidReadingEase();
				kincaid = stat.fleschKincaidGradeLevel();
			}
			//console.log(flesch);
			//console.log(kincaid);
			$("#Flesch").text(flesch);
			$("#Kincaid").text(kincaid);
			GLOBAL_JSON.flesch = flesch;
			GLOBAL_JSON.kincaid = kincaid;
		} else {
			$("#Flesch").text("0");
			$("#Kincaid").text("0");
			GLOBAL_JSON.flesch = 0;
			GLOBAL_JSON.kincaid = 0;
		}
	}

	var handleArticleAge = function (JSONResponse) {
		var firstRevision = JSON.parse(JSON.stringify(JSONResponse));
		if (firstRevision.query.pages[Object.keys(firstRevision.query.pages)[0]].hasOwnProperty("revisions")) {
			var firstRevisionTimeStamp = firstRevision.query.pages[Object.keys(firstRevision.query.pages)[0]].revisions[0].timestamp;
			var firstRevisionTimeStampCutted = firstRevisionTimeStamp.substring(0, 10);
			var mydate = new Date(firstRevisionTimeStampCutted);
			$("#ArticleAge").text(((new Date() - mydate) / (1000 * 60 * 60 * 24)));
			GLOBAL_JSON.articleAge = ((new Date() - mydate) / (1000 * 60 * 60 * 24));
		} else {
			$("#ArticleAge").text("0");
			GLOBAL_JSON.articleAge = 0;
		}
	}

	var handleImageInfos = function (JSONResponse) {
		var imageInfo = JSON.parse(JSON.stringify(JSONResponse));
		var url = imageInfo.query.pages[Object.keys(imageInfo.query.pages)[0]].imageinfo[0].thumburl;
		var imageTitle = imageInfo.query.pages[Object.keys(imageInfo.query.pages)[0]].title;
		var size = imageInfo.query.pages[Object.keys(imageInfo.query.pages)[0]].imageinfo[0].size;
		var user = imageInfo.query.pages[Object.keys(imageInfo.query.pages)[0]].imageinfo[0].user;
		var timestamp = imageInfo.query.pages[Object.keys(imageInfo.query.pages)[0]].imageinfo[0].timestamp;
		var comment = imageInfo.query.pages[Object.keys(imageInfo.query.pages)[0]].imageinfo[0].comment;
		var mediatype = imageInfo.query.pages[Object.keys(imageInfo.query.pages)[0]].imageinfo[0].mediatype;
		var object = {
			url : url,
			imageTitle : imageTitle,
			size : size,
			user : user,
			timestamp : timestamp,
			comment : comment,
			mediatype : mediatype
		};
		GLOBAL_imageArray.push(object);
		//console.log("TITLE: " + imageTitle + " to IMAGE URL: " + url);
	}

	var handleImages = function (JSONResponse) {
		var imageCount = JSON.parse(JSON.stringify(JSONResponse));
		var JSONimages = imageCount.query.pages[Object.keys(imageCount.query.pages)[0]].images;
		if (JSONimages != undefined) {
			GLOBAL_imageCount += JSONimages.length;
			$("#NumOfImages").text(GLOBAL_imageCount);
			GLOBAL_JSON.numImages = GLOBAL_imageCount;
			//GET IMAGE INFOS:
			for (var i = 0; i < JSONimages.length; i++) {
				//console.log("IMAGE TITLE: " + GLOBAL_linkToAPI + "action=query&prop=imageinfo&format=json&iilimit=1&titles=" + JSONimages[i].title + "&iiprop=url&iiurlwidth=50&continue");
				retrieveData(GLOBAL_linkToAPI + "action=query&prop=imageinfo&format=json&iilimit=1&titles=" + JSONimages[i].title + "&iiprop=url|size|user|timestamp|comment|mediatype&iiurlwidth=500&continue", handleImageInfos);
			}

			if (imageCount.hasOwnProperty("continue")) {
				if (imageCount.continue.hasOwnProperty("imcontinue")) {
					//GET REST OF THE DATA:
					retrieveData(GLOBAL_linkToAPI + "action=query&prop=images&format=json&imlimit=max&revids=" + GLOBAL_rev + "&imcontinue=" + imageCount.continue.imcontinue + "&continue", handleImages);
				} else {}
			} else {
				//DONE
				$("#NumOfImages").text(GLOBAL_imageCount);
				GLOBAL_JSON.numImages = GLOBAL_imageCount;
			}
		} else {
			$("#NumOfImages").text("0");
			GLOBAL_JSON.numImages = 0;
		}
	}

	var handleExternalLinks = function (JSONResponse) {
		var externalLinks = JSON.parse(JSON.stringify(JSONResponse));
		var JSONexternalLinks = externalLinks.query.pages[Object.keys(externalLinks.query.pages)[0]].extlinks;
		if (JSONexternalLinks != undefined) {
			GLOBAL_externalLinksCount += JSONexternalLinks.length;
			$("#ExternalLinks").text(GLOBAL_externalLinksCount);
			GLOBAL_JSON.externalLinks = GLOBAL_externalLinksCount;
			//STROE REFS INTO REFARRAY
			for (var i = 0; i < JSONexternalLinks.length; i++) {
				GLOBAL_referencesArray.push(JSONexternalLinks[i]['*']);
			}

			if (externalLinks.hasOwnProperty("continue")) {
				if (externalLinks.continue.hasOwnProperty("eloffset")) {
					//GET REST OF THE DATA:
					retrieveData(GLOBAL_linkToAPI + "action=query&prop=extlinks&format=json&ellimit=max&revids=" + GLOBAL_rev + "&eloffset=" + externalLinks.continue.eloffset + "&continue", handleExternalLinks);
				} else {}
			} else {
				//DONE
				$("#ExternalLinks").text(GLOBAL_externalLinksCount);
				GLOBAL_JSON.externalLinks = GLOBAL_externalLinksCount;
			}
		} else {
			$("#ExternalLinks").text("0");
			GLOBAL_JSON.externalLinks = 0;
		}
	}

	var handleIncomingLinks = function (JSONResponse) {
		var incomingLinks = JSON.parse(JSON.stringify(JSONResponse));
		var JSONincomingLinks = incomingLinks.query.pages[Object.keys(incomingLinks.query.pages)[0]].linkshere;

		if (JSONincomingLinks != undefined) {
			GLOBAL_incomingLinksCount += JSONincomingLinks.length;
			$("#NumOfPagesWhichLinksToThisPage").text(GLOBAL_incomingLinksCount);
			GLOBAL_JSON.linksHere = GLOBAL_incomingLinksCount;
			if (incomingLinks.hasOwnProperty("continue")) {
				if (incomingLinks.continue.hasOwnProperty("lhcontinue")) {
					//GET REST OF THE DATA:
					retrieveData(GLOBAL_linkToAPI + "action=query&prop=linkshere&format=json&lhlimit=max&revids=" + GLOBAL_rev + "&lhcontinue=" + incomingLinks.continue.lhcontinue + "&continue", handleIncomingLinks);
				} else {}
			} else {
				//DONE
				$("#NumOfPagesWhichLinksToThisPage").text(GLOBAL_incomingLinksCount);
				GLOBAL_JSON.linksHere = GLOBAL_incomingLinksCount;
			}
		} else {
			$("#NumOfPagesWhichLinksToThisPage").text("0");
			GLOBAL_JSON.linksHere = 0;
		}
	}

	var handleInternalLinks = function (JSONResponse) {
		var internalLinks = JSON.parse(JSON.stringify(JSONResponse));
		var JSONinternalLinks = internalLinks.query.pages[Object.keys(internalLinks.query.pages)[0]].iwlinks;
		if (JSONinternalLinks != undefined) {
			GLOBAL_internalLinksCount += JSONinternalLinks.length;
			$("#InternalLinks").text(GLOBAL_internalLinksCount);
			GLOBAL_JSON.internalLinks = GLOBAL_internalLinksCount;
			if (internalLinks.hasOwnProperty("continue")) {
				if (internalLinks.continue.hasOwnProperty("iwcontinue")) {
					//GET REST OF THE DATA:
					//console.log("IW CONTINUE: " + internalLinks.continue.iwcontinue);
					retrieveData(GLOBAL_linkToAPI + "action=query&prop=iwlinks&format=json&iwlimit=max&revids=" + GLOBAL_rev + "&iwcontinue=" + internalLinks.continue.iwcontinue + "&continue", handleInternalLinks);
				} else {}
			} else {
				//DONE
				$("#InternalLinks").text(GLOBAL_internalLinksCount);
				GLOBAL_JSON.internalLinks = GLOBAL_internalLinksCount;
			}
		} else {
			$("#InternalLinks").text("0");
			GLOBAL_JSON.internalLinks = 0;
		}
	}

	var handleCurrency = function (JSONResponse) {
		var lastUpdateData = JSON.parse(JSON.stringify(JSONResponse));
		if (lastUpdateData.query.pages[Object.keys(lastUpdateData.query.pages)[0]].hasOwnProperty("revisions")) {
			var lastUpdateTimeStamp = lastUpdateData.query.pages[Object.keys(lastUpdateData.query.pages)[0]].revisions[0].timestamp;

			var lastUpdateTimeStampCutted = lastUpdateTimeStamp.substring(0, 10);
			var mydate = new Date(lastUpdateTimeStampCutted);
			$("#Currency").text(((new Date() - mydate) / (1000 * 60 * 60 * 24)));
			GLOBAL_JSON.currency = ((new Date() - mydate) / (1000 * 60 * 60 * 24));
			var rightNow = new Date();

			$("#CurrentTimestamp").text(
				rightNow.toISOString().substring(0, 10));
		} else {
			GLOBAL_JSON.currency = 0;
			$("#CurrentTimestamp").text("0");
		}
	}

	var handleArticleLength = function (JSONResponse) {
		//console.log(JSON.stringify(JSONResponse));
		var articleData = JSON.parse(JSON.stringify(JSONResponse));
		var articleLength = articleData.query.pages[Object.keys(articleData.query.pages)[0]].length;
		if (articleLength != undefined) {
			$("#ArticleLength").text(articleLength);
			GLOBAL_JSON.articleLength = articleLength;
		} else {
			$("#ArticleLength").text("0");
			GLOBAL_JSON.articleLength = 0;
		}
	}

	var handleUserData = function (JSONResponse) {
		var userData = JSON.parse(JSON.stringify(JSONResponse));
		//console.log(JSON.stringify(userData.query.users[0]));
		if (userData.query.users[0].hasOwnProperty("groups")) {
			//console.log("REGISTERED USER " + userData.query.users[0].name);
			var groups = userData.query.users[0].groups;
			var admin = false;
			for (var i = 0; i < groups.length; i++) {
				if (groups[i] == "sysop") {
					//ADMIN
					admin = true;
					GLOBAL_cntEditsHELP += 1;
					if (GLOBAL_mapUsernames.hasOwnProperty(userData.query.users[0].name)) {
						GLOBAL_mapUsernames[userData.query.users[0].name][1] += 1;
						GLOBAL_mapUsernames[userData.query.users[0].name][0] = VAL_ADMIN;
					} else {

						GLOBAL_mapUsernames[userData.query.users[0].name] = [VAL_ADMIN, 1]
					}
				}
			}
			if (!admin) {
				GLOBAL_cntEditsHELP += 1;
				//We know it's a registered user
				if (GLOBAL_mapUsernames.hasOwnProperty(userData.query.users[0].name)) {

					GLOBAL_mapUsernames[userData.query.users[0].name][1] += 1;
					GLOBAL_mapUsernames[userData.query.users[0].name][0] = VAL_REG;
				} else {
					GLOBAL_mapUsernames[userData.query.users[0].name] = [VAL_REG, 1]
				}
			}
			//Add user to map
			//GLOBAL_mapUsernames[userData.query.users[0].name] = 1;
		} else {
			//Anonymous user!
			GLOBAL_cntEditsHELP += 1;
			if (GLOBAL_mapUsernames.hasOwnProperty(userData.query.users[0].name)) {

				//console.log("ANONYMOUS USER1: " + userData.query.users[0].name);
				GLOBAL_mapUsernames[userData.query.users[0].name][1] += 1;
				GLOBAL_mapUsernames[userData.query.users[0].name][0] = VAL_ANONYMOUS;
			} else {
				//console.log("ANONYMOUS USER: " + userData.query.users[0].name);
				GLOBAL_mapUsernames[userData.query.users[0].name] = [VAL_ANONYMOUS, 1]
			}
		}
		//TODO: GO ON HERE
	}

	var handleEditData = function (JSONResponse) {
		var revisions = JSON.parse(JSON.stringify(JSONResponse));
		var JSONrevisions = revisions.query.pages[Object.keys(revisions.query.pages)[0]].revisions;
		//TODO PERFORM A CHECK
		if (JSONrevisions != undefined) {
			GLOBAL_cntEdits += JSONrevisions.length;
			$("#totalNumEdits").text(GLOBAL_cntEdits);
			$("#NumOfAnonymousUserEdits").text(GLOBAL_anonymousEditCount);
			GLOBAL_JSON.numEdits = GLOBAL_cntEdits;
			GLOBAL_JSON.numAnonymousUserEdits = GLOBAL_anonymousEditCount;

			for (var i = 0; i < JSONrevisions.length; i++) {
				//get username:
				var username = JSON.stringify(JSONrevisions[0].user);
				username = username.substring(1, username.length - 1);
				if (GLOBAL_mapUsernames.hasOwnProperty(username)) {
					GLOBAL_mapUsernames[username][1] += 1;
					GLOBAL_cntEditsHELP += 1;
				} else {
					//console.log("user " + username + "is not in list");
					//Get all userdata (admin, registered or anonymous)
					GLOBAL_mapUsernames[username] = ['', 0]; // Asynchronous that's why I do it!
					retrieveData(GLOBAL_linkToAPI + "action=query&format=json&list=users&ususers=" + username + "&usprop=groups&continue", handleUserData);
					GLOBAL_uniqueEditors += 1;
				}
			}
			if (revisions.hasOwnProperty("continue")) {
				if (revisions.continue.hasOwnProperty("rvcontinue")) {
					//GET REST OF THE DATA:
					retrieveData(GLOBAL_linkToAPI + "action=query&format=json&prop=revisions&revids=" + GLOBAL_rev + "&rvcontinue=" + revisions.continue.rvcontinue + "&rvlimit=max&rvprop=user&continue", handleEditData);
				}
			} else {
				console.log("WE ARE AT THE END2");

				$("#totalNumEdits").text(GLOBAL_cntEdits);

				GLOBAL_JSON.numEdits = GLOBAL_cntEdits;
				for (var key in GLOBAL_mapUsernames) {
					if (GLOBAL_mapUsernames[key][0] == VAL_ANONYMOUS) {
						GLOBAL_anonymousEditCount += GLOBAL_mapUsernames[key][1];
						GLOBAL_uniqueEditors -= 1;
					} else if (GLOBAL_mapUsernames[key][0] == VAL_REG) {
						GLOBAL_registeredEditCount += GLOBAL_mapUsernames[key][1];
					} else if (GLOBAL_mapUsernames[key][0] == VAL_ADMIN) {
						GLOBAL_adminEditCount += GLOBAL_mapUsernames[key][1];
					} else {
						//WTF :-0 TODO
						if (checkIsIPV4(key)) {
							GLOBAL_anonymousEditCount += GLOBAL_mapUsernames[key][1];
						} else {
							GLOBAL_registeredEditCount += GLOBAL_mapUsernames[key][1]; //TODO: COULD ALSO BE AN ADMIN SO I SHOULD CHECK THIS AGAIN!!
						}
					}
				}

				$("#NumOfAnonymousUserEdits").text(GLOBAL_anonymousEditCount);
				$("#NumOfRegisteredUserEdits").text(GLOBAL_registeredEditCount);
				$("#NumOfAdminEdits").text(GLOBAL_adminEditCount);
				$("#AdminEditShare").text(GLOBAL_adminEditCount / GLOBAL_cntEdits);
				$("#NumOfUniqueEditors").text(GLOBAL_uniqueEditors);
				$("#Diversity").text(GLOBAL_uniqueEditors / GLOBAL_cntEdits);

				GLOBAL_JSON.numAnonymousUserEdits = GLOBAL_anonymousEditCount;
				GLOBAL_JSON.numRegisteredUserEdits = GLOBAL_registeredEditCount;
				GLOBAL_JSON.numAdminUserEdits = GLOBAL_adminEditCount;
				GLOBAL_JSON.adminEditShare = GLOBAL_adminEditCount / GLOBAL_cntEdits;
				GLOBAL_JSON.numUniqueEditors = GLOBAL_uniqueEditors;
				GLOBAL_JSON.diversity = GLOBAL_uniqueEditors / GLOBAL_cntEdits;
			}

		} else {

			$("#NumOfAnonymousUserEdits").text("0");
			$("#NumOfRegisteredUserEdits").text("0");
			$("#NumOfAdminEdits").text("0");
			$("#AdminEditShare").text("0");
			$("#NumOfUniqueEditors").text("0");
			$("#Diversity").text("0");

			GLOBAL_JSON.numAnonymousUserEdits = 0;
			GLOBAL_JSON.numRegisteredUserEdits = 0;
			GLOBAL_JSON.numAdminUserEdits = 0;
			GLOBAL_JSON.adminEditShare = 0;
			GLOBAL_JSON.numUniqueEditors = 0;
			GLOBAL_JSON.diversity = 0;
			GLOBAL_JSON.numEdits = 0;
		}
	}

	var checkIsIPV4 = function (entry) {
		var blocks = entry.split(".");
		if (blocks.length === 4) {
			return blocks.every(function (block) {
				return parseInt(block, 10) >= 0 && parseInt(block, 10) <= 255;
			});
		}
		return false;
	}

	var retrieveData = function (urlInclAllOptions, CBFsuccessFunction /*callback Function!!!!*/
	) {
		$.ajax({
			url : urlInclAllOptions,
			jsonp : "callback",
			dataType : "jsonp",
			success : CBFsuccessFunction
		});

	};

	var getNumOfAnonymousUserEdits = function (response) {
		// Using mw.Api, specify it when creating the mw.Api object
		$("#output").text("SUCCESS: " + JSON.stringify(response));

	}

	return dataRetriever;
};

//test:
/*console.log("STARTING FIRST");
var dr = new DataRetriever({
title : 'Visualization'
});
dr.getAllMeasures();
console.log("STARTING SECOND");*/
/*
var dr2 = new DataRetriever({title: 'New York'});
dr2.getAllMeasures();
 */
var test = function () {
	//console.log(dr.getJSONString());
	//console.log(dr2.getJSONString());
}
//-----------------------------------------------------------------------------

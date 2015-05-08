var DataManipulator = function (vals) {
	var GLOBAL_network = vals.network;
	var GLOBAL_data = vals.data;
	var GLOBAL_articleName = vals.articleName;
	var GLOBAL_controller = vals.controller;
	var GLOBAL_interval;

	var dataManipulator = {};
	//TODO PUT IT INTO UTILITY
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
	dataManipulator.showQualityTableOfSection = function (sectionName, dataRetriever, qualityManager) {
		console.log("SHOWQUALITYTABLEOFSECTION: " + sectionName);
		var htmlForTable = "";

		var textOfSection = "";
		var sectionData = null;
		if (sectionName == "Introduction") {
			sectionData = dataRetriever.getIntro();
		} else {
			sectionData = dataRetriever.getSectionContentData(sectionName);
		}
		if (sectionData.sections.length > 1) {
			textOfSection = sectionData.wikitext['*'];
			textOfSection = trimToOneParagraph(textOfSection, sectionData.sections[0].line);
		} else {
			textOfSection = sectionData.wikitext['*'];
		}
		var quality = qualityManager.calculateQuality(textOfSection, sectionData, textOfSection.length > 50 ? textOfSection.substring(0, 50) + "..." : textOfSection.substring(0, 10) + "...");
		var allKeys = Object.keys(quality);
		var htmlForTable = "<table border='1'>";
		for (var i = 0; i < allKeys.length; i++) {
			var bgColor = quality[allKeys[i]] < 0.5 ? "red" : "white";
			var status = quality[allKeys[i]] < 0.5 ? "improve" : "OK";
			htmlForTable += ("<tr bgcolor=\"" + bgColor + "\"><td>" + allKeys[i] + "</td><td>" + quality[allKeys[i]] + "</td><td>" + status + "</td></tr>");
		}
		htmlForTable += "</table>";
		$("#articleViewerQualityTableDiv").html(htmlForTable);
	}

	function getTextOfSection(sectionTitle, dataRetriever) {
		var stringToSearch = "== \xA7" + sectionTitle + " ==";
		var articleText = dataRetriever.getRawText();
		var index = articleText.indexOf(stringToSearch);
		if (index == -1) {
			stringToSearch = "== " + sectionTitle + " ==";
			index = articleText.indexOf(stringToSearch);
			if (index == -1) {
				stringToSearch = sectionTitle;
				index = articleText.indexOf(stringToSearch);
			}
		}
		var str = articleText.substring((index + stringToSearch.length), articleText.length);
		str = deleteEqualsSigns(str, 0);
		index = str.indexOf("==");
		var ret = "";
		if (index > -1)
			ret = str.substr(0, index);
		else
			ret = str;
		ret.replace("=", " ");
		return ret;
	}
	function getIntroOfArticle(dataRetriever) {
		var articleText = dataRetriever.getRawText();
		index = articleText.indexOf("==");
		var ret = "";
		if (index > -1)
			ret = articleText.substr(0, index);
		else
			ret = "";
		return ret;
	}
	dataManipulator.showTheWholeArticleInMainView = function (dataRetriever, qualityManager) {
		//I NEED THE DATA RETRIEVER

		var sectionContentDataArray = dataRetriever.getAllSectionContentData();
		var intro = dataRetriever.getIntro();
		var textOfSection = "";

		if (intro.sections.length > 1) {
			textOfSection = intro.wikitext['*'];
			textOfSection = trimToOneParagraph(textOfSection, intro.sections[0].line);
		} else {
			textOfSection = intro.wikitext['*'];
		}
		var quality = qualityManager.calculateQuality(getIntroOfArticle(dataRetriever), intro, textOfSection.length > 50 ? textOfSection.substring(0, 50) + "..." : textOfSection.substring(0, 10) + "...");
		var backgroundColor = "";
		if (quality.score == 0) {
			backgroundColor = "#FF0000";
		} else if (quality.score > 0 && quality.score <= 0.4) {
			backgroundColor = "#FF4500";
		} else if (quality.score > 0.4 && quality.score <= 0.6) {
			backgroundColor = "#FFA500";
		} else if (quality.score > 0.6 && quality.score <= 0.9) {
			backgroundColor = "#00FF00";
		} else if (quality.score > 0.9) {
			backgroundColor = "#00EE00";
		}
		var htmlForDialog = ("<div id=\"Introduction\" contenteditable=\"true\" style=\"background-color: " + backgroundColor + "; border: 2px solid black\" onclick=\"articleController.highlightSectionInTree('" + "Introduction" + "')\">" + textOfSection + "</div>");

		for (var i = 0; i < sectionContentDataArray.length; i++) {
			var sectionData = sectionContentDataArray[i];
			var textOfSection = "";

			if (sectionData.sections.length > 1) {
				textOfSection = sectionData.wikitext['*'];
				textOfSection = trimToOneParagraph(textOfSection, sectionData.sections[0].line);
			} else {
				textOfSection = sectionData.wikitext['*'];
			}
			var quality = qualityManager.calculateQuality(getTextOfSection(sectionData.sections[0].line,dataRetriever), sectionData, textOfSection.length > 50 ? textOfSection.substring(0, 50) + "..." : textOfSection.substring(0, 10) + "...");
			var backgroundColor = "";
			if (quality.score == 0) {
				backgroundColor = "#FF0000";
			} else if (quality.score > 0 && quality.score <= 0.4) {
				backgroundColor = "#FF4500";
			} else if (quality.score > 0.4 && quality.score <= 0.6) {
				backgroundColor = "#FFA500";
			} else if (quality.score > 0.6 && quality.score <= 0.9) {
				backgroundColor = "#00FF00";
			} else if (quality.score > 0.9) {
				backgroundColor = "#00EE00";
			}
			//var help = sectionData.sections[0].line;
			//help = help.replace(/"/g, "\"");
			console.log("HERE: " + sectionData.sections[0].line);
			var desired = sectionData.sections[0].line.replace(/[^\w\s]/gi, '');
			var idStr = desired.replace(/ /g, "_");
			htmlForDialog += ("<div id=\"" + idStr + "\"contenteditable=\"true\" style=\"background-color: " + backgroundColor + "; border: 2px solid black\" onclick=\"articleController.highlightSectionInTree('" + sectionData.sections[0].line + "')\">" + textOfSection + "</div>");
		}
		//console.log("HTML : " + htmlForDialog);
		$("#wikiTextInner").children().remove();
		$("#wikiTextInner").append(htmlForDialog);
	}
	dataManipulator.showTheWholeArticle = function (dataRetriever, qualityManager) {
		//I NEED THE DATA RETRIEVER

		var sectionContentDataArray = dataRetriever.getAllSectionContentData();
		var intro = dataRetriever.getIntro();
		var textOfSection = "";

		if (intro.sections.length > 1) {
			textOfSection = intro.wikitext['*'];
			textOfSection = trimToOneParagraph(textOfSection, intro.sections[0].line);
		} else {
			textOfSection = intro.wikitext['*'];
		}
		var quality = qualityManager.calculateQuality(textOfSection, intro, textOfSection.length > 50 ? textOfSection.substring(0, 50) + "..." : textOfSection.substring(0, 10) + "...");
		var backgroundColor = "";
		if (quality.score == 0) {
			backgroundColor = "#FF0000";
		} else if (quality.score > 0 && quality.score <= 0.4) {
			backgroundColor = "#FF4500";
		} else if (quality.score > 0.4 && quality.score <= 0.6) {
			backgroundColor = "#FFA500";
		} else if (quality.score > 0.6 && quality.score <= 0.9) {
			backgroundColor = "#00FF00";
		} else if (quality.score > 0.9) {
			backgroundColor = "#00EE00";
		}
		var htmlForDialog = ("<div contenteditable=\"true\" style=\"background-color: " + backgroundColor + "; border: 2px solid black\" onclick=\"articleController.showQualityTable('" + "Introduction" + "')\">" + textOfSection + "</div>");

		for (var i = 0; i < sectionContentDataArray.length; i++) {
			var sectionData = sectionContentDataArray[i];
			var textOfSection = "";

			if (sectionData.sections.length > 1) {
				textOfSection = sectionData.wikitext['*'];
				textOfSection = trimToOneParagraph(textOfSection, sectionData.sections[0].line);
			} else {
				textOfSection = sectionData.wikitext['*'];
			}
			var quality = qualityManager.calculateQuality(textOfSection, sectionData, textOfSection.length > 50 ? textOfSection.substring(0, 50) + "..." : textOfSection.substring(0, 10) + "...");
			var backgroundColor = "";
			if (quality.score == 0) {
				backgroundColor = "#FF0000";
			} else if (quality.score > 0 && quality.score <= 0.4) {
				backgroundColor = "#FF4500";
			} else if (quality.score > 0.4 && quality.score <= 0.6) {
				backgroundColor = "#FFA500";
			} else if (quality.score > 0.6 && quality.score <= 0.9) {
				backgroundColor = "#00FF00";
			} else if (quality.score > 0.9) {
				backgroundColor = "#00EE00";
			}
			htmlForDialog += ("<div contenteditable=\"true\" style=\"background-color: " + backgroundColor + "; border: 2px solid black\" onclick=\"articleController.showQualityTable('" + sectionData.sections[0].line + "')\">" + textOfSection + "</div>");
		}
		//console.log("HTML : " + htmlForDialog);
		$("#articleViewerDiv").html(htmlForDialog);
		$("#articleViewer").dialog({
			buttons : [{
					text : "Save",
					click : function () {

						$(this).dialog("close");
					}
				}, {
					text : "Cancel",
					click : function () {
						$(this).dialog("close");
					}
				}
			]
		});

		$("#articleViewer").dialog('option', 'title', GLOBAL_articleName);
		$("#articleViewer").dialog("open");
		event.preventDefault();
	}

	dataManipulator.connectNodes = function (data, callback) {
		console.log(JSON.stringify(data));
		if (data.from == data.to) {
			alert("NOT POSSIBLE");
		} else {
			var itemFrom = GLOBAL_data.nodes.get(data.from);
			var itemTo = GLOBAL_data.nodes.get(data.to);
			if (itemFrom.type == "img" && itemTo.type == "text") {
				itemTo.imagesToThisNode.push(itemFrom.imageInfos.imageTitle); //ALSO A reference to itemFrom.sectionInfo.images
				//callback(data);
				GLOBAL_data.edges.add({
					from : itemFrom.id,
					to : itemTo.id,
					style : "arrow"
				});
				GLOBAL_controller.showQuality();
			} else if (itemFrom.type == "ref" && itemTo.type == "text") {
				itemTo.refsToThisNode.push(itemFrom.title); //ALSO A reference to itemFrom.sectionInfo.images
				callback(data);
				GLOBAL_controller.showQuality();
			} else
				alert("NOT POSSIBLE");
		}
	}
	var GLOBAL_intervalCounter = 0;
	dataManipulator.editAnimation = function (startOrStop) {
		console.log("EDITANIMATION");
		if (startOrStop) {
			/*if (GLOBAL_intervalCounter == 6) {
			$("#editAnimationContainer").html(GLOBAL_intervalCounter + 1);
			GLOBAL_intervalCounter++;
			GLOBAL_intervalCounter = 0;
			return;
			} else {
			$("#editAnimationContainer").html(GLOBAL_intervalCounter + 1);
			GLOBAL_intervalCounter++;
			return;
			}*/
		} else {
			//	clearInterval(GLOBAL_interval);
			$("#dialogEditInProgres").dialog("close");
		}
	}

	dataManipulator.closeEditDialog = function () {
		$("#dialogEditInProgres").dialog("close");
	}
	dataManipulator.addNode = function (data) {
		//console.log("ADD NODE: " + JSON.stringify(data));
		if (currentSelectedSectionId != -1) {
			var item = GLOBAL_data.nodes.get(currentSelectedSectionId);
			console.log("ID: " + currentSelectedSectionId + " REST: " + JSON.stringify(item));
			$("#createNewNodeMasterName").html("You are adding to " + item.title);
		} else {
			$("#createNewNodeMasterName").html("You are creating a new top section");
		}
		$("#dialogCreateNewNode").dialog({
			buttons : [{
					text : "Save",
					click : function () {
						console.log($("#uploadSelect").val());
						if ($("#uploadSelect").val() == "Section") {
							var editToken = GLOBAL_controller.getEditToken();
							var textarea = $("#createSectionTextArea");
							var text = textarea.val();
							var url = "http://en.wikipedia.org/w/api.php?action=edit&format=xml";
							var params = "";
							if (currentSelectedSectionIndex != -1) {
								//Just perform a normal update
								text = addRestOfTheSectionForCreate(item.title, currentSelectedSectionId, text);
								text = text.replaceHtmlEntites();
								text = text.replace(/&/g, "and");
								console.log("---------------------THE TEXT: \n" + text);
								console.log("-----------------------------------------------")
								params = "action=edit&title=" + GLOBAL_articleName + "&section=" + currentSelectedSectionIndex + "&token=" + editToken + "&text=" + text + "&contentformat=text/x-wiki&contentmodel=wikitext";
							} else {
								text = text.replaceHtmlEntites();
								text = text.replace(/&/g, "and");
								params = "action=edit&title=" + GLOBAL_articleName + "&section=new&token=" + editToken + "&text=" + text + "&contentformat=text/x-wiki&contentmodel=wikitext";
							}
							console.log("PARAMS: " + params);
							//UPDATING TEXT TO WIKIPEDIA!
							articleController.newSection(url, params);

							$(this).dialog("close");
							$("#dialogEditInProgres").dialog("open");
							GLOBAL_interval = setInterval(dataManipulator.editAnimation(true), 500);
						} else if ($("#uploadSelect").val() == 'Image') {
							var editToken = GLOBAL_controller.getEditToken();
							var image = $("#imageToUpload");
							console.log("IMAGE: " + currentImageSrc);
							var url = "http://en.wikipedia.org/w/api.php?action=upload&format=xml";
							var params = "api.php?action=upload&filename=Test.jpg&file=" + currentImageSrc + "&token=" + editToken;

							articleController.newImage(url, params);
						}
					}
				}, {
					text : "Cancel",
					click : function () {
						$(this).dialog("close");
					}
				}
			]
		});

		$("#dialogCreateNewNode").dialog("open");
	}

	function generateRawText(text) {
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
		return rawText;
	}

	String.prototype.replaceHtmlEntites = function () {
		var s = this;
		var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
		var translate = {
			"nbsp" : " ",
			"amp" : "&",
			"quot" : "\"",
			"lt" : "<",
			"gt" : ">"
		};
		return (s.replace(translate_re, function (match, entity) {
				return translate[entity];
			}));
	};
	var addRestOfTheSectionForCreate = function (sectionName, id, text) {
		var dataRetriever = GLOBAL_controller.getDataRetrieverById(id);
		var sectionData = dataRetriever.getSectionContentData(sectionName);
		alert(sectionData.sections.length);
		var help = "";
		if (sectionData.sections.length > 1) {
			//NOW WE KNOW THAT WE HAVE TO ADD THE REST OF THE SECTION TO THE TEXT IN ORDER TO UPDATE THE WHOLE SECTION
			//OTHERWISE WE WOULD LOOSE ALL SUBSECTIONS
			alert("ADDING REST LENGTH: " + sectionData.sections.length);
			var textHelp = "";
			//for (var i = 0; i < sectionData.sections.length; i++) {
			textHelp += ("\n" + dataRetriever.getSectionContentData(sectionData.sections[0].line).wikitext['*']); //THE WHOLE TEXT IS IN THIS SECTION
			//}

			return (textHelp + "\n" + text);
		}
		return text;
	}

	var addRestOfTheSectionForUpdate = function (sectionName, id, text) {
		var dataRetriever = GLOBAL_controller.getDataRetrieverById(id);
		var sectionData = null;
		console.log("sectionName: " + sectionName);
		if (sectionName == "Introduction") {
			//; do nothing
		} else {
			sectionData = dataRetriever.getSectionContentData(sectionName);
			alert(sectionData.sections.length);
			if (sectionData.sections.length > 1) {
				//NOW WE KNOW THAT WE HAVE TO ADD THE REST OF THE SECTION TO THE TEXT IN ORDER TO UPDATE THE WHOLE SECTION
				//OTHERWISE WE WOULD LOOSE ALL SUBSECTIONS
				alert("ADDING REST");
				for (var i = 1; i < sectionData.sections.length; i++) {
					text += ("\n" + dataRetriever.getSectionContentData(sectionData.sections[i].line).wikitext['*']);
				}
			}
		}

		return text;
	}

	dataManipulator.editNodes = function (data, callback) {
		var item = GLOBAL_data.nodes.get(data.id);
		if (item.type == "text") {
			var textarea = $("#node-label");
			//textarea.html(data.label);
			textarea.val(item.originalText);
			//TODO: Create a second collection which always contains, the whole in order to be able to always get the item with the given masterId
			//E.g. When we just show some items (double click on an images then the GLOBAL_data.nodes container does not include the item with the given masterId)
			var sectionItem = GLOBAL_controller.getItem(item.masterId);
			$("#dialog").dialog({
				buttons : [{
						text : "Save",
						click : function () {
							console.log("click: " + item.id);
							var editToken = GLOBAL_controller.getEditToken();
							console.log("EDITTOKEN: " + editToken);
							var textarea = $("#node-label");
							var text = textarea.val();
							//Get the rest of the section if necessary
							text = addRestOfTheSectionForUpdate(item.title, item.id, text);
							/*var dataRetriever = GLOBAL_controller.getDataRetrieverById(item.id);
							var sectionData = dataRetriever.getSectionContentData(sectionItem.label);
							alert(sectionData.sections.length);
							if (sectionData.sections.length > 1) {
							//NOW WE KNOW THAT WE HAVE TO ADD THE REST OF THE SECTION TO THE TEXT IN ORDER TO UPDATE THE WHOLE SECTION
							//OTHERWISE WE WOULD LOOSE ALL SUBSECTIONS
							alert("ADDING REST");
							for (var i = 1; i < sectionData.sections.length; i++) {
							text += ("\n" + dataRetriever.getSectionContentData(sectionData.sections[i].line).wikitext['*']);
							}
							}*/

							var url = "http://en.wikipedia.org/w/api.php?action=edit&format=xml";
							//text = _.unescape(text); // DOES IT WORK????? answer: no
							text = text.replaceHtmlEntites();
							console.log("TEXT: " + text);
							text = text.replace(/&/g, "and");
							//alert("INDEX: " + sectionItem.index);
							var params = "action=edit&title=" + GLOBAL_articleName + "&section=" + sectionItem.index + "&token=" + editToken + "&text=" + text + "&contentformat=text/x-wiki&contentmodel=wikitext";
							//UPDATING TEXT TO WIKIPEDIA!
							articleController.editRequest(url, params, item.id);
							//GET THE NEW VERSION FROM WIKIPEDIA (rawtext, images which are maybe added to this section, etc)
							//MAKE A REQUEST TO THE WIKIPAGE!!! (WITH THE SANDBOX WE CAN DO THIS :-) )
							/*var rawText = textarea.val();
							console.log("rawText: " + rawText);
							GLOBAL_data.nodes.update({
							id : item.id,
							rawText : rawText
							});*/
							//console.log("RAW TEXT: " + rawText);
							//GLOBAL_controller.showQuality();
							$(this).dialog("close");
							$("#dialogEditInProgres").dialog("open");
							GLOBAL_interval = setInterval(dataManipulator.editAnimation(true), 500);
						}
					}, {
						text : "Cancel",
						click : function () {
							$(this).dialog("close");
						}
					}
				]
			});
			//console.log("SECTIONITEM: " + JSON.stringify(sectionItem));
			if (sectionItem != null) {
				$("#dialog").dialog('option', 'title', sectionItem.label);
			} else {
				$("#dialog").dialog('option', 'title', "NOT EDITABLE RIGHT NOW"); //TODO!!!! GLOBAL_data

			}
			$("#dialog").dialog("open");
			event.preventDefault();
		}
	}

	function clearPopUp() {
		var saveButton = document.getElementById('saveButton');
		var cancelButton = document.getElementById('cancelButton');
		saveButton.onclick = null;
		cancelButton.onclick = null;
		var div = document.getElementById('network-popUp');
		div.style.display = 'none';
	}

	function saveData(data, callback) {
		var idInput = document.getElementById('node-id');
		var labelInput = document.getElementById('node-label');
		var div = document.getElementById('network-popUp');
		data.id = idInput.value;
		data.label = labelInput.value;
		clearPopUp();
		callback(data);
	}

	return dataManipulator;
};

var DataManipulator = function (vals) {
	var GLOBAL_network = vals.network;
	var GLOBAL_data = vals.data;
	var GLOBAL_articleName = vals.articleName;
	var GLOBAL_controller = vals.controller;

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

	dataManipulator.editNodes = function (data, callback) {
		var item = GLOBAL_data.nodes.get(data.id);
		if (item.type == "text") {
			var textarea = $("#node-label");
			//textarea.html(data.label);
			textarea.val(item.originalText);
			//TODO: Create a second collection which always contains, the whole in order to be able to always get the item with the given masterId
			//E.g. When we just show some items (double click on an images then the GLOBAL_data.nodes container does not include the item with the given masterId)
			var sectionItem = GLOBAL_data.nodes.get(item.masterId);
			$("#dialog").dialog({
				buttons : [{
						text : "Save",
						click : function () {
							console.log("click: " + item.id);
							var editToken = GLOBAL_controller.getEditToken();
							console.log("EDITTOKEN: " + editToken);
							var textarea = $("#node-label");
							var text = textarea.val();
							var url = "http://en.wikipedia.org/w/api.php?action=edit&format=xml";
							//text = _.unescape(text); // DOES IT WORK?????
							text = text.replaceHtmlEntites();
							console.log("TEXT: " + text);
							text = text.replace(/&/g, "and");
							alert("INDEX: " + sectionItem.index);
							var params = "action=edit&title=" + GLOBAL_articleName + "&section=" + sectionItem.index + "&token=" + editToken + "&text=" + text + "&contentformat=text/x-wiki&contentmodel=wikitext";
							//UPDATING TEXT TO WIKIPEDIA!
							articleController.editRequest(url, params, item.id);
							// GET THE NEW VERSION FROM WIKIPEDIA (rawtext, images which are maybe added to this section, etc)
						
							//TODO MAKE A REQUEST TO THE WIKIPAGE!!! (WITH THE SANDBOX WE CAN DO THIS :-) )


							/*var rawText = textarea.val();





							console.log("rawText: " + rawText);
							GLOBAL_data.nodes.update({
							id : item.id,
							rawText : rawText
							});*/
							//console.log("RAW TEXT: " + rawText);
							//GLOBAL_controller.showQuality();
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
			//console.log("SECTIONITEM: " + JSON.stringify(sectionItem));
			if(sectionItem != null){
				$("#dialog").dialog('option', 'title', sectionItem.label);
			}else{
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

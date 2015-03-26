var DataManipulator = function (vals) {
	var GLOBAL_network = vals.network;
	var GLOBAL_data = vals.data;
	var GLOBAL_articleName = vals.articleName;
	var GLOBAL_controller = vals.controller;

	var dataManipulator = {};

	dataManipulator.connectNodes = function (data, callback) {
		console.log(JSON.stringify(data));
		if (data.from == data.to) {
			alert("NOT POSSIBLE");
		} else {
			var itemFrom = GLOBAL_data.nodes.get(data.from);
			var itemTo = GLOBAL_data.nodes.get(data.to);
			if (itemFrom.type == "text" && itemTo.type == "img") {
				itemFrom.imagesToThisNode.push(itemTo.imageInfos.imageTitle); //ALSO A reference to itemFrom.sectionInfo.images
				callback(data);
				GLOBAL_controller.showQuality();
			} else if (itemFrom.type == "text" && itemTo.type == "ref") {
				itemFrom.refsToThisNode.push(itemTo.title); //ALSO A reference to itemFrom.sectionInfo.images
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

	dataManipulator.editNodes = function (data, callback) {
		var item = GLOBAL_data.nodes.get(data.id);
		if (item.type == "text") {
			var textarea = $("#node-label");
			textarea.html(data.label);
			var sectionItem = GLOBAL_data.nodes.get(item.masterId);
			$("#dialog").dialog({
				buttons : [{
						text : "Save",
						click : function () {
							//TODO UPDATE TEXT TO WIKIPEDIA!
							//GENERATE RAW TEXT FOR FLESCH AND KINCAID
							var textarea = $("#node-label");
							var rawText = generateRawText(textarea.html());
							console.log("RAW TEXT: " + rawText);
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
			$("#dialog").dialog('option', 'title', sectionItem.label);
			$("#dialog").dialog("open");
			event.preventDefault();
		}
		/*var span = document.getElementById('operation');
		var idInput = document.getElementById('node-id');
		var labelInput = document.getElementById('node-label');
		var saveButton = document.getElementById('saveButton');
		var cancelButton = document.getElementById('cancelButton');
		var div = document.getElementById('network-popUp');
		span.innerHTML = "Edit Node";
		idInput.value = data.id;
		labelInput.value = data.label;
		saveButton.onclick = saveData.bind(this, data, callback);
		cancelButton.onclick = clearPopUp.bind();
		div.style.display = 'block';*/
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

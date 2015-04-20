var EquationEditor = function (vals) {

	var equationEditor = {};
	var idCnt = 0;
	var equationStack = "#equition_stack_main";
	var progressArray = [];
	var progressArrayPosition = -1;
	var prevState = "";
	var currentlySelectedBox = "";
	var currentlySelectedBoxId = -1;
	var isAddBeforeSelected = false;
	var isAddAfterSelected = false;

	//INSERTS: ----------------------------------------------------------------
	equationEditor.simpleSymbol = function (symbol) {
		if (!checkIfOperationIsPermitted())
			return;
		if ($(equationStack).children().length == 0) {
			$(equationStack).append("<div type=\"box\" id=\"equation" + (idCnt) + "\" class=\"eexcess_equation_empty_box\" onclick=\"equationEditor.highlightBox(" + (idCnt++) + ")\"> </div> <div type=\"symbol\" id=\"equation" + (idCnt++) + "\"class=\"eexcess_equation_text\"><div id=\"neededText\">" + symbol + "</div></div> <div type=\"box\" id=\"equation" + (idCnt) + "\" class=\"eexcess_equation_empty_box\" onclick=\"equationEditor.highlightBox(" + (idCnt++) + ")\"> </div>");
		} else {
			if (isAddBeforeSelected) {
				$("<div type=\"box\" id=\"equation" + (idCnt) + "\" class=\"eexcess_equation_empty_box\" onclick=\"equationEditor.highlightBox(" + (idCnt++) + ")\"> </div>  <div type=\"symbol\" id=\"equation" + (idCnt++) + "\" class=\"eexcess_equation_text\"><div id=\"neededText\">" + symbol + "</div></div> ").insertBefore($(currentlySelectedBox));
			} else if (isAddAfterSelected) {
				$("<div  id=\"equation" + (idCnt++) + "\" type=\"symbol\" class=\"eexcess_equation_text\"><div id=\"neededText\">" + symbol + "</div></div> <div type=\"box\" id=\"equation" + (idCnt) + "\" class=\"eexcess_equation_empty_box\" onclick=\"equationEditor.highlightBox(" + (idCnt++) + ")\"> </div>  ").insertAfter($(currentlySelectedBox));
			} else
				$(equationStack).append(" <div  type=\"symbol\" id=\"equation" + (idCnt++) + "\" class=\"eexcess_equation_text\"><div id=\"neededText\">" + symbol + "</div></div> <div type=\"box\" id=\"equation" + (idCnt) + "\" class=\"eexcess_equation_empty_box\" onclick=\"equationEditor.highlightBox(" + (idCnt++) + ")\"> </div>");
		}
		checkProgressArray();
	}

	equationEditor.radical = function () {
		if (!checkIfOperationIsPermitted())
			return;
		var order = prompt("Insert the order of the root", "2");
		if (order != null) {
			//if (isAddBeforeSelected) {}
			//else if (isAddAfterSelected) {}
			//else {
			equationEditor.bricks();
			$(equationStack).prepend(" <div type=\"radical\" id=\"equation" + (idCnt) + "\" class=\"eexcess_equation_text\" onclick=\"equationEditor.highlightBox(" + (idCnt++) + ")\"><div id=\"neededText\"><sup>" + order + "</sup>&radic;</div></div>");
			checkProgressArray();
			//}
		}
	}

	equationEditor.exponentiate = function () {
		if (!checkIfOperationIsPermitted())
			return;
		var order = prompt("Insert the exponent", "2");
		if (order != null) {
			//if (isAddBeforeSelected) {}
			//else if (isAddAfterSelected) {}
			//else {
			equationEditor.bricks();
			$(equationStack).append(" <div  type=\"exponent\" id=\"equation" + (idCnt++) + "\" class=\"eexcess_equation_text\"><div id=\"neededText\"><sup>" + order + "</sup></div></div> ");
			checkProgressArray();
			//}
		}
	}

	equationEditor.logarithm = function () {
		if (!checkIfOperationIsPermitted())
			return;
		var order = prompt("Insert the order of the root", "2");
		if (order != null) {
			//if (isAddBeforeSelected) {}
			//else if (isAddAfterSelected) {}
			//else {
			equationEditor.bricks();
			$(equationStack).prepend(" <div  type=\"logarithm\" id=\"equation" + (idCnt++) + "\" class=\"eexcess_equation_text\"><div id=\"neededText\">log<sub>" + order + "</sub></div></div> ");
			checkProgressArray();
			//}
		}
	}

	equationEditor.sum = function () {
		if (!checkIfOperationIsPermitted())
			return;
		//if (isAddBeforeSelected) {}
		//else if (isAddAfterSelected) {}
		//else {
		equationEditor.bricks();
		$(equationStack).prepend(" <div  type=\"sum\" id=\"equation" + (idCnt++) + "\" class=\"eexcess_equation_text\"><div id=\"neededText\">&sum;</div></div> ");
		checkProgressArray();
		//}
	}

	equationEditor.prod = function () {
		if (!checkIfOperationIsPermitted())
			return;
		//if (isAddBeforeSelected) {}
		//else if (isAddAfterSelected) {}
		//else {
		equationEditor.bricks();
		$(equationStack).prepend(" <div type=\"prod\" id=\"equation" + (idCnt++) + "\" class=\"eexcess_equation_text\"><div id=\"neededText\">&prod;</div></div> ");
		checkProgressArray();
		//}
	}

	equationEditor.bricks = function () {
		if (!checkIfOperationIsPermitted())
			return;
		if ($(equationStack).children().length == 0) {
			notPossible();
		} else {
			//	if (isAddBeforeSelected) {}
			//	else if (isAddAfterSelected) {}
			//	else {
			$(equationStack).prepend(" <div type=\"brick\" id=\"equation" + (idCnt++) + "\" class=\"eexcess_equation_text\"><div id=\"neededText\">(</div></div> ");
			$(equationStack).append(" <div type=\"brick\" id=\"equation" + (idCnt++) + "\" class=\"eexcess_equation_text\"><div id=\"neededText\">)</div></div> ");
			//		}
		}
		checkProgressArray();
	}
	//-------------------------------------------------------------------------
	//-------------------------------------------------------------------------


	var checkProgressArray = function () {

		progressArray.push($(equationStack).html());
		if (progressArrayPosition != -1) {
			progressArrayPosition++;
			if (progressArrayPosition < progressArray.length) {
				//RESET IT
				progressArrayPosition = -1;
				progressArray.splice(0, progressArray.length);
				progressArray.push(prevState);
				progressArray.push($(equationStack).html());
				/*	if (progressArrayPosition > 0) {
				console.log("splic(" + (progressArrayPosition - 1) + "," + (progressArray.length - 1) + ")");
				progressArray.splice(progressArrayPosition - 1, progressArray.length - 1);
				} else
				progressArray.splice(0, progressArray.length - 1);*/
			}
		} else {}
		prevState = $(equationStack).html();
		equationEditor.print();
	}

	var notPossible = function () {
		alert("This operation is not possible");
	}

	equationEditor.highlightBox = function (id) {
		console.log("HIGHLIGHT BOX " + 'equation' + id);
		$(equationStack).children(".eexcess_equation_empty_box").css({
			"border" : "5px solid red"
		});

		$(equationStack).children(".eexcess_equation_tag_in_box").css({
			"border" : "0.2em solid #21B571"
		});

		if (currentlySelectedBoxId == id) {

			$('#equation' + id).css({
				"border" : "5px solid red"
			});
			currentlySelectedBox = "";
			currentlySelectedBoxId = -1;
			return;
		}
		currentlySelectedBoxId = id;
		currentlySelectedBox = '#equation' + id;

		$(currentlySelectedBox).css({
			"border" : "5px solid blue"
		});

	}

	equationEditor.redo = function () {
		if (progressArrayPosition < progressArray.length) {
			$(equationStack).html(progressArray[progressArrayPosition]);
			progressArrayPosition++;
		} else
			notPossible();
		equationEditor.print();
	}

	equationEditor.print = function () {
		console.log("EQUATIONE EDITOR: progressArrayPosition: " + progressArrayPosition + " Array LENGHT: " + progressArray.length);
	}

	equationEditor.undo = function () {
		if (progressArray.length > 1 && progressArrayPosition == -1) {
			$(equationStack).html(progressArray[progressArray.length - 2]);
			progressArrayPosition = progressArray.length - 1;
		} else if (progressArrayPosition > 1) {
			$(equationStack).html(progressArray[progressArrayPosition - 2]);
			progressArrayPosition = progressArrayPosition - 1;

		} else
			notPossible();
		equationEditor.print();
	}

	equationEditor.deleteSelectedElement = function () {
		console.log("HERE: " + $(currentlySelectedBox).attr("type"));
		if ($(currentlySelectedBox).attr("type") == "box") {
			if ($('#equation' + (currentlySelectedBoxId - 1)).html() !== undefined)
				$('#equation' + (currentlySelectedBoxId - 1)).remove();
			else
				$('#equation' + (currentlySelectedBoxId + 1)).remove();
		} else if ($(currentlySelectedBox).attr("type") == "radical") {
			$('#equation' + (currentlySelectedBoxId - 1)).remove();
			$('#equation' + (currentlySelectedBoxId - 2)).remove();
		}
		$(currentlySelectedBox).remove();
		checkProgressArray();

	}

	equationEditor.hideMenuEquationEditor = function () {

		console.log($("#eexcess_equation_composer_table").is(":visible"));
		if ($("#eexcess_equation_composer_table").is(":visible"))
			$("#eexcess_equation_composer_table").hide("slow");
		else
			$("#eexcess_equation_composer_table").show("slow");
	}
	equationEditor.addBeforeSelected = function () {
		console.log("addBeforeSelected");
		if (!isAddBeforeSelected) {
			$("#divAddBeforeSelected").css({
				"background" : "red"
			});
			$("#divAddAfterSelected").css({
				"background" : "none"
			});
			isAddAfterSelected = false;
			isAddBeforeSelected = true;
		} else {
			$("#divAddBeforeSelected").css({
				"background" : "none"
			});
			isAddBeforeSelected = false;
		}
	}

	equationEditor.addAfterSlected = function () {
		console.log("addAfterSlected");
		if (!isAddAfterSelected) {
			$("#divAddBeforeSelected").css({
				"background" : "none"
			});
			$("#divAddAfterSelected").css({
				"background" : "red"
			});
			isAddAfterSelected = true;
			isAddBeforeSelected = false;
		} else {
			$("#divAddAfterSelected").css({
				"background" : "none"
			});
			isAddAfterSelected = false;
		}
	}

	var checkIfOperationIsPermitted = function () {
		if (isInsertBeforeOrAfter()) {
			if (currentlySelectedBoxId != -1)
				return true;
			notPossible();
			return false;
		}
		return true;
	}

	var isInsertBeforeOrAfter = function () {
		if ((isAddAfterSelected || isAddBeforeSelected))
			return true;
		return false;
	}

	equationEditor.setVisController = function (visController) {
		visController.setEquationEditor(equationEditor);
	}

	//FROM VIS:
	equationEditor.fillGap = function (data) {
		if (currentlySelectedBoxId != -1) {
			console.log("FILL GAP: " + JSON.stringify(data));
			var output = "<div id=\"equation" + currentlySelectedBoxId + "\" onclick=\"equationEditor.highlightBox(" + currentlySelectedBoxId + ")\" class=\"eexcess_equation_tag_in_box\" style=\"font-size:20px; border: 0.2em solid #21B571; display: inline-block; background: #21B571;\"><div id=\"neededText\">" + data.name + "</div><img class=\"eexcess_tag_img\" src=\"media/fancybox_sprite_close.png\"> <div class=\"div-slider ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all\" aria-disabled=\"false\"> <div class=\"ui-slider-range ui-widget-header ui-corner-all ui-slider-range-min\" style=\"width: 100%;\"></div> <a class=\"ui-slider-handle ui-state-default ui-corner-all\" href=\"#\" style=\"left: 100%;\"></a></div></div>";
			$("#equation" + currentlySelectedBoxId).replaceWith(output);
			//$(equationStack).append(output);
			currentlySelectedBoxId = -1;
			checkProgressArray();
		} else {
			notPossible();
		}
	}

	equationEditor.createNewQM = function () {
		var allElementsString = "";
		$(equationStack).find('*').each(function () {
			//allElementsString += $(this).val();
			if (this.id.indexOf("equation") > -1) {
				//console.log();
				allElementsString += $(this).find("#neededText").html();
			}
		});
		console.log("ALLE: " + allElementsString);
		/*
		allElementsString = "pow(" + allElementsString + ",2)";
		allElementsString = "pow(" + allElementsString + ",1/2)";
		allElementsString = "log(" + allElementsString + ")/log(2)";*/
		var ret = checkForRadicals(allElementsString);
		while (ret != false) {
			allElementsString = ret;
			ret = checkForRadicals(allElementsString);
		}
		//console.log("RESULT: " +Parser.evaluate(allElementsString, { flesch: 3, kincaid: 7 }));
		allElementsString = allElementsString.replace(/flesch/g, '9');
		allElementsString = allElementsString.replace(/kincaid/g, '7');
		console.log("BEFORE PARSING: " + allElementsString);
		console.log("RESULT: " + math.eval(allElementsString));
	}

	var brickCounter = function (string, startpoint) {
		console.log("string: " + string);
		console.log("string: " + string[startpoint]);
		var brickCnt = 1;
		for (var i = startpoint + 1; i < string.length; i++) {
			if (string[i] == "(") {
				brickCnt++;
			}
			if (string[i] == ")") {
				brickCnt--;
			}
			if (brickCnt == 0) {
				return i;
			}
		}
	}

	var checkForRadicals = function (allElementsString) {
		var newString = "";
		console.log("HERE: " + allElementsString.indexOf("√"));
		if (allElementsString.indexOf("<sup>") > -1) {
			newString = allElementsString.substring(0, allElementsString.indexOf("<sup>"));
			console.log("NEW STRING1: " + newString);
			var begin = allElementsString.indexOf("<sup>") + 5;
			if (allElementsString.indexOf("</sup>") > -1) {
				var end = allElementsString.indexOf("</sup>");
				console.log("BEGIN: " + begin + " END: " + end);
				var exponent = allElementsString.substring(begin, end);
				console.log("EXPONENT: " + exponent);
				newString += "pow";
				var lastBrick = brickCounter(allElementsString, allElementsString.indexOf("√") + 1);
				newString += allElementsString.substring(allElementsString.indexOf("√") + 1, lastBrick);
				console.log("NEW STRING2: " + newString);
				newString += (",1/" + exponent + ")");
				console.log("NEW STRING3: " + newString);
				newString += allElementsString.substring(lastBrick + 1, allElementsString.length);
				console.log("NEW STRING4: " + newString);
			} else {
				alert("error2")

				return false;
			}

		} else {
			alert("error1")

			return false;
		}
		return newString;
	}

	return equationEditor;
}

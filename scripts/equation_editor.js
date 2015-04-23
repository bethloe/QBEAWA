var EquationEditor = function (vals) {

	var equationEditor = {};
	var idCnt = 0;
	var equationStack = "#equition_stack_main";
	var equationStackHidden = "#equition_stack_main_hidden";
	var progressArray = [];
	var progressArrayPosition = -1;
	var prevState = "";
	var currentlySelectedBox = "";
	var currentlySelectedBoxId = -1;
	var isAddBeforeSelected = false;
	var isAddAfterSelected = false;
	var visController = null;
	var nameOfLoadedMetric = "";
	var isShiftPressed = false;
	var mode = "single";
	var alpha = false;
	var shrinkLevel = 1;
	var zoomArray = [];
	/*mode can be single or multi*/

	//INSERTS: ----------------------------------------------------------------
	equationEditor.simpleSymbol = function (symbol) {
		if (!checkIfOperationIsPermitted())
			return;
		if ($(equationStack).children().length == 0) {
			$(equationStack).append("<div type=\"box\" id=\"equation" + (idCnt) + "\" class=\"eexcess_equation_empty_box\" onclick=\"equationEditor.highlightBox(" + (idCnt++) + ")\"> </div> <div type=\"symbol\" id=\"equation" + (idCnt++) + "\"class=\"eexcess_equation_text\"><div id=\"neededText\">" + symbol + "</div></div> <div type=\"box\" id=\"equation" + (idCnt) + "\" class=\"eexcess_equation_empty_box\" onclick=\"equationEditor.highlightBox(" + (idCnt++) + ")\"> </div>");
			adjustNewElementsToShrinkLevel(idCnt - 3);
			adjustNewElementsToShrinkLevel(idCnt - 2);
			adjustNewElementsToShrinkLevel(idCnt - 1);
		} else {
			if (isAddBeforeSelected) {
				$("<div type=\"box\" id=\"equation" + (idCnt) + "\" class=\"eexcess_equation_empty_box\" onclick=\"equationEditor.highlightBox(" + (idCnt++) + ")\"> </div>  <div type=\"symbol\" id=\"equation" + (idCnt++) + "\" class=\"eexcess_equation_text\"><div id=\"neededText\">" + symbol + "</div></div> ").insertBefore($(currentlySelectedBox));
				adjustNewElementsToShrinkLevel(idCnt - 2);
				adjustNewElementsToShrinkLevel(idCnt - 1);
			} else if (isAddAfterSelected) {
				$("<div  id=\"equation" + (idCnt++) + "\" type=\"symbol\" class=\"eexcess_equation_text\"><div id=\"neededText\">" + symbol + "</div></div> <div type=\"box\" id=\"equation" + (idCnt) + "\" class=\"eexcess_equation_empty_box\" onclick=\"equationEditor.highlightBox(" + (idCnt++) + ")\"> </div>  ").insertAfter($(currentlySelectedBox));
				adjustNewElementsToShrinkLevel(idCnt - 2);
				adjustNewElementsToShrinkLevel(idCnt - 1);
			} else
				$(equationStack).append("<div  type=\"symbol\" id=\"equation" + (idCnt++) + "\" class=\"eexcess_equation_text\"><div id=\"neededText\">" + symbol + "</div></div> <div type=\"box\" id=\"equation" + (idCnt) + "\" class=\"eexcess_equation_empty_box\" onclick=\"equationEditor.highlightBox(" + (idCnt++) + ")\"> </div>");
			adjustNewElementsToShrinkLevel(idCnt - 2);
			adjustNewElementsToShrinkLevel(idCnt - 1);
		}
		checkProgressArray();
		shrinkElementsIfNecessary(1);
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
			$(equationStack).prepend(" <div type=\"radical\" id=\"equation" + (idCnt) + "\" class=\"eexcess_equation_text\" onclick=\"equationEditor.highlightBox(" + (idCnt++) + ")\"><div id=\"neededText\"><sup type=\"radical\">" + order + "</sup>&radic;</div></div>");
			adjustNewElementsToShrinkLevel(idCnt - 1);
			checkProgressArray();
			rerank();
			shrinkElementsIfNecessary(1);
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
			$(equationStack).append(" <div  type=\"exponent\" id=\"equation" + (idCnt) + "\" class=\"eexcess_equation_text\" onclick=\"equationEditor.highlightBox(" + (idCnt++) + ")\"><div id=\"neededText\"><sup type=\"pow\">" + order + "</sup></div></div> ");
			adjustNewElementsToShrinkLevel(idCnt - 1);
			checkProgressArray();
			rerank();
			shrinkElementsIfNecessary(1);
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
			$(equationStack).prepend(" <div  type=\"logarithm\" id=\"equation" + (idCnt) + "\" class=\"eexcess_equation_text\" onclick=\"equationEditor.highlightBox(" + (idCnt++) + ")\"><div id=\"neededText\">log<sub type=\"logarithm\">" + order + "</sub></div></div> ");
			adjustNewElementsToShrinkLevel(idCnt - 1);
			checkProgressArray();
			rerank();
			shrinkElementsIfNecessary(1);
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
		adjustNewElementsToShrinkLevel(idCnt - 1);
		checkProgressArray();
		shrinkElementsIfNecessary(1);
		//}
	}

	equationEditor.sumMulti = function () {
		if (!checkIfOperationIsPermitted())
			return;
		alpha = false;
		equationEditor.resetData();
		mode = "multi";
		//console.log("SUM MULTI CURRENT DATA ARRAY: " + currentDataArray.length);
		for (var i = 0; i < currentDataArray.length; i++) {
			var data = currentDataArray[i];
			//console.log("DATA: " + JSON.stringify(data));
			var color = data.type == "metric" ? "#08519c" : "#21B571";
			if (i + 1 < currentDataArray.length) {

				if (data.type != "metric") {
					$(equationStack).append("<div innerType=\"" + data.type + "\" type=\"filledBox\" id=\"equation" + idCnt + "\" onclick=\"equationEditor.highlightBox(" + (idCnt++) + ")\" class=\"eexcess_equation_tag_in_box\" style=\"font-size:20px; border: 0.2em solid " + color + "; display: inline-block; background: " + color + ";\"><div id=\"neededText\">" + data.name + "</div></div><div  type=\"symbol\" id=\"equation" + (idCnt++) + "\" class=\"eexcess_equation_text\"><div id=\"neededText\">+</div></div>");
					$("<div class='div-slider'></div>").appendTo($("#equation" + (idCnt - 2))).slider(sliderOptions);
				} else {

					$(equationStack).append("<div innerType=\"" + data.type + "\" type=\"filledBox\" id=\"equation" + idCnt + "\" onclick=\"equationEditor.highlightBox(" + (idCnt) + ")\" ondblclick=\"equationEditor.showMetric(" + (idCnt++) + ")\"  class=\"eexcess_equation_tag_in_box\" style=\"font-size:20px; border: 0.2em solid " + color + "; display: inline-block; background: " + color + ";\"><div id=\"neededText\">" + data.name + "</div></div><div  type=\"symbol\" id=\"equation" + (idCnt++) + "\" class=\"eexcess_equation_text\"><div id=\"neededText\">+</div></div>");
				}
				adjustNewElementsToShrinkLevel(idCnt - 2);
				adjustNewElementsToShrinkLevel(idCnt - 1);
			} else {

				if (data.type != "metric") {
					$(equationStack).append("<div innerType=\"" + data.type + "\" type=\"filledBox\" id=\"equation" + idCnt + "\" onclick=\"equationEditor.highlightBox(" + (idCnt++) + ")\"   class=\"eexcess_equation_tag_in_box\" style=\"font-size:20px; border: 0.2em solid " + color + "; display: inline-block; background: " + color + ";\"><div id=\"neededText\">" + data.name + "</div></div>");

					$("<div class='div-slider'></div>").appendTo($("#equation" + (idCnt - 1))).slider(sliderOptions);
				} else {
					$(equationStack).append("<div innerType=\"" + data.type + "\" type=\"filledBox\" id=\"equation" + idCnt + "\" onclick=\"equationEditor.highlightBox(" + (idCnt) + ")\" ondblclick=\"equationEditor.showMetric(" + (idCnt++) + ")\" class=\"eexcess_equation_tag_in_box\" style=\"font-size:20px; border: 0.2em solid " + color + "; display: inline-block; background: " + color + ";\"><div id=\"neededText\">" + data.name + "</div></div>");

				}

				adjustNewElementsToShrinkLevel(idCnt - 1);
			}

		}

		$("#eexcess_equation_composer_table").css("display", "none");
		$("#eexcess_equation_composer_table2").css("display", "inline");
		checkProgressArray();
		rerank();
		shrinkElementsIfNecessary(1);
	}

	equationEditor.euclidean = function () {
		if (!checkIfOperationIsPermitted())
			return;
	}

	equationEditor.prod = function () {
		if (!checkIfOperationIsPermitted())
			return;
		//if (isAddBeforeSelected) {}
		//else if (isAddAfterSelected) {}
		//else {
		equationEditor.bricks();
		$(equationStack).prepend(" <div type=\"prod\" id=\"equation" + (idCnt++) + "\" class=\"eexcess_equation_text\"><div id=\"neededText\">&prod;</div></div> ");
		adjustNewElementsToShrinkLevel(idCnt - 1);
		checkProgressArray();
		shrinkElementsIfNecessary(1);
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
			$(equationStack).prepend(" <div type=\"brickP\" id=\"equation" + (idCnt) + "\" class=\"eexcess_equation_text\" onclick=\"equationEditor.highlightBox(" + (idCnt++) + ")\"><div id=\"neededText\">(</div></div> ");
			$(equationStack).append(" <div type=\"brickA\" id=\"equation" + (idCnt) + "\" class=\"eexcess_equation_text\" onclick=\"equationEditor.highlightBox(" + (idCnt++) + ")\"><div id=\"neededText\">)</div></div> ");
			adjustNewElementsToShrinkLevel(idCnt - 2);
			adjustNewElementsToShrinkLevel(idCnt - 1);
			//		}
		}
		checkProgressArray();
		shrinkElementsIfNecessary(1);
	}

	//-------------------------------------------------------------------------
	//-------------------------------------------------------------------------

	equationEditor.resetData = function () {
		mode = "single";
		shrinkLevel = 1;
		nameOfLoadedMetric = "";
		progressArrayPosition = -1;
		progressArray.splice(0, progressArray.length);
		idCnt = 0;
		prevState = "";
		currentlySelectedBox = "";
		currentlySelectedBoxId = -1;
		isAddBeforeSelected = false;
		isAddAfterSelected = false;
		$(equationStack).html("");
		$("#eexcess_equation_composer_table").css("display", "inline");
		$("#eexcess_equation_composer_table2").css("display", "none");
	}

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
		}
		prevState = $(equationStack).html();
		equationEditor.print();
	}

	var notPossible = function () {
		alert("This operation is not possible");
	}

	equationEditor.highlightBox = function (id) {
		//console.log("HIGHLIGHT BOX " + 'equation' + id);

		$(equationStack).children(".eexcess_equation_empty_box").css({
			"border" : "5px solid red"
		});

		$(equationStack).children(".eexcess_equation_tag_in_box").each(function () {
			if ($(this).attr("innerType") == "metric") {
				$(this).css({
					"border" : "0.2em solid #08519c"
				});
			} else {
				$(this).css({
					"border" : "0.2em solid #21B571"
				});

			}
		});

		$(equationStack).children(".eexcess_equation_text").css({
			"border" : "0px"
		});

		if (currentlySelectedBoxId == id) {

			if ($('#equation' + id).attr("type") == "box") {
				$('#equation' + id).css({
					"border" : "5px solid red"
				});
			} else if ($('#equation' + id).attr("type") == "filledBox") {
				if ($('#equation' + id).attr("innerType") == "metric") {
					$('#equation' + id).css({
						"border" : "0.2em solid #08519c"
					});
				} else
					$('#equation' + id).css({
						"border" : "0.2em solid #21B571"
					});
			} else {
				$('#equation' + id).css({
					"border" : "0px"
				});
			}
			currentlySelectedBox = "";
			currentlySelectedBoxId = -1;
			return;
		}
		currentlySelectedBoxId = id;
		currentlySelectedBox = '#equation' + id;
		if ($('#equation' + id).attr("type") == "brickP") {
			//console.log("TEST " + '#equation' + id);
			$('#equation' + id).css({
				"border" : "5px solid blue"
			});
			/*$('#equation' + (id + 1)).css({
			"border" : "5px solid blue"
			});*/
		} else if ($('#equation' + id).attr("type") == "brickA") {
			$('#equation' + id).css({
				"border" : "5px solid blue"
			});
			/*$('#equation' + (id - 1)).css({
			"border" : "5px solid blue"
			});*/
		} else
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
		rerank();
	}

	equationEditor.print = function () {
		//console.log("EQUATIONE EDITOR: progressArrayPosition: " + progressArrayPosition + " Array LENGHT: " + progressArray.length);
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
		rerank();
	}

	equationEditor.deleteSelectedElement = function () {
		//console.log("HERE: " + currentlySelectedBox + " " + $(currentlySelectedBox).attr("type"));
		if ($(currentlySelectedBox).attr("type") == "box" || $(currentlySelectedBox).attr("type") == "filledBox") {
			if ($('#equation' + (currentlySelectedBoxId - 1)).html() !== undefined)
				$('#equation' + (currentlySelectedBoxId - 1)).remove();
			else
				$('#equation' + (currentlySelectedBoxId + 1)).remove();
		} else if ($(currentlySelectedBox).attr("type") == "radical" || $(currentlySelectedBox).attr("type") == "logarithm" || $(currentlySelectedBox).attr("type") == "exponent") {
			$('#equation' + (currentlySelectedBoxId - 1)).remove();
			$('#equation' + (currentlySelectedBoxId - 2)).remove();
		} else if ($(currentlySelectedBox).attr("type") == "brickP") {
			$('#equation' + (currentlySelectedBoxId + 1)).remove();
		} else if ($(currentlySelectedBox).attr("type") == "brickA") {
			$('#equation' + (currentlySelectedBoxId - 1)).remove();
		}
		$(currentlySelectedBox).remove();
		checkProgressArray();

		rerank();
		shrinkElementsIfNecessary(2);
	}
	var mathTable = 1;
	equationEditor.hideMenuEquationEditor = function () {

		if ($("#eexcess_equation_composer_table2").is(":visible")) {
			$("#eexcess_equation_composer_table2").hide("slow");
			mathTable = 2;
		}
		if ($("#eexcess_equation_composer_table").is(":visible")) {
			$("#eexcess_equation_composer_table").hide("slow");
			mathTable = 1;
		} else if (mathTable == 1) {
			$("#eexcess_equation_composer_table").show("slow");
		} else {
			$("#eexcess_equation_composer_table2").show("slow");
		}
	}
	equationEditor.addBeforeSelected = function () {
		//console.log("addBeforeSelected");
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
		//console.log("addAfterSlected");
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

	equationEditor.setVisController = function (visControllerPar) {
		visController = visControllerPar;
		visController.setEquationEditor(equationEditor);
	}
	var repairSliders = function () {
		$(equationStack).find(".div-slider").each(function () {
			var sliderValue = $(this).attr("sliderValue");
			$(this).slider(sliderOptions);
			if (sliderValue == undefined)
				$(this).slider("value", 1);
			else
				$(this).slider("value", sliderValue);
		});
	}

	var rerank = function () {
		if ($(equationStack).find(".eexcess_equation_empty_box").length == 0 && mode == "single") {
			//Rank the articles
			//1. We have to break it down into the detail view
			//Maybe we should use a hidden div to do that
			var backupCurrentView = $(equationStack).html();
			console.log("equationEditor.showWholeEquation()");
			equationEditor.showWholeEquation();
			//2. Now we can rank it normally
			visController.rankWithEquation(getEquation());
			//3. Show the combined view
			$(equationStack).html(backupCurrentView);
			//LOAD IT AGAIN
			repairSliders();
		} else if ($(equationStack).find(".eexcess_equation_empty_box").length == 0 && mode == "multi" && alpha == true) {
			//Rank the articles
			var tmp = [];
			for (var i = 0; i < currentDataArray.length; i++) {
				var data = currentDataArray[i];
				tmp.push({
					'term' : data.name,
					'stem' : data.name,
					'weight' : 1
				});
			}
			visController.rankWithEquationMulti(tmp);
			//GLOBAL_TEMPNAMECOUNTER++;
		} else if ($(equationStack).find(".eexcess_equation_empty_box").length == 0 && mode == "multi" && alpha == false) {
			//Rank the articles
			//1. We have to break it down into the detail view
			//Maybe we should use a hidden div to do that
			var backupCurrentView = $(equationStack).html();
			equationEditor.showWholeEquation();
			//2. Now we can rank it normally
			visController.rankWithEquation(getEquation());

			//3. Show the combined view
			$(equationStack).html(backupCurrentView);
			repairSliders();
		}

	}

	equationEditor.slideStop = function (event, ui) {
		
		$("#"+event.target.parentElement.id).find(".div-slider").each(function () {
				$(this).attr("sliderValue", ui.value);
		});
		rerank();
	}
	var sliderOptions = {
		orientation : 'horizontal',
		animate : false,
		range : "min",
		min : 0,
		max : 1,
		step : 0.1,
		value : 1,
		stop : equationEditor.slideStop
	}

	var sliderOptionsLoad = {
		orientation : 'horizontal',
		animate : false,
		range : "min",
		min : 0,
		max : 1,
		step : 0.1,
		//value : 1,
		stop : equationEditor.slideStop
	}

	//FROM VIS:
	equationEditor.fillGap = function (data) {
		if (currentlySelectedBoxId != -1) {
			//console.log("FILL GAP: " + JSON.stringify(data));
			/*<div class=\"div-slider ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all\" aria-disabled=\"false\"> <div class=\"ui-slider-range ui-widget-header ui-corner-all ui-slider-range-min\" style=\"width: 100%;\"></div> <a class=\"ui-slider-handle ui-state-default ui-corner-all\" href=\"#\" style=\"left: 100%;\"></a></div>*/
			var output = "<div type=\"filledBox\" id=\"equation" + currentlySelectedBoxId + "\" onclick=\"equationEditor.highlightBox(" + currentlySelectedBoxId + ")\" class=\"eexcess_equation_tag_in_box\" style=\"font-size:20px; border: 0.2em solid #21B571; display: inline-block; background: #21B571;\"><div id=\"neededText\">" + data.name + "</div></div>";

			$("#equation" + currentlySelectedBoxId).replaceWith(output);
			$("<div class='div-slider'></div>").appendTo($("#equation" + currentlySelectedBoxId)).slider(sliderOptions);
			//console.log("adjustNewElementsToShrinkLevel: " + currentlySelectedBoxId);
			adjustNewElementsToShrinkLevel(currentlySelectedBoxId);
			//$(equationStack).append(output);
			currentlySelectedBoxId = -1;
			checkProgressArray();
			rerank();
			shrinkElementsIfNecessary(1);
		} else {
			notPossible();
		}
	}

	equationEditor.loadMetric = function (name, htmlValue) {
		equationEditor.resetData();
		$(equationStack).html(htmlValue);
		$(equationStack).find("div").each(function () {
			var id = this.id;
			//console.log("ID: " + id);
			var res = id.split("quation");
			if (res.length > 1) {
				if (parseInt(res[1]) > idCnt)
					idCnt = parseInt(res[1]);
			}
		});
		idCnt++;
		repairSliders();
		//console.log("LOAD IDCNT: " + idCnt);
		nameOfLoadedMetric = name;
		rerank();
		shrinkElementsIfNecessary(1);
	}

	var replaceHelper = function (idToReplace, name) {
		//console.log("MULTILOADHELPER");
		//equationEditor.resetData();

		//console.log("INTO REPLACE HELPER");
		$("#" + idToReplace).replaceWith(" <div type=\"brickP\" id=\"equation" + (idCnt) + "\" class=\"eexcess_equation_text\" onclick=\"equationEditor.highlightBox(" + (idCnt++) + ")\"><div id=\"neededText\">(</div></div> ");
		adjustNewElementsToShrinkLevel(idCnt - 1);
		$(" <div type=\"brickA\" id=\"equation" + (idCnt) + "\" class=\"eexcess_equation_text\" onclick=\"equationEditor.highlightBox(" + (idCnt++) + ")\"><div id=\"neededText\">)</div></div> ").insertAfter("#equation" + (idCnt - 2));
		adjustNewElementsToShrinkLevel(idCnt - 1);
		var allVizs = visController.getAllVizs();
		if (allVizs[name] != null) {
			$(allVizs[name]).insertAfter("#equation" + (idCnt - 2));
			var cnt = 0;
			$(equationStack).find("div").each(function () {
				//console.log("MULTILOADHELPER: " + $(this).attr("id") + " TYPE: " + $(this).attr("type"));
				if ($(this).attr("id") != undefined) {
					if ($(this).attr("id").indexOf("equation") > -1) {
						$(this).attr("id", "equation" + (cnt));
						$(this).attr("onclick", "equationEditor.highlightBox(" + (cnt) + ")");
						cnt++;
						idCnt = cnt;
					}
				}
			});
			$(equationStack).find(".div-slider").each(function () {
				var sliderValue = $(this).attr("sliderValue");
				//console.log("SLIDER VALUE: " + sliderValue);
				$(this).slider(sliderOptions);
				$(this).slider("value", sliderValue);
			});

		} else
			alert("replaceHelper ERROR SHOULD NEVER HAPPEN");
	}

	var mutiLoadHelper = function (name) {
		//console.log("MULTILOADHELPER");
		//equationEditor.resetData();
		$(equationStack).append(" <div type=\"brickP\" id=\"equation" + (idCnt) + "\" class=\"eexcess_equation_text\" onclick=\"equationEditor.highlightBox(" + (idCnt++) + ")\"><div id=\"neededText\">(</div></div> ");

		adjustNewElementsToShrinkLevel(idCnt - 1);
		var allVizs = visController.getAllVizs();
		if (allVizs[name] != null) {
			$(equationStack).append(allVizs[name]);
			var cnt = 0;
			$(equationStack).find("div").each(function () {
				console.log("MULTILOADHELPER: " + $(this).attr("id") + " TYPE: " + $(this).attr("type"));
				if ($(this).attr("id") != undefined) {
					if ($(this).attr("id").indexOf("equation") > -1) {
						$(this).attr("id", "equation" + (cnt));
						$(this).attr("onclick", "equationEditor.highlightBox(" + (cnt) + ")");
						cnt++;
						idCnt = cnt;
					}
				}

			});
			$(equationStack).find(".div-slider").each(function () {
				var sliderValue = $(this).attr("sliderValue");
				//console.log("SLIDER VALUE: " + sliderValue);
				$(this).slider(sliderOptions);
				$(this).slider("value", sliderValue);
			});
			$(equationStack).append(" <div type=\"brickA\" id=\"equation" + (idCnt) + "\" class=\"eexcess_equation_text\" onclick=\"equationEditor.highlightBox(" + (idCnt++) + ")\"><div id=\"neededText\">)</div></div> ");
			adjustNewElementsToShrinkLevel(idCnt - 1);
		} else
			alert("mutiLoadHelper ERROR SHOULD NEVER HAPPEN");
	}

	var currentDataArray;
	equationEditor.loadACombination = function (dataArray) {
		var allVizs = visController.getAllVizs();
		equationEditor.resetData();
		currentDataArray = dataArray.slice();
		alpha = true;
		//console.log("currentDataArray: " + currentDataArray.length);
		mode = "multi";
		$(equationStack).append("<div  type=\"symbol\" id=\"equation" + (idCnt++) + "\" class=\"eexcess_equation_text\"><div id=\"neededText\"> <font face=\"Symbol\">a</font> </div></div><div  type=\"symbol\" id=\"equation" + (idCnt++) + "\" class=\"eexcess_equation_text\"><div id=\"neededText\">{</div></div>");

		adjustNewElementsToShrinkLevel(idCnt - 2);
		adjustNewElementsToShrinkLevel(idCnt - 1);
		for (var i = 0; i < dataArray.length; i++) {
			var data = dataArray[i];
			var color = data.type == "metric" ? "#08519c" : "#21B571";
			if (i + 1 < dataArray.length) {
				$(equationStack).append("<div innerType=\"" + data.type + "\" type=\"filledBox\" id=\"equation" + idCnt + "\" onclick=\"equationEditor.highlightBox(" + (idCnt++) + ")\" class=\"eexcess_equation_tag_in_box\" style=\"font-size:20px; border: 0.2em solid " + color + "; display: inline-block; background: " + color + ";\"><div id=\"neededText\">" + data.name + "</div></div><div  type=\"symbol\" id=\"equation" + (idCnt++) + "\" class=\"eexcess_equation_text\"><div id=\"neededText\">,</div></div>");

				adjustNewElementsToShrinkLevel(idCnt - 2);
				adjustNewElementsToShrinkLevel(idCnt - 1);
			} else {
				$(equationStack).append("<div innerType=\"" + data.type + "\" type=\"filledBox\" id=\"equation" + idCnt + "\" onclick=\"equationEditor.highlightBox(" + (idCnt++) + ")\" class=\"eexcess_equation_tag_in_box\" style=\"font-size:20px; border: 0.2em solid " + color + "; display: inline-block; background: " + color + ";\"><div id=\"neededText\">" + data.name + "</div></div>");
				adjustNewElementsToShrinkLevel(idCnt - 1);
			}
		}
		$(equationStack).append("<div  type=\"symbol\" id=\"equation" + (idCnt++) + "\" class=\"eexcess_equation_text\"><div id=\"neededText\">}</div></div>");

		adjustNewElementsToShrinkLevel(idCnt - 1);
		$("#eexcess_equation_composer_table").css("display", "none");
		$("#eexcess_equation_composer_table2").css("display", "inline");
		rerank();
		shrinkElementsIfNecessary(1);
	}

	equationEditor.showWholeEquation = function () {
		var allNames = [];
		$(equationStack).find("*").each(function () {
			if ($(this).attr("id") != undefined) {
				if (getNameOfHTMLId($(this).attr("id")) != "") {

					console.log("SHOWWOLEEQUATION: " + getNameOfHTMLId($(this).attr("id")));
					replaceHelper($(this).attr("id"), getNameOfHTMLId($(this).attr("id")));
					equationEditor.showWholeEquation();
				}
			}
		});
		shrinkElementsIfNecessary(1);
	}

	var getEquation = function () {
		var allElementsString = "";
		$(equationStack).find('*').each(function () {
			//allElementsString += $(this).val();
			if (this.id.indexOf("equation") > -1) {
				//console.log();
				var weight = $(this).find(".div-slider").slider("value");
				$(this).find(".div-slider").attr("sliderValue", weight);
				if (weight >= 0 && weight <= 1)
					allElementsString += weight + "*";

				allElementsString += $(this).find("#neededText").html();

				//console.log("HTML: " + $(this).find("#neededText").html() + " SLIDER VALUE: " + $(this).find(".div-slider").slider("value"));
			}
		});
		//console.log("ALLE: " + allElementsString);
		/*
		allElementsString = "pow(" + allElementsString + ",2)";
		allElementsString = "pow(" + allElementsString + ",1/2)";
		allElementsString = "log(" + allElementsString + ")/log(2)";*/
		var ret = checkForRadicals(allElementsString);
		while (ret != false) {
			allElementsString = ret;
			ret = checkForRadicals(allElementsString);
		}
		ret = checkForLogarithms(allElementsString);
		while (ret != false) {
			allElementsString = ret;
			ret = checkForLogarithms(allElementsString);
		}
		ret = checkForExponentiate(allElementsString);
		while (ret != false) {
			allElementsString = ret;
			ret = checkForExponentiate(allElementsString);
		}
		//allElementsString = allElementsString.replace(/flesch/g, '9');
		//allElementsString = allElementsString.replace(/kincaid/g, '7');
		console.log("BEFORE PARSING: " + allElementsString);
		//console.log("RESULT: " + math.eval(allElementsString));

		return allElementsString;
	}

	equationEditor.createNewQM = function () {
		console.log("SAVE");
		if (nameOfLoadedMetric != "") {
		console.log("SAVE2");
			var answer = confirm('Overwrite existing metric?');
			if (answer) {
				//console.log('yes');

				var backupCurrentView = $(equationStack).html();
				equationEditor.showWholeEquation();
				var equation = getEquation();
				$(equationStack).html(backupCurrentView);
				var vizData = $(equationStack).html();
				visController.newQMFromEquationComposer(nameOfLoadedMetric, equation, vizData);

			} else {
				var name = prompt("Quality Metric name:", "Insert name here!");
				if (name != null) {
					var backupCurrentView = $(equationStack).html();
					equationEditor.showWholeEquation();
					var equation = getEquation();
					$(equationStack).html(backupCurrentView);
					var vizData = $(equationStack).html();
					visController.newQMFromEquationComposer(name, equation, vizData);
				} else
					alert("ERROR");
			}
		} else {
		console.log("SAVE3");
			var name = prompt("Quality Metric name:", "Insert name here!");
			if (name != null) {
				var backupCurrentView = $(equationStack).html();
				equationEditor.showWholeEquation();
				var equation = getEquation();
				$(equationStack).html(backupCurrentView);
				var vizData = $(equationStack).html();
				//console.log("vizData: " + vizData);
				visController.newQMFromEquationComposer(name, equation, vizData);
			} else
				alert("ERROR");
		}
	}

	var brickCounter = function (string, startpoint) {
		//console.log("string: " + string);
		//console.log("string: " + string[startpoint]);
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

	var brickCounterBackward = function (string, startpoint) {
		//console.log("stringB: " + string);
		//console.log("stringB: " + string[startpoint]);
		var brickCnt = 1;
		for (var i = startpoint - 1; i >= 0; i--) {
			if (string[i] == ")") {
				brickCnt++;
			}
			if (string[i] == "(") {
				brickCnt--;
			}
			if (brickCnt == 0) {
				return i;
			}
		}
	}

	var checkForExponentiate = function (allElementsString) {
		var newString = "";
		if (allElementsString.indexOf("<sup type=\"pow\">") > -1) {

			//newString = allElementsString.substring(0, allElementsString.indexOf("<sup type=\"radical\">"));
			//console.log("NEW STRING1: " + newString);
			var begin = allElementsString.indexOf("<sup type=\"pow\">") + "<sup type=\"pow\">".length;
			if (allElementsString.indexOf("</sup>") > -1) {
				var end = allElementsString.indexOf("</sup>");
				//console.log("BEGIN: " + begin + " END: " + end);
				var exponent = allElementsString.substring(begin, end);
				//console.log("EXPONENT: " + exponent);
				newString += "," + exponent + ")";
				//console.log("NEW STRING1: " + newString);

				newString += allElementsString.substring(end + "</sup>".length, allElementsString.length);
				//console.log("NEW STRING2: " + newString);

				var firstBrick = brickCounterBackward(allElementsString, begin - "<sup type=\"pow\">".length - 1);
				newString = allElementsString.substring(firstBrick, begin - "<sup type=\"pow\">".length - 1) + newString;
				//console.log("NEW STRING3: " + newString);

				newString = allElementsString.substring(0, firstBrick) + "pow" + newString;
				//console.log("NEW STRING4: " + newString);

			} else {
				//alert("EXP error2")
				return false;
			}

		} else {
			//alert("EXP error1")
			return false;
		}
		return newString;
	}

	var checkForLogarithms = function (allElementsString) {
		var newString = "";
		//console.log("HERE: " + allElementsString.indexOf("log"));
		if (allElementsString.indexOf("<sub type=\"logarithm\">") > -1) {
			newString = allElementsString.substring(0, allElementsString.indexOf("<sub type=\"logarithm\">"));
			newString += "(";
			//console.log("NEW STRING1: " + newString);
			var begin = allElementsString.indexOf("<sub type=\"logarithm\">") + "<sub type=\"logarithm\">".length;
			if (allElementsString.indexOf("</sub>") > -1) {
				var end = allElementsString.indexOf("</sub>");
				//console.log("BEGIN: " + begin + " END: " + end);
				var base = allElementsString.substring(begin, end);
				//console.log("BASE: " + base);
				var lastBrick = brickCounter(allElementsString, allElementsString.indexOf("</sub>") + "</sub>".length + 1);
				newString += allElementsString.substring(allElementsString.indexOf("</sub>") + "</sub>".length, lastBrick);
				//console.log("NEW STRING2: " + newString);
				newString += (")/log(" + base + "))");
				//console.log("NEW STRING3: " + newString);
				newString += allElementsString.substring(lastBrick + 1, allElementsString.length);
				//console.log("NEW STRING4: " + newString);

			} else {
				//alert("LOG error2");
				//console.log("LOG error2");
				return false;
			}

		} else {
			//alert("LOG error1");
			//console.log("LOG error1");
			return false;
		}

		return newString;
	}

	var checkForRadicals = function (allElementsString) {
		var newString = "";
		//console.log("HERE: " + allElementsString.indexOf("√"));
		if (allElementsString.indexOf("<sup type=\"radical\">") > -1) {
			newString = allElementsString.substring(0, allElementsString.indexOf("<sup type=\"radical\">"));
			//console.log("NEW STRING1: " + newString);
			var begin = allElementsString.indexOf("<sup type=\"radical\">") + "<sup type=\"radical\">".length;
			if (allElementsString.indexOf("</sup>") > -1) {
				var end = allElementsString.indexOf("</sup>");
				//console.log("BEGIN: " + begin + " END: " + end);
				var exponent = allElementsString.substring(begin, end);
				//console.log("EXPONENT: " + exponent);
				newString += "pow";
				var lastBrick = brickCounter(allElementsString, allElementsString.indexOf("√") + 1);
				newString += allElementsString.substring(allElementsString.indexOf("√") + 1, lastBrick);
				//console.log("NEW STRING2: " + newString);
				newString += (",1/" + exponent + ")");
				//console.log("NEW STRING3: " + newString);
				newString += allElementsString.substring(lastBrick + 1, allElementsString.length);
				//console.log("NEW STRING4: " + newString);
			} else {
				//alert("error2")

				return false;
			}

		} else {
			//alert("error1")

			return false;
		}
		return newString;
	}

	var adjustNewElementsToShrinkLevel = function (id) {
		//console.log("------------------ adjustNewElementsToShrinkLevel ------------------");
		//console.log("EQUATIONID: " + id);
		for (var i = 2; i <= shrinkLevel; i++) {
			if ($("#equation" + id).attr("type") == "box" || $("#equation" + id).attr("type") == "filledBox") {
				var newWidth = parseInt($("#equation" + id).width()) / 2;
				var newHeight = parseInt($("#equation" + id).height()) / 2;
				$("#equation" + id).css("width", newWidth + "px");
				$("#equation" + id).css("height", newHeight + "px");
				var fontSize = $("#equation" + id).css("font-size");
				var oldFontSize = parseInt(fontSize.split("px")[0]);
				var newFontSize = oldFontSize - (oldFontSize / 4);
				$("#equation" + id).css("font-size", newFontSize + "px");

				//console.log("#equation" + id + " TYPE: " + $("#equation" + id).attr("type") + " width: " + newWidth + " FONT-SIZE: " + $("#equation" + id).css("font-size"));
			} else if ($("#equation" + id).attr("class") == "eexcess_equation_text") {
				var newHeight = parseInt($("#equation" + id).height()) / 2;
				$("#equation" + id).css("height", newHeight + "px");
				$("#equation" + id).css("line-height", newHeight + "px");
				//console.log("LINE HIGHT: " + $("#equation" + id).css("line-height"));
			}
		}

		//console.log("END: ------------------ adjustNewElementsToShrinkLevel ------------------");
	}

	var shrinkElementsIfNecessary = function (operation) {
		//console.log("------------------ shrinkElementsIfNecessary ------------------");
		var sumWidth = 200;
		//console.log("HTML: " + $(equationStack).html());
		$(equationStack).find("*").each(function () {
			if ($(this).attr("type") == "box" || $(this).attr("type") == "filledBox" || $(this).attr("class") == "eexcess_equation_text") {
				//console.log($(this).id + " widht: " + $(this).width());
				sumWidth += $(this).width();
			}
		});

		//Use the variable shrinkLevel
		//console.log("SUM WIDTH: " + sumWidth + " equationStack width " + $(equationStack).width());
		if (sumWidth > ($(equationStack).width())) {
			if ((operation == -1 || operation == 1)) {
				shrinkLevel++;
				$(equationStack).find("*").each(function () {
					//	console.log($(this).attr("id") +" TYPE: " + $(this).attr("type"));
					if ($(this).attr("type") == "box" || $(this).attr("type") == "filledBox") {
						var newWidth = parseInt($(this).width()) / 2;
						var newHeight = parseInt($(this).height()) / 2;
						$(this).css("width", newWidth + "px");
						$(this).css("height", newHeight + "px");
						var fontSize = $(this).css("font-size");
						var oldFontSize = parseInt(fontSize.split("px")[0]);
						var newFontSize = oldFontSize - (oldFontSize / 4);
						$(this).css("font-size", newFontSize + "px");
					} else if ($(this).attr("class") == "eexcess_equation_text") {
						var newHeight = parseInt($(this).height()) / 2;
						$(this).css("height", newHeight + "px");
						$(this).css("line-height", newHeight + "px");
						//console.log("LINE HIGHT: " + $(this).css("line-height"));
					}
					//	$(this).css("line-height", newHeight + "px");
				});
				//console.log("SHRINK ELEMENTS");
				shrinkElementsIfNecessary(1);
			}
		}
		if (sumWidth < ($(equationStack).width())) {
			if (shrinkLevel > 1 && (operation == -1 || operation == 2)) {
				$(equationStack).find("*").each(function () {
					if ($(this).attr("type") == "box" || $(this).attr("type") == "filledBox") {
						var newWidth = parseInt($(this).width()) * 2;
						var newHeight = parseInt($(this).height()) * 2;
						$(this).css("width", newWidth + "px");
						$(this).css("height", newHeight + "px");
						var fontSize = $(this).css("font-size");
						var oldFontSize = parseInt(fontSize.split("px")[0]);
						var newFontSize = (oldFontSize * 100) / (100 - 25);
						$(this).css("font-size", newFontSize + "px");
						//$(this).css("line-height", newHeight + "px");
					} else if ($(this).attr("class") == "eexcess_equation_text") {
						var newHeight = parseInt($(this).height()) * 2;
						$(this).css("height", newHeight + "px");
						$(this).css("line-height", newHeight + "px");
					}
				});
				//console.log("EXTEND ELEMENTS");
				shrinkLevel--;

				shrinkElementsIfNecessary(1);
			}
		}

		//console.log("END ------------------ shrinkElementsIfNecessary ------------------");
	}

	var getNameOfHTMLId = function (htmlId) {
		var name = "";
		$("#" + htmlId).find("#neededText").each(function () {
			if ($(this).parent().attr("innertype") == "metric") {
				name = $(this).html();
			}
		});
		return name;
	}

	var getNameOfId = function (id) {
		var name = "";
		$("#equation" + id).find("#neededText").each(function () {
			if ($(this).parent().attr("innertype") == "metric") {
				name = $(this).html();
			}
		});
		return name;
	}

	equationEditor.addMetric = function (matricName) {

		var allVizs = visController.getAllVizs();
		if (allVizs[matricName] != null) {
			//nameOfLoadedMetric = name;
			equationEditor.mutiLoadHelper(matricName);
			//$(equationStack).html(allVizs[name]);
			//rerank();
		} else {
			alert("ERROR addMetric SHOULD NEVER HAPPEN");
		}

	}

	//EVENTS:
	equationEditor.showMetric = function (id) {
		var name = getNameOfId(id);
		if (name != "") {
			$("#equation" + id).find("#neededText").html()
			console.log("NAME: " + name);
			if (nameOfLoadedMetric != "")
				zoomArray.push(nameOfLoadedMetric);
			equationEditor.resetData();
			var allVizs = visController.getAllVizs();
			if (allVizs[name]) {
				nameOfLoadedMetric = name;
				equationEditor.loadMetric(name, allVizs[name]);
				//$(equationStack).html(allVizs[name]);
				rerank();
			} else {
				alert("ERROR showMetric SHOULD NEVER HAPPEN");
			}
		} else {
			alert("ERROR showMetric SHOULD NEVER HAPPEN2");
		}
	}

	equationEditor.showMore = function () {
		if (zoomArray.length > 0) {
			equationEditor.resetData();
			var name = zoomArray[zoomArray.length - 1];
			var allVizs = visController.getAllVizs();
			if (allVizs[name]) {
				equationEditor.loadMetric(name, allVizs[name]);
			}
			zoomArray.remove(zoomArray.length - 1);
		} else {
			notPossible();
			rerank();
		}
	}

	equationEditor.shiftPressed = function (isShiftPressedPar) {
		if (visController != null) {
			if (isShiftPressed != isShiftPressedPar) {
				if (isShiftPressedPar == false) {
					$(".eexcess_keyword_tag").css("background", "#08519c");
					$(".eexcess_measures_tag").css("background", "#21B571");
					visController.clearSelectedTagsForEquationEditorArray();
				}
				isShiftPressed = isShiftPressedPar;
				//console.log("shift pressed: " + isShiftPressed);
			}
		}
	}

	equationEditor.isShiftPressed = function () {
		return isShiftPressed;
	}

	equationEditor.clickOnEquationStackMain = function () {
		if (isShiftPressed)
			visController.loadTheSelectedCombinationOfMetrics();
	}
	return equationEditor;
}

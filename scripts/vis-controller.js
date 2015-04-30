
var VisController = function () {

	var self = this;

	var width = $(window).width(); // Screen width
	var height = $(window).height(); // Screen height


	// DOM Selectors
	var root = "#eexcess_canvas"; // String to select the area where the visualization should be displayed

	var headerPanel = "#eexcess_header"; // header dom element
	var headerInfoSection = "#eexcess_header_info_section span";
	var headerTaskSection = "#eexcess_header_task_section"; // Section wrapping #items, task, finish and expand/collapse buttons
	var headerControlsSection = "#eexcess_header_control_section";
	var btnShowList = "#eexcess_list_button";
	var btnShowText = "#eexcess_text_button";
	var btnFinished = "#eexcess_finished_button"; // Finishes the task and redirects back to the initial screeen
	var sampleTextSection = "#eexcess_topic_text_section";
	var selectedItemsSection = "#eexcess_selected_items_section"; // Section listing items marked as relevant by the user
	var selectedItemsClass = ".eexcess_selected_item"; // Selected item contained in selectedItemsSection

	var mainPanel = "#eexcess_main_panel"; // Panel containing tag cloug, canvas (in #eexcess_vis) and content list
	var inputCriteria = '.eexcess_vis_controls_input';
	var qmContainer = "#eexcess_qm_container";
	var measuresContainer = "#eexcess_measures_container"; // Selector for div wrapping keyword tags
	var tagClass = ".eexcess_keyword_tag"; // Selector for all keyword tags
	var tagClassMeasures = ".eexcess_measures_tag"; // Selector for all measures tags
	var tagId = "#tag-"; // Id selector for tags in tag container
	var tagPos = "tag-pos-"; // attribute for keyword tags. value assigned = index
	var tagBox = "#eexcess_keywords_box"; // Selector for div where tags are droppped
	var tagClassInBox = ".eexcess_keyword_tag_in_box"; // Selector for keyword tags inside tag box
	var weightSliderClass = ".eexcess_weight_slider"; // Selector for slider class within tags in tag box
	var weightSliderId = "#eexcess_weight_slider_pos-"; // Id selector for slider within tags in tag box
	var tagImgClass = ".eexcess_tag_img"; // Selector for "delete" icon in tags inside tag box
	var btnReset = "#eexcess_btnreset"; // Selector for reset button in vis control panel
	var btnRankByOverall = "#eexcess_btn_sort_by_overall_score"; // Button that triggers ranking by overall score criteria
	var btnRankByMax = "#eexcess_btn_sort_by_max_score"; // Button to rank by max score criteria
	var tagBoxHeight = 1;

	var visPanelCanvas = "#eexcess_vis_panel_canvas";
	var contentPanel = "#eexcess_content"; // Selector for content div on the right side
	var contentList = "#eexcess_content .eexcess_result_list"; // ul element within div content
	var allListItems = "#eexcess_content .eexcess_result_list .eexcess_list"; // String to select all li items by class
	var listItem = "#data-pos-"; // String to select individual li items by id
	var rankingContainerClass = ".eexcess_ranking_container"; // class selector for div wrapping ranking indicators in content list
	var allListItemTitles = ".eexcess_ritem_title";
	var favIconClass = ".eexcess_favicon_section";
	var detailsSections = '.eexcess_item_details_section';

	var documentDetailsTitle = "#eexcess_document_details_title";
	var documentDetailsYear = "#eexcess_document_details_year";
	var documentDetailsLanguage = "#eexcess_document_details_language";
	var documentDetailsProvider = "#eexcess_document_details_provider";
	var documentViewer = '#eexcess_document_viewer';

	// Numeric Constants
	var TAG_CATEGORIES = 5;
	var SELECTED_ITEMS_REQUIRED = 5;

	//  String Constants
	var LOADING_IMG = "media/loading.gif";
	var DELETE_ICON_IMG = "media/fancybox_sprite_close.png";
	var NO_IMG = "media/no-img.png";
	var FAV_ICON_OFF = "media/favicon_off.png";
	var FAV_ICON_ON = "media/favicon_on.png";
	var EDIT_ICON = "media/edit_small.png";
	var REMOVE_SMALL_ICON = "media/batchmaster/remove.png"
		var ICON_EUROPEANA = "media/Europeana-favicon.ico";
	var ICON_MENDELEY = "media/mendeley-favicon.ico";
	var ICON_ZBW = "media/ZBW-favicon.ico";
	var ICON_WISSENMEDIA = "media/wissenmedia-favicon.ico";
	var ICON_KIM_COLLECT = "media/KIM.Collect-favicon.ico";
	var ICON_UNKNOWN = "media/help.png";
	var ARROW_DOWN_ICON = "media/batchmaster/arrow-down.png";
	var ARROW_UP_ICON = "media/batchmaster/arrow-up.png";

	var STR_DROPPED = "Dropped!";
	var STR_DROP_TAGS_HERE = "Drop tags here!";
	var STR_JUST_RANKED = "new";
	var STR_SEARCHING = "Searching...";
	var STR_NO_INDEX = 'no_index';

	// variables from dataset
	var dataset,
	data, // contains the data to be visualized
	keywords,
	measures, // The measures from the wiki articles
	query, // string representing the query that triggered the current recommendations
	sampleText,
	task,
	questions,
	equationEditor; //The equationEditor will be set after data are retrieved

	//Connection to DB for QM Visualization
	var databaseConnector;
	var allVizs = [];
	var allQMTexts = [];
	// Ancillary variables
	var dataRanking, // array that represents the current ranking. Each item is an object specifying "originalIndex, "overallScore", "rankingPos" and "positionsChanged"
	selectedTags = [], // array of DOM elements contained in the tag box
	rankingMode = RANKING_MODE.overall_score,
	showRanking;
	selectedTagsForEquationEditor = [];

	// Ranking object
	var rankingModel;
	var rankingVis;
	var rankingQMVis;

	var dataForPieChart = [];

	//timer
	var timer;
	// Color scales
	var tagColorRange = colorbrewer.Blues[TAG_CATEGORIES + 1];
	tagColorRange.splice(tagColorRange.indexOf("#08519c"), 1, "#2171b5");
	var tagColorScale = d3.scale.ordinal().domain(d3.range(0, TAG_CATEGORIES, 1)).range(tagColorRange);
	var weightColorRange = colorbrewer.Set1[9];
	weightColorRange.splice(weightColorRange.indexOf("#ffff33"), 1, "#ffd700");
	var weightColorScale = d3.scale.ordinal().range(weightColorRange);

	// NLP
	var stemmer = natural.PorterStemmer;
	var nounInflector = new natural.NounInflector();
	stemmer.attach();
	nounInflector.attach();

	// User Evaluations variables
	var taskStorage = new TaskStorage(),
	currentTask,
	currentQuestion,
	startTime,
	taskResults = {
		"timestamp" : "",
		"task-number" : "",
		"dataset-id" : "",
		"description" : "",
		"tool-aided" : "",
		'overall-time' : 0,
		'questions-results' : []
	};

	/////////////////////
	var qmEditorController = null;
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var EVTHANDLER = {};

	EVTHANDLER.canvasResized = function () {
		VISPANEL.resizeRanking();
	};

	////////	Rank button clicked (by overall or max score)	////////

	EVTHANDLER.rankButtonClicked = function (sender) {
		rankingMode = $(sender).attr('sort-by');
		if (rankingModel.getStatus() != RANKING_STATUS.no_ranking)
			LIST.rankRecommendations();
	};

	////////	Reset Button Click	////////

	EVTHANDLER.btnResetClicked = function () {
		TAGCLOUD.clearTagbox();
		TAGCLOUD.buildTagCloud();
		LIST.resetContentList();
		console.log("EVTHANDLER.btnResetClicked");
		VISPANEL.resetRanking();
		DOCPANEL.clear();
	};

	////////	content list item click	////////

	EVTHANDLER.listItemClicked = function (d, i) {
		LIST.selectListItem(i);
	};

	////////	content list item dblclick	////////
	EVTHANDLER.listItemDblclicked = function (d, i) {
		//TODO GO ON HERE
		console.log("listItemDblclicked");
		var actualIndex = rankingModel.getActualIndex(i);
		var currentData = data[actualIndex];
		qmEditorController.setValues(currentData);
		qmEditorController.setShowValues(true);

		openQMEditor();

	};
	////////	list item mouseover	////////
	EVTHANDLER.listItemHovered = function (d, index) {
		LIST.hoverListItem(index);
	};

	////////	list item mouseout	////////
	EVTHANDLER.listItemUnhovered = function (d, index) {
		LIST.unhoverListItem(index);
	};

	////////	Tag in box mouseovered	////////

	EVTHANDLER.tagInBoxMouseOvered = function () {
		d3.select(this)
		.style("background", function (k) {
			return getGradientString("#0066ff", [1, 0.8, 1]);
		})
		.style('border', '1px solid #0066ff')
		.style("color", "white");
	};

	////////	Tag in box mouseouted	////////

	EVTHANDLER.tagInBoxMouseOuted = function () {
		d3.select(this)
		.style("background", function (k) {
			return getGradientString(tagColorScale(k.colorCategory + 1), [1, 0.7, 1]);
		})
		.style('border', function (k) {
			return '1px solid ' + tagColorScale(k.colorCategory + 1);
		})
		.style("color", "#white");
	};

	////////	Delete tag click	////////

	EVTHANDLER.deleteTagClicked = function (tag) {

		console.log("DELETE TAG IN BOX");
		TAGCLOUD.deleteTagInBox(tag);
	};

	////////	Click on tag	////////

	EVTHANDLER.clickOnTag = function (tag) {
		console.log("clickOnTag " + tag.text());
		/*var qmName = tag.text();
		//databaseConnector.getAllQMVizs
		qmEditorController.loadData(allVizs[qmName]);
		qmEditorController.setShowValues(false);
		openQMEditor();*/
	};

	////////	Draggable	////////

	var draggedItem;
	var isOverDroppable;

	EVTHANDLER.dragStarted = function (event, ui) {
		draggedItem = $(this).hide();
		isOverDroppable = false;
	};

	EVTHANDLER.dragStopped = function (event, ui) {
		draggedItem.show();
		if (isOverDroppable) {
			$(this).draggable('destroy');
			var keywordTerm = d3.select(draggedItem[0]).text();
			LIST.rankRecommendations();
		}
	};

	////////	Droppable	////////

	EVTHANDLER.dropped = function (event, ui) {
		TAGCLOUD.dropTagInTagBox(ui.draggable);
		ui.draggable.draggable(BEHAVIOR.draggableOptions);
		isOverDroppable = true;
	};

	////////	Slider	////////

	EVTHANDLER.slideSlided = function (event, ui) {
		TAGCLOUD.changeKeywordInBoxWeight(this, ui);
	};

	EVTHANDLER.slideStopped = function () {
		LIST.rankRecommendations();
	};

	EVTHANDLER.faviconClicked = function (d, i) {
		d3.event.stopPropagation();
		var index = rankingModel.getActualIndex(i);
		HEADER.addItemToListOfSelected(index);
		LIST.switchFaviconOnOrOff(index);
	};

	EVTHANDLER.removeSelectedItemIconClicked = function (event, index) {
		event.stopPropagation();
		HEADER.removeItemFromListOfSelected(index);
		LIST.switchFaviconOnOrOff(index);
	};

	////////	Show List button	////////

	EVTHANDLER.btnListClicked = function (event) {
		event.stopPropagation();
		$(sampleTextSection).slideUp();
		$(selectedItemsSection).slideToggle();
	};

	////////	Show Text button	////////

	EVTHANDLER.btnTextClicked = function (event) {
		event.stopPropagation();
		$(selectedItemsSection).slideUp();
		$(sampleTextSection).slideToggle();
	};

	////////	Finished button	////////

	EVTHANDLER.btnFinishedClicked = function () {
		HEADER.finishQuestion();
	};

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var PREPROCESSING = {};

	PREPROCESSING.extendDataWithAncillaryDetails = function () {

		data.forEach(function (d) {
			d['isSelected'] = false;
			// Assign 'provider-icon' with the provider's icon
			switch (d.facets.provider) {
			case "europeana":
			case "Europeana":
				d['provider-icon'] = ICON_EUROPEANA;
				break;
			case "mendeley":
				d['provider-icon'] = ICON_MENDELEY;
				break;
			case "econbiz":
			case "ZBW":
				d['provider-icon'] = ICON_ZBW;
				break;
			case "wissenmedia":
				d['provider-icon'] = ICON_WISSENMEDIA;
				break;
			case "KIM.Collect":
				d["provider-icon"] = ICON_KIM_COLLECT;
				break;
			default:
				d['provider-icon'] = ICON_UNKNOWN;
				break;
			}
		});
	};

	PREPROCESSING.extendKeywordsWithColorCategory = function () {

		var extent = d3.extent(keywords, function (k) {
				return k['repeated'];
			});
		var range = (extent[1] - 1 /*extent[0]*/
		) * 0.1; // / TAG_CATEGORIES;
		//console.log('extent --> ' + extent[0] + ' - ' + extent[1]);
		//console.log('range = ' + range);
		catArray = [];
		for (var i = 0; i < TAG_CATEGORIES; i++)
			catArray[i] = 0;

		keywords.forEach(function (k) {
			var colorCategory = parseInt((k['repeated'] - 1 /*extent[0]*/
					) / range);
			k['colorCategory'] = (colorCategory < TAG_CATEGORIES) ? colorCategory : TAG_CATEGORIES - 1;
			//  console.log('******* ' + k.term + ' --- repeated = ' + k.repeated + ' --- color category = ' + k.colorCategory);
			catArray[k.colorCategory]++;
		});
		//console.log(catArray);
	};

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var HEADER = {};

	HEADER.internal = {
		validateIsQuestionAnswered : function () {
			var numberOfSelectedItems = $(selectedItemsClass).length;
			if (numberOfSelectedItems < SELECTED_ITEMS_REQUIRED) {
				return confirm("You need to select exactly " + SELECTED_ITEMS_REQUIRED + " items" +
					"\n Items selected = " + numberOfSelectedItems +
					"\n Are you sure you want to finish Question #" + (currentQuestion + 1));
			} else if (numberOfSelectedItems > SELECTED_ITEMS_REQUIRED) {
				alert("You must select exactly " + SELECTED_ITEMS_REQUIRED + " items from the list" +
					"\n Items selected = " + numberOfSelectedItems);
				return false;
			}
			return true;
		}

	};

	HEADER.showInfoInHeader = function () {
		// Display number of results on the left of header
		//$(headerInfoSection).html("Number of Items: " + data.length);

		// Display task on the left of header
		// $(headerTaskSection).find('#p_task').html('TASK: ' + task);
		// $(headerTaskSection).find('#p_question').html(questions[currentQuestion]);

		$(sampleTextSection).find('p').html(sampleText);
	}

	HEADER.addItemToListOfSelected = function (index) {

		if (!data[index].isSelected) {
			var selectedItemContainer = d3.select(selectedItemsSection).append('div')
				.attr('class', 'eexcess_selected_item')
				.attr('original-index', index);

			selectedItemContainer.append('span').text(data[index].title);
			selectedItemContainer.append('img').attr("src", REMOVE_SMALL_ICON);

			$(selectedItemsSection).find("div[original-index='" + index + "']").find('img').click(function (event) {
				EVTHANDLER.removeSelectedItemIconClicked(event, index);
			});
		} else {
			HEADER.removeItemFromListOfSelected(index);
		}
	};

	HEADER.removeItemFromListOfSelected = function (index) {
		$(selectedItemsSection).find("div[original-index='" + index + "']").remove();
	};

	HEADER.clearListOfSelected = function (index) {
		$(selectedItemsSection).empty();
	};

	HEADER.finishQuestion = function () {

		if (HEADER.internal.validateIsQuestionAnswered()) {
			var elapsedTime = parseInt($.now() - startTime);

			var selectedItems = [];
			$(selectedItemsClass).each(function (i, item) {
				var index = $(item).attr('original-index');
				var datumToSave = {
					id : data[index].id,
					title : data[index].title
				};
				selectedItems.push(datumToSave);
			});

			var questionResult = {
				'question-number' : currentQuestion + 1,
				'time' : elapsedTime,
				'selected-items' : selectedItems
			};
			taskResults["questions-results"].push(questionResult);

			currentQuestion++;
			if (currentQuestion < questions.length)
				initializeNextQuestion();
			else {
				taskResults['timestamp'] = new Date().toString();
				taskResults["task-number"] = currentTask;
				taskResults['dataset-id'] = dataset['dataset-id'];
				taskResults['topic'] = dataset['topic'];
				taskResults['total-items'] = dataset['totalResults'];
				taskResults['description'] = dataset['description'];
				taskResults['tool-aided'] = dataset['tool-aided'];

				// calculate overall time
				taskResults["questions-results"].forEach(function (q, i) {
					taskResults['overall-time'] += q.time;
					q.time = q.time.toTime();
				});
				taskResults['overall-time'] = taskResults['overall-time'].toTime();

				console.log(taskResults);
				taskStorage.saveTask(taskResults);
				console.log(JSON.stringify(taskStorage.getEvaluationResults()));
				self.location = "task_completed.html";
			}
		}
	};

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var BEHAVIOR = {};

	BEHAVIOR.draggableOptions = {
		revert : 'invalid',
		helper : 'clone',
		appendTo : tagBox,
		start : EVTHANDLER.dragStarted,
		stop : EVTHANDLER.dragStopped
	};

	BEHAVIOR.droppableOptions = {
		tolerance : 'touch',
		drop : EVTHANDLER.dropped
	};

	BEHAVIOR.sliderOptions = {
		orientation : 'horizontal',
		animate : true,
		range : "min",
		min : 0,
		max : 1,
		step : 0.2,
		value : 1,
		slide : EVTHANDLER.slideSlided,
		stop : EVTHANDLER.slideStopped
	};

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var TAGCLOUD = {};

	/**
	 * Clear tag box when reseting the template
	 * */
	TAGCLOUD.clearTagbox = function () {
		$(tagBox).empty();
		//$('<p></p>').appendTo($(tagBox)).text(STR_DROP_TAGS_HERE);
		selectedTags = [];
		TAGCLOUD.updateTagColor();
	};

	/**
	 * Append one tag per keyword and add drag & drop behavior
	 *
	 * */

	// Array Remove - By John Resig (MIT Licensed)
	Array.prototype.remove = function (from, to) {
		var rest = this.slice((to || from) + 1 || this.length);
		this.length = from < 0 ? this.length + from : from;
		return this.push.apply(this, rest);
	};

	TAGCLOUD.buildTagCloud = function () {
		// Empty tag container
		$(qmContainer).empty();

		/*$("#eexcess_qm_container").append("<div id=\"eexcess_qm_container_rank_button\">\
		<img align=\"right\" width=\"50\" style=\"cursor: pointer\" title=\"rank\" src=\"media/ranking.png\" onclick=\"equationEditor.rankQMs()\" />\
		</div>");*/
		// Append one div per tag
		d3.select(qmContainer).selectAll(tagClass)
		.data(keywords)
		.enter()
		.append("div")
		.attr("class", "eexcess_keyword_tag")
		.attr("id", function (k, i) {
			return "tag-" + i;
		})
		.attr('contenteditable', false)
		.attr('tag-pos', function (k, i) {
			return i;
		})
		.attr('is-selected', false)
		.attr('ImSelected', false)
		.attr('unselectable', "on")
		.attr('onselectstart', "return false")
		.attr('onmousedown', "return false")
		.style("background", "#08519c" /*function (k) {
			return getGradientString(tagColorScale(k.colorCategory + 1), [1, 0.7, 1]);
			}*/
		)
		.style('border', function (k) {
			return '1px solid ' + tagColorScale(k.colorCategory + 1);
		})
		.text(function (k) {
			return k.term;
		})
		//.on("mouseover", EVTHANDLER.tagInBoxMouseOvered)
		//.on("mouseout", EVTHANDLER.tagInBoxMouseOuted)
		.on("click", function (data) {
			if (equationEditor.isShiftPressed() == false) {
				//	console.log("buildTagCloud ON CLICK " + data.term + " " + allVizs[data.term]);
				equationEditor.loadMetric(data.term, allVizs[data.term], true);
				$('#QM_Text').html(allQMTexts[data.term]);
				//	if(equationEditor.getUserMode() == "normal"){
				d3.select(qmContainer).selectAll(tagClass).style("background", "#08519c")
				d3.select(this).style("background", "red");
				//}
			} else {
				//	console.log("HILF: " + d3.select(this).attr("ImSelected"));
				if (d3.select(this).attr("ImSelected") == "true") {
					console.log("IN HERE");
					d3.select(this).attr("ImSelected", false);
					d3.select(this).style("background", "#08519c");
					var indexToDelete = -1;
					for (var i = 0; i < selectedTagsForEquationEditor.length; i++) {
						var tag = selectedTagsForEquationEditor[i];
						if (tag.name == data.term) {
							indexToDelete = i;
						}
					}
					if (indexToDelete != -1) {
						selectedTagsForEquationEditor.remove(indexToDelete);
					}
				} else {
					d3.select(this).attr("ImSelected", true);
					d3.select(this).style("background", "red");
					var object = {
						name : data.term,
						viz : allVizs[data.term],
						type : "metric"
					};
					selectedTagsForEquationEditor.push(object);
				}
			}
		});

		$("#eexcess_qm_container").append("<div id=\"rank_QMs\" style=\"display:none\">\
																																							                        <ul class=\"rank_QMs_list\"></ul>\
																																							                   </div>\
																																											   <div  style=\"display:none\" id=\"eexcess_canvas_rankQM\"></div>");

		d3.select(measuresContainer).selectAll(tagClassMeasures)
		.data(measures)
		.enter()
		.append("div")
		.attr("class", "eexcess_measures_tag")
		.attr("id", function (k, i) {
			return "tag-" + i;
		})
		.attr('tag-pos', function (k, i) {
			return i;
		})
		.attr('contenteditable', false)
		.attr('is-selected', false)
		.attr('ImSelected', false)
		.attr('unselectable', "on")
		.attr('onselectstart', "return false")
		.attr('onmousedown', "return false")
		.style("background", function (k) {
			return '#21B571';
		})
		.style('border', function (k) {
			return '1px solid #21B571';
		})
		.text(function (k) {
			return k.name;
		})
		.on("click", function (data) {
			if (equationEditor.isShiftPressed() == false) {
				equationEditor.fillGap(data)
			} else {
				if (d3.select(this).attr("ImSelected") == "true") {
					d3.select(this).attr("ImSelected", false);
					d3.select(this).style("background", "#21B571");
					var indexToDelete = -1;
					for (var i = 0; i < selectedTagsForEquationEditor.length; i++) {
						var tag = selectedTagsForEquationEditor[i];
						if (tag.name == data.name) {
							indexToDelete = i;
						}
					}
					if (indexToDelete != -1) {
						selectedTagsForEquationEditor.remove(indexToDelete);
					}
				} else {
					d3.select(this).attr("ImSelected", true);
					d3.select(this).style("background", "red");
					var object = {
						name : data.name,
						viz : "",
						type : "measure"
					};
					selectedTagsForEquationEditor.push(object);
				}
			}
		});
		//.on("mouseover", EVTHANDLER.tagInBoxMouseOvered)
		//.on("mouseout", EVTHANDLER.tagInBoxMouseOuted);

		// bind drag behavior to each tag
		//$(tagClass).draggable(BEHAVIOR.draggableOptions);

		// bind droppable behavior to tag box
		//$(tagBox).droppable(BEHAVIOR.droppableOptions);
	};

	TAGCLOUD.dropTagInTagBox = function (tag) {
		// Set tag box legend
		$(tagBox).find('p').remove();

		if (tag.hasClass("eexcess_keyword_tag")) {
			selectedTags.push(tag);
			TAGCLOUD.buildDroppedTag(tag);
		}
	};

	/**
	 * Re-build tag dropped in tag box, add slider and delete icon
	 *
	 * */
	TAGCLOUD.checkHeight = function () {
		// Change Height of eexcess_vis_panel_controls
		var sumWidth = 0;
		$(".eexcess_keyword_tag_in_box").each(function (index) {
			sumWidth += $(this).width();
		});

		var height = $('#eexcess_vis_panel_controls').height();
		if (sumWidth > ($(tagBox).width() * tagBoxHeight)) {
			tagBoxHeight += 1;
			$('#eexcess_vis_panel_controls').css('height', height * tagBoxHeight);
		}
		if (sumWidth < ($(tagBox).width() * (tagBoxHeight - 1))) {
			var help = height / tagBoxHeight;
			tagBoxHeight -= 1;
			$('#eexcess_vis_panel_controls').css('height', height - help);
		}
	}

	TAGCLOUD.buildDroppedTag = function (tag) {
		// Append dragged tag onto tag box
		$(tagBox).append(tag);

		// Change tag's class
		tag.removeClass("eexcess_keyword_tag").addClass("eexcess_keyword_tag_in_box")
		.attr('is-selected', true);

		TAGCLOUD.checkHeight();

		//ADD clickhandler to tag
		tag.dblclick(function () {
			EVTHANDLER.clickOnTag(tag);
		});

		// Append "delete" icon to tag and bind event handler
		$("<img class=\"eexcess_tag_img\" src=\"" + DELETE_ICON_IMG + "\" />").appendTo(tag)
		.click(function () {
			EVTHANDLER.deleteTagClicked(tag);
		});

		/*
		var indexHist = $(".div-histogram").length;
		d3.select(tag[0]).append("div").attr("class", "div-histogram").attr('id', 'histogram-' + indexHist);
		 */

		// Add new div to make it a slider
		$("<div class='div-slider'></div>").appendTo(tag).slider(BEHAVIOR.sliderOptions);

		// Retrieve color in weightColorScale for the corresponding label
		// Create weight slider
		//var label = $(tag).text();
		var stem = d3.select(tag[0]).data()[0].stem;
		var aux = weightColorScale(stem);
		var rgbSequence = hexToR(aux) + ', ' + hexToG(aux) + ', ' + hexToB(aux);

		// Set tag's style
		d3.select(tag[0])
		.style("background", function () {
			return "rgba(" + rgbSequence + ", 1)";
		})
		.style("color", "")
		.style("border", "solid 0.2em " + aux)
		.on("mouseover", "")
		.on("mouseout", "");

		// Reset the draggability
		tag.draggable('destroy');
	};

	/**
	 *	Adjust opacity of the tag when the weightslider is changed
	 *
	 * */
	TAGCLOUD.changeKeywordInBoxWeight = function (keywordSlider, ui) {

		var tag = keywordSlider.parentNode;
		var stem = d3.select(tag).data()[0].stem;
		var aux = weightColorScale(stem);
		var rgbSequence = hexToR(aux) + ', ' + hexToG(aux) + ', ' + hexToB(aux);

		d3.select(tag).style("background", "rgba(" + rgbSequence + "," + ui.value + ")");
	};

	/**
	 *	Actions executed when the event corresponding to deleting a tag in the tag box is triggered, including detaching it from the tag box,
	 *  re-building the tag cloud, updating the "selectedTags" array, which stores the DOM elements for each tag in the box
	 *
	 * */
	TAGCLOUD.deleteTagInBox = function (tag) {
		TAGCLOUD.restoreTagFromBoxToCloud(tag[0]);

		var index = 0;
		while (index < selectedTags.length && tag[0] != selectedTags[index][0])
			index++;
		selectedTags.splice(index, 1);

		// update weightColorScale domain to adjust tag colors
		TAGCLOUD.updateTagColor();

		if (selectedTags.length == 0) {
			//$('<p></p>').appendTo($(tagBox)).text(STR_DROP_TAGS_HERE);
			LIST.resetContentList();
			console.log("TAGCLOUD.deleteTagInBox");
			VISPANEL.resetRanking();
		} else {
			LIST.rankRecommendations();
		}

		TAGCLOUD.checkHeight();
	};

	/**
	 *	Detach tag from tag box and return it to container (tag cloud)
	 *
	 * */
	TAGCLOUD.restoreTagFromBoxToCloud = function (tag) {

		// Remove icon and slider
		$(tag).children().remove();
		// Change class
		$(tag)
		.removeClass("eexcess_keyword_tag_in_box").addClass("eexcess_keyword_tag")
		.attr('is-selected', false);

		// Restore style
		d3.select(tag)
		.style("background", function (k) {
			return getGradientString(tagColorScale(k.colorCategory + 1), [1, 0.7, 1])
		})
		.style('border', function (k) {
			return '1px solid ' + tagColorScale(k.colorCategory + 1);
		})
		.style("color", "white")
		.on("mouseover", EVTHANDLER.tagInBoxMouseOvered)
		.on("mouseout", EVTHANDLER.tagInBoxMouseOuted);

		$(tag).draggable(BEHAVIOR.draggableOptions);
		// Re-append to tag container, in the corresponding postion
		var tagIndex = parseInt($(tag).attr('tag-pos'));
		var i = tagIndex - 1;
		var firstTagIndex = $(qmContainer).find(tagClass + ':eq(0)').attr('tag-pos');
		while (i >= firstTagIndex && $(tagId + '' + i).attr('is-selected').toBool())
			--i;
		// Remove from tag box
		$(tag).detach();
		if (i >= firstTagIndex) // The current tag should be inserted after another (tag-pos == i)
			$(tagId + '' + i).after(tag);
		else // The current tag is inserted in the first position of tag container
			$(qmContainer).prepend(tag);
	};

	TAGCLOUD.updateTagColor = function () {

		// Clear color scale domain
		weightColorScale.domain([]);

		for (var i = 0; i < selectedTags.length; i++) {
			// Reasign keyword to color scale domain
			var stem = d3.select(selectedTags[i][0]).data()[0].stem;
			var aux = weightColorScale(stem);
			var rgbSequence = hexToR(aux) + "," + hexToG(aux) + "," + hexToB(aux);
			var value = $(selectedTags[i][0]).find(".div-slider").slider("value");

			d3.select(selectedTags[i][0])
			.style("background", "rgba(" + rgbSequence + ", " + value + ")")
			.style("border", "solid 0.2em " + aux);
		}
	};

	/**
	 *	Retrieves the selected keywords (in tag box) and the weight assigned by the user
	 *	@return array. Each item is an object containing 'term' and 'weight'
	 * */
	TAGCLOUD.getWeightedKeywordsInBox = function () {

		var weightedKeywords = [];
		$(tagClassInBox).each(function (i, tag) {
			var term = d3.select(tag).data()[0].term;
			var stem = d3.select(tag).data()[0].stem;
			var weight = parseFloat($(tag).find(".div-slider").slider("value"));
			weightedKeywords.push({
				'term' : term,
				'stem' : stem,
				'weight' : weight
			});
		});
		return weightedKeywords;
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	var LIST = {};

	LIST.internal = {

		getFormattedTitle : function (title) {
			if (title.length > 50)
				title = title.substring(0, 46) + '...';
			title = DOCPANEL.internal.highlightKeywordsInText(title, true);
			return title;
		},

		/**
		 *	Calculates the index to scroll to, which depends on the existence or abscence of a ranking
		 *	There exists a ranking if dataRanking.length > 0
		 * */
		getIndexToScroll : function (indices) {
			if (typeof dataRanking === 'undefined' || dataRanking === 'undefined' || dataRanking.length > 0) {
				for (var i = 0; i < dataRanking.length; i++) {
					if (indices.indexOf(dataRanking[i].originalIndex) !== -1)
						return dataRanking[i].originalIndex;
				}
			} else
				return indices[0];
		},

	};

	/**
	 * 	Keeps track of selected recommendation in content list
	 *
	 * */
	LIST.selectededListIndex = STR_NO_INDEX;

	/**
	 *	Function that populates the list on the right side of the screen.
	 *	Each item represents one recommendation contained in the variable "data"
	 *
	 * */
	LIST.buildContentList = function () {

		//d3.selectAll(".eexcess_ritem").remove();
		d3.selectAll(allListItems).remove();

		var content = d3.select(contentList).selectAll("li").data(data);

		var aListItem = content.enter()
			.append("li")
			.attr("class", "eexcess_list")
			.attr("id", function (d, i) {
				return "data-pos-" + i;
			})
			.attr("doc_id", function (d) {
				return d.id
			})
			.attr("pos", function (d, i) {
				return i;
			});

		var rankingDiv = aListItem.append('div')
			.attr("class", "eexcess_ranking_container");

		// div 2 wraps the recommendation title (as a link), a short description and a large description (not used yet)
		var contentDiv = aListItem.append("div")
			.attr("class", "eexcess_ritem_container");

		contentDiv.append("h3")
		.append("a")
		.attr("class", "eexcess_ritem_title")
		.attr('id', function (d, i) {
			return 'item-title-' + i;
		})
		.attr("href", "#")
		//  .on("click", function(d){ window.open(d.uri, '_blank'); })
		.html(function (d) {
			return LIST.internal.getFormattedTitle(d.title);
		});

		// fav icon section on the right
		aListItem.append('div')
		.attr('class', 'eexcess_favicon_section')
		.append("img")
		.attr('title', 'Edit the article')
		.attr("src", EDIT_ICON);

		LIST.updateItemsBackground();
		LIST.bindEventHandlersToListItems();
		$(contentPanel).scrollTo("top");
	};

	LIST.bindEventHandlersToListItems = function () {
		// Event for item clicked
		d3.selectAll(allListItems)
		.on("click", function (d, i) {
			EVTHANDLER.listItemClicked(d, i);
		}).on("dblclick", function (d, i) {
			//EVTHANDLER.listItemDblclicked(d, i);
		})
		.on("mouseover", EVTHANDLER.listItemHovered)
		.on("mouseout", EVTHANDLER.listItemUnhovered)
		.select(favIconClass).select('img').on("click", function (d, i) {
			console.log(JSON.stringify(d));
			var actualIndex = rankingModel.getActualIndex(i);
			var currentData = data[actualIndex];
			window.open('http://localhost/ArticleEditor/index2.php?title=' + currentData.title);
		});
	};

	LIST.unbindEventHandlersToListItems = function () {
		// Event for item clicked
		d3.selectAll(allListItems)
		.on("click", '')
		.on("mouseover", '')
		.on("mouseout", '')
		.select(favIconClass).select('img').on("click", '');
	};

	/**
	 * Wraping function that calls a sequence of methods to create a ranking of recommendations and display it
	 *
	 * */
	LIST.rankRecommendations = function () {

		rankingModel.update(TAGCLOUD.getWeightedKeywordsInBox(), rankingMode);
		this.highlightListItems();
		var status = rankingModel.getStatus();

		// Synchronizes rendering methods
		if (status == RANKING_STATUS.new || status == RANKING_STATUS.update) {
			this.colorKeywordsInTitles();
			this.addRankingPositions();
			this.hideUnrankedItems();
			this.updateItemsBackground();
		}
		LIST.animateContentList(status);
		$(".eexcess_list").css("height", 26 + "px");
		DOCPANEL.clear();
		VISPANEL.drawRanking();
	};

	LIST.rankRecommendationsWithEquation = function (name) {
		//timer.start();
		var tmp = [];
		tmp.push({
			'term' : 'tmp',
			'stem' : 'tmp',
			'weight' : 1
		});

		rankingModel.update(tmp, rankingMode);
		this.highlightListItems();
		var status = rankingModel.getStatus();
		// Synchronizes rendering methods
		if (status == RANKING_STATUS.new || status == RANKING_STATUS.update) {
			this.colorKeywordsInTitles();
			this.addRankingPositions();
			this.hideUnrankedItems();
			this.updateItemsBackground();
		}
		LIST.animateContentList(status);
		$(".eexcess_list").css("height", 26 + "px");
		DOCPANEL.clear();
		VISPANEL.drawRanking();
		//timer.stop();
	};

	LIST.rankRecommendationsWithEquationMulti = function (data, numElements) {

		//timer.start();
		rankingModel.update(data, rankingMode);
		this.highlightListItems();
		var status = rankingModel.getStatus();
		// Synchronizes rendering methods
		if (status == RANKING_STATUS.new || status == RANKING_STATUS.update) {
			this.colorKeywordsInTitles();
			this.addRankingPositions();
			this.hideUnrankedItems();
			this.updateItemsBackground();
		}
		LIST.animateContentList(status);
		$(".eexcess_list").css("height", 26 * numElements + "px");
		DOCPANEL.clear();
		if (showRanking) {
			rankingVis.drawCombination(rankingModel, $(contentPanel).height(), weightColorScale);
			$(visPanelCanvas).scrollTo('top');
		}
		//VISPANEL.drawRanking();
		//timer.stop();
	};
	/**
	 * Appends a yellow circle indicating the ranking position and a colored legend stating #positionsChanged
	 *
	 * */
	LIST.addRankingPositions = function () {

		$(rankingContainerClass).empty();

		rankingModel.getRanking().forEach(function (d, i) {
			if (d.overallScore > 0) {
				var color = d.positionsChanged > 0 ? "rgba(0, 200, 0, 0.8)" : (d.positionsChanged < 0 ? "rgba(250, 0, 0, 0.8)" : "rgba(128, 128, 128, 0.8)");

				var divRanking = d3.select(listItem + "" + d.originalIndex).select(rankingContainerClass);

				divRanking.append("div")
				.attr("class", "eexcess_ranking_pos")
				.text(d.rankingPos);

				divRanking.append("div")
				.attr("class", "eexcess_ranking_posmoved")
				.style("color", function (d) {
					return color;
				})
				.text(function () {
					if (d.positionsChanged == 1000)
						return STR_JUST_RANKED;
					if (d.positionsChanged > 0)
						return "+" + d.positionsChanged;
					if (d.positionsChanged < 0)
						return d.positionsChanged;
					return "=";
				});
			}
		});
	};

	/**
	 * Hide unranked list items
	 *
	 * */
	LIST.hideUnrankedItems = function () {
		rankingModel.getRanking().forEach(function (d) {
			if (d.rankingPos == 0)
				$(listItem + '' + d.originalIndex).css('display', 'none');
			else
				$(listItem + '' + d.originalIndex).css('display', '');
		});
	};

	/**
	 * Stop the list movement and restores default style
	 *
	 * */
	LIST.stopAnimation = function (duration, easing, delay) {
		$(".eexcess_list").stop(true, true);
		LIST.removeShadowEffect();
	};

	LIST.removeShadowEffect = function () {
		$(allListItems)
		.removeClass("eexcess_list_moving_up")
		.removeClass("eexcess_list_moving_down")
		.removeClass("eexcess_list_not_moving");
	};

	/**
	 * Handles the visual effects when the ranking is updated.
	 * Generates accordion-like animation for ranked items and style effects
	 *
	 * */
	LIST.animateContentList = function (action) {

		LIST.stopAnimation();

		var accordionInitialDuration = 500,
		accordionTimeLapse = 50,
		accordionEasing = 'swing',
		resortingDuration = 1500,
		resortingEasing = 'swing',
		unchangedDuration = 1000,
		unchangedEasing = 'linear',
		removeDelay = 3000;

		switch (action) {
		case RANKING_STATUS.new:
			LIST.sortContentList();
			LIST.accordionAnimation(accordionInitialDuration, accordionTimeLapse, accordionEasing);
			break;

		case RANKING_STATUS.update:
			LIST.unbindEventHandlersToListItems();
			LIST.resortListAnimation(resortingDuration, resortingEasing);
			setTimeout(function () {
				LIST.sortContentList();
			}, resortingDuration);
			break;

		case RANKING_STATUS.unchanged:
			LIST.unchangedListAnimation(unchangedDuration, unchangedEasing);
			break;
		case RANKING_STATUS.reset:
			// resort items in original order
			//LIST.stopAnimation();
			break;
		}

		setTimeout(function () {
			LIST.removeShadowEffect();
		}, removeDelay);

	};

	/**
	 * Reorganizes list <li> items according to the calculated ranking
	 *
	 * */
	LIST.sortContentList = function () {

		var liHtml = new Array();

		rankingModel.getRanking().forEach(function (d, i) {
			var current = $(listItem + "" + d.originalIndex);
			current.css('top', 0);
			var outer = $(current).outerHTML();
			liHtml.push(outer);
			current.remove();
		});

		var oldHtml = "";
		for (var j = liHtml.length - 1; j >= 0; j--) {
			$(contentList).html(liHtml[j] + "" + oldHtml);
			oldHtml = $(contentList).html();
		}

		// Re-binds on click event to list item. Removing and re-appending DOM elements destroy the bounds to event handlers
		//d3.selectAll( allListItems ).on("click", EVTHANDLER.listItemClicked);
		LIST.bindEventHandlersToListItems();
		LIST.selectededListIndex = STR_NO_INDEX;
	};

	LIST.accordionAnimation = function (initialDuration, timeLapse, easing) {

		initialDuration = initialDuration || 500;
		timeLapse = timeLapse || 50;
		easing = easing || 'swing';

		rankingModel.getRanking().forEach(function (d, i) {
			var item = $(listItem + "" + d.originalIndex);

			if (d.overallScore > 0) {
				var shift = (i + 1) * 5;
				var duration = initialDuration + timeLapse * i;

				item.addClass("eexcess_list_moving_up");
				item.animate({
					'top' : shift
				}, {
					'complete' : function () {
						$(this).animate({
							"top" : 0
						}, duration, easing);
					}
				});
			}
		});
	};

	/**
	 * IN PROGRESS
	 *
	 * */
	LIST.resortListAnimation = function (duration, easing) {

		duration = duration || 1500;
		easing = easing || 'swing';

		var acumHeight = 0;
		var listTop = $(contentList).position().top;

		rankingModel.getRanking().forEach(function (d, i) {

			if (d.rankingPos > 0) {
				var item = $(listItem + "" + d.originalIndex);
				var itemTop = $(item).position().top;
				var shift = listTop + acumHeight - itemTop;
				var movingClass = (d.positionsChanged > 0) ? "eexcess_list_moving_up" : ((d.positionsChanged < 0) ? "eexcess_list_moving_down" : "");

				item.addClass(movingClass);
				item.animate({
					"top" : '+=' + shift + 'px'
				}, duration, easing);

				acumHeight += $(item).height();
			}
		});
	};

	LIST.unchangedListAnimation = function (duration, easing) {

		duration = duration || 1000;
		easing = easing || 'linear';

		dataRanking.forEach(function (d, i) {

			var item = $(listItem + "" + d.originalIndex);
			var startDelay = i * 30;

			setTimeout(function () {
				item.addClass('eexcess_list_not_moving');
				item.removeClass('eexcess_list_not_moving', duration, easing);
			}, startDelay);
		});
	};

	/**
	 * Description
	 */
	LIST.updateItemsBackground = function () {
		$(allListItems).removeClass('light_background').removeClass('dark_background');

		if (rankingModel.getStatus() != RANKING_STATUS.no_ranking) {
			rankingModel.getRanking().forEach(function (d, i) {
				if (i % 2 == 0)
					$(listItem + d.originalIndex).addClass('light_background');
				else
					$(listItem + d.originalIndex).addClass('dark_background');

			});
		} else {
			$(allListItems).each(function (i, item) {
				if (i % 2 == 0)
					$(item).addClass('light_background');
				else
					$(item).addClass('dark_background');
			});
		}

	};

	/**
	 * Description
	 */
	LIST.colorKeywordsInTitles = function () {

		$(allListItems).each(function (i, item) {
			var pos = parseInt($(item).attr('pos'));
			$(item).find('a').html(LIST.internal.getFormattedTitle(data[pos].title));

		});

	};

	/**
	 * Draws legend color icons in each content list item
	 * */
	LIST.selectListItem = function (i, flagSelectedOutside) {
		LIST.stopAnimation();
		var isSelectedFromOutside = flagSelectedOutside || false;

		// if clickedListIndex is undefined then the item was selected, otherwise it was deselected
		if (i !== LIST.selectededListIndex) {
			LIST.selectededListIndex = i;
			var actualIndex = rankingModel.getActualIndex(i);
			LIST.highlightListItems(actualIndex);
			DOCPANEL.showDocument(actualIndex);
		} else {
			LIST.selectededListIndex = STR_NO_INDEX;
			LIST.highlightListItems();
			DOCPANEL.clear();
		}

		if (!isSelectedFromOutside)
			VISPANEL.selectItemInRanking(i);
	};

	/**
	 *	Function that highlights items on the content list, according to events happening on the visualization.
	 *	E.g. when one or more keywords are selected, the related list items remain highlighted, while the other become translucid
	 *	If no paramters are received, all the list items are restored to the default opacity
	 *
	 * */
	LIST.highlightListItems = function (index) {
		if (typeof index !== 'undefined') {
			$(allListItems).css("opacity", "0.3");
			$(listItem + "" + index).css("opacity", "1");
		} else {
			$(allListItems).css("opacity", "1");
		}
	};

	LIST.hoverListItem = function (index, isExternalCall) {
		$(listItem + '' + rankingModel.getActualIndex(index)).addClass("eexcess_list_hover");
		isExternalCall = isExternalCall || false;
		if (!isExternalCall)
			VISPANEL.hoverItem(index);
	};

	LIST.unhoverListItem = function (index, isExternalCall) {
		$(listItem + '' + rankingModel.getActualIndex(index)).removeClass("eexcess_list_hover");
		isExternalCall = isExternalCall || false;
		if (!isExternalCall)
			VISPANEL.unhoverItem(index);
	};

	/**
	 * Restores content list to its original state
	 *
	 * */
	LIST.resetContentList = function () {

		rankingModel.reset();

		var liHtml = new Array();
		rankingModel.getOriginalData().forEach(function (d, i) {
			var item = $(listItem + "" + i);
			item.css("top", "0");
			item.css("display", "");
			liHtml.push($(item).outerHTML());
			item.remove();
		});

		var oldHtml = "";
		for (var j = liHtml.length - 1; j >= 0; j--) {
			$(contentList).html(liHtml[j] + "" + oldHtml);
			oldHtml = $(contentList).html();
		}
		LIST.bindEventHandlersToListItems();

		// Delete ranking related icons
		$(rankingContainerClass).empty();

		LIST.colorKeywordsInTitles();
		LIST.highlightListItems();
		LIST.updateItemsBackground();
		LIST.animateContentList(RANKING_STATUS.reset);
	};

	LIST.switchFaviconOnOrOff = function (index) {

		data[index].isSelected = !data[index].isSelected;
		var faviconToSwitch = (data[index].isSelected) ? FAV_ICON_ON : FAV_ICON_OFF;

		d3.select(listItem + '' + index).select(favIconClass).select('img')
		.transition().attr("src", faviconToSwitch).duration(2000);
	};

	LIST.clearAllFavicons = function () {
		d3.selectAll(allListItems).select(favIconClass).select('img').attr('src', FAV_ICON_OFF);
	};

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var VISPANEL = {};

	VISPANEL.drawRanking = function () {
		if (showRanking) {
			rankingVis.draw(rankingModel, $(contentPanel).height(), weightColorScale);
			$(visPanelCanvas).scrollTo('top');
		}
	};

	VISPANEL.resetRanking = function () {
		console.log("VISPANEL.resetRanking");
		if (showRanking)
			rankingVis.reset();
	};

	VISPANEL.selectItemInRanking = function (actualIndex) {
		if (showRanking)
			rankingVis.selectItem(actualIndex);
	};

	VISPANEL.hoverItem = function (index) {
		if (showRanking)
			rankingVis.hoverItem(index);
	};

	VISPANEL.unhoverItem = function (index) {
		if (showRanking)
			rankingVis.unhoverItem(index);
	};

	VISPANEL.resizeRanking = function () {
		if (showRanking)
			rankingVis.resize();
	};

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var DOCPANEL = {};

	DOCPANEL.internal = {

		highlightKeywordsInText : function (text, isTitle) {
			var textWithKeywords = isTitle ? '' : '<p>',
			word = "";
			var keywordsInBox = TAGCLOUD.getWeightedKeywordsInBox();
			text.split('').forEach(function (c) {
				if (c.match(/\w/)) {
					word += c;
				} else if (c == '\n') {
					textWithKeywords += '</p><p>'
				} else {
					if (word != '')
						word = DOCPANEL.internal.getStyledWord(word, keywordsInBox);
					textWithKeywords += word + c;
					word = "";
				}
			});
			if (word != "")
				textWithKeywords += this.getStyledWord(word, keywordsInBox);
			if (!isTitle)
				textWithKeywords += '</p>';

			return textWithKeywords;
		},

		getStyledWord : function (word, keywordsInBox) {
			var trickyWords = ['it', 'is', 'us', 'ar'];
			//var wordStem = word.replace(/our$/, 'or').stem();
			var word = word.replace(/our$/, 'or');

			// First clause solves words like 'IT', second clause that the stem of the doc term (or the singularized term) matches the keyword stem
			if (trickyWords.indexOf(word.stem()) == -1 || word.isAllUpperCase()) {
				var kIndex = keywordsInBox.getObjectIndex(function (k) {
						return (k.stem === word.stem() || k.stem === word.singularizeNoun().stem());
					});
				if (kIndex > -1) {
					return "<strong style=\"color:" + weightColorScale(keywordsInBox[kIndex].stem) + "\">" + word + "</strong>";
				}

			}
			return word;
		}

	};

	DOCPANEL.showDocument = function (index) {
		//$(documentDetailsTitle).html(this.internal.highlightKeywordsInText(data[index].title, true));
		//$(documentDetailsYear).html(data[index].articleAge);
		//	console.log(JSON.stringify(data));
		//$(documentDetailsLanguage).html(data[index].facets.language);
		//$(documentDetailsProvider).html(data[index].facets.provider);
		/*	var QMData = "Volatility: " + data[index].Volatility.round(3) + "<br />" +
		"Authority: " + data[index].Authority.round(3) + "<br />" +
		"Complexity: " + data[index].Complexity.round(3) + "<br />" +
		"Informativeness: " + data[index].Informativeness.round(3) + "<br />" +
		"Consistency: " + data[index].Consistency.round(3) + "<br />" +
		"Currency: " + data[index].Currency.round(3) + "<br />" +
		"Completeness: " + data[index].Completeness.round(3);*/
		var currentTitle = data[index].title;

		var pieData = [];
		console.log("DATAFORPIECHART LENGTH:" + dataForPieChart.length);
		for (var i = 0; i < dataForPieChart.length; i++) {
			var currentPieChartData = dataForPieChart[i];
			if (currentPieChartData.title == currentTitle) {
				console.log("in here " + currentPieChartData.name + " " + currentPieChartData.value);
				var pieDataInner = [currentPieChartData.name, currentPieChartData.value];
				pieData.push(pieDataInner);
			}
		}
		console.log("pieDatat length: " + pieData.length);
		$("#chart1").html("");
		if (pieData.length > 0) {
			$("#chart1").css("display", "inline");
			$("#equation_stack_text_of_QM").css("display", "none");
			var plot1 = jQuery.jqplot('chart1', [pieData], {
					seriesDefaults : {
						// Make this a pie chart.
						renderer : jQuery.jqplot.PieRenderer,
						rendererOptions : {
							// Put data labels on the pie slices.
							// By default, labels show the percentage of the slice.
							showDataLabels : true,
							textColor : "black"
						}
					},
					legend : {
						show : true,
						location : 'e',
						textColor : "black"
					}
				});
		}
		$(documentViewer).html("<iframe height=\"" + ($("#eexcess_document_viewer").height() - 10) + "px\" width=\"" + ($("#eexcess_document_viewer").width() - 15) + "px\"src=\"http://en.wikipedia.org/wiki/" + currentTitle + "\" seamless></iframe>");
		//$(documentViewer).html(this.internal.highlightKeywordsInText(QMData));
		$(documentViewer + ' p').hide();
		$(documentViewer + ' p').fadeIn('slow');
		$(documentViewer).scrollTo('top');
	};

	DOCPANEL.clear = function () {
		$(documentDetailsTitle).empty();
		$(documentDetailsYear).empty();
		$(documentDetailsLanguage).empty();
		$(documentDetailsProvider).empty();
		$(documentViewer).empty();
		$("#chart1").empty();
		$("#chart1").css("display", "none");
		$("#equation_stack_text_of_QM").css("display", "inline-flex");
		//$(documentViewer + ' p').fadeOut('slow');
	};

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	function getStaticElementsReady() {
		var offsetTop = $(btnShowList).offset().top + $(btnShowList).height() + 10;
		var offsetLeft = $(selectedItemsSection).parent().offset().left + 10;
		$(selectedItemsSection).width($(headerControlsSection).width() - 20).css("top", offsetTop).css("left", offsetLeft);
		$(sampleTextSection).width($(headerControlsSection).width() - 20).css("top", offsetTop).css("left", offsetLeft);
		$('html').click(function () {
			$(selectedItemsSection).slideUp();
			$(sampleTextSection).slideUp();
		});
		$(selectedItemsSection).click(function (event) {
			event.stopPropagation();
		});
		$(sampleTextSection).click(function (event) {
			event.stopPropagation();
		});

		$(btnReset).click(function () {
			EVTHANDLER.btnResetClicked();
		});
		$(btnRankByOverall).click(function () {
			EVTHANDLER.rankButtonClicked(this);
		});
		$(btnRankByMax).click(function () {
			EVTHANDLER.rankButtonClicked(this);
		});
		$(btnShowList).click(EVTHANDLER.btnListClicked);
		$(btnShowText).click(EVTHANDLER.btnTextClicked);
		$(btnFinished).click(EVTHANDLER.btnFinishedClicked);
		$(window).resize(function () {
			EVTHANDLER.canvasResized();
		});
		$(mainPanel).resize(function () {
			EVTHANDLER.canvasResized();
		});
	}

	function initializeNextQuestion() {

		/*data.forEach(function(d){
		d['isSelected'] = false;
		});*/
		dataRanking = [];
		//if (dataset["tool-aided"] === 'yes') {
		TAGCLOUD.clearTagbox();
		TAGCLOUD.buildTagCloud();
		console.log("initializeNextQuestion");
		VISPANEL.resetRanking();
		//}
		LIST.buildContentList();
		HEADER.clearListOfSelected();
		HEADER.showInfoInHeader();
		DOCPANEL.clear();
		//var minToGo = (currentTask == 0) ? 'X' : (currentQuestion == questions.length - 1) ? 6 : 3;
		/* $('#task_question_message')
		.fadeIn(1)
		.html('<span>Task: #' + currentTask + '</span><span>Question: #' + (currentQuestion + 1) + '</span><span>You have ' +
		minToGo + ' minutes to complete it</span>')
		.dimBackground();


		setTimeout(function(){
		$('#task_question_message').fadeOut('slow');
		$('#task_question_message').undim();
		startTime = $.now();
		}, 2500);*/
	}

	/**
	 * 	Initizialization function self-invoked
	 *
	 * */

	var visController = {};

	visController.updateHeaderInfoSection = function (text) {
		$(headerInfoSection).html(text);
	}

	visController.updatePreparingMessage = function (text) {
		$('#task_question_message')
		.html('<span>' + text + '</span>');
		//TODO GO ON HERE
	}

	visController.showPreparingMessage = function (text) {
		$('#task_question_message')
		.fadeIn(1)
		.html('<span>' + text + '</span>')
		.dimBackground();
	}

	visController.hidePreparingMessage = function () {
		$('#task_question_message').fadeOut('slow');
		$('#task_question_message').undim();
	}

	//FROM EQUATION COMPOSER
	visController.newQMFromEquationComposer = function (name, equation, vizData) {
		var test = '{"stem":"' + name + '","term":"' + name + '","repeated":2,"variations":{"worker":9}}';
		var alreadyInKeywords = false;
		keywords.forEach(function (k) {
			if (k.term == name)
				alreadyInKeywords = true;
		});
		if (!alreadyInKeywords)
			keywords.push(JSON.parse(test));
		allQMTexts[name] = $('#QM_Text').html();
		databaseConnector.storeEquation(name, equation, allQMTexts[name]);
		databaseConnector.storeEquationViz(name, vizData);
		allVizs[name] = vizData;

		rankingModel.newQMFromEquationComposer(name, equation);
		EVTHANDLER.btnResetClicked();
		equationEditor.rerankPublic();
	}

	visController.tmpStoreEquationComposer = function (vizData) {
		allVizs["temp"] = vizData;
	}

	visController.rankWithEquation = function (equation) {
		//EVTHANDLER.btnResetClicked();
		rankingModel.setTempEquation(equation);
		LIST.rankRecommendationsWithEquation();
	}

	visController.rankWithEquationMulti = function (data, numElements) {
		//EVTHANDLER.btnResetClicked();
		rankingModel.setTempEquation("");
		LIST.rankRecommendationsWithEquationMulti(data, numElements);
	}

	visController.loadTheSelectedCombinationOfMetrics = function () {
		console.log("loadTheSelectedCombinationOfMetrics");
		equationEditor.loadACombination(selectedTagsForEquationEditor);
	}

	visController.clearSelectedTagsForEquationEditorArray = function () {
		selectedTagsForEquationEditor.splice(0, selectedTagsForEquationEditor.length);
	}
	visController.setTimer = function (timerPar) {
		timer = timerPar;
		//timer.start();
	}
	visController.highlightElements = function (allElementsArray) {
		d3.select(qmContainer).selectAll(tagClass).each(function () {
			for (var i = 0; i < allElementsArray.length; i++) {
				var element = allElementsArray[i];
				if (d3.select(this).text() == element) {
					d3.select(this).style('border', function (k) {
						return '3px solid red';
					});
				}

			}
		});

		d3.select(measuresContainer).selectAll(tagClassMeasures).each(function () {
			for (var i = 0; i < allElementsArray.length; i++) {
				var element = allElementsArray[i];
				if (d3.select(this).text() == element) {
					d3.select(this).style('border', function (k) {
						return '3px solid red';
					});
				}

			}
		});
	}

	visController.resetHighlighting = function () {
		d3.select(qmContainer).selectAll(tagClass).style('border', function (k) {
			return '1px solid #08519c';
		});
		d3.select(measuresContainer).selectAll(tagClassMeasures).style('border', function (k) {
			return '1px solid #21B571';
		});
	}

	visController.setNormMethod = function (normMethod, p) {
		rankingModel.setNormMethod(normMethod, p);
	}
	visController.setNormMethodRank = function (normMethod, p) {
		rankingModel.setNormMethodRank(normMethod, p);
	}
	visController.deleteWholeQM = function (nameOfQM) {
		//Delete from keywords
		var indexToDelete = -1;
		for (var i = 0; i < keywords.length; i++) {
			if (keywords[i].term == nameOfQM) {
				indexToDelete = i;
			}
		}
		if (indexToDelete != -1)
			keywords.remove(indexToDelete);

		//Delete from allVizs
		indexToDelete = -1;
		for (var i = 0; i < allVizs.length; i++) {
			if (allVizs[i].name == nameOfQM) {
				indexToDelete = i;
			}
		}
		if (indexToDelete != -1)
			allVizs.remove(indexToDelete);

		//Delete from Database
		databaseConnector.delteEquationInclViz(nameOfQM);

		EVTHANDLER.btnResetClicked();
	}

	visController.getKeywords = function () {
		return keywords;
	}

	var calculateEuclidenNormForMeasure = function (_data, measure) {
		console.log("calculateEuclidenNormForMeasure");
		var eNorm = 0;

		for (var r = 0; r < _data.length; r++) { //Iteration over all articles
			var currentData = JSON.parse(_data[r]);
			eNorm += Math.sqrt(currentData[measure] * currentData[measure]) * Math.sqrt(currentData[measure] * currentData[measure]);
		}
		eNorm = Math.sqrt(eNorm);
		return eNorm;
	};
	function SortByScore(a, b) {
		var aScore = a.score;
		var bScore = b.score;
		return ((aScore > bScore) ? -1 : ((aScore < bScore) ? 1 : 0));
	}

	var generateQMRanking = function (qmRankingArray) {
		var allEquations = rankingModel.getEquations();
		//dataForQMRanking /*see rankingQMsData.js*/
		/*for (var r = 0; r < dataForQMRanking.length; r++) {
		console.log("DATA:" + dataForQMRanking[r]);

		}*/
		var allRanks = [];
		var toCheckLength = dataForQMRankingAlreadyEuclideanNormed.length / 2;
		var arrayHelp = [];
		for (var i = 0; i < qmRankingArray.length; i++) {
			var qmRankingArrayInclScores = [];
			var object = {};
			object.QMName = qmRankingArray[i].name;
			console.log("dataForQMRankingAlreadyEuclideanNormed.length: " + dataForQMRankingAlreadyEuclideanNormed.length);
			console.log("dataForQMRanking.length: " + dataForQMRanking.length);
			for (var r = 0; r < dataForQMRankingAlreadyEuclideanNormed.length; r++) {
				var currentData = JSON.parse(dataForQMRankingAlreadyEuclideanNormed[r]);
				var equation = "";
				for (var j = 0; j < allEquations.length; j++) {
					if (allEquations[j].name == qmRankingArray[i].name) {
						equation = allEquations[j].equation;
						break;
					}
				}

				//console.log("THE EQUATION BEFORE: " + equation);
				if (equation != "") {
					var currentTitle = currentData.title;
					for (var key in currentData) {
						if (currentData.hasOwnProperty(key)) {
							//	console.log(key + " -> " + currentData[key]);

							var re = new RegExp(key, "g");
							//Normalize values first
							//var help = currentData[key] / calculateEuclidenNormForMeasure(dataForQMRankingAlreadyEuclideanNormed, key);
							equation = equation.replace(re, currentData[key]);
							//if (key != "title" && key != "featured")
							//	currentData[key] = help;
						}
					}

					//console.log("THE EQUATION AFTER: " + equation);
					var result = math.eval(equation);
					var nObject = {};
					nObject.name = currentData.title;
					nObject.score = result;
					nObject.featured = currentData.featured;
					qmRankingArrayInclScores.push(nObject);

					//arrayHelp.push(JSON.stringify(currentData));

				}
			}
			qmRankingArrayInclScores.sort(SortByScore);
			var rightCounter = 0;

			console.log("qmRankingArrayInclScores.length: " + qmRankingArrayInclScores.length);
			for (var j = 0; j < qmRankingArrayInclScores.length; j++) {
				//console.log("HERE: " +  qmRankingArray[i].name + " "  +  qmRankingArrayInclScores[j].featured + " " + qmRankingArrayInclScores[j].score+  " "+qmRankingArrayInclScores[j].name );
				if (j < toCheckLength - 1) {
					if (qmRankingArrayInclScores[j].featured) {
						rightCounter++;
					}
				}
			}
			rightCounter *= 2;
			//object.data = qmRankingArrayInclScores;
			//allRanks.push(object);
			qmRankingArray[i].score = rightCounter;
			console.log("DONE: " + qmRankingArray[i].name + " Score " + qmRankingArray[i].score);
		}
		//console.log("OUTPUT: " + JSON.stringify(arrayHelp));
	}
	visController.rankQMs = function () {
		console.log("rankQMs VIS CONTROLLER");
		/*																													  <img style=\"cursor: pointer\" width=\"50\" title=\"return\" src=\"media/return.png\" onclick=\"equationEditor.returnFromRankQMs()\" />*/
		$("#eexcess_qm_container").html("<div id=\"eexcess_qm_container_rank_button\">\
															<div id=\"rank_QMs\" style=\"display:none\">\
																																								                        <ul class=\"rank_QMs_list\"></ul>\
																																								                </div>\
																																												<div id=\"eexcess_canvas_rankQM\"></div> \
																																												 \
																																												  </div>");

		var allEquations = rankingModel.getEquations();
		var qmRankingArray = [];
		for (var i = 0; i < keywords.length; i++) {
			var object = {};
			object.name = keywords[i].term;
			object.score = 0;
			qmRankingArray.push(object);
		}
		generateQMRanking(qmRankingArray);
		qmRankingArray.sort(SortByScore);
		for (var i = 0; i < qmRankingArray.length; i++) {
			console.log("qmRankingArray: " + qmRankingArray[i].name + " " + qmRankingArray[i].score);
		}
		var content = d3.select("#rank_QMs .rank_QMs_list").selectAll("li").data(qmRankingArray);

		var aListItem = content.enter()
			.append("li")
			.attr("class", "rank_QMs_list_li")
			.attr("id", function (d, i) {
				return "data-rank-pos-" + i;
			})
			.attr("pos", function (d, i) {
				return i;
			})
			.style("opacity", 1);

		// div 2 wraps the recommendation title (as a link), a short description and a large description (not used yet)
		var contentDiv = aListItem.append("div")
			.attr("class", "rank_QMs_list_ritem_container")
			.on("click", function (d, i) {
				equationEditor.loadMetric(d.name, allVizs[d.name], true);
				$('#QM_Text').html(allQMTexts[data.name]);
			});

		contentDiv.append("h3")
		.append("a")
		.attr("class", "rank_QMs_list_ritem_container")
		.attr('id', function (d, i) {
			return 'item-rank-title-' + i;
		})
		.attr("href", "#")
		//  .on("click", function(d){ window.open(d.uri, '_blank'); })
		.html(function (d) {
			return LIST.internal.getFormattedTitle(d.name);
		});

		$("#rank_QMs").scrollTo("top");

		$("#rank_QMs").css("display", "inline-block");
		qmRankingArray.forEach(function (d, i) {
			console.log("IN HERE " + i);
			if (i % 2 == 0)
				$("#data-rank-pos-" + i)
				.addClass('light_background');
			else
				$("#data-rank-pos-" + i).addClass('dark_background');

		});

		rankingQMVis.draw(qmRankingArray, $("#rank_QMs").height(), weightColorScale, allEquations, dataForQMRanking);
	}

	visController.reloadQMs = function () {
		EVTHANDLER.btnResetClicked();
	}

	visController.resetColorOfQMMetrics = function () {
		d3.select(qmContainer).selectAll(tagClass).style("background", "#08519c");
	}
	//-------------------------------------------------------------------------

	visController.newQM = function (formulas, JSONFormatOfVis) {
		//console.log("newQM: " + JSONFormatOfVis);
		for (var i = 0; i < formulas.length; i++) {
			//console.log("FORMULAS: " + formulas[i]);

			var newTag = formulas[i].split("=")[0];
			var test = '{"stem":"' + newTag + '","term":"' + newTag + '","repeated":2,"variations":{"worker":9}}';
			var alreadyInKeywords = false;
			keywords.forEach(function (k) {
				if (k.term == newTag)
					alreadyInKeywords = true;
			});
			if (!alreadyInKeywords)
				keywords.push(JSON.parse(test));

			//ADD TO DB
			databaseConnector.storeFormula(newTag, formulas[i]);
			databaseConnector.storeVizToQM(newTag, JSONFormatOfVis);

			allVizs[newTag] = JSONFormatOfVis;
			rankingModel.newQM(formulas[i]);

		}
		//EVTHANDLER.btnResetClicked();
	}

	function loadQMformulas(formulas) {
		for (var i = 0; i < formulas.length; i++) {
			//CREATE NEW QM
			var newTag = formulas[i].split("=")[0];
			var test = '{"stem":"' + newTag + '","term":"' + newTag + '","repeated":2,"variations":{"worker":9}}';
			var alreadyInKeywords = false;
			keywords.forEach(function (k) {
				if (k.term == newTag)
					alreadyInKeywords = true;
			});
			if (!alreadyInKeywords)
				keywords.push(JSON.parse(test));

			rankingModel.newQM(formulas[i]);

		}
		//EVTHANDLER.btnResetClicked();
	}
	function retrieveAllFormulas(formulas) {
		if (formulas != "no results") {
			var hformulas = JSON.parse(formulas);
			var test = hformulas.formulas;

			if (test.length > 0)
				loadQMformulas(test);
		}
	}

	function retrieveAllQMVizs(JSONvisualizationsString) {
		if (JSONvisualizationsString != "no results") {
			var visualizations = JSON.parse(JSONvisualizationsString);
			var allQMVizs = visualizations.qmvizs;

			for (var key in allQMVizs) {
				allVizs[key] = allQMVizs[key];
			}
		}
	}

	function loadEquations(equations) {
		for (var i = 0; i < equations.length; i++) {
			//CREATE NEW QM
			var newTag = formulas[i].split("=")[0];
			var test = '{"stem":"' + newTag + '","term":"' + newTag + '","repeated":2,"variations":{"worker":9}}';
			var alreadyInKeywords = false;
			keywords.forEach(function (k) {
				if (k.term == newTag)
					alreadyInKeywords = true;
			});
			if (!alreadyInKeywords)
				keywords.push(JSON.parse(test));

			rankingModel.newQMFromEquationComposer(equations[i]);

		}
		EVTHANDLER.btnResetClicked();
	}

	function retrieveAllEquations(JSONequationsString) {
		/*if (equations != "no results") {
		var hequations = JSON.parse(equations);
		var test = hequations.equations;

		if (test.length > 0)
		loadEquations(test);
		}*/
		//console.log("retrieveAllEquations");
		if (JSONequationsString != "no results") {
			//console.log("retrieveAllEquations2");
			var equations = JSON.parse(JSONequationsString);
			var allEquations = equations.equations;

			for (var key in allEquations) {
				//console.log(key + " : " + allEquations[key]);
				var test = '{"stem":"' + key + '","term":"' + key + '","repeated":2,"variations":{"worker":9}}';
				var alreadyInKeywords = false;
				keywords.forEach(function (k) {
					if (k.term == key)
						alreadyInKeywords = true;
				});
				if (!alreadyInKeywords) {
					//	console.log("ADD TO KEYWORDS");
					keywords.push(JSON.parse(test));
				}

				rankingModel.newQMFromEquationComposer(key, allEquations[key]);
			}
		}
		EVTHANDLER.btnResetClicked();

		//console.log("KEYWORDS: " + JSON.stringify(keywords));
	}

	function retrieveAllEquationizs(JSONvisualizationsString) {
		if (JSONvisualizationsString != "no results") {
			var visualizations = JSON.parse(JSONvisualizationsString);
			var allQMVizs = visualizations.qmvizs;

			for (var key in allQMVizs) {
				allVizs[key] = allQMVizs[key];
			}
		}
	}

	function retrieveAllEquationTexts(JSONTexts) {
		console.log("retrieveAllEquationTexts " + JSONTexts);
		if (JSONTexts != "no results") {
			var texts = JSON.parse(JSONTexts);
			var allQMTextsHelp = texts.equationTexts;

			for (var key in allQMTextsHelp) {
				allQMTexts[key] = allQMTextsHelp[key];
				console.log("KEY: " + key + " TEXT: " + allQMTexts[key]);
			}
		}
	}

	visController.getAllVizs = function () {
		return allVizs;
	}

	visController.setDataForPieChart = function (dataForPieChartPar) {
		dataForPieChart = dataForPieChartPar;
	}

	visController.init = function (articles) {
		//dataset = JSON.parse($("#dataset").text());
		//console.log(JSON.stringify(dataset));

		databaseConnector = new DatabaseConnector();
		//databaseConnector.getAllFormulas(retrieveAllFormulas); TODO
		//databaseConnector.getAllQMVizs(retrieveAllQMVizs);


		data = articles['data']; // contains the data to be visualized
		// query = dataset['query'];				// string representing the query that triggered the current recommendations
		if (qmEditorController == null) {
			qmEditorController = new Controller({
					data : data,
					visController : visController
				});
		} else {
			qmEditorController.setData(data);
		}
		//TODO CHANGE THIS!!!!!
		var IQMetrics = JSON.parse("[{\"stem\":\"Authority\",\"term\":\"Authority\",\"repeated\":29,\"variations\":{\"woman\":127}},{\"stem\":\"Completeness\",\"term\":\"Completeness\",\"repeated\":2,\"variations\":{\"persistence\":4}}, \
																																																																																																																																																																																																{\"stem\":\"role\",\"term\":\"Complexity\",\"repeated\":2,\"variations\":{\"role\":8}},{\"stem\":\"Informativeness\",\"term\":\"Informativeness\",\"repeated\":2,\"variations\":{\"advancement\":6,\"advance\":1}}, \																																{\"stem\":\"Currency\",\"term\":\"Currency\",\"repeated\":2,\"variations\":{\"worker\":9}}]");
		/*var IQMetrics = JSON.parse("[{\"stem\":\"Authority\",\"term\":\"Authority\",\"repeated\":29,\"variations\":{\"woman\":127}},{\"stem\":\"Completeness\",\"term\":\"Completeness\",\"repeated\":2,\"variations\":{\"persistence\":4}}, \{\"stem\":\"role\",\"term\":\"Complexity\",\"repeated\":2,\"variations\":{\"role\":8}},{\"stem\":\"Informativeness\",\"term\":\"Informativeness\",\"repeated\":2,\"variations\":{\"advancement\":6,\"advance\":1}}, \{\"stem\":\"Consistency\",\"term\":\"Consistency\",\"repeated\":2,\"variations\":{\"ideal\":3}},{\"stem\":\"Currency\",\"term\":\"Currency\",\"repeated\":2,\"variations\":{\"worker\":9}}, \{\"stem\":\"Volatility\",\"term\":\"Volatility\",\"repeated\":2,\"variations\":{\"worker\":9}}]");*/
		keywords = IQMetrics; //dataset['keywords'];
		measures = JSON.parse("[{\"name\":\"flesch\"}, {\"name\":\"kincaid\"}, {\"name\":\"numUniqueEditors\"}, {\"name\":\"numEdits\"}, {\"name\":\"externalLinks\"}, {\"name\":\"numRegisteredUserEdits\"},{\"name\":\"numAnonymousUserEdits\"}, {\"name\":\"internalLinks\"},{\"name\":\"articleLength\"}, {\"name\":\"diversity\"}, {\"name\":\"numImages\"}, {\"name\":\"adminEditShare\"}, {\"name\":\"articleAge\"}, {\"name\":\"currency\"}]");
		//console.log("IQMetrics: " + JSON.stringify(keywords));
		//PREPROCESSING.extendKeywordsWithColorCategory();

		databaseConnector.getAllEquations(retrieveAllEquations);
		databaseConnector.getAllEquationTexts(retrieveAllEquationTexts);
		databaseConnector.getEquationViz(retrieveAllEquationizs);
		rankingModel = new RankingModel(data, self);
		rankingVis = new RankingVis(root, self);
		rankingQMVis = new RankingQMVis("#eexcess_canvas_rankQM", self);

		// only for evaluation
		//sampleText = dataset['text'];
		//task = dataset['task'];
		//currentTask = dataset['task-number'];
		//questions = dataset['questions'];
		currentQuestion = 0;
		// only for evaluation

		// HEADER.showInfoInHeader();
		//  LIST.buildContentList();
		getStaticElementsReady();
		// evaluation only
		initializeNextQuestion();

		//if (dataset['tool-aided'] == 'yes') {
		// Initialize template's elements
		//  TAGCLOUD.clearTagbox();
		//  TAGCLOUD.buildTagCloud();
		// VISPANEL.resetRanking();
		showRanking = true;

		/*} else {
		$('#eexcess_main_panel').css('justifyContent', 'center');
		$('#eexcess_controls_left_panel').css('display', 'none');
		$('#eexcess_vis_panel').css('width', '30%');
		$('#eexcess_vis_panel_controls').css('display', 'none');
		$('#eexcess_canvas').css('display', 'none');
		$('#eexcess_vis_panel_canvas').css('height', '100%');
		$(contentPanel).css('float', 'right').css('width', '100%');
		$('#eexcess_document_panel').css('float', '').css('width', '23%').css('marginLeft', '.5em');
		$('#eexcess_selected_items_section').css('boxShadow', '.5em .5em 1em #aaa, -.5em .5em 1em #aaa, .5em .5em 1em #aaa');
		$('#eexcess_topic_text_section').css('boxShadow', '.5em .5em 1em #aaa, -.5em .5em 1em #aaa, .5em .5em 1em #aaa');
		showRanking = false;
		}*/

		equationEditor.dataAvailable();
		$("#eexcess_main_panel").css("display", "inline-flex");
	};

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	///////////// External call triggered by rankingvis

	this.ListItemSelected = function (index) {
		LIST.selectListItem(index, true);
	};

	this.ListItemHovered = function (index) {
		LIST.hoverListItem(index, true);
	};

	this.ListItemUnhovered = function (index) {
		LIST.unhoverListItem(index, true);
	};

	visController.setEquationEditor = function (eE) {
		console.log("equationEditor is set");
		equationEditor = eE;
	}

	return visController;
}

$('#task_question_message').hide();


function RankingQMVis(domRoot, visControllerInterface) {

	var RANKING = {};

	var Vis = visControllerInterface;
	var self = this;
	var root = domRoot;
	var width,
	height,
	margin;
	var x,
	y,
	color,
	xAxis,
	yAxis,
	x0,
	y0;
	var svg;
	var data;
	var histogramIdArray = [];
	var selectedIndex = 'undefined';
	var isRankingDrawn = false;

	var STR_NO_RANKING = "No Ranking Yet!";

	RANKING.Settings = new Settings();

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	RANKING.Evt = {};

	/*RANKING.Evt.itemClicked = function (d, i) {
	RANKING.Render.selectItem(i, false);
	};

	RANKING.Evt.itemMouseOvered = function (d, i) {
	RANKING.Render.hoverItem(i);
	};

	RANKING.Evt.itemMouseOuted = function (d, i) {
	RANKING.Render.unhoverItem(i);
	};*/

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////$/////////////////////////////////////////////////////////////////////

	RANKING.Internal = {};

	/*    RANKING.Internal.topLimit = function( array, rankingCriteria ){
	var attr = (rankingCriteria == 'overall_score') ? 'overallScore' : 'maxScore';

	//var maxScore = d3.max(array, function(d) { return d[attr]; }).toFixed(2);
	var maxScore = array[0][attr];
	return maxScore;
	};*/

	RANKING.Internal.getDistributionData = function (term) {

		var array = [];
		var max = 0;

		data.forEach(function (d) {
			var index = 0;
			while (index < d.weightedKeywords.length && d.weightedKeywords[index].term != term)
				index++;

			//var index = d.facets.keywords.getIndexOf(term, 'term');
			if (index != -1 && d.weightedKeywords[index].weightedScore > max) {
				max = d.weightedKeywords[index].weightedScore;
			}
		});

		var rangeExtent = max / 5;
		var sup = parseFloat(0.1);

		for (var i = 0; i < 5; i++) {
			sup = sup + rangeExtent;
			array[i] = {
				'count' : parseInt(0),
				'supLimit' : sup
			};
		}

		data.forEach(function (d) {
			var index = d.weightedKeywords.getIndexOf(term, 'term');
			if (index != -1 && d.weightedKeywords[index].weightedScore > 0) {
				var j = 0;
				while (j < 5 && d.weightedKeywords[index].weightedScore > array[j]['supLimit']) {
					j++;
				}
				array[j]['count'] = array[j]['count'] + 1;
			}
		});
		return array;
	};

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	RANKING.Render = {};

	/******************************************************************************************************************
	 *
	 *	Draw stacked bars either on draw or update methods. Animate with width transition
	 *
	 * ***************************************************************************************************************/
	RANKING.Render.drawstackedbars = function () {

		svg.selectAll(".stackedbar").data([]).exit();
		svg.selectAll(".stackedbar").remove();
		svg.selectAll(".stackedbar").data(data).enter();

		setTimeout(function () {

			var stackedbars = svg.selectAll(".stackedbar")
				.data(data)
				.enter().append("g")
				.attr("class", "stackedbar")
				.attr("id", function (d, i) {
					return "stackedbar-" + i;
				})
				.attr("transform", function (d, i) {
					return "translate(0, " + y(i) + ")";
				})
				//.on('click', RANKING.Evt.itemClicked)
				//	.on('mouseover', RANKING.Evt.itemMouseOvered)
				//.on('mouseout', RANKING.Evt.itemMouseOuted);

				stackedbars.append('rect')
				.attr('class', function (d, i) {
					if (i % 2 == 0)
						return 'light_background';
					return 'dark_background';
				})
				.style('opacity', 1)
				.attr('x', 0)
				.attr('width', width)
				.attr('height', y.rangeBand());

			stackedbars.selectAll(".bar")
			.data(function (d, i) {
				var array = [];
				array.push(data[i]);
				return array;
			})
			.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("height", y.rangeBand())
			.attr("x", function (d) {
				return x(0);
			})
			.attr("width", function (d, i) {
				return x(d.score);
			})
			.style("fill", function (d) {
				return "#08519c";
			});

			var bars = stackedbars.selectAll(".bar");

			/*var t0 = bars.transition()
			.duration(500)
			.attr({
			"width" : function (d) {
			return x(0.5) - x(0);
			}
			});*/
		}, 800);

	};

	/******************************************************************************************************************
	 *
	 *	Adjust length of title in y-axis. Add position and #positions changed
	 *
	 * ***************************************************************************************************************/
	RANKING.Render.adjustTitlesInYAxis = function () {

		svg.selectAll('.y.axis text')
		.attr("x",  - parseInt(margin.left - 10))
		.style("text-anchor", "start")
		.text(function (text) {
			this.parentNode.appendChild(this);
			var i = data.getIndexOf(text, 'title');
			if (i > -1) {
				var pos = String(data[i]['rankingPos']);
				var posChanged = data[i]['positionsChanged'];
				posChanged = (posChanged == 1000) ? 'N' : ((posChanged > 0) ? ('+' + posChanged) : String(posChanged));
				var title = pos + '. ' + text;
				var maxTextWidth = margin.left - 50;
				var textWidth = $(this).width();
				if (textWidth > maxTextWidth) {
					var lengthRatio = (textWidth / maxTextWidth);
					var lengthAllowed = parseInt(title.length / lengthRatio) - posChanged.length - 6;
					title = title.substring(0, lengthAllowed) + " ...";
				}
				return title + ' (' + posChanged + ')';
			}
			return "";
		})
		.style('fill', function (text) {
			var i = data.getIndexOf(text, 'title');
			if (i > -1) {
				var posChanged = data[i]['positionsChanged'];
				if (posChanged > 0)
					return 'green';
				if (posChanged < 0)
					return 'red';
				return 'black';
			}
			return 'black';
		});

		svg.selectAll('.y.axis text')
		.transition().duration(10000)
		.style('fill', 'black')
		.delay(4000);
	};

	/******************************************************************************************************************
	 *
	 *	Create drop shadow for click effect on bars
	 *
	 * ***************************************************************************************************************/
	RANKING.Render.createShadow = function () {

		// filters go in defs element
		var defs = svg.append("defs");

		// create filter with id #drop-shadow
		// height=130% so that the shadow is not clipped
		var filter = defs.append("filter")
			.attr("id", "drop-shadow")
			.attr("height", "130%");

		// SourceAlpha refers to opacity of graphic that this filter will be applied to
		// convolve that with a Gaussian with standard deviation 3 and store result
		// in blur
		filter.append("feGaussianBlur")
		.attr("in", "SourceAlpha")
		.attr("stdDeviation", 2)
		.attr("result", "blur");

		// translate output of Gaussian blur to the right and downwards with 2px
		// store result in offsetBlur
		filter.append("feOffset")
		.attr("in", "blur")
		.attr("dx", 0)
		.attr("dy", 2)
		.attr("result", "offsetBlur");

		// overlay original SourceGraphic over translated blurred opacity by using
		// feMerge filter. Order of specifying inputs is important!
		var feMerge = filter.append("feMerge");

		feMerge.append("feMergeNode")
		.attr("in", "offsetBlur")
		feMerge.append("feMergeNode")
		.attr("in", "SourceGraphic");
	};

	var normData = function () {
		//console.log("calculateMaxNormForMeasure");
		/*var eNorm = 0;
		data.forEach(function (d, i) { //Iteration over all articles
			eNorm += Math.sqrt(d.score * d.score) * Math.sqrt(d.score * d.score);
		});
		eNorm = Math.sqrt(eNorm);*/
		
		data.forEach(function (d, i) {
			d.score = d.score / dataForQMRankingAlreadyEuclideanNormed.length;
		});
	}

	/******************************************************************************************************************
	 *
	 *	Draw ranking at first instance
	 *
	 * ***************************************************************************************************************/
	RANKING.Render.draw = function (_data, containerHeight, colorScale, allEquations, dataForQMRanking) {

		$(root).empty();

		selectedIndex = 'undefined';
		isRankingDrawn = true;

		/******************************************************
		 *	Define input variables
		 ******************************************************/

		data = _data;
		normData();
		data.forEach(function (d, i) {
			//console.log("draw: " + d.name + " " + d.score);
		});
		/******************************************************
		 *	Define canvas dimensions
		 ******************************************************/
		RANKING.Dimensions = RANKING.Settings.getRankingDimensions(domRoot, containerHeight);
		width = RANKING.Dimensions.width;
		height = RANKING.Dimensions.height;
		margin = RANKING.Dimensions.margin;

		/******************************************************
		 *	Define scales
		 ******************************************************/

		x = d3.scale.linear()
			//.domain( [0, RANKING.Internal.topLimit(data, rankingCriteria)] )
			//.domain( [0, data[0][rankingModel.getMode()]] )
			.domain([0, 1])
			.rangeRound([0, width]);

		y = d3.scale.ordinal()
			.domain(data.map(function (d, i) {
					return i;
				}))
			.rangeBands([0, height], .02);

		color = colorScale;

		/******************************************************
		 *	Define axis' function
		 *****************************************************/

		// X Axis
		xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			//.tickFormat(d3.format(".2s"));
			.tickFormat(function (value) {
				if (value > 0 && value < 1)
					return (value * 100) + '%';
				return '';
			});

		// Y Axis
		yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.tickValues("");

		/******************************************************
		 *	Draw chart main components
		 ******************************************************/

		//// Add svg main components
		svg = d3.select(root).append("svg")
			.attr("class", "svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom + 30)
			.append("g")
			.attr("width", width)
			.attr("height", height + 30)
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + (height) + ")")
		.call(xAxis)
		.append("text")
		.attr("class", "label")
		.attr("x", width)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text(function () {
			return "Overall Score";
		});

		/*        svg.selectAll('.x.axis text')
		.text(function(text){
		if(parseFloat(text) == 0.0) return ""; return text;
		});*/

		svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.selectAll("text")
		/*.style('cursor', 'pointer')
		.on('click', function(d, i){
		var actualIndex = data.getIndexOf(d, 'title');
		RANKING.Evt.itemClicked(actualIndex);
		})*/
	;

		//// Create drop shadow to use as filter when a bar is hovered or selected
		//RANKING.Render.createShadow();
		//// Add stacked bars
		RANKING.Render.drawstackedbars();
		//// Adjust length of title in y-axis. Add position and #positions changed
		//RANKING.Render.adjustTitlesInYAxis();
	};

	/******************************************************************************************************************
	 *
	 *	Redraw updated ranking and animate with transitions to depict changes
	 *
	 * ***************************************************************************************************************/
	RANKING.Render.update = function (rankingModel, containerHeight, colorScale) {

		if (rankingModel.getStatus() === RANKING_STATUS.no_ranking) {
			return this.reset();
		}

		selectedIndex = 'undefined';

		/******************************************************
		 *	Define input variables
		 ******************************************************/
		RANKING.InitData = RANKING.Settings.getRankingInitData(rankingModel);
		data = RANKING.InitData.data;

		RANKING.Render.updateCanvasDimensions();

		/******************************************************
		 *	Redefine x & y scales' domain
		 ******************************************************/

		//x0 = x.domain([0, data[0][rankingModel.getMode()]]).copy();
		x0 = x.domain([0, 1]).copy();

		y.rangeBands([0, height], .02);
		y0 = y.domain(data.map(function (d, i) {
					return i;
				})).copy();

		color = colorScale;

		svg.select('.x.axis .label')
		.text(function () {
			if (rankingModel.getMode() === RANKING_MODE.overall_score)
				return "Overall Score";
			return 'Max. Score';
		});

		var transition = svg.transition().duration(750),
		delay = function (d, i) {
			return i * 50;
		};

		transition.select(".x.axis")
		.call(xAxis)
		.selectAll("g")
		.delay(delay);

		/*        svg.selectAll('.x.axis text')
		.text(function(text){
		//if(parseFloat(text) == 0.0) return ""; return text;
		//console.log((parseFloat(text) * 100) + '%');
		this.parentNode.appendChild(this);
		return (parseFloat(text) * 100) + '%';
		});*/

		transition.select(".y.axis")
		.call(yAxis)
		.selectAll("g")
		.delay(delay)
		/*.selectAll("text")
		.attr("x", - parseInt(margin.left - 10))
		.style("text-anchor", "start")
		.style("font-weight", "normal");
		 */
		RANKING.Render.drawstackedbars();
		//      RANKING.Render.adjustTitlesInYAxis();

	};

	/******************************************************************************************************************
	 *
	 *	Adjust height of svg and other elements when the ranking changes
	 *
	 * ***************************************************************************************************************/

	RANKING.Render.updateCanvasDimensions = function () {

		/******************************************************
		 *	Recalculate canvas dimensions
		 ******************************************************/
		RANKING.Dimensions = RANKING.Settings.getRankingDimensions(domRoot, containerHeight);
		height = RANKING.Dimensions.height;

		y.rangeBands(height, .02);

		d3.select(svg.node().parentNode)
		.attr('height', height + margin.top + margin.bottom + 30);

		svg.attr("height", height + 30)
		.attr("transform", "translate(" + (margin.left) + ", 0)");

		// update axes
		svg.select('.x.axis').attr("transform", "translate(0," + (height) + ")").call(xAxis.orient('bottom'));

	}

	/******************************************************************************************************************
	 *
	 *	Redraw without animating when the container's size changes
	 *
	 * ***************************************************************************************************************/
	RANKING.Render.resize = function (containerHeight) {
		/******************************************************
		 *	Recalculate canvas dimensions
		 ******************************************************/
		RANKING.Dimensions = RANKING.Settings.getRankingDimensions(domRoot);
		width = RANKING.Dimensions.width;
		//    height         = RANKING.Dimensions.height;
		margin = RANKING.Dimensions.margin;

		x.rangeRound([0, width]);
		y.rangeBands(height, .02);

		d3.select(svg.node().parentNode).attr('width', width + margin.left + margin.right);
		svg.attr("width", width);

		// update x-axis
		svg.select('.x.axis').call(xAxis.orient('bottom'));

		// Update bars
		svg.selectAll(".stackedbar").attr('width', width);
		svg.selectAll("rect.light_background").attr('width', width);
		svg.selectAll("rect.dark_background").attr('width', width);

		svg.selectAll(".bar")
		.attr("x", function (d) {
			if (d.x0 != undefined)
				return x(d.x0);
			else
				return d3.select(this).attr("x");
		})
		.attr("width", function (d) {
			if (d.x0 != undefined && d.x1 != undefined)
				return x(d.x1) - x(d.x0);
			else
				return d3.select(this).attr("width");
		});
	};

	/******************************************************************************************************************
	 *
	 *	Reset by clearing canvas and display message
	 *
	 * ***************************************************************************************************************/
	RANKING.Render.reset = function () {
		isRankingDrawn = false;
		selectedIndex = 'undefined';

		var $root = $(root);
		$root.empty();
		$("<p class='message'></p>").appendTo($root).text(STR_NO_RANKING);
	};

	/******************************************************************************************************************
	 *
	 *	Draw a small histogram inside the selected tag for the spcified term
	 *
	 * ***************************************************************************************************************/
	RANKING.Render.drawHistograms = function (array) {

		histogramIdArray = array;

		var length = histogramIdArray.length;

		var widthH = $('#' + histogramIdArray[0]).width();
		var heightH = $('#' + histogramIdArray[0]).height();

		// Remove previous histogram to avoid multiplying the svg elements
		var removed = d3.selectAll('.svgHistogram').remove();

		histogramIdArray.forEach(function (histogramId) {

			var $histogramDiv = $('#' + histogramId);
			var histogramWrapper = d3.select($histogramDiv[0]);
			var term = histogramWrapper.data()[0]['term'];

			// Retrieve distribution data for current term
			var distributionData = RANKING.Internal.getDistributionData(term);

			// Define scales
			var xH = d3.scale.ordinal()
				.domain(distributionData.map(function (d) {
						return d['supLimit'];
					}))
				.rangeBands([0, widthH], .1);

			var yH = d3.scale.linear()
				.domain([0, d3.max(distributionData, function (d) {
							return d['count'];
						})])
				.range([heightH, 0]);

			// Define axis functions
			var xAxisH = d3.svg.axis()
				.scale(xH)
				.orient("bottom")
				.tickFormat('');

			var yAxisH = d3.svg.axis()
				.scale(yH)
				.orient("left")
				.tickFormat('');

			// Append svg main component
			var svgHistogram = histogramWrapper.append("svg")
				.attr("class", "svgHistogram")
				.attr("width", widthH)
				.attr("height", heightH);

			// Append axis svg components
			svgHistogram.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + heightH + ")")
			.call(xAxisH);

			svgHistogram.append("g")
			.attr("class", "y axis")
			.call(yAxisH);

			svgHistogram.selectAll('.barHistogram').remove();

			// Draw bars
			svgHistogram.selectAll('.barHistogram')
			.data(distributionData).enter()
			.append('rect')
			.attr("class", "barHistogram")
			.attr("x", function (d) {
				return xH(d['supLimit']);
			})
			.attr("width", xH.rangeBand())
			.attr("height", function (d) {
				return heightH - yH(d['count']);
			})
			.attr("y", function (d) {
				return yH(d['count']);
			})
			.style("fill", 'grey');
		});
	};

	/******************************************************************************************************************
	 *
	 *	Highlight stacked bar and corresponding item in recommendatitle in y axis, tion list
	 *	Show rich tooltip
	 *   @param {integer} itemIndex: index of selected item
	 *   @param {boolean} isSelectedFromOutside: true means that the call came from Vis object, otherwise it was invoked internally by clicking on a y-axis tick or stacked bar
	 *
	 * ***************************************************************************************************************/
	RANKING.Render.selectItem = function (itemIndex, isSelectedFromOutside) {

		if (itemIndex != selectedIndex) { // select
			selectedIndex = itemIndex;
			svg.selectAll('.stackedbar').style('opacity', function (d, i) {
				if (i == itemIndex)
					return 1;
				return 0.3;
			});
		} else { // deselect
			selectedIndex = 'undefined';
			svg.selectAll('.stackedbar').style('opacity', 1);
		}

		if (!isSelectedFromOutside)
			Vis.ListItemSelected(itemIndex);
	};

	RANKING.Render.hoverItem = function (index, isExternalCall) {

		svg.select("#stackedbar-" + index).selectAll('.bar')
		.attr('transform', 'translate(0, 0)')
		.style('filter', 'url(#drop-shadow)');

		isExternalCall = isExternalCall || false;
		if (!isExternalCall)
			Vis.ListItemHovered(index);
	};

	RANKING.Render.unhoverItem = function (index, isExternalCall) {

		svg.select("#stackedbar-" + index).selectAll('.bar')
		.attr('transform', 'translate(0, 0.2)')
		.style('filter', '');

		isExternalCall = isExternalCall || false;
		if (!isExternalCall)
			Vis.ListItemUnhovered(index);
	};

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	RANKING.Ext = {
		'drawCombination' : function (rankingModel, containerHeight, colorScale) {
			RANKING.Render.drawCombination(rankingModel, containerHeight, colorScale);
		},
		'draw' : function (data, containerHeight, colorScale, allEquations, dataForQMRanking) { // rankingModel, colorScale, rankingCriteria, status
			//if (status = 'new')
			RANKING.Render.draw(data, containerHeight, colorScale);
			//else if (status = 'update')
			//	RANKING.Render.update(containerHeight, colorScale);
		},
		'reset' : function () {
			RANKING.Render.reset();
		},
		'resize' : function (containerHeight) {
			if (isRankingDrawn)
				RANKING.Render.resize(containerHeight);
		},
		'drawHistograms' : function (divArray) {
			RANKING.Render.drawHistograms(divArray);
		},
		'selectItem' : function (itemIndex) {
			if (isRankingDrawn)
				RANKING.Render.selectItem(itemIndex, true);
		},
		'hoverItem' : function (index) {
			if (isRankingDrawn)
				RANKING.Render.hoverItem(index, true);
		},
		'unhoverItem' : function (index) {
			if (isRankingDrawn)
				RANKING.Render.unhoverItem(index, true);
		}
	};

	return RANKING.Ext;
}

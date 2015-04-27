
var RankingModel = (function () {

	function RankingModel(data, visController) {
		this.ranking = new RankingArray();
		this.previousRanking = new RankingArray();
		this.formulas = [];
		this.equations = [];
		this.data = data;
		this.status = RANKING_STATUS.no_ranking;
		this.mode = RANKING_MODE.overall_score;
		this.tmpEquation = "";
		this.visController = visController;
		this.normMethod = "default";
		this.p = 0;
		this.normMethodRank = "euclidean";
		this.pRank = 0;
	}

	/**
	 *	Creates the ranking items with default values and calculates the weighted score for each selected keyword (tags in tag box)
	 *
	 * */
	var calculateNormRank = function (_data, query, _normMethod, _p) {
		var norms;
		console.log("calculateNormRank: " + _normMethod);
		if (_normMethod == "default")
			norms = calculateDefaultNormForEachQM(_data, query);
		else if (_normMethod == "euclidean")
			norms = calculateEuclidenNormForEachQM(_data, query);
		else if (_normMethod == "pNorm")
			norms = calculatePNormForEachQM(_data, query, _p);
		else if (_normMethod == "maxNorm")
			norms = calculateMaxNormForEachQM(_data, query);
		return norms;
	}

	var computeScores = function (_data, query, _normMethodRank, _pRank) {
		console.log("computeScores");
		var ranking = new RankingArray();
		var norms = calculateNormRank(_data, query, _normMethodRank, _pRank);
		//var norms = calculateEuclidenNormForEachQM(_data, query);
		//var norms = calculateDefaultNormForEachQM(_data, query);

		//console.log("NORMS: " + JSON.stringify(norms));
		_data.forEach(function (d, i) { //Iteration over all articles
			ranking.addEmptyElement();
			//var docNorm = getEuclidenNorm(d.keywords);
			var unitQueryVectorDot = parseFloat(1.00 / Math.sqrt(query.length));
			var max = 0;
			query.forEach(function (q) { //Iteration over each QM
				//
				// termScore = tf-idf(d, t) * unitQueryVector(t) * weight(query term) / |d|   ---    |d| = euclidenNormalization(d)
				//var termScore = (d.keywords[q.stem]) ? ((parseFloat(d.keywords[q.stem]) / docNorm) * unitQueryVectorDot * parseFloat(q.weight)).round(3) :  0;

				// if item doesn't contain query term => maxScore and overallScore are not changed
				//ranking[i].overallScore += termScore;
				console.log("Q.weight: " + parseFloat(q.weight));
				var QMscore = (parseFloat(d[q.term] / norms[q.term]) * unitQueryVectorDot).round(3);

				//var QMscore = (parseFloat(d[q.term] / norms[q.term]) * parseFloat(q.weight) * unitQueryVectorDot).round(3);
				console.log("name: " + q.term + " score: " + QMscore);
				if (QMscore < 0)
					QMscore = 0;
				ranking[i].overallScore += QMscore;
				ranking[i].maxScore = QMscore > ranking[i].maxScore ? QMscore : ranking[i].maxScore;
				ranking[i].weightedKeywords.push({
					term : q.term,
					stem : q.stem,
					weightedScore : QMscore
				});

			});
		});
		return ranking;
	};
	var calculateDefaultNormForEachQM = function (_data, query) {
		console.log("calculateDefaultNormForEachQM");
		var acumSquares = {};
		_data.forEach(function (d, i) { //Iteration over all articles
			query.forEach(function (q) { //Iteration over each QM
				if (acumSquares.hasOwnProperty(q.term)) {
					acumSquares[q.term] += Math.sqrt(d[q.term] * d[q.term]);
				} else {
					acumSquares[q.term] = Math.sqrt(d[q.term] * d[q.term]);
				}
			});
		});

		//console.log("ACUMSQUARES: " + JSON.stringify(acumSquares));
		return acumSquares;
	};

	var calculateEuclidenNormForEachQM = function (_data, query) {
		console.log("calculateEuclidenNormForEachQM");
		var acumSquares = {};
		_data.forEach(function (d, i) { //Iteration over all articles
			query.forEach(function (q) { //Iteration over each QM
				if (acumSquares.hasOwnProperty(q.term)) {
					acumSquares[q.term] += Math.pow(Math.sqrt(d[q.term] * d[q.term]), 2);
				} else {
					acumSquares[q.term] = Math.pow(Math.sqrt(d[q.term] * d[q.term]), 2);
				}
			});
		});

		query.forEach(function (q) {
			acumSquares[q.term] = Math.sqrt(acumSquares[q.term]);
		});
		//console.log("ACUMSQUARES: " + JSON.stringify(acumSquares));
		return acumSquares;
	};

	var calculatePNormForEachQM = function (_data, query, _p) {
		console.log("calculatePNormForEachQM");
		var acumSquares = {};
		_data.forEach(function (d, i) { //Iteration over all articles
			query.forEach(function (q) { //Iteration over each QM
				if (acumSquares.hasOwnProperty(q.term)) {
					acumSquares[q.term] += Math.pow(Math.sqrt(d[q.term] * d[q.term]), _p);
				} else {
					acumSquares[q.term] = Math.pow(Math.sqrt(d[q.term] * d[q.term]), _p);
				}
			});
		});

		query.forEach(function (q) {
			acumSquares[q.term] = Math.pow(acumSquares[q.term], 1 / _p);
		});
		//console.log("ACUMSQUARES: " + JSON.stringify(acumSquares));
		return acumSquares;
	};

	var calculateMaxNormForEachQM = function (_data, query) {
		console.log("calculateMaxNormForEachQM");
		var acumSquares = {};
		_data.forEach(function (d, i) { //Iteration over all articles
			query.forEach(function (q) { //Iteration over each QM
				if (acumSquares.hasOwnProperty(q.term)) {
					if (Math.sqrt(d[q.term] * d[q.term]) > acumSquares[q.term])
						acumSquares[q.term] = Math.sqrt(d[q.term] * d[q.term]);
				} else {
						acumSquares[q.term] = Math.sqrt(d[q.term] * d[q.term]);
				}
			});
		});
		//console.log("ACUMSQUARES: " + JSON.stringify(acumSquares));
		return acumSquares;
	};

	var getEuclidenNorm = function (docKeywords) {

		var acumSquares = 0;
		Object.keys(docKeywords).forEach(function (k) {
			acumSquares += docKeywords[k] * docKeywords[k];
		});
		return Math.sqrt(acumSquares);
	};

	var updateStatus = function (_ranking, _previousRanking) {

		if (_ranking.length == 0)
			return RANKING_STATUS.no_ranking;

		if (_previousRanking.length == 0)
			return RANKING_STATUS.new;

		if (_ranking.length != _previousRanking.length)
			return RANKING_STATUS.update;

		for (var r in _ranking) {
			var indexInPrevious = _previousRanking.getObjectIndex(function (element) {
					element.originalIndex === r.originalIndex
				});
			if (indexInPrevious == -1 || r.rankingPos !== _previousRanking[indexInPrevious].rankingPos)
				return RANKING_STATUS.update;
		}

		return RANKING_STATUS.unchanged;
	};

	var calculateQMs = function (_data, _formulas) {
		for (var j = 0; j < _formulas.length; j++) {
			var wholeFormula = _formulas[j].split("=");
			var QMName = wholeFormula[0];
			var items = wholeFormula[1].split(",");
			_data.forEach(function (d, i) {
				//TODO CALCULATION IS WRONG IF MULT OR DIV GET USED!
				var result = 0;
				for (var i = 0; i < items.length; i++) {
					var wholeItem = items[i].split("|");
					var operation = wholeItem[0];
					var weight = parseFloat(wholeItem[1]);
					var parameterName = wholeItem[2];
					if (parameterName != undefined) {
						//console.log("PARAMETERNAME: " + parameterName + " VALUE: " + d[parameterName]);
						if (operation == '+')
							result += (weight * d[parameterName]);
						else if (operation == '-')
							result -= (weight * d[parameterName]);
						else if (operation == '*')
							result *= (weight * d[parameterName]);
						else if (operation == '/')
							result /= (weight * d[parameterName]);
					}
				}
				d[QMName] = result;
				//console.log("ONE SET: " + JSON.stringify(d));
			});
		}
	};
	var calculateDefaultNormForMeasure = function (_data, measure) {
		console.log("calculateDefaultNormForMeasure");
		var norm = 0;
		_data.forEach(function (d, i) { //Iteration over all articles
			norm += Math.sqrt(d[measure] * d[measure]);
		});
		return norm;
	};

	var calculateEuclidenNormForMeasure = function (_data, measure) {
		console.log("calculateEuclidenNormForMeasure");
		var eNorm = 0;
		_data.forEach(function (d, i) { //Iteration over all articles
			eNorm += Math.sqrt(d[measure] * d[measure]) * Math.sqrt(d[measure] * d[measure]);
		});
		eNorm = Math.sqrt(eNorm);
		return eNorm;
	};

	var calculatePNormForMeasure = function (_data, measure, p) {
		console.log("calculatePNormForMeasure");
		var pNorm = 0;
		_data.forEach(function (d, i) { //Iteration over all articles
			pNorm += Math.pow(Math.sqrt(d[measure] * d[measure]), p);
		});
		pNorm = Math.pow(pNorm, 1 / p);
		return pNorm;
	};

	var calculateMaxNormForMeasure = function (_data, measure) {
		console.log("calculateMaxNormForMeasure");
		var mNorm = 0;
		_data.forEach(function (d, i) { //Iteration over all articles
			var help = Math.sqrt(d[measure] * d[measure]);
			if (help > mNorm)
				mNorm = help;
		});
		return mNorm;
	};
	var calculateNorm = function (d, key, _data, _normMethod, _p) {
		var help = 0;
		if (_normMethod == "default")
			help = d[key] / calculateDefaultNormForMeasure(_data, key);
		else if (_normMethod == "euclidean")
			help = d[key] / calculateEuclidenNormForMeasure(_data, key);
		else if (_normMethod == "pNorm")
			help = d[key] / calculatePNormForMeasure(_data, key, _p);
		else if (_normMethod == "maxNorm")
			help = d[key] / calculateMaxNormForMeasure(_data, key);
		else if (_normMethod == "noNorm")
			help = d[key];
		return help;
	}
	var calculateQMsWithEquations = function (_data, _equations, _tmpEquation, _normMethod, _p) {
		var dataForPieChart = [];
		if (_tmpEquation == "") {
			for (var j = 0; j < _equations.length; j++) {
				//console.log("DATA: " + JSON.stringify(_data));

				_data.forEach(function (d, i) {
					//var innerDataForPieChart = [];
					var equation = _equations[j].equation;
					var name = _equations[j].name;
					for (var key in d) {
						//var object = {};
						if (d.hasOwnProperty(key)) {
							//alert(key + " -> " + d[key]);
							var re = new RegExp(key, "g");
							//Normalize values first
							var help = calculateNorm(d, key, _data, _normMethod, _p);
							equation = equation.replace(re, help);
							//	object.name = key;
							//	object.value = help;
							//innerDataForPieChart.push(object);
						}
					}
					var result = math.eval(equation);
					//console.log("EQUATION: " + equation + " RESULT: " + result);
					d[name] = result;
					//console.log("ONE SET: " + JSON.stringify(d));
				}

					//dataForPieChart.push(innerDataForPieChart);
				);
			}
		}
		if (_tmpEquation != "") {
			_data.forEach(function (d, i) {
				var equation = _tmpEquation;
				var name = "tmp";
				var currentTitle = d.title;
				for (var key in d) {

					var object = {};

					if (d.hasOwnProperty(key)) {
						//alert(key + " -> " + d[key]);
						var re = new RegExp(key, "g");
						//Normalize values first
						var help = calculateNorm(d, key, _data, _normMethod, _p);
						var equationOld = equation;
						equation = equation.replace(re, help);
						if (equation != equationOld) {
							object.title = d.title;
							object.name = key;
							object.value = help;
							dataForPieChart.push(object);
						}
					}
				}
				var result = math.eval(equation);
				//console.log("TMP EQUATION: " + equation + " RESULT: " + result);
				d[name] = result;
				//console.log("TMP ONE SET: " + JSON.stringify(d));
			});
		}
		visController.setDataForPieChart(dataForPieChart);
	};

	/****************************************************************************************************
	 *
	 *   RankingModel Prototype
	 *
	 ****************************************************************************************************/
	// Array Remove - By John Resig (MIT Licensed)
	Array.prototype.remove = function (from, to) {
		var rest = this.slice((to || from) + 1 || this.length);
		this.length = from < 0 ? this.length + from : from;
		return this.push.apply(this, rest);
	};

	RankingModel.prototype = {
		update : function (keywords, rankingMode) {
			this.mode = rankingMode || RANKING_MODE.overall_score;
			this.previousRanking = this.ranking.clone();
			//calculateQMs(this.data, this.formulas);
			calculateQMsWithEquations(this.data, this.equations, this.tmpEquation, this.normMethod, this.p);
			this.ranking = computeScores(this.data, keywords, this.normMethodRank, this.pRank).sortBy(this.mode).addPositionsChanged(this.previousRanking);
			this.status = updateStatus(this.ranking, this.previousRanking);
			/*console.log('RANKING');
			console.log(this.ranking);*/
			return this.ranking;
		},

		reset : function () {
			this.previousRanking.clear();
			this.ranking.clear();
			this.status = updateStatus(this.ranking, this.previousRanking);
		},

		getRanking : function () {
			return this.ranking;
		},

		getStatus : function () {
			return this.status;
		},

		getOriginalData : function () {
			return this.data;
		},

		getMode : function () {
			return this.mode;
		},

		getActualIndex : function (index) {
			if (this.status == RANKING_STATUS.no_ranking)
				return index;
			return this.ranking[index].originalIndex;
		},

		newQM : function (formula) {
			this.formulas.push(formula);
		},

		newQMFromEquationComposer : function (name, equation) {
			var object = {
				name : name,
				equation : equation
			};
			var indexToDelete = -1;
			for (var i = 0; i < this.equations.length; i++) {
				if (this.equations[i].name == name) {
					indexToDelete = i;
				}
			}
			if (indexToDelete != -1) {
				//console.log("WE HAVE TO DELETE: " + indexToDelete);
				this.equations.remove(indexToDelete);
			}
			this.equations.push(object);
		},

		setTempEquation : function (equation) {
			this.tmpEquation = equation;
		},

		calculateQMs : function () {
			calculateQMs(this.data, this.formulas);
		},

		setNormMethod : function (normMethodPar, pPar) {
			this.normMethod = normMethodPar;
			this.p = pPar;
		},

		setNormMethodRank : function (normMethodPar, pPar) {
			this.normMethodRank = normMethodPar;
			this.pRank = pPar;
		}

	};

	return RankingModel;

})();

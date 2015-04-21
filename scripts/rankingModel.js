
var RankingModel = (function () {

	function RankingModel(data) {
		this.ranking = new RankingArray();
		this.previousRanking = new RankingArray();
		this.formulas = [];
		this.equations = [];
		this.data = data;
		this.status = RANKING_STATUS.no_ranking;
		this.mode = RANKING_MODE.overall_score;
		this.tmpEquation = "";
	}

	/**
	 *	Creates the ranking items with default values and calculates the weighted score for each selected keyword (tags in tag box)
	 *
	 * */
	var computeScores = function (_data, query) {
		var ranking = new RankingArray();
		var norms = calculateEuclidenNormForEachQM(_data, query);
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
				var QMscore = (parseFloat(d[q.term] / norms[q.term]) * parseFloat(q.weight) * unitQueryVectorDot).round(3);
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
	var calculateEuclidenNormForEachQM = function (_data, query) {
		var acumSquares = {};
		_data.forEach(function (d, i) { //Iteration over all articles
			query.forEach(function (q) { //Iteration over each QM
				if (acumSquares.hasOwnProperty(q.term)) {
					acumSquares[q.term] += d[q.term] * d[q.term];
				} else {
					acumSquares[q.term] = d[q.term] * d[q.term];
				}
			});
		});

		query.forEach(function (q) {
			acumSquares[q.term] = Math.sqrt(acumSquares[q.term]);
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
						console.log("PARAMETERNAME: " + parameterName + " VALUE: " + d[parameterName]);
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
				console.log("ONE SET: " + JSON.stringify(d));
			});
		}
	};

	var calculateQMsWithEquations = function (_data, _equations, _tmpEquation) {
		for (var j = 0; j < _equations.length; j++) {
			//console.log("DATA: " + JSON.stringify(_data));

			_data.forEach(function (d, i) {
				var equation = _equations[j].equation;
				var name = _equations[j].name;
				//TODO CALCULATION IS WRONG IF MULT OR DIV GET USED!
				for (var key in d) {
					if (d.hasOwnProperty(key)) {
						//alert(key + " -> " + d[key]);
						var re = new RegExp(key, "g");
						equation = equation.replace(re, d[key]);
					}
				}
				var result = math.eval(equation);
				console.log("EQUATION: " + equation + " RESULT: " + result);
				d[name] = result;
				console.log("ONE SET: " + JSON.stringify(d));
			});
		}
		if (_tmpEquation != "") {
			_data.forEach(function (d, i) {
				var equation = _tmpEquation;
				var name = "tmp";
				//TODO CALCULATION IS WRONG IF MULT OR DIV GET USED!
				for (var key in d) {
					if (d.hasOwnProperty(key)) {
						//alert(key + " -> " + d[key]);
						var re = new RegExp(key, "g");
						equation = equation.replace(re, d[key]);
					}
				}
				var result = math.eval(equation);
				console.log("TMP EQUATION: " + equation + " RESULT: " + result);
				d[name] = result;
				console.log("TMP ONE SET: " + JSON.stringify(d));
			});
		}
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
			calculateQMsWithEquations(this.data, this.equations, this.tmpEquation);
			this.ranking = computeScores(this.data, keywords).sortBy(this.mode).addPositionsChanged(this.previousRanking);
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
				console.log("WE HAVE TO DELETE: " + indexToDelete);
				this.equations.remove(indexToDelete);
			}
			this.equations.push(object);
		},

		setTempEquation : function (equation) {
			this.tmpEquation = equation;
		},

		calculateQMs : function () {
			calculateQMs(this.data, this.formulas);
		}

	};

	return RankingModel;

})();

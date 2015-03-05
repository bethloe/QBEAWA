
var RankingModel = (function () {

	function RankingModel(data) {
		this.ranking = new RankingArray();
		this.previousRanking = new RankingArray();
		this.data = data;
		this.status = RANKING_STATUS.no_ranking;
		this.mode = RANKING_MODE.overall_score;
	}

	/**
	 *	Creates the ranking items with default values and calculates the weighted score for each selected keyword (tags in tag box)
	 *
	 * */
	var computeScores = function (_data, query) {
		var ranking = new RankingArray();
		var norms = calculateEuclidenNormForEachQM(_data, query);
		console.log("NORMS: " + JSON.stringify(norms));
		console.log("NORMS: " + norms['Authority']);
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

				//TODO NORMALIZE VALUES!!!!!
				//console.log("d: " + JSON.stringify(d));
				//	console.log("q.term: " + q.term);
				//console.log("d[q.term]: " + d[q.term]);
				//console.log("parseFloat(q.weight)) : " + parseFloat(q.weight));
				var QMscore = (parseFloat(d[q.term] / norms[q.term]) * parseFloat(q.weight) * unitQueryVectorDot).round(3);
				//console.log("QMscore: " + QMscore);
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
		console.log("ACUMSQUARES: " + JSON.stringify(acumSquares));
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

	/****************************************************************************************************
	 *
	 *   RankingModel Prototype
	 *
	 ****************************************************************************************************/

	RankingModel.prototype = {
		update : function (keywords, rankingMode) {
			this.mode = rankingMode || RANKING_MODE.overall_score;
			this.previousRanking = this.ranking.clone();
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
		}
	};

	return RankingModel;

})();

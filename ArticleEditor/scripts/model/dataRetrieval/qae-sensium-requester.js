var SensiumRequester = function (vals) {
	//var apiKey = "9f31a709-5d40-4eb4-bb79-43cac4030cfb" /*See php file*/
	var GLOBAL_controller = vals.controller;
	var GLOBAL_sensiumText = null;
	var GLOBAL_sectionName = null;
	var GLOBAL_url = null;
	var GLOBAL_activeOption = 0;
	var sensiumRequester = {};

	sensiumRequester.sensium = function () {
		$.post("sensiumRequester.php", {
			operation : "sensium",

		})
		.done(function (data) {
			//console.log("data: " + data);
			var help = JSON.parse(data);
			console.log("score: " + help.polarity.score);
		});
	}

	var summarizedText = null;

	sensiumRequester.sensiumSummarize = function (url) {
		$.post("sensiumRequester.php", {
			operation : "sensiumSummarize",
			url : url
		})
		.done(function (data) {
			var help = JSON.parse(data);
			$('#wikiTextInner').html("<h1> Summary </h1>" + help.summary.text);
			$('#iconSensiumSummarize').css('background-color', 'white');
			$('#iconSensiumEvent').css('background-color', 'transparent');
			$('#iconSensiumKey').css('background-color', 'transparent');
			$('#iconSensiumEntity').css('background-color', 'transparent');
			GLOBAL_activeOption = 1;
		});
	}

	sensiumRequester.sensiumSummarizeText = function (text, sectionName) {
		$.post("sensiumRequester.php", {
			operation : "sensiumSummarizeText",
			sectionName : sectionName,
			text : text
		})
		.done(function (data) {
			if (data != "") {
				var dataArray = data.split("||splithere||");
				var sectionName = dataArray[0];
				sectionName = sectionName.substring(1, sectionName.length);
				console.log("DATA: " + data);
				data = dataArray[1];
				var help = JSON.parse(data);
				
				var help = "<table><tr><td><h1> Complete text(" + sectionName + ") </h1>" + text+"</td><td><h1> Summary(" + sectionName + ") </h1>" + help.summary.text+"</td></tr></table>";
				$('#wikiTextInner').html(help);
				$('#iconSensiumSummarize').css('background-color', 'white');
				$('#iconSensiumEvent').css('background-color', 'transparent');
				$('#iconSensiumKey').css('background-color', 'transparent');
				$('#iconSensiumEntity').css('background-color', 'transparent');
				GLOBAL_activeOption = 1;
			}
		});
	}

	sensiumRequester.sensiumEventExtraction = function (url) {
		$.post("sensiumRequester.php", {
			operation : "sensiumEventExtraction",
			url : url
		})
		.done(function (data) {
			var help = JSON.parse(data);
			//if (summarizedText != null) {
			var temporalEvents = help.temporalEvents;
			var table = "<table class='sensiumTable'>";
			table += "<tr><td> text </td><td> UTC </td></tr>";

			for (var i = 0; i < temporalEvents.length; i++) {
				var res = help.text.substring(temporalEvents[i].start, temporalEvents[i].end);
				table += "<tr><td>" + res + "</td><td>" + (new Date(temporalEvents[i].timestamp)).toUTCString() + "</td></tr>";

			}
			table += "</table>";
			$('#wikiTextInner').html("<h1> Temporal Event Extraction </h1>" + table);

			$('#iconSensiumSummarize').css('background-color', 'transparent');
			$('#iconSensiumEvent').css('background-color', 'white');
			$('#iconSensiumKey').css('background-color', 'transparent');
			$('#iconSensiumEntity').css('background-color', 'transparent');
			GLOBAL_activeOption = 2;
			//	}
		});
	}

	sensiumRequester.sensiumEventExtractionText = function (text, sectionName) {
		$.post("sensiumRequester.php", {
			operation : "sensiumEventExtractionText",
			sectionName : sectionName,
			text : text
		})
		.done(function (data) {
			if (data != "") {
				var dataArray = data.split("||splithere||");
				var sectionName = dataArray[0];
				sectionName = sectionName.substring(1, sectionName.length);
				data = dataArray[1];
				var help = JSON.parse(data);
				//if (summarizedText != null) {
				var temporalEvents = help.temporalEvents;
				var table = "<table class='sensiumTable'>";
				table += "<tr><td> text </td><td> UTC </td></tr>";

				for (var i = 0; i < temporalEvents.length; i++) {
					var res = help.text.substring(temporalEvents[i].start, temporalEvents[i].end);
					table += "<tr><td>" + res + "</td><td>" + (new Date(temporalEvents[i].timestamp)).toUTCString() + "</td></tr>";

				}
				table += "</table>";
				$('#wikiTextInner').html("<h1> Temporal Event Extraction(" + sectionName + ")  </h1>" + table);

				$('#iconSensiumSummarize').css('background-color', 'transparent');
				$('#iconSensiumEvent').css('background-color', 'white');
				$('#iconSensiumKey').css('background-color', 'transparent');
				$('#iconSensiumEntity').css('background-color', 'transparent');
				GLOBAL_activeOption = 2;
			}
		});
	}

	sensiumRequester.sensiumEntitiyExtraction = function (url) {
		$.post("sensiumRequester.php", {
			operation : "sensiumEntitiyExtraction",
			url : url
		})
		.done(function (data) {
			var help = JSON.parse(data);
			var entities = help.entities;
			var table = "<table class='sensiumTable'>";
			table += "<tr><td> entity </td><td> type </td><td> # occures </td><td> URL </td></tr>";

			for (var i = 0; i < entities.length; i++) {
				table += "<tr><td>" + entities[i].normalized + "</td><td>" + entities[i].type + "</td><td>" + entities[i].occurrences.length + "</td><td>" + entities[i].link + "</td></tr>";

			}
			table += "</table>";
			$('#wikiTextInner').html("<h1> Named Entity Recognition </h1>" + table);

			$('#iconSensiumSummarize').css('background-color', 'transparent');
			$('#iconSensiumEvent').css('background-color', 'transparent');
			$('#iconSensiumKey').css('background-color', 'transparent');
			$('#iconSensiumEntity').css('background-color', 'white');
			GLOBAL_activeOption = 3;
		});
	}

	sensiumRequester.sensiumEntitiyExtractionText = function (text, sectionName) {
		$.post("sensiumRequester.php", {
			operation : "sensiumEntitiyExtractionText",
			sectionName : sectionName,
			text : text
		})
		.done(function (data) {
			if (data != "") {
				var dataArray = data.split("||splithere||");
				var sectionName = dataArray[0];
				sectionName = sectionName.substring(1, sectionName.length);
				data = dataArray[1];
				var help = JSON.parse(data);
				var entities = help.entities;
				var table = "<table class='sensiumTable'>";
				table += "<tr><td> entity </td><td> type </td><td> # occures </td><td> URL </td></tr>";

				for (var i = 0; i < entities.length; i++) {
					table += "<tr><td>" + entities[i].normalized + "</td><td>" + entities[i].type + "</td><td>" + entities[i].occurrences.length + "</td><td>" + entities[i].link + "</td></tr>";

				}
				table += "</table>";
				$('#wikiTextInner').html("<h1> Named Entity Recognition(" + sectionName + ")  </h1>" + table);

				$('#iconSensiumSummarize').css('background-color', 'transparent');
				$('#iconSensiumEvent').css('background-color', 'transparent');
				$('#iconSensiumKey').css('background-color', 'transparent');
				$('#iconSensiumEntity').css('background-color', 'white');
				GLOBAL_activeOption = 3;
			}
		});
	}

	sensiumRequester.sensiumKeyphraseExtraction = function (url) {
		$.post("sensiumRequester.php", {
			operation : "sensiumSummarize",
			url : url
		})
		.done(function (data) {
			var help = JSON.parse(data);
			console.log("KEYPHRASES HELP: " + JSON.stringify(help));
			var keyphrases = help.summary.keyPhrases;
			var table = "<table class='sensiumTable'>";
			table += "<tr><td> keyword </td><td> score </td></tr>";

			for (var i = 0; i < keyphrases.length; i++) {
				table += "<tr><td>" + keyphrases[i].text + "</td><td>" + keyphrases[i].score + "</td></tr>";
			}
			table += "</table>";
			$('#wikiTextInner').html("<h1> Keyphrase Extraction </h1>" + table);

			$('#iconSensiumSummarize').css('background-color', 'transparent');
			$('#iconSensiumEvent').css('background-color', 'transparent');
			$('#iconSensiumKey').css('background-color', 'white');
			$('#iconSensiumEntity').css('background-color', 'transparent');
			GLOBAL_activeOption = 4;
		});
	}

	sensiumRequester.sensiumKeyphraseExtractionText = function (text, sectionName) {
		$.post("sensiumRequester.php", {
			operation : "sensiumSummarizeText",
			sectionName : sectionName,
			text : text
		})

		.done(function (data) {
			if (data != "") {
				var dataArray = data.split("||splithere||");
				var sectionName = dataArray[0];
				sectionName = sectionName.substring(1, sectionName.length);
				data = dataArray[1];
				var help = JSON.parse(data);
				console.log("KEYPHRASES HELP: " + JSON.stringify(help));
				var keyphrases = help.summary.keyPhrases;
				var table = "<table class='sensiumTable'>";
				table += "<tr><td> keyword </td><td> score </td></tr>";

				for (var i = 0; i < keyphrases.length; i++) {
					table += "<tr><td>" + keyphrases[i].text + "</td><td>" + keyphrases[i].score + "</td></tr>";
				}
				table += "</table>";
				$('#wikiTextInner').html("<h1> Keyphrase Extraction(" + sectionName + ")  </h1>" + table);

				$('#iconSensiumSummarize').css('background-color', 'transparent');
				$('#iconSensiumEvent').css('background-color', 'transparent');
				$('#iconSensiumKey').css('background-color', 'white');
				$('#iconSensiumEntity').css('background-color', 'transparent');
				GLOBAL_activeOption = 4;
			}
		});
	}

	sensiumRequester.setURL = function (url) {
		GLOBAL_url = url;
	}
	sensiumRequester.setSensiumText = function (text, sectionName) {
		GLOBAL_sensiumText = text;
		GLOBAL_sectionName = sectionName;
	}

	sensiumRequester.setOption = function (option) {
		GLOBAL_activeOption = option;
	}

	sensiumRequester.doRequest = function (option) {
		if (option != 0) {
			GLOBAL_activeOption = option;
		}

		if (GLOBAL_sensiumText != null) {
			if (GLOBAL_activeOption == 1) {
				sensiumRequester.sensiumSummarizeText(GLOBAL_sensiumText, GLOBAL_sectionName);
			} else if (GLOBAL_activeOption == 2) {
				sensiumRequester.sensiumEventExtractionText(GLOBAL_sensiumText, GLOBAL_sectionName);
			} else if (GLOBAL_activeOption == 3) {
				sensiumRequester.sensiumEntitiyExtractionText(GLOBAL_sensiumText, GLOBAL_sectionName);
			} else if (GLOBAL_activeOption == 4) {
				sensiumRequester.sensiumKeyphraseExtractionText(GLOBAL_sensiumText, GLOBAL_sectionName);
			}
		} else {
			if (GLOBAL_activeOption == 1) {
				sensiumRequester.sensiumSummarize(GLOBAL_url);
			} else if (GLOBAL_activeOption == 2) {
				sensiumRequester.sensiumEventExtraction(GLOBAL_url);
			} else if (GLOBAL_activeOption == 3) {
				sensiumRequester.sensiumEntitiyExtraction(GLOBAL_url);
			} else if (GLOBAL_activeOption == 4) {
				sensiumRequester.sensiumKeyphraseExtraction(GLOBAL_url);
			}
		}
	}

	//SENTIMENT SOCRE:
	sensiumRequester.sensiumURLRequest = function (url) {
		$.post("sensiumRequester.php", {
			operation : "sensiumURLRequest",
			url : url
		})
		.done(function (data) {
			//console.log("data: " + data);
			//console.log("DATA END");
			var help = JSON.parse(data);
			//console.log("score: " + help.polarity.score);
			$("#sensiumOverallScore").html("<b>Sensium(sentiment) score: " + help.polarity.score.toFixed(2) + "</b>");

			$('#progressBarSensiumOverallScoreController').css("right", 200 - help.polarity.score * 200);
			//$('#progressBarSensiumOverallScore').val(help.polarity.score * 50 + 50);
		});
	}

	sensiumRequester.sensiumTextRequest = function (text, sectionName) {
		$.post("sensiumRequester.php", {
			operation : "sensiumTextRequest",
			sectionName : sectionName,
			text : text
		})
		.done(function (data) {
			//console.log("data: " + data);
			if (data != "") {
				var dataArray = data.split("||splithere||");
				var sectionName = dataArray[0];
				sectionName = sectionName.substring(1, sectionName.length);
				//console.log("DOWN:|"+sectionName+"|");
				data = dataArray[1];
				var help = JSON.parse(data);
				var score = 0;
				if (help != undefined)
					if (help.polarity != undefined)
						if (help.polarity.score != undefined) {
							//console.log(sectionName + " TEXT score: " + help.polarity.score);
							score = help.polarity.score;
						}
				GLOBAL_controller.setSentimentScoreOfSection(score.toFixed(2), sectionName);
			}
		});
	}

	return sensiumRequester;

}

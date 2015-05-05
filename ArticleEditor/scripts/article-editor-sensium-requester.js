var SensiumRequester = function (vals) {
	//var apiKey = "9f31a709-5d40-4eb4-bb79-43cac4030cfb" /*See php file*/
	var sensiumRequester = {};

	sensiumRequester.sensium = function () {
		console.log("IN HERE");
		$.post("sensiumRequester.php", {
			operation : "sensium",
			
		})
		.done(function (data) {
			//console.log("data: " + data);
			var help = JSON.parse(data);
			console.log("score: " + help.polarity.score);
		});
	}
	
	
	sensiumRequester.sensiumURLRequest = function (url) {
		console.log("sensiumURLRequest");
		$.post("sensiumRequester.php", {
			operation : "sensiumURLRequest",
			url : url
		})
		.done(function (data) {
			//console.log("data: " + data);
			//console.log("DATA END");
			var help = JSON.parse(data);
			//console.log("score: " + help.polarity.score);
			$("#sensiumOverallScore").html("<b>Sensium(sentiment) score: "+help.polarity.score.toFixed(2)+"</b>");

			$('#progressBarSensiumOverallScoreController').css("right",  200 - help.polarity.score * 200);
			//$('#progressBarSensiumOverallScore').val(help.polarity.score * 50 + 50);
		});
	}

	sensiumRequester.sensiumTextRequest = function (text) {
		console.log("sensiumTextRequest");
		$.post("sensiumRequester.php", {
			operation : "sensiumTextRequest",
			text : text
		})
		.done(function (data) {
			//console.log("data: " + data);
			var help = JSON.parse(data);
			console.log("score: " + help.polarity.score);
		});
	}
	
	
	return sensiumRequester;
	

}

var DatabaseConnector = function (vals) {

	var databaseConnector = {};

	databaseConnector.storeFormula = function (name, formula) {
		$.post("database.php", {
			operation : "storeFormula",
			name : name,
			formula : formula
		})
		.done(function (data) {
			console.log(data);
			alert("Formula saved!");
		});
	}

	databaseConnector.storeVizToQM = function (name, content) {
		$.post("database.php", {
			operation : "storeVizToQM",
			QMVizName : name,
			QMVizData : content
		})
		.done(function (data) {
			console.log(data);
			alert("Visualization data saved!");
		});
	}

	databaseConnector.getAllFormulas = function (callbackFunction) {
		$.post("database.php", {
			operation : "getAllFormulas"
		})
		.done(function (data) {
			callbackFunction(data)
		});
	}

	databaseConnector.getAllQMVizs = function (callbackFunction) {
		$.post("database.php", {
			operation : "getAllQMVizs"
		})
		.done(function (data) {
			callbackFunction(data)
		});
	}
	return databaseConnector;

}

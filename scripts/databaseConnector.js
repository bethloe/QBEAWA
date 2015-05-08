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
		//	alert("Formula saved!");
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
			//alert("Visualization data saved!");
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
	
	databaseConnector.storeEquation = function (name, equation, text) {
		$.post("database.php", {
			operation : "storeEquation",
			name : name,
			equation : equation, 
			text : text
		})
		.done(function (data) {
			console.log(data);
			//alert("Equation saved!");
		});
	}

	databaseConnector.storeEquationViz = function (name, content) {
		$.post("database.php", {
			operation : "storeEquationViz",
			QMVizName : name,
			QMVizData : content
		})
		.done(function (data) {
			console.log(data);
			//alert("Visualization data saved!");
		});
	}

	databaseConnector.getAllEquations = function (callbackFunction) {
		$.post("database.php", {
			operation : "getAllEquations"
		})
		.done(function (data) {
			callbackFunction(data)
		});
	}

	databaseConnector.getAllEquationTexts = function (callbackFunction) {
		$.post("database.php", {
			operation : "getAllEquationTexts"
		})
		.done(function (data) {
			callbackFunction(data)
		});
	}
	
	databaseConnector.getEquationViz = function (callbackFunction) {
		$.post("database.php", {
			operation : "getEquationViz"
		})
		.done(function (data) {
			callbackFunction(data)
		});
	}
	
	databaseConnector.delteEquationInclViz = function(name) {
	$.post("database.php", {
			operation : "delteEquationInclViz",
			equationName : name
		})
		.done(function (data) {
			console.log(data);
			//alert(data);
		});
	}
	
	return databaseConnector;

}

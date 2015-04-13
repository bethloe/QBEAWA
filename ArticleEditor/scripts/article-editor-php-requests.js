var PhpConnector = function (vals) {

	var GLOBAL_controller = vals.controller;
	
	var phpConnector = {};

	phpConnector.login = function (username, password) {
		$.post("editRequests.php", {
			operation : "login",
			username : username,
			password : password
		})
		.done(function (data) {
			//console.log(data);
			alert("LOGIN SUCCESSFUL");
			GLOBAL_controller.setEditToken(data);
		});
	}

	/*databaseConnector.storeVizToQM = function (name, content) {
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
	}*/
	return phpConnector;

}

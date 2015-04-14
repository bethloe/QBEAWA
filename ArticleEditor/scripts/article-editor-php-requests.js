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
			GLOBAL_controller.setUserToken(data);
		});
	}

	phpConnector.editRequest = function (url, params, id, callbackFunction) {

		$.post("editRequests.php", {
			operation : "edit",
			url : url,
			params : params
		})
		.done(function (data) {
			console.log("SOMETHING HAPPEND (EDIT REQUEST)");
			console.log("DATA: " + data);
			callbackFunction(id);
			//GLOBAL_controller.setEditToken(data);
		});
	}

	phpConnector.getEditToken = function (url, params) {

		$.post("editRequests.php", {
			operation : "getEditToken"
		})
		.done(function (data) {
			console.log("SOMETHING HAPPEND (getEditToken REQUEST)");
			console.log("getEditToken DATA: " + data);
			GLOBAL_controller.setEditToken(data);
		});
	}
	return phpConnector;

}

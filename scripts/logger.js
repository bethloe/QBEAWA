var Logger = function (vals) {

	var logger = {};
	var now = new Date();
	var logFileName = now.getTime() / 1000;
	logger.log = function (logMessage) {
		$.post("database.php", {
			fileName : logFileName,
			logMessage : logMessage
		})
		.done(function (data) {
			console.log("OUTPUT: " data);
			//alert(data);
		});
	}

}

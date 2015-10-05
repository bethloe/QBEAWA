var Logger = function (vals) {
	var doLog = false;
	var logger = {};
	var now = new Date();
	var logFileName = now.getTime() / 1000;
	logger.log = function (logMessage) {
		if (doLog) {
			$.post("logger.php", {
				fileName : logFileName,
				logMessage : logMessage
			})
			.done(function (data) {
				console.log("OUTPUT: " + data);
				//alert(data);
			});
		}
	}

	return logger;

}

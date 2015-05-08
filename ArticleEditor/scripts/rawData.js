function albertEinsteinRawData(callbackFunction) {
$.post("getDataSet.php", {
			operation : "einstein"
		})
		.done(function (data) {
			callbackFunction(data)
		});
}

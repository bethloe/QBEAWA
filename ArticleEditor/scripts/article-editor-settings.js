
$("#sliderStrictness").change(function (e) {
	overallScoreInterval = ((($(this).val() / 100) - 0.5) * 0.4).toFixed(2);
	console.log("sliderStrictness: " + overallScoreInterval);
	articleController.showQuality();
});
$("#sliderFlesch").change(function (e) {
	weightFlesch = (($(this).val() / 100) + 0.5).toFixed(2);
	console.log("sliderFlesch: " + weightFlesch);
	articleController.showQuality();
});
$("#sliderKincaid").change(function (e) {
	weightKincaid = (($(this).val() / 100) + 0.5).toFixed(2);
	console.log("sliderKincaid: " + weightKincaid);
	articleController.showQuality();
});
$("#sliderImageQuality").change(function (e) {
	weightImageQuality = (($(this).val() / 100) + 0.5).toFixed(2);
	console.log("sliderImageQuality: " + weightImageQuality);
	articleController.showQuality();
});
$("#sliderExternalRefs").change(function (e) {
	weightExternalRefs = (($(this).val() / 100) + 0.5).toFixed(2);
	console.log("sliderExternalRefs: " + weightExternalRefs);
	articleController.showQuality();
});
$("#sliderAllLinks").change(function (e) {
	weightAllLinks = (($(this).val() / 100) + 0.5).toFixed(2);
	console.log("sliderAllLinks: " + weightAllLinks);
	articleController.showQuality();
});

var resetToDefaultSettings = function () {
	overallScoreInterval = 0;
	weightFlesch = 1;
	weightKincaid = 1;
	weightImageQuality = 1;
	weightExternalRefs = 1;
	weightAllLinks = 1;
	$("#sliderStrictness").val(50);
	$("#sliderFlesch").val(50);
	$("#sliderKincaid").val(50);
	$("#sliderImageQuality").val(50);
	$("#sliderExternalRefs").val(50);
	$("#sliderAllLinks").val(50);
	articleController.showQuality();
}

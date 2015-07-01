
$("#sliderStrictness").change(function (e) {
	overallScoreInterval = ((($(this).val() / 100) - 0.5) * 0.4).toFixed(2);
	//console.log("sliderStrictness: " + overallScoreInterval);
	articleController.showQuality();
});
$("#sliderFlesch").change(function (e) {
	weightFlesch = (($(this).val() / 100) + 0.5).toFixed(2);
	//console.log("sliderFlesch: " + weightFlesch);
	articleController.showQuality();
});
$("#sliderKincaid").change(function (e) {
	weightKincaid = (($(this).val() / 100) + 0.5).toFixed(2);
	//console.log("sliderKincaid: " + weightKincaid);
	articleController.showQuality();
});
$("#sliderImageQuality").change(function (e) {
	weightImageQuality = (($(this).val() / 100) + 0.5).toFixed(2);
	//console.log("sliderImageQuality: " + weightImageQuality);
	articleController.showQuality();
});
$("#sliderExternalRefs").change(function (e) {
	weightExternalRefs = (($(this).val() / 100) + 0.5).toFixed(2);
	//console.log("sliderExternalRefs: " + weightExternalRefs);
	articleController.showQuality();
});
$("#sliderAllLinks").change(function (e) {
	weightAllLinks = (($(this).val() / 100) + 0.5).toFixed(2);
	//console.log("sliderAllLinks: " + weightAllLinks);
	articleController.showQuality();
});

//------------------------------------------------------------------------
$("#numberFlesch").change(function (e) {
	good_fleschWordCount = $(this).val();
	articleController.showQuality();
});
$("#numberKincaid").change(function (e) {	
good_kinkaid = $(this).val();
	articleController.showQuality();
});
$("#numberImageQuality").change(function (e) {
good_numPics = $(this).val();
	articleController.showQuality();
});
$("#numberExternalRefs").change(function (e) {
good_extLinks = $(this).val();
	articleController.showQuality();
});
$("#numberAllLinks").change(function (e) {
good_allLinks = $(this).val();
	articleController.showQuality();
});

//Influences: -----------------------------------------------------------------
var defaultValue = parseFloat((100 / numberOfMetrics));
$("#sliderFleschInfluence").val(defaultValue);
$("#sliderKincaidInfluence").val(defaultValue);
$("#sliderImageQualityInfluence").val(defaultValue);
$("#sliderExternalRefsInfluence").val(defaultValue);
$("#sliderAllLinksInfluence").val(defaultValue);

$("#sliderFleschInfluence").change(function (e) {
	influenceFlesch = (($(this).val() / 100)).toFixed(2);
	var rest = parseFloat(1 - influenceFlesch);

	if ($("#sliderKincaidInfluence").val() == 0) {
		$("#sliderKincaidInfluence").val(1)
	}
	if ($("#sliderImageQualityInfluence").val() == 0) {
		$("#sliderImageQualityInfluence").val(1)
	}
	if ($("#sliderExternalRefsInfluence").val() == 0) {
		$("#sliderExternalRefsInfluence").val(1)
	}
	if ($("#sliderAllLinksInfluence").val() == 0) {
		$("#sliderAllLinksInfluence").val(1)
	}
	var sum = $("#sliderKincaidInfluence").val() / 100 + $("#sliderImageQualityInfluence").val() / 100 + $("#sliderExternalRefsInfluence").val() / 100 + $("#sliderAllLinksInfluence").val() / 100;
	//var valueOtherSlider  = parseFloat(rest / (numberOfMetrics-1));

	influenceKincaid = parseFloat(((($("#sliderKincaidInfluence").val() / 100) / sum) * rest));
	influenceImageQuality = parseFloat(((($("#sliderImageQualityInfluence").val() / 100) / sum) * rest));
	influenceExternalRefs = parseFloat(((($("#sliderExternalRefsInfluence").val() / 100) / sum) * rest));
	influenceAllLinks = parseFloat(((($("#sliderAllLinksInfluence").val() / 100) / sum) * rest));
	$("#sliderKincaidInfluence").val(((($("#sliderKincaidInfluence").val() / 100) / sum) * rest) * 100);
	$("#sliderImageQualityInfluence").val(((($("#sliderImageQualityInfluence").val() / 100) / sum) * rest) * 100);
	$("#sliderExternalRefsInfluence").val(((($("#sliderExternalRefsInfluence").val() / 100) / sum) * rest) * 100);
	$("#sliderAllLinksInfluence").val(((($("#sliderAllLinksInfluence").val() / 100) / sum) * rest) * 100);

//	console.log("sliderFleschInfluence: " + influenceFlesch + " rest: " + rest);

	articleController.showQuality();
});
$("#sliderKincaidInfluence").change(function (e) {
	influenceKincaid = (($(this).val() / 100)).toFixed(2);
	var rest = parseFloat(1 - influenceKincaid);

	if ($("#sliderFleschInfluence").val() == 0) {
		$("#sliderFleschInfluence").val(1)
	}
	if ($("#sliderImageQualityInfluence").val() == 0) {
		$("#sliderImageQualityInfluence").val(1)
	}
	if ($("#sliderExternalRefsInfluence").val() == 0) {
		$("#sliderExternalRefsInfluence").val(1)
	}
	if ($("#sliderAllLinksInfluence").val() == 0) {
		$("#sliderAllLinksInfluence").val(1)
	}
	var sum = $("#sliderFleschInfluence").val() / 100 + $("#sliderImageQualityInfluence").val() / 100 + $("#sliderExternalRefsInfluence").val() / 100 + $("#sliderAllLinksInfluence").val() / 100;
	//var valueOtherSlider  = parseFloat(rest / (numberOfMetrics-1));

	influenceFlesch = parseFloat(((($("#sliderFleschInfluence").val() / 100) / sum) * rest));
	influenceImageQuality = parseFloat(((($("#sliderImageQualityInfluence").val() / 100) / sum) * rest));
	influenceExternalRefs = parseFloat(((($("#sliderExternalRefsInfluence").val() / 100) / sum) * rest));
	influenceAllLinks = parseFloat(((($("#sliderAllLinksInfluence").val() / 100) / sum) * rest));
	$("#sliderFleschInfluence").val(((($("#sliderFleschInfluence").val() / 100) / sum) * rest) * 100);
	$("#sliderImageQualityInfluence").val(((($("#sliderImageQualityInfluence").val() / 100) / sum) * rest) * 100);
	$("#sliderExternalRefsInfluence").val(((($("#sliderExternalRefsInfluence").val() / 100) / sum) * rest) * 100);
	$("#sliderAllLinksInfluence").val(((($("#sliderAllLinksInfluence").val() / 100) / sum) * rest) * 100);

	//console.log("sliderKincaidInfluence: " + influenceKincaid + " rest: " + rest);
	articleController.showQuality();
});
$("#sliderImageQualityInfluence").change(function (e) {
	influenceImageQuality = (($(this).val() / 100)).toFixed(2);
	var rest = parseFloat(1 - influenceImageQuality);

	if ($("#sliderKincaidInfluence").val() < 1) {
		$("#sliderKincaidInfluence").val(1)
	}
	if ($("#sliderFleschInfluence").val() < 1) {
		$("#sliderFleschInfluence").val(1)
	}
	if ($("#sliderExternalRefsInfluence").val() < 1) {
		$("#sliderExternalRefsInfluence").val(1)
	}
	if ($("#sliderAllLinksInfluence").val() < 1) {
		$("#sliderAllLinksInfluence").val(1)
	}
	var sum = $("#sliderKincaidInfluence").val() / 100 + $("#sliderFleschInfluence").val() / 100 + $("#sliderExternalRefsInfluence").val() / 100 + $("#sliderAllLinksInfluence").val() / 100;
	//var valueOtherSlider  = parseFloat(rest / (numberOfMetrics-1));

	influenceKincaid = parseFloat(((($("#sliderKincaidInfluence").val() / 100) / sum) * rest));
	influenceFlesch = parseFloat(((($("#sliderFleschInfluence").val() / 100) / sum) * rest));
	influenceExternalRefs = parseFloat(((($("#sliderExternalRefsInfluence").val() / 100) / sum) * rest));
	influenceAllLinks = parseFloat(((($("#sliderAllLinksInfluence").val() / 100) / sum) * rest));
	//console.log(($("#sliderKincaidInfluence").val() / 100) + " " + ($("#sliderFleschInfluence").val() / 100) + " " + ($("#sliderExternalRefsInfluence").val() / 100) + " " + ($("#sliderAllLinksInfluence").val() / 100));
	//console.log("sum: " + sum + " sliderImageQualityInfluence: " + influenceImageQuality + " rest: " + rest + " influenceKincaid: " + influenceKincaid + " kincaidstep1: " + ($("#sliderKincaidInfluence").val() / 100) + "kcstep2: " + (($("#sliderFleschInfluence").val() / 100) / sum) + " influenceFlesch: " + influenceFlesch + " influenceExternalRefs: " + influenceExternalRefs + " influenceAllLinks: " + influenceAllLinks);
	
	$("#sliderKincaidInfluence").val(((($("#sliderKincaidInfluence").val() / 100) / sum) * rest) * 100);
	$("#sliderFleschInfluence").val(((($("#sliderFleschInfluence").val() / 100) / sum) * rest) * 100);
	$("#sliderExternalRefsInfluence").val(((($("#sliderExternalRefsInfluence").val() / 100) / sum) * rest) * 100);
	$("#sliderAllLinksInfluence").val(((($("#sliderAllLinksInfluence").val() / 100) / sum) * rest) * 100);

	
	articleController.showQuality();
});
$("#sliderExternalRefsInfluence").change(function (e) {
	influenceExternalRefs = (($(this).val() / 100)).toFixed(2);
	var rest = parseFloat(1 - influenceExternalRefs);

	if ($("#sliderKincaidInfluence").val() == 0) {
		$("#sliderKincaidInfluence").val(1)
	}
	if ($("#sliderImageQualityInfluence").val() == 0) {
		$("#sliderImageQualityInfluence").val(1)
	}
	if ($("#sliderFleschInfluence").val() == 0) {
		$("#sliderFleschInfluence").val(1)
	}
	if ($("#sliderAllLinksInfluence").val() == 0) {
		$("#sliderAllLinksInfluence").val(1)
	}
	var sum = $("#sliderKincaidInfluence").val() / 100 + $("#sliderImageQualityInfluence").val() / 100 + $("#sliderFleschInfluence").val() / 100 + $("#sliderAllLinksInfluence").val() / 100;
	//var valueOtherSlider  = parseFloat(rest / (numberOfMetrics-1));

	influenceKincaid = parseFloat(((($("#sliderKincaidInfluence").val() / 100) / sum) * rest));
	influenceImageQuality = parseFloat(((($("#sliderImageQualityInfluence").val() / 100) / sum) * rest));
	influenceFlesch = parseFloat(((($("#sliderFleschInfluence").val() / 100) / sum) * rest));
	influenceAllLinks = parseFloat(((($("#sliderAllLinksInfluence").val() / 100) / sum) * rest));
	$("#sliderKincaidInfluence").val(((($("#sliderKincaidInfluence").val() / 100) / sum) * rest) * 100);
	$("#sliderImageQualityInfluence").val(((($("#sliderImageQualityInfluence").val() / 100) / sum) * rest) * 100);
	$("#sliderFleschInfluence").val(((($("#sliderFleschInfluence").val() / 100) / sum) * rest) * 100);
	$("#sliderAllLinksInfluence").val(((($("#sliderAllLinksInfluence").val() / 100) / sum) * rest) * 100);

	//console.log("sliderExternalRefsInfluence: " + influenceExternalRefs + " rest: " + rest);
	articleController.showQuality();
});
$("#sliderAllLinksInfluence").change(function (e) {
	influenceAllLinks = (($(this).val() / 100)).toFixed(2);
	var rest = parseFloat(1 - influenceAllLinks);

	if ($("#sliderKincaidInfluence").val() == 0) {
		$("#sliderKincaidInfluence").val(1)
	}
	if ($("#sliderImageQualityInfluence").val() == 0) {
		$("#sliderImageQualityInfluence").val(1)
	}
	if ($("#sliderExternalRefsInfluence").val() == 0) {
		$("#sliderExternalRefsInfluence").val(1)
	}
	if ($("#sliderFleschInfluence").val() == 0) {
		$("#sliderFleschInfluence").val(1)
	}
	var sum = $("#sliderKincaidInfluence").val() / 100 + $("#sliderImageQualityInfluence").val() / 100 + $("#sliderExternalRefsInfluence").val() / 100 + $("#sliderFleschInfluence").val() / 100;
	//var valueOtherSlider  = parseFloat(rest / (numberOfMetrics-1));

	influenceKincaid = parseFloat(((($("#sliderKincaidInfluence").val() / 100) / sum) * rest));
	influenceImageQuality = parseFloat(((($("#sliderImageQualityInfluence").val() / 100) / sum) * rest));
	influenceExternalRefs = parseFloat(((($("#sliderExternalRefsInfluence").val() / 100) / sum) * rest));
	influenceFlesch = parseFloat(((($("#sliderFleschInfluence").val() / 100) / sum) * rest));
	$("#sliderKincaidInfluence").val(((($("#sliderKincaidInfluence").val() / 100) / sum) * rest) * 100);
	$("#sliderImageQualityInfluence").val(((($("#sliderImageQualityInfluence").val() / 100) / sum) * rest) * 100);
	$("#sliderExternalRefsInfluence").val(((($("#sliderExternalRefsInfluence").val() / 100) / sum) * rest) * 100);
	$("#sliderFleschInfluence").val(((($("#sliderFleschInfluence").val() / 100) / sum) * rest) * 100);

	//console.log("sliderAllLinksInfluence: " + influenceAllLinks + " rest: " + rest);
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
	//------------------------------------------------------------------
	good_fleschWordCount = default_good_fleschWordCount;
	good_kinkaid = default_good_kinkaid;
	good_numPics = default_good_numPics;
	good_extLinks = default_good_extLinks;
	good_allLinks = default_good_allLinks;
	$("#numberFlesch").val(default_good_fleschWordCount);
	$("#numberKincaid").val(default_good_kinkaid);
	$("#numberImageQuality").val(default_good_numPics);
	$("#numberExternalRefs").val(default_good_extLinks);
	$("#numberAllLinks").val(default_good_allLinks);
	//------------------------------------------------------------------
	influenceFlesch = parseFloat((100 / numberOfMetrics) / 100);
	influenceKincaid = parseFloat((100 / numberOfMetrics) / 100);
	influenceImageQuality = parseFloat((100 / numberOfMetrics) / 100);
	influenceExternalRefs = parseFloat((100 / numberOfMetrics) / 100);
	influenceAllLinks = parseFloat((100 / numberOfMetrics) / 100);
	$("#sliderFleschInfluence").val(influenceFlesch * 100);
	$("#sliderKincaidInfluence").val(influenceKincaid * 100);
	$("#sliderImageQualityInfluence").val(influenceImageQuality * 100);
	$("#sliderExternalRefsInfluence").val(influenceExternalRefs * 100);
	$("#sliderAllLinksInfluence").val(influenceAllLinks * 100);
	articleController.showQuality();
}

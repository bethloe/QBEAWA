var QualityManager = function (vals) {
	var GLOBAL_renderer = vals.renderer;
	var GLBOAL_controller = vals.controller;

	var qualityManager = {};

	//Good values
	var good_flesch = 36;
	var good_fleschWordCount = 20000;
	var good_kinkaid = 12;
	var good_extLinks = 5;
	var good_iwlinks = 5;
	var good_numPics = 4;
	var good_allLinks = 30;

	var adaptValue = function (value) {
		value = parseFloat(value);
		if (value > 1)
			return 1;
		if (value < 0)
			return 0;
		return value.toFixed(1);
	}
	qualityManager.reset = function () {}

	qualityManager.calculateQuality = function (text, properties, tooltip) {
		//console.log("calculateQuality: " + JSON.stringify(properties));
		var parameters = {};
		//console.log("HERE TEXT: " + tooltip + ": "+ text);
		var stat = new textstatistics(text);
		var flesch = stat.fleschKincaidReadingEase();
		var kincaid = stat.fleschKincaidGradeLevel();
		var fleschWordCount = flesch * text.split(' ').length;
		var qualityFleschWordCount = adaptValue(fleschWordCount / good_fleschWordCount);
		var qualityFlesch = adaptValue(flesch / good_flesch);
		var qualityKincaid = adaptValue(kincaid / good_kinkaid);
		if (properties != undefined) {

			var numImages = properties.images.length;
			var externalRefs = properties.externallinks.length;
			//var internalLinks = properties.iwlinks.length;
			var allLinks = properties.links.length;
			var qualityImages = adaptValue(numImages / good_numPics);
			var qualityExternalRefs = adaptValue(externalRefs / good_extLinks);
			//var qualityInternalLinks = adaptValue(internalLinks / good_iwlinks);
			var qualityAllLinks = adaptValue(allLinks / good_allLinks);
		

			qualityFleschWordCount = parseFloat(adaptValue(parseFloat(qualityFleschWordCount) * parseFloat(weightFlesch)));
			qualityKincaid = parseFloat(adaptValue(parseFloat(qualityKincaid) * parseFloat(weightKincaid)));
			qualityImages = parseFloat(adaptValue(parseFloat(qualityImages) * parseFloat(weightImageQuality)));
			qualityExternalRefs = parseFloat(adaptValue(parseFloat(qualityExternalRefs) * parseFloat(weightExternalRefs)));
			qualityAllLinks = parseFloat(adaptValue(parseFloat(qualityAllLinks) * parseFloat(weightAllLinks)));

			var help = (parseFloat(((parseFloat(qualityFleschWordCount) * parseFloat(influenceFlesch) + parseFloat(qualityKincaid) * parseFloat(influenceKincaid) + parseFloat(qualityImages) * parseFloat(influenceImageQuality) + parseFloat(qualityExternalRefs) * parseFloat(influenceExternalRefs)/*+ parseFloat(qualityInternalLinks)*/
							 + parseFloat(qualityAllLinks) * parseFloat(influenceAllLinks)))));
			//help = help / 5;

			var score = help;
			//console.log(tooltip + "SCORE: " + score + " " + numImages + " / " + good_numPics + " = " + qualityImages);

			parameters.qualityFleschWordCount = qualityFleschWordCount; //parseFloat(adaptValue(parseFloat(qualityFleschWordCount) * parseFloat(weightFlesch)));
			parameters.qualityKincaid = qualityKincaid; //parseFloat(adaptValue(parseFloat(qualityKincaid) * parseFloat(weightKincaid)));
			parameters.qualityImages = qualityImages; //parseFloat(adaptValue(parseFloat(qualityImages) * parseFloat(weightImageQuality)));
			parameters.qualityExternalRefs = qualityExternalRefs; //parseFloat(adaptValue(parseFloat(qualityExternalRefs) * parseFloat(weightExternalRefs)));
			//parameters.qualityInternalLinks =  parseFloat(qualityInternalLinks);
			parameters.qualityAllLinks = qualityAllLinks; //parseFloat(adaptValue(parseFloat(qualityAllLinks) * parseFloat(weightAllLinks)));
			//parameters.flesch = flesch;
			//parameters.wordcount = text.split(' ').length;
			//parameters.fleschWordCount = fleschWordCount;
			//parameters.kincaid = kincaid;
			//parameters.numImages = numImages;
			//parameters.externalRefs = externalRefs;
			//parameters.allLinks = allLinks;
			parameters.score = score;
		//	console.log("calculateQuality flesch and knincaid: " + tooltip + " " + fleschWordCount + " " + flesch + " " + kincaid + " IWLINKGS: " + allLinks + " " + qualityAllLinks + " " + parameters.qualityAllLinks);

			return parameters;
		} else {
			console.log("properties are undefined : ");
		}
		return 0;
	}

	return qualityManager;
};

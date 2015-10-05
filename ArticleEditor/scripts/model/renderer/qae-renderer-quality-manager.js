var QualityManager = function (vals) {
	var GLOBAL_renderer = vals.renderer;
	var GLBOAL_controller = vals.controller;

	var qualityManager = {};

	var adaptValue = function (value) {
		value = parseFloat(value);
		if (value > 1)
			return 1;
		if (value < 0)
			return 0;
		return value.toFixed(1);
	}
	qualityManager.reset = function () {}

	qualityManager.countRefsOfSection = function (text) {
		text += "";
		subString = "<ref";
		subString += "";
		if (subString.length <= 0)
			return text.length + 1;

		var n = 0,
		pos = 0;
		var step = subString.length;
		while (true) {
			pos = text.indexOf(subString, pos);
			if (pos >= 0) {
				n++;
				pos += step;
			} else
				break;
		}
		return n;
	}
	
	function numberOfInternalLinks(textOfSection){
			var patt = /\[\[[^\]\]]*\]\]/g;
				var res = textOfSection.match(patt);
			var ret = 0;
			if(res != null)
				ret = res.length;
			return ret;
	}
	
	function trimToOneParagraph(textOfSection, sectionName) {
		var hIndex = textOfSection.indexOf(sectionName);
		var hi = 0;

		if (hIndex > -1) {
			while (textOfSection[hIndex + hi] != "=") {
				hi++;
			}
			while (textOfSection[hIndex + hi] == "=") {
				hi++;
			}
			var help = textOfSection.substr(hIndex + hi).indexOf("==");
			/*while (textOfSection[hIndex + hi] != "=") {
			hi++;
			}*/
			return textOfSection.substr(0, hIndex + hi + help);
		} else {
			/*console.log("-----------------------------------------------------");
			console.log("SECTIONNAME: " + sectionName);
			console.log("TEXTOFSECTION: " + textOfSection);
			console.log("-----------------------------------------------------");*/
		}
		return textOfSection;
	}

	qualityManager.calculateQuality = function (text, properties, tooltip, wikiText) {

		//console.log("calculateQuality: " + JSON.stringify(properties));
		var parameters = {};
		//console.log("HERE TEXT: " + text);

		var sensiumRequester = GLBOAL_controller.getSensiumRequester();
		var textforSensium = text.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
		textforSensium = textforSensium.toString().replace(/"/g, '\\"');
		var sectionName = tooltip;
		sensiumRequester.sensiumTextRequest(textforSensium, sectionName);

		var stat = new textstatistics(text);
		var flesch = 0;
		var kincaid = 0;
		if (text != "" && text != undefined) {
			flesch = stat.fleschKincaidReadingEase();
			kincaid = stat.fleschKincaidGradeLevel();
		}
		var fleschWordCount = flesch * text.split(' ').length;
		var qualityFleschWordCount = adaptValue(fleschWordCount / good_fleschWordCount);
		var qualityFlesch = adaptValue(flesch / good_flesch);
		var qualityKincaid = adaptValue(kincaid / good_kinkaid);

		var textOfSection = "";

		if (properties.sections.length > 1) {
			textOfSection = properties.wikitext['*'];
			textOfSection = trimToOneParagraph(textOfSection, properties.sections[0].line);
		} else {
			textOfSection = properties.wikitext['*'];
		}
		var refsInSection = qualityManager.countRefsOfSection(textOfSection);
		console.log(sectionName + ": " + refsInSection);
	//	console.log(refsInSection +" refsInSection = " + text);
	//	console.log("refsInSection2 = " + textOfSection);
		if (properties != undefined) {

			var numImages = properties.images.length;
			var externalRefs = properties.externallinks.length + refsInSection;
			var internalLinks = properties.iwlinks.length;
			//console.log("HERE!!! " + sectionName + " " + properties.iwlinks.length);
			//for(var i = 0; i < properties.iwlinks.length; i++){
			//	console.log("LINKS: " + JSON.stringify(properties.iwlinks[i]));
			//}
			var allLinks = numberOfInternalLinks(textOfSection);//properties.links.length;
			console.log("SECTION: " + sectionName + " NUMBER ALL LINKS: " + allLinks); 
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
			//parameters.fleschReadingEase = parseFloat(qualityFlesch);
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

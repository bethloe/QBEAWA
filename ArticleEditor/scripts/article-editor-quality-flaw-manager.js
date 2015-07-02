var QualityFlawManager = function (vals) {
	//	var GLOBAL_renderer = vals.renderer;
	//	var GLBOAL_controller = vals.controller;

	var qualityFlawManager = {};

	var cleanUpTags = [{
			name : "{{unreferenced",
			alias : "The article does not contain any references or sources!",
			description : "This article does not cite any references or sources. Please help improve this article by adding citations to reliable sources. Unsourced material may be challenged and removed."
		}, {
			name : "{{unreferenced section",
			alias : "Section without references!",
			description : "This section does not cite any references or sources. Please help improve this section by adding citations to reliable sources. Unsourced material may be challenged and removed."
		}, {
			name : "{{orphan",
			alias : "The article has fewer then tree incoming links!",
			description : "Use this for articles that aren't linked to from any other pages."
		}, {
			name : "{{refimprove",
			alias : "Additional citations for verification is needed!",
			description : "This article needs additional citations for verification. Please help improve this article by adding citations to reliable sources. Unsourced material may be challenged and removed."
		}, /* {
		name : "{{refimprove section",
		alias : "A section needs additional citations!",
		description : "This section needs additional citations for verification. Please help improve this article by adding citations to reliable sources. Unsourced material may be challenged and removed."
		},*/
		{
			name : "{{refimprove science",
			alias : "The article need additional citations!",
			description : "This article needs additional citations to secondary or tertiary sources such as review articles, monographs, or textbooks. Please add references to provide context and establish notability for any primary research articles cited."
		}, {
			name : "{{film IMDb refimprove",
			alias : "This media article uses IMDb for verification!",
			description : "This media article uses IMDb for verification. IMDb may not be a reliable source for film and television information and is generally only cited as an external link. Please help by replacing IMDb with third-party reliable sources"
		}, {
			name : "{{BLP IMDb refimprove",
			alias : "This biographical article needs additional citations!",
			description : "This biographical article needs additional citations for verification, as it includes attribution to IMDb. IMDb may not be a reliable source for biographical information. Please help by adding additional, reliable sources for verification. Contentious material about living persons that is unsourced or poorly sourced must be removed immediately, especially if potentially libelous or harmful."
		}, {
			name : "{{Empty section",
			alias : "There is an empty section in the article!",
			description : "The article has at least one section that is empty!"
		}, {
			name : "{{No content",
			alias : "There is an empty section in the article!",
			description : "The article has at least one section that is empty"
		}, {
			name : "{{notability",
			alias : "The topic may not meet Wikipedia's general notability guideline!",
			description : "The topic of this article may not meet Wikipedia's general notability guideline. Please help to establish notability by adding reliable, secondary sources about the topic. If notability cannot be established, the article is likely to be merged, redirected, or deleted."
		}, {
			name : "{{no footnotes",
			alias : "There are no footnotes in the article!",
			description : "This article includes a list of references, related reading or external links, but its sources remain unclear because it lacks inline citations. Please improve this article by introducing more precise citations."
		}, {
			name : "{{primary sources",
			alias : "This article relies too much on references to primary sources!",
			description : "This article relies too much on references to primary sources. Please improve this article by adding secondary or tertiary sources."
		}, {
			name : "{{MOS",
			alias : "The article needs editing for compliance with Wikipedia's Manual of Style!",
			description : "This needs editing for compliance with Wikipedia's Manual of Style. Please improve this if you can."
		}, {
			name : "{{underlinked",
			alias : "This article needs more links to other articles to help integrate it into the encyclopedia!",
			description : "This article needs more links to other articles to help integrate it into the encyclopedia. Please help improve this article by adding links that are relevant to the context within the existing text."
		}, {
			name : "{{overlinked",
			alias : "This may have too many links to other articles!",
			description : "This may have too many links to other articles, and could require cleanup to meet Wikipedia's quality standards. Per the Wikipedia style guidelines, please remove duplicate links, and any links that are not relevant to the context."
		}, {
			name : "{{dead end",
			alias : "This article has no links to other Wikipedia articles!",
			description : "This article has no links to other Wikipedia articles. Please help improve this article by adding links that are relevant to the context within the existing text."
		}, {
			name : "{{cleanup-HTML",
			alias : "This article uses HTML markup!",
			description : "This uses HTML markup. Please help by changing HTML markup to wiki markup where appropriate. For more details, see HTML in wikitext. Bear in mind that some HTML elements (e.g., the <sup></sup> and <sub></sub> tags) should not be removed. See Help:Wikitext examples for a list of non-deprecated HTML tags."
		}, {
			name : "{{cleanup-bare URLs",
			alias : "This article uses bare URLs for citations, which may be threatened by link rot!",
			description : "This article uses bare URLs for citations, which may be threatened by link rot. Please consider adding full citations so that the article remains verifiable. Several templates and the reFill tool are available to assist in formatting. (reFill documentation)"
		}, {
			name : "{{format footnotes",
			alias : "This article includes inline citations, but they are not properly formatted!",
			description : "This article includes inline citations, but they are not properly formatted. Please improve this article by correcting them."
		}, {
			name : "{{citation style",
			alias : "This article has an unclear citation style!",
			description : "This article has an unclear citation style. The references used may be made clearer with a different or consistent style of citation, footnoting, or external linking"
		}, {
			name : "{{sections",
			alias : "This article should be divided into sections by topic, to make it more accessible!",
			description : "This article should be divided into sections by topic, to make it more accessible. Please help by adding section headings in accordance with Wikipedia's Manual of Style"
		}, {
			name : "{{lead missing",
			alias : "This article has no lead section. Please help by adding an introductory section to this article!",
			description : "This article has no lead section. Please help by adding an introductory section to this article. For more information, see the layout guide, and Wikipedia's lead section guidelines."
		}, {
			name : "{{lead too short",
			alias : "This article's lead section may not adequately summarize key points of its contents!",
			description : "This article's lead section may not adequately summarize key points of its contents. Please consider expanding the lead to provide an accessible overview of all important aspects of the article."
		}, {
			name : "{{lead too long",
			alias : "This article's introduction may be too long for the overall article length!",
			description : "This article's introduction may be too long for the overall article length. Please help by moving some material from it into the body of the article. For more information please read the layout guide and Wikipedia's lead section guidelines."
		}, {
			name : "{{inadequate lead",
			alias : "This article's introduction section may not adequately summarize its contents!",
			description : "This article's introduction section may not adequately summarize its contents. To comply with Wikipedia's lead section guidelines, please consider modifying the lead to provide an accessible overview of the article's key points in such a way that it can stand on its own as a concise version of the article."
		}, {
			name : "{{lead rewrite",
			alias : "The lead section of this article may need to be rewritten!",
			description : "The lead section of this article may need to be rewritten. Please discuss this issue on the talk page and read the layout guide to make sure the section will be inclusive of all essential details."
		}, {
			name : "{{advert",
			alias : "The article is written like an advert!",
			description : "This article contains content that is written like an advertisement. Please help improve it by removing promotional content and inappropriate external links, and by adding encyclopedic content written from a neutral point of view."
		}, {
			name : "{{original research",
			alias : "This article possibly contains original research!",
			description : "This article possibly contains original research. Please improve it by verifying the claims made and adding inline citations. Statements consisting only of original research should be removed."
		}, {
			name : "{{unreliable sources",
			alias : "Some or all of this article's listed sources may not be reliable!",
			description : "Some or all of this article's listed sources may not be reliable. Please help this article by looking for better, more reliable sources, or by checking whether the references meet the criteria for reliable sources. Unreliable citations may be challenged or deleted."
		}, {
			name : "{{unreliable source?",
			alias : "There is a source which is not reliable!",
			description : "Wikipedia articles should be based on reliable, published sources, making sure that all majority and significant minority views that have appeared in those sources are covered."
		}, {
			name : "{{citation needed",
			alias : "A citation is needed!",
			description : "Please add a citation."
		}, {
			name : "{{citation needed span",
			alias : "A citation is needed!",
			description : "Please add a citation."
		}, {
			name : "{{citation needed (lead)",
			alias : "A citation is needed!",
			description : "Please add a citation."
		}, {
			name : "{{cleanup",
			alias : "A cleanup is needed!",
			description : "This article may require cleanup to meet Wikipedia's quality standards. No cleanup reason has been specified. Please help improve this article if you can; the talk page may contain suggestions."
		}, {
			name : "{{subscription required",
			alias : "Subscription required!",
			description : "Subscription required!"
		}
	]

	qualityFlawManager.reset = function () {}

	var getSectionName = function (index, wikiarticleText) {
		//We go back till we find the section name
		var str = wikiarticleText.substring(0, index);
		var equalsFound = false;
		var sectionName = "";
		for (var i = str.length - 1; i > 0; i--) {
			if (!equalsFound) {
				if (str[i] == "=" && str[i - 1] == "=") {
					while (str[i - 1] == "=")
						i--;
					equalsFound = true;
				}
			} else {
				if (str[i] != "=") {
					sectionName += str[i];
					cutSectionName = true;
				} else {
					sectionName = reverseString(sectionName);
					if (sectionName[sectionName.length - 1] == " ")
						sectionName = sectionName.substring(0, sectionName.length - 1);
					if (sectionName[0] == " ")
						sectionName = sectionName.substring(1, sectionName.length);
					return sectionName;
				}
			}
		}
		return "Introduction";

	}

	qualityFlawManager.getQualityFlaws = function (wikiarticleText) {
		var cleanUpTagFound = [];
		var htmlQF = "";
		var colorCnt = 0;
		var wikiarticleTextLowerCase = wikiarticleText.toLowerCase();
		for (var i = 0; i < cleanUpTags.length; i++) {
			var cleanUpTag = cleanUpTags[i];
			var index = 0;
			var indexSum = 0;
			var articleHelper = wikiarticleTextLowerCase;
			while (index > -1) {
				if (index != 0)
					articleHelper = articleHelper.substring((index + 2), articleHelper.length);
				index = articleHelper.indexOf(cleanUpTag.name);
				indexSum += index;
				console.log("INDEX: " + indexSum);
				if (index == 0)
					index++;
				if (index > -1) {
					cleanUpTagFound.push({
						name : cleanUpTag.name,
						description : cleanUpTag.description
					});
					var sectionName = getSectionName(indexSum, wikiarticleText);
					if (sectionName == null)
						alert("ERROR SECTION NAME IS NULL " + indexSum);
					else {

						//sectionName = sectionName.replace(/[^\w\s]/gi, '');
						//sectionName = sectionName.replace(/ /g, "_");
						//htmlQF += "<tr><td style=\"background-color: #525252;\"title=\""+cleanUpTag.name +":"+ cleanUpTag.description+"\"> <img src=\"media/error.png\" />" + cleanUpTag.alias + "</td><tr>";
						htmlQF += "<div id=\"notification-" + i + "\"class=\"notificationDiv\" title=\"" + cleanUpTag.name + ":" + cleanUpTag.description + "\" onclick=\"articleController.goToSection('" + sectionName + "', '" + cleanUpTag.name + "')\"> <img style=\"display: inline-block; vertical-align: middle\" src=\"media/warning.png\" /> &nbsp;" + cleanUpTag.alias + " &nbsp;&nbsp;&nbsp;   <img style=\"display: inline-block; vertical-align: middle; \" src=\"media/discard-without-background-small.png\"  onclick=\"removeThisNotification(" + i + ")\"/></div>";
						colorCnt++;
						if (colorCnt == 9)
							colorCnt = 0;
					}
				}
			}
		}
		htmlQF += "";
		$('#qualityFlawViewText').html(htmlQF);
		return cleanUpTagFound;
	}

	return qualityFlawManager;
};

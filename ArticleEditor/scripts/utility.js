var reverseString = function (s) {
	return s.split("").reverse().join("");
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function deleteEqualsSigns(str, cnt /*to cancle the procedure*/
) {
	if (str.search("==") == 0 && cnt < 5)
		str = deleteEqualsSigns(str.substring(2, str.length), cnt + 1);
	else if (str.search(" ==") == 0 && cnt < 5)
		str = deleteEqualsSigns(str.substring(3, str.length), cnt + 1);

	return str;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

String.prototype.replaceAt = function (index, character) {
	return this.substr(0, index) + character + this.substr(index + character.length);
}

String.prototype.replaceAtHelp = function (index, character) {
	return this.substr(0, index) + character + this.substr(index - 1 + character.length);
}

String.prototype.replaceHtmlEntites = function () {
	var s = this;
	var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
	var translate = {
		"nbsp" : " ",
		"amp" : "&",
		"quot" : "\"",
		"lt" : "<",
		"gt" : ">"
	};
	return (s.replace(translate_re, function (match, entity) {
			return translate[entity];
		}));
};

function replaceCharacterWithAnother(str, find, replace, n) {
	var cnt = 0;
	for (var i = 0; i < str.length; i++) {
		if (str[i] == find) {
			cnt += 1;
		}
		if (cnt == n) {
			str = str.replaceAt(i, replace);
			cnt = 0;
		}
	}
	return str;
}

function repalceNewLineWithTwoNewLines(str, find, replace, n) {
	var cnt = 0;
	for (var i = 0; i < str.length; i++) {
		if (str[i] == find) {
			cnt += 1;
		}
		if (cnt == n) {
			str = str.replaceAtHelp(i, replace);
			cnt = 0;
			i++;
		}
	}
	return str;
}

var getSectionToRef = function (rawText, ref) {
	var str = rawText.substring(0, rawText.search(ref));
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
}

function copyAllNodes(source, dest) {
	var items = source.get();
	for (var i = 0; i < items.length; i++) {
		dest.add(items[i]);
	}
}

function copyAllNodesInRange(source, dest, minID, maxID) {
	var items = source.get();
	for (var i = 0; i < items.length; i++) {
		if (items[i].id >= minID && items[i].id <= maxID)
			dest.add(items[i]);
	}
}

jQuery.fn.highlight = function (str, className) {
	var regex = new RegExp(str, "gi");
	return this.each(function () {
		$(this).contents().filter(function () {
			return this.nodeType == 3 && regex.test(this.nodeValue);
		}).replaceWith(function () {
			return (this.nodeValue || "").replace(regex, function (match) {
				return "<span class=\"" + className + "\">" + match + "</span>";
			});
		});
	});
};

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
		r : parseInt(result[1], 16),
		g : parseInt(result[2], 16),
		b : parseInt(result[3], 16)
	}
	 : null;
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

function errorHandler(e) {
	var msg = '';

	switch (e.name) {
	case FileError.QUOTA_EXCEEDED_ERR:
		msg = 'QUOTA_EXCEEDED_ERR';
		break;
	case FileError.NOT_FOUND_ERR:
		msg = 'NOT_FOUND_ERR';
		break;
	case FileError.SECURITY_ERR:
		msg = 'SECURITY_ERR';
		break;
	case FileError.INVALID_MODIFICATION_ERR:
		msg = 'INVALID_MODIFICATION_ERR';
		break;
	case FileError.INVALID_STATE_ERR:
		msg = 'INVALID_STATE_ERR';
		break;
	default:
		msg = 'Unknown Error: ' + e.name + " MESSAGE: " + e.message;
		break;
	};

	console.log('Error: ' + msg);
}

function createNewLogFile(fs) {

	var now = new Date();
	var logFileName = now.getTime() / 1000;
	GLOBAL_fs = fs;
	console.log("GLOABAL FS: " + GLOBAL_fs + " " + logFileName + ".txt");
	fs.root.getFile("C:\\"+logFileName + ".txt", {
		create : true,
		exclusive : true
	}, function (fileEntry) {

		// Create a FileWriter object for our FileEntry (log.txt).
		fileEntry.createWriter(function (fileWriter) {

			fileWriter.onwriteend = function (e) {
				console.log('Write completed.');
			};

			fileWriter.onerror = function (e) {
				console.log('Write failed: ' + e.toString());
			};

			// Create a new Blob and write it to log.txt.
			var blob = new Blob(['Lorem Ipsum'], {
					type : 'text/plain'
				});

			fileWriter.write(blob);

		}, errorHandler);

	}, errorHandler);

	GLOBAL_logger = logFileName;
}

function logToFile(fileName, message) {
	console.log("sdfGLOABAL FS: " + GLOBAL_fs);
	GLOBAL_fs.root.getFile(fileName, {
		create : false
	}, function (fileEntry) {

		// Create a FileWriter object for our FileEntry (log.txt).
		fileEntry.createWriter(function (fileWriter) {

			fileWriter.seek(fileWriter.length); // Start write position at EOF.

			// Create a new Blob and write it to log.txt.
			var blob = new Blob([message], {
					type : 'text/plain'
				});

			fileWriter.write(blob);

		}, errorHandler);

	}, errorHandler);

}

function saveStringToDisk(str) {
	window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

	window.requestFileSystem(window.TEMPORARY, 1024 * 1024, function (fs) {
		fs.root.getFile('test.bin', {
			create : true
		}, function (fileEntry) { // test.bin is filename
			fileEntry.createWriter(function (fileWriter) {
				var arr = new Uint8Array(3); // data length

				arr[0] = 97; // byte data; these are codes for 'abc'
				arr[1] = 98;
				arr[2] = 99;

				var blob = new Blob([str]);

				fileWriter.addEventListener("writeend", function () {
					// navigate to file, will download
					location.href = fileEntry.toURL();
				}, false);

				fileWriter.write(blob);
			}, function () {});
		}, function () {});
	}, function () {});
}

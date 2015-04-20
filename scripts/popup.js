var popup_zustand = false;
var popup_article_editor_state = false;

function openQMEditor() {
	if (popup_zustand == false) {
		$("#popup").fadeIn("normal");
		$("#hintergrund").css("opacity", "0.7");
		$("#hintergrund").fadeIn("normal");
		popup_zustand = true;
	}

	return false;
}


function colseQMEditor() {
	if (popup_zustand == true) {
		$("#popup").fadeOut("normal");
		$("#hintergrund").fadeOut("normal");
		popup_zustand = false;
	}
}

function openArticleEditor() {
	if (popup_article_editor_state == false) {
		$("#popup_article_editor").fadeIn("normal");
		$("#hintergrund").css("opacity", "0.7");
		$("#hintergrund").fadeIn("normal");
		popup_article_editor_state = true;
	}

	return false;
}


function colseArticleEditor() {
	if (popup_article_editor_state == true) {
		$("#popup_article_editor").fadeOut("normal");
		$("#hintergrund").fadeOut("normal");
		popup_article_editor_state = false;
	}
}

jQuery(function ($) {

	$(".popup_oeffnen").click(function () {
		openQMEditor();
	});

	$(".schliessen").click(function () {
		colseQMEditor();
	});
	
	$(".close_article_editor").click(function () {
		colseArticleEditor();
	});

	
	$(".open_popup_article_editor").click(function () {
		openArticleEditor();
	});

});

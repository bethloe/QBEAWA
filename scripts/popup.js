var popup_zustand = false;

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

jQuery(function ($) {

	$(".popup_oeffnen").click(function () {
		openQMEditor();
	});

	$(".schliessen").click(function () {
		colseQMEditor();
	});

});

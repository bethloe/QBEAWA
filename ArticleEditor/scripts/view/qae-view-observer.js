
$('#changeLayoutTreeId').change(function () {
	if ($(this).is(":checked")) {

		$('#mynetworkouter').css("visibility", "visible");
	} else {
		$('#mynetworkouter').css("visibility", "hidden");
	}
});

$('#changeLayoutTextId').change(function () {
	if ($(this).is(":checked")) {
		$('#wikiText').css("visibility", "visible");

	} else {
		$('#wikiText').css("visibility", "hidden");
	}
});

$('#changeLayoutInformationId').change(function () {
	if ($(this).is(":checked")) {
		$('#optionPanel').css("visibility", "visible");

	} else {
		$('#optionPanel').css("visibility", "hidden");
	}
});

  $(function () {
  	//$('#editor').wysiwyg();
	
	$('#wikiTextTextarea').markItUp(mySettings);
  	$('#node-label').markItUp(mySettings);
  		$('#createSectionTextArea').markItUp(mySettings);
  });

  $("#dialog").dialog({
  	autoOpen : false,
  	width : 1000,
  	modal : true
  });
  
    $("#dialogCompare").dialog({
  	autoOpen : false,
  	width : 940,
  	height : 800,
	resizable: false
  });

  $("#articleViewer").dialog({
  	autoOpen : false,
  	width : 1000,
  	height : 800,
  	modal : true
  });

  $("#dialogLogin").dialog({
  	autoOpen : false,
  	width : 400,
  	height : 210,
  	modal : true
  });

  
  $("#dialogChangeLayout").dialog({
  	autoOpen : false,
  	width : 220,
  	height : 130,
  	modal : false,
  	close : function () {  	}
  });
  $("#dialogSettings").dialog({
  	autoOpen : false,
  	width : 400,
  	height : 580,
  	modal : false,
	close : function(){
			if ($('#showSettings a span').attr("class") == "ca-icon") {
			$('#showSettings a span').attr("class", "ca-icon-selected");
			$('#showSettings a div h2').attr("class", "ca-main-selected");
			$('#showSettings').css("background-color", "#000");
		} else {
			$('#showSettings a span').attr("class", "ca-icon");
			$('#showSettings a div h2').attr("class", "ca-main");
			$('#showSettings').css("background-color", "grey");
		}
	}
  });

  $("#dialogCreateNewNode").dialog({
  	autoOpen : false,
  	width : 1000,
  	height : 800,
  	modal : false
  });
  
  $("#dialogEditInProgres").dialog({
  	autoOpen : false,
  	width : 400,
  	height : 150,
  	modal : true
  });
  
 
  
  $("#uploadSelect").change(function () {
  	console.log($(this).val());
  	if ($(this).val() == "Section") {
  		$("#uploadDiv").html("<textarea id=\"createSectionTextArea\" rows=\"30\" cols=\"100\" ></textarea>");
  		$('#createSectionTextArea').markItUp(mySettings);
  	} else if ($(this).val() == "Image") {
  		$("#uploadDiv").html("<input  type=\"file\" id=\"file-input\"> <div id=\"fileDisplayArea\"></div>");
  		var fileInput = document.getElementById('file-input');
  		var fileDisplayArea = document.getElementById('fileDisplayArea');

  		fileInput.addEventListener('change', function (e) {
  			var file = fileInput.files[0];
  			var imageType = /image.*/;

  			if (file.type.match(imageType)) {
  				var reader = new FileReader();

  				reader.onload = function (e) {
  					fileDisplayArea.innerHTML = "";

  					var img = new Image();
  					//console.log("READER RESULT: " + reader.result);
  					img.src = reader.result;
  					currentImageSrc = reader.result;
  					img.id = "imageToUpload";
  					fileDisplayArea.appendChild(img);
  				}

  				reader.readAsDataURL(file);
  			} else {
  				fileDisplayArea.innerHTML = "File not supported!"
  			}
  		});
  	}
  });
  
  var rotateRight = function(){
	 console.log("ROTATERIGHT");
	 var canvas = document.getElementsByTagName("canvas")[0];
	 console.log(canvas);
	 var ctx = 	 canvas.getContext('2d');
	ctx.translate(canvas.width/2,canvas.height/2);
    ctx.rotate(90*(Math.PI/180));
    ctx.translate(-canvas.width/2,-canvas.height/2);
	
  }
  	var clickstophelper = function(){
		console.log("IN clickstophelper");
		if (!e)
				var e = window.event;
			e.cancelBubble = true;
			if (e.stopPropagation)
				e.stopPropagation();
	}
	
  var isChangeLayout = false;
  var changeLayout = function () {
  
  
	if ($('#changeLayout a span').attr("class") == "ca-icon") {
		$('#changeLayout a span').attr("class", "ca-icon-selected");
		$('#changeLayout a div h2').attr("class", "ca-main-selected");
		$('#changeLayout').css("background-color", "#000");

		$("#dialogChangeLayout").dialog("open");
	} else {
		$('#changeLayout a span').attr("class", "ca-icon");
		$('#changeLayout a div h2').attr("class", "ca-main");
		$('#changeLayout').css("background-color", "grey");

		$("#dialogChangeLayout").dialog("close");
	}
	if (!isChangeLayout) {
  		$("#mynetworkouter").draggable({
  			axis : "x",
  			start : function () {},
  			drag : function () {
  			},
  			stop : function () {}
  		});
  		$("#wikiText").draggable({
  			axis : "x",
  			start : function () {},
  			drag : function () {
  			},
  			stop : function () {
  			}

  		});
  		$("#optionPanel").draggable({
  			axis : "x",

  			start : function () {},
  			drag : function () {
  			},
  			stop : function () {}

  		});
  		$("#mynetworkouter").draggable("enable");
  		$("#wikiText").draggable("enable");
  		$("#optionPanel").draggable("enable");
  		isChangeLayout = true;
		$("#lockUnockImage").attr("src", "media/lock_open.png");
		$("#changeLayout").find(".ca-icon-selected").html("w");
		$("#changeLayout").find(".ca-icon").html("w");
		$('#mynetworkouter').resizable({
			helper : "ui-resizable-helper",
			ghost : true,
			stop : function (event, ui) {
				console.log("HALLO " + $("#mynetworkouter").width());
				$("#mynetwork").css("width", $("#mynetworkouter").width());
				$("#mynetworkCompareDiv").css("width", $("#mynetworkouter").width() - 360);
				$("#mynetworkCompare").css("width", $("#mynetworkouter").width() - 360);
				
			}
		});
		$('#wikiText').resizable({
			helper : "ui-resizable-helper",
			ghost : true
		});
  	} else {
  		console.log("IN HERE changeLayout2")
  		$("#mynetworkouter").draggable("disable");
  		$("#wikiText").draggable("disable");
  		$("#optionPanel").draggable("disable");
  		isChangeLayout = false;
		$("#changeLayout").find(".ca-icon-selected").html("x");
		$("#changeLayout").find(".ca-icon").html("x");
		$("#lockUnockImage").attr("src","media/lock_closed.png");
		$( "#mynetworkouter" ).resizable( "destroy" );
		$( "#wikiText" ).resizable( "destroy" );
  	}
  }
  $(document).ready(function () {
  	function scrollHorizontally(e) {
  		e = window.event || e;
  		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
  		document.getElementById('mainContent').scrollLeft -= (delta * 40); // Multiplied by 40
  		e.preventDefault();
  	}
  	(function () {

  		if (document.getElementById('mainContent').addEventListener) {
  			// IE9, Chrome, Safari, Opera
  			document.getElementById('mainContent').addEventListener("mousewheel", scrollHorizontally, false);
  			// Firefox
  			document.getElementById('mainContent').addEventListener("DOMMouseScroll", scrollHorizontally, false);
  		} else {
  			// IE 6/7/8
  			document.getElementById('mainContent').attachEvent("onmousewheel", scrollHorizontally);
  		}
  	})();
  	var width = 0;

  	$("#wikiText").mouseover(function () {
  		document.getElementById('mainContent').removeEventListener('mousewheel', scrollHorizontally, false);
  		document.getElementById('mainContent').removeEventListener('DOMMouseScroll', scrollHorizontally, false);
  	});

  	$("#wikiText").mouseout(function () {
  		if (document.getElementById('mainContent').addEventListener) {
  			// IE9, Chrome, Safari, Opera
  			document.getElementById('mainContent').addEventListener("mousewheel", scrollHorizontally, false);
  			// Firefox
  			document.getElementById('mainContent').addEventListener("DOMMouseScroll", scrollHorizontally, false);
  		} else {
  			// IE 6/7/8
  			document.getElementById('mainContent').attachEvent("onmousewheel", scrollHorizontally);
  		}
  	});
  	$("#mynetworkouter").mouseover(function () {
  		document.getElementById('mainContent').removeEventListener('mousewheel', scrollHorizontally, false);
  		document.getElementById('mainContent').removeEventListener('DOMMouseScroll', scrollHorizontally, false);
  	});

  	$("#mynetworkouter").mouseout(function () {
  		if (document.getElementById('mainContent').addEventListener) {
  			// IE9, Chrome, Safari, Opera
  			document.getElementById('mainContent').addEventListener("mousewheel", scrollHorizontally, false);
  			// Firefox
  			document.getElementById('mainContent').addEventListener("DOMMouseScroll", scrollHorizontally, false);
  		} else {
  			// IE 6/7/8
  			document.getElementById('mainContent').attachEvent("onmousewheel", scrollHorizontally);
  		}

  	});

  	$("#qualityFlawView").mouseover(function () {
  		document.getElementById('mainContent').removeEventListener('mousewheel', scrollHorizontally, false);
  		document.getElementById('mainContent').removeEventListener('DOMMouseScroll', scrollHorizontally, false);
  	});

  	$("#qualityFlawView").mouseout(function () {
  		if (document.getElementById('mainContent').addEventListener) {
  			// IE9, Chrome, Safari, Opera
  			document.getElementById('mainContent').addEventListener("mousewheel", scrollHorizontally, false);
  			// Firefox
  			document.getElementById('mainContent').addEventListener("DOMMouseScroll", scrollHorizontally, false);
  		} else {
  			// IE 6/7/8
  			document.getElementById('mainContent').attachEvent("onmousewheel", scrollHorizontally);
  		}
  	});
  	//$('#optionPanel').resizable();


  	$("#qualityParameters").mouseover(function () {
  		document.getElementById('mainContent').removeEventListener('mousewheel', scrollHorizontally, false);
  		document.getElementById('mainContent').removeEventListener('DOMMouseScroll', scrollHorizontally, false);
  	});

  	$("#qualityParameters").mouseout(function () {
  		if (document.getElementById('mainContent').addEventListener) {
  			// IE9, Chrome, Safari, Opera
  			document.getElementById('mainContent').addEventListener("mousewheel", scrollHorizontally, false);
  			// Firefox
  			document.getElementById('mainContent').addEventListener("DOMMouseScroll", scrollHorizontally, false);
  		} else {
  			// IE 6/7/8
  			document.getElementById('mainContent').attachEvent("onmousewheel", scrollHorizontally);
  		}
  	});
  	$('#mytoggle').toggles({
  		clicker : $('.clickme'),
  		text : {
  			on : '', // text for the ON position
  			off : 'OFF' // and off
  		}
  	});
  	$('#mytoggle').on('toggle', function (e, active) {
  		if (active) {
  			$("#wikiTextInner").children().remove();
  			$("#wikiTextInner").append("<iframe src=\"https://en.wikipedia.org/?title=" + $("#articleName").val() + "\" style=\"width: 100%; height: 100%\"></iframe>");
  			console.log("toggle on");
			articleControllerMain.showWikiPage(true);
  		} else {
  			articleControllerMain.showTheWholeArticleInMainView();
  			console.log("toggle off");
			articleControllerMain.showWikiPage(false);
  		}
  	});
  	$('#mytoggle_detail_drawing').toggles({
  		clicker : $('.clickme'),
  		text : {
  			on : '', // text for the ON position
  			off : 'OFF' // and off
  		}
  	});
  	$('#mytoggle_detail_drawing').on('toggle', function (e, active) {
  		if (active) {
  			//$('#mynetworkDetailView').css('display', 'inline');
  			//	$('#qualityFlawView').css('display', 'none');
  			$('#mynetworkDetailView').css('visibility', 'visible');
  			$('#qualityFlawView').css('visibility', 'hidden');

  			$('#secondTitle').html("<b>Detail drawing</b>");
  			console.log("toggle on");
  		} else {
  			//$('#mynetworkDetailView').css('display', 'none');
  			//$('#qualityFlawView').css('display', 'inline');
  			$('#mynetworkDetailView').css('visibility', 'hidden');
  			$('#qualityFlawView').css('visibility', 'visible');
  			$('#secondTitle').html("<b>Notifications</b>");
  			console.log("toggle off");
  		}
  	});
	
browserWindowWidth = $(window).width();
	 documentHeight = $(window).height();
	 elementHeight = documentHeight - 150;
	 restWidth = browserWindowWidth - $("#optionPanel").width() - 30;
	resizeWindow();
	
	var oldWindowWidth = $(window).width();
	var oldWindowHeight = $(window).height()
	$(window).resize(function () {
		if (oldWindowWidth != $(window).width() || oldWindowHeight != $(window).height()) {
			oldWindowWidth = $(window).width();
			oldWindowHeight = $(window).height();
			console.log("TEST");
			var browserWindowWidth = $(window).width();
			var restWidth = browserWindowWidth - $("#optionPanel").width() - 30;
			$("#mynetworkouter").css("width", restWidth / 2);

			$("#mynetwork").css("width", restWidth / 2);

			$("#wikiText").css("width", restWidth / 2);

			$("#wikiText").css("left", restWidth / 2);
			$("#mynetworkCompareDiv").css("width", (restWidth / 2 - 360)); 

			$("#optionPanel").css("left", restWidth + 10);
			var documentHeight = $(window).height();
			var elementHeight = documentHeight - 150;
			$("#mynetworkouter").css("height", elementHeight - 10);
			
			$("#mynetworkUpperPart").css("height", elementHeight/upperPartHelper -10);
			$("#mynetwork").css("height", elementHeight/upperPartHelper - 50);
			$("#wikiText").css("height", elementHeight - 10);
			$("#optionPanel").css("height", elementHeight - 10);
			$("#mainContent").css("height", elementHeight);
	$("#wikiTextInner").css("height", elementHeight-50);
	$("#openPanelSeconPart").css("height", elementHeight-420);
		}
	});
	

  });
	
	var removeThisNotification = function (notificationID) {
		if (!e)
			var e = window.event;
		e.cancelBubble = true;
		if (e.stopPropagation)
			e.stopPropagation();
		console.log("REMOVE: " + notificationID);
		$(".highlight").contents().unwrap();
		$('#notification-' + notificationID).remove();

	}
	
		
	$("#ediotr_section_selector").change(function () {
		console.log("Section changed: " + this.value);
		if(this.value == "Select a section")
			return;
		
		$('#ediotr_section_selector option').filter(function(){ return $(this).text()==="Select a section"}).remove();
		
		articleControllerMain.highlightSectionInTree(this.value);
		var item = this.value;
		$('#editor_section_name').html(item);
		$('#wikiTextInner').scrollTop(0);

		var desired = item.replace(/[^\w\s]/gi, '');
		var idStr = desired.replace(/ /g, "_");
		var help = "#" + idStr;
		$('#wikiTextInner').animate({
			scrollTop : $(help).offset().top - 300
		},
			'slow');
	});

//Settings:-----------------------------------------------------------	
	
$("#sliderStrictness").change(function (e) {
	overallScoreInterval = ((($(this).val() / 100) - 0.5) * 0.4).toFixed(2);
	//console.log("sliderStrictness: " + overallScoreInterval);
	articleControllerMain.showQuality();
	articleControllerCompare.showQuality();
});
$("#sliderFlesch").change(function (e) {
	weightFlesch = (($(this).val() / 100) + 0.5).toFixed(2);
	//console.log("sliderFlesch: " + weightFlesch);
	articleControllerMain.showQuality();
	articleControllerCompare.showQuality();
});
$("#sliderKincaid").change(function (e) {
	weightKincaid = (($(this).val() / 100) + 0.5).toFixed(2);
	//console.log("sliderKincaid: " + weightKincaid);
	articleControllerMain.showQuality();
	articleControllerCompare.showQuality();
});
$("#sliderImageQuality").change(function (e) {
	weightImageQuality = (($(this).val() / 100) + 0.5).toFixed(2);
	//console.log("sliderImageQuality: " + weightImageQuality);
	articleControllerMain.showQuality();
	articleControllerCompare.showQuality();
});
$("#sliderExternalRefs").change(function (e) {
	weightExternalRefs = (($(this).val() / 100) + 0.5).toFixed(2);
	//console.log("sliderExternalRefs: " + weightExternalRefs);
	articleControllerMain.showQuality();
	articleControllerCompare.showQuality();
});
$("#sliderAllLinks").change(function (e) {
	weightAllLinks = (($(this).val() / 100) + 0.5).toFixed(2);
	//console.log("sliderAllLinks: " + weightAllLinks);
	articleControllerMain.showQuality();
	articleControllerCompare.showQuality();
});

//------------------------------------------------------------------------
$("#numberFlesch").change(function (e) {
	good_fleschWordCount = $(this).val();
	articleControllerMain.showQuality();
	articleControllerCompare.showQuality();
});
$("#numberKincaid").change(function (e) {	
good_kinkaid = $(this).val();
	articleControllerMain.showQuality();
	articleControllerCompare.showQuality();
});
$("#numberImageQuality").change(function (e) {
good_numPics = $(this).val();
	articleControllerMain.showQuality();
	articleControllerCompare.showQuality();
});
$("#numberExternalRefs").change(function (e) {
good_extLinks = $(this).val();
	articleControllerMain.showQuality();
	articleControllerCompare.showQuality();
});
$("#numberAllLinks").change(function (e) {
good_allLinks = $(this).val();
	articleControllerMain.showQuality();
	articleControllerCompare.showQuality();
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

	articleControllerMain.showQuality();
	articleControllerCompare.showQuality();
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
	articleControllerMain.showQuality();
	articleControllerCompare.showQuality();
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

	
	articleControllerMain.showQuality();
	articleControllerCompare.showQuality();
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
	articleControllerMain.showQuality();
	articleControllerCompare.showQuality();
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
	articleControllerMain.showQuality();
	articleControllerCompare.showQuality();
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
	articleControllerMain.showQuality();
	articleControllerCompare.showQuality();
}

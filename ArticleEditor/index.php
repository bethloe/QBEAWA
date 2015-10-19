<!doctype html>
<html>
<head>
  <title>Quality Assisted Editor</title>
  
  <!-- libs -->
  <script type="text/javascript" src="libs/jquery-1.10.2.js" charset="utf-8"></script>
  <script type="text/javascript" src="libs/underscore-min.js" ></script>
  <script type="text/javascript" src="libs/TextStatistics.js" charset="utf-8"> </script>
  <script type="text/javascript" src="libs/TextStatistics.js" charset="utf-8"> </script>
  <link href="libs/vis/dist/vis.css" rel="stylesheet" type="text/css" />
  <link href="libs/notificationcenter-master/css/notifcenter.css" rel="stylesheet" type="text/css" />
  <script src="libs/notificationcenter-master/js/jquery.moment.js"></script>
  <script src="libs/notificationcenter-master/js/jquery.livestamp.js"></script>
  <script src="libs/notificationcenter-master/js/jquery.notificationcenter.js"></script>
  <script src="libs/notificationcenter-master/js/jquery.timer.js"></script>
  <script src="libs/JavaScript-Load-Image-master/js/load-image.all.min.js"></script>
  <script src="libs/jquery-ui-1.11.4.custom/jquery-ui.js"></script>
  <script src="libs/external/jquery.hotkeys.js"></script>
  <link href="libs/jquery-ui-1.11.4.custom/jquery-ui.css" rel="stylesheet">
  <script type="text/javascript" src="libs/vis/dist/vis.js"></script>
  <script src="libs/bootstrap-wysiwyg.js"></script>
  <link rel="stylesheet" href="libs/jquery-toggles-master/css/toggles.css">
  <link rel="stylesheet" href="libs/jquery-toggles-master/css/themes/toggles-light.css">
  <script type="text/javascript" src="libs/jquery-toggles-master/toggles.min.js"></script>
  <link rel="stylesheet" type="text/css" href="libs/wikitexteditorMarkItUp/markitup/skins/markitup/style.css" />
  
  <link rel="stylesheet" type="text/css" href="libs/wikitexteditorMarkItUp/markitup/sets/wiki/style.css" />
  <script type="text/javascript" src="libs/wikitexteditorMarkItUp/markitup/jquery.markitup.js"></script>
  <script type="text/javascript" src="libs/wikitexteditorMarkItUp/markitup/sets/wiki/set.js"></script>
  
  <!-- scripts -->
  <script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/js/bootstrap.min.js"></script>
  
  <script type="text/javascript" src="scripts/model/predefinedData/qae-high-quality-values.js"></script>
  <script type="text/javascript" src="scripts/model/utility.js"></script>
  <script type="text/javascript" src="scripts/model/Logger.js"></script>
  <script type="text/javascript" src="scripts/model/predefinedData/qae-global-data.js"></script>
  <script type="text/javascript" src="scripts/model/predefinedData/QualityFlawManager.js"></script>
  <script type="text/javascript" src="scripts/model/dataRetrieval/SensiumRequester.js"></script>
  <script type="text/javascript" src="scripts/model/dataRetrieval/SensiumRequesterRevision.js"></script>
  <script type="text/javascript" src="scripts/model/dataRetrieval/PhpConnector.js"></script>
  <script type="text/javascript" src="scripts/model/dataRetrieval/DataRetriever.js"></script>
  <script type="text/javascript" src="scripts/model/dataRetrieval/DataRetrieverRevision.js"></script>
  <script type="text/javascript" src="scripts/model/DataManipulator.js"></script>
  <script type="text/javascript" src="scripts/model/DataManipulatorRevision.js"></script>
  <script type="text/javascript" src="scripts/model/logic/QualityManager.js"></script>
  <script type="text/javascript" src="scripts/model/logic/ArticleLogicSemanticZooming.js"></script>
  <script type="text/javascript" src="scripts/model/logic/ArticleLogic.js"></script>
  <script type="text/javascript" src="scripts/model/logic/ArticleLogicRevision.js"></script>
  
  <script type="text/javascript" src="scripts/controller/ArticleController.js"></script>
  <script type="text/javascript" src="scripts/options.js" charset="utf-8"></script>
  
  <link rel="stylesheet" type="text/css" href="menu/css/demo.css" />
  <link rel="stylesheet" type="text/css" href="menu/css/style8.css" />
  <link rel="stylesheet" type="text/css" href="css/progressBar.css" />
  <link href='http://fonts.googleapis.com/css?family=Terminal+Dosis' rel='stylesheet' type='text/css' />
  
  <!-- main layout -->
  <link rel="stylesheet" type="text/css" href="css/main.css" />
  
  <link rel="shortcut icon" href="favicon.ico"/> 

</head>

<body bgcolor="white">
	
	<script> 
		//init layout
		var upperPartHelper = 1;
		var browserWindowWidth = $(window).width();
		var documentHeight = $(window).height();
		var elementHeight = documentHeight - 150;
		var restWidth = browserWindowWidth - $("#optionPanel").width() - 30;
		var resizeWindow = function () {
			$("#mynetworkouter").css("width", restWidth / 2);

			$("#mynetwork").css("width", restWidth / 2);

			$("#wikiText").css("width", restWidth / 2);

			$("#wikiText").css("left", restWidth / 2);

			$("#optionPanel").css("left", restWidth + 10);

			$("#mynetworkouter").css("height", elementHeight - 10);
			$("#mynetworkUpperPart").css("height", elementHeight / upperPartHelper + 40);
			$("#mynetwork").css("height", elementHeight / upperPartHelper);
			$("#wikiText").css("height", elementHeight - 10);
			$("#optionPanel").css("height", elementHeight - 10);
			$("#mainContent").css("height", elementHeight);
			$("#wikiTextInner").css("height", elementHeight - 50);

			$("#openPanelSeconPart").css("height", elementHeight - 420);
			$("#mynetworkCompareDiv").css("width", (restWidth / 2 - 360));

		}
		
		//init controllers
		var articleControllerMain = new ArticleController({
				networkTag : "mynetwork",
				forComparing : false
			});
		//controller for second revision
		var articleControllerCompare = new ArticleController({
				networkTag : "mynetworkCompare",
				forComparing : true
			});
	</script>

	<!-- used diaglogs: -->

	<div id="dialog" title="Dialog Title">
		<textarea id="node-label" rows="30" cols="100" ></textarea>
	</div>

	<div id="dialogCompare" title="You can load an old revision here!"></div>

	<div id="dialogCreateNewNode" title="Create new node">
		<h1> What would you like to add? </h1>
		<hr />
		<div id="createNewNodeMasterName"> </div>
		<select id="uploadSelect" name="top5" > 
		  <option>Section</option> 
		  <option>Image</option> 
		</select> 
		<div id="uploadDiv"> 
				<textarea id="createSectionTextArea" rows="30" cols="100" ></textarea>
		</div>
	</div>

	<div id="articleViewer" title="Dialog Title">
		<div id="articleViewerQualityTableDiv" align="center"> </div> 
		<div id="articleViewerDiv" style="height:100%; width:100%; overflow-y: scroll;"></div>
	</div>

	<div id="dialogLogin" title="Login">
		<table align="center">
		<tr>
			<td>Username: </td>
			<td><input id="loginUsername" type="text" value="Dst2015"/></td>
		</tr>
		<tr>
			<td>Password: </td>
			<td><input id="loginPassword" type="password"  value="kc2015"/></td>
		</tr>
		</table>
	</div>

	<div id="dialogEditInProgres" title="Edit in progress">
		<div id="editAnimationContainer" >Your changes are getting saved right now. This can take up to 20 sec.</div>
	</div>

	<div id="dialogSettings" title="Settings">
		<table>
			<tr><td align="center"><b>Names</b></td><td align="center"><b>Optimum</b></td></tr>
			<tr><td>Flesch-Reading-Ease * Word Count</td><td> <input id="numberFlesch" type="number"  value="10000" /></td></tr>
			<tr><td>Flesch-Kincaid-Grade-Level</td><td> <input id="numberKincaid" type="number"  value="14" /></td></tr>
			<tr><td>Enough Images</td><td> <input id="numberImageQuality" type="number"  value="2" /></td></tr>
			<tr><td>Enough External References</td><td> <input id="numberExternalRefs" type="number"  value="10" /></td></tr>
			<tr><td>Enough Links</td><td> <input id="numberAllLinks" type="number"  value="10" /></td></tr>
			<tr><td align="center"><b>Names</b></td><td align="center"><b>Influence</b></td></tr>
			<tr><td>Flesch score</td><td> <input id="sliderFleschInfluence" type="range"  min="0" max="100" /></td></tr>
			<tr><td>Kincaid score</td><td> <input id="sliderKincaidInfluence" type="range"  min="0" max="100" /></td></tr>
			<tr><td>Image quality</td><td> <input id="sliderImageQualityInfluence" type="range"  min="0" max="100" /></td></tr>
			<tr><td>Quality of external refs</td><td> <input id="sliderExternalRefsInfluence" type="range"  min="0" max="100" /></td></tr>
			<tr><td>Quality of all links</td><td> <input id="sliderAllLinksInfluence" type="range"  min="0" max="100" /></td></tr>
			<tr><td></td><td><input onclick="resetToDefaultSettings()" type="button" value="reset values" /></td></tr>
		</table>
	</div>

	<div id="dialogChangeLayout" title="Change Layout" >
		<input type="checkbox" id="changeLayoutTreeId" value="tree" style="width: 20px; padding: 0px;" checked> tree representation
		<br />
		<input type="checkbox" id="changeLayoutTextId" value="text editor" style="width: 20px; padding: 0px;" checked> text editor
		<br />

		<input type="checkbox" id="changeLayoutInformationId" value="info" style="width: 20px; padding: 0px;" checked> information panel
	</div>


	<!-- main menu: -->		
	<div id="menu" style="padding-left:10px; overflow-x: auto;">
		<ul class="ca-menu">
			<li>
				<a onclick="articleControllerMain.retrieveData()">
					<span class="ca-icon"><input onclick="clickstophelper()" id="articleName" type="text" style="width:140px"  value="Nikola Tesla"> </span>
					<div class="ca-content">
						<h2 class="ca-main">retrieve data <p id="workingAnimation"></p></h2></h2>
					</div>
				</a>
			</li> 
			<li>
				<a onclick="articleControllerMain.reload()">
					<span class="ca-icon">*</span>
					<div class="ca-content">
						<h2 class="ca-main">reload the article</h2>
					</div>
				</a>
			</li> 
			 <li id="changeLayout">
				<a onclick="changeLayout()">
					<span class="ca-icon">x</span>
					<div class="ca-content">
						<h2 class="ca-main">change layout</h2>
					</div>
				</a>
			</li> 
			 <li>
				<a onclick="articleControllerMain.reset()">
					<span class="ca-icon">J</span>
					<div class="ca-content">
						<h2 class="ca-main">reset</h2>
					</div>
				</a>
			</li> 
			<li id="liLogin">
				<a onclick="articleControllerMain.login()">
					<span class="ca-icon">U</span>
					<div class="ca-content">
						<h2 class="ca-main">login</h2>
						<h3 class="ca-sub" id="loginSUB">not logged in</h3>
					</div>
				</a>
			</li>
			<li id="showSettings">
				<a onclick="articleControllerMain.showSettings()">
					<span class="ca-icon">S</span>
					<div class="ca-content">
						<h2 class="ca-main">settings</h2>
					</div>
				</a>
			</li> 
			<li id="compareRevisions">
				<a onclick="articleControllerCompare.compareRevisions()">
					<span class="ca-icon">H</span>
					<div class="ca-content">
						<h2 class="ca-main">compare revisions</h2>
					</div>
				</a>
			</li> 
			
			<li id="showSensiumPanel">
				<a onclick="articleControllerMain.showSensiumPanel()">
				 <div class="ca-content2">
					   <img src="media/sensium_logo_dark.png" width="150px" />
					</div>
				</a>
			</li> 
		</ul>
	</div>

	<div id="mainContent" style="">
		<div id="mynetworkouter" style="position:absolute; top: 0px; width: 700px; height: 680px; border: 1px solid lightgray; float: left; background-color:white;">
			<div id="mynetworkUpperPart"  style="height:340px">
				<div id="eexcess_equation_controls2">
					<table>
					<tr> 
						<td class="menuHelper2" onclick="articleControllerMain.showAllItems()" title="show all elements">p</td>
						<td class="menuHelper2" id="showAllRefsTd" onclick="articleControllerMain.showReferences()" title="show all external URLs">,</td>
						<td id="showAllImagesTd" class="menuHelper2" onclick="articleControllerMain.showImages()" title="show all images">I</td>
						<td  onclick="articleControllerMain.doRedraw()" class="menuHelper2" title="redraw tree"><img src="media/redraw_small.png" height="30" style="vertical-align: middle" /></td>
						<td id="semTd" onclick="articleControllerMain.semanticZooming()" class="menuHelper2" title="just show section headlines">%</td>
						<td class="menuHelper2" onclick="articleControllerMain.showOverview()" title="rebuild the tree and go back to the default perspective">L</td>
					</tr>
					</table>
					
				
				</div> 
				<div id="mynetwork" ></div>
			</div>
			<div id="mynetworkLowerPart" style="height:340px; display:none;">
				<div id="mynetworkCompareDiv" style="float:left; width:360px;">
				<table>
					<tr><td>
						  <select id="compare_Selector" >
					  </select></td><td>
					  <button onclick="articleControllerCompare.retrieveRevision()"> retrieve revision </button></td> <td><p id="workingAnimationCompare"></p></td></tr>
				  </table>
					  <div id="eexcess_equation_controls3">
								<table>
									<tr> 
										<td class="menuHelper2" onclick="articleControllerCompare.showAllItems()" title="show all elements">p</td>
										<td class="menuHelper2" id="showAllRefsTdRev" onclick="articleControllerCompare.showReferences()" title="show all external references">,</td>
										<td id="showAllImagesTdRev" class="menuHelper2" onclick="articleControllerCompare.showImages()" title="show all images">I</td>
										<td  onclick="articleControllerCompare.doRedraw()" class="menuHelper2" title="redraw tree"><img src="media/redraw_small.png" height="30" style="vertical-align: middle" /></td>
										<td id="semTdRev" onclick="articleControllerCompare.semanticZooming()" class="menuHelper2" title="just show section headlines">%</td>
										<td class="menuHelper2" onclick="articleControllerCompare.showOverview()" title="rebuild the tree and go back to the default perspective">L</td>
									</tr>
								</table>
									
								
								</div> 
					<div id="mynetworkCompare"> </div>
				</div>
				<div style="float: left; "  >

					<div  id="optionPanelRev" >
						<div style=" height: 340px; width:360px;  border-bottom: 2px solid black;">
							<span> <b> Article information </b> </span>
							<hr/>
							<div > 
								<p id="overallScoreRev" style="width:80%" data-value="80"><b>Quality score of the article: </b></p>
								<meter id="progressBarOverallScoreRev" style="width:99%" min="0" max="100" low="50.1" high="80.1" optimum="100" value="0"></meter>
							</div> 

							<hr/>
							<div style="position: relative" > 
								 <p id="sensiumOverallScoreRev" style="width:80%" data-value="80"><b>Sensium score: </b></p>
								 <br /> 
								  <img id="progressBarSensiumOverallScoreRev" src="media/sensium.png" title="Sentiment detection allows you to decide of a given text talks positively or negatively about a subject. Sentiment detection is a common building block of online reputation management services for companies. Such a service scans social media, blogs and editorials, figuring out the general publics mood towards a company." style="width: 99%"/>
								  <img id="progressBarSensiumOverallScoreControllerRev" src="media/sensium_controller.png" style="position: absolute; top: 30px; right: 200px; height: 40px; "/>
								  
							</div> 
							<hr />

							<div id="qualityParametersRev">	</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="wikiText" >
			<div id="eexcess_equation_controls">
				<div class="icon" onclick="articleControllerMain.saveWholeArticle()" > <img src="media/saveBlack.png" height="30"/ title="save" > </div> 
				<div id="editor_section_name" style="display:none"> </div>
				<div id="editor_section_combobox"> 
				<select id="ediotr_section_selector" >  </select>
				</div>

				<div id="rank_quality_metrics_text" style="position: absolute; float:left; right: 60px;  top: 10px;" title=""> Show Wikipage: </div>
				<div id="mytoggle" class="toggle toggle-light" style="position: absolute; float:left; right: 0px; line-height: 2.5em; vertical-align: middle; top: 10px;" > </div>
			</div> 
			<div id="wikiTextInner" >	</div>
						
		</div>
		
		<div  id="optionPanel" style="" >
			<div style=" height: 380px; width:400px;  border-bottom: 2px solid black;">
				<span> <b> Article information </b> </span>
				<hr/>
				<div > 
					<p id="overallScore" style="width:80%" data-value="80"><b>Quality score of the article: </b></p>
					<meter id="progressBarOverallScore" style="width:99%" min="0" max="100" low="50.1" high="80.1" optimum="100" value="0"></meter>
				</div> 
				<hr/>
				<div style="position: relative" > 
					 <p id="sensiumOverallScore" style="width:80%" data-value="80"><b>Sensium score: </b></p>
					 <br /> 
					  <img id="progressBarSensiumOverallScore" src="media/sensium.png" title="Sentiment detection allows you to decide of a given text talks positively or negatively about a subject. Sentiment detection is a common building block of online reputation management services for companies. Such a service scans social media, blogs and editorials, figuring out the general publics mood towards a company." style="width: 99%"/>
					  <img id="progressBarSensiumOverallScoreController" src="media/sensium_controller.png" style="position: absolute; top: 30px; right: 200px; height: 40px; "/>
					  
				</div> 
				<hr />
				<div id="qualityParameters"> </div>
			</div>

			<div id="openPanelSeconPart" style="height: 100%; width:400px; position: relative;">
				<span id="secondTitle"> <b> Notifications </b>  </span> 
				<hr /> 
				<div id="mynetworkDetailView" style="  visibility: hidden; position: absolute; top: 20px;" ></div>
				<div id="qualityFlawView" style=" position: absolute; top: 20px;">
					<div id="qualityFlawViewText" >
						<div>
						</div>
					</div>
				</div>	
			</div>
	</div>

	<script>
		articleControllerMain.init("mynetwork");
		articleControllerCompare.init("mynetworkCompare");
	</script>

	<script type="text/javascript" src="scripts/view/qae-view-observer.js"></script>
</body>
</html>

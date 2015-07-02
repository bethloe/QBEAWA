<!doctype html>
<html>
<head>
  <title>The article editor :-)</title>
	<!-- THE MENU -->
		
  
  
  <script type="text/javascript" src="scripts/article-editor-high-quality-values.js"></script>
  <script type="text/javascript" src="libs/jquery-1.10.2.js" charset="utf-8"></script>
  <script type="text/javascript" src="scripts/utility.js"></script>
  <script type="text/javascript" src="scripts/rawData.js"></script>
  <script type="text/javascript" src="libs/underscore-min.js" ></script>
  <script type="text/javascript" src="scripts/article-editor-global-data.js"></script>
  <script type="text/javascript" src="scripts/article-editor-quality-flaw-manager.js"></script>
  <script type="text/javascript" src="scripts/article-editor-sensium-requester.js"></script>
  <script src="libs/JavaScript-Load-Image-master/js/load-image.all.min.js"></script>
   

  <script type="text/javascript" src="scripts/article-editor-php-requests.js"></script>
  
  <script src="libs/jquery-ui-1.11.4.custom/jquery-ui.js"></script>
  <link href="libs/jquery-ui-1.11.4.custom/jquery-ui.css" rel="stylesheet">
  <!-- HTML5 rich editor -->
  <script src="libs/external/jquery.hotkeys.js"></script>
  <script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/js/bootstrap.min.js"></script>
  <script src="libs/bootstrap-wysiwyg.js"></script>
	
  
  <script type="text/javascript" src="scripts/article-editor-colors-for-notifications.js"></script>
  <script type="text/javascript" src="libs/vis/dist/vis.js"></script>
  <link href="libs/vis/dist/vis.css" rel="stylesheet" type="text/css" />
  <link href="libs/notificationcenter-master/css/notifcenter.css" rel="stylesheet" type="text/css" />
  <script src="libs/notificationcenter-master/js/jquery.moment.js"></script>
  <script src="libs/notificationcenter-master/js/jquery.livestamp.js"></script>
  <script src="libs/notificationcenter-master/js/jquery.notificationcenter.js"></script>
  <script src="libs/notificationcenter-master/js/jquery.timer.js"></script>
  <script type="text/javascript" src="libs/TextStatistics.js" charset="utf-8"> </script>
  <script type="text/javascript" src="libs/TextStatistics.js" charset="utf-8"> </script>
  <script type="text/javascript" src="scripts/retrieve-data.js"></script>
  <script type="text/javascript" src="scripts/retrieve-data-with-revid.js"></script>
  <script type="text/javascript" src="scripts/article-editor-controller-data-manipulation.js"></script>
  <script type="text/javascript" src="scripts/article-editor-renderer-quality-manager.js"></script>
  <script type="text/javascript" src="scripts/article-editor-renderer-semantic-zooming.js"></script>
  <script type="text/javascript" src="scripts/article-editor-renderer.js"></script>
  <script type="text/javascript" src="scripts/article-editor-controller.js"></script>
  <link rel="stylesheet" type="text/css" href="menu/css/demo.css" />
  <link rel="stylesheet" type="text/css" href="menu/css/style8.css" />
  <link rel="stylesheet" type="text/css" href="css/progressBar.css" />
  <link href='http://fonts.googleapis.com/css?family=Terminal+Dosis' rel='stylesheet' type='text/css' />
  <link rel="stylesheet" href="libs/jquery-toggles-master/css/toggles.css">
  <link rel="stylesheet" href="libs/jquery-toggles-master/css/themes/toggles-light.css">
  <script type="text/javascript" src="libs/jquery-toggles-master/toggles.min.js"></script>
	
		
   <link rel="stylesheet" type="text/css" href="libs/wikitexteditorMarkItUp/markitup/skins/markitup/style.css" />
   <link rel="stylesheet" type="text/css" href="libs/wikitexteditorMarkItUp/markitup/sets/wiki/style.css" />
   <script type="text/javascript" src="libs/wikitexteditorMarkItUp/markitup/jquery.markitup.js"></script>
   <script type="text/javascript" src="libs/wikitexteditorMarkItUp/markitup/sets/wiki/set.js"></script>


  <style type="text/css">
  #mainContent{
  position: relative; width: 100%; left: 10px; overflow-x: auto; overflow-y: hidden; height: 700px;
  }
    #mynetwork {
	position:absolute;
	  top: 40px;
      width: 700px;
      height: 640px;
      border: 1px solid lightgray;
	  float: left;
	  background-color:white;
    }   

	
	
  .ui-resizable-helper { border: 2px dotted #00F; }
	#wikiText {
	position:absolute;
	left: 700px;
	 width: 700px;
      height: 680px;
      border: 1px solid lightgray;
	  background-color:white;
	  margin-right: 5px; 
	  margin-left: 5px; 
	  overflow: hidden;
	}
	#wikiIFrame{
	position:absolute;
	left: 1420px;
	 width: 700px;
      height: 700px;
      border: 1px solid lightgray;
	  background-color:white;
	  margin-right: 5px; 
	  margin-left: 5px; 
	  overflow: hidden;
	}
	#wikiTextInner{
		position:absolute;
      height: 650px;
	 width: 100%;
		overflow-y: scroll;
	}
	#optionPanel {
	position:absolute;
	left: 1420px;
	height: 680px;
	float: left; 
	   background: -webkit-linear-gradient(#f0f0f0, #636363); /* For Safari 5.1 to 6.0 */
    background: -o-linear-gradient(#f0f0f0, #636363); /* For Opera 11.1 to 12.0 */
    background: -moz-linear-gradient(#f0f0f0, #636363); /* For Firefox 3.6 to 15 */
    background: linear-gradient(#f0f0f0, #636363); /* Standard syntax (must be last) */
	 }
   #mynetworkDetailView {
	  position: absolute;
	  top: 30px;
      width: 400px;
      height: 280px;
      border: 1px solid lightgray;
	  float: left;
	  background-color:white;
    }
	#qualityParameters{
	position:relative;
	height: 200px;
	overflow-x: auto; 
	overflow-y: auto;
	}
	
	#qualityFlawView{
	 top: 0px;
      width: 400px;
      height: 100%;
	  float: left;
    }
	#qualityFlawViewText{
	  position: absolute;
	  top: 10px;
      height: 100%;
	  width: 100%;
	  overflow-y: auto;
	}
	
	 #editor {
	  background-color:white; overflow:scroll; height:350px; width: 400px;}
	 
    table.legend_table {
      font-size: 11px;
      border-width:1px;
      border-color:#d3d3d3;
      border-style:solid;
    }
    table.legend_table,td {
      border-width:1px;
      border-color:#d3d3d3;
      border-style:solid;
      padding: 2px;
    }
    div.table_content {
      width:80px;
      text-align:center;
    }
    div.table_description {
      width:100px;
    }

    #operation {
      font-size:28px;
    }
    #network-popUp {
      display:none;
      position:absolute;
      top:350px;
      left:170px;
      z-index:299;
      width:250px;
      height:120px;
      background-color: #f9f9f9;
      border-style:solid;
      border-width:3px;
      border-color: #5394ed;
      padding:10px;
      text-align: center;
    }
	
	#eexcess_equation_controls{
	position: relative;
    display: inline-flex;
    width: 100%;
    height: 40px;
    min-height: 2.5em;
    background: -webkit-linear-gradient(top, rgba(245, 245, 245, 1), rgba(200, 200, 200, 1));
    box-shadow: inset .1em .1em .5em #ccc, inset -.1em -.1em .5em #ccc;
}

	#eexcess_equation_controls2{
	position: relative;
    display: inline-flex;
    width: 100%;
    height: 40px;
    min-height: 2.5em;
    background: -webkit-linear-gradient(top, rgba(245, 245, 245, 1), rgba(200, 200, 200, 1));
    box-shadow: inset .1em .1em .5em #ccc, inset -.1em -.1em .5em #ccc;
}

.icon{
	cursor: pointer;
	border: 0px solid black;
	padding-left: 5px;
	padding-right: 5px;
	padding-top: 2px;
}

.icon:hover{
	cursor: pointer;
	padding-left: 5px;
	padding-right: 5px;
	padding-top: 2px;
	background-color: white;
}

#editor_section_name{
	font-family: "arial";
    font-weight: bold;
	line-height:  2.5em;
	vertical-align: middle;
}

#editor_section_combobox{
	font-family: "arial";
    font-weight: bold;
	line-height:  2.5em;
	vertical-align: middle;
}

#editor_section_combobox select {

 border: 1px solid #000; 
 font-size: 14px;
 color: #000;
 background: #ccc; 
 padding: 2px; 


   }




.notificationDiv{
	cursor: pointer;
	text-align: center;
	margin-top: 5px;
	margin-bottom: 5px;
	color: white;
	height: 50px;
	line-height: 50px;
	vertical-align: middle;
	background-color: #525252;
	border: 1px solid #bdbdbd;
	-moz-border-radius-topright:12px;
	-webkit-border-top-right-radius:12px;
	border-top-right-radius:12px;
	
	-moz-border-radius-topleft:12px;
	-webkit-border-top-left-radius:12px;
	border-top-left-radius:12px;
	
	-moz-border-radius-bottomright:12px;
	-webkit-border-bottom-right-radius:12px;
	border-bottom-right-radius:12px;
	
	-moz-border-radius-bottomleft:12px;
	-webkit-border-bottom-left-radius:12px;
	border-bottom-left-radius:12px;

}

.notificationDiv:hover{

	background-color: #bdbdbd;
}

.highlight{
background-color: #ff2;
}

.menuHelper{
 font-family: 'WebSymbolsRegular', cursive;
    font-size: 40px;
	cursor: pointer;
}
.menuHelper2{
font-family: 'WebSymbolsRegular', cursive;
    font-size: 25px;
	cursor: pointer;
}
.menuHelper3{

font-family: 'WebSymbolsRegular', cursive;
    font-size: 25px;
	cursor: pointer;
	background-color: white;
}
.menuHelper2:hover{
	background-color: white;
}
.menuHelper:hover{
	background-color: white;
}
  </style>
</head>

<body bgcolor="white">
<!-- THE Notification CENTER -->
	
	<!-- END ------->
	
<script>  var articleController = new ArticleController();</script>
<!-- Smooth curve type:
<select id="dropdownID">
    <option value="continuous" selected="selected">continuous</option>
    <option value="discrete">discrete</option>
    <option value="diagonalCross">diagonalCross</option>
    <option value="straightCross">straightCross</option>
    <option value="horizontal">horizontal</option>
    <option value="vertical">vertical</option>
    <option value="curvedCW">curvedCW</option>
    <option value="curvedCCW">curvedCCW</option>
</select><br/>-->
<!--<div > 
<table style="border: 0px"> <tr> <td>
Article name: <input id="articleName" type="text" value="User:Dst2015/sandbox"> 
</td><td class="menuHelper"  onclick="articleController.retrieveData()" title="retrieve data"><img src="media/retrievedata.png" height="40" style="vertical-align: middle"  > </td><td>
<p id="workingAnimation"></p>
</td>
<td class="menuHelper" title="reload the article" onclick="articleController.reload()">
*
</td>
<td class="menuHelper" title="unlock/lock layout" onclick="changeLayout()">
<img  id="lockUnockImage" src="media/lock_closed.png" height="40" style="vertical-align: middle" />
</td>
<td  class="menuHelper" title="reset" onclick="articleController.reset()">
J
</td>
<td  class="menuHelper" title="login" onclick="articleController.login()">
U
</td>
<td  class="menuHelper" title="Settings" onclick="articleController.showSettings()">
S
</td>
</tr>
</table>
</div>-->

<!-- 
Testdata:
Peter_Parker:_Spider-Man&oldid=443358314 
Nuclear_option&oldid=454325470
City and Industrial Development Corporation&oldid=408274214-->
<div id="menu" style="padding-left:10px; width:950px; overflow-x: auto;">
  <ul class="ca-menu">
				<li>
                        <a onclick="articleController.retrieveData()">
                            <span class="ca-icon"><input onclick="clickstophelper()" id="articleName" type="text" style="width:140px"  value="Nuclear_option&oldid=454325470"> </span>
                            <div class="ca-content">
                                <h2 class="ca-main">retrieve data <p id="workingAnimation"></p></h2></h2>
                            </div>
                        </a>
                    </li> 
                    <li>
                        <a onclick="articleController.reload()">
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
                        <a onclick="articleController.reset()">
                            <span class="ca-icon">J</span>
                            <div class="ca-content">
                                <h2 class="ca-main">reset</h2>
                            </div>
                        </a>
                    </li> 
                    <li id="liLogin">
                        <a onclick="articleController.login()">
                            <span class="ca-icon">U</span>
                            <div class="ca-content">
                                <h2 class="ca-main">login</h2>
                                <h3 class="ca-sub" id="loginSUB">not logged in</h3>
                            </div>
                        </a>
                    </li>
                    <li id="showSettings">
                        <a onclick="articleController.showSettings()">
                            <span class="ca-icon">S</span>
                            <div class="ca-content">
                                <h2 class="ca-main">settings</h2>
                            </div>
                        </a>
                    </li> 
                </ul>
</div>
 <!--
<br/>
<div id="menu" >
  <ul class="ca-menu">
                    <li>
                        <a onclick="articleController.reload()">
                            <span class="ca-icon">*</span>
                            <div class="ca-content">
                                <h2 class="ca-main">reload the article</h2>
                            </div>
                        </a>
                    </li> 
                    <li>
                        <a onclick="articleController.showAllItems()">
                            <span class="ca-icon">p</span>
                            <div class="ca-content">
                                <h2 class="ca-main">show all items</h2>
                            </div>
                        </a>
                    </li>-->
                    <!-- <li id="changeLayout">
                        <a onclick="changeLayout()">
                            <span class="ca-icon">H</span>
                            <div class="ca-content">
                                <h2 class="ca-main">change layout</h2>
                            </div>
                        </a>
                    </li> 
                    <li id="showReferences">
                        <a onclick="articleController.showReferences()">
                            <span class="ca-icon" >,</span>
                            <div class="ca-content">
                                <h2 class="ca-main">show external references</h2>
                            </div>
                        </a>
                    </li>
                    <li id="showImages">
                        <a onclick="articleController.showImages()">
                            <span class="ca-icon">I</span>
                            <div class="ca-content">
                                <h2 class="ca-main">show images</h2>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a onclick="articleController.doRedraw()">
                            <span class="ca-icon">J</span>
                            <div class="ca-content">
                                <h2 class="ca-main">redraw</h2>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a onclick="articleController.semanticZooming()">
                            <span class="ca-icon">%</span>
                            <div class="ca-content">
                                <h2 class="ca-main">semantic zooming</h2>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a onclick="articleController.showOverview()">
                            <span class="ca-icon">L</span>
                            <div class="ca-content">
                                <h2 class="ca-main">show overview</h2>
                            </div>
                        </a>
                    </li>
                    <!-- <li>
                        <a onclick="articleController.reset()">
                            <span class="ca-icon">J</span>
                            <div class="ca-content">
                                <h2 class="ca-main">reset</h2>
                            </div>
                        </a>
                    </li> -->
                    <!-- <li>
                        <a onclick="articleController.showTheWholeArticle()">
                            <span class="ca-icon">a</span>
                            <div class="ca-content">
                                <h2 class="ca-main">show article as text</h2>
                            </div>
                        </a>
                    </li> -->
                    <!-- <li id="liLogin">
                        <a onclick="articleController.login()">
                            <span class="ca-icon">U</span>
                            <div class="ca-content">
                                <h2 class="ca-main">login</h2>
                                <h3 class="ca-sub" id="loginSUB">not logged in</h3>
                            </div>
                        </a>
                    </li>
                    <li id="showSettings">
                        <a onclick="articleController.showSettings()">
                            <span class="ca-icon">S</span>
                            <div class="ca-content">
                                <h2 class="ca-main">settings</h2>
                            </div>
                        </a>
                    </li> 
                </ul>
</div>
<br/>-->
<div id="dialog" title="Dialog Title">
	<textarea id="node-label" rows="30" cols="100" ></textarea>
</div>
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
	<div id="articleViewerDiv" style="height:100%; width:100%; overflow-y: scroll;">
	</div>
	<!-- <table id="articleViewerQualityTable"> </table>
	<textarea id="articleViewerTextarea" rows="30" cols="100" ></textarea> -->
</div>

<div id="dialogLogin" title="Login">
	<table align="center">
	<tr>
	<td>
	Username: </td><td><input id="loginUsername" type="text" value="Dst2015"/></td></tr>
	<tr><td>Password: </td><td><input id="loginPassword" type="password"  value="kc2015"/></td></tr>
</table>
</div>
<div id="dialogEditInProgres" title="Edit in progress">
	<div id="editAnimationContainer" >Your changes are getting saved right now. This can take up to 20 sec.</div>
</div>
<div id="dialogSettings" title="Settings">
<table>
<!-- <tr><td>Strictness of the assessment (only changes the color)</td><td> <input id="sliderStrictness" type="range"  min="0" max="100" value="50"/></td></tr> -->
<!--<tr><td align="center"><b>Names</b></td><td align="center"><b>Weights</b></td></tr>
<tr><td>Flesch score</td><td> <input id="sliderFlesch" type="range"  min="0" max="100" /></td></tr>
<tr><td>Kincaid score</td><td> <input id="sliderKincaid" type="range"  min="0" max="100" /></td></tr>
<tr><td>Image quality</td><td> <input id="sliderImageQuality" type="range"  min="0" max="100" /></td></tr>
<tr><td>Quality of external refs</td><td> <input id="sliderExternalRefs" type="range"  min="0" max="100" /></td></tr>
<tr><td>Quality of all links</td><td> <input id="sliderAllLinks" type="range"  min="0" max="100" /></td></tr>-->
<tr><td align="center"><b>Names</b></td><td align="center"><b>Optimum</b></td></tr>
<tr><td>Flesch score</td><td> <input id="numberFlesch" type="number"  value="20000" /></td></tr>
<tr><td>Kincaid score</td><td> <input id="numberKincaid" type="number"  value="12" /></td></tr>
<tr><td>Image quality</td><td> <input id="numberImageQuality" type="number"  value="5" /></td></tr>
<tr><td>Quality of external refs</td><td> <input id="numberExternalRefs" type="number"  value="4" /></td></tr>
<tr><td>Quality of all links</td><td> <input id="numberAllLinks" type="number"  value="30" /></td></tr>
<tr><td align="center"><b>Names</b></td><td align="center"><b>Influence</b></td></tr>
<tr><td>Flesch score</td><td> <input id="sliderFleschInfluence" type="range"  min="0" max="100" /></td></tr>
<tr><td>Kincaid score</td><td> <input id="sliderKincaidInfluence" type="range"  min="0" max="100" /></td></tr>
<tr><td>Image quality</td><td> <input id="sliderImageQualityInfluence" type="range"  min="0" max="100" /></td></tr>
<tr><td>Quality of external refs</td><td> <input id="sliderExternalRefsInfluence" type="range"  min="0" max="100" /></td></tr>
<tr><td>Quality of all links</td><td> <input id="sliderAllLinksInfluence" type="range"  min="0" max="100" /></td></tr>
<tr><td></td><td><input onclick="resetToDefaultSettings()" type="button" value="reset values" /></td></tr>
</table>
</div>

<div id="mainContent" style="">
<div id="mynetworkouter" style="position:absolute; top: 0px; width: 700px; height: 680px; border: 1px solid lightgray; float: left; background-color:white;">

		      <div id="eexcess_equation_controls2">
					<table><tr> <td class="menuHelper2" onclick="articleController.showAllItems()" title="show all elements">p</td><td class="menuHelper2" id="showAllRefsTd" onclick="articleController.showReferences()" title="show all external references">,</td><td id="showAllImagesTd" class="menuHelper2" onclick="articleController.showImages()" title="show all images">I</td><td  onclick="articleController.doRedraw()" class="menuHelper2" title="redraw tree"><img src="media/redraw_small.png" height="30" style="vertical-align: middle" /></td><td id="semTd" onclick="articleController.semanticZooming()" class="menuHelper2" title="just show section headlines">%</td><td class="menuHelper2" onclick="articleController.showOverview()" title="rebuild the tree and go back to the default perspective">L</td></tr></table>
					
				
				</div> 
<div id="mynetwork" >

</div>
</div>
<div id="mynetwork2" >

</div>
<div id="wikiText" >
		      <div id="eexcess_equation_controls">
					<div class="icon" onclick="articleController.saveWholeArticle()" > <img src="media/saveBlack.png" height="30"/ title="save" > </div> 
				<!--	<div class="icon" ><img src="media/new.png" title="new element" height="30" onclick="equationEditor.clearEquationComposer()"/></div>
					<div class="icon" ><img src="media/delete.png" title="delete element" height="30" onclick="equationEditor.deleteSelectedElement()"/></div>-->
					<div id="editor_section_name" style="display:none"> </div>
					<div id="editor_section_combobox"> 
  <select id="ediotr_section_selector" >
  </select> </div>
  
				<div id="rank_quality_metrics_text" style="position: absolute; float:left; right: 60px;  top: 10px;" title=""> Show Wikipage: </div>
					<div id="mytoggle" class="toggle toggle-light" style="position: absolute; float:left; right: 0px; line-height: 2.5em; vertical-align: middle; top: 10px;" > </div>
				</div> 
				<div id="wikiTextInner" >
				
				</div>
				
</div>

<td  rowspan="2">
<div  id="optionPanel" style="" >
<div style=" height: 380px; width:400px;  border-bottom: 2px solid black;">
<span> <b> Article information </b> </span>
<hr/>
<div > 
 <p id="overallScore" style="width:80%" data-value="80"><b>Quality score of the article: </b></p>
  <meter id="progressBarOverallScore" style="width:99%" min="0" max="100" low="50" high="80" optimum="100" value="0"></meter>
        <!-- <progress id="progressBarOverallScore" max="100" value="100" class="html5">
            <div class="progress-bar">
                <span style="width: 80%">80%</span>
            </div>
        </progress> -->
</div> 

<hr/>
<div style="position: relative" > 
 <p id="sensiumOverallScore" style="width:80%" data-value="80"><b>Sensium score: </b></p>
 <br /> 
  <img id="progressBarSensiumOverallScore" src="media/sensium.png" title="Sentiment detection allows you to decide of a given text talks positively or negatively about a subject. Sentiment detection is a common building block of online reputation management services for companies. Such a service scans social media, blogs and editorials, figuring out the general publics mood towards a company." style="width: 99%"/>
  <img id="progressBarSensiumOverallScoreController" src="media/sensium_controller.png" style="position: absolute; top: 30px; right: 200px; height: 40px; "/>
  
</div> 
<hr />

<div id="qualityParameters"> 
</div>


</div>

<div id="openPanelSeconPart" style="height: 100%; width:400px; position: relative;">
<span id="secondTitle"> <b> Notifications </b>  </span> 
<hr /> 
<!-- <div id="rank_quality_metrics_text" style="position: absolute;  right: 60px;  top: 0px;" title=""> Detail drawing: </div>
<div id="mytoggle_detail_drawing" class="toggle toggle-light" style="position: absolute;  right: 0px; line-height: 2.5em; vertical-align: middle; top: 0px;" > </div> -->
<div id="mynetworkDetailView" style="  visibility: hidden; position: absolute; top: 20px;" ></div>
<div id="qualityFlawView" style=" position: absolute; top: 20px;">


<div id="qualityFlawViewText" >

<div>
</div>
</div>
</div>
</div>

<script>
			articleController.init("mynetwork");
</script>
<script>
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

  $("#dialogSettings").dialog({
  	autoOpen : false,
  	width : 400,
  	height : 650,
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
	} else {
		$('#changeLayout a span').attr("class", "ca-icon");
		$('#changeLayout a div h2').attr("class", "ca-main");
		$('#changeLayout').css("background-color", "grey");
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
  			$("#wikiTextInner").append("<iframe src=\"https://en.wikipedia.org/wiki/" + $("#articleName").val() + "\" style=\"width: 100%; height: 100%\"></iframe>");
  			console.log("toggle on");
  		} else {
  			articleController.showTheWholeArticleInMainView();
  			console.log("toggle off");
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
	
	var browserWindowWidth = $(window).width();
	var documentHeight = $(window).height();
	console.log("documentHeight: " + documentHeight);
	var elementHeight = documentHeight - 150;
	var restWidth = browserWindowWidth - $("#optionPanel").width() - 30;
	$("#mynetworkouter").css("width", restWidth / 2);

	$("#mynetwork").css("width", restWidth / 2);

	$("#wikiText").css("width", restWidth / 2);

	$("#wikiText").css("left", restWidth / 2);

	$("#optionPanel").css("left", restWidth + 10);

	$("#mynetworkouter").css("height", elementHeight-10);
	$("#mynetwork").css("height", elementHeight - 50);
	$("#wikiText").css("height", elementHeight-10);
	$("#optionPanel").css("height", elementHeight-10);
	$("#mainContent").css("height", elementHeight);
	$("#wikiTextInner").css("height", elementHeight-50);
	
	$("#openPanelSeconPart").css("height", elementHeight-420);
	

	
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

			$("#optionPanel").css("left", restWidth + 10);
			var documentHeight = $(window).height();
			var elementHeight = documentHeight - 150;
			$("#mynetworkouter").css("height", elementHeight - 10);
			$("#mynetwork").css("height", elementHeight - 50);
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
		articleController.highlightSectionInTree(this.value);
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
</script>

  <script type="text/javascript" src="scripts/article-editor-settings.js"></script>
</body>
</html>

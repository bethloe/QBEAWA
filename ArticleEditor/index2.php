<!doctype html>
<html>
<head>
  <title>Network | Static smooth curves</title>

  <script type="text/javascript" src="scripts/utility.js"></script>
  <script type="text/javascript" src="scripts/rawData.js"></script>
  <script type="text/javascript" src="libs/jquery-1.10.2.js" charset="utf-8"></script>

  <!-- HTML5 rich editor -->
  <script src="libs/external/jquery.hotkeys.js"></script>
  <script src="http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>
  <script src="libs/bootstrap-wysiwyg.js"></script>
	
  
  <script type="text/javascript" src="libs/vis/dist/vis.js"></script>
  <link href="libs/vis/dist/vis.css" rel="stylesheet" type="text/css" />
  <script type="text/javascript" src="libs/TextStatistics.js" charset="utf-8"> </script>
  <script type="text/javascript" src="scripts/retrieve-data.js"></script>
  <script type="text/javascript" src="scripts/article-editor-renderer-quality-manager.js"></script>
  <script type="text/javascript" src="scripts/article-editor-renderer-semantic-zooming.js"></script>
  <script type="text/javascript" src="scripts/article-editor-renderer.js"></script>
  <script type="text/javascript" src="scripts/article-editor-controller.js"></script>


  <style type="text/css">
    #mynetwork {
	  top: 0px;
      width: 1450px;
      height: 700px;
      border: 1px solid lightgray;
	  float: left;
    }
	    #mynetworkDetailView {
	  top: 0px;
      width: 400px;
      height: 350px;
      border: 1px solid lightgray;
	  float: left;
    }
	
	 #editor {overflow:scroll; height:350px; width: 400px;}
  </style>
</head>

<body>

<!--
<h2>Static smooth curves</h2>
<div style="width:700px; font-size:14px; text-align: justify;">
    All the smooth curves in the examples so far have been using dynamic smooth curves. This means that each curve has a
    support node which takes part in the physics simulation. For large networks or dense clusters, this may not be the ideal
    solution. To solve this, static smooth curves have been added. The static smooth curves are based only on the positions of the connected
    nodes. There are multiple ways to determine the way this curve is drawn. This example shows the effect of the different
    types. <br /> <br />
    Drag the nodes around each other to see how the smooth curves are drawn for each setting. For animated system, we
    recommend only the continuous mode. In the next example you can see the effect of these methods on a large network. Keep in mind
    that the direction (the from and to) of the curve matters.
    <br /> <br />
</div> -->

<script>  var articleController = new ArticleController(); </script>
Smooth curve type:
<select id="dropdownID">
    <option value="continuous" selected="selected">continuous</option>
    <option value="discrete">discrete</option>
    <option value="diagonalCross">diagonalCross</option>
    <option value="straightCross">straightCross</option>
    <option value="horizontal">horizontal</option>
    <option value="vertical">vertical</option>
    <option value="curvedCW">curvedCW</option>
    <option value="curvedCCW">curvedCCW</option>
</select><br/>

				 <button onclick="articleController.showAllItems()"> show all items </button> 
				 <button onclick="articleController.colorLevels(true)"> color levels </button>
				 <button onclick="articleController.colorLevels(false)"> no color </button>
				<!-- <button onclick="articleController.splitSectionsIntoParagraphs()"> split sections into paragraphs </button>
				 <button onclick="articleController.combineParagaphsToSections()"> combine paragraphs to sections </button> -->
				 <button onclick="articleController.showReferences()"> show external references</button>
				 <button onclick="articleController.hideReferences()"> hide external references</button>
				 <button onclick="articleController.showImages()"> show images</button>
				 <button onclick="articleController.hideImages()"> hide images</button>
				 <button onclick="articleController.posImages()"> reposition images</button>
				 <button onclick="articleController.copy()"> copy (just for performance testing)</button>
				 <button onclick="articleController.doRedraw()">redraw</button> <br />
				 <button onclick="articleController.semanticZooming(true)"> semantic zooming on </button> 
				 <button onclick="articleController.semanticZooming(false)"> semantic zooming off </button> 
				 <button onclick="articleController.showOverview()"> show Overview </button> 
				 <button onclick="articleController.showQuality()"> show the quality of the article </button> 
				 
				 
				 <br/>
<!--Roundness (0..1): <input type="range" min="0" max="1" value="0.5" step="0.05" style="width:200px" id="roundnessSlider"> <input id="roundnessScreen" value="0.5"> (0.5 is max roundness for continuous, 1.0 for the others)-->
				
Article name: <input id="articleName" type="text" value="Nikola Tesla"> <button onclick="articleController.retrieveData()"> retrieve data </button><div id="overallScore"> </div> <div id="qualityParameters"> </div>
<!--<button onclick="articleController.fillDataNew()"> show the article </button>-->
<div>
<div id="mynetwork"></div>
<div id="mynetworkDetailView"></div>
<div class="btn-toolbar" data-role="editor-toolbar" data-target="#editor">


</div> 
  <div id="editor">
	select a section to display the text here
    </div>
</div>
<script>
			articleController.init();
</script>
<script>
  $(function(){
$('#editor').wysiwyg();
  });
</script>
</body>
</html>

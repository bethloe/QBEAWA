<!doctype html>
<html>
<head>
  <title>Network | Static smooth curves</title>

  <script type="text/javascript" src="scripts/rawData.js"></script>
  <script type="text/javascript" src="libs/jquery-1.10.2.js" charset="utf-8"></script>
  <script type="text/javascript" src="libs/vis/dist/vis.js"></script>
  <link href="libs/vis/dist/vis.css" rel="stylesheet" type="text/css" />
  <script type="text/javascript" src="scripts/search-articles.js"></script>
  <script type="text/javascript" src="scripts/retrieve-data.js"></script>


  <style type="text/css">
    #mynetwork {
      width: 1900px;
      height: 800px;
      border: 1px solid lightgray;
    }
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

				 <button onclick="showAllItems()"> show all items </button> 
				 <button onclick="colorLevels(true)"> color levels </button>
				 <button onclick="colorLevels(false)"> no color </button>
				 <button onclick="splitSectionsIntoParagraphs()"> split sections into paragraphs </button>
				 <button onclick="combineParagaphsToSections()"> combine paragraphs to sections </button>
				 <button onclick="showReferences()"> show external references</button>
				 <button onclick="hideReferences()"> hide external references</button>
				 <button onclick="showImages()"> show images</button>
				 <button onclick="hideImages()"> hide images</button>
				 <button onclick="posImages()"> reposition images</button>
				 <button onclick="copy()"> copy (just for performance testing)</button>
				 
				 <br/>
Roundness (0..1): <input type="range" min="0" max="1" value="0.5" step="0.05" style="width:200px" id="roundnessSlider"> <input id="roundnessScreen" value="0.5"> (0.5 is max roundness for continuous, 1.0 for the others)
				 <br/>
Article name: <input id="articleName" type="text" value="Albert Einstein"> <button onclick="retrieveData()"> retrieve data </button> <button onclick="fillDataNew()"> show the article </button>
<div id="mynetwork"></div>


  <script type="text/javascript" src="scripts/articleEditor.js"></script>

</body>
</html>

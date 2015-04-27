<?php
  // $dataset = $_POST["dataset"];
?>


<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <title>uRank</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">

        <script type="text/javascript" src="libs/jquery-1.10.2.js" charset="utf-8"></script>
        <script type="text/javascript" src="libs/jquery-ui.js" charset="utf-8"></script>
        <script type="text/javascript" src="libs/d3.v3.js" charset="utf-8"></script>
        <script type="text/javascript" src="libs/parser.js" charset="utf-8"></script>
        <script type="text/javascript" src="libs/math.min.js" charset="utf-8"></script>
        <script type="text/javascript" src="libs/natural-adapted.js" charset="utf-8"></script>
        <script type="text/javascript" src="libs/colorbrewer.js" charset="utf-8"></script>
        <script type="text/javascript" src="libs/dim-background.js" charset="utf-8"></script>
        <script type="text/javascript" src="libs/pos/lexer.js" charset="utf-8"></script>
        <script type="text/javascript" src="libs/pos/lexicon.js" charset="utf-8"></script>
        <script type="text/javascript" src="libs/pos/POSTagger.js" charset="utf-8"></script>
        <script type="text/javascript" src="libs/pos/pos.js" charset="utf-8"></script>
		<script type="text/javascript" src="libs/TextStatistics.js" charset="utf-8"> </script>
        <link rel="stylesheet" type="text/css" href="libs/ui/jquery-ui-1.10.4.custom.min.css">
		<script type="text/javascript" src="libs/CanvasInput.min.js"></script>
		
		<!--[if lt IE 9]><script language="javascript" type="text/javascript" src="libs/jpplot.1.0.8/dist/excanvas.js"></script><![endif]-->
		<script language="javascript" type="text/javascript" src="libs/jpplot.1.0.8/dist/jquery.jqplot.min.js"></script>
		<link rel="stylesheet" type="text/css" href="libs/jpplot.1.0.8/dist/jquery.jqplot.css" />
		<script type="text/javascript" src="libs/jpplot.1.0.8/dist/plugins/jqplot.pieRenderer.min.js"></script>
		<script type="text/javascript" src="libs/jpplot.1.0.8/dist/plugins/jqplot.donutRenderer.min.js"></script>
	
		<script type="text/javascript" src="libs/MathJax-master/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>

		<script type="text/javascript" src="scripts/Stopwatch.js" charset="utf-8"> </script>
		
        <script type="text/javascript" src="scripts/globals.js" charset="utf-8"></script>
        <script type="text/javascript" src="scripts/rankingArray.js" charset="utf-8"></script>
        <script type="text/javascript" src="scripts/rankingModel.js" charset="utf-8"></script>
        <script type="text/javascript" src="scripts/rankingVis.js" charset="utf-8"></script>
        <script type="text/javascript" src="scripts/settings.js" charset="utf-8"></script>
        <script type="text/javascript" src="scripts/utils.js" charset="utf-8"></script>
        <script type="text/javascript" src="scripts/taskStorage.js" charset="utf-8"></script>
		<script type="text/javascript" src="scripts/retrieve-data.js" charset="utf-8"> </script>
		<script type="text/javascript" src="scripts/search-articles.js" charset="utf-8"> </script>
		
		<script type="text/javascript" src="scripts/popup.js"></script>
		<script type="text/javascript" src="scripts/utility.js"></script>
		<script type="text/javascript" src="scripts/QMformula-editor-brick.js"></script>
		<script type="text/javascript" src="scripts/QMformula-editor-eventhandler-moveableBricks.js"></script>
		<script type="text/javascript" src="scripts/QMformula-editor-eventhandler-menuBricks.js"></script>
		<script type="text/javascript" src="scripts/databaseConnector.js" charset="utf-8"> </script>
		
         <script type="text/javascript" src="scripts/equation_editor.js" charset="utf-8"></script>

        <link rel="stylesheet" type="text/css" href="css/general-style.css" />
        <link rel="stylesheet" type="text/css" href="css/popup.css" />
        <link rel="stylesheet" type="text/css" href="css/vis-template-style-static.css" />
<!--        <link rel="stylesheet" type="text/css" href="css/vis-template-style-alternative-3-test.css" /> -->

        <link rel="stylesheet" type="text/css" href="css/vis-template-chart-style.css" />
    </head>
    <body>

		<script>  var equationEditor = new EquationEditor(); </script>
        <div id="dataset" style="display: none;">
            <?php
                echo htmlspecialchars($dataset);
            ?>
        </div>

		<header id="eexcess_header">
            <section id="eexcess_header_info_section">
	  			<span></span>
	  		</section>
            <section id="eexcess_header_task_section">
				<div id="eexcess_header_task_section_div"> Keword: <input type="text" id="article-name" value="Visualization" /> 
				 Max. number of results: <input type="number" id="max-num" value="5"/>
				 <button onclick="searchArticle('visualization',50,equationEditor)"> retrieve data </button> 
				 <!-- <button class="popup_oeffnen"> show quality metric editor </button> -->
				<!-- <button class="open_popup_article_editor"> show article editor </button> -->
				 <!--<button onclick="showAllDataTest()"> show data </button> </div>
                <p id="p_task"></p>
                <p id="p_question"></p> -->
	  		</section>
	  		<section id="eexcess_header_control_section">
                 <input type="button" id="eexcess_list_button" value="Show List" style="display:none"/>
                <input type="button" id="eexcess_text_button" value="Show Text" style="display:none" />
                <input type="button" id="eexcess_finished_button" value="Finished" style="display:none" />

                <section id="eexcess_selected_items_section" style="display:none"></section>
                <section id="eexcess_topic_text_section" style="display:none">
                    <p></p>
                </section>
            </section>
      	</header>

	
		<div id="eexcess_main_panel">

            <div id="eexcess_controls_left_panel">
                <div id="eexcess_qm_container"></div>
				<hr />
                <div id="eexcess_measures_container"></div>
            </div>

            <div id="eexcess_vis_panel" >

                <div class="eexcess_equation_ranking_operation">
					<div class="icon" > Parameter normalization method: </div> 
					<div id="default" class="icon" style="background-color: red;" onclick="equationEditor.setNormMethod('default')" title="default"> $$\frac{m_i}{\sum_{i=0}^N(|a(m_i)_i|)}$$ </div> 
					<div id="euclidean"  class="icon" onclick="equationEditor.setNormMethod('euclidean')" title="euclidean norm"> $$\frac{m_i}{\sqrt(\sum_{i=1}^N(|a(m_i)_i|^2))}$$ </div> 
					<div id="pnorm" class="icon" onclick="equationEditor.setNormMethod('pNorm')" title="p-norm"> $$\frac{m_i}{\sqrt[p](\sum_{i=1}^N(|a(m_i)_i|^p))}$$ </div> 
					<div id="maxnorm" class="icon" onclick="equationEditor.setNormMethod('maxNorm')" title="Maximum norm"> $$\frac{m_i}{max(|m_i|,...,|m_n|)}$$ </div> 
						<div id="nonorm" class="icon" onclick="equationEditor.setNormMethod('noNorm')" title="No norm"> no normalization</div> 
				</div> 
				
				<div class="eexcess_equation_ranking_operation">
						
						<div class="icon" > Quality metric normalization method for ranking: </div> 
					<div id="defaultRank" class="icon"  onclick="equationEditor.setNormMethodRank('default')" title="default"> $$\frac{m_i}{\sum_{i=0}^N(|a(m_i)_i|)}$$ </div> 
					<div id="euclideanRank"  class="icon" style="background-color: red;" onclick="equationEditor.setNormMethodRank('euclidean')" title="euclidean norm"> $$\frac{m_i}{\sqrt(\sum_{i=1}^N(|a(m_i)_i|^2))}$$ </div> 
					<div id="pnormRank" class="icon" onclick="equationEditor.setNormMethodRank('pNorm')" title="p-norm"> $$\frac{m_i}{\sqrt[p](\sum_{i=1}^N(|a(m_i)_i|^p))}$$ </div> 
					<div id="maxnormRank" class="icon" onclick="equationEditor.setNormMethodRank('maxNorm')" title="Maximum norm"> $$\frac{m_i}{max(|m_i|,...,|m_n|)}$$ </div> 
						
				</div>
                <div id="eexcess_equation_controls">
					
					<div class="icon" onclick="equationEditor.createNewQM()" > <img src="media/saveBlack.png" height="30"/ title="save" > </div> 
					<div class="icon" ><img src="media/new.png" title="new element" height="30" onclick="equationEditor.clearEquationComposer()"/></div>
					
					<!-- <div class="icon" > <img src="media/undo.png" height="30"/ title="undo" onclick="equationEditor.undo()"> </div> 
					<div class="icon" ><img src="media/redo.png" title="redo" height="30"  onclick="equationEditor.redo()" /></div> -->
					<div class="icon" ><img src="media/delete.png" title="delete element" height="30" onclick="equationEditor.deleteSelectedElement()"/></div>
					<div class="icon" id="divAddBeforeSelected" onclick="equationEditor.addBeforeSelected()" ><img src="media/add.png" title="insert before" height="30" /> before</div>
					<div class="icon" id="divAddAfterSelected"  onclick="equationEditor.addAfterSlected()" ><img src="media/add.png" title="insert after" height="30"/> after</div>
					<div class="icon"  onclick="equationEditor.showNormPanels()" ><img src="media/settings.png" title="show norm panel" height="30"/> </div>
					
					<!-- <div class="icon" ><img src="media/zoomIn.png" title="zoom in" height="30" onclick="equationEditor.showMetric()"/></div> -->
					<div class="icon" ><img src="media/zoomOut.png" title="zoom out" height="30" onclick="equationEditor.showMore()"/></div>
					<!--<div class="icon" ><img src="media/show-all.png" title="show the whole equation" height="30" onclick="equationEditor.showWholeEquation()"/></div>
					<div id="stopwatchViz" class="icon"></div>
					<div id="stopwatchCalc"  class="icon"></div>-->
					<div id="equationStackSmall"> </div>
					
				</div> 
                <div id="eexcess_equation_stack">
					<!-- VERSION 1 -->
					 <!--<table style="display: inline-block; font-size: 40px;  border-collapse: collapse;"> -->
					<!-- <tr style="height: 1em; "><td  style=" border: 0px;"></td><td style=" border: 0px; border-bottom: 5px solid black; height: 1em"></td> <td style="border: 0px; border-bottom: 5px solid black; height: 1em"></td><td style="border: 0px; border-bottom: 5px solid black; height: 1em"></td><td style="border: 0px; border-bottom: 5px solid black; height: 1em"></td><td style="border: 0px; border-bottom: 5px solid black; height: 1em"></td></tr> -->
					<!-- <tr style="height: 4em"> <td style="border: 0px "> <sup>2</sup>&radic;</td> <td style="border: 0px ">(</td><td style="border: 4px solid red; width: 4em; height: 4em"></td> <td style="border: 0px ">&minus; </td>  <td style="border: 4px solid red; width: 4em; height: 4em"></td><td style="border: 0px; ">)</td></tr></table>-->
					
					<!-- Version 2 -->
					
					<div id="equition_stack_main_hidden" style="display: none" > </div>
					<div id="equition_stack_main" onclick="equationEditor.clickOnEquationStackMain()"><!-- <div style="border: 2px solid blue;"> <div class="eexcess_equation_empty_box"> </div> <div class="eexcess_equation_text"> &minus; </div> <div class="eexcess_equation_empty_box"> </div></div><div class="eexcess_equation_text">&minus; </div> <div class="eexcess_equation_empty_box"> </div> --></div>
					
					
					<!-- <div class="eexcess_equation_empty_box" id="tag-0" tag-pos="0" is-selected="true" > </div> -->
					
					<!-- Authority
					<img class="eexcess_tag_img" src="media/fancybox_sprite_close.png">
					<div class="div-slider ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" aria-disabled="false">
					<div class="ui-slider-range ui-widget-header ui-corner-all ui-slider-range-min" style="width: 100%;">
					</div>
					<a class="ui-slider-handle ui-state-default ui-corner-all" href="#" style="left: 100%;"></a></div></div> -->
					
				</div> 
				<div id="eexcess_equation_composer">
					<div style="float:left; font-size: 25px; border:0px;"><b> <button style="height: 2em; border:0px;" onclick="equationEditor.hideMenuEquationEditor()"> math </button> </b></div>
				<table id="eexcess_equation_composer_table">
					<tr><td onclick="equationEditor.simpleSymbol('+')">+</td><td onclick="equationEditor.simpleSymbol('-')"> &minus;</td><td onclick="equationEditor.simpleSymbol('*')">&times; </td><td onclick="equationEditor.simpleSymbol('/')">&divide;</td><td onclick="equationEditor.bricks()">()</td></tr>
					<tr><td onclick="equationEditor.radical()"><sup>n</sup>&radic;</td><td onclick="equationEditor.exponentiate()"> x<sup>n</sup></td><td onclick="equationEditor.logarithm()">log<sub>n</sub></td><td></td><td></td></tr>
					<!--<tr><td onclick="equationEditor.sum()">&sum;</td><td onclick="equationEditor.prod()">&prod;</td><td></td><td ></td><td></td></tr> -->
					</table>
					
				<table id="eexcess_equation_composer_table2">
					<tr><td onclick="equationEditor.sumMulti()">$$\sum$$</td><td onclick="equationEditor.prodMulti()">$$\prod$$</td><!--<td onclick="equationEditor.euclidean()">$$\sqrt(\sum_{i=1}^N(v_i^2))$$</td><td onclick="equationEditor.showWholeEquation()">show everything</td> <td></td><td></td> --></tr>
					</table>
				</div> 
                <div id="eexcess_vis_panel_controls">
                    <div id="eexcess_ranking_controls">
                        <!-- <button id="eexcess_btnreset">
                            <img src="media/batchmaster/refresh.png" title="Reset" />
                        </button>
                        <button id="eexcess_btn_sort_by_overall_score" title="Sort by overall score" sort-by="overallScore">
                            <img src="media//sort-down.png" />
                        </button>
                        <button id="eexcess_btn_sort_by_max_score" title="Sort by maximum score" sort-by="maxScore">
                            <img src="media/sort-down.png" />
                        </button> -->
				
                    </div>

                    <!-- <div id="eexcess_keywords_box">
                       <p>Drop tags here!</p> 
                    </div>-->
                </div>

                <div id="eexcess_vis_panel_canvas">
					<div id="output"> </div>
                    <div id="eexcess_content" >
                        <ul class="eexcess_result_list"></ul>
                    </div>

                    <div id="eexcess_canvas"></div>
                </div>

            </div>

            <div id="eexcess_document_panel">
			
						<div id="chart1" > 
                    <p> </p></div>
               <!-- <div id="eexcess_document_details">-->
                    <!--<div>
                        <label>Score: </label>
                        <h3 id="eexcess_document_details_title"></h3>
                    </div>-->
                    
                    <!--
                    <div>
                        <label>Language: </label>
                        <span id="eexcess_document_details_language"></span>
                    </div>
                    <div>
                        <label>Provider: </label>
                        <span id="eexcess_document_details_provider"></span>
                    </div>
                    -->
                <!--</div>-->
                <div id="eexcess_document_viewer">
                    <p> </p>
                </div>
            </div>

		</div>
 <div id="popup">
		
        <div class="schliessen"><img src="media/close.png" width="20"></div>
 
        <div id="popup_inhalt">
			<canvas id="canvas" ></canvas>      
		</div>
 
    </div>
	 <div id="popup_article_editor">
		
        <div class="close_article_editor"><img src="media/close.png" width="20"></div>
 
        <div id="popup_article_editor_content">
			<canvas id="canvas_article_editor" ></canvas>      
		</div>
 
    </div>
	
        <div id="task_question_message"></div>
        <script type="text/javascript" src="scripts/vis-controller.js" charset="utf-8"></script>
		<script type="text/javascript" src="scripts/search-articles.js" charset="utf-8"> </script>
		<script type="text/javascript" src="scripts/QMformula-editor.js"></script>
		<script>
		document.onkeydown = function (event) {
			if(event.keyCode == 16)
				equationEditor.shiftPressed(true);	
			
		}
		document.onkeyup = function (event) {
			if(event.keyCode == 16)
				equationEditor.shiftPressed(false);	
		}
		
		//var timerStopwatchViz = new Stopwatch(document.getElementById("stopwatchViz"));
		//var timerStopwatchCalc = new Stopwatch(document.getElementById("stopwatchCalc"));
		//equationEditor.setTimers(timerStopwatchViz, timerStopwatchCalc);
		//timerStopwatchViz.start();
		//timerStopwatchCalc.start();
	/*	$(document).ready(function () {
			console.log("DOCUMENT IS READY");
			var data = [
				['Heavy Industry', 0.3], ['Retail', 0.61], ['Light Industry', 0.75],
				['Out of home', 0.8], ['Commuting', 0.1], ['Orientation', 0.4]
			];
			var plot1 = jQuery.jqplot('chart1', [data], {
					seriesDefaults : {
						// Make this a pie chart.
						renderer : jQuery.jqplot.PieRenderer,
						rendererOptions : {
							// Put data labels on the pie slices.
							// By default, labels show the percentage of the slice.
							showDataLabels : true
						}
					},
					legend : {
						show : true,
						location : 'e'
					}
				});

		});*/
		</script>
		
    </body>
	
	
</html>

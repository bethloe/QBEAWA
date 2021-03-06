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
		
		<link rel="stylesheet" href="libs/jquery-toggles-master/css/toggles.css">
		<link rel="stylesheet" href="libs/jquery-toggles-master/css/themes/toggles-light.css">
		
		<!--[if lt IE 9]><script language="javascript" type="text/javascript" src="libs/jpplot.1.0.8/dist/excanvas.js"></script><![endif]-->
		<script language="javascript" type="text/javascript" src="libs/jpplot.1.0.8/dist/jquery.jqplot.min.js"></script>
		<link rel="stylesheet" type="text/css" href="libs/jpplot.1.0.8/dist/jquery.jqplot.css" />
		<script type="text/javascript" src="libs/jpplot.1.0.8/dist/plugins/jqplot.pieRenderer.min.js"></script>
		<script type="text/javascript" src="libs/jpplot.1.0.8/dist/plugins/jqplot.donutRenderer.min.js"></script>
		<script type="text/javascript" src="libs/jquery-toggles-master/toggles.min.js"></script>
	
		<script type="text/javascript" src="libs/MathJax-master/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>

		<script type="text/javascript" src="scripts/Stopwatch.js" charset="utf-8"> </script>
		<script type="text/javascript" src="scripts/formulasForNOrmalization.js" charset="utf-8"> </script>
		
        <script type="text/javascript" src="scripts/rankingQMsData.js" charset="utf-8"></script>
        <script type="text/javascript" src="scripts/globals.js" charset="utf-8"></script>
        <script type="text/javascript" src="scripts/rankingArray.js" charset="utf-8"></script>
        <script type="text/javascript" src="scripts/rankingModel.js" charset="utf-8"></script>
        <script type="text/javascript" src="scripts/rankingVis.js" charset="utf-8"></script>
        <script type="text/javascript" src="scripts/rankingQMVis.js" charset="utf-8"></script>
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
				<div id="eexcess_header_task_section_div"> 
				Mode:  <select id="modeSelector">
					<option value="normal" selected="selected">Normal</option>
					<option value="expert">Expert</option>
			     </select>
				Keyword: <input type="text" id="article-name" value="Visualization" /> 
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

	
		<div id="eexcess_main_panel" style="display: none;">

            <div id="eexcess_controls_left_panel">
			
				
				<div style=" color: white; padding: 3px; margin: 10px; font-size: 14px;" title="Quality Metrics are for todo...">
					<span style="background-color: #08519c; padding: 5px;"> Quality Metrics  </span> 
				</div>
				<div id="eexcess_qm_container_rank_button">
				<div id="eexcess_controls_left_panel_control_panel2"  style="position: relative;">
					<div style="position: absolute; float:left; right: 60px; color: white;" > Rank Quality Metrics: </div>
					<div class="toggle toggle-light" style="position: absolute; float:left; right: 0px;" > </div>
				
				</div>
	               <!--  <img align="right" width="50" style="cursor: pointer" title="rank" src="media/ranking.png" onclick="equationEditor.rankQMs()" />-->
				</div>
              <!--  <div id="rank_QMs" style="display:none">
                        <ul class="rank_QMs_list"></ul>
                </div>-->
                <div id="eexcess_qm_container">
                    <!--<div id="eexcess_qm_container_rank_button">
                        <button onclick="equationEditor.rankQMs()"> rank </button>
                    </div>-->
                </div>
				<hr />
				<div id="heading_Quality_Measure" style="  color: white; padding: 3px; margin: 10px; font-size: 14px;" title="Quality Measures are for todo...">
					<span style="background-color: #21B571;  padding: 5px;" > Quality Measures </span>
				</div>
				<div id="quality_measrues_norm_selector">
					<table align="center" ><tr><td> Norm: </td><td>  <select id="normMeasuresSelector">
					<option value="default" selected="selected" id="default" title="taxicab nrom">taxicab norm</option>
					<option value="euclidean" id="euclidean" title="euclidean norm">euclidean norm</option>
					<option value="pNorm" id="pnorm" title="p-norm">p-norm</option>
					<option value="maxNorm" id="maxnorm"  title="Maximum norm">maximum norm</option>
					<option value="noNorm" id="nonorm" title="No norm">no normalization</option>
			     </select>
				 </td></tr></table>
				 </div>
                <div id="eexcess_measures_container"></div>
            </div>

            <div id="eexcess_vis_panel" >

             <!--   <div class="eexcess_equation_ranking_operation">
					<div class="icon" > Parameter normalization method: </div> 
					<div id="default" class="icon" style="background-color: red;" onclick="equationEditor.setNormMethod('default')" title="default"> taxicab norm </div> 
					<div id="euclidean"  class="icon" onclick="equationEditor.setNormMethod('euclidean')" title="euclidean norm"> euclidean norm </div> 
					<div id="pnorm" class="icon" onclick="equationEditor.setNormMethod('pNorm')" title="p-norm"> p-nrom </div> 
					<div id="maxnorm" class="icon" onclick="equationEditor.setNormMethod('maxNorm')" title="Maximum norm"> maximum norm </div> 
						<div id="nonorm" class="icon" onclick="equationEditor.setNormMethod('noNorm')" title="No norm"> no normalization</div> 
				</div> -->
				
				<!-- <div class="eexcess_equation_ranking_operation">
						
						<div class="icon" > Quality metric normalization method for ranking: </div> 
					<div id="defaultRank" class="icon"  onclick="equationEditor.setNormMethodRank('default')" title="default"> taxicab norm </div> 
					<div id="euclideanRank"  class="icon" style="background-color: red;" onclick="equationEditor.setNormMethodRank('euclidean')" title="euclidean norm"> euclidean norm  </div> 
					<div id="pnormRank" class="icon" onclick="equationEditor.setNormMethodRank('pNorm')" title="p-norm"> p-nrom </div> 
					<div id="maxnormRank" class="icon" onclick="equationEditor.setNormMethodRank('maxNorm')" title="Maximum norm"> maximum norm</div> 
						
				</div> -->
                <div id="eexcess_equation_controls">
					
					<div class="icon" onclick="equationEditor.createNewQM()" > <img src="media/saveBlack.png" height="30"/ title="save" > </div> 
					<div class="icon" ><img src="media/new.png" title="new element" height="30" onclick="equationEditor.clearEquationComposer()"/></div>
					
					<!-- <div class="icon" > <img src="media/undo.png" height="30"/ title="undo" onclick="equationEditor.undo()"> </div> 
					<div class="icon" ><img src="media/redo.png" title="redo" height="30"  onclick="equationEditor.redo()" /></div> -->
					<div class="icon" ><img src="media/delete.png" title="delete element" height="30" onclick="equationEditor.deleteSelectedElement()"/></div>
					<div class="icon" id="divAddBeforeSelected" onclick="equationEditor.addBeforeSelected()" ><img src="media/add.png" title="insert before" height="30" /> before</div>
					<div class="icon" id="divAddAfterSelected"  onclick="equationEditor.addAfterSlected()" ><img src="media/add.png" title="insert after" height="30"/> after</div>
					<!--<div class="icon"  onclick="equationEditor.showNormPanels()" ><img src="media/settings.png" title="show norm panel" height="30"/> </div>-->
					<div class="icon"  onclick="equationEditor.showTextOfQM()" ><img src="media/showText.png" title="show text of QM" height="30"/> </div>
					<!-- <div class="icon" ><img src="media/zoomIn.png" title="zoom in" height="30" onclick="equationEditor.showMetric()"/></div> -->
					<div class="icon" ><img src="media/zoomOut.png" title="zoom out" height="30" onclick="equationEditor.showMore()"/></div>
					<div class="icon" ><img src="media/editing-done.png" title="editing done" height="30" onclick="equationEditor.setUserMode('advanced')"/></div>
					
					<!--<div class="icon" ><img src="media/show-all.png" title="show the whole equation" height="30" onclick="equationEditor.showWholeEquation()"/></div>
					<div id="stopwatchViz" class="icon"></div>
					<div id="stopwatchCalc"  class="icon"></div>-->
					<div class="equationStackSmall"> </div>
					
				</div> 
				
				<div id="eexcess_equation_controls_normal_mode">
					
					<div class="icon" onclick="equationEditor.setUserMode('advanced')" > <img src="media/show-all.png" height="30"/ title="show detail view of Quality Metric" > </div> 
					<div class="icon"  onclick="equationEditor.showTextOfQM()" ><img src="media/showText.png" title="show text of Quality Metric" height="30"/> </div>
					<div class="icon" id="switch_to_expert_mode" ><img src="media/edit.png" title="edit Quality Metric" height="30" onclick="equationEditor.setUserMode('expert')"/></div>
					
					<div class="equationStackSmall"> </div>
					
				</div> 
				
				<!--<div id="equation_stack_text_of_QM" style="display: none" > 
					<div id="QM_Text" > </div>
					<div id="edit_Icon_QM_Text" style="position: absolute; bottom: 0px; right: 0px;"><img src="media/edit.png" title="edit text" height="30" onclick="equationEditor.editQMText()"/></div>	
				</div>-->
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
				<div id="ranking_norm_selector">
					<table align="center" ><tr><td> Norm: </td><td>  <select id="normRankingSelector">
					<option value="default"  id="defaultRank" title="taxicab nrom">taxicab norm</option>
					<option value="euclidean" selected="selected" id="euclideanRank" title="euclidean norm">euclidean norm</option>
					<option value="pNorm" id="pnormRank" title="p-norm">p-norm</option>
					<option value="maxNorm" id="maxnormRank"  title="Maximum norm">maximum norm</option>
					 </select>
					 </td></tr></table>
				 </div>
                 <!--<div id="eexcess_vis_panel_controls">
                   <div id="eexcess_ranking_controls">
                        <!-- <button id="eexcess_btnreset">
                            <img src="media/batchmaster/refresh.png" title="Reset" />
                        </button>
                        <button id="eexcess_btn_sort_by_overall_score" title="Sort by overall score" sort-by="overallScore">
                            <img src="media//sort-down.png" />
                        </button>
                        <button id="eexcess_btn_sort_by_max_score" title="Sort by maximum score" sort-by="maxScore">
                            <img src="media/sort-down.png" />
                        </button> 
				
                    </div>

                    <!-- <div id="eexcess_keywords_box">
                       <p>Drop tags here!</p> 
                    </div>-->
             <!--   </div>-->

                <div id="eexcess_vis_panel_canvas">
					<div id="output"> </div>
                    <div id="eexcess_content" >
                        <ul class="eexcess_result_list"></ul>
                    </div>

                    <div id="eexcess_canvas"></div>
                </div>

            </div>

            <div id="eexcess_document_panel">
			<div id="equation_stack_text_of_QM" style="display: none" > 
					<div id="QM_Text" > </div>
					<div id="edit_Icon_QM_Text" style="position: absolute; bottom: 0px; right: 0px;"><img src="media/edit.png" title="edit text" height="30" onclick="equationEditor.editQMText()"/></div>	
					<div id="edit_Icon_QM_Text_Return" style="position: absolute; bottom: 0px; right: 0px;"><img src="media/return.png" title="return" height="30" onclick="equationEditor.editQMTextReturn()"/></div>	
				</div>
						<div id="chart1" style="display: none"> 
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
	<!--<div id="help1" > $$\frac{m_i}{\sqrt(\sum_{i=1}^N(|a(m_i)_i|^2))}$$ </div>-->
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
		$(document).ready(function () {
			$('.toggle').toggles({
				clicker : $('.clickme')
			});
			$('.toggle').on('toggle', function (e, active) {
				if (active) {
					equationEditor.rankQMs();
					console.log("toggle on");
				} else {
					equationEditor.returnFromRankQMs();
					console.log("toggle off");
				}
			});

			equationEditor.setInterfaceToMode();
			$("#modeSelector").change(function () {

				console.log("Handler for .change() called." + this.value);
				if (this.value == "expert")
					equationEditor.setUserMode("expert");
				else if (this.value == "normal")
					equationEditor.setUserMode("normal")

			});
			
			$("#normMeasuresSelector").change(function () {
				console.log("Handler for normMeasuresSelector.change() called." + this.value);
				equationEditor.setNormMethod(this.value);
			});
				
			$("#normRankingSelector").change(function () {
				console.log("Handler for normMeasuresSelector.change() called." + this.value);
				equationEditor.setNormMethodRank(this.value);
			});
			
			
			
			//SET TOOLTIPS
			$('#default').tooltip({ content :  formulaDefault});
			$('#euclidean').tooltip({ content :  formulaEuclidean});
			$('#pnorm').tooltip({ content :  formulaPnorm});
			$('#maxnorm').tooltip({ content :  formulaMaxnorm});
			$('#defaultRank').tooltip({ content :  formulaDefault});
			$('#euclideanRank').tooltip({ content :  formulaEuclidean});
			$('#pnormRank').tooltip({ content :  formulaPnorm});
			$('#maxnormRank').tooltip({ content :  formulaMaxnorm});
		});
		</script>
		
    </body>
	
	
</html>

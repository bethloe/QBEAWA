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
        <title>The ranking tool :-)</title>
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
		<script type="text/javascript" src="scripts/formulasForNormalization.js" charset="utf-8"> </script>
		
        <script type="text/javascript" src="scripts/colorsForRanking.js" charset="utf-8"></script>
        <script type="text/javascript" src="scripts/rankingQMsData.js" charset="utf-8"></script>
        <script type="text/javascript" src="scripts/logger.js" charset="utf-8"></script>
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
		<script type="text/javascript" src="scripts/retrieve-data-revisions.js" charset="utf-8"> </script>
		<script type="text/javascript" src="scripts/search-revisions-for-article.js" charset="utf-8"> </script>
		
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
				
				  
				Keyword: <input type="text" id="article-name" value="Visualization" /> 
				 Max. number of results: <input type="number" id="max-num" value="50"/>
				 <button onclick="searchArticle('visualization',50,equationEditor)"> retrieve data </button> 
		
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
			
				
				<div id="headlineQMs" style=" color: white; padding: 3px; margin: 10px; font-size: 14px;" title="">
					<span style="background-color: #08519c; padding: 5px;"> Quality Metrics  </span> 
				</div>
				<div id="eexcess_qm_container_rank_button">
				<div id="eexcess_controls_left_panel_control_panel2"  style="position: relative;">
					<div id="rank_quality_metrics_text" style="position: absolute; float:left; right: 60px; color: white;" title=""> Rank Quality Metrics: </div>
					<div id="rank_metrics_toggle" class="toggle toggle-light" style="position: absolute; float:left; right: 0px;" > </div>
				
				</div>
	              
				</div>
                <div id="eexcess_qm_container">
                   
                </div>
				<hr />
				<div id="heading_Quality_Measure" style="  color: white; padding: 3px; margin: 10px; font-size: 14px;" title="Quality Measures are for todo...">
					<span style="background-color: #21B571;  padding: 5px;" > Quality Measures </span>
				</div>
				<div id="quality_measrues_norm_selector">
					<table id="normMeasuresTable" align="center" title="test" ><tr><td> Norm: </td><td>  <select id="normMeasuresSelector">
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

          
                <div id="eexcess_equation_controls">
					
					<div class="icon" onclick="equationEditor.createNewQM()" > <img src="media/saveBlack.png" height="30"/ title="save" > </div> 
					<div class="icon" ><img src="media/new.png" title="new element" height="30" onclick="equationEditor.clearEquationComposer()"/></div>
					
					
					<div class="icon" ><img src="media/delete.png" title="delete element" height="30" onclick="equationEditor.deleteSelectedElement()"/></div>
					<div class="icon" id="divAddBeforeSelected" onclick="equationEditor.addBeforeSelected()" ><img src="media/add.png" title="insert before" height="30" /> before</div>
					<div class="icon" id="divAddAfterSelected"  onclick="equationEditor.addAfterSlected()" ><img src="media/add.png" title="insert after" height="30"/> after</div>
				
					<div class="icon" ><img src="media/zoomOut.png" title="zoom out" height="30" onclick="equationEditor.showMore()"/></div>
					
					<div class="equationStackSmall"> </div>				
					<div id="show_equaiton_composer_div" style="position: absolute; top: 5px; right: 10px;"> <div style="float:left;"> Equation Composer: </div> 	<div id="show_equation_composer_toggle1" class="toggle toggle-light" style="float:left;" > </div></div>
			
					
					
				</div> 
				
				<div id="eexcess_equation_controls_normal_mode">
					
					<div id="showMoreIcon" class="icon" onclick="equationEditor.setUserMode('advanced')" > <img src="media/show-all.png" height="30"/ title="show detail view of Quality Metric" > </div> 
					
					<div class="icon" id="switch_to_expert_mode" ><img src="media/edit.png" title="edit Quality Metric" height="30" onclick="equationEditor.setUserMode('expert')"/></div>
					
					<div id="show_equaiton_composer_div" style="position: absolute; top: 5px; right: 10px;"> <div style="float:left;"> Equation Composer: </div> 	<div id="show_equation_composer_toggle2" class="toggle toggle-light" style="float:left;" > </div></div>
			
					
					<div class="equationStackSmall"> </div>
						<div class="backButton"  style="cursor: pointer; display: none; position: relative; text-align: left; padding-top: 5px; padding-left:10px;" onclick="setDataToVisController()"> <img src="media/arrow_left.png" width="20px" /> </div>
				
				</div> 
				
		
                <div id="eexcess_equation_stack">

					
					<!--<div id="equition_stack_main_hidden" style="display: none" > </div>-->
					<div id="equition_stack_main" onclick="equationEditor.clickOnEquationStackMain()"></div>
					
					
					

					
				</div> 								
<div id="eexcess_equation_composer">
					<div style="float:left; font-size: 25px; border:0px;"><b> <button style="height: 2em; border:0px;" onclick="equationEditor.hideMenuEquationEditor()"> math </button> </b></div>
				<table id="eexcess_equation_composer_table">
					<tr><td onclick="equationEditor.simpleSymbol('+')">+</td><td onclick="equationEditor.simpleSymbol('-')"> &minus;</td><td onclick="equationEditor.simpleSymbol('*')">&times; </td><td onclick="equationEditor.simpleSymbol('/')">&divide;</td><td onclick="equationEditor.bricks()">()</td></tr>
					<tr><td onclick="equationEditor.radical()"><sup>n</sup>&radic;</td><td onclick="equationEditor.exponentiate()"> x<sup>n</sup></td><td onclick="equationEditor.logarithm()">log<sub>n</sub></td><td></td><td></td></tr>
	
					</table>
					
			
				</div> 
				<div id="equition_stack_main_combination" onclick="equationEditor.clickOnEquationStackMain()" style="display: none" >
				</div>
				<div id="eexcess_equation_composer_math_table2">
								<table id="eexcess_equation_composer_table2">
					<tr><td onclick="equationEditor.sumMulti()">$$\sum$$</td><td onclick="equationEditor.prodMulti()">$$\prod$$</td><td onclick="equationEditor.clearSelectedTagsForEquationEditorArray()">clear</td></tr>
					</table>
					</div>
				<div id="ranking_norm_selector" style="position: relative;">
					<div  id="changehreshold" style="cursor: pointer; position: relative; display:none; text-align: left; padding-left:10px;" > Change threshold: <input id="threshold" type="range"  min="0" max="1" step="0.01" value="0.1"/> <span id="valBox">0.1</span> </div>
					
					<div class="backButton"  style="cursor: pointer; display: none; position: relative; text-align: left; padding-top: 5px; padding-left:10px;" onclick="setDataToVisController()"> <img src="media/arrow_left.png" width="20px" /> </div>
					<table align="center" ><tr><td> Norm: </td><td>  <select id="normRankingSelector">
					<option value="default"  id="defaultRank" title="taxicab nrom">taxicab norm</option>
					<option value="euclidean" selected="selected" id="euclideanRank" title="euclidean norm">euclidean norm</option>
					<option value="pNorm" id="pnormRank" title="p-norm">p-norm</option>
					<option value="maxNorm" id="maxnormRank"  title="Maximum norm">maximum norm</option>
					 </select>
					 </td></tr></table>
					 <div id="draw_stacked_div" style="display: inline; position: relative;"> <div style="position: absolute; float:left; right: 60px; color: black; width: 60px;"> Draw split:</div> 	<div id="draw_stacked_toggle" class="toggle toggle-light" style="position: absolute; float:left; right: 0px;" > </div>
					 </div>
				 </div>
                 

                <div id="eexcess_vis_panel_canvas">
					<div id="output"> </div>
                    <div id="eexcess_content" >
                        <ul class="eexcess_result_list"></ul>
                    </div>

                    <div id="eexcess_canvas"></div>
                </div>

				
                <div id="eexcess_vis_panel_canvas_stat">
				
                    <div id="divstat1" class="eexcess_canvas" style="border-right: 
	 1px dashed black; border-bottom: 
	 1px dashed black;">
						<h1 id="h1stat1">  </h1>
						<div id="stat1" style="float:left;">
						</div>
						
						<div id="metersstat1" style="float:left;">
						</div>
					</div>
					
                    <div id="divstat2" class="eexcess_canvas" style="border-left: 
	 1px dashed black; border-bottom: 
	 1px dashed black;">
						<h1 id="h1stat2">  </h1>
						<div id="stat2" style="float:left;">
						</div>
						
						<div id="metersstat2" style="float:left;">
						</div>
					
					</div>
					
                    <div id="divstat3" class="eexcess_canvas" style="border-right: 
	 1px dashed black; border-top: 
	 1px dashed black;">
						<h1 id="h1stat3">  </h1>
						<div id="stat3" style="float:left;">
						</div>
						
						<div id="metersstat3" style="float:left;">
						</div>
					</div>
					
                    <div id="divstat4" class="eexcess_canvas" style="border-left: 
	1px dashed black; border-top: 
	1px dashed black;">
						<h1 id="h1stat4">  </h1>
						<div id="stat4" style="float:left;" >
						</div>
						
						<div id="metersstat4" style="float:left;" >
						</div>
					</div>
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
		GLOBAL_username = "u1";
		document.onkeydown = function (event) {
			if (event.keyCode == 16)
				equationEditor.shiftPressed(true);
			else if (event.ctrlKey || event.metaKey) {
				switch (String.fromCharCode(event.which).toLowerCase()) {
				case 's':
					event.preventDefault();
					equationEditor.savePressed();
					break;
				}
			}

		}
		document.onkeyup = function (event) {
			if (event.keyCode == 16)
				equationEditor.shiftPressed(false);
		}
		
	
		$(document).ready(function () {
			$("#threshold").change(function (e) {
				
				$("#valBox").html($(this).val());
				GLOBAL_threshold = $(this).val();
				equationEditor.thresholdChanged();
			});
		
			$('#show_equation_composer_toggle2').toggles({
				clicker : $('.clickme')
			});
			$('#show_equation_composer_toggle2').on('toggle', function (e, active) {
				if (active) {
					equationEditor.setUserMode("expert");
					$('#show_equation_composer_toggle1').toggles(true);
				} else {
					$('#show_equation_composer_toggle1').toggles(false);
					equationEditor.setUserMode("normal");
				}
			});

			$('#show_equation_composer_toggle1').toggles({
				clicker : $('.clickme')
			});
			$('#show_equation_composer_toggle1').on('toggle', function (e, active) {
				if (active) {
					equationEditor.setUserMode("expert");
					$('#show_equation_composer_toggle2').toggles(true);
				} else {
					$('#show_equation_composer_toggle2').toggles(false);
					equationEditor.setUserMode("normal");
				}
			});
			$('#draw_stacked_toggle').toggles({
				clicker : $('.clickme')
			});
			$('#draw_stacked_toggle').on('toggle', function (e, active) {
				if (active) {
					console.log("toggle on");
					equationEditor.drawCombinationSplitted();
				} else {
					equationEditor.drawCombinationStacked();
					console.log("toggle off");
				}
			});

			$('#rank_metrics_toggle').toggles({
				clicker : $('.clickme')
			});
			$('#rank_metrics_toggle').on('toggle', function (e, active) {
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
			
			$("#modeSelectorHelp").change(function () {

				console.log("Handler for .change() called." + this.value);
				if (this.value == "guided"){
					$('#modeSelectorTop').css("display", "none");
					equationEditor.setShowGuided(true);
				}
				else if (this.value == "notguided"){
					equationEditor.setShowGuided(false);
					$('#modeSelectorTop').css("display", "inline");
					}

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
			$('#headlineQMs').tooltip({content : 'Quality Metrics helps you to rank your wikipedia articles. <br /> \
												  <b> Click </b> on one of them and see how the ranking changes! '});
			$('#heading_Quality_Measure').tooltip({content : 'Quality Measures are extracted data out of the wikipedia articles. <br /> You can use these measures to create new Quality Metrics or to edit already existing ones! '});
			$('#normMeasuresTable').tooltip({content : 'In most cases it is good to bring all parameters to the same scale in order to be able to combine them. <br />For that reason you can choose between different normalization methods.'});
			$('#rank_quality_metrics_text').tooltip({content : 'How good is each Quality Metric compared with the others? <br /> <b> Click on the toggle to find it out!</b>'});
												  
		});
		</script>
		
    </body>
	
	
</html>

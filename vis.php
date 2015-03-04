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
        <script type="text/javascript" src="libs/natural-adapted.js" charset="utf-8"></script>
        <script type="text/javascript" src="libs/colorbrewer.js" charset="utf-8"></script>
        <script type="text/javascript" src="libs/dim-background.js" charset="utf-8"></script>
        <script type="text/javascript" src="libs/pos/lexer.js" charset="utf-8"></script>
        <script type="text/javascript" src="libs/pos/lexicon.js" charset="utf-8"></script>
        <script type="text/javascript" src="libs/pos/POSTagger.js" charset="utf-8"></script>
        <script type="text/javascript" src="libs/pos/pos.js" charset="utf-8"></script>
		<script type="text/javascript" src="libs/TextStatistics.js" charset="utf-8"> </script>
        <link rel="stylesheet" type="text/css" href="libs/ui/jquery-ui-1.10.4.custom.min.css">

        <script type="text/javascript" src="scripts/globals.js" charset="utf-8"></script>
        <script type="text/javascript" src="scripts/rankingArray.js" charset="utf-8"></script>
        <script type="text/javascript" src="scripts/rankingModel.js" charset="utf-8"></script>
        <script type="text/javascript" src="scripts/rankingVis.js" charset="utf-8"></script>
        <script type="text/javascript" src="scripts/settings.js" charset="utf-8"></script>
        <script type="text/javascript" src="scripts/utils.js" charset="utf-8"></script>
        <script type="text/javascript" src="scripts/taskStorage.js" charset="utf-8"></script>
		<script type="text/javascript" src="scripts/retrieve-data.js" charset="utf-8"> </script>
		<script type="text/javascript" src="scripts/search-articles.js" charset="utf-8"> </script>

        <link rel="stylesheet" type="text/css" href="css/general-style.css" />
        <link rel="stylesheet" type="text/css" href="css/vis-template-style-static.css" />
<!--        <link rel="stylesheet" type="text/css" href="css/vis-template-style-alternative-3-test.css" /> -->

        <link rel="stylesheet" type="text/css" href="css/vis-template-chart-style.css" />
    </head>
    <body>

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
				 <button onclick="searchArticle('visualization',50)"> retrieve data from specific article </button> 
				 <!--<button onclick="showAllDataTest()"> show data </button> </div>
                <p id="p_task"></p>
                <p id="p_question"></p> -->
	  		</section>
	  		<section id="eexcess_header_control_section">
                <input type="button" id="eexcess_list_button" value="Show List" />
                <input type="button" id="eexcess_text_button" value="Show Text" />
                <input type="button" id="eexcess_finished_button" value="Finished" />

                <section id="eexcess_selected_items_section" style="display:none"></section>
                <section id="eexcess_topic_text_section" style="display:none">
                    <p></p>
                </section>
            </section>
      	</header>

		<div id="eexcess_main_panel">

            <div id="eexcess_controls_left_panel">
                <div id="eexcess_keywords_container"></div>
            </div>

            <div id="eexcess_vis_panel" >

                <div id="eexcess_vis_panel_controls">
                    <div id="eexcess_ranking_controls">
                        <button id="eexcess_btnreset">
                            <img src="media/batchmaster/refresh.png" title="Reset" />
                        </button>
                        <button id="eexcess_btn_sort_by_overall_score" title="Sort by overall score" sort-by="overallScore">
                            <img src="media//sort-down.png" />
                        </button>
                        <button id="eexcess_btn_sort_by_max_score" title="Sort by maximum score" sort-by="maxScore">
                            <img src="media/sort-down.png" />
                        </button>
                    </div>

                    <div id="eexcess_keywords_box">
                        <p>Drop tags here!</p>
                    </div>
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
                <div id="eexcess_document_details">
                    <div>
                        <label>Title: </label>
                        <h3 id="eexcess_document_details_title"></h3>
                    </div>
                    
                    <div>
                        <label>Age: </label>
                        <span id="eexcess_document_details_year"></span>
                    </div>
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
                </div>
                <div id="eexcess_document_viewer">
                    <p></p>
                </div>
            </div>

		</div>

        <div id="task_question_message"></div>
        <script type="text/javascript" src="scripts/vis-controller.js" charset="utf-8"></script>
		<script type="text/javascript" src="scripts/search-articles.js" charset="utf-8"> </script>

    </body>
</html>

(function Starter() {
    var self = this;
    var dsm;
    this.dataset = {};
    this.datasetId = "NO_DATASET";

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /** Event Handlers  **/

    var selectDatasetChanged = function(){

        var text = "";
        self.datasetId = $("#select-dataset").val();

        if(self.datasetId != "NO_DATASET"){
            self.dataset = dsm.getDataset(self.datasetId);
            text = self.dataset.text;
        }
        $("#section-text").find("p").html(text);
    };

    var startButtonClicked = function(){
        if(self.datasetId != "NO_DATASET"){
            startVisualization();
        }
    };


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    function startVisualization(){
        //console.log("Status: Testing with Dataset " + this.datasetId);
        $("#eexcess_loading").fadeIn('fast');

        var arguments = {
            minRepetitions : (parseInt(this.dataset.data.length * 0.05) > 1) ? parseInt(this.dataset.data.length * 0.05) : 2
        };

        var keywordExtractor = new KeywordExtractor(arguments);

        this.dataset.data.forEach(function(d){
            d.title = d.title.clean();
            d.description = d.description.clean();
            var document = (d.description) ? d.title +'. '+ d.description : d.title;
            keywordExtractor.addDocument(document.removeUnnecessaryChars());
        });

        keywordExtractor.processCollection();

        this.dataset.data.forEach(function(d, i){
            d.keywords = keywordExtractor.listDocumentKeywords(i);
        });
        this.dataset.keywords = keywordExtractor.getCollectionKeywords();
        this.dataset['task-number'] = this.task;
        this.dataset['tool-aided'] = $("#select-tool-condition").val() || 'yes';

        $("input[name='dataset']").val(JSON.stringify(this.dataset));
        $("form").submit();
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /** Access point    **/

    (function(){
        // Fill dataset select options and bind event handler
        dsm = new datasetManager();
        var idsAndDescriptions = dsm.getDatsetsIDsAndDescriptions();
        var datasetOptions = "<option value=\"NO_DATASET\">Select dataset...</option>";
        idsAndDescriptions.forEach(function(ds){
            datasetOptions += "<option value=\"" + ds.id + "\">" + ds.description + "</option>";
        });

        $("#select-dataset").html(datasetOptions);
        // Bind event handlers for dataset select and start button
        $("#select-dataset").change(selectDatasetChanged);
        $("#start-button").click(startButtonClicked);

        var taskToken = tokenizer.tokenize($('#task').text());
        this.task = taskToken.length > 0 ? parseInt(taskToken) : 0;
    })();

})();











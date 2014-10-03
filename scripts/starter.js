
var dsm;
var dataset;
var datasetId;

var stemmer = natural.PorterStemmer; //natural.LancasterStemmer;
var tokenizer = new natural.WordTokenizer;
var nounInflector = new natural.NounInflector();
var tfidf = new natural.TfIdf();

stemmer.attach();
nounInflector.attach();

//var pos = require('pos');

var allTokens = [];
var allKeywords = [];

var EVT = {};


EVT.selectDatasetChanged = function(){

    var text = "", task = "";
    datasetId = $("#select-dataset").val();

    if(datasetId != "NO_DATASET"){
        dataset = dsm.getDataset(datasetId);
        text = dataset.text;
        task = dataset.task;
    }

    $("#section-text").find("p").text(text);
    $("#section-task").find("p").text(task);
};



EVT.startButtonClicked = function(){
    if(datasetId != "NO_DATASET")
        startVisualization();
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function startVisualization(){
    // console.log("Status: Testing with Dataset " + datasetId);
    dataset['tool-aided'] = $("#select-tool-condition").val();
    dataset = getDataWithKeywords(dataset);
    //dataset["keywords"] = averageKeywordScores(dataset.data);
    dataset["keywords"] = getGlobalKeywords(dataset.data);

    $("input[name='dataset']").val(JSON.stringify(dataset));
    $("form").submit();
}


function getDataWithKeywords(testDataset){

    testDataset.data.forEach(function(d, i){
        var document = (d.description !== "undefined") ? (d.title +'. '+ d.description).toLocaleLowerCase() : (d.title + '. ').toLowerCase();
        tfidf.addDocument(document);    // stemming in natural
        $.merge(allTokens, tokenizer.tokenize(document));
    });

    testDataset.data.forEach(function(d, i){
        d.keywords = [];

        tfidf.listTerms(i).forEach(function(item){
        //   if(d.keywords.length < 30){
               if(isNaN(item.term) && parseFloat(item.tfidf) > 0 ){
                   d.keywords.push( { 'term': item.term, 'score': item.tfidf } );
                   allKeywords.push(item.term);
                }
        //   }
        });
   });
    return testDataset;
}


function getGlobalKeywords(results) {

    var keywords = [];

    tfidf = new natural.TfIdf();
    tfidf.addDocument(allKeywords.join(' '));

    var scoreSum = 0;
    tfidf.listTerms(0).forEach(function(item){
        keywords.push({ 'term': '', 'stem': item.term, 'score': item.tfidf, 'repeated': 0, 'variations': [] });
        scoreSum += item.tfidf;
        //console.log("term = " + item.term + ' -- score = ' + item.tfidf + ' --- sumScore = ' + scoreSum);
    });

    var scoreMean = scoreSum / keywords.length;
    var cutIndex = 0;
   /*
    console.log('****************************************************');
    console.log('scoreSum = ' + scoreSum);
    console.log('scoreMean = ' + scoreMean);
    console.log('keywords length = ' + keywords.length);
    */
    while(keywords[cutIndex].score >= scoreMean)
        cutIndex++;
    keywords.splice(cutIndex, keywords.length - cutIndex);

  //  console.log('keywords length after 1st cut = ' + keywords.length);

    keywords.forEach(function(k){
        results.forEach(function(d){
            if(d.keywords.getIndexOf(k.stem, 'term') > -1)
                k.repeated++;
        });
    });


    var sortedKeywords = [];
    var minRepetitions = 4;//parseInt(results.length * 0.05);

    keywords.forEach(function(k){
        if(k.repeated > minRepetitions)
            sortedKeywords.splice(findIndexToInsert(k), 0, k);
    });

    function findIndexToInsert(keyword){
        var i = 0;
        while(i < sortedKeywords.length && keyword.repeated < sortedKeywords[i].repeated)
            i++;
        return i;
    }

   // console.log('keywords length after 2nd cut = ' + sortedKeywords.length);

    allTokens.forEach(function(token){
        var kIndex = sortedKeywords.getIndexOf(token.stem(), 'stem');
        if(kIndex >= 0 && sortedKeywords[kIndex].variations.indexOf(token) < 0 ){
            sortedKeywords[kIndex].variations.push(token);
        }
    });

    sortedKeywords.forEach(function(k){
        k.term = getTerm(k);
    });


    function getTerm(k){

        if(k.variations.length == 1)
            return k.variations[0];

        var stemIndex = k.variations.indexOf(k.stem);
        if(stemIndex > -1)
            return k.variations[stemIndex];

        var shortestTerm = k.variations[0];
        for(var i = 1; i < k.variations.length; i++){
            if(k.variations[i].length < shortestTerm.length)
                shortestTerm = k.variations[i];
        }
        return shortestTerm;
    }



  //  console.log('sorted keywords -- ' + sortedKeywords.length);
  //  console.log(JSON.stringify(sortedKeywords));

    return sortedKeywords
}



function averageKeywordScores(results){


    getGlobalKeywords(results);

    var keywords = [];
    var min = Number.MAX_VALUE;

    results.forEach(function(d){
       d.keywords.forEach(function(k) {
           var kIndex = keywords.getIndexOf(k.term, 'term');
           if(kIndex == -1){
               keywords.push({ 'term': k.term, 'stem': k.term.stem(), 'score': k.score, 'repeated': 1 });
           }
           else{
               var score = keywords[kIndex].score + k.score;
               var repeated = keywords[kIndex].repeated + 1;
               keywords[kIndex].score = score;
               keywords[kIndex].repeated = repeated;
           }
       });
    });

    var sortedKeywords = new Array();

    keywords.forEach(function(k, i){

        k.score = k.score / results.length;

        if(k.repeated > 1){
            var index = findIndexToInsert(k);
            if(index < sortedKeywords.length )
                sortedKeywords.splice(index, 0, k);
            else
                sortedKeywords.push(k);
        }
    });


    function findIndexToInsert(keyword){

        var i = 0;
        while(i < sortedKeywords.length && keyword.repeated < sortedKeywords[i].repeated)
            i++;
        return i;
    }


    /// not in use
    function findIndexInSortedKeywords(keyword){

        var center, inf = 0, sup = sortedKeywords.length - 1, wasGreater = false, wasLess = false;

        if(sortedKeywords.length == 0 || keyword.score > sortedKeywords[0].score)
            return 0;                           // keyword has the highest score and is to be inserted in the first position
        if(keyword.score < sortedKeywords[sup].score)
            return keywords.length;             // keyword has the lowest score and is to be inserted after the last item

        while(inf <= sup){
            center = parseInt((inf + sup) / 2);
            if(keyword.score == sortedKeywords[center].score)
                return center;
            else{
                if(keyword.score < sortedKeywords[center].score){
                    if(wasLess)
                        return inf;
                    sup = center - 1;
                    wasLess = true;
                }
                else{
                    if(wasGreater)
                        return sup - 1;
                    inf = center + 1;
                    wasGreater = true;
                }
            }
        }
        if(wasLess)
            return inf;
        return sup + 1;
    }



/*
    sortedKeywords.forEach(function(k, i){
        console.log('index = ' + i + ' -  term = ' + k.term + ' - score = ' + k.score);
    });
    */
    return sortedKeywords;
}




$(document).ready(function(){

    // Fill dataset select options and bind event handler
    dsm = new datasetManager();
    var datasets = dsm.getDataset();
    var datasetOptions = "<option value=\"NO_DATASET\">Select dataset...</option>";

    datasets.forEach(function(dataset){
        datasetOptions += "<option value=\"" + dataset["dataset-id"] + "\">" + dataset.description + "</option>";
    });

    $("#select-dataset").html(datasetOptions);

    // Bind event handlers for dataset select and start button
    $("#select-dataset").change(EVT.selectDatasetChanged);
    $("#start-button").click(EVT.startButtonClicked);
});















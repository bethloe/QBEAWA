function Settings(){

    Settings.prototype.getRankingDimensions = function(domRoot, containerHeight){

        var margin = {top: 0, bottom: 20, left: 2, right: 2 };
        var width = $(domRoot).width() - margin.left - margin.right;
        var height = containerHeight || '';

        return{ 'margin': margin, 'width': width, 'height': height };
	};




    /************************************************************
     * INITDATA
     *
     * **/
	Settings.prototype.getRankingInitData = function(rankingModel){

        var data = fixMissingAndMalformattedValues(rankingModel.getOriginalData());
        var ranking = rankingModel.getRanking();
        var attr = rankingModel.getMode();
        var a = [];
        var i = 0;

        while(i < ranking.length && ranking[i][attr] > 0){

            a[i] = ranking[i];
            a[i]['title']       = data[a[i].originalIndex]['title'];
            //a[i]['id']          = data[a[i].originalIndex]['id'];
            //a[i]['uri']         = data[a[i].originalIndex]['uri'];
            //a[i]['facets']      = new Array();
            //a[i]['facets']      = data[a[i].originalIndex]['facets'];

            var x0 = 0;
            var maxWeightedScoreFound = false;

            a[i]['weightedKeywords'].forEach(function(wk){

                if(rankingModel.getMode() === RANKING_MODE.overall_score){

                    wk['x0'] = x0;
                    wk['x1'] = x0 + wk['weightedScore'];
                    x0 = wk['x1'];
                }
                else{
                    if(wk['weightedScore'] == a[i]['maxScore'] && !maxWeightedScoreFound){
                        wk['x0'] = x0;
                        wk['x1'] = x0 + wk['weightedScore'];
                        x0 = wk['x1'];
                        maxWeightedScoreFound = true;
                    }
                    else{
                        wk['x0'] = x0;
                        wk['x1'] = x0;
                    }
                }
            });
            i++;
        }
        return { 'data' : a};
	};



    /************************************************************
     * INITDATA processing
     *
     * **/


    function fixMissingAndMalformattedValues(data){

        var dataArray = [];
        data.forEach(function(d){
            var obj = {};
            //obj['id'] = d.id;
            obj['title'] = d.title;
            //obj['uri'] = d.uri;
            //obj['facets'] = new Array();
            //obj['facets']['language'] = d.facets.language || 'en';
            //obj['facets']['provider'] = d.facets.provider;
            //obj['facets']['year'] = parseDate(String(d.facets.year));
            //obj['facets']['country'] = d.facets.country || "";
            //obj['keywords'] = d.keywords || [];

            dataArray.push(obj);
        });

        return dataArray;
    }

};

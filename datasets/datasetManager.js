

function datasetManager(){

    var datasets = {
        "T1-20" : getDataset_t1_20(),
        "T1-40" : getDataset_t1_40(),
        "T1-60" : getDataset_t1_60(),
        "T2-60" : getDataset_t2_60(),
        "T3-60" : getDataset_t3_60()
    };


    //checkDuplicatedItems(datasets['T2-60']);
    function checkDuplicatedItems(dataset) {

        var idsArray = [];
        console.log('**************************** Duplicated items for ' + dataset['dataset-id'] + ' ****************************');
        dataset.data.forEach(function(d, i){
            if(idsArray.indexOf(d.id) == -1){
                idsArray.push(d.id);
            }
            else{
                console.log("Id : " + d.id + "; title : " + d.title);
            }
        });
    }


    this.getDataset = function(datasetId){

        if(typeof datasetId != 'undefined' && datasetId != 'undefined'){
            var dataset = datasets[datasetId];
            dataset.data.shuffle();
            return dataset;
        }
        // If dataset id is not specified, return array with all the datasets
        var datasetIds = Object.keys(datasets);
        var datasetArray = [];
        datasetIds.forEach(function(id){
            datasetArray.push(datasets[id]);
        });
        return datasetArray;
    };


}

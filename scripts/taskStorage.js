function TaskStorage() {

    TaskStorage.prototype.setObject = function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    };


    TaskStorage.prototype.getObject = function(key) {
        var value = localStorage.getItem(key);
        return value && JSON.parse(value);
    };


    TaskStorage.prototype.saveTask = function(taskResults){

        if(taskResults['task-number'] === 0)
            return;

        if(taskResults['task-number'] === 1){
            this.evaluationResults.push({
                'user' : this.userCount,
                'tasks-results' : []
            });
        }
        this.evaluationResults[this.userCount]["tasks-results"].push(taskResults);
        this.setObject('evaluationResults', this.evaluationResults);
        this.setObject('userCount', this.userCount);
    };


    TaskStorage.prototype.getEvaluationResults = function(){
        return this.evaluationResults;
    };

    this.userCount = (function(value){
        if(value != null) return value; return 0;
    })(this.getObject('userCount'));


    this.evaluationResults = (function(value){
        if(value != null) return value; return [];
    })(this.getObject('evaluationResults'));




}

var GLOBAL_username = "";
var GLOBAL_logger = new Logger();

var GLOBAL_showRevisions = false;
var GLOBAL_threshold = 0.1; //For Recall, precision, F1-score

var RANKING_STATUS = {
    new : 'new',
    reset : 'reset',
    update : 'update',
    unchanged : 'unchanged',
    no_ranking : 'no_ranking'
};


var RANKING_MODE = {
    overall_score: 'overallScore',
    max_score: 'maxScore'
};

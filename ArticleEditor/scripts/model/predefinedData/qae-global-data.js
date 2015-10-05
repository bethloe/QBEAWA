var overallScoreInterval = 0;
var weightFlesch = 1;
var weightKincaid = 1;
var weightImageQuality = 1;
var weightExternalRefs = 1;
var weightAllLinks = 1;
var currentSelectedSectionIndex = -1;
var currentSelectedSectionId = -1;
var isAddNodeMode = false;
//-----------------------------------------------------------------------------
var numberOfMetrics = 5;
var influenceFlesch = parseFloat((100/numberOfMetrics)/100);
var influenceKincaid = parseFloat((100/numberOfMetrics)/100);
var influenceImageQuality = parseFloat((100/numberOfMetrics)/100);
var influenceExternalRefs = parseFloat((100/numberOfMetrics)/100);
var influenceAllLinks = parseFloat((100/numberOfMetrics)/100);
//------------------------------------------------------------------------------
var currentImageSrc; 
var GLOBAL_logger=new Logger(); 
var GLOBAL_fs;
var GLOBAL_wikiPageActive = false;
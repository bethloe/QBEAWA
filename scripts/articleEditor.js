
var dropdown = document.getElementById("dropdownID");
dropdown.onchange = update;
var roundnessSlider = document.getElementById("roundnessSlider");
roundnessSlider.onchange = update;

var roundnessScreen = document.getElementById("roundnessScreen");

var data = '<svg xmlns="http://www.w3.org/2000/svg" width="243" height="65">' +
	'<rect x="0" y="0" width="100%" height="100%" fill="#7890A7" stroke-width="20" stroke="#ffffff" ></rect>' +
	'<foreignObject x="15" y="10" width="100%" height="100%">' +
	'<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:40px">' +
	'<em>I</em> like' +
	'<span style="color:white; text-shadow:0 0 20px #000000;">' +
	'cheese</span>' +
	'</div>' +
	'</foreignObject>' +
	'</svg>';

var data2 = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">' +
 '<rect x="0" y="0" width="100%" height="100%" fill="#7890A7" stroke-width="1" stroke="#ffffff" ></rect>' +
	'<foreignObject x="0" y="0" width="100%" height="100%">' +
	'<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:11px">'
	+ '<p><b>Albert Einstein</b> (* <a href="/wiki/14._M%C3%A4rz" title="14. März">14. März</a> <a href="/wiki/1879" title="1879">1879</a> in <a href="/wiki/Ulm" title="Ulm">Ulm</a>; † <a href="/wiki/18._April" title="18. April">18. April</a> <a href="/wiki/1955" title="1955">1955</a> in <a href="/wiki/Princeton_(New_Jersey)" title="Princeton (New Jersey)">Princeton</a>, <a href="/wiki/New_Jersey" title="New Jersey">New Jersey</a>) war ein <a href="/wiki/Theoretische_Physik" title="Theoretische Physik" class="mw-redirect">theoretischer Physiker</a>. Seine Forschungen zur Struktur von <a href="/wiki/Materie_(Physik)" title="Materie (Physik)">Materie</a>, <a href="/wiki/Raum_(Physik)" title="Raum (Physik)">Raum</a> und <a href="/wiki/Zeit" title="Zeit">Zeit</a> sowie dem Wesen der <a href="/wiki/Gravitation" title="Gravitation">Gravitation</a> veränderten maßgeblich das physikalische Weltbild. Er gilt daher als einer der bedeutendsten Physiker aller Zeiten.<sup id="cite_ref-BBC-Artikel_1-0" class="reference"><a href="#cite_note-BBC-Artikel-1">[1]</a></sup></p>' +
	'</div>' + '</foreignObject>' + '</svg>';

var DOMURL = window.URL || window.webkitURL || window;

var img = new Image();
var svg = new Blob([data2], {
		type : 'image/svg+xml;charset=utf-8'
	});
var url = DOMURL.createObjectURL(svg);

// create an array with nodes
var nodes = [{
		id : 1,
		label : 'Node 1',
		image : "http://upload.wikimedia.org/wikipedia/commons/6/6f/Einstein-formal_portrait-35.jpg",
		shape : "image",
		value : 1
	}, {
		id : 2,
		label : 'Node 2',
		image : url,
		shape : 'image'
	}, {
		id : 3,
		label : 'Node 3'
	}, {
		id : 4,
		label : 'Node 4'
	}, {
		id : 5,
		label : 'Node 5'
	}
];

// create an array with edges
var edges = [{
		from : 1,
		to : 2,
		style : "arrow"
	}, {
		from : 1,
		to : 3,
		style : "arrow"
	}, {
		from : 2,
		to : 4,
		style : "arrow"
	}, {
		from : 2,
		to : 5,
		style : "arrow"
	}
];

// create a network
var container = document.getElementById('mynetwork');
var data = {
	nodes : nodes,
	edges : edges
};
var options = {

        dataManipulation: true,
	nodes : {
		widthMin : 5, // min width in pixels
		widthMax : 200 // max width in pixels
	},
	/*physics : {
	barnesHut : {
	gravitationalConstant : 0,
	springConstant : 0,
	centralGravity : 0
	}
	},*/
	smoothCurves : {
		dynamic : false,
		type : '1'
	}
};
var network = new vis.Network(container, data, options);

function update() {
	var type = dropdown.value;
	var roundness = roundnessSlider.value;
	roundnessScreen.value = roundness;
	var options = {
		physics : {
			barnesHut : {
				gravitationalConstant : 0,
				springConstant : 0,
				centralGravity : 0
			}
		},
		smoothCurves : {
			type : type,
			roundness : roundness
		}
	}

	network.setOptions(options);
}

update();

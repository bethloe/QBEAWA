
/**
 * parsing functions
 *
 * */

function parseDate( dateString ){

    if(dateString instanceof Date)
        return dateString;

	yearFormat = d3.time.format("%Y");
	var date = yearFormat.parse(dateString);

	if(date != null) return date;

	dateFormat = d3.time.format("%Y-%m");
	date = dateFormat.parse(dateString);

	if(date != null) return date;

	if( dateString.length == 8 )
		date = yearFormat.parse( dateString.substring(0, 4) );

	if(date != null) return date;

	if(dateString.contains("c "))
		date = yearFormat.parse( dateString.substring(2, 6) );

	if(date != null) return date;
	return yearFormat.parse('2014');
}



function toYear(date){

	formatYear = d3.time.format("%Y");
	var year = formatYear(date);
	//if(year != null)
		return year;
	//return "0";
}



/////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Array prototype
 *
 * */

Array.prototype.getIndexOf = function(target, field) {
	var array = this;
	for(var i = 0; i < array.length; i++) {
		if(array[i][field] === target)
			return i;
	}
	return -1;
};




// Fisher–Yates shuffle
//Array.prototype.shuffle = function() {
//    for (var i = this.length - 1; i > 0; i--) {
//        var j = Math.floor(Math.random() * (i + 1));
//        this.swap(i, j);
//    }
//};



Array.prototype.getObjectIndex = function(callback) {
    for(var i=0; i<this.length; i++) {
        if(callback.call(this, this[i], i, this))
            return i;
    }
    return -1;
};



/////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * String prototype
 *
 * */

String.prototype.contains = function(it) {
	return this.indexOf(it) != -1;
};


String.prototype.toBool = function() {
    return (this == "true");
};


String.prototype.isAllUpperCase = function() {
    return this.valueOf().toUpperCase() === this.valueOf();
};

String.prototype.clean = function(){
    var text = this;
    // Clean strings separated by -. E.g. deve- lopment -> development
    if(text.match(/\w+-\s/g)){
        var textArray = [],
            splitText = text.split(' ');
        for(var i = 0; i < splitText.length; ++i) {
            if(splitText[i].match(/\w+-$/)){
                textArray.push(splitText[i].replace('-', '') + splitText[i+1]);
                ++i;
            }
            else
                textArray.push(splitText[i]);
        }
        text = textArray.join(' ');
    }
    return text;
};


String.prototype.removeUnnecessaryChars = function() {
    return this.replace(/[-=’‘\']/g, ' ').replace(/[()\"“”]/g,'');
};


/////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Number prototype gunctionto parse milliseconds to minutes:seconds format
 *
 * */

Number.prototype.toTime = function(){
    var min = (this/1000/60) << 0;
    var sec = Math.floor((this/1000) % 60);
    if (min.toString().length == 1) min = '0' + min.toString();
    if (sec.toString().length == 1) sec = '0' + sec.toString();
    return min + ':' + sec;
};


Number.prototype.round = function(places) {
    return +(Math.round(this + "e+" + places)  + "e-" + places);
}


/////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * jQuery functions (for DOM elements)
 *
 * */


$.fn.outerHTML = function() {
    return $(this).clone().wrap('<div></div>').parent().html();
 };




$.fn.scrollTo = function( target, options, callback ){

	if(typeof options == 'function' && arguments.length == 2){
		callback = options;
		options = target;
	}

	var settings =
		$.extend({
			scrollTarget  : target,
			offsetTop     : 50,
			duration      : 500,
			easing        : 'swing'
		}, options);

	return this.each(function(){
		var scrollPane = $(this);

		var scrollTarget;
		if( typeof settings.scrollTarget == "number" ){
			scrollTarget = settings.scrollTarget;
		}
		else{
			if( settings.scrollTarget == "top" ){
				scrollTarget = 0;
			}
			else{
				scrollTarget = $(settings.scrollTarget);
                settings.offsetTop = scrollPane.offset().top;
			}
		}

		//var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
		var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollPane.scrollTop() + scrollTarget.offset().top - settings.offsetTop;

		scrollPane.animate({scrollTop : scrollY }, parseInt(settings.duration), settings.easing, function(){
            if (typeof callback == 'function') { callback.call(this); }
		});
	});
};







/////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * hex to RGB converter
 *
 * */

function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}


/////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * format gradient string
 *
 * */

function getGradientString(color, shades) {

    var rgb = (color.contains('#')) ? (hexToR(color) + ", " + hexToG(color) + ", " +hexToB(color)) : color;

    var gradient = "-webkit-linear-gradient(top";
    shades.forEach(function(s){
        gradient += ", rgba(" + rgb + ", " + s + ")"
    });

    gradient += ")";
    return gradient;
}


var utility_drawArrow = function (ctx, fromx, fromy, tox, toy, text, color, lineWidth) {

	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.globalAlpha = 1;

	ctx.lineWidth = lineWidth;
	var headlen = 20; // length of head in pixels
	var angle = Math.atan2(toy - fromy, tox - fromx);
	ctx.moveTo(fromx, fromy);
	ctx.lineTo(tox, toy);
	ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
	ctx.moveTo(tox, toy);
	ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
	ctx.stroke();
	//Print text
	var dx = tox - fromx;
	var dy = toy - fromy;
	pad = 0.3;
	ctx.save();

	ctx.translate(fromx + dx * pad, fromy + dy * pad);
	if (dx < 0) {
		ctx.rotate(Math.atan2(dy, dx) - Math.PI); //to avoid label upside down
	} else {
		ctx.rotate(Math.atan2(dy, dx));
	}
	ctx.fillStyle = color;
	ctx.fillText(text, 3, 0);
	//DRAW ARROWS
	if (text != '') {
		ctx.beginPath();
		fromx = 10;
		fromy = -30;
		//Arrows for switching operation
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(fromx - 10, fromy + 10);

		ctx.moveTo(fromx, fromy);
		ctx.lineTo(fromx + 10, fromy + 10);

		fromx = 10;
		fromy = 15;
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(fromx - 10, fromy - 10);

		ctx.moveTo(fromx, fromy);
		ctx.lineTo(fromx + 10, fromy - 10);
		ctx.stroke();
	}
	ctx.restore();

}

function drawLineAsRect(ctx, lineAsRect, color) {
	var r = lineAsRect;
	ctx.save();
	ctx.beginPath();
	ctx.translate(r.translateX, r.translateY);
	ctx.rotate(r.rotation);
	ctx.rect(r.rectX, r.rectY, r.rectWidth, r.rectHeight);
	ctx.translate(-r.translateX, -r.translateY);
	ctx.rotate(-r.rotation);
	ctx.fillStyle = color;
	ctx.strokeStyle = color;
	ctx.fill();
	ctx.stroke();
	ctx.restore();
}

function defineLineAsRect(x1, y1, x2, y2, lineWidth) {
	var dx = x2 - x1; // deltaX used in length and angle calculations
	var dy = y2 - y1; // deltaY used in length and angle calculations
	var lineLength = Math.sqrt(dx * dx + dy * dy);
	var lineRadianAngle = Math.atan2(dy, dx);

	return ({
		translateX : x1,
		translateY : y1,
		rotation : lineRadianAngle,
		rectX : 0,
		rectY : -lineWidth / 2,
		rectWidth : lineLength,
		rectHeight : lineWidth
	});
}

function drawDownArrow(ctx, fromx, fromy, size) {

	ctx.beginPath();
	ctx.moveTo(fromx, fromy);
	ctx.lineTo(fromx - size, fromy - size);

	ctx.moveTo(fromx, fromy);
	ctx.lineTo(fromx + size, fromy - size);
	ctx.stroke();
}

function drawUpArrow(ctx, fromx, fromy, size) {
	ctx.beginPath();
	ctx.moveTo(fromx, fromy);
	ctx.lineTo(fromx - size, fromy + size);

	ctx.moveTo(fromx, fromy);
	ctx.lineTo(fromx + size, fromy + size);
	ctx.stroke();
}

var drawPrecisionRecall = function (canvasName, posX, posY, lengthX, lengthY, colorFN, colorTN, colorTP, colorFP, alphaFN, alphaTN, alphaTP, alphaFP, FN, TN, TP, FP) {
	var canvas = document.getElementById(canvasName);
	var context = canvas.getContext('2d');

	context.globalAlpha = alphaFN;
	context.beginPath();
	context.rect(posX, posY, lengthX / 2, lengthY);
	context.fillStyle = colorFN;
	context.fill();
	context.lineWidth = 3;
	context.strokeStyle = 'black';
	context.stroke();

	context.globalAlpha = 1;
	context.fillStyle = "black";

	context.globalAlpha = alphaTN;
	context.beginPath();
	context.rect(posX + lengthX / 2, posY, lengthX / 2, lengthY);
	context.fillStyle = colorTN;
	context.fill();
	context.lineWidth = 3;
	context.strokeStyle = 'black';
	context.stroke();

	context.globalAlpha = 1;

	context.fillStyle = "black";

	context.globalAlpha = alphaTP;
	context.beginPath();
	context.arc(posX + lengthX / 2, posY + lengthY / 2, lengthY / 2 - lengthY / 10, Math.PI * 0.5, 1.5 * Math.PI, false);
	context.closePath();
	context.lineWidth = 3;
	context.fillStyle = colorTP;
	context.fill();
	context.strokeStyle = '#550000';
	context.stroke();

	context.globalAlpha = 1;
	context.fillStyle = "black";

	context.globalAlpha = alphaFP;
	context.beginPath();
	context.arc(posX + lengthX / 2, posY + lengthY / 2, lengthY / 2 - lengthY / 10, Math.PI * 0.5, 1.5 * Math.PI, true);
	context.closePath();
	context.lineWidth = 3;
	context.fillStyle = colorFP;
	context.fill();
	context.strokeStyle = '#550000';
	context.stroke();

	context.globalAlpha = 1;
	context.font = 'italic 12pt Calibri';
	context.fillStyle = "black";
	context.fillText('FN: ' + FN, posX + 20, posY + 20);
	context.fillText('TN: ' + TN, posX + lengthX - 80 + 20, posY + 20);
	context.fillText('TP: ' + TP, posX + lengthX / 4 + 10, posY + lengthY / 2);
	context.fillText('FP: ' + FP, posX + lengthX / 2 + 20, posY + lengthY / 2);
}

//COLORS:
function Interpolate(start, end, steps, count) {
	var s = start,
	e = end,
	final = s + (((e - s) / steps) * count);
	return Math.floor(final);
}

function Color(_r, _g, _b) {
	var r,
	g,
	b;
	var setColors = function (_r, _g, _b) {
		r = _r;
		g = _g;
		b = _b;
	};

	setColors(_r, _g, _b);
	this.getColors = function () {
		var colors = {
			r : r,
			g : g,
			b : b
		};
		return colors;
	};
}

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

















var utility_drawArrow = function (ctx, fromx, fromy, tox, toy, text, color, lineWidth) {

	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.globalAlpha = 1;
	
	ctx.lineWidth=lineWidth;
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
	ctx.fillText(text, 0, 0);
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

//---------------------------------------------------------

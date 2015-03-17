<!doctype html>
<html>
<head>
<script type="text/javascript" src="http://code.jquery.com/jquery.min.js"></script>
<script type="text/javascript" src="libs/CanvasInput.min.js"></script>


<style>
    body{ background-color: white; padding:20px;}
    #canvas{border:1px solid black;}
</style>


</head>

<body><canvas id="canvas" width="1050" height="500"></canvas>
	<script>

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var input = new CanvasInput({
			canvas : document.getElementById('canvas'),
			fontSize : 18,
			fontFamily : 'Arial',
			fontColor : '#212121',
			fontWeight : 'bold',
			width : 300,
			padding : 8,
			borderWidth : 1,
			borderColor : '#000',
			borderRadius : 3,
			boxShadow : '1px 1px 0px #fff',
			innerShadow : '0px 0px 5px rgba(0, 0, 0, 0.5)',
			placeHolder : 'Enter message here...',
			x : 200,
			y : 200
		});

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	input.render();
</script>
</body>
</html>
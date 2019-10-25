function Circle(x,y,radius){
	this.x = x;
	this.y = y;
	this.radius = radius;
}

function Line(startPoint, endPoint,thickness){
	this.startPoint = startPoint;
	this.endPoint = endPoint;
	this.thickness = thickness;
}

function isIntersect(line1,line2){
	//
	var a1 = line1.endPoint.y - line1.startPoint.y;
	var b1 = line1.startPoint.x - line1.endPoint.x;
	var c1 = a1*line1.startPoint.x + b1*line1.startPoint.y;
	//
	var a2 = line2.endPoint.y - line2.startPoint.y;
	var b2 = line2.startPoint.x - line2.endPoint.x;
	var c2 = a2*line2.startPoint.x + b2*line2.startPoint.y;
	
	var d = a1*b2 - a2*b1;
	
	if(d==0){
		return false;
	}else{
		var x = (b2*c1 - b1*c2)/d;
		var y = (a1*c2 - a2*c1)/d;
		if((isInBetween(line1.startPoint.x, x, line1.endPoint.x) || isInBetween(line1.startPoint.y,y,line1.endPoint.y))
			&& 
		   (isInBetween(line2.startPoint.x, x, line2.endPoint.x) || isInBetween(line2.startPoint.y,y,line2.endPoint.y))
		){
			return true;
		}
	}
	return false;
}

function isInBetween(a,b,c){
	if(Math.abs(a-b)<0.00001 || Math.abs(b-c)<0.00001){
		return false;
	}
	return (a<b && b<c) || (c<b && b<a);
}

function updateLineIntersection(){
	for(var i=0;i<untangleGame.lines.length;i++){
		for(var j=0;j<i;j++){
			var line1 = untangleGame.lines[i];
			var line2 = untangleGame.lines[j];
			if(isIntersect(line1,line2)){
				line1.thickness = untangleGame.boldLineThickness;
				line2.thickness = untangleGame.boldLineThickness;
			}
		}
	}
}

var untangleGame = {
	circles:[],
	thinLineThickness:1,
	boldLineThickness:5,
	lines:[],
	currentLevel:0,
};

untangleGame.levels = [
    {
	    "level":0,
		"circles":[
		    {"x":400,"y":156},
			{"x":381,"y":241},
			{"x":84,"y":233},
			{"x":88,"y":73},
		],
		"relationship": {
			"0":{"connectedPoints":[1,2]},
			"1":{"connectedPoints":[0,3]},
			"2":{"connectedPoints":[0,3]},
			"3":{"connectedPoints":[1,2]},
		}
    },
	{
	    "level":1,
		"circles":[
		    {"x":401,"y":73},
			{"x":400,"y":240},
			{"x":88,"y":241},
			{"x":84,"y":72},
		],
		"relationship": {
			"0":{"connectedPoints":[1,2,3]},
			"1":{"connectedPoints":[0,2,3]},
			"2":{"connectedPoints":[0,1,3]},
			"3":{"connectedPoints":[0,1,2]},
		}
    },
	{
	    "level":2,
		"circles":[
		    {"x":92,"y":85},
			{"x":253,"y":13},
			{"x":393,"y":86},
			{"x":390,"y":214},
			{"x":248,"y":275},
			{"x":95,"y":216},
		],
		"relationship": {
			"0":{"connectedPoints":[2,3,4]},
			"1":{"connectedPoints":[3,5]},
			"2":{"connectedPoints":[0,4,5]},
			"3":{"connectedPoints":[0,1,5]},
			"4":{"connectedPoints":[0,2]},
			"5":{"connectedPoints":[1,2,3]},
		}
    },
];

function drawLine(ctx,x1,y1,x2,y2,thickness){
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.lineWidth = thickness;
	ctx.strokeStyle = "#cfc";
	ctx.stroke();
}

function drawCircle(ctx,x,y,radius){
	ctx.fillStyle = "rgba(200,200,100, .9)";
	ctx.beginPath();
	ctx.arc(x,y,radius,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();
}

function connectCircles(ctx){
	untangleGame.lines.length = 0;
	
	var level = untangleGame.levels[untangleGame.currentLevel];
	for(var i in level.relationship){
		var connectedPoints = level.relationship[i].connectedPoints;
		var startPoint = untangleGame.circles[i];
		for(var j in connectedPoints){
			var endPoint = untangleGame.circles[connectedPoints[j]];
			untangleGame.lines.push(new Line(startPoint,endPoint,untangleGame.thinLineThickness));
		}
	}
	updateLineIntersection();
}

function clear(ctx, canvas){
	ctx.clearRect(0,0,canvas.width,canvas.height);
}

jQuery(document).ready(function(){
	var canvas = document.getElementById('game');
	var ctx = canvas.getContext('2d');
	
	setupCurrentLevel(ctx);
	
	
	$("#game").mousedown(function(e){
		var canvasPosition = $(this).offset();
		var mouseX = (e.pageX - canvasPosition.left) || 0;
		var mouseY = (e.pageY - canvasPosition.top) || 0;
		for(var i = 0;i<untangleGame.circles.length;i++){
			var circleX =  untangleGame.circles[i].x;
			var circleY =  untangleGame.circles[i].y;
			var radius = untangleGame.circles[i].radius;
			if(Math.pow(mouseX - circleX,2) + Math.pow(mouseY -circleY,2) < Math.pow(radius,2)){
				untangleGame.targetCircle = i;
				break;
			}
		}
	});
	$("#game").mousemove(function(e){
		if(untangleGame.targetCircle!=undefined){
			var canvasPosition = $(this).offset();
			var mouseX = (e.pageX - canvasPosition.left) || 0;
			var mouseY = (e.pageY - canvasPosition.top) || 0;
			var radius = untangleGame.circles[untangleGame.targetCircle].radius;
			untangleGame.circles[untangleGame.targetCircle] = new Circle(mouseX, mouseY, radius);
		}
		connectCircles(ctx);
		updateLevelProgress();
	});
	$("#game").mouseup(function(e){
		untangleGame.targetCircle = undefined;
		checkLevelCompleteness();
	});
	setInterval(gameloop, 30);
});


function gameloop(){
	var canvas = document.getElementById('game');
	var ctx = canvas.getContext('2d');
	clear(ctx, canvas);
	for(var i = 0;i<untangleGame.lines.length;i++){
		var line = untangleGame.lines[i];
		var startPoint = line.startPoint;
		var endPoint = line.endPoint;
		var thickness = line.thickness;
		drawLine(ctx,startPoint.x,startPoint.y,endPoint.x,endPoint.y,thickness);
	}
	for(var i = 0;i<untangleGame.circles.length;i++){
		var circle = untangleGame.circles[i];
		drawCircle(ctx,circle.x,circle.y,circle.radius);
	}
}

function setupCurrentLevel(ctx){
	untangleGame.circles = [];
	var level = untangleGame.levels[untangleGame.currentLevel];
	for(var i =0;i<level.circles.length;i++){
		var circle = level.circles[i];
		untangleGame.circles.push(new Circle(circle.x,circle.y,10));
	}
	connectCircles(ctx);
}

function checkLevelCompleteness(){
	if($("#progress").html() == "100"){
		if(untangleGame.currentLevel+1 < untangleGame.levels.length)
			untangleGame.currentLevel++;
		setupCurrentLevel();
	}
}

function updateLevelProgress(){
	var progress = 0;
	for(var i = 0;i<untangleGame.lines.length;i++){
		if(untangleGame.lines[i].thickness == untangleGame.thinLineThickness){
			progress++;
		}
	}
	var progressPercentage = Math.floor(progress/untangleGame.lines.length*100);
	//console.log(progress);
	$("#progress").html(progressPercentage);
	$("#level").html(untangleGame.currentLevel);
}
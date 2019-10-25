//############################################################################################################################## begin of 数据定义&&数据更新
var untangleGame = {
	layers:[],
	canvas:[],
	circles:[],
	thinLineThickness:1,
	boldLineThickness:5,
	lines:[],
	currentLevel:0,
	circleRadius:10,
	progressPercentage:0,
	frameCount:0,
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
		    {"x":401,"y":93},
			{"x":400,"y":260},
			{"x":88,"y":261},
			{"x":84,"y":92},
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
		    {"x":92,"y":105},
			{"x":253,"y":53},
			{"x":393,"y":126},
			{"x":390,"y":254},
			{"x":248,"y":315},
			{"x":95,"y":256},
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

function Circle(x,y){
	this.x = x;
	this.y = y;
}

function Line(startPoint, endPoint,thickness){
	this.startPoint = startPoint;
	this.endPoint = endPoint;
	this.thickness = thickness;
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

function connectCircles(){
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

function setupCurrentLevel(){
	untangleGame.circles = [];
	var level = untangleGame.levels[untangleGame.currentLevel];
	for(var i =0;i<level.circles.length;i++){
		var circle = level.circles[i];
		untangleGame.circles.push(new Circle(circle.x,circle.y));
	}
	connectCircles();
}

function checkLevelCompleteness(){
	if(untangleGame.progressPercentage >= 100){
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
	untangleGame.progressPercentage = progressPercentage;
}
//############################################################################################################################## end of 数据定义&&数据更新


//############################################################################################################################## begin of 绘图函数
function drawLine(ctx,x1,y1,x2,y2,thickness){
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.lineWidth = thickness;
	ctx.strokeStyle = "#cfc";
	ctx.stroke();
}

function drawCircle(ctx,x,y){
	var circle_gradient = ctx.createRadialGradient(x-3,y-3,1,x,y,untangleGame.circleRadius);
	circle_gradient.addColorStop(0,"#fff");
	circle_gradient.addColorStop(1,"#cc0");
	ctx.fillStyle = circle_gradient;
	ctx.beginPath();
	ctx.arc(x,y,untangleGame.circleRadius,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();
}

function clear(ctx, canvas){
	ctx.clearRect(0,0,canvas.width,canvas.height);
}

function drawLayerBG(){
	var ctx = untangleGame.layers[0];
	var canvas = untangleGame.canvas[0];
	clear(ctx, canvas);
	ctx.drawImage(untangleGame.background,0,0,canvas.width,canvas.height);
}

function drawLayerGuide(){
	
}

function drawLayerGame(){
	var ctx = untangleGame.layers[2];
	var canvas = untangleGame.canvas[2];
	clear(ctx,canvas);
	//绘制所有连线
	for(var i = 0;i<untangleGame.lines.length;i++){
		var line = untangleGame.lines[i];
		var startPoint = line.startPoint;
		var endPoint = line.endPoint;
		var thickness = line.thickness;
		drawLine(ctx,startPoint.x,startPoint.y,endPoint.x,endPoint.y,thickness);
	}
	//绘制所有圆
	for(var i = 0;i<untangleGame.circles.length;i++){
		var circle = untangleGame.circles[i];
		drawCircle(ctx,circle.x,circle.y);
	}
}

function drawLayerUI(){
	var ctx = untangleGame.layers[3];
	var canvas = untangleGame.canvas[3];
	clear(ctx,canvas);
	ctx.font = "45px 'CaiYunHanMaoBi-1ca6ec413e209d2'";
	ctx.fillStyle = "#ffffff";
	
	ctx.textAlign = "left";
	ctx.textBaseline = "bottom";
	ctx.fillText("Puzzle "+untangleGame.currentLevel+", Completeness:"+untangleGame.progressPercentage+"%",60,ctx.canvas.height-45);
	
	//获取所有圆，检测是否有UI和游戏对象重叠
	var isOverlappedWithCircle = false;
	for(var i in untangleGame.circles){
		var point = untangleGame.circles[i];
		if(point.y > 310){
			isOverlappedWithCircle = true;
		}
	}
	if(isOverlappedWithCircle){
		$("#ui").addClass("dim");
	}else{
		$("#ui").removeClass('dim');
	}
}

//############################################################################################################################## end of 绘图函数


//############################################################################################################################## begin of 几何检测函数
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
//############################################################################################################################## end of 几何检测函数


jQuery(document).ready(function(){
	//初始化画布缓存
	var canvas_bg = document.getElementById("bg");
	untangleGame.canvas[0]= canvas_bg;
	untangleGame.layers[0]= canvas_bg.getContext('2d');
	var canvas_guide = document.getElementById("guide");
	untangleGame.canvas[1]= canvas_guide;
	untangleGame.layers[1]= canvas_guide.getContext('2d');
	var canvas = document.getElementById("game");
	untangleGame.canvas[2]= canvas;
	untangleGame.layers[2]= canvas.getContext('2d');
	var canvas_ui = document.getElementById("ui");
	untangleGame.canvas[3]= canvas_ui;
	untangleGame.layers[3]= canvas_ui.getContext('2d');
	
	setupCurrentLevel();
	
	$("#layers").mousedown(function(e){
		var canvasPosition = $(this).offset();
		var mouseX = (e.pageX - canvasPosition.left) || 0;
		var mouseY = (e.pageY - canvasPosition.top) || 0;
		for(var i = 0;i<untangleGame.circles.length;i++){
			var circleX =  untangleGame.circles[i].x;
			var circleY =  untangleGame.circles[i].y;
			var radius = untangleGame.circleRadius;
			if(Math.pow(mouseX - circleX,2) + Math.pow(mouseY -circleY,2) < Math.pow(radius,2)){
				untangleGame.targetCircle = i;
				break;
			}
		}
	});
	$("#layers").mousemove(function(e){
		if(untangleGame.targetCircle!=undefined){
			var canvasPosition = $(this).offset();
			var mouseX = (e.pageX - canvasPosition.left) || 0;
			var mouseY = (e.pageY - canvasPosition.top) || 0;
			untangleGame.circles[untangleGame.targetCircle] = new Circle(mouseX, mouseY);
		}
		connectCircles();
		updateLevelProgress();
	});
	$("#layers").mouseup(function(e){
		untangleGame.targetCircle = undefined;
		checkLevelCompleteness();
	});
	
	showLoading();
	//加载背景图像
	untangleGame.background = new Image();
	untangleGame.background.onload = function(){
		setInterval(gameloop, 30);
	}
	untangleGame.background.onerror = function(){
		alert("error loading the bg image");
	}
	untangleGame.background.src = "images/blackboard.jpg";
});


function showLoading(){
	var ctx = untangleGame.layers[3];
	var canvas = untangleGame.canvas[3];
	clear(ctx, canvas);
	var bg_gradient = ctx.createLinearGradient(0,0,0,ctx.canvas.height);
	bg_gradient.addColorStop(0,"#cccccc");
	bg_gradient.addColorStop(1,"#efefef");
	ctx.fillStyle = bg_gradient;
	ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
	ctx.font = "45px 'CaiYunHanMaoBi-1ca6ec413e209d2'";
	ctx.textAlign = "center";
	ctx.fillStyle = "#333333";
	ctx.fillText("loading...", ctx.canvas.width/2, canvas.height/2);
	
}

function gameloop(){
	if(untangleGame.frameCount == 0){
		drawLayerBG();
	}
    drawLayerGuide();
	drawLayerGame();
	drawLayerUI();
	untangleGame.frameCount++;
}


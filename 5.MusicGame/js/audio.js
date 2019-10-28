var audiogame = {
	frameCount:0,
}
audiogame.canvas = [];
audiogame.ctxs = [];
audiogame.musicNotes = [];
audiogame.leveldata = "1.592,3;1.984,2;2.466,1;2.949,2;4.022,3;4.443,2;4.594,1;5.498,3;5.92,2;6.04,1;7.034,2;7.395,3;7.968,2;8.45,1;8.962,2;10.018,3;10.258,2;10.44,2;10.711,1;10.977,2;11.556,3;12.008,1;13.588,3;14.013,2;14.495,1;14.946,2;16.003,3;16.395,2;16.546,1;17.48,3;17.85,2;18.001,1;19.026,2;19.508,3;19.96,2;20.412,1;20.955,2;22.01,3;22.252,2;22.432,2;22.673,1;23.518,3;23.788,2;24.029,1;25.024,3;25.506,2;26.019,1;26.531,2;27.043,3;28.038,3;28.52,2;28.972,1;29.454,2;29.967,3;30.51,2;31.022,3;31.474,2;31.956,3;32.408,2;32.89,3;33.433,2;34.006,3;34.398,2;34.518,1;35.453,3;35.875,2;36.026,1;37.111,2;37.504,3;38.016,1;38.529,3;38.981,2;39.524,3;40.007,2;40.459,1;40.971,2;41.483,3;41.936,2;42.448,1;42.992,2;43.444,3;43.956,2;44.378,3;44.92,2;45.945,3;46.337,2;46.488,1;47.513,3;47.875,2;47.995,1;49.141,2;49.533,3;50.045,2;50.557,1;51.039,2;51.521,3;52.004,2;52.486,1;52.998,2;53.481,3;53.993,2;54.505,1;54.988,2;55.44,3;55.952,2;56.434,3;56.916,2;57.429,1;57.911,2;58.454,3;58.966,2;59.539,3;60.051,2;61.256,3;61.739,2;62.222,1;62.704,2;63.216,3;63.699,2;64.212,1;64.755,2;65.267,3;65.749,2;66.261,3;66.743,2;67.256,3;67.738,2;68.251,1;68.764,2;69.247,3;69.729,2;70.271,3;70.753,2;71.265,1;71.717,2;72.289,3;73.223,3;73.736,2;74.249,1;74.731,2;75.274,3;75.756,2;76.268,3;76.78,2;77.262,3;77.744,2;78.257,3;78.77,2;79.252,1;79.765,2;80.277,3;80.729,2;81.241,1;81.754,2;82.266,3;82.779,3;83.261,2;83.744,1;84.256,2;84.799,3;85.643,3;86.276,2;86.758,3;87.24,2;87.722,3;88.236,2;88.778,1;89.26,2;89.773,3;90.256,2;90.708,1;91.191,2;91.763,3;92.216,2;92.729,3;93.241,2;93.753,1;94.235,3;94.748,3;95.29,2;95.742,3;96.224,2;96.827,3;97.671,3;98.334,3;98.906,3;100.022,3;100.444,2;100.564,1;101.468,3;101.859,2;102.01,1;102.975,2;103.367,3;103.518,2;103.88,3;104.031,2;104.393,3;104.544,2;104.905,3;105.057,2;105.961,3;106.205,2;106.416,2;106.657,1;106.928,2;107.169,3;107.441,2;107.712,1;107.984,3;108.527,2;109.009,1;109.401,2;109.521,3;110.034,2;110.546,3;111.029,2;111.964,3;112.084,2;112.265,1;112.416,2;112.988,3;113.501,3;113.892,2;114.043,1;114.525,2;115.037,3;115.399,2;115.55,1;115.852,3;116.002,2;116.365,3;116.485,2;116.847,3;116.998,2;117.963,3;118.354,2;118.506,1;119.503,3;119.865,2;120.015,1;";
audiogame.dots = [];
audiogame.startingTime = 0;
audiogame.dotImage = new Image();
audiogame.totalDotsCount = 0;
audiogame.totalSuccessCount = 0;
audiogame.continueSuccessCount = 0;
audiogame.maxContinueSuccessCount = 0;

function MusicNode(time,line){
	this.time = time;
	this.line = line;
	this.isAdded = false;
}

function Dot(time, distance,line){
	this.time = time;
	this.distance = distance;
	this.line = line;
	/*
	0:新加入的
	1:位于可点击区域
	2：已被点击
	3：位于可点击区域之外
	4: 位于画布之外
	*/
	this.state = 0;
}

function drawBackground(){
	var game = audiogame.canvas[0];
	var ctx = audiogame.ctxs[0];
	
	ctx.lineWidth = 10;
	ctx.strokeStyle = "#000";
	
	var center = game.width/2;
	
	ctx.beginPath();
	ctx.moveTo(center-100,50);
	ctx.lineTo(center-100,game.height - 50);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(center,50);
	ctx.lineTo(center,game.height - 50);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(center+100,50);
	ctx.lineTo(center+100,game.height - 50);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(center-150,game.height - 80);
	ctx.lineTo(center+150,game.height - 80);
	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgba(50,50,50,0.8)";
	ctx.stroke();
}

function setupLevelData(){
	var notes = audiogame.leveldata.split(";");
	audiogame.totalDotsCount = notes.length;
	for(var i in notes){
		var note = notes[i].split(",");
		var time = parseFloat(note[0]);
		var line = parseInt(note[1]);
		var musicNote = new MusicNode(time,line);
		audiogame.musicNotes.push(musicNote);
	}
}

function startGame(){
	var date = new Date();
	audiogame.startingTime = date.getTime();
	setTimeout(playMusic,3550);
}

function endGame(){
	audiogame.startGame = 0;
	audiogame.melody.currentTime = 0;
	audiogame.melody.pause();
	audiogame.base.currentTime = 0;
	audiogame.base.pause();
	if(audiogame.gameloop!=null){
		clearInterval(audiogame.gameloop);
	}
	
}

function playMusic(){
	audiogame.melody.play();
	audiogame.base.play();
}

function drawUI(){
	var canvas = audiogame.canvas[2];
	var ctx = audiogame.ctxs[2];
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.font = "45px 'CaiYunHanMaoBi-1ca6ec413e209d2'";
	ctx.fillStyle = "#ffffff";
	
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("hitCount: " + audiogame.continueSuccessCount,30,ctx.canvas.height-45);
}

function gameloop(){
	if(audiogame.frameCount==0){
		drawBackground();
	}
	var canvas = audiogame.canvas[1];
	var ctx = audiogame.ctxs[1];
	//加入新的音乐点
	if(audiogame.startingTime != 0){
		var date = new Date();
        var elapsedTime = (date.getTime() - audiogame.startingTime)/1000;
		for(var i  in audiogame.musicNotes){
			var note = audiogame.musicNotes[i];
			if(elapsedTime >= note.time && (audiogame.dots.length == 0 || note.time > audiogame.dots[audiogame.dots.length-1].time)){
				var dot = new Dot(note.time,canvas.height - 150,note.line);
				audiogame.dots.push(dot);
			}
		}
	}
	//移动音乐点
	for(var i in audiogame.dots){
		audiogame.dots[i].distance -= 2.5;
	}
	//更新音乐点的状态
	for(var i in audiogame.dots){
		var dot = audiogame.dots[i];
		if(dot.state == 0){
			if(Math.abs(dot.distance) < 20){
				dot.state = 1;
			}
		}else if(dot.state == 1){
			if(audiogame.dots[i].distance <= -20){
				audiogame.continueSuccessCount = 0;
				dot.state = 3;
			}
		}else if(dot.state == 3){
			if(audiogame.dots[i].distance <= -30){
				dot.state = 4;
			}
		}
		audiogame.dots[i] = dot;
	}
	//删除画布之外的音乐点
	while(true){
		if(audiogame.dots.length == 0)
			break;
		var dot = audiogame.dots[0];
		if(dot.state == 4){
		    audiogame.dots.splice(0,1);
		}else{
			break;
		}
	}
	ctx.clearRect(0,0,canvas.width,canvas.height);
	var circle_gradient = ctx.createRadialGradient(-3,-3,1,0,0,20);
    circle_gradient.addColorStop(0,"#fff");
	circle_gradient.addColorStop(1,"#cc0");
	ctx.fillStyle = circle_gradient;
	//绘制音乐点
	for(var i in audiogame.dots){
		var dot = audiogame.dots[i];

		ctx.save();
		var center = canvas.width/2;
		
		var x = center;
		if(dot.line == 1){
			x -= 100;
		}else if(dot.line == 3){
			x += 100;
		}
		var y = canvas.height - 80 - dot.distance;
		
		ctx.translate(x,y);
		ctx.drawImage(audiogame.dotImage,-audiogame.dotImage.width/2,-audiogame.dotImage.height/2);
		ctx.restore();
		
	}
	drawUI();
	audiogame.frameCount++;
}

function onMelodyEnded(){
	console.log("song ended");
	console.log("maxContinueSuccessCount:"+audiogame.maxContinueSuccessCount);
	console.log("totalDotsCount:"+audiogame.totalDotsCount+" totalSuccessCount:"+audiogame.totalSuccessCount + " successRate:"+audiogame.totalSuccessCount/audiogame.totalDotsCount);
    $("#game-scene").removeClass('show-scene');
	$("#result-scene").addClass('show-scene');
    endGame();
}

jQuery(document).ready(function(){
	audiogame.melody = document.getElementById("melody");
	audiogame.base = document.getElementById("base");
	audiogame.dotImage.src = "images/dot.png";
	audiogame.buttonoverSound = document.getElementById("buttonover");
	audiogame.buttonoverSound.volume = 0.3;
	audiogame.buttonActiveSound = document.getElementById("buttonactive");
	audiogame.buttonActiveSound.volume = 0.3;
	audiogame.canvas[0] = document.getElementById("game-background-canvas");
	audiogame.ctxs[0] = audiogame.canvas[0].getContext('2d');
	audiogame.canvas[1] = document.getElementById("game-canvas");
	audiogame.ctxs[1] = audiogame.canvas[1].getContext('2d');
	audiogame.canvas[2] = document.getElementById("ui-canvas");
	audiogame.ctxs[2] = audiogame.canvas[2].getContext('2d');
	
	$("a[href='#game']").hover(
	function(){
	   audiogame.buttonoverSound.currentTime = 0;
       audiogame.buttonoverSound.play();	   
	},
	function(){
		audiogame.buttonoverSound.pause();
	});
	
	$("a[href='#game']").click(function(){
		audiogame.buttonActiveSound.currentTime = 0;
		audiogame.buttonActiveSound.play();
		
		$("#game-scene").addClass('show-scene');
		startGame();
		return false;
	});
	$(document).keydown(function(e){
		var line = e.which - 73;
		$('#hit-line-'+line).removeClass("hide");
		$('#hit-line-'+line).addClass("show");
		
		var hitLine = e.which - 73;
		var isHit = false;
		for(var i in audiogame.dots){
			if(hitLine == audiogame.dots[i].line && audiogame.dots[i].state == 1){
				audiogame.totalSuccessCount++;
				audiogame.continueSuccessCount++;
				if(audiogame.continueSuccessCount>audiogame.maxContinueSuccessCount){
					audiogame.maxContinueSuccessCount = audiogame.continueSuccessCount;
				}
				audiogame.dots.splice(i,1);
				isHit = true;
			}
		}
		if(!isHit){
			audiogame.continueSuccessCount = 0;
		}
	});
	$(document).keyup(function(e){
		var line = e.which - 73;
		$('#hit-line-'+line).removeClass("show");
		$('#hit-line-'+line).addClass("hide");
	});
	$(audiogame.melody).bind('ended',onMelodyEnded);
	setupLevelData();
	audiogame.gameloop = setInterval(gameloop,30);
	//startGame();
});



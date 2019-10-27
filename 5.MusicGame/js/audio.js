var audiogame = {}
audiogame.musicNotes = [];
audiogame.leveldata = "1.592,3;1.984,2;2.466,1;2.949,2;4.022,3";
audiogame.dots = [];
audiogame.startingTime = 0;
audiogame.dotImage = new Image();

function MusicNode(time,line){
	this.time = time;
	this.line = line;
}

function Dot(distance,line){
	this.distance = distance;
	this.line = line;
	this.missed = false;
}

function drawBackground(){
	var game = document.getElementById("game-background-canvas");
	var ctx = game.getContext('2d');
	
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

jQuery(document).ready(function(){
	audiogame.buttonoverSound = document.getElementById("buttonover");
	audiogame.buttonoverSound.volume = 0.3;
	audiogame.buttonActiveSound = document.getElementById("buttonactive");
	audiogame.buttonActiveSound.volume = 0.3;
	
	$("a[href='#game']").hover(
	function(){
	   audiogame.buttonoverSound.currentTime = 0;
       audiogame.buttonoverSound.play();	   
	},
	function(){
		audiogame.buttonoverSound.pause();
	});
	/*
	.click(function(){
		audiogame.buttonActiveSound.currentTime = 0;
		audiogame.buttonActiveSound.play();
		return false;
	});
	*/
	drawBackground();
});
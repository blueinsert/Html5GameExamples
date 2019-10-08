var KEY = {
	UP:38,
	DOWN:40,
	W:87,
	S:83
}

var pingpong = {
	scoreA:0,
	scoreB:0,
}
pingpong.pressedKeys = []
pingpong.ball = {
	x:150,
	y:100,
	speedX: 3,
	speedY:3,
	radius:10
}
pingpong.paddleA = {
    speedY:0,	
}
pingpong.paddleB = {
    speedY:0,	
}

jQuery(document).ready(function(){
	pingpong.timer = setInterval(gameloop,30);
	jQuery(document).keydown(function(e){
		pingpong.pressedKeys[e.which] = true;
	});
	jQuery(document).keyup(function(e){
		pingpong.pressedKeys[e.which] = false;
	});
});

function gameloop() {
	movePaddlles();
	moveBall();
}

function movePaddlles(){
	pingpong.paddleA.speedY = 0;
	pingpong.paddleB.speedY = 0;
	if (pingpong.pressedKeys[KEY.UP]){
		var top = parseInt(jQuery("#paddleB").css("top"));
	    jQuery("#paddleB").css("top",top-5);
		pingpong.paddleB.speedY = -5;
	}
	if (pingpong.pressedKeys[KEY.DOWN]){
		var top = parseInt(jQuery("#paddleB").css("top"));
		jQuery("#paddleB").css("top",top+5);
		pingpong.paddleB.speedY = 5;
	}
	if (pingpong.pressedKeys[KEY.W]){
		var top = parseInt(jQuery("#paddleA").css("top"));
		jQuery("#paddleA").css("top",top-5);
		pingpong.paddleA.speedY = -5;
	}
	if (pingpong.pressedKeys[KEY.S]){
		var top = parseInt(jQuery("#paddleA").css("top"));
		jQuery("#paddleA").css("top",top+5);
		pingpong.paddleA.speedY = 5;
	}
}

function moveBall(){
	var playgroundHeight = parseInt(jQuery("#playground").height());
	var playgroundWidth = parseInt(jQuery("#playground").width());
	var ball = pingpong.ball;
	//检测与球台的碰撞
	var nextY = ball.y + ball.speedY;
	var nextX = ball.x + ball.speedX;
	//与上下平面碰撞
	if(nextY + ball.radius*2 > playgroundHeight || nextY < 0){
		ball.speedY = -ball.speedY;
	}
	//碰到左右边缘的时候决定输赢
	if(nextX + ball.radius*2 > playgroundWidth){
		ball.x = 250;
		ball.y = 100;
		ball.speedX = -3;
		ball.speedY = 0;
		pingpong.scoreA++;
		jQuery("#scoreA").html(pingpong.scoreA);
	}
	if(nextX < 0){
		ball.x = 250;
		ball.y = 100;
		ball.speedX = 3;
		ball.speedY = 0;
		pingpong.scoreB++;
		jQuery("#scoreB").html(pingpong.scoreB);
	}
	
	//检测与球拍的碰撞
	//检测左边球拍
	var paddleAX = parseInt(jQuery("#paddleA").css("left")) + parseInt(jQuery("#paddleA").css("width"));
	var paddleAYBottom = parseInt(jQuery("#paddleA").css("top")) + parseInt(jQuery("#paddleA").css("height"));
	var paddleAYTop = parseInt(jQuery("#paddleA").css("top"));
	if(nextX < paddleAX){
		if(nextY+ball.radius >= paddleAYTop && nextY+ball.radius <= paddleAYBottom){
			ball.speedX = -ball.speedX;
			ball.speedY += pingpong.paddleA.speedY*1;
		}
	}
	//检测右边球拍
	var paddleBX = parseInt(jQuery("#paddleB").css("left"));
	var paddleBYBottom = parseInt(jQuery("#paddleB").css("top")) + parseInt(jQuery("#paddleB").css("height"));
	var paddleBYTop = parseInt(jQuery("#paddleB").css("top"));
	if(nextX+ball.radius*2 > paddleBX){
		if(nextY+ball.radius >= paddleBYTop && nextY+ball.radius <= paddleBYBottom){
			ball.speedX = -ball.speedX;
			ball.speedY += pingpong.paddleB.speedY*1;
		}
	}
	
	ball.x += ball.speedX;
	ball.y += ball.speedY;
	jQuery("#ball").css({
		"left":ball.x,
		"top":ball.y
	});
}
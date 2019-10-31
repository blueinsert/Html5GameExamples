var carGame = {
	STATE_STARTING_SCREEN:1,
	STATE_PLAYING:2,
	STATE_GAMEOVER_SCREEN:3,
	state:0,
	fuel:0,
	fuelMax:0,
	currentLevel:0
}
carGame.levels = new Array();
carGame.levels[0] = [{"type":"car","x":50,"y":210,"fuel":12},
{"type":"box","x":250, "y":270, "width":250, "height":25, "rotation":0},
{"type":"box","x":500,"y":250,"width":65,"height":15,"rotation":-10},
{"type":"box","x":600,"y":225,"width":80,"height":15,"rotation":-20},
{"type":"box","x":950,"y":225,"width":80,"height":15,"rotation":20},
{"type":"box","x":1100,"y":250,"width":100,"height":15,"rotation":0},
{"type":"win","x":1200,"y":215,"width":15,"height":25,"rotation":0}];

carGame.levels[1] = [{"type":"car","x":50,"y":310,"fuel":20},
{"type":"box","x":250, "y":370, "width":250, "height":25, "rotation":0},
{"type":"box","x":500,"y":350,"width":65,"height":15,"rotation":-10},
{"type":"box","x":600,"y":325,"width":80,"height":15,"rotation":-20},
{"type":"box","x":666,"y":285,"width":80,"height":15,"rotation":-32},
{"type":"box","x":950,"y":225,"width":80,"height":15,"rotation":15},
{"type":"box","x":1100,"y":250,"width":100,"height":15,"rotation":0},
{"type":"win","x":1200,"y":215,"width":15,"height":25,"rotation":0}];

carGame.levels[2] = [{"type":"car","x":50,"y":310,"fuel":50},
{"type":"box","x":150, "y":370, "width":150, "height":25, "rotation":0},
{"type":"box","x":300,"y":356,"width":25,"height":15,"rotation":-10},
{"type":"box","x":500,"y":350,"width":65,"height":15,"rotation":-10},
{"type":"box","x":600,"y":325,"width":80,"height":15,"rotation":-20},
{"type":"box","x":666,"y":285,"width":80,"height":15,"rotation":-32},
{"type":"box","x":950,"y":225,"width":80,"height":15,"rotation":10},
{"type":"box","x":1100,"y":250,"width":100,"height":15,"rotation":0},
{"type":"win","x":1200,"y":215,"width":15,"height":25,"rotation":0}];

carGame.levels[3] = [{"type":"car","x":50,"y":210,"fuel":20},
{"type":"box","x":100, "y":270, "width":190, "height":15, "rotation":20},
{"type":"box","x":380, "y":320, "width":100, "height":15, "rotation":-10},
{"type":"box","x":666,"y":285,"width":80,"height":15,"rotation":-32},
{"type":"box","x":950,"y":295,"width":80,"height":15,"rotation":20},
{"type":"box","x":1100,"y":310,"width":100,"height":15,"rotation":0},
{"type":"win","x":1200,"y":275,"width":15,"height":25,"rotation":0}];

carGame.levels[4] = [{"type":"car","x":50,"y":210,"fuel":20},
{"type":"box","x":100, "y":270, "width":190, "height":15, "rotation":20},
{"type":"box","x":380, "y":320, "width":100, "height":15, "rotation":-10},
{"type":"box","x":686,"y":285,"width":80,"height":15,"rotation":-32},
{"type":"box","x":250,"y":495,"width":80,"height":15,"rotation":40},
{"type":"box","x":500,"y":540,"width":200,"height":15,"rotation":0},
{"type":"win","x":220,"y":425,"width":15,"height":25,"rotation":23}];

var canvas;
var ctx;
var canvasWidth;
var canvasHeight;

function createWheel(world,x,y){
	var ballSd = new b2CircleDef();
	ballSd.density = 1.0;
	ballSd.radius = 10;
	ballSd.restitution = 0.1;
	ballSd.friction = 4.3;
	ballSd.userData = document.getElementById('wheel');
	var ballBd = new b2BodyDef();
	ballBd.AddShape(ballSd);
	ballBd.position.Set(x,y);
	return world.CreateBody(ballBd);
}

function createCarAt(x,y){
	//车身
	var boxSd = new b2BoxDef();
	boxSd.density = 1.0;
	boxSd.friction = 1.5;
	boxSd.restitution = 0.4;
	boxSd.extents.Set(40,20);
	boxSd.userData = document.getElementById('bus');
	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(x,y);
	var carBody = carGame.world.CreateBody(boxBd);
	//车轮
	var wheelBody1 = createWheel(carGame.world,x-25,y+20);
	var wheelBody2 = createWheel(carGame.world,x+25,y+20);
	
	//链接
	var jointDef = new b2RevoluteJointDef();
	jointDef.anchorPoint.Set(x-25,y+20);
	jointDef.body1 = carBody;
	jointDef.body2 = wheelBody1;
	carGame.world.CreateJoint(jointDef);
	var jointDef2 = new b2RevoluteJointDef();
	jointDef2.anchorPoint.Set(x+25,y+20);
	jointDef2.body1 = carBody;
	jointDef2.body2 = wheelBody2;
	carGame.world.CreateJoint(jointDef2);
	
	return carBody;
}

function createGround(x,y,width,height,rotation,type){
	var groundSd = new b2BoxDef();
	groundSd.extents.Set(width,height);
	groundSd.restitution = 0.4;
	if(type == "win"){
		groundSd.userData = document.getElementById('flag');
	}
	var groundBd = new b2BodyDef();
	groundBd.AddShape(groundSd);
	groundBd.position.Set(x,y);
	groundBd.rotation = rotation*Math.PI/180;
	var body = carGame.world.CreateBody(groundBd);
	return body;
}

function createWorld(){
	var worldAABB = new b2AABB();
	worldAABB.minVertex.Set(-4000,-4000);
	worldAABB.maxVertex.Set(4000,4000);
	var gravity = new b2Vec2(0,300);
	var doSleep = false;
	var world = new b2World(worldAABB,gravity,doSleep);
	return world;
}

function drawShape(shape, context){
	context.strokeStyle = '#003300';
	context.beginPath();
	switch(shape.m_type){
		case b2Shape.e_circleShape:
		    var circle = shape;
			var pos = circle.m_position;
			var r = circle.m_radius;
			var segments = 16.0;
			var theta = 0.0;
			var dtheta = 2.0*Math.PI/segments;
			context.moveTo(pos.x + r,pos.y);
			for(var i = 0;i<segments;i++){
				var d = new b2Vec2(r*Math.cos(theta),r*Math.sin(theta));
				var v = b2Math.AddVV(pos,d);
				context.lineTo(v.x,v.y);
				theta+=dtheta;
			}
			context.lineTo(pos.x+r,pos.y); 
			
			context.moveTo(pos.x,pos.y);
			var ax = circle.m_R.col1;
			var pos2 = new b2Vec2(pos.x+r*ax.y,pos.y+r*ax.y);
			context.lineTo(pos2.x,pos2.y);
		    break;
		case b2Shape.e_polyShape:
		    var poly = shape;
			var tv = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R,poly.m_vertices[0]));
			context.moveTo(tv.x,tv.y);
			for(var i = 0;i<poly.m_vertexCount;i++){
				var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R,poly.m_vertices[i]));
				context.lineTo(v.x,v.y);
			}
			context.lineTo(tv.x,tv.y);
		    break;
	}
	context.stroke();
}

function drawWorld(world,context){
	for(var b = world.m_bodyList;b!=null;b=b.m_next){
		for(var s = b.GetShapeList();s!=null;s=s.GetNext()){
			if(s.GetUserData()!=undefined){
				var img = s.GetUserData();
				var x = s.GetPosition().x;
				var y = s.GetPosition().y;
				var topLeftX = -$(img).width()/2;
				var topLeftY = -$(img).height()/2;
				context.save();
				context.translate(x,y);
				context.rotate(s.GetBody().GetRotation());
				context.drawImage(img,topLeftX,topLeftY);
				context.restore();
			}else{
				//drawShape(s,context);
			}
		}
	}
}

function step(){
	carGame.world.Step(1.0/60,1);
	ctx.clearRect(0,0,canvasWidth,canvasHeight);
	drawWorld(carGame.world,ctx);
	for(var cn = carGame.world.GetContactList();cn!=null;cn=cn.GetNext()){
		var body1 = cn.GetShape1().GetBody();
		var body2 = cn.GetShape2().GetBody();
		if((body1 == carGame.car && body2 == carGame.gameWinWall) ||
		   (body1 == carGame.gameWinWall && body2 == carGame.car)){
			   console.log("level passed");
			   if(carGame.currentLevel<4){
				   restartGame(carGame.currentLevel+1);
			   }else{
				   $("#game").removeClass().addClass("gamebg_won");
				   carGame.state = carGame.STATE_GAMEOVER_SCREEN;
				   carGame.world = createWorld();
			   }
		}
		//是否失败
		if((body1 == carGame.car && body2 == carGame.deadWall) ||
		   (body1 == carGame.deadWall && body2 == carGame.car)){
			   console.log("level failed");
			   restartGame(carGame.currentLevel);
		}
	}
	setTimeout(step,10);
}

function restartGame(level){
	carGame.currentLevel = level;
	carGame.world = createWorld();
	var levelData = carGame.levels[level];
	for(var i = 0;i<levelData.length;i++){
		var obj = levelData[i];
		if(obj.type == "car"){
			carGame.car = createCarAt(obj.x,obj.y);
			carGame.fuel = obj.fuel;
			carGame.fuelMax = obj.fuel;
			$(".fuel-value").width('100%');
		}else if(obj.type == "box"){
			createGround(obj.x,obj.y,obj.width,obj.height,obj.rotation,obj.type);
		}else if(obj.type == "win"){
			carGame.gameWinWall = createGround(obj.x,obj.y,obj.width,obj.height,obj.rotation,obj.type);
		}
	}
	
	carGame.deadWall = createGround(0,1000,10000,20,0);
	
	//切换背景图片
	$("#level").html("Level "+(level+1));
	$("#game").removeClass().addClass("gamebg_level"+level);
}

jQuery(document).ready(function(){
	canvas = document.getElementById('game');
	ctx = canvas.getContext('2d');
	canvasWidth = parseInt(canvas.width);
	canvasHeight = parseInt(canvas.height);
	carGame.state = carGame.STATE_STARTING_SCREEN;
	
	$("#game").click(function(){
		if(carGame.state == carGame.STATE_STARTING_SCREEN){
			carGame.state = carGame.STATE_PLAYING;
			restartGame(carGame.currentLevel);
			step();
		}
	});
	$(document).keydown(function(e){
		switch(e.keyCode){
			case 88:
			    if(carGame.fuel>0){
			        var force = new b2Vec2(10000000,0);
				    carGame.car.ApplyForce(force,carGame.car.GetCenterPosition());
					carGame.fuel--;
					$(".fuel-value").width(carGame.fuel/carGame.fuelMax*100+'%');
				}
			    break;
			case 90:
			    if(carGame.fuel>0){
			        var force = new b2Vec2(-10000000,0);
				    carGame.car.ApplyForce(force,carGame.car.GetCenterPosition());
				    carGame.fuel--;
					$(".fuel-value").width(carGame.fuel/carGame.fuelMax*100+'%');
				}
			    break;
			case 82:
			    restartGame(carGame.currentLevel);
				break;
		}
	})
})
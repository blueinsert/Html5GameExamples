var matchingGame = {};
matchingGame.elapsedTime = 0;
matchingGame.deck = [
	'cardAK', 'cardAK',
	'cardAQ', 'cardAQ',
	'cardAJ', 'cardAJ',
	'cardBK', 'cardBK',
	'cardBQ', 'cardBQ',
	'cardBJ', 'cardBJ',
];
matchingGame.savingObject = {};
matchingGame.savingObject.deck = [];
matchingGame.savingObject.removedCards = [];
matchingGame.savingObject.currentElapsedTime = 0;

function shuffle(){
	return 0.5 - Math.random();
}

function selectCard(){
	if($(".card-flipped").length >= 2){
		return;
	}
	$(this).addClass("card-flipped");
	if($(".card-flipped").length == 2){
		setTimeout(checkPattern,700);
	}
}

function checkPattern(){
	if(isMatchPattern()){
		$(".card-flipped").removeClass("card-flipped").addClass("card-removed");
		$(".card-removed").bind("webkitTransitionEnd",removeTookCards);
	}else{
		$(".card-flipped").removeClass("card-flipped");
	}
}

function isMatchPattern(){
	var cards = $(".card-flipped");
	var pattern = $(cards[0]).data("pattern");
	var pattern2 = $(cards[1]).data("pattern");
	return (pattern == pattern2);
}

function removeTookCards(){
	$(".card-removed").each(function(){
		matchingGame.savingObject.removedCards.push($(this).data("card-index"));
		$(this).remove();
	});
	if($(".card").length == 0){
		gameover();
	}
}

function gameover(){
	clearInterval(matchingGame.timer);
	localStorage.removeItem("savingObject");
	$(".score").html($("#elapsed-time").html());
	//查询上次成绩
	var lastScore = localStorage.getItem("last-score");
	var lastScoreObj = JSON.parse(lastScore);
	if(lastScoreObj==null){
		lastScoreObj = {"savedTime":"no record","score":0};
	}
	//显示上次成绩
	var lastElapsedTime = lastScoreObj.score;
	var minute = Math.floor(lastElapsedTime/60);
	var second = lastElapsedTime%60;
	if(minute<10)
		minute+="0"+minute;
	if(second<10)
		second="0"+second;
	$(".highest-score").html(minute+":"+second);
	//显示上次成绩保存时间
	var savedTime = lastScoreObj.savedTime;
	$(".saved-time").html(savedTime);
	
	//保存这次成绩
	if(matchingGame.elapsedTime<lastElapsedTime || lastElapsedTime==0){
	    var currentTime = new Date();
	    var month = currentTime.getMonth() + 1;
	    var day = currentTime.getDate();
	    var year = currentTime.getFullYear();
	    var hours = currentTime.getHours();
	    var minutes = currentTime.getMinutes();
	    if(minutes<10)
		    minutes = "0" + minutes;
	    var seconds = currentTime.getSeconds();
	    if(seconds<10)
		    seconds = "0"+seconds;
	    var now = day+"/"+month+"/"+year+" "+hours+":"+minutes+":"+seconds;
	    var obj = {"savedTime":now,"score":matchingGame.elapsedTime};
	    localStorage.setItem("last-score",JSON.stringify(obj));
		$(".ribbon").removeClass("hide");
	}
	
	//显示结束弹出框
	$("#popup").removeClass("hide");
	
}

function countTimer(){
	matchingGame.elapsedTime++;
	var minute = Math.floor(matchingGame.elapsedTime/60);
	var second = matchingGame.elapsedTime%60;
	if(minute<10)
		minute = "0"+minute;
	if(second<10)
		second = "0"+second;
	$("#elapsed-time").html(minute+":"+second);
	
	matchingGame.savingObject.currentElapsedTime = matchingGame.elapsedTime;
	saveSavingObject();
}

function saveSavingObject(){
	localStorage["savingObject"] = JSON.stringify(matchingGame.savingObject);
}

function getSavingObject(){
	var savingObject = localStorage["savingObject"];
	if(savingObject != undefined){
		savingObject = JSON.parse(savingObject);
	}
	return savingObject;
}

jQuery(document).ready(function(){
	matchingGame.deck.sort(shuffle);
	var savedObject = getSavingObject();
	if(savedObject!=undefined){
		matchingGame.deck = savedObject.deck;
	}
	matchingGame.savingObject.deck = matchingGame.deck.slice();
	
	for(var i=1;i<=11;i++){
		jQuery(".card:first-child").clone().appendTo("#cards");
	}
	jQuery("#cards").children().each(function(index){
		jQuery(this).css({
			"left": ($(this).width()+20)*(index%4),
			"top": ($(this).height()+20)*Math.floor(index/4)
		});
		var pattern = matchingGame.deck.pop();
		$(this).find(".back").addClass(pattern);
		$(this).attr("data-pattern",pattern);
		$(this).attr("data-card-index",index);
		$(this).click(selectCard);
	});
	//移除savedObject中已移除的牌
	if(savedObject!=undefined){
		matchingGame.savingObject.removedCards = savedObject.removedCards;
		for(var i in matchingGame.savingObject.removedCards){
			$(".card[data-card-index="+matchingGame.savingObject.removedCards[i]+"]").remove();
		}
	}
	matchingGame.elapsedTime = 0;
	if(savedObject!=undefined){
		matchingGame.elapsedTime = savedObject.currentElapsedTime;
		matchingGame.savingObject.currentElapsedTime = savedObject.currentElapsedTime;
	}
	matchingGame.timer = setInterval(countTimer,1000);
})
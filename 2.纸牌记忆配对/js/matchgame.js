var matchingGame = {};

matchingGame.deck = [
	'cardAK', 'cardAK',
	'cardAQ', 'cardAQ',
	'cardAJ', 'cardAJ',
	'cardBK', 'cardBK',
	'cardBQ', 'cardBQ',
	'cardBJ', 'cardBJ',
];

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
	$(".card-removed").remove();
}

jQuery(document).ready(function(){
	matchingGame.deck.sort(shuffle);
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
		$(this).click(selectCard);
	});
})